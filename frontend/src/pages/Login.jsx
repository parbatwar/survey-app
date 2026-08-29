import { useState } from "react"
import { useNavigate } from "react-router-dom"

import api from "../api/api"


function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")
    setLoading(true)

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      )

      localStorage.setItem(
        "access_token",
        response.data.access_token
      )

      navigate("/admin")
    } catch (error) {
      setError(
        error.response?.data?.detail ||
          "Login failed"
      )
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5 py-10">

      <div className="w-full max-w-md">

        {/* Brand / Heading */}
        <div className="mb-6 text-center">

          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-blue-600 text-white">
            <SurveyIcon />
          </div>

          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
            Admin login
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to create and manage your surveys.
          </p>

        </div>


        {/* Card */}
        <div className="border border-slate-200 bg-white px-6 py-6">

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            {/* Email */}
            <div>

              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Email address
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <MailIcon />
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
                  placeholder="admin@example.com"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>


            {/* Password */}
            <div>

              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>

              <div className="relative">

                <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <LockIcon />
                </div>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>


            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-600">

                <div className="mt-0.5 shrink-0">
                  <AlertIcon />
                </div>

                <p>
                  {error}
                </p>

              </div>
            )}


            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  Signing in...
                </>
              ) : (
                <>
                  <LoginIcon />
                  Sign in
                </>
              )}
            </button>

          </form>


          <div className="my-5 border-t border-slate-200" />


          <p className="text-center text-sm text-slate-500">
            Don&apos;t have an admin account?{" "}
            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
              className="font-medium text-blue-600 transition hover:text-blue-700"
            >
              Create account
            </button>
          </p>

        </div>

      </div>

    </div>
  )
}


/* ---------------- SVG Icons ---------------- */

function SurveyIcon() {
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


function LockIcon() {
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
        x="4"
        y="10"
        width="16"
        height="11"
        rx="2"
      />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}


function LoginIcon() {
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
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      <path d="m10 17 5-5-5-5" />
      <path d="M15 12H3" />
    </svg>
  )
}


function AlertIcon() {
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
      <circle
        cx="12"
        cy="12"
        r="9"
      />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
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


export default Login