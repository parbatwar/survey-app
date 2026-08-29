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
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

          <p className="text-sm text-slate-500">
            Loading survey...
          </p>
        </div>
      </div>
    )
  }


  if (error && !survey) {
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

        </div>
      </div>
    )
  }


  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

        <div className="w-full max-w-md border border-slate-200 bg-white p-8 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <CheckIcon />
          </div>

          <h1 className="mt-4 text-xl font-semibold text-slate-900">
            Response submitted
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Thank you for taking the time to complete this survey.
          </p>

        </div>

      </div>
    )
  }


  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-4">

          <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
            <SurveyIcon />
            Survey
          </div>

        </div>
      </header>


      <main className="mx-auto max-w-3xl px-6 py-8">

        {/* Survey intro */}
        <section className="mb-6 border border-slate-200 bg-white px-6 py-6">

          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Survey
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            {survey.title}
          </h1>

          {survey.description && (
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {survey.description}
            </p>
          )}

        </section>


        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          {/* Email */}
          <div className="border border-slate-200 bg-white px-6 py-5">

            <div className="mb-3 flex items-start gap-3">

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <MailIcon />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-900">
                  Email address
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <p className="mt-0.5 text-xs text-slate-500">
                  Used to identify your response.
                </p>
              </div>

            </div>

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
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
            />

          </div>


          {/* Questions */}
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


          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">

              <div className="mt-0.5">
                <AlertIcon />
              </div>

              <p>
                {error}
              </p>

            </div>
          )}


          {/* Submit */}
          <div className="pt-2">

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <SpinnerIcon />
                  Submitting...
                </>
              ) : (
                <>
                  <SendIcon />
                  Submit response
                </>
              )}
            </button>

          </div>

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
    <div className="border border-slate-200 bg-white px-6 py-5">

      <div className="mb-4 flex items-start gap-3">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <QuestionTypeIcon
            type={question.type}
          />
        </div>

        <div>
          <p className="text-xs font-medium text-slate-400">
            Question {number}
          </p>

          <h2 className="mt-1 text-[15px] font-semibold leading-6 text-slate-900">
            {question.label}

            {question.required && (
              <span className="ml-1 text-red-500">
                *
              </span>
            )}
          </h2>
        </div>

      </div>


      {/* Text */}
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
          className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
        />
      )}


      {/* Multiple choice */}
      {question.type ===
        "single_choice" && (

        <div className="space-y-2">

          {question.options?.map(
            (option) => (

              <label
                key={option}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                  answer === option
                    ? "border-blue-300 bg-blue-50/70 text-blue-900"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
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
                  className="h-4 w-4 accent-blue-600"
                />

                <span>
                  {option}
                </span>

              </label>

            )
          )}

        </div>

      )}


      {/* Checkbox */}
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
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                    selected
                      ? "border-blue-300 bg-blue-50/70 text-blue-900"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
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
                    className="h-4 w-4 accent-blue-600"
                  />

                  <span>
                    {option}
                  </span>

                </label>
              )
            }
          )}

        </div>

      )}


      {/* Rating */}
      {question.type === "rating" && (

        <div>

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
                  className={`rounded-lg border py-3 text-sm font-semibold transition ${
                    answer === rating
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                >
                  {rating}
                </button>

              )
            )}

          </div>

          <div className="mt-2 flex justify-between text-xs text-slate-400">
            <span>
              Low
            </span>

            <span>
              High
            </span>
          </div>

        </div>

      )}

    </div>
  )
}


/* ---------------- SVG Icons ---------------- */

function SurveyIcon() {
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
      <rect
        x="4"
        y="3"
        width="16"
        height="18"
        rx="2"
      />
      <path d="M8 8h8" />
      <path d="M8 12h8" />
      <path d="M8 16h5" />
    </svg>
  )
}


function MailIcon() {
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
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
      />
      <path d="m3 7 9 6 9-6" />
    </svg>
  )
}


function QuestionTypeIcon({ type }) {
  if (type === "rating") {
    return <StarIcon />
  }

  if (type === "checkbox") {
    return <CheckboxIcon />
  }

  if (type === "single_choice") {
    return <ChoiceIcon />
  }

  return <TextIcon />
}


function TextIcon() {
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
      <path d="M4 6h16" />
      <path d="M4 12h10" />
      <path d="M4 18h7" />
    </svg>
  )
}


function ChoiceIcon() {
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


function CheckboxIcon() {
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
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2"
      />
      <path d="m8 12 3 3 5-6" />
    </svg>
  )
}


function StarIcon() {
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
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01Z" />
    </svg>
  )
}


function SendIcon() {
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
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
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


function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
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


export default PublicSurvey
