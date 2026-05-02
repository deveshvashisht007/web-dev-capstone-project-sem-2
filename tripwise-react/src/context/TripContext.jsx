import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const TripContext = createContext()

const SEED_TRIPS = [
  { id:1001, name:'Tokyo Adventure', dest:'Tokyo, Japan',     start:'2025-08-10', end:'2025-08-24', budget:4500, spent:990,  status:'upcoming', emoji:'🗼', color:'#132240' },
  { id:1002, name:'Paris Getaway',   dest:'Paris, France',    start:'2025-10-02', end:'2025-10-10', budget:3200, spent:595,  status:'upcoming', emoji:'🥐', color:'#261633' },
  { id:1003, name:'Bali Retreat',    dest:'Bali, Indonesia',  start:'2025-03-15', end:'2025-03-25', budget:2800, spent:2620, status:'past',     emoji:'🌴', color:'#0e2a1a' },
  { id:1004, name:'NYC Business',    dest:'New York, USA',    start:'2025-05-01', end:'2025-05-05', budget:1900, spent:1100, status:'active',   emoji:'🗽', color:'#1e1e10' },
]
const SEED_EXPENSES = [
  { id:2001, desc:'Hotel Shinjuku Plaza', cat:'hotel',    tripId:1001, tripName:'Tokyo Adventure', date:'2025-08-10', amount:680 },
  { id:2002, desc:'JR Pass (14 days)',    cat:'transport',tripId:1001, tripName:'Tokyo Adventure', date:'2025-08-10', amount:310 },
  { id:2003, desc:'Hotel Le Marais',      cat:'hotel',    tripId:1002, tripName:'Paris Getaway',   date:'2025-10-02', amount:540 },
  { id:2004, desc:'Louvre Museum',        cat:'activity', tripId:1002, tripName:'Paris Getaway',   date:'2025-10-03', amount:17  },
  { id:2005, desc:'Café de Flore',        cat:'food',     tripId:1002, tripName:'Paris Getaway',   date:'2025-10-03', amount:38  },
  { id:2006, desc:'Villa Ubud',           cat:'hotel',    tripId:1003, tripName:'Bali Retreat',    date:'2025-03-15', amount:420 },
  { id:2007, desc:'Surf Lessons',         cat:'activity', tripId:1003, tripName:'Bali Retreat',    date:'2025-03-17', amount:95  },
  { id:2008, desc:'Times Square Hotel',   cat:'hotel',    tripId:1004, tripName:'NYC Business',    date:'2025-05-01', amount:380 },
  { id:2009, desc:'Yellow Cab',           cat:'transport',tripId:1004, tripName:'NYC Business',    date:'2025-05-01', amount:45  },
]
const SEED_ITINERARIES = {
  1001: [
    { day:'Day 1', title:'Arrival & Shinjuku', activities:[
      {time:'14:00',name:'Arrive Narita Airport',cat:'Transport',color:'blue'},
      {time:'17:00',name:'Check-in Hotel Shinjuku Plaza',cat:'Hotel',color:'green'},
      {time:'19:30',name:'Explore Kabukicho & dinner',cat:'Food',color:''},
    ]},
    { day:'Day 2', title:'Temples & Culture', activities:[
      {time:'08:00',name:'Senso-ji Temple, Asakusa',cat:'Sightseeing',color:''},
      {time:'11:00',name:'Ueno Park & Museum',cat:'Culture',color:'green'},
      {time:'14:00',name:'Akihabara Electronics District',cat:'Shopping',color:'blue'},
      {time:'19:00',name:'Ramen at Ichiran',cat:'Food',color:''},
    ]},
    { day:'Day 3', title:'Mt. Fuji Day Trip', activities:[
      {time:'07:00',name:'Bullet train to Fuji-Q',cat:'Transport',color:'blue'},
      {time:'11:00',name:'Fuji Five Lakes',cat:'Sightseeing',color:''},
      {time:'18:00',name:'Return to Tokyo',cat:'Transport',color:'blue'},
    ]},
  ],
  1002: [
    { day:'Day 1', title:'Bonjour Paris', activities:[
      {time:'12:00',name:'Arrive CDG Airport',cat:'Transport',color:'blue'},
      {time:'15:00',name:'Hotel Le Marais check-in',cat:'Hotel',color:'green'},
      {time:'20:00',name:'Café de Flore dinner',cat:'Food',color:''},
    ]},
    { day:'Day 2', title:'Art & Icons', activities:[
      {time:'09:00',name:'Louvre Museum',cat:'Culture',color:'green'},
      {time:'14:00',name:'Eiffel Tower visit',cat:'Sightseeing',color:''},
      {time:'17:00',name:'Champs-Élysées stroll',cat:'Shopping',color:'blue'},
    ]},
  ],
  1003: [
    { day:'Day 1', title:'Bali Arrival', activities:[
      {time:'13:00',name:'Land at Ngurah Rai Airport',cat:'Transport',color:'blue'},
      {time:'16:00',name:'Villa Ubud check-in',cat:'Hotel',color:'green'},
      {time:'19:00',name:'Warung dinner',cat:'Food',color:''},
    ]},
  ],
  1004: [
    { day:'Day 1', title:'NYC Arrival', activities:[
      {time:'10:00',name:'Land at JFK',cat:'Transport',color:'blue'},
      {time:'13:00',name:'Times Square Hotel check-in',cat:'Hotel',color:'green'},
      {time:'15:00',name:'Client meeting — Midtown',cat:'Business',color:''},
    ]},
  ],
}

