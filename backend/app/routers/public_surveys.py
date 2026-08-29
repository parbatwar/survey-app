from fastapi import (
    APIRouter,
    Depends,
    Request,
    status,
)

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

from app.core.rate_limiter import (
    check_submission_rate_limit,
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
    request: Request,
    db: Session = Depends(get_db),
):
    check_submission_rate_limit(
        request,
        survey_id,
    )

    return submit_response(
        db,
        survey_id,
        data,
    )
