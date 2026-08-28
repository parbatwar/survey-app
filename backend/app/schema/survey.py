from typing import Any
from pydantic import BaseModel, Field

from app.enums import QuestionType, ConditionOperator


class ConditionSchema(BaseModel):
    question_id: str
    operator: ConditionOperator
    value: Any


class QuestionSchema(BaseModel):
    id: str
    type: QuestionType
    label: str = Field(min_length=1)
    required: bool = False
    options: list[str] | None = None
    condition: ConditionSchema | None = None


class SurveyCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    questions: list[QuestionSchema]


class SurveyUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=255,
    )
    description: str | None = None
    questions: list[QuestionSchema] | None = None


class SurveyRead(BaseModel):
    id: int
    admin_id: int
    title: str
    description: str | None
    questions: list[QuestionSchema]

    model_config = {"from_attributes": True}
