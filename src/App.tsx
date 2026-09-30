import { Navigate, Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "@/components/protected-route"
import { LoginPage } from "@/routes/login"
import { JobDetailPage } from "@/routes/job-detail"
import { JobListPage } from "@/routes/job-list"

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <JobListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs/:id"
        element={
          <ProtectedRoute>
            <JobDetailPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
