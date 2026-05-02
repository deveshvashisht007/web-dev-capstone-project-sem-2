import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTrips } from '../context/TripContext'
import Modal from '../components/Modal'

export default function Itinerary() {
  const { trips, itineraries, addActivity, addDay, showToast } = useTrips()
  const [params] = useSearchParams()
  const defaultTrip = params.get('trip') ? parseInt(params.get('trip')) : (trips[0]?.id || '')
  const [selectedTrip, setSelectedTrip] = useState(defaultTrip)
  const [actInputs, setActInputs]       = useState({})
  const [dayModal, setDayModal]         = useState(false)
  const [newDayTitle, setNewDayTitle]   = useState('')

  const days = itineraries[selectedTrip] || []

  function setActField(dayIdx, field, val) {
    setActInputs(prev=>({...prev,[dayIdx]:{...(prev[dayIdx]||{}), [field]:val}}))
  }
  function handleAddActivity(dayIdx) {
    const name = (actInputs[dayIdx]?.name||'').trim()
    const time = actInputs[dayIdx]?.time || '12:00'
    const cat  = actInputs[dayIdx]?.cat  || 'Sightseeing'
    if (!name) { showToast('⚠️ Enter an activity name!'); return }
    addActivity(selectedTrip, dayIdx, {time,name,cat,color:''})
    setActInputs(prev=>({...prev,[dayIdx]:{name:'',time:'',cat:'Sightseeing'}}))
  }
  function handleAddDay() {
    if (!newDayTitle.trim()) { showToast('⚠️ Enter a day title!'); return }
    addDay(selectedTrip, newDayTitle)
    setNewDayTitle('')
    setDayModal(false)
  }

  return (
    <>
      <header className="topbar">
        <h1 className="page-heading">Itinerary Planner</h1>
        <div className="topbar-right">
          <button className="btn btn-primary" onClick={()=>setDayModal(true)}>+ Add Day</button>
        </div>
      </header>

      <div className="section" style={{marginTop:24}}>
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:24,flexWrap:'wrap'}}>
          <label className="form-label" style={{margin:0}}>Select Trip:</label>
          <select className="form-input" style={{maxWidth:280}} value={selectedTrip} onChange={e=>setSelectedTrip(parseInt(e.target.value))}>
            {trips.map(t=><option key={t.id} value={t.id}>{t.emoji} {t.name}</option>)}
          </select>
        </div>

        {!trips.length
          ? <div className="empty-state"><div className="empty-icon">🗺</div><div className="empty-title">No trips yet</div><p>Add a trip first.</p></div>
          : !days.length
          ? <div className="empty-state"><div className="empty-icon">📋</div><div className="empty-title">No itinerary yet</div><p>Click "+ Add Day" to start planning.</p></div>
          : days.map((d,di)=>(
            <div key={di} className="day-card">
              <div className="day-header">
                <div>
                  <div className="day-label">{d.day}</div>
                  <div className="day-title">{d.title}</div>
                </div>
                <span style={{color:'var(--muted)',fontSize:12}}>{d.activities.length} activities</span>
              </div>
              <div className="day-body">
                {d.activities.map((a,ai)=>(
                  <div key={ai} className="activity-row">
                    <div className="act-time">{a.time}</div>
                    <div className={`act-dot${a.color?' '+a.color:''}`}/>
                    <div><div className="act-name">{a.name}</div><div className="act-cat">{a.cat}</div></div>
                  </div>
                ))}
                <div className="add-act-row">
                  <input className="form-input" style={{fontSize:13,padding:'7px 10px'}}
                    placeholder="Add activity..." value={actInputs[di]?.name||''}
                    onChange={e=>setActField(di,'name',e.target.value)}
                    onKeyDown={e=>e.key==='Enter'&&handleAddActivity(di)}/>
                  <input className="form-input" style={{width:80,fontSize:13,padding:'7px 10px'}}
                    placeholder="Time" value={actInputs[di]?.time||''}
                    onChange={e=>setActField(di,'time',e.target.value)}/>
                  <select className="form-input" style={{width:110,fontSize:13,padding:'7px 10px'}}
                    value={actInputs[di]?.cat||'Sightseeing'}
                    onChange={e=>setActField(di,'cat',e.target.value)}>
                    {['Sightseeing','Food','Transport','Hotel','Shopping','Culture','Activity','Business'].map(c=><option key={c}>{c}</option>)}
                  </select>
                  <button className="btn btn-ghost btn-sm" onClick={()=>handleAddActivity(di)}>+ Add</button>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <Modal open={dayModal} onClose={()=>setDayModal(false)} title="Add New Day 📅"
        footer={<>
          <button className="btn btn-ghost" onClick={()=>setDayModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAddDay}>Add Day</button>
        </>}>
        <div className="form-group">
          <label className="form-label">Day Title</label>
          <input className="form-input" value={newDayTitle} onChange={e=>setNewDayTitle(e.target.value)} placeholder="e.g. Cultural Exploration" onKeyDown={e=>e.key==='Enter'&&handleAddDay()}/>
        </div>
      </Modal>
    </>
  )
}
