from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_admin
from app.models.admin import Admin
from app.schemas.survey import (
    SurveyCreate,
    SurveyRead,
    SurveyUpdate,
)
from app.services.analytics_service import get_survey_analytics
from app.services.survey_service import (
    create_survey,
    delete_survey,
    get_survey_by_id,
    get_surveys,
    update_survey,
)

router = APIRouter(
    prefix="/admin/surveys",
    tags=["Admin Surveys"],
)


@router.post(
    "",
    response_model=SurveyRead,
    status_code=status.HTTP_201_CREATED,
)
def create_survey_route(
    data: SurveyCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return create_survey(
        db,
        data,
        current_admin,
    )


@router.get(
    "",
    response_model=list[SurveyRead],
)
def get_surveys_route(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return get_surveys(
        db,
        current_admin,
    )


@router.get(
    "/{survey_id}",
    response_model=SurveyRead,
)
def get_survey_route(
    survey_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return get_survey_by_id(
        db,
        survey_id,
        current_admin,
    )


@router.patch(
    "/{survey_id}",
    response_model=SurveyRead,
)
def update_survey_route(
    survey_id: int,
    data: SurveyUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return update_survey(
        db,
        survey_id,
        data,
        current_admin,
    )


@router.delete(
    "/{survey_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_survey_route(
    survey_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    delete_survey(
        db,
        survey_id,
        current_admin,
    )


@router.get("/{survey_id}/analytics")
def get_survey_analytics_route(
    survey_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return get_survey_analytics(
        db,
        survey_id,
        current_admin,
    )
