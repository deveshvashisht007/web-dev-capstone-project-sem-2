import React from 'react'
import { useTrips } from '../context/TripContext'

export default function About() {
  const { trips, expenses, resetData } = useTrips()

  function exportData() {
    const data = { trips, expenses }
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'})
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href=url; a.download='tripwise-data.json'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <header className="topbar"><h1 className="page-heading">About TripWise</h1></header>
      <div className="section" style={{marginTop:24}}>

        <div className="about-hero">
          <div style={{fontSize:56,marginBottom:16}}>✈️</div>
          <div className="about-title">TripWise</div>
          <div className="about-sub">A Smart Travel Planner built as a B.Tech First Year Capstone Project. Plan trips, track expenses, build itineraries — all in one place.</div>
        </div>

        <div className="section-head"><h2 className="section-title">Key Features</h2></div>
        <div className="features-grid" style={{marginBottom:28}}>
          {[
            {icon:'🗺',title:'Trip Management',desc:'Add, edit and delete trips with destination, dates, budget and status tracking.'},
            {icon:'📋',title:'Itinerary Planner',desc:'Build day-by-day schedules with activities, timings and categories.'},
            {icon:'💳',title:'Expense Tracker',desc:'Log expenses by category, filter by trip, and visualise budget vs spent.'},
            {icon:'🌦',title:'Weather Dashboard',desc:'Simulated weather for your destinations. Extendable to OpenWeatherMap API.'},
            {icon:'🔍',title:'Search & Filter',desc:'Search trips and expenses instantly. Filter by status and category.'},
            {icon:'💾',title:'Persistent Storage',desc:'All data saved in localStorage — no backend or database required.'},
          ].map(f=>(
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>

        <div className="tech-stack">
          <h3>Tech Stack</h3>
          <div className="tech-list">
            {['React 18','Vite','React Router v6','Context API','localStorage','CSS3 Variables','Google Fonts','GitHub Pages'].map(t=>(
              <span key={t} className="tech-badge">{t}</span>
            ))}
          </div>
        </div>

        <div className="tech-stack">
          <h3>Project Information</h3>
          <table className="data-table" style={{marginTop:8}}>
            <tbody>
              {[
                ['Project Name','TripWise – Smart Travel Planner'],
                ['Academic Year','B.Tech First Year'],
                ['Subject','Web Technology / Computer Programming'],
                ['Type','Capstone / Mini Project'],
                ['Frontend','React + Vite'],
                ['Deployment','GitHub Pages'],
                ['Pages','Dashboard, Trips, Itinerary, Expenses, Weather, About'],
              ].map(([k,v])=>(
                <tr key={k}><td style={{color:'var(--muted)',width:160}}>{k}</td><td>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="tech-stack">
          <h3>🚀 How to Deploy on GitHub Pages</h3>
          <ol style={{color:'var(--muted)',fontSize:13,lineHeight:2,paddingLeft:20,marginTop:10}}>
            <li>Run <code style={{color:'var(--green)'}}>npm run build</code> in your project folder</li>
            <li>Upload the <code style={{color:'var(--green)'}}>dist/</code> folder contents to a GitHub repo</li>
            <li>Go to <strong style={{color:'var(--text)'}}>Settings → Pages → Source: main / root</strong></li>
            <li>Your site goes live at <code style={{color:'var(--gold)'}}>https://yourusername.github.io/tripwise</code></li>
          </ol>
        </div>

        <div className="tech-stack" style={{borderColor:'rgba(242,107,107,0.2)'}}>
          <h3 style={{color:'var(--red)'}}>⚠️ Data Management</h3>
          <p style={{color:'var(--muted)',fontSize:13,margin:'10px 0 14px'}}>
            All data is stored in your browser's localStorage. Currently: <strong style={{color:'var(--text)'}}>{trips.length} trip(s)</strong>, <strong style={{color:'var(--text)'}}>{expenses.length} expense(s)</strong>.
          </p>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <button className="btn btn-danger" onClick={()=>{if(window.confirm('Reset all data to sample?'))resetData()}}>🗑️ Reset All Data</button>
            <button className="btn btn-ghost" onClick={exportData}>📤 Export Data (JSON)</button>
          </div>
        </div>
      </div>
    </>
  )
}
