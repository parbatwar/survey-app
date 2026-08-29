import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom"

import Admin from "./pages/Admin"
import Login from "./pages/Login"
import Register from "./pages/Register"
import CreateSurvey from "./pages/CreateSurvey"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
            path="/register"
            element={<Register />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        
        <Route
            path="/admin/surveys/new"
            element={
                <ProtectedRoute>
                <CreateSurvey />
                </ProtectedRoute>
            }
        />

        <Route
          path="/admin/surveys/new"
          element={
            <ProtectedRoute>
              <div className="p-8">
                Create Survey Page
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/surveys/:id/edit"
          element={
            <ProtectedRoute>
              <div className="p-8">
                Edit Survey Page
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/surveys/:id/analytics"
          element={
            <ProtectedRoute>
              <div className="p-8">
                Analytics Page
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App