from fastapi import FastAPI, APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from pathlib import Path
from datetime import datetime, timezone
import os
import logging
import uuid
import json

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# Mongo
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

# Emergent LLM
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

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


class ChatIn(BaseModel):
    session_id: str
    message: str


# ---------------- Endpoints ----------------
@api.get("/")
async def root():
    return {"ok": True, "service": "Artham Aesthetique"}


@api.post("/bookings", response_model=Booking)
async def create_booking(payload: BookingCreate):
    booking = Booking(**payload.model_dump())
    await db.bookings.insert_one(booking.model_dump())
    return booking


@api.get("/bookings", response_model=List[Booking])
async def list_bookings():
    docs = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return docs


@api.post("/newsletter", response_model=NewsletterSub)
async def subscribe_newsletter(payload: NewsletterCreate):
    existing = await db.newsletter.find_one({"email": payload.email})
    if existing:
        existing.pop("_id", None)
        return existing
    sub = NewsletterSub(email=payload.email)
    await db.newsletter.insert_one(sub.model_dump())
    return sub


@api.post("/callbacks", response_model=Callback)
async def create_callback(payload: CallbackCreate):
    cb = Callback(**payload.model_dump())
    await db.callbacks.insert_one(cb.model_dump())
    return cb


# ---------------- Chatbot ----------------
CHAT_SYSTEM_PROMPT = """You are Aara, the warm, articulate concierge for Artham Aesthetique — a luxury dermatology and aesthetics clinic led by Dr. Omaima Jawed, located at Lotus Plaza, Sector 104, Noida.

Your tone: calm, editorial, unhurried — like a trusted friend who is also a knowledgeable clinic host. Keep replies short (2-4 short paragraphs max), use plain language, no medical jargon walls, no emojis.

You help guests with four things only:
1) Booking an appointment — always end by inviting them to open the 3-step booking flow (mention: 'you can tap Book Appointment anytime, or I can text you the link on WhatsApp: +91 98119 97993').
2) Treatment questions — explain in warm, human terms. Artham offers: Skin (HydraFacial, Chemical Peels, Acne, Micro Needling, Vampire/PRP, 4D ClearLift, PDRN Boosters), Anti-Ageing (Dermal Fillers, Mesobotox, HIFU, Morpheus8), Laser Hair Removal (Men & Women), Hair (Transplant, Hair Loss, Hair Patch), Body Contouring (CoolSculpting, Med Contour, Weight Loss), and Bridal packages.
3) Pricing enquiries — pricing is personalised after consultation; offer to arrange a free 15-minute consult with Dr. Omaima.
4) Human handoff — if unsure or asked, share WhatsApp +91 98119 97993 and clinic hours Mon–Sat 10am–8pm.

Never make medical claims. Never guarantee results. Never share prices as fixed numbers — always frame as 'starts from a consultation'. Never say 'delve', 'unlock', 'elevate your journey', or other AI clichés. Sound human.
"""


@api.post("/chat")
async def chat_endpoint(payload: ChatIn):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(500, "LLM key not configured")

    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone
    except Exception as e:
        raise HTTPException(500, f"LLM library unavailable: {e}")

    session_id = payload.session_id or str(uuid.uuid4())

    # persist inbound message
    await db.chat_messages.insert_one({
        "session_id": session_id,
        "role": "user",
        "content": payload.message,
        "created_at": _now(),
    })

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=CHAT_SYSTEM_PROMPT,
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    async def event_generator():
        buffer_parts = []
        try:
            async for ev in chat.stream_message(UserMessage(text=payload.message)):
                if isinstance(ev, TextDelta):
                    buffer_parts.append(ev.content)
                    yield f"data: {json.dumps({'delta': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
        finally:
            full = "".join(buffer_parts)
            if full:
                await db.chat_messages.insert_one({
                    "session_id": session_id,
                    "role": "assistant",
                    "content": full,
                    "created_at": _now(),
                })
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


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


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
