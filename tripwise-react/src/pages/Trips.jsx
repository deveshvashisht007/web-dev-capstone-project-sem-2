import React, { useState } from 'react'
import { useTrips } from '../context/TripContext'
import TripCard from '../components/TripCard'
import AddTripModal from '../components/AddTripModal'

const FILTERS = ['all','upcoming','active','past']

export default function Trips() {
  const { trips } = useTrips()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [modal,  setModal]  = useState(false)

  const filtered = trips
    .filter(t => filter === 'all' || t.status === filter)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.dest.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <header className="topbar">
        <h1 className="page-heading">My Trips</h1>
        <div className="topbar-right">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search trips..."/>
          </div>
          <button className="btn btn-primary" onClick={()=>setModal(true)}>+ New Trip</button>
        </div>
      </header>

      <div className="section" style={{marginTop:24}}>
        <div className="filter-bar">
          {FILTERS.map(f=>(
            <button key={f} className={`chip${filter===f?' active':''}`} onClick={()=>setFilter(f)}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
        <div className="trips-grid">
          {filtered.length
            ? filtered.map(t=><TripCard key={t.id} trip={t}/>)
            : <div className="empty-state"><div className="empty-icon">✈️</div><div className="empty-title">No trips found</div><p>Try a different filter or add a new trip!</p></div>}
        </div>
      </div>

      <AddTripModal open={modal} onClose={()=>setModal(false)}/>
    </>
  )
}
