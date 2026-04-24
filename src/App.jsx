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
import GuestDashboard from './pages/GuestDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import ContactPage from './pages/ContactPage'
import StatusPage from './pages/StatusPage'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<ProtectedRoute public><LandingPage /></ProtectedRoute>} />
        <Route path="/login" element={<ProtectedRoute public><LoginPage /></ProtectedRoute>} />
        <Route path="/register" element={<ProtectedRoute public><RegisterPage /></ProtectedRoute>} />
        <Route path="/room/:id" element={<ProtectedRoute public><RoomDetails /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute public><SearchResults /></ProtectedRoute>} />
        <Route path="/book/:roomId" element={<ProtectedRoute public><BookingFlow /></ProtectedRoute>} />
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="guest">
            <GuestDashboard />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<ProtectedRoute public><AboutPage /></ProtectedRoute>} />
        <Route path="/suites" element={<ProtectedRoute public><SuitesPage /></ProtectedRoute>} />
        <Route path="/dining" element={<ProtectedRoute public><DiningPage /></ProtectedRoute>} />
        <Route path="/spa" element={<ProtectedRoute public><SpaPage /></ProtectedRoute>} />
        <Route path="/privacy" element={<ProtectedRoute public><LegalPages type="privacy" /></ProtectedRoute>} />
        <Route path="/terms" element={<ProtectedRoute public><LegalPages type="terms" /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute public><LegalPages type="security" /></ProtectedRoute>} />
        <Route path="/faq" element={<ProtectedRoute public><LegalPages type="faq" /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute public><ContactPage /></ProtectedRoute>} />
        <Route path="/status" element={
          <ProtectedRoute requiredRole="staff">
            <StatusPage />
          </ProtectedRoute>
        } />
        
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
    </>
  )
}

export default App
