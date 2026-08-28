import { useEffect, useState } from "react"
import api from "../api/api"

function Home() {
  const [message, setMessage] = useState("Connecting...")

  useEffect(() => {
    api
      .get("/")
      .then((response) => {
        setMessage(response.data.message)
      })
      .catch(() => {
        setMessage("Backend connection failed")
      })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div>
        <h1 className="text-3xl font-bold">
          Survey App
        </h1>

        <p className="mt-4">
          {message}
        </p>
      </div>
    </div>
  )
}

export default Home