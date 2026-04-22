import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminPanel from './pages/AdminPanel'
import StaffPanel from './pages/StaffPanel'
import RoomDetails from './pages/RoomDetails'
import AboutPage from './pages/AboutPage'
import SuitesPage from './pages/SuitesPage'
import DiningPage from './pages/DiningPage'
import SpaPage from './pages/SpaPage'
import LegalPages from './pages/LegalPages'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SearchResults from './pages/SearchResults'
import BookingFlow from './pages/BookingFlow'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/room/:id" element={<RoomDetails />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/book/:roomId" element={<BookingFlow />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/suites" element={<SuitesPage />} />
      <Route path="/dining" element={<DiningPage />} />
      <Route path="/spa" element={<SpaPage />} />
      <Route path="/privacy" element={<LegalPages type="privacy" />} />
      <Route path="/terms" element={<LegalPages type="terms" />} />
      
      <Route path="/admin/*" element={
        <ProtectedRoute requiredRole="admin">
          <AdminPanel />
        </ProtectedRoute>
      } />
      
      <Route path="/staff/*" element={
        <ProtectedRoute requiredRole="staff">
          <StaffPanel />
        </ProtectedRoute>
      } />

      {/* Catch-all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
