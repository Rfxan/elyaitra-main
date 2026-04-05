from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.payment import Payment
from app.security.log_store import GLOBAL_LOG_STORE

router = APIRouter(prefix="/access", tags=["access"])


@router.get("/subjects")
def check_access(user_id: int, db: Session = Depends(get_db)):
    GLOBAL_LOG_STORE.add_log({
        "method": "ACCESS",
        "path": "/access/subjects",
        "ip": "127.0.0.1",
        "body": f"User {user_id} checking subject eligibility"
    })
    paid = (
        db.query(Payment)
        .filter(
            Payment.user_id == user_id,
            Payment.status == "success"
        )
        .first()
    )

    return {
        "allowed": True # Bypassed payment check
    }
