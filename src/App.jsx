import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminPanel from './pages/AdminPanel'
import EmployeePanel from './pages/EmployeePanel'
import RoomDetails from './pages/RoomDetails'
import AboutPage from './pages/AboutPage'
import SuitesPage from './pages/SuitesPage'
import DiningPage from './pages/DiningPage'
import SpaPage from './pages/SpaPage'
import LegalPages from './pages/LegalPages'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/room/:id" element={<RoomDetails />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/suites" element={<SuitesPage />} />
      <Route path="/dining" element={<DiningPage />} />
      <Route path="/spa" element={<SpaPage />} />
      <Route path="/privacy" element={<LegalPages type="privacy" />} />
      <Route path="/terms" element={<LegalPages type="terms" />} />
      <Route path="/admin/*" element={<AdminPanel />} />
      <Route path="/staff/*" element={<EmployeePanel />} />
    </Routes>
  )
}

export default App
