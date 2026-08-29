import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"

import api from "../api/api"


function PublicSurvey() {
  const { id } = useParams()

  const [survey, setSurvey] = useState(null)
  const [email, setEmail] = useState("")
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)


  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await api.get(
          `/public/surveys/${id}`
        )

        setSurvey(response.data)
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            "Survey could not be loaded"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSurvey()
  }, [id])


  const isQuestionVisible = (question) => {
    if (!question.condition) {
      return true
    }

    const actualValue =
      answers[
        question.condition.question_id
      ]

    return (
      actualValue ===
      question.condition.value
    )
  }


  const visibleQuestions = useMemo(() => {
    if (!survey) {
      return []
    }

    return survey.questions.filter(
      isQuestionVisible
    )
  }, [survey, answers])


  const updateAnswer = (
    questionId,
    value
  ) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }))
  }


  const handleCheckbox = (
    questionId,
    option,
    checked
  ) => {
    setAnswers((current) => {
      const existing =
        current[questionId] || []

      if (checked) {
        return {
          ...current,
          [questionId]: [
            ...existing,
            option,
          ],
        }
      }

      return {
        ...current,
        [questionId]:
          existing.filter(
            (item) => item !== option
          ),
      }
    })
  }


  const validateSurvey = () => {
    for (const question of visibleQuestions) {
      if (!question.required) {
        continue
      }

      const answer =
        answers[question.id]

      if (
        question.type === "checkbox"
      ) {
        if (
          !Array.isArray(answer) ||
          answer.length === 0
        ) {
          return `Please answer: ${question.label}`
        }

        continue
      }

      if (
        answer === undefined ||
        answer === null ||
        answer === ""
      ) {
        return `Please answer: ${question.label}`
      }
    }

    return null
  }


  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")

    const validationError =
      validateSurvey()

    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)

    try {
      const visibleIds = new Set(
        visibleQuestions.map(
          (question) => question.id
        )
      )

      const cleanedAnswers =
        Object.fromEntries(
          Object.entries(answers).filter(
            ([questionId]) =>
              visibleIds.has(questionId)
          )
        )

      await api.post(
        `/public/surveys/${id}/responses`,
        {
          respondent_email: email,
          answers: cleanedAnswers,
        }
      )

      setSuccess(true)
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Failed to submit response"
      )
    } finally {
      setSubmitting(false)
    }
  }


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          Loading survey...
        </p>
      </div>
    )
  }


  if (error && !survey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">
            Survey unavailable
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>
        </div>
      </div>
    )
  }


  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl text-green-700">
            ✓
          </div>

          <h1 className="mt-4 text-xl font-semibold text-slate-900">
            Response submitted
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Thank you for completing the survey.
          </p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-slate-50 px-5 py-10">
      <main className="mx-auto max-w-2xl">

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Survey
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {survey.title}
          </h1>

          {survey.description && (
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {survey.description}
            </p>
          )}
        </div>


        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <label className="mb-1.5 block text-sm font-medium text-slate-800">
              Email
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
            />
          </div>


          {visibleQuestions.map(
            (question, index) => (
              <QuestionField
                key={question.id}
                question={question}
                number={index + 1}
                answer={
                  answers[question.id]
                }
                updateAnswer={
                  updateAnswer
                }
                handleCheckbox={
                  handleCheckbox
                }
              />
            )
          )}


          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}


          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : "Submit Response"}
          </button>

        </form>
      </main>
    </div>
  )
}


function QuestionField({
  question,
  number,
  answer,
  updateAnswer,
  handleCheckbox,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-4">
        <p className="text-xs font-medium text-slate-400">
          Question {number}
        </p>

        <h2 className="mt-1 text-base font-medium text-slate-900">
          {question.label}

          {question.required && (
            <span className="ml-1 text-red-500">
              *
            </span>
          )}
        </h2>
      </div>


      {question.type === "text" && (
        <textarea
          value={answer || ""}
          onChange={(event) =>
            updateAnswer(
              question.id,
              event.target.value
            )
          }
          rows="4"
          placeholder="Enter your answer"
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
        />
      )}


      {question.type ===
        "single_choice" && (
        <div className="space-y-2">
          {question.options?.map(
            (option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                  answer === option
                    ? "border-slate-900 bg-slate-50"
                    : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={
                    answer === option
                  }
                  onChange={() =>
                    updateAnswer(
                      question.id,
                      option
                    )
                  }
                />

                <span className="text-sm text-slate-700">
                  {option}
                </span>
              </label>
            )
          )}
        </div>
      )}


      {question.type === "checkbox" && (
        <div className="space-y-2">
          {question.options?.map(
            (option) => {
              const selected =
                Array.isArray(answer) &&
                answer.includes(option)

              return (
                <label
                  key={option}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                    selected
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={(event) =>
                      handleCheckbox(
                        question.id,
                        option,
                        event.target.checked
                      )
                    }
                  />

                  <span className="text-sm text-slate-700">
                    {option}
                  </span>
                </label>
              )
            }
          )}
        </div>
      )}


      {question.type === "rating" && (
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map(
            (rating) => (
              <button
                key={rating}
                type="button"
                onClick={() =>
                  updateAnswer(
                    question.id,
                    rating
                  )
                }
                className={`rounded-xl border py-3 text-sm font-semibold transition ${
                  answer === rating
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {rating}
              </button>
            )
          )}
        </div>
      )}

    </div>
  )
}


export default PublicSurvey