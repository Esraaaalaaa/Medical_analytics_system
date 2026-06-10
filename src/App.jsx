import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import Login from './pages/Login'
import LoginCredentials from './pages/LoginCredentials'
import Home from './pages/Home'
import DirectorFinance from './pages/DirectorFinance'
import PresidentFinance from './pages/PresidentFinance'
import PeriodicReport from './pages/PeriodicReport'
import ProtectedRoute from './components/auth/ProtectedRoute'
import UrgentCirculars from './pages/UrgentCirculars'
import News from './pages/News'
import Meetings from './pages/Meetings'
import Mailbox from './pages/Mailbox'
import Statistics from './pages/Statistics'
import PresidentStatistics from './pages/PresidentStatistics'
import DirectorStatistics from './pages/DirectorStatistics'

const MAIN_ROLES = ['secretary', 'president', 'director']

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/credentials" element={<LoginCredentials />} />

        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/urgent"
          element={
            <ProtectedRoute allowedRoles={MAIN_ROLES}>
              <UrgentCirculars />
            </ProtectedRoute>
          }
        />

        <Route
          path="/news"
          element={
            <ProtectedRoute allowedRoles={MAIN_ROLES}>
              <News />
            </ProtectedRoute>
          }
        />

        <Route
          path="/meetings"
          element={
            <ProtectedRoute allowedRoles={MAIN_ROLES}>
              <Meetings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mailbox"
          element={
            <ProtectedRoute allowedRoles={MAIN_ROLES}>
              <Mailbox />
            </ProtectedRoute>
          }
        />

        <Route
          path="/statistics"
          element={
            <ProtectedRoute allowedRoles={['secretary']}>
              <Statistics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/statistics/president"
          element={
            <ProtectedRoute allowedRoles={['president']}>
              <PresidentStatistics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/statistics/director"
          element={
            <ProtectedRoute allowedRoles={['director']}>
              <DirectorStatistics />
            </ProtectedRoute>
          }
        />

        <Route
          path="/president-finance"
          element={
            <ProtectedRoute allowedRoles={['president']}>
              <PresidentFinance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/director-finance"
          element={
            <ProtectedRoute allowedRoles={['director']}>
              <DirectorFinance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/director-finance/:hospitalId"
          element={
            <ProtectedRoute allowedRoles={['director']}>
              <DirectorFinance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/periodic-report"
          element={
            <ProtectedRoute allowedRoles={['secretary']}>
              <PeriodicReport />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}