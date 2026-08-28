from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.enums import QuestionType
from app.models.response import SurveyResponse
from app.models.survey import Survey
from app.schemas.response import ResponseCreate


def get_public_survey(
    db: Session,
    survey_id: int,
):
    survey = db.query(Survey).filter(Survey.id == survey_id).first()

    if not survey:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Survey not found",
        )

    return survey


def is_question_visible(
    question: dict,
    answers: dict,
) -> bool:
    condition = question.get("condition")

    if not condition:
        return True

    question_id = condition.get("question_id")
    operator = condition.get("operator")
    expected_value = condition.get("value")

    if operator == "equals":
        return answers.get(question_id) == expected_value

    return True


def validate_answer(
    question: dict,
    answer,
):
    question_type = question["type"]

    if question_type == QuestionType.TEXT.value:
        if not isinstance(answer, str):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{question['label']} must be text",
            )

    elif question_type == QuestionType.SINGLE_CHOICE.value:
        if not isinstance(answer, str):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{question['label']} must be a single option",
            )

        if answer not in question.get("options", []):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid option for {question['label']}",
            )

    elif question_type == QuestionType.CHECKBOX.value:
        if not isinstance(answer, list):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{question['label']} must be a list",
            )

        valid_options = question.get("options", [])

        if any(option not in valid_options for option in answer):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid option for {question['label']}",
            )

    elif question_type == QuestionType.RATING.value:
        if not isinstance(answer, int) or not 1 <= answer <= 5:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{question['label']} must be a rating from 1 to 5",
            )


def submit_response(
    db: Session,
    survey_id: int,
    data: ResponseCreate,
):
    survey = get_public_survey(
        db,
        survey_id,
    )

    answers = data.answers

    for question in survey.questions:
        if not is_question_visible(question, answers):
            continue

        question_id = question["id"]
        answer = answers.get(question_id)

        if question.get("required") and answer is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{question['label']} is required",
            )

        if answer is not None:
            validate_answer(
                question,
                answer,
            )

    response = SurveyResponse(
        survey_id=survey.id,
        respondent_email=data.respondent_email,
        answers=answers,
    )

    db.add(response)
    db.commit()
    db.refresh(response)

    return response
