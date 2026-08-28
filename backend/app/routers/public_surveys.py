from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.response import (
    ResponseCreate,
    ResponseRead,
)
from app.schemas.survey import SurveyRead
from app.services.response_service import (
    get_public_survey,
    submit_response,
)

router = APIRouter(
    prefix="/public/surveys",
    tags=["Public Surveys"],
)


@router.get(
    "/{survey_id}",
    response_model=SurveyRead,
)
def get_public_survey_route(
    survey_id: int,
    db: Session = Depends(get_db),
):
    return get_public_survey(
        db,
        survey_id,
    )


@router.post(
    "/{survey_id}/responses",
    response_model=ResponseRead,
    status_code=status.HTTP_201_CREATED,
)
def submit_response_route(
    survey_id: int,
    data: ResponseCreate,
    db: Session = Depends(get_db),
):
    return submit_response(
        db,
        survey_id,
        data,
    )
