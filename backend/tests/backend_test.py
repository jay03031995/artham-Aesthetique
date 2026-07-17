"""Backend API tests for Artham Aesthetique."""
import os
import uuid
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://skin-soul-clinic.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


# ---------- Health ----------
def test_root():
    r = requests.get(f"{API}/", timeout=30)
    assert r.status_code == 200
    data = r.json()
    assert data.get("ok") is True
    assert data.get("service") == "Artham Aesthetique"


# ---------- Bookings ----------
def test_create_and_list_booking():
    payload = {
        "treatment_slug": "hydrafacial-treatment",
        "treatment_name": "HydraFacial",
        "category": "skin",
        "date": "2026-02-15",
        "time_slot": "11:00",
        "name": "TEST_User",
        "phone": "+919999999999",
        "email": "test_user@example.com",
        "note": "auto-test"
    }
    r = requests.post(f"{API}/bookings", json=payload, timeout=30)
    assert r.status_code == 200, r.text
    b = r.json()
    assert b["id"]
    assert b["status"] == "new"
    assert b["treatment_slug"] == payload["treatment_slug"]
    assert b["doctor"] == "Dr. Omaima Jawed"

    # verify via list
    r2 = requests.get(f"{API}/bookings", timeout=30)
    assert r2.status_code == 200
    ids = [x["id"] for x in r2.json()]
    assert b["id"] in ids


# ---------- Newsletter ----------
def test_newsletter_create():
    email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    r1 = requests.post(f"{API}/newsletter", json={"email": email}, timeout=30)
    assert r1.status_code == 200
    data = r1.json()
    assert data["id"]
    assert data["email"] == email


# ---------- Callback ----------
def test_callback_create():
    r = requests.post(f"{API}/callbacks", json={
        "name": "TEST_Callback",
        "phone": "+919111222333",
        "concern": "acne"
    }, timeout=30)
    assert r.status_code == 200
    assert r.json()["status"] == "new"
