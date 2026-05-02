import React, { useState } from 'react'
import Modal from './Modal'
import { useTrips, TRIP_EMOJIS, TRIP_COLORS } from '../context/TripContext'

const today     = () => new Date().toISOString().split('T')[0]
const nextWeek  = () => new Date(Date.now() + 7*86400000).toISOString().split('T')[0]

export default function AddTripModal({ open, onClose }) {
  const { addTrip, showToast } = useTrips()
  const [form, setForm] = useState({ name:'', dest:'', start:today(), end:nextWeek(), budget:'', status:'upcoming' })

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleSave() {
    if (!form.name.trim() || !form.dest.trim()) { showToast('⚠️ Fill in trip name & destination!'); return }
    addTrip({
      ...form,
      budget: parseFloat(form.budget) || 1000,
      emoji:  TRIP_EMOJIS[Math.floor(Math.random()*TRIP_EMOJIS.length)],
      color:  TRIP_COLORS[Math.floor(Math.random()*TRIP_COLORS.length)],
    })
    setForm({ name:'', dest:'', start:today(), end:nextWeek(), budget:'', status:'upcoming' })
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Plan a New Trip ✈️"
      footer={<>
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Create Trip 🚀</button>
      </>}>
      <div className="form-group">
        <label className="form-label">Trip Name</label>
        <input className="form-input" value={form.name} onChange={e=>set('name',e.target.value)} placeholder="e.g. Tokyo Adventure"/>
      </div>
      <div className="form-group">
        <label className="form-label">Destination</label>
        <input className="form-input" value={form.dest} onChange={e=>set('dest',e.target.value)} placeholder="e.g. Tokyo, Japan"/>
      </div>
      <div className="form-row-2">
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input className="form-input" type="date" value={form.start} onChange={e=>set('start',e.target.value)}/>
        </div>
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input className="form-input" type="date" value={form.end} onChange={e=>set('end',e.target.value)}/>
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Budget (USD)</label>
        <input className="form-input" type="number" value={form.budget} onChange={e=>set('budget',e.target.value)} placeholder="e.g. 3000"/>
      </div>
      <div className="form-group">
        <label className="form-label">Status</label>
        <select className="form-input" value={form.status} onChange={e=>set('status',e.target.value)}>
          <option value="upcoming">Upcoming</option>
          <option value="active">Active</option>
          <option value="past">Past</option>
        </select>
      </div>
    </Modal>
  )
}
