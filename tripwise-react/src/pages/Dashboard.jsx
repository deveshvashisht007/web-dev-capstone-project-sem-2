import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrips, fmtK, fmtMoney, fmtDate } from '../context/TripContext'
import TripCard from '../components/TripCard'
import AddTripModal from '../components/AddTripModal'

export default function Dashboard() {
  const { trips, expenses } = useTrips()
  const [search, setSearch]   = useState('')
  const [modal,  setModal]    = useState(false)
  const navigate = useNavigate()

  const totalBudget = trips.reduce((a,t)=>a+(t.budget||0),0)
  const totalSpent  = trips.reduce((a,t)=>a+(t.spent||0),0)
  const upcoming    = trips.filter(t=>t.status==='upcoming').length

  const recent = search
    ? trips.filter(t=>t.name.toLowerCase().includes(search.toLowerCase())||t.dest.toLowerCase().includes(search.toLowerCase()))
    : trips.slice(-3).reverse()

  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <h1 className="page-heading">Dashboard</h1>
        <div className="topbar-right">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search trips..."/>
          </div>
          <button className="btn btn-primary" onClick={()=>setModal(true)}>+ New Trip</button>
        </div>
      </header>

      {/* STATS */}
      <div className="stats-row">
        <div className="stat-card accent-gold">
          <div className="stat-icon">🗺</div>
          <div className="stat-body">
            <div className="stat-label">Total Trips</div>
            <div className="stat-value">{trips.length}</div>
          </div>
        </div>
        <div className="stat-card accent-blue">
          <div className="stat-icon">📅</div>
          <div className="stat-body">
            <div className="stat-label">Upcoming</div>
            <div className="stat-value">{upcoming}</div>
          </div>
        </div>
        <div className="stat-card accent-green">
          <div className="stat-icon">💰</div>
          <div className="stat-body">
            <div className="stat-label">Total Budget</div>
            <div className="stat-value">{fmtK(totalBudget)}</div>
          </div>
        </div>
        <div className="stat-card accent-red">
          <div className="stat-icon">💳</div>
          <div className="stat-body">
            <div className="stat-label">Total Spent</div>
            <div className="stat-value">{fmtK(totalSpent)}</div>
          </div>
        </div>
      </div>

      {/* RECENT TRIPS */}
      <div className="section" style={{marginTop:28}}>
        <div className="section-head">
          <h2 className="section-title">Recent Trips</h2>
          <button className="btn btn-ghost btn-sm" onClick={()=>navigate('/trips')}>View all →</button>
        </div>
        <div className="trips-grid">
          {recent.length
            ? recent.map(t=><TripCard key={t.id} trip={t}/>)
            : <div className="empty-state"><div className="empty-icon">✈️</div><div className="empty-title">No trips yet</div><p>Click "+ New Trip" to get started!</p></div>}
        </div>
      </div>

      {/* RECENT EXPENSES */}
      <div className="section" style={{marginTop:28}}>
        <div className="section-head">
          <h2 className="section-title">Recent Expenses</h2>
          <button className="btn btn-ghost btn-sm" onClick={()=>navigate('/expenses')}>View all →</button>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Trip</th><th style={{textAlign:'right'}}>Amount</th></tr></thead>
            <tbody>
              {expenses.slice(0,5).length
                ? expenses.slice(0,5).map(e=>(
                  <tr key={e.id}>
                    <td style={{color:'var(--muted)'}}>{e.date}</td>
                    <td>{e.desc}</td>
                    <td><span className={`cat-badge cat-${e.cat}`}>{e.cat}</span></td>
                    <td style={{color:'var(--muted)'}}>{e.tripName||'—'}</td>
                    <td className="amount-cell">{fmtMoney(e.amount)}</td>
                  </tr>))
                : <tr><td colSpan={5} style={{textAlign:'center',color:'var(--muted)',padding:32}}>No expenses yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AddTripModal open={modal} onClose={()=>setModal(false)}/>
    </>
  )
}
