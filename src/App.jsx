import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import DirectorFinance from './pages/DirectorFinance'
import PresidentFinance from './pages/PresidentFinance'
import PeriodicReport from './pages/PeriodicReport'
import UrgentCirculars from './pages/UrgentCirculars'
import News from './pages/News'
import Meetings from './pages/Meetings'
import Mailbox from './pages/Mailbox'
import Statistics from './pages/Statistics'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/president-finance" replace />} />
        <Route path="/urgent" element={<UrgentCirculars />} />
        <Route path="/news" element={<News />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/mailbox" element={<Mailbox />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/president-finance" element={<PresidentFinance />} />
        <Route path="/director-finance" element={<DirectorFinance />} />
        <Route path="/director-finance/:hospitalId" element={<DirectorFinance />} />
        <Route path="/periodic-report" element={<PeriodicReport />} />
      </Routes>
    </BrowserRouter>
  )
}
