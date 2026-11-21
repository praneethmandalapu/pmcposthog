import { useEffect, useState, useSyncExternalStore } from 'react'

export const N = 6
export const portalRef = { current: null }
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const eio = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
export const seg = (t, s, d) => eio(clamp((t - s) / d))
export const smoother = (u) => u * u * u * (u * (u * 6 - 15) + 10)

export const S = {
  target: 0, cur: 0, mx: 0, my: 0, smx: 0, smy: 0,
  status: Array(N).fill('idle'), t: Array(N).fill(0),
  active: 0, section: 0, frames: 0, manual: false, clicked: false,
}
const subs = new Set()
const clockSubs = new Set()
let tween = null

export function maxScroll() {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
}
export function readScroll() {
  S.target = clamp(window.scrollY / maxScroll(), 0, 1) * (N - 1)
}
export function goTo(i, dur = 1.7) {
  i = clamp(Math.round(i), 0, N - 1)
  tween = { from: window.scrollY, to: (i / (N - 1)) * maxScroll(), t0: performance.now(), dur: dur * 1000 }
}
export function resetClocks() {
  for (let i = 0; i < N; i++) { S.status[i] = 'idle'; S.t[i] = 0 }
  S.clicked = false
}
export function setManual(v) { S.manual = v; S.clicked = false; if (v) resetClocks() }
export function launchClick() {
  if (S.clicked) return
  S.clicked = true
  S.t[2] = Math.max(S.t[2], 8.45)
  setTimeout(() => { if (S.manual && Math.round(S.cur) === 2) goTo(3, 1.6) }, 2300)
}
export function cancelTween() { tween = null }
export function isTweening() { return !!tween }
export function currentIndex() { return clamp(Math.round(S.target), 0, N - 1) }

export function tick(rawDt) {
  const dt = Math.min(rawDt, 0.05)
  const cdt = Math.min(rawDt, 0.25)
  S.frames++
  if (tween) {
    const k = clamp((performance.now() - tween.t0) / tween.dur)
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
    window.scrollTo(0, tween.from + (tween.to - tween.from) * e)
    if (k >= 1) tween = null
  }
  readScroll()
  const diff = S.target - S.cur
  S.cur = Math.abs(diff) < 0.0004 ? S.target : S.cur + diff * (1 - Math.exp(-dt * 7))
  S.smx += (S.mx - S.smx) * (1 - Math.exp(-dt * 3))
  S.smy += (S.my - S.smy) * (1 - Math.exp(-dt * 3))
  for (let i = 0; i < N && S.frames > 12; i++) {
    const d = Math.abs(S.cur - i)
    if (S.cur > 4.55 && i < 5) { S.status[i] = 'final'; S.t[i] = 99; continue }
    if (d < 0.2) {
      if (S.status[i] === 'idle') { S.status[i] = 'running'; S.t[i] = 0 }
      if (S.status[i] === 'running') S.t[i] += cdt
    } else if (d > 1.1) { S.status[i] = 'idle'; S.t[i] = 0; if (i === 2) S.clicked = false }
    else if (S.status[i] === 'running') S.t[i] += cdt
  }
  if (S.manual && !S.clicked && S.status[2] === 'running' && S.t[2] > 7.0) S.t[2] = 7.0
  const near = Math.round(S.cur)
  S.section = near
  S.active = Math.abs(S.cur - near) < 0.22 ? near : -1
  subs.forEach((f) => f())
  clockSubs.forEach((c) => {
    const v = S.t[c.i]
    if (Math.abs(v - c.last) >= 1 / 40 || (v >= 99 && c.last < 99) || (v === 0 && c.last !== 0)) { c.last = v; c.f(v) }
  })
}

export function subscribe(f) { subs.add(f); return () => subs.delete(f) }

export const REDUCE = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

export function vis(i) {
  if (S.cur > 4.3) return i === 4 ? 1 - 0.8 * clamp((S.cur - 4.5) / 0.5) : 1
  return clamp((0.95 - Math.abs(S.cur - i)) / 0.4)
}

export function useStore(sel) {
  return useSyncExternalStore((cb) => { subs.add(cb); return () => subs.delete(cb) }, () => sel(S), () => sel(S))
}

export function useClock(i) {
  const [t, setT] = useState(S.t[i])
  useEffect(() => {
    const c = { i, last: -1, f: setT }
    clockSubs.add(c)
    return () => clockSubs.delete(c)
  }, [i])
  return t
}
