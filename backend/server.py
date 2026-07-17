from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from pathlib import Path
from datetime import datetime, timezone
import os
import logging
import uuid
import json
import urllib.error
import urllib.parse
import urllib.request

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Sanity — leads are mirrored here so staff manage them in the Studio
# "Appointments" dashboard. Best-effort: a Sanity outage never blocks a form.
SANITY_PROJECT_ID = os.environ.get("SANITY_PROJECT_ID") or os.environ.get("SANITY_STUDIO_PROJECT_ID") or "3goot0bo"
SANITY_DATASET = os.environ.get("SANITY_DATASET") or os.environ.get("SANITY_STUDIO_DATASET") or "production"
SANITY_TOKEN = os.environ.get("SANITY_TOKEN") or os.environ.get("SANITY_WRITE_TOKEN") or ""


def _sanity_mutate(doc: dict, label: str) -> dict:
    if not SANITY_TOKEN:
        raise HTTPException(status_code=500, detail=f"Sanity {label} sync is not configured")

    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/mutate/{SANITY_DATASET}"
    payload = json.dumps({"mutations": [{"createOrReplace": doc}]}).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=payload,
        headers={"Authorization": f"Bearer {SANITY_TOKEN}", "Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            body = response.read().decode("utf-8")
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        logging.warning("Sanity %s sync failed (%s): %s", label, e.code, body)
        raise HTTPException(status_code=502, detail=f"Sanity {label} sync failed")
    except Exception as e:
        logging.warning("Sanity %s sync failed: %s", label, e)
        raise HTTPException(status_code=502, detail=f"Sanity {label} sync failed")


def _sanity_query(query: str) -> dict:
    url = f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/query/{SANITY_DATASET}?query={urllib.parse.quote(query)}"
    request = urllib.request.Request(url, headers={"Authorization": f"Bearer {SANITY_TOKEN}"} if SANITY_TOKEN else {})
    try:
        with urllib.request.urlopen(request, timeout=10) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8")
        logging.warning("Sanity query failed (%s): %s", e.code, body)
        raise HTTPException(status_code=502, detail="Sanity query failed")


def _sanity_config_status() -> dict:
    return {
        "project_id": SANITY_PROJECT_ID,
        "dataset": SANITY_DATASET,
        "token_configured": bool(SANITY_TOKEN),
        "mutate_url": f"https://{SANITY_PROJECT_ID}.api.sanity.io/v2023-05-03/data/mutate/{SANITY_DATASET}",
    }


def _sync_appointment_to_sanity(booking: "Booking") -> None:
    doc = {
        "_id": f"appointment-{booking.id}",
        "_type": "appointment",
        "name": booking.name,
        "phone": booking.phone,
        "email": booking.email,
        "treatmentName": booking.treatment_name,
        "category": booking.category,
        "preferredDate": booking.date,
        "preferredTime": booking.time_slot,
        "note": booking.note,
        "status": booking.status or "new",
        "source": "booking-modal",
        "createdAt": booking.created_at,
    }
    _sanity_mutate(doc, "appointment")


def _sync_callback_to_sanity(callback: "Callback") -> None:
    doc = {
        "_id": f"appointment-callback-{callback.id}",
        "_type": "appointment",
        "name": callback.name,
        "phone": callback.phone,
        "treatmentName": "Callback request",
        "category": "Contact",
        "note": callback.concern,
        "status": callback.status or "new",
        "source": "contact-page",
        "createdAt": callback.created_at,
    }
    _sanity_mutate(doc, "callback")


app = FastAPI(title="Artham Aesthetique API")
api = APIRouter(prefix="/api")


def _now():
    return datetime.now(timezone.utc).isoformat()


# ---------------- Models ----------------
class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    treatment_slug: str
    treatment_name: str
    category: str
    doctor: str = "Dr. Omaima Jawed"
    date: str
    time_slot: str
    name: str
    phone: str
    email: Optional[str] = None
    note: Optional[str] = None
    created_at: str = Field(default_factory=_now)
    status: str = "new"


class BookingCreate(BaseModel):
    treatment_slug: str
    treatment_name: str
    category: str
    date: str
    time_slot: str
    name: str
    phone: str
    email: Optional[str] = None
    note: Optional[str] = None


class NewsletterSub(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    created_at: str = Field(default_factory=_now)


class NewsletterCreate(BaseModel):
    email: EmailStr


class Callback(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    concern: Optional[str] = None
    created_at: str = Field(default_factory=_now)
    status: str = "new"


class CallbackCreate(BaseModel):
    name: str
    phone: str
    concern: Optional[str] = None


# ---------------- Endpoints ----------------
@api.get("/")
async def root():
    return {"ok": True, "service": "Artham Aesthetique"}


@api.get("/sanity/status")
async def sanity_status():
    return _sanity_config_status()


@api.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    booking = Booking(**payload.model_dump())
    _sync_appointment_to_sanity(booking)
    return booking


@api.get("/bookings", response_model=List[Booking])
async def list_bookings():
    query = """*[_type == "appointment" && source == "booking-modal"]|order(createdAt desc)[0...500]{
      _id,
      "treatment_slug": "",
      "treatment_name": treatmentName,
      category,
      "doctor": "Dr. Omaima Jawed",
      "date": preferredDate,
      "time_slot": preferredTime,
      name,
      phone,
      email,
      note,
      "created_at": createdAt,
      status
    }"""
    return [
        {**doc, "id": doc.get("_id", "").replace("appointment-", "")}
        for doc in _sanity_query(query).get("result", [])
    ]


@api.post("/newsletter", response_model=NewsletterSub)
async def subscribe_newsletter(payload: NewsletterCreate):
    return NewsletterSub(email=payload.email)


@api.post("/callbacks", response_model=Callback)
async def create_callback(payload: CallbackCreate):
    cb = Callback(**payload.model_dump())
    _sync_callback_to_sanity(cb)
    return cb


app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)
