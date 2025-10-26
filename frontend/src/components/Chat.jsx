import React, { useState } from 'react'
import { chat } from '../services/api'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const sessionId = 1

  const send = async () => {
    const q = input.trim(); if (!q) return
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setInput(''); setLoading(true)
    try {
      const { data } = await chat(sessionId, q)
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer, citations: data.citations }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error contacting server.' }])
    } finally { setLoading(false) }
  }

  return (
    <div style={{border:'1px solid #ddd', borderRadius:8, padding:16, marginBottom:24}}>
      <h2>Chat</h2>
      <div style={{maxHeight:320, overflowY:'auto', background:'#fafafa', border:'1px solid #eee', borderRadius:6, padding:8, marginBottom:8}}>
        {messages.map((m,i)=>(
          <div key={i} style={{margin:'8px 0'}}>
            <b>{m.role==='user'?'You':'Assistant'}: </b>
            <span dangerouslySetInnerHTML={{__html: m.content.replace(/\n/g,'<br/>')}} />
            {m.citations?.length ? (
              <details style={{marginTop:4}}>
                <summary>Sources</summary>
                <ul>{m.citations.map((c,idx)=><li key={idx}>{c.source} — {c.text}…</li>)}</ul>
              </details>
            ): null}
          </div>
        ))}
      </div>
      <div style={{display:'flex', gap:8}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}
               placeholder="Ask for flights/hotels..." style={{flex:1, padding:8, borderRadius:6, border:'1px solid #ccc'}} />
        <button onClick={send} disabled={loading} style={{padding:'8px 12px'}}>{loading?'Sending…':'Send'}</button>
      </div>
    </div>
  )
}
