import React, { useEffect, useRef, useState } from 'react'
import { clamp } from './store.js'
import { LABELS, CAPTIONS } from './stations.js'
import { SlackPanel, SLACK, TicketCard, CrewApp, APP, ExperimentPanel, EXP, MonolithA, MonolithB, MONO, HeroText, HERO, Chip } from './panels.jsx'

function useLocalClock() {
  const ref = useRef(null); const [t, setT] = useState(0)
  useEffect(() => {
    let raf, start = null, vis = false
    const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && start === null) { start = performance.now(); loop() } }, { threshold: 0.35 })
    const loop = () => { if (start === null) return; const v = (performance.now() - start) / 1000; setT(v); if (v < 14) raf = requestAnimationFrame(loop); else setT(99) }
    io.observe(ref.current)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [])
  return [ref, t]
}

function Fit({ w, h, children }) {
  const wrap = useRef(null); const [s, setS] = useState(1)
  useEffect(() => {
    const f = () => setS(clamp((wrap.current.clientWidth) / w, 0.2, 1))
    f(); const ro = new ResizeObserver(f); ro.observe(wrap.current); return () => ro.disconnect()
  }, [w])
  return (
    <div ref={wrap} className="fit" style={{ height: h * s }}>
      <div style={{ width: w, height: h, transform: `scale(${s})`, transformOrigin: 'top left' }}>{children}</div>
    </div>
  )
}

function Sec({ i, children }) {
  const [ref, t] = useLocalClock()
  return (
    <section ref={ref} className="fb-sec">
      {LABELS[i] && <div className="fb-label">{LABELS[i]}</div>}
      {children(t)}
      {CAPTIONS[i] && <p className="fb-cap">{CAPTIONS[i]}</p>}
    </section>
  )
}

export default function Fallback() {
  return (
    <div className="fb">
      <Sec i={0}>{(t) => (
        <div className="fb-hero"><Fit w={HERO.w} h={HERO.h - 120}><HeroText t={t} /></Fit>
          <div className="fb-chips">{['PMs', 'Support', 'Marketing', 'Designers'].map((c) => <Chip key={c}>{c}</Chip>)}</div></div>
      )}</Sec>
      <Sec i={1}>{(t) => (<><Fit w={SLACK.w} h={SLACK.h}><SlackPanel t={t} /></Fit><div className="fb-tk"><TicketCard /></div></>)}</Sec>
      <Sec i={2}>{(t) => <Fit w={APP.w} h={APP.h}><CrewApp t={t} /></Fit>}</Sec>
      <Sec i={3}>{(t) => <Fit w={EXP.w} h={EXP.h}><ExperimentPanel t={t} /></Fit>}</Sec>
      <Sec i={4}>{(t) => (
        <div className="fb-mono"><Fit w={MONO.w} h={MONO.h}><MonolithA t={t} /></Fit><Fit w={MONO.w} h={MONO.h}><MonolithB t={t} /></Fit></div>
      )}</Sec>
      <section className="fb-sec fb-close">
        <div className="close-txt on">
          <div className="c1">PostHog won the engineers.</div>
          <div className="c2">Crew wins everyone they work with.</div>
          <div className="c3">Student prototype · PMC@UCSC Product Case Competition, Fall 2026</div>
        </div>
      </section>
      <div className="footer">Student prototype. Not a real PostHog product. Sample data.</div>
    </div>
  )
}
