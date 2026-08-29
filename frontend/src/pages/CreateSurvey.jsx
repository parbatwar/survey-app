import { useState } from "react"
import { useNavigate } from "react-router-dom"

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


function CreateSurvey() {
  const navigate = useNavigate()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const [questions, setQuestions] = useState([
    createQuestion(),
  ])

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)


  const addQuestion = () => {
    setQuestions((current) => [
      ...current,
      createQuestion(),
    ])
  }


  const removeQuestion = (id) => {
    setQuestions((current) => {
      const filtered = current.filter(
        (question) => question.id !== id
      )

      return filtered.map((question) => {
        if (
          question.condition?.question_id === id
        ) {
          return {
            ...question,
            condition: null,
          }
        }

        return question
      })
    })
  }


  const updateQuestion = (
    id,
    field,
    value
  ) => {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== id) {
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
  }


  const updateOption = (
    questionId,
    optionIndex,
    value
  ) => {
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
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


  const addOption = (questionId) => {
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
    setQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId) {
          return question
        }

        return {
          ...question,
          options:
            question.options.filter(
              (_, index) =>
                index !== optionIndex
            ),
        }
      })
    )
  }


  const handleDragEnd = (event) => {
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
            question.id === active.id
        )

      const newIndex =
        current.findIndex(
          (question) =>
            question.id === over.id
        )

      return arrayMove(
        current,
        oldIndex,
        newIndex
      )
    })
  }


  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      const cleanedQuestions =
        questions.map((question) => ({
          ...question,

          options: question.options
            ? question.options.filter(
                (option) =>
                  option.trim() !== ""
              )
            : null,
        }))

      await api.post(
        "/admin/surveys",
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
          "Failed to create survey"
      )
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Survey Builder
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Create survey
            </h1>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/admin")
            }
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back
          </button>
        </div>
      </header>


      <main className="mx-auto max-w-5xl px-6 py-8">
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <SurveyDetails
            title={title}
            description={description}
            setTitle={setTitle}
            setDescription={setDescription}
          />


          <section>
            <div className="mb-4 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Questions
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add and configure your survey questions.
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
              onDragEnd={handleDragEnd}
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
                <div className="space-y-5">
                  {questions.map(
                    (question, index) => (
                      <SortableQuestion
                        key={question.id}
                        question={question}
                      >
                        <QuestionCard
                          question={question}
                          index={index}
                          questions={questions}
                          canRemove={
                            questions.length > 1
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


            <button
              type="button"
              onClick={addQuestion}
              className="mt-5 w-full rounded-2xl border-2 border-dashed border-slate-200 bg-white py-5 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              + Add Question
            </button>
          </section>


          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {typeof error === "string"
                ? error
                : "Failed to create survey"}
            </div>
          )}


          <div className="sticky bottom-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
            <p className="text-sm text-slate-500">
              {questions.length} question
              {questions.length !== 1
                ? "s"
                : ""}{" "}
              ready
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate("/admin")
                }
                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-slate-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {loading
                  ? "Creating..."
                  : "Create Survey"}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default CreateSurvey