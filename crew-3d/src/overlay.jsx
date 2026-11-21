import React, { useEffect, useRef, useState } from 'react'
import { S, N, useStore, useClock, goTo, cancelTween, currentIndex, seg, setManual } from './store.js'
import { LABELS, CAPTIONS, DWELL, TRANSIT } from './stations.js'
import Deck from './deck.jsx'

const Ico = {
  play: <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.6v8.8L10 6z" /></svg>,
  pause: <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.8 1.8h2.2v8.4H2.8zM7 1.8h2.2v8.4H7z" /></svg>,
  slides: <svg viewBox="0 0 16 16" aria-hidden="true" className="st"><path d="M2 3.5h12v8H2zM6 14h4M8 11.5V14" /></svg>,
  pointer: <svg viewBox="0 0 16 16" aria-hidden="true" className="st"><path d="M4 2.2v10l2.6-2.4 1.7 3.7 1.7-.8-1.7-3.6h3.4z" /></svg>,
  left: <svg viewBox="0 0 12 12" aria-hidden="true" className="st"><path d="M7.5 2.5L4 6l3.5 3.5" /></svg>,
  right: <svg viewBox="0 0 12 12" aria-hidden="true" className="st"><path d="M4.5 2.5L8 6 4.5 9.5" /></svg>,
  replay: <svg viewBox="0 0 14 14" aria-hidden="true" className="st"><path d="M11.4 7a4.4 4.4 0 1 1-1.4-3.2M11.6 1.8v3H8.6" /></svg>,
}
const NAMES = ['Intro', 'The moment', 'The feature', 'The result', 'The proof', 'Close']

const rise = (k, dy = 18) => ({ opacity: k, transform: `translateY(${(1 - k) * dy}px)`, filter: `blur(${(1 - k) * 6}px)` })

function Close() {
  const t = useClock(5)
  return (
    <div className="close-txt">
      <div className="c1" style={rise(seg(t, 0.4, 0.9))}>PostHog won the engineers.</div>
      <div className="c2" style={rise(seg(t, 2.2, 0.9))}>Crew wins everyone they work with.</div>
      <div className="c3" style={rise(seg(t, 4.2, 0.8), 10)}>Student prototype · PMC@UCSC Product Case Competition, Fall 2026</div>
    </div>
  )
}

function Progress() {
  const p = useStore((s) => Math.round((s.cur / 5) * 1000) / 1000)
  return <div className="prog" style={{ width: `${Math.min(100, Math.max(0, p * 100))}%` }} />
}

