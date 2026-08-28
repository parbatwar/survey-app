from collections import Counter

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.enums import QuestionType
from app.models.survey import Survey
from app.models.response import SurveyResponse
from app.models.admin import Admin


def get_survey_analytics(
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

    responses = (
        db.query(SurveyResponse).filter(SurveyResponse.survey_id == survey_id).all()
    )

    analytics = {
        "survey_id": survey.id,
        "title": survey.title,
        "total_responses": len(responses),
        "questions": [],
    }

    for question in survey.questions:
        question_id = question["id"]
        question_type = question["type"]

        question_result = {
            "question_id": question_id,
            "label": question["label"],
            "type": question_type,
        }

        answers = [
            response.answers.get(question_id)
            for response in responses
            if response.answers.get(question_id) is not None
        ]

        # Multiple choice
        if question_type == QuestionType.SINGLE_CHOICE.value:
            question_result["counts"] = dict(Counter(answers))

        # Checkbox
        elif question_type == QuestionType.CHECKBOX.value:
            selected_options = []

            for answer in answers:
                if isinstance(answer, list):
                    selected_options.extend(answer)

            question_result["counts"] = dict(Counter(selected_options))

        # Rating
        elif question_type == QuestionType.RATING.value:
            if answers:
                question_result["average"] = round(
                    sum(answers) / len(answers),
                    2,
                )
            else:
                question_result["average"] = None

        # Text
        elif question_type == QuestionType.TEXT.value:
            question_result["responses"] = answers

        analytics["questions"].append(question_result)

    return analytics
