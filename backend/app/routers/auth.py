from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.auth import (
    AdminCreate,
    AdminLogin,
    TokenResponse,
)
from app.services.auth_service import (
    authenticate_admin,
    create_admin,
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register")
def register_admin(data: AdminCreate, db: Session = Depends(get_db)):
    create_admin(db, data)
    return {"message": "Admin created successfully"}


@router.post("/login", response_model=TokenResponse)
def login_admin(data: AdminLogin, db: Session = Depends(get_db)):
    access_token = authenticate_admin(db, data)
    return {
        "access_token": access_token,
        "token_type": "bearer",
    }
