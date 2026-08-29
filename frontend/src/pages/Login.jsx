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
      const response = await api.post("/auth/login", {
        email,
        password,
      })

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">
          Admin Login
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Sign in to manage surveys.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-black"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login