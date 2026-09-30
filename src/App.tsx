import { lazy, Suspense } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "@/components/protected-route"
import { RouteFallback } from "@/components/route-fallback"

const LoginPage = lazy(() => import("@/routes/login").then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import("@/routes/register").then((m) => ({ default: m.RegisterPage })))
const JobListPage = lazy(() => import("@/routes/job-list").then((m) => ({ default: m.JobListPage })))
const JobDetailPage = lazy(() => import("@/routes/job-detail").then((m) => ({ default: m.JobDetailPage })))
const ClustersPage = lazy(() => import("@/routes/clusters").then((m) => ({ default: m.ClustersPage })))
const DiscoveryPage = lazy(() => import("@/routes/discovery").then((m) => ({ default: m.DiscoveryPage })))
const PreferencesPage = lazy(() => import("@/routes/preferences").then((m) => ({ default: m.PreferencesPage })))
const ProfilePage = lazy(() => import("@/routes/profile").then((m) => ({ default: m.ProfilePage })))

export function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
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
        <Route
          path="/clusters"
          element={
            <ProtectedRoute>
              <ClustersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/discovery"
          element={
            <ProtectedRoute>
              <DiscoveryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/preferences"
          element={
            <ProtectedRoute>
              <PreferencesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
