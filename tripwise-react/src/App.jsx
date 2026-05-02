import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { TripProvider } from './context/TripContext'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Trips from './pages/Trips'
import Itinerary from './pages/Itinerary'
import Expenses from './pages/Expenses'
import Weather from './pages/Weather'
import About from './pages/About'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <TripProvider>
      <div className="app-layout">
        <Sidebar open={sidebarOpen} onClose={()=>setSidebarOpen(false)}/>
        <main className="main-content">
          {/* mobile menu toggle injected into each page's topbar via CSS */}
          <button className="menu-toggle" style={{position:'fixed',top:18,left:16,zIndex:60}} onClick={()=>setSidebarOpen(o=>!o)}>☰</button>
          <Routes>
            <Route path="/"          element={<Dashboard/>}/>
            <Route path="/trips"     element={<Trips/>}/>
            <Route path="/itinerary" element={<Itinerary/>}/>
            <Route path="/expenses"  element={<Expenses/>}/>
            <Route path="/weather"   element={<Weather/>}/>
            <Route path="/about"     element={<About/>}/>
          </Routes>
        </main>
      </div>
    </TripProvider>
  )
}
