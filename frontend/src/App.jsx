import React from 'react'
import Chat from './components/Chat'
import BookingForm from './components/BookingForm'

export default function App() {
  return (
    <div style={{maxWidth:900, margin:'24px auto', fontFamily:'system-ui, -apple-system, Segoe UI, Roboto, Arial'}}>
      <h1>✈️ Booking Agent — RAG (React + Node + SQLite)</h1>
      <p style={{color:'#555'}}>Ask for flight/hotel suggestions with sources. Save a sample booking to SQLite.</p>
      <Chat/>
      <BookingForm/>
    </div>
  )
}
