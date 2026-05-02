import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTrips, fmtMoney } from '../context/TripContext'
import Modal from '../components/Modal'

const today = () => new Date().toISOString().split('T')[0]

export default function Expenses() {
  const { trips, expenses, addExpense, deleteExpense, showToast } = useTrips()
  const [params] = useSearchParams()
  const [tripFilter, setTripFilter] = useState(params.get('trip')||'all')
  const [catFilter,  setCatFilter]  = useState('all')
  const [search,     setSearch]     = useState('')
  const [modal,      setModal]      = useState(false)
  const [form, setForm] = useState({ desc:'', amount:'', date:today(), cat:'hotel', tripId:'' })

  function set(k,v) { setForm(f=>({...f,[k]:v})) }

  const filtered = expenses
    .filter(e=>tripFilter==='all'||String(e.tripId)===tripFilter)
    .filter(e=>catFilter==='all'||e.cat===catFilter)
    .filter(e=>!search||e.desc.toLowerCase().includes(search.toLowerCase()))

  const budgetTrips = tripFilter==='all' ? trips : trips.filter(t=>String(t.id)===tripFilter)
  const totalBudget = budgetTrips.reduce((a,t)=>a+(t.budget||0),0)
  const totalSpent  = filtered.reduce((a,e)=>a+parseFloat(e.amount||0),0)
  const remaining   = totalBudget - totalSpent

  function handleSave() {
    if (!form.desc.trim()||!form.amount) { showToast('⚠️ Fill in description and amount!'); return }
    const tripId = parseInt(form.tripId)||trips[0]?.id
    const trip   = trips.find(t=>t.id===tripId)
    addExpense({ desc:form.desc, amount:parseFloat(form.amount), date:form.date, cat:form.cat, tripId, tripName:trip?.name||'—' })
    setForm({ desc:'', amount:'', date:today(), cat:'hotel', tripId:'' })
    setModal(false)
  }

  return (
    <>
      <header className="topbar">
        <h1 className="page-heading">Expense Tracker</h1>
        <div className="topbar-right">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search expenses..."/>
          </div>
          <button className="btn btn-primary" onClick={()=>setModal(true)}>+ Add Expense</button>
        </div>
      </header>

      <div className="section" style={{marginTop:24}}>
        {/* SUMMARY */}
        <div className="exp-summary">
          <div className="exp-sum-card"><div className="exp-sum-label">Total Budget</div><div className="exp-sum-val">{fmtMoney(totalBudget)}</div></div>
          <div className="exp-sum-card"><div className="exp-sum-label">Total Spent</div><div className="exp-sum-val" style={{color:'var(--red)'}}>{fmtMoney(totalSpent)}</div></div>
          <div className="exp-sum-card"><div className="exp-sum-label">Remaining</div><div className="exp-sum-val" style={{color:remaining>=0?'var(--green)':'var(--red)'}}>{fmtMoney(remaining)}</div></div>
        </div>

        {/* FILTERS */}
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:16,flexWrap:'wrap'}}>
          <select className="form-input" style={{maxWidth:200}} value={tripFilter} onChange={e=>setTripFilter(e.target.value)}>
            <option value="all">All Trips</option>
            {trips.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select className="form-input" style={{maxWidth:140}} value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {['hotel','food','transport','activity','other'].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* TABLE */}
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Date</th><th>Description</th><th>Category</th><th>Trip</th><th style={{textAlign:'right'}}>Amount</th><th style={{textAlign:'center'}}>Action</th></tr></thead>
            <tbody>
              {filtered.length
                ? filtered.map(e=>(
                  <tr key={e.id}>
                    <td style={{color:'var(--muted)'}}>{e.date}</td>
                    <td>{e.desc}</td>
                    <td><span className={`cat-badge cat-${e.cat}`}>{e.cat}</span></td>
                    <td style={{color:'var(--muted)'}}>{e.tripName||'—'}</td>
                    <td className="amount-cell">{fmtMoney(e.amount)}</td>
                    <td style={{textAlign:'center'}}>
                      <button className="btn btn-danger btn-sm" onClick={()=>deleteExpense(e.id)}>✕</button>
                    </td>
                  </tr>))
                : <tr><td colSpan={6} style={{textAlign:'center',color:'var(--muted)',padding:32}}>No expenses found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title="Add Expense 💳"
        footer={<>
          <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Expense</button>
        </>}>
        <div className="form-group"><label className="form-label">Description</label><input className="form-input" value={form.desc} onChange={e=>set('desc',e.target.value)} placeholder="e.g. Hotel booking"/></div>
        <div className="form-row-2">
          <div className="form-group"><label className="form-label">Amount (USD)</label><input className="form-input" type="number" value={form.amount} onChange={e=>set('amount',e.target.value)} placeholder="0.00"/></div>
          <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.date} onChange={e=>set('date',e.target.value)}/></div>
        </div>
        <div className="form-group"><label className="form-label">Category</label>
          <select className="form-input" value={form.cat} onChange={e=>set('cat',e.target.value)}>
            {['hotel','food','transport','activity','other'].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">Trip</label>
          <select className="form-input" value={form.tripId||trips[0]?.id} onChange={e=>set('tripId',e.target.value)}>
            {trips.map(t=><option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </Modal>
    </>
  )
}
