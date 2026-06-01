import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DirectorFinance from './pages/DirectorFinance'
import PresidentFinance from './pages/PresidentFinance'
import PeriodicReport from './pages/PeriodicReport'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/president-finance" replace />} />
        <Route path="/president-finance" element={<PresidentFinance />} />
        <Route path="/director-finance" element={<DirectorFinance />} />
        <Route path="/director-finance/:hospitalId" element={<DirectorFinance />} />
        <Route path="/periodic-report" element={<PeriodicReport />} />
      </Routes>
    </BrowserRouter>
  )
}