export default function Overlay() {
  const ready = useStore((s) => s.frames > 14)
  const manual = useStore((s) => s.manual)
  const [deck, setDeck] = useState(false)
  const deckRef = useRef(false)
  deckRef.current = deck
  const section = useStore((s) => s.section)
  const active = useStore((s) => s.active)
  const [playing, setPlaying] = useState(false)
  const [done, setDone] = useState(false)
  const timer = useRef(null)
  const playRef = useRef(false)

  const stop = () => { playRef.current = false; clearTimeout(timer.current); setPlaying(false) }
  const run = (i) => {
    if (!playRef.current) return
    timer.current = setTimeout(() => {
      if (!playRef.current) return
      if (i >= N - 1) { playRef.current = false; setPlaying(false); setDone(true); return }
      goTo(i + 1, TRANSIT)
      timer.current = setTimeout(() => run(i + 1), TRANSIT * 1000)
    }, DWELL[i] * 1000)
  }
  const play = () => {
    if (playRef.current) return stop()
    setManual(false)
    playRef.current = true; setPlaying(true); setDone(false)
    let i = currentIndex()
    if (i >= N - 1) { goTo(0, 1.4); i = 0; timer.current = setTimeout(() => run(0), 1400); return }
    run(i)
  }

  const toggleManual = () => {
    stop()
    if (manual) setManual(false)
    else { setManual(true); goTo(0, 1.2) }
  }
  const step = (d) => { stop(); goTo(d < 0 ? Math.max(0, section - 1) : section >= N - 1 ? 0 : section + 1, 1.5) }

  useEffect(() => {
    const go = (i) => { stop(); cancelTween(); goTo(i, 1.5) }
    const onKey = (e) => {
      if (deckRef.current) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key
      const cur = currentIndex()
      if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(k) || (k === ' ' && !e.shiftKey)) { e.preventDefault(); go(Math.min(N - 1, cur + 1)) }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k) || (k === ' ' && e.shiftKey)) { e.preventDefault(); go(Math.max(0, cur - 1)) }
      else if (/^[1-5]$/.test(k)) go(Number(k))
      else if (k === '0' || k === 'Home') go(0)
      else if (k === 'End') go(N - 1)
      else if (k === 'p' || k === 'P') play()
      else if (k === 's' || k === 'S') { stop(); setDeck(true) }
    }
    const onUser = () => { if (playRef.current) stop(); cancelTween() }
    const onMove = (e) => { S.mx = (e.clientX / window.innerWidth - 0.5) * 2; S.my = (e.clientY / window.innerHeight - 0.5) * 2 }
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onUser, { passive: true })
    window.addEventListener('touchstart', onUser, { passive: true })
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('keydown', onKey); window.removeEventListener('wheel', onUser)
      window.removeEventListener('touchstart', onUser); window.removeEventListener('pointermove', onMove)
      clearTimeout(timer.current)
    }
  }, [])

  return (
    <>
      <div className={`boot ${ready ? 'off' : ''}`} aria-hidden="true"><span>Crew</span><i /></div>
      <main className="sr">
        <h1>Crew: a workspace for everyone on the team who doesn't write code</h1>
        <p>Half of AI users on the platform are not engineers or founders.</p>
        <h2>The moment</h2>
        <p>Praneeth asks in #product-team whether an AI answer is right: 15,200 of 40,000 new teams dropped off in onboarding. Three similar events could have been used: signup, user_signed_up and sign_up_complete. Vinesh, an engineer, will check on Monday, and a ticket (#482) to set up an onboarding experiment waits about a week.</p>
        <h2>The feature</h2>
        <p>Praneeth asks Crew in plain English how many new teams dropped off in onboarding. Crew answers that 24,800 of 40,000 teams sent a first event, so 15,200 dropped off, shows it used user_signed_up verified by Vinesh, and offers to launch a test to 10% of users.</p>
        <h2>The result</h2>
        <p>The experiment is live behind a feature flag for 10% of users, auto-stops if errors rise, notifies Vinesh as an FYI with no ticket, and reports results when they are significant.</p>
        <h2>The proof</h2>
        <p>Time to launch an experiment goes from about a week to the same day, which is a target. PMs, designers, support, marketing and data roles create 8% of experiments today, though they are 38% of weekly users; 20% is a target, not data.</p>
        <p>PostHog won the engineers. Crew wins everyone they work with. Student prototype, PMC@UCSC Product Case Competition, Fall 2026.</p>
      </main>
      <Progress />
      <div className="hud-label">
        {LABELS.map((l, i) => l && <span key={i} className={section === i ? 'on' : ''}>{l.split(' ')[0]}<b>{l.slice(3)}</b></span>)}
        <span className={section === 0 || section === 5 ? 'on wm' : 'wm'}>Crew</span>
      </div>
      {deck && <Deck onClose={() => setDeck(false)} openDemo={() => { setDeck(false); stop(); setManual(true); goTo(0, 1.2) }} />}
      <div className="hud-actions">
        <button className="mode" onClick={() => { stop(); setDeck(true) }}>{Ico.slides}<span>Slides</span></button>
        <button className={`mode ${manual ? 'is-on' : ''}`} onClick={toggleManual} aria-pressed={manual}>
          {Ico.pointer}<span>{manual ? 'Click-through on' : 'Click through'}</span>
        </button>
        <button className={`play ${playing ? 'is-on' : ''}`} onClick={play} aria-label="Play demo">
          {playing ? Ico.pause : done ? Ico.replay : Ico.play}<span>{playing ? 'Pause' : done ? 'Replay demo' : 'Play demo'}</span>
        </button>
      </div>
      <div className={`nav ${manual ? 'manual' : ''}`}>
        <button className="back" disabled={section === 0} onClick={() => step(-1)} aria-label="Previous section">{Ico.left}<span>Back</span></button>
        <span className="stepn">{section + 1} / {N}</span>
        <button className="next" onClick={() => step(1)} aria-label={section >= N - 1 ? 'Start over' : 'Next section'}><span>{section >= N - 1 ? 'Start over' : 'Next'}</span>{Ico.right}</button>
      </div>
      <div className="dots">
        {Array.from({ length: N }).map((_, i) => (
          <button key={i} className={section === i ? 'on' : ''} onClick={() => { stop(); goTo(i, 1.5) }} aria-label={NAMES[i]} />
        ))}
      </div>
      <div className="captions">
        {CAPTIONS.map((c, i) => c && <p key={i} className={active === i ? 'on' : ''}>{c}</p>)}
      </div>
      <div className={`cue ${section === 0 ? 'on' : ''}`}><span>Scroll</span><i /></div>
      <div className={`close-wrap ${section === 5 ? 'on' : ''}`}><Close /></div>
      <div className="scrim-b" />
      <div className="keys" aria-hidden="true">1–5 jump · arrows step · P play · S slides</div>
      <div className="sr" aria-live="polite">{NAMES[section]}</div>
      <div className="footer">Student prototype. Not a real PostHog product. Sample data.</div>
    </>
  )
}
