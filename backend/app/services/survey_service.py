from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.survey import Survey
from app.models.admin import Admin
from app.schemas.survey import SurveyCreate, SurveyUpdate


def create_survey(
    db: Session,
    data: SurveyCreate,
    current_admin: Admin,
):
    survey = Survey(
        admin_id=current_admin.id,
        title=data.title,
        description=data.description,
        questions=[question.model_dump() for question in data.questions],
    )

    db.add(survey)
    db.commit()
    db.refresh(survey)

    return survey


def get_surveys(
    db: Session,
    current_admin: Admin,
):
    return (
        db.query(Survey)
        .filter(Survey.admin_id == current_admin.id)
        .order_by(Survey.created_at.desc())
        .all()
    )


def get_survey_by_id(
    db: Session,
    survey_id: int,
    current_admin: Admin,
):
    survey = (
        db.query(Survey)
        .filter(
            Survey.id == survey_id,
            Survey.admin_id == current_admin.id,
        )
        .first()
    )

    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Survey not found",
        )

    return survey


def update_survey(
    db: Session,
    survey_id: int,
    data: SurveyUpdate,
    current_admin: Admin,
):
    survey = get_survey_by_id(
        db,
        survey_id,
        current_admin,
    )

    update_data = data.model_dump(exclude_unset=True)

    if "questions" in update_data:
        update_data["questions"] = [
            question.model_dump() for question in data.questions
        ]

    for field, value in update_data.items():
        setattr(survey, field, value)

    db.commit()
    db.refresh(survey)

    return survey


def delete_survey(
    db: Session,
    survey_id: int,
    current_admin: Admin,
):
    survey = get_survey_by_id(
        db,
        survey_id,
        current_admin,
    )

    db.delete(survey)
    db.commit()
