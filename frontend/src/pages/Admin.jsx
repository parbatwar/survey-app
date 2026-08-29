import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "../api/api"


function Admin() {
  const navigate = useNavigate()

  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState(null)


  useEffect(() => {
    fetchSurveys()
  }, [])


  const fetchSurveys = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await api.get(
        "/admin/surveys"
      )

      setSurveys(response.data)
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Failed to load surveys"
      )
    } finally {
      setLoading(false)
    }
  }


  const handleLogout = () => {
    localStorage.removeItem(
      "access_token"
    )

    navigate("/login")
  }


  const handleShare = async (survey) => {
    const surveyUrl =
      `${window.location.origin}/survey/${survey.id}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: survey.title,
          text: `Complete this survey: ${survey.title}`,
          url: surveyUrl,
        })

        return
      }

      await navigator.clipboard.writeText(
        surveyUrl
      )

      setCopiedId(survey.id)

      setTimeout(() => {
        setCopiedId(null)
      }, 2000)
    } catch (error) {
      // User cancelling the native share dialog
      // should not show an application error.
      if (error.name !== "AbortError") {
        console.error(
          "Unable to share survey",
          error
        )
      }
    }
  }


  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-slate-900">
              Surveys
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create, manage and analyze your surveys.
            </p>
          </div>


          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/surveys/new"
                )
              }
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <PlusIcon />

              Create survey
            </button>


            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            >
              <LogoutIcon />

              Logout
            </button>

          </div>

        </div>

      </header>


      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        {/* Section Heading */}
        {!loading &&
          !error &&
          surveys.length > 0 && (

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-base font-semibold text-slate-900">
                All surveys
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage your existing surveys and view their results.
              </p>
            </div>


            <span className="text-sm text-slate-400">
              {surveys.length} total
            </span>

          </div>

        )}


        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center border border-slate-200 bg-white py-20">

            <div className="flex items-center gap-3">

              <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

              <span className="text-sm text-slate-500">
                Loading surveys...
              </span>

            </div>

          </div>
        )}


        {/* Error */}
        {error && (
          <div className="border border-red-200 bg-red-50 px-5 py-4">

            <div className="flex items-start justify-between gap-4">

              <div>
                <p className="text-sm font-medium text-red-700">
                  Unable to load surveys
                </p>

                <p className="mt-1 text-sm text-red-600">
                  {error}
                </p>
              </div>


              <button
                type="button"
                onClick={fetchSurveys}
                className="shrink-0 rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50"
              >
                Try again
              </button>

            </div>

          </div>
        )}


        {/* Empty State */}
        {!loading &&
          !error &&
          surveys.length === 0 && (

          <div className="border border-slate-200 bg-white px-6 py-20 text-center">

            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <SurveyIcon />
            </div>


            <h2 className="mt-4 text-base font-semibold text-slate-900">
              No surveys created
            </h2>


            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Create your first survey to start collecting responses from users.
            </p>


            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/surveys/new"
                )
              }
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              <PlusIcon />

              Create survey
            </button>

          </div>

        )}


        {/* Survey List */}
        {!loading &&
          !error &&
          surveys.length > 0 && (

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">

            {surveys.map(
              (survey, index) => (

                <div
                  key={survey.id}
                  className={`group flex flex-col gap-5 px-6 py-5 transition hover:bg-slate-50/70 lg:flex-row lg:items-center lg:justify-between ${
                    index !==
                    surveys.length - 1
                      ? "border-b border-slate-200"
                      : ""
                  }`}
                >

                  {/* Survey Info */}
                  <div className="min-w-0 flex flex-1 items-start gap-4">

                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      <SurveyIcon />
                    </div>


                    <div className="min-w-0">

                      <h3 className="truncate text-[15px] font-semibold text-slate-900">
                        {survey.title}
                      </h3>


                      <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">
                        {survey.description ||
                          "No description provided."}
                      </p>

                    </div>

                  </div>


                  {/* Actions */}
                  <div className="flex shrink-0 flex-wrap items-center gap-1.5 lg:justify-end">

                    {/* Share */}
                    <button
                      type="button"
                      onClick={() =>
                        handleShare(survey)
                      }
                      className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                        copiedId === survey.id
                          ? "border-green-200 bg-green-50 text-green-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                      }`}
                    >
                      {copiedId ===
                      survey.id ? (
                        <>
                          <CheckIcon />
                          Copied
                        </>
                      ) : (
                        <>
                          <ShareIcon />
                          Share
                        </>
                      )}
                    </button>


                    {/* Edit */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/surveys/${survey.id}/edit`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <EditIcon />

                      Edit
                    </button>


                    {/* Analytics */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/admin/surveys/${survey.id}/analytics`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <AnalyticsIcon />

                      Analytics
                    </button>


                    {/* View */}
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          `/survey/${survey.id}`
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                    >
                      <EyeIcon />

                      View
                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </main>

    </div>
  )
}


/* ---------------- SVG Icons ---------------- */

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
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


function SurveyIcon() {
  return (
    <svg
      width="19"
      height="19"
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


function ShareIcon() {
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
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />

      <path d="m8.6 10.5 6.8-4" />
      <path d="m8.6 13.5 6.8 4" />
    </svg>
  )
}


function EditIcon() {
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
      <path d="M12 20h9" />

      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  )
}


function AnalyticsIcon() {
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
      <path d="M4 19V9" />
      <path d="M10 19V5" />
      <path d="M16 19v-7" />
      <path d="M22 19V3" />
    </svg>
  )
}


function EyeIcon() {
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
      <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />

      <circle
        cx="12"
        cy="12"
        r="3"
      />
    </svg>
  )
}


function LogoutIcon() {
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
      <path d="M10 17l5-5-5-5" />
      <path d="M15 12H3" />
      <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
    </svg>
  )
}


function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
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


export default Admin