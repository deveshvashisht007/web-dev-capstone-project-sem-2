import React from 'react'
import { NavLink } from 'react-router-dom'
import { useTrips } from '../context/TripContext'

export default function Sidebar({ open, onClose }) {
  const { trips } = useTrips()

  return (
    <>
      {open && <div style={{position:'fixed',inset:0,zIndex:49,background:'rgba(0,0,0,0.4)'}} onClick={onClose}/>}
      <aside className={`sidebar${open?' open':''}`}>
        <div className="logo">
          <span className="logo-icon">✈</span>
          <div>
            <div className="logo-text">TripWise</div>
            <div className="logo-sub">Smart Travel Planner</div>
          </div>
        </div>

        <nav className="nav" onClick={onClose}>
          <span className="nav-label">Main Menu</span>
          <NavLink to="/"          className={({isActive})=>`nav-item${isActive?' active':''}`} end><span className="nav-icon">⊞</span> Dashboard</NavLink>
          <NavLink to="/trips"     className={({isActive})=>`nav-item${isActive?' active':''}`}><span className="nav-icon">✦</span> My Trips <span className="nav-badge">{trips.length}</span></NavLink>
          <NavLink to="/itinerary" className={({isActive})=>`nav-item${isActive?' active':''}`}><span className="nav-icon">◉</span> Itinerary</NavLink>
          <NavLink to="/expenses"  className={({isActive})=>`nav-item${isActive?' active':''}`}><span className="nav-icon">◐</span> Expenses</NavLink>
          <NavLink to="/weather"   className={({isActive})=>`nav-item${isActive?' active':''}`}><span className="nav-icon">◎</span> Weather</NavLink>
          <span className="nav-label" style={{marginTop:20}}>Account</span>
          <NavLink to="/about"     className={({isActive})=>`nav-item${isActive?' active':''}`}><span className="nav-icon">ℹ</span> About</NavLink>
        </nav>

        <div className="sidebar-weather">
          <div className="sw-icon">⛅</div>
          <div>
            <div className="sw-temp">28°C</div>
            <div className="sw-loc">Delhi · Partly Cloudy</div>
          </div>
        </div>
      </aside>
    </>
  )
}
