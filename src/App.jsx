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
        <Route path="/" element={<ProtectedRoute isPublic><LandingPage /></ProtectedRoute>} />
        <Route path="/login" element={<ProtectedRoute isPublic><LoginPage /></ProtectedRoute>} />
        <Route path="/register" element={<ProtectedRoute isPublic><RegisterPage /></ProtectedRoute>} />
        <Route path="/room/:id" element={<ProtectedRoute isPublic><RoomDetails /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute isPublic><SearchResults /></ProtectedRoute>} />
        <Route path="/book/:roomId" element={<ProtectedRoute isPublic><BookingFlow /></ProtectedRoute>} />
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="guest">
            <GuestDashboard />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<ProtectedRoute isPublic><AboutPage /></ProtectedRoute>} />
        <Route path="/suites" element={<ProtectedRoute isPublic><SuitesPage /></ProtectedRoute>} />
        <Route path="/dining" element={<ProtectedRoute isPublic><DiningPage /></ProtectedRoute>} />
        <Route path="/spa" element={<ProtectedRoute isPublic><SpaPage /></ProtectedRoute>} />
        <Route path="/privacy" element={<ProtectedRoute isPublic><LegalPages type="privacy" /></ProtectedRoute>} />
        <Route path="/terms" element={<ProtectedRoute isPublic><LegalPages type="terms" /></ProtectedRoute>} />
        <Route path="/security" element={<ProtectedRoute isPublic><LegalPages type="security" /></ProtectedRoute>} />
        <Route path="/faq" element={<ProtectedRoute isPublic><LegalPages type="faq" /></ProtectedRoute>} />
        <Route path="/contact" element={<ProtectedRoute isPublic><ContactPage /></ProtectedRoute>} />
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
