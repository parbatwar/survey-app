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
        <p className="text-sm text-slate-500">
          Loading analytics...
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-semibold text-slate-900">
            Could not load analytics
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="mt-5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Back to surveys
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Analytics
            </p>

            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              {analytics.title}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <section className="mb-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total responses
            </p>

            <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
              {analytics.total_responses}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Question insights
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Response breakdown for each survey question.
            </p>
          </div>

          {analytics.questions.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm text-slate-500">
                No questions available.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {analytics.questions.map(
                (question, index) => (
                  <QuestionAnalyticsCard
                    key={question.question_id}
                    question={question}
                    index={index}
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
  index,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
            {index + 1}
          </div>

          <div>
            <h3 className="font-medium text-slate-900">
              {question.label}
            </h3>

            <p className="mt-1 text-xs capitalize text-slate-400">
              {question.type.replace("_", " ")}
            </p>
          </div>
        </div>
      </div>

      {question.type === "single_choice" && (
        <ChoiceCounts counts={question.counts} />
      )}

      {question.type === "checkbox" && (
        <ChoiceCounts counts={question.counts} />
      )}

      {question.type === "rating" && (
        <RatingAnalytics
          average={question.average}
        />
      )}

      {question.type === "text" && (
        <TextResponses
          responses={question.responses}
        />
      )}
    </div>
  )
}

function ChoiceCounts({ counts }) {
  const entries = Object.entries(counts || {})

  if (entries.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No responses yet.
      </p>
    )
  }

  const total = entries.reduce(
    (sum, [, count]) => sum + count,
    0
  )

  return (
    <div className="space-y-4">
      {entries.map(([option, count]) => {
        const percentage =
          total > 0
            ? Math.round((count / total) * 100)
            : 0

        return (
          <div key={option}>
            <div className="mb-1.5 flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-slate-700">
                {option}
              </span>

              <span className="text-sm text-slate-500">
                {count} responses
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-900 transition-all"
                style={{
                  width: `${percentage}%`,
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
    <div className="rounded-xl bg-slate-50 p-5">
      <p className="text-sm text-slate-500">
        Average rating
      </p>

      <div className="mt-2 flex items-end gap-2">
        <span className="text-4xl font-semibold text-slate-900">
          {average ?? "—"}
        </span>

        <span className="pb-1 text-sm text-slate-400">
          / 5
        </span>
      </div>
    </div>
  )
}

function TextResponses({ responses }) {
  if (!responses || responses.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        No text responses yet.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {responses.map((response, index) => (
        <div
          key={index}
          className="rounded-xl bg-slate-50 px-4 py-3"
        >
          <p className="text-sm leading-6 text-slate-700">
            {response}
          </p>
        </div>
      ))}
    </div>
  )
}

export default Analytics