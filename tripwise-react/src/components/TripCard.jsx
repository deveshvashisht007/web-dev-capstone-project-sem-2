import React from 'react'
import { useNavigate } from 'react-router-dom'
import { fmtMoney, fmtDate, nights, pct } from '../context/TripContext'
import { useTrips } from '../context/TripContext'

export default function TripCard({ trip, showActions = true }) {
  const { deleteTrip } = useTrips()
  const navigate = useNavigate()
  const p = pct(trip.spent, trip.budget)
  const n = nights(trip.start, trip.end)

  function handleDelete(e) {
    e.stopPropagation()
    if (window.confirm('Delete this trip and all its data?')) deleteTrip(trip.id)
  }

  return (
    <div className="trip-card">
      <div className="trip-thumb" style={{ background: trip.color || '#132240' }}>
        <span style={{ fontSize: 48 }}>{trip.emoji || '✈️'}</span>
        <span className={`trip-status-badge status-${trip.status}`}>{trip.status}</span>
      </div>
      <div className="trip-body">
        <div className="trip-name">{trip.name}</div>
        <div className="trip-meta">
          <span>📍 {trip.dest}</span>
          <span>🌙 {n} nights</span>
        </div>
        <div className="trip-meta" style={{ marginTop: 4 }}>
          <span>📅 {fmtDate(trip.start)} – {fmtDate(trip.end)}</span>
        </div>
        <div className="budget-bar">
          <div className="budget-labels">
            <span>{fmtMoney(trip.spent)} spent</span>
            <span>Budget: {fmtMoney(trip.budget)}</span>
          </div>
          <div className="bar-track">
            <div className={`bar-fill${p >= 100 ? ' over' : ''}`} style={{ width: `${p}%` }} />
          </div>
        </div>
        {showActions && (
          <div className="trip-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/itinerary?trip=${trip.id}`)}>📋 Itinerary</button>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/expenses?trip=${trip.id}`)}>💳 Expenses</button>
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>✕ Delete</button>
          </div>
        )}
      </div>
    </div>
  )
}
