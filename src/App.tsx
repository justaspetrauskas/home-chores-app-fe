import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import Home from './pages/Home'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import Households from './pages/Households'
import CreateHousehold from './components/households/CreateHousehold'
import HouseholdDetails from './pages/HouseholdDetails'
import ManageRooms from './pages/ManageRooms'
import ManageEvents from './pages/ManageEvents'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Auth />} />
      <Route path="/register" element={<Auth />} />

      <Route element={<ProtectedRoute />}> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/households" element={<Households />}>
          <Route path="new" element={<CreateHousehold />} />
          <Route path=":householdId" element={<HouseholdDetails />} />
          <Route path=":householdId/manage-rooms" element={<ManageRooms />} />
          <Route path=":householdId/manage-events" element={<ManageEvents />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
