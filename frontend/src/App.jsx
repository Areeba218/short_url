import { useEffect, useRef, useState } from 'react'
import { createShortUrl, shortLink } from './api'

const STORAGE_KEY = 'snip:history'

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
}

function normalize(raw) {
  let v = raw.trim()
  if (!v) return null
  if (!/^https?:\/\//i.test(v)) v = 'https://' + v
  try {
    const u = new URL(v)
    return u.hostname.includes('.') ? u.href : null
  } catch { return null }
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text) }
  catch {
    const t = document.createElement('textarea')
    t.value = text
    document.body.appendChild(t)
    t.select()
    document.execCommand('copy')
    t.remove()
  }
}

function CopyButton({ text, label = 'Copy link', className = '' }) {
  const [done, setDone] = useState(false)
  const onClick = async () => {
    await copyText(text)
    setDone(true)
    setTimeout(() => setDone(false), 1600)
  }
  return (
    <button type="button" className={`btn ${className}`} onClick={onClick} aria-live="polite">
      {done ? 'Copied' : label}
    </button>
  )
}

function Result({ item }) {
  const [trimmed, setTrimmed] = useState(false)
  const short = shortLink(item.id)

  useEffect(() => {
    setTrimmed(false)
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setTrimmed(true)))
    return () => cancelAnimationFrame(r)
  }, [item.id])

  const ratio = Math.max(0.1, Math.min(1, short.length / item.original.length))
  const saved = item.original.length - short.length

  return (
    <section className="result" aria-label="Your short link">
      <div className="bars" aria-hidden="true">
        <div className="bar bar-long"><span>{item.original}</span></div>
        <div className="bar bar-short" style={{ width: trimmed ? `${ratio * 100}%` : '100%' }}>
          <span>{short}</span>
        </div>
      </div>
      <div className="result-row">
        <a className="short" href={short} target="_blank" rel="noreferrer">{short}</a>
        <CopyButton text={short} />
      </div>
      <p className="meta">
        {saved > 0
          ? `${saved} characters shorter than the original (${item.original.length} → ${short.length}).`
          : 'Link created.'}
      </p>
    </section>
  )
}

function History({ items, onClear }) {
  if (!items.length) return null
  return (
    <section className="history" aria-label="Recent links">
      <div className="history-head">
        <h2>Recent links</h2>
        <button type="button" className="linklike" onClick={onClear}>Clear list</button>
      </div>
      <ul>
        {items.map((it) => (
          <li key={it.id + it.at}>
            <div className="h-main">
              <a href={shortLink(it.id)} target="_blank" rel="noreferrer">{shortLink(it.id)}</a>
              <span className="h-orig" title={it.original}>{it.original}</span>
            </div>
            <time dateTime={new Date(it.at).toISOString()}>
              {new Date(it.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
            </time>
            <CopyButton text={shortLink(it.id)} label="Copy" className="btn-small" />
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function App() {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [current, setCurrent] = useState(null)
  const [history, setHistory] = useState(loadHistory)
  const inputRef = useRef(null)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(history)) } catch { /* storage full/blocked */ }
  }, [history])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    const url = normalize(value)
    if (!url) {
      setError('Ye valid link nahi lag raha. Poora address paste karo, jaise example.com/page.')
      inputRef.current?.focus()
      return
    }
    setLoading(true)
    try {
      const { id } = await createShortUrl(url)
      const item = { id, original: url, at: Date.now() }
      setCurrent(item)
      setHistory((h) => [item, ...h].slice(0, 8))
      setValue('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page">
      <header className="brand">
        <span className="mark" aria-hidden="true">✂</span>
        <span>Snip</span>
      </header>

      <h1>Long link in, short link out.</h1>
      <p className="lede">Paste any web address and get a short one you can share anywhere.</p>

      <form onSubmit={onSubmit} noValidate className="form">
        <label htmlFor="url" className="sr-only">Link to shorten</label>
        <input
          id="url"
          ref={inputRef}
          type="text"
          inputMode="url"
          autoComplete="off"
          placeholder="https://example.com/a-very/long/link?with=params"
          value={value}
          onChange={(e) => { setValue(e.target.value); if (error) setError('') }}
          aria-invalid={!!error}
          aria-describedby={error ? 'url-error' : undefined}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Shortening…' : 'Shorten link'}
        </button>
      </form>
      {error && <p id="url-error" role="alert" className="error">{error}</p>}

      {current && <Result item={current} />}
      <History items={history} onClear={() => setHistory([])} />
    </main>
  )
}
