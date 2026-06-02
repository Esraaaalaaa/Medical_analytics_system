import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import LoginCredentials from './pages/LoginCredentials'
import Home from './pages/Home'
import DirectorFinance from './pages/DirectorFinance'
import PresidentFinance from './pages/PresidentFinance'
import PeriodicReport from './pages/PeriodicReport'
import ProtectedRoute from './components/auth/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/credentials" element={<LoginCredentials />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/president-finance"
          element={
            <ProtectedRoute>
              <PresidentFinance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/director-finance"
          element={
            <ProtectedRoute>
              <DirectorFinance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/director-finance/:hospitalId"
          element={
            <ProtectedRoute>
              <DirectorFinance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/periodic-report"
          element={
            <ProtectedRoute>
              <PeriodicReport />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