function load(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback }
  catch { return fallback }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

export function TripProvider({ children }) {
  const [trips,       setTripsState]      = useState(() => load('tw_trips', null))
  const [expenses,    setExpensesState]   = useState(() => load('tw_expenses', null))
  const [itineraries, setItinState]       = useState(() => load('tw_itineraries', null))
  const [toast,       setToast]           = useState(null)

  // seed on first run
  useEffect(() => {
    if (!localStorage.getItem('tw_seeded')) {
      setTripsState(SEED_TRIPS)
      setExpensesState(SEED_EXPENSES)
      setItinState(SEED_ITINERARIES)
      save('tw_trips', SEED_TRIPS)
      save('tw_expenses', SEED_EXPENSES)
      save('tw_itineraries', SEED_ITINERARIES)
      localStorage.setItem('tw_seeded', '1')
    }
  }, [])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2800)
  }, [])

  // trips
  const addTrip = useCallback((trip) => {
    const t = { ...trip, id: Date.now(), spent: 0 }
    setTripsState(prev => {
      const next = [...prev, t]
      save('tw_trips', next)
      return next
    })
    setItinState(prev => {
      const next = { ...prev, [t.id]: [{ day:'Day 1', title:'Arrival', activities:[{time:'12:00',name:'Arrive at destination',cat:'Transport',color:'blue'}] }] }
      save('tw_itineraries', next)
      return next
    })
    showToast(`✅ Trip "${trip.name}" created!`)
    return t
  }, [showToast])

  const deleteTrip = useCallback((id) => {
    setTripsState(prev => { const next = prev.filter(t => t.id !== id); save('tw_trips', next); return next })
    setExpensesState(prev => { const next = prev.filter(e => e.tripId !== id); save('tw_expenses', next); return next })
    setItinState(prev => { const next = { ...prev }; delete next[id]; save('tw_itineraries', next); return next })
    showToast('🗑️ Trip deleted.')
  }, [showToast])

  // expenses
  const addExpense = useCallback((exp) => {
    const e = { ...exp, id: Date.now() }
    setExpensesState(prev => { const next = [e, ...prev]; save('tw_expenses', next); return next })
    setTripsState(prev => {
      const next = prev.map(t => t.id === exp.tripId ? { ...t, spent: (t.spent||0) + parseFloat(exp.amount) } : t)
      save('tw_trips', next)
      return next
    })
    showToast('✅ Expense saved!')
  }, [showToast])

  const deleteExpense = useCallback((id) => {
    const exp = expenses.find(e => e.id === id)
    setExpensesState(prev => { const next = prev.filter(e => e.id !== id); save('tw_expenses', next); return next })
    if (exp) {
      setTripsState(prev => {
        const next = prev.map(t => t.id === exp.tripId ? { ...t, spent: Math.max(0,(t.spent||0)-parseFloat(exp.amount)) } : t)
        save('tw_trips', next)
        return next
      })
    }
    showToast('🗑️ Expense deleted.')
  }, [expenses, showToast])

  // itinerary
  const addActivity = useCallback((tripId, dayIdx, activity) => {
    setItinState(prev => {
      const days = [...(prev[tripId] || [])]
      if (!days[dayIdx]) return prev
      days[dayIdx] = { ...days[dayIdx], activities: [...days[dayIdx].activities, activity] }
      const next = { ...prev, [tripId]: days }
      save('tw_itineraries', next)
      return next
    })
    showToast('✅ Activity added!')
  }, [showToast])

  const addDay = useCallback((tripId, title) => {
    setItinState(prev => {
      const days = prev[tripId] || []
      const next = { ...prev, [tripId]: [...days, { day:`Day ${days.length+1}`, title, activities:[] }] }
      save('tw_itineraries', next)
      return next
    })
    showToast('✅ Day added!')
  }, [showToast])

  const resetData = useCallback(() => {
    setTripsState(SEED_TRIPS); save('tw_trips', SEED_TRIPS)
    setExpensesState(SEED_EXPENSES); save('tw_expenses', SEED_EXPENSES)
    setItinState(SEED_ITINERARIES); save('tw_itineraries', SEED_ITINERARIES)
    localStorage.setItem('tw_seeded','1')
    showToast('✅ Data reset to sample!')
  }, [showToast])

  return (
    <TripContext.Provider value={{ trips:trips||[], expenses:expenses||[], itineraries:itineraries||{}, addTrip, deleteTrip, addExpense, deleteExpense, addActivity, addDay, resetData, showToast }}>
      {children}
      {toast && <div className="toast">{toast}</div>}
    </TripContext.Provider>
  )
}

export function useTrips() { return useContext(TripContext) }

// utils
export const fmtMoney = n => '$' + Number(n||0).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:0})
export const fmtK     = n => n >= 1000 ? '$'+(n/1000).toFixed(1)+'k' : fmtMoney(n)
export const fmtDate  = d => d ? new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'2-digit'}) : '—'
export const nights   = (s,e) => s&&e ? Math.max(0,Math.round((new Date(e)-new Date(s))/86400000)) : 0
export const pct      = (spent,budget) => budget>0 ? Math.min(100,Math.round((spent/budget)*100)) : 0
export const TRIP_EMOJIS  = ['🗼','🗽','🏯','🌴','🏔','🌅','🏝','🎭','🕌','🐘','🦁','🎡']
export const TRIP_COLORS  = ['#132240','#261633','#0e2a1a','#1e1e10','#2a1010','#0e1f2a','#1a1a2a']
