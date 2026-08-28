from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr


class ResponseCreate(BaseModel):
    respondent_email: EmailStr
    answers: dict[str, Any]


class ResponseRead(BaseModel):
    id: int
    survey_id: int
    respondent_email: EmailStr
    answers: dict[str, Any]
    created_at: datetime

    model_config = {"from_attributes": True}
