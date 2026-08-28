from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.admin import Admin
from app.schemas.auth import AdminCreate, AdminLogin
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)


def create_admin(
    db: Session,
    data: AdminCreate,
):
    existing_admin = db.query(Admin).filter(Admin.email == data.email).first()

    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin with this email already exists",
        )

    admin = Admin(
        email=data.email,
        hashed_password=hash_password(data.password),
    )

    db.add(admin)
    db.commit()
    db.refresh(admin)

    return admin


def authenticate_admin(
    db: Session,
    data: AdminLogin,
):
    admin = db.query(Admin).filter(Admin.email == data.email).first()

    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not verify_password(
        data.password,
        admin.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    access_token = create_access_token(
        {
            "sub": str(admin.id),
        }
    )

    return access_token
