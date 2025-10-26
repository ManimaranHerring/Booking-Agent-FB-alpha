import React, { useState } from 'react'
import { createBooking } from '../services/api'

export default function BookingForm() {
  const [type, setType] = useState('flight')
  const [amount, setAmount] = useState(0)
  const [details, setDetails] = useState('{"from":"MAA","to":"DXB","date":"2025-11-15"}')
  const [result, setResult] = useState(null)

  const save = async () => {
    try {
      const payload = { session_id: 1, type, amount: Number(amount), details: JSON.parse(details) }
      const { data } = await createBooking(payload)
      setResult(data)
    } catch (e) { setResult({ error: String(e.message || e) }) }
  }

  return (
    <div style={{border:'1px solid #ddd', borderRadius:8, padding:16}}>
      <h2>Create a Booking (demo)</h2>
      <div style={{display:'flex', gap:12, marginBottom:8}}>
        <label>Type:
          <select value={type} onChange={e=>setType(e.target.value)} style={{marginLeft:8}}>
            <option value="flight">flight</option><option value="hotel">hotel</option>
          </select>
        </label>
        <label>Amount (₹):
          <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} style={{marginLeft:8}}/>
        </label>
      </div>
      <label>Details (JSON):</label>
      <textarea rows={5} value={details} onChange={e=>setDetails(e.target.value)} style={{width:'100%', margin:'8px 0'}}/>
      <button onClick={save} style={{padding:'8px 12px'}}>Save booking</button>
      {result && <pre style={{background:'#f6f8fa', padding:8, marginTop:8}}>{JSON.stringify(result,null,2)}</pre>}
    </div>
  )
}
