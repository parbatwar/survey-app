import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../api/api"

function Analytics() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setError("")

        const response = await api.get(
          `/admin/surveys/${id}/analytics`
        )

        setAnalytics(response.data)
      } catch (error) {
        setError(
          error.response?.data?.detail ||
            "Failed to load analytics"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

          <p className="text-sm text-slate-500">
            Loading analytics...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md border border-red-200 bg-white p-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
            <AlertIcon />
          </div>

          <h1 className="mt-4 text-lg font-semibold text-slate-900">
            Could not load analytics
          </h1>

          <p className="mt-2 text-sm leading-6 text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin")}
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
              Survey Analytics
            </p>

            <h1 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
              {analytics.title}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Review response activity and question-level insights.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
          >
            <BackIcon />
            Back
          </button>
        </div>
      </header>


      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Summary */}
        <section className="mb-8">
          <div className="border border-slate-200 bg-white px-6 py-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <ResponsesIcon />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total responses
                </p>

                <p className="mt-0.5 text-3xl font-semibold tracking-tight text-slate-900">
                  {analytics.total_responses}
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* Question insights */}
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-900">
              Question insights
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              See how respondents answered each question.
            </p>
          </div>

          {analytics.questions.length === 0 ? (
            <div className="border border-slate-200 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <SurveyIcon />
              </div>

              <p className="mt-4 text-sm font-medium text-slate-700">
                No questions available
              </p>

              <p className="mt-1 text-sm text-slate-500">
                This survey does not contain any questions.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              {analytics.questions.map(
                (question, index) => (
                  <QuestionAnalyticsCard
                    key={question.question_id}
                    question={question}
                    isLast={
                      index ===
                      analytics.questions.length - 1
                    }
                  />
                )
              )}
            </div>
          )}
        </section>

      </main>
    </div>
  )
}


function QuestionAnalyticsCard({
  question,
  isLast,
}) {
  const getTypeLabel = () => {
    if (question.type === "single_choice") {
      return "Multiple Choice"
    }

    if (question.type === "checkbox") {
      return "Checkbox"
    }

    if (question.type === "rating") {
      return "Rating"
    }

    return "Text Input"
  }

  return (
    <div
      className={`px-6 py-6 ${
        !isLast
          ? "border-b border-slate-200"
          : ""
      }`}
    >
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <QuestionTypeIcon type={question.type} />
        </div>

        <div>
          <h3 className="text-[15px] font-semibold leading-6 text-slate-900">
            {question.label}
          </h3>

          <p className="mt-0.5 text-xs font-medium text-slate-400">
            {getTypeLabel()}
          </p>
        </div>
      </div>

      {question.type === "single_choice" && (
        <ChoiceCounts counts={question.counts} />
      )}

      {question.type === "checkbox" && (
        <ChoiceCounts counts={question.counts} />
      )}

      {question.type === "rating" && (
        <RatingAnalytics average={question.average} />
      )}

      {question.type === "text" && (
        <TextResponses responses={question.responses} />
      )}
    </div>
  )
}


function ChoiceCounts({ counts }) {
  const entries = Object.entries(counts || {})

  if (entries.length === 0) {
    return (
      <EmptyMessage text="No responses yet." />
    )
  }

  const maxCount = Math.max(
    ...entries.map(([, count]) => count)
  )

  return (
    <div className="space-y-4">
      {entries.map(([option, count]) => {
        const barWidth =
          maxCount > 0
            ? Math.round((count / maxCount) * 100)
            : 0

        return (
          <div key={option}>
            <div className="mb-2 flex items-center justify-between gap-5">
              <span className="text-sm font-medium text-slate-700">
                {option}
              </span>

              <span className="shrink-0 text-sm font-medium text-slate-500">
                {count}{" "}
                {count === 1
                  ? "response"
                  : "responses"}
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-500 transition-all"
                style={{
                  width: `${barWidth}%`,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}


function RatingAnalytics({ average }) {
  return (
    <div className="flex items-center gap-4 border border-slate-200 bg-slate-50/60 px-5 py-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        <StarIcon />
      </div>

      <div>
        <p className="text-xs font-medium text-slate-500">
          Average rating
        </p>

        <div className="mt-1 flex items-end gap-1">
          <span className="text-2xl font-semibold tracking-tight text-slate-900">
            {average ?? "—"}
          </span>

          <span className="pb-0.5 text-sm text-slate-400">
            / 5
          </span>
        </div>
      </div>
    </div>
  )
}


function TextResponses({ responses }) {
  if (!responses || responses.length === 0) {
    return (
      <EmptyMessage text="No text responses yet." />
    )
  }

  return (
    <div className="divide-y divide-slate-200 border border-slate-200">
      {responses.map((response, index) => (
        <div
          key={index}
          className="flex items-start gap-3 bg-white px-4 py-3.5"
        >
          <div className="mt-0.5 text-slate-400">
            <MessageIcon />
          </div>

          <p className="text-sm leading-6 text-slate-700">
            {response}
          </p>
        </div>
      ))}
    </div>
  )
}


function EmptyMessage({ text }) {
  return (
    <div className="border border-dashed border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-sm text-slate-400">
        {text}
      </p>
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


function ResponsesIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}


function SurveyIcon() {
  return (
    <svg
      width="18"
      height="18"
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


function QuestionTypeIcon({ type }) {
  if (type === "rating") {
    return <StarIcon />
  }

  if (type === "text") {
    return <MessageIcon />
  }

  if (type === "checkbox") {
    return <CheckboxIcon />
  }

  return <ChoiceIcon />
}


function ChoiceIcon() {
  return (
    <svg
      width="18"
      height="18"
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
      width="18"
      height="18"
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
      width="18"
      height="18"
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


function MessageIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z" />
      <path d="M8 8h8" />
      <path d="M8 12h5" />
    </svg>
  )
}


function AlertIcon() {
  return (
    <svg
      width="18"
      height="18"
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


export default Analytics