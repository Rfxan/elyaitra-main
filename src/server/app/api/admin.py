from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.ai_engine.ingest import ingest

router = APIRouter(prefix="/admin", tags=["Admin"])

class AdminLoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/login")
def admin_login(data: AdminLoginRequest):
    # Hardcoded as per requirements
    if data.email == "admin@elyaitra.com" and data.password == "admin123":
        return {
            "status": "ok", 
            "token": "admin-session-token",
            "message": "Welcome back, Operator."
        }
    raise HTTPException(status_code=401, detail="Neural handshake failed: Invalid credentials")

@router.post("/ingest")
def run_ingest():
    try:
        ingest()
        return {"status": "ok", "message": "Ingestion completed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
