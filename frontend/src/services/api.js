import axios from 'axios'
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000' })
export const chat = (sessionId, message) => api.post('/api/chat', { session_id: sessionId, message })
export const createBooking = (payload) => api.post('/api/bookings', payload)
