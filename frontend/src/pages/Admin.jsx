import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "../api/api"

function Admin() {
  const navigate = useNavigate()

  const [surveys, setSurveys] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      setLoading(true)

      const response = await api.get("/admin/surveys")

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
    localStorage.removeItem("access_token")
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Surveys
            </h1>

            <p className="text-sm text-gray-500">
              Create and manage your surveys.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() =>
                navigate("/admin/surveys/new")
              }
              className="rounded-lg bg-black px-4 py-2 text-sm text-white"
            >
              Create Survey
            </button>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {loading && (
          <p className="text-gray-500">
            Loading surveys...
          </p>
        )}

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {!loading &&
          !error &&
          surveys.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <h2 className="text-lg font-medium">
                No surveys yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Create your first survey to get started.
              </p>

              <button
                onClick={() =>
                  navigate("/admin/surveys/new")
                }
                className="mt-4 rounded-lg bg-black px-4 py-2 text-sm text-white"
              >
                Create Survey
              </button>
            </div>
          )}

        <div className="grid gap-4">
          {surveys.map((survey) => (
            <div
              key={survey.id}
              className="rounded-xl border bg-white p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">
                    {survey.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {survey.description ||
                      "No description"}
                  </p>

                  <p className="mt-3 text-xs text-gray-400">
                    {survey.questions.length} questions
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      navigate(
                        `/admin/surveys/${survey.id}/edit`
                      )
                    }
                    className="rounded-lg border px-3 py-2 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        `/admin/surveys/${survey.id}/analytics`
                      )
                    }
                    className="rounded-lg border px-3 py-2 text-sm"
                  >
                    Analytics
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/survey/${survey.id}`)
                    }
                    className="rounded-lg bg-black px-3 py-2 text-sm text-white"
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Admin