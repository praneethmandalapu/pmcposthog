import React, { Component, useEffect, useState } from 'react'
import Overlay from './overlay.jsx'
import Fallback from './fallback.jsx'
import Scene3D from './scene.jsx'
import { N, portalRef } from './store.js'

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { return false }
}
class Boundary extends Component {
  state = { err: false }
  static getDerivedStateFromError() { return { err: true } }
  componentDidCatch(e) { console.warn('3D scene unavailable, using flat layout', e) }
  render() { return this.state.err ? this.props.fallback : this.props.children }
}

export default function App() {
  const [mode] = useState(() => (hasWebGL() && window.innerWidth >= 760 ? '3d' : 'flat'))
  useEffect(() => { document.documentElement.dataset.mode = mode; if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; window.scrollTo(0, 0) }, [mode])
  if (mode === 'flat') return <Fallback />
  return (
    <Boundary fallback={<Fallback />}>
      <div className="aurora"><i /><i /><i /></div>
      <div className="grain" />
      <div className="scroller" style={{ height: `${N * 100 + 100}vh` }} />
      <div className="stage" aria-hidden="true" ref={(el) => { portalRef.current = el }}><Scene3D /></div>
      <Overlay />
    </Boundary>
  )
}
