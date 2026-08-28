from enum import Enum


class QuestionType(str, Enum):
    TEXT = "text"
    SINGLE_CHOICE = "single_choice"
    CHECKBOX = "checkbox"
    RATING = "rating"


class ConditionOperator(str, Enum):
    EQUALS = "equals"
