import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

import {
  DndContext,
  closestCenter,
} from "@dnd-kit/core"

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable"

import api from "../api/api"

import SurveyDetails from "../components/survey-builder/SurveyDetails"
import QuestionCard from "../components/survey-builder/QuestionCard"
import SortableQuestion from "../components/survey-builder/SortableQuestion"


const createQuestion = () => ({
  id: crypto.randomUUID(),
  type: "text",
  label: "",
  required: false,
  options: null,
  condition: null,
})


function EditSurvey() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState([])

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")


  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        setError("")

        const response = await api.get(
          `/admin/surveys/${id}`
        )

        const survey = response.data

        setTitle(survey.title)
        setDescription(
          survey.description || ""
        )
        setQuestions(
          survey.questions || []
        )
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            "Failed to load survey"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSurvey()
  }, [id])


  const addQuestion = () => {
    setQuestions((current) => [
      ...current,
      createQuestion(),
    ])
  }


  const removeQuestion = (
    questionId
  ) => {
    setQuestions((current) => {
      const filtered =
        current.filter(
          (question) =>
            question.id !== questionId
        )

      return filtered.map(
        (question) => {
          if (
            question.condition
              ?.question_id ===
            questionId
          ) {
            return {
              ...question,
              condition: null,
            }
          }

          return question
        }
      )
    })
  }


  const updateQuestion = (
    questionId,
    field,
    value
  ) => {
    setQuestions((current) =>
      current.map((question) => {
        if (
          question.id !== questionId
        ) {
          return question
        }

        const updatedQuestion = {
          ...question,
          [field]: value,
        }

        if (
          field === "type" &&
          (
            value === "single_choice" ||
            value === "checkbox"
          )
        ) {
          updatedQuestion.options =
            question.options || ["", ""]
        }

        if (
          field === "type" &&
          (
            value === "text" ||
            value === "rating"
          )
        ) {
          updatedQuestion.options = null
        }

        return updatedQuestion
      })
    )

    if (
      field === "type" &&
      value !== "single_choice"
    ) {
      setQuestions((current) =>
        current.map((question) => {
          if (
            question.condition
              ?.question_id ===
            questionId
          ) {
            return {
              ...question,
              condition: null,
            }
          }

          return question
        })
      )
    }
  }


  const updateOption = (
    questionId,
    optionIndex,
    value
  ) => {
    setQuestions((current) =>
      current.map((question) => {
        if (
          question.id !== questionId
        ) {
          return question
        }

        const options = [
          ...question.options,
        ]

        options[optionIndex] = value

        return {
          ...question,
          options,
        }
      })
    )
  }


  const addOption = (
    questionId
  ) => {
    setQuestions((current) =>
      current.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: [
                ...question.options,
                "",
              ],
            }
          : question
      )
    )
  }


  const removeOption = (
    questionId,
    optionIndex
  ) => {
    const sourceQuestion =
      questions.find(
        (question) =>
          question.id === questionId
      )

    const removedOption =
      sourceQuestion?.options?.[
        optionIndex
      ]

    setQuestions((current) =>
      current.map((question) => {
        if (
          question.id === questionId
        ) {
          return {
            ...question,
            options:
              question.options.filter(
                (_, index) =>
                  index !== optionIndex
              ),
          }
        }

        if (
          question.condition
            ?.question_id ===
            questionId &&
          question.condition
            ?.value ===
            removedOption
        ) {
          return {
            ...question,
            condition: null,
          }
        }

        return question
      })
    )
  }


  const cleanInvalidConditions = (
    reorderedQuestions
  ) => {
    return reorderedQuestions.map(
      (question, index) => {
        if (!question.condition) {
          return question
        }

        const sourceIndex =
          reorderedQuestions.findIndex(
            (item) =>
              item.id ===
              question.condition
                .question_id
          )

        const sourceQuestion =
          reorderedQuestions[
            sourceIndex
          ]

        if (
          sourceIndex === -1 ||
          sourceIndex >= index ||
          sourceQuestion?.type !==
            "single_choice"
        ) {
          return {
            ...question,
            condition: null,
          }
        }

        return question
      }
    )
  }


  const handleDragEnd = (
    event
  ) => {
    const { active, over } = event

    if (
      !over ||
      active.id === over.id
    ) {
      return
    }

    setQuestions((current) => {
      const oldIndex =
        current.findIndex(
          (question) =>
            question.id ===
            active.id
        )

      const newIndex =
        current.findIndex(
          (question) =>
            question.id ===
            over.id
        )

      const reordered =
        arrayMove(
          current,
          oldIndex,
          newIndex
        )

      return cleanInvalidConditions(
        reordered
      )
    })
  }


  const handleSubmit = async (
    event
  ) => {
    event.preventDefault()

    setError("")
    setSaving(true)

    try {
      const cleanedQuestions =
        questions.map(
          (question) => ({
            ...question,

            options:
              question.options
                ? question.options.filter(
                    (option) =>
                      option.trim() !== ""
                  )
                : null,
          })
        )

      await api.patch(
        `/admin/surveys/${id}`,
        {
          title,
          description:
            description || null,
          questions:
            cleanedQuestions,
        }
      )

      navigate("/admin")
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Failed to update survey"
      )
    } finally {
      setSaving(false)
    }
  }


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

          <p className="text-sm text-slate-500">
            Loading survey...
          </p>
        </div>
      </div>
    )
  }


  if (
    error &&
    questions.length === 0
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

        <div className="w-full max-w-md border border-red-200 bg-white p-7">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <AlertIcon />
          </div>

          <h1 className="mt-4 text-lg font-semibold text-slate-900">
            Survey unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <BackIcon />
            Back to surveys
          </button>

        </div>

      </div>
    )
  }


  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Survey Builder
            </p>

            <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
              Edit survey
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Update survey details, questions and conditional logic.
            </p>
          </div>


          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            <BackIcon />
            Back
          </button>

        </div>

      </header>


      {/* Content */}
      <main className="mx-auto max-w-5xl px-6 py-8">

        <form
          onSubmit={handleSubmit}
          className="space-y-7"
        >

          <SurveyDetails
            title={title}
            description={description}
            setTitle={setTitle}
            setDescription={
              setDescription
            }
          />


          {/* Questions */}
          <section>

            <div className="mb-5 flex items-end justify-between">

              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Questions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Update, reorder or add survey questions.
                </p>
              </div>


              <span className="text-sm text-slate-400">
                {questions.length}{" "}
                {questions.length === 1
                  ? "question"
                  : "questions"}
              </span>

            </div>


            <DndContext
              collisionDetection={
                closestCenter
              }
              onDragEnd={
                handleDragEnd
              }
            >

              <SortableContext
                items={questions.map(
                  (question) =>
                    question.id
                )}
                strategy={
                  verticalListSortingStrategy
                }
              >

                <div className="space-y-4">

                  {questions.map(
                    (
                      question,
                      index
                    ) => (

                      <SortableQuestion
                        key={
                          question.id
                        }
                        question={
                          question
                        }
                      >

                        <QuestionCard
                          question={
                            question
                          }
                          index={index}
                          questions={
                            questions
                          }
                          canRemove={
                            questions.length >
                            1
                          }
                          removeQuestion={
                            removeQuestion
                          }
                          updateQuestion={
                            updateQuestion
                          }
                          updateOption={
                            updateOption
                          }
                          addOption={
                            addOption
                          }
                          removeOption={
                            removeOption
                          }
                        />

                      </SortableQuestion>

                    )
                  )}

                </div>

              </SortableContext>

            </DndContext>


            {/* Add Question */}
            <button
              type="button"
              onClick={
                addQuestion
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-200 bg-blue-50/40 py-4 text-sm font-medium text-blue-600 transition hover:border-blue-300 hover:bg-blue-50"
            >
              <PlusIcon />
              Add question
            </button>

          </section>


          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

              <div className="mt-0.5">
                <AlertIcon />
              </div>

              <p>
                {typeof error ===
                "string"
                  ? error
                  : "Failed to update survey"}
              </p>

            </div>
          )}


          {/* Footer */}
          <div className="sticky bottom-4 z-20 flex items-center justify-between border border-slate-200 bg-white/95 px-5 py-4 shadow-lg backdrop-blur">

            <div className="flex items-center gap-2 text-sm text-slate-500">
              <QuestionsIcon />

              <span>
                {questions.length}{" "}
                {questions.length === 1
                  ? "question"
                  : "questions"}
              </span>
            </div>


            <div className="flex items-center gap-3">

              <button
                type="button"
                onClick={() =>
                  navigate("/admin")
                }
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <SpinnerIcon />
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    Save changes
                  </>
                )}
              </button>

            </div>

          </div>

        </form>

      </main>

    </div>
  )
}


/* ---------------- SVG Icons ---------------- */

function BackIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  )
}


function PlusIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}


function SaveIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </svg>
  )
}


function QuestionsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="6" cy="7" r="2" />
      <circle cx="6" cy="17" r="2" />
      <path d="M11 7h8" />
      <path d="M11 17h8" />
    </svg>
  )
}


function AlertIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  )
}


function SpinnerIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />

      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  )
}


export default EditSurvey
