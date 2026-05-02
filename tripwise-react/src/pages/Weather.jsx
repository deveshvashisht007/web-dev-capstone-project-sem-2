import React, { useState } from 'react'
import { useTrips } from '../context/TripContext'
import Modal from '../components/Modal'

const POPULAR = [
  {city:'Tokyo',    country:'Japan',     emoji:'🌸', temp:24,desc:'Clear skies',      humidity:68,wind:10},
  {city:'Paris',    country:'France',    emoji:'🌤', temp:17,desc:'Mostly sunny',     humidity:55,wind:8},
  {city:'New York', country:'USA',       emoji:'☀️', temp:21,desc:'Clear & breezy',   humidity:50,wind:18},
  {city:'Dubai',    country:'UAE',       emoji:'🌞', temp:38,desc:'Hot & sunny',      humidity:32,wind:6},
  {city:'Bali',     country:'Indonesia', emoji:'🌦', temp:30,desc:'Tropical showers', humidity:85,wind:14},
  {city:'London',   country:'UK',        emoji:'🌧', temp:13,desc:'Light rain',       humidity:82,wind:22},
  {city:'Sydney',   country:'Australia', emoji:'⛅', temp:20,desc:'Partly cloudy',    humidity:60,wind:16},
  {city:'Bangkok',  country:'Thailand',  emoji:'🌤', temp:33,desc:'Warm & humid',     humidity:78,wind:9},
]
const jitter = (n,r=3) => Math.round(n+(Math.random()-.5)*r*2)

export default function Weather() {
  const { trips } = useTrips()
  const [popular,   setPopular]   = useState(POPULAR)
  const [extra,     setExtra]     = useState(() => JSON.parse(localStorage.getItem('tw_extra_cities')||'[]'))
  const [modal,     setModal]     = useState(false)
  const [newCity,   setNewCity]   = useState('')
  const [newCountry,setNewCountry]= useState('')
  const [lastUpdate,setLastUpdate]= useState(new Date().toLocaleTimeString())

  function refresh() {
    setPopular(p=>p.map(w=>({...w,temp:jitter(w.temp),humidity:jitter(w.humidity,5),wind:jitter(w.wind,3)})))
    setLastUpdate(new Date().toLocaleTimeString())
  }

  function addCity() {
    if (!newCity.trim()) return
    const EMOJIS=['🌍','🌏','🌎','🏙','🌃','🌆']
    const w={city:newCity,country:newCountry||'Unknown',emoji:EMOJIS[Math.floor(Math.random()*EMOJIS.length)],temp:Math.round(15+Math.random()*25),desc:'Partly cloudy',humidity:Math.round(40+Math.random()*40),wind:Math.round(5+Math.random()*20)}
    const next=[...extra,w]
    setExtra(next)
    localStorage.setItem('tw_extra_cities',JSON.stringify(next))
    setNewCity(''); setNewCountry(''); setModal(false)
  }

  const WeatherCard = ({w}) => (
    <div className="weather-card">
      <div className="wc-emoji">{w.emoji}</div>
      <div className="wc-city">{w.city}</div>
      <div className="wc-country">{w.country}</div>
      <div className="wc-temp">{w.temp}°C</div>
      <div className="wc-desc">{w.desc}</div>
      <div className="wc-meta"><span>💧 {w.humidity}%</span><span>💨 {w.wind} km/h</span></div>
    </div>
  )

  const tripWeather = trips.map(t=>({
    city: t.dest.split(',')[0].trim(), country:(t.dest.split(',')[1]||'').trim(),
    emoji:t.emoji||'🌤', temp:jitter(22), desc:'Great travel weather', humidity:jitter(60,10), wind:jitter(12,5)
  }))

  return (
    <>
      <header className="topbar">
        <h1 className="page-heading">Weather at Destinations</h1>
        <div className="topbar-right">
          <button className="btn btn-ghost btn-sm" onClick={refresh}>↻ Refresh</button>
          <button className="btn btn-primary" onClick={()=>setModal(true)}>+ Add City</button>
        </div>
      </header>

      <div className="section" style={{marginTop:24}}>
        <p style={{color:'var(--muted)',fontSize:13,marginBottom:20}}>
          🌐 Weather data is simulated. Connect to <a href="https://openweathermap.org/api" target="_blank" rel="noreferrer" style={{color:'var(--gold)'}}>OpenWeatherMap API</a> for live data. See README.md.
        </p>

        {trips.length > 0 && <>
          <div className="section-head" style={{marginBottom:14}}><h2 className="section-title">Your Trip Destinations</h2></div>
          <div className="weather-grid" style={{marginBottom:28}}>
            {tripWeather.map((w,i)=><WeatherCard key={i} w={w}/>)}
          </div>
        </>}

        <div className="section-head" style={{marginBottom:14}}><h2 className="section-title">Popular Destinations</h2></div>
        <div className="weather-grid">
          {[...popular,...extra].map((w,i)=><WeatherCard key={i} w={w}/>)}
        </div>
        <p style={{color:'var(--muted)',fontSize:12,marginTop:20}}>Last updated: {lastUpdate}</p>
      </div>

      <Modal open={modal} onClose={()=>setModal(false)} title="Add City 🌍"
        footer={<>
          <button className="btn btn-ghost" onClick={()=>setModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={addCity}>Add City</button>
        </>}>
        <div className="form-group"><label className="form-label">City Name</label><input className="form-input" value={newCity} onChange={e=>setNewCity(e.target.value)} placeholder="e.g. London"/></div>
        <div className="form-group"><label className="form-label">Country</label><input className="form-input" value={newCountry} onChange={e=>setNewCountry(e.target.value)} placeholder="e.g. UK"/></div>
      </Modal>
    </>
  )
}
