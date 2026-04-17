import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminPanel from './pages/AdminPanel'
import EmployeePanel from './pages/EmployeePanel'
import RoomDetails from './pages/RoomDetails'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/room/:id" element={<RoomDetails />} />
      <Route path="/admin/*" element={<AdminPanel />} />
      <Route path="/staff/*" element={<EmployeePanel />} />
    </Routes>
  )
}

export default App
