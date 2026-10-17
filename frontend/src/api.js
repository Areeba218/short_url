const API_BASE = import.meta.env.VITE_API_BASE || ''
//const SHORT_BASE = (import.meta.env.VITE_SHORT_BASE || 'http://localhost:8001').replace(/\/$/, 'https://url-shortner-jmzw.onrender.com')
const SHORT_BASE = ('https://url-shortner-jmzw.onrender.com')
export const shortLink = (id) => `${SHORT_BASE}/${id}`

export async function createShortUrl(url) {
  let res
  try {
    res = await fetch(`${API_BASE}/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
  } catch {
    throw new Error('Server se connect nahi ho paya. Check karo ke backend port 8001 par chal raha hai.')
  }
  let data = {}
  try { data = await res.json() } catch { /* empty body */ }
  if (!res.ok) throw new Error(data.error || `Request fail hui (${res.status}).`)
  return data // { id, message }
}
