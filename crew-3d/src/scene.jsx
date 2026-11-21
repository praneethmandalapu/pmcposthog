import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, Environment, Lightformer, RoundedBox, Edges } from '@react-three/drei'
import { S, tick, useClock, clamp, smoother, seg, subscribe, vis, REDUCE, portalRef, useStore } from './store.js'
import { ST, DF, FOV, U } from './stations.js'
import {
  SlackPanel, TicketCard, TICKET, SLACK, CrewApp, ExperimentPanel, MonolithA, MonolithB,
  HeroText, Chip, MiniLine, HeroTicket, Toast,
} from './panels.jsx'

const ACCENT = '#8c8c94'
const GLOW = '#e6e6ea'
const tanHalf = Math.tan((FOV * Math.PI) / 360)

/* ------------------ camera rig ------------------ */
const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _p = new THREE.Vector3(), _l = new THREE.Vector3()
const _side = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0), _right = new THREE.Vector3(), _fwd = new THREE.Vector3()

function buildKeys(aspect) {
  const keys = []
  for (let i = 0; i < 5; i++) {
    const s = ST[i]
    const vH = s.h * U * 1.34
    const vW = s.w * U * 1.14
    const d = Math.max(vH / (2 * tanHalf), vW / (2 * tanHalf * aspect))
    const n = new THREE.Vector3(Math.sin(s.ry), 0, Math.cos(s.ry))
    const c = new THREE.Vector3(...s.c)
    keys.push({
      pos: c.clone().addScaledVector(n, d).add(new THREE.Vector3(0, 0.15, 0)),
      look: c.clone().add(new THREE.Vector3(0, -vH * 0.075 + (s.look || 0), 0)),
    })
  }
  const k = Math.max(1, 1.78 / aspect)
  keys.push({ pos: new THREE.Vector3(1, 12.5 * k, 26 * k), look: new THREE.Vector3(0, 0.8, -31) })
  return keys
}

function Rig() {
  const { camera, size } = useThree()
  const cache = useRef({ aspect: 0, keys: null })
  useFrame((state, dt) => {
    tick(dt)
    const aspect = size.width / size.height
    if (cache.current.aspect !== aspect) cache.current = { aspect, keys: buildKeys(aspect) }
    const keys = cache.current.keys
    const p = clamp(S.cur, 0, 5)
    const i = Math.min(Math.floor(p), 4)
    const f = p - i
    const e = smoother(clamp((f - 0.15) / 0.7))
    const A = keys[i], B = keys[i + 1]
    _p.lerpVectors(A.pos, B.pos, e)
    _l.lerpVectors(A.look, B.look, e)
    const arc = Math.sin(Math.PI * e)
    const dir = i % 2 ? 1 : -1
    _fwd.subVectors(B.pos, A.pos).setY(0).normalize()
    _side.crossVectors(_up, _fwd).multiplyScalar(dir)
    const big = i === 4 ? 1.8 : 1
    if (!REDUCE) _p.addScaledVector(_up, 2.4 * arc * big).addScaledVector(_side, 2.6 * arc)
    // mouse parallax on the camera
    _fwd.subVectors(_l, _p).normalize()
    _right.crossVectors(_fwd, _up).normalize()
    if (!REDUCE) _p.addScaledVector(_right, S.smx * 0.5).addScaledVector(_up, S.smy * 0.3)
    camera.position.copy(_p)
    const fov = FOV + (REDUCE ? 0 : 7 * arc)
    if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix() }
    const roll = REDUCE ? 0 : Math.sin(Math.PI * e) * 0.05 * dir
    camera.up.set(Math.sin(roll), Math.cos(roll), 0)
    camera.lookAt(_l)
  })
  return null
}

/* ------------------ small helpers ------------------ */
function Bob({ children, pos = [0, 0, 0], rot = [0, 0, 0], amp = 0.06, speed = 0.7, phase = 0, tilt = 1 }) {
  const g = useRef()
  useFrame((st) => {
    const tt = st.clock.elapsedTime * speed + phase
    const m = REDUCE ? 0 : 1
    g.current.position.set(pos[0], pos[1] + Math.sin(tt) * amp * m, pos[2])
    const q = 0.0262 * tilt * m
    g.current.rotation.set(rot[0] + Math.sin(tt * 0.8 + 1) * q, rot[1] + Math.cos(tt * 0.6) * q, rot[2] + Math.sin(tt * 0.9) * q)
  })
  return <group ref={g}>{children}</group>
}

function Fade({ i, children }) {
  const ref = useRef()
  useEffect(() => {
    const f = () => {
      const k = vis(i), el = ref.current
      if (!el) return
      el.style.opacity = k
      el.style.visibility = k < 0.01 ? 'hidden' : 'visible'
    }
    f()
    return subscribe(f)
  }, [i])
  return <div ref={ref} style={{ visibility: 'hidden' }}>{children}</div>
}

const ZR = [1000, 0]
function Panel({ children, i = 0, pos = [0, 0, 0], ...rest }) {
  return (
    <Html transform center portal={portalRef} distanceFactor={DF} position={pos} pointerEvents="none" zIndexRange={ZR} {...rest}>
      <Fade i={i}>{children}</Fade>
    </Html>
  )
}

const glowTex = (() => {
  if (typeof document === 'undefined') return null
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d'); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.25, 'rgba(255,255,255,.45)'); r.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = r; g.fillRect(0, 0, 128, 128)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t
})()

function Glow({ pos, scale = 16, color = ACCENT, opacity = 0.28, i = -1 }) {
  const m = useRef()
  useFrame(() => { if (i >= 0) m.current.opacity = opacity * (0.25 + 0.75 * vis(i)) })
  return (
    <sprite position={pos} scale={[scale, scale, 1]}>
      <spriteMaterial ref={m} map={glowTex} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  )
}

/* ------------------ environment: grid, dust, path ------------------ */
function Grid() {
  const m = useRef(); const mat = useRef()
  const uniforms = useMemo(() => ({ uCam: { value: new THREE.Vector3() } }), [])
  useFrame(({ camera }) => {
    m.current.position.x = camera.position.x
    m.current.position.z = camera.position.z
    uniforms.uCam.value.copy(camera.position)
  })
  return (
    <mesh ref={m} rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} renderOrder={-2}>
      <planeGeometry args={[320, 320]} />
      <shaderMaterial ref={mat} transparent depthWrite={false} uniforms={uniforms}
        vertexShader={`varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`}
        fragmentShader={`
          varying vec3 vW; uniform vec3 uCam;
          float grid(vec2 p, float s){ vec2 g = p/s; vec2 d = abs(fract(g-0.5)-0.5)/fwidth(g); return 1.0-min(min(d.x,d.y),1.0); }
          void main(){
            float l = grid(vW.xz, 3.0)*0.9 + grid(vW.xz, 15.0)*0.6;
            float dist = distance(vW.xz, uCam.xz);
            float fade = 1.0 - smoothstep(18.0, 120.0, dist);
            gl_FragColor = vec4(vec3(0.66,0.66,0.7), clamp(l,0.0,1.0)*fade*0.32);
          }`} />
    </mesh>
  )
}

function Dust() {
  const g = useRef()
  const { pos, pos2 } = useMemo(() => {
    const mk = (n) => { const a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = (Math.random() - 0.5) * 70; a[i * 3 + 1] = -6 + Math.random() * 20; a[i * 3 + 2] = 25 - Math.random() * 110 } return a }
    return { pos: mk(260), pos2: mk(40) }
  }, [])
  useFrame((st) => { g.current.position.y = Math.sin(st.clock.elapsedTime * 0.12) * 0.6; g.current.rotation.y = Math.sin(st.clock.elapsedTime * 0.03) * 0.04 })
  return (
    <group ref={g}>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
        <pointsMaterial size={0.16} map={glowTex} color="#d2d2d8" transparent opacity={0.55} depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos2, 3]} /></bufferGeometry>
        <pointsMaterial size={0.28} map={glowTex} color={GLOW} transparent opacity={0.6} depthWrite={false} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
    </group>
  )
}

function PathLine() {
  const ref = useRef()
  const geo = useMemo(() => {
    const pts = ST.slice(0, 5).map((s) => new THREE.Vector3(...s.c))
    return new THREE.BufferGeometry().setFromPoints(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5).getPoints(160))
  }, [])
  useFrame(() => { ref.current.material.opacity = clamp((S.cur - 3.6) / 1.2) * 0.7 + 0.08 })
  return <line ref={ref} geometry={geo}><lineBasicMaterial color={GLOW} transparent opacity={0.1} depthWrite={false} blending={THREE.AdditiveBlending} /></line>
}

function PathPulses() {
  const refs = useRef([])
  const curve = useMemo(() => new THREE.CatmullRomCurve3(ST.slice(0, 5).map((s) => new THREE.Vector3(...s.c)), false, 'catmullrom', 0.5), [])
  const tmp = useMemo(() => new THREE.Vector3(), [])
  useFrame((st) => {
    const k = clamp((S.cur - 3.4) / 1.2) * 0.9 + 0.1
    refs.current.forEach((sp, i) => {
      if (!sp) return
      const u = (st.clock.elapsedTime * 0.028 + i / 7) % 1
      curve.getPointAt(u, tmp); sp.position.copy(tmp)
      sp.material.opacity = k * 0.9
    })
  })
  return (
    <group>
      {Array.from({ length: 7 }).map((_, i) => (
        <sprite key={i} ref={(el) => (refs.current[i] = el)} scale={[1.3, 1.3, 1]}>
          <spriteMaterial map={glowTex} color={GLOW} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
        </sprite>
      ))}
    </group>
  )
}

/* ------------------ station 0: hero ------------------ */
const HERO_CARDS = [
  { p: [-5.6, 2.5, -2.5], el: <Chip>PMs</Chip>, d: 0.3 },
  { p: [5.7, 2.9, -3], el: <Chip>Support</Chip>, d: 0.5 },
  { p: [-6.2, -0.7, 1.0], el: <Chip>Marketing</Chip>, d: 0.7 },
  { p: [5.2, -3.0, 2.0], el: <MiniLine />, d: 0.9 },
  { p: [-4.2, -3.2, 1.8], el: <HeroTicket />, d: 1.1 },
]
function HeroCard({ card, i, t }) {
  const k = seg(t, 0.3 + card.d * 0.6, 0.9)
  return (
    <Bob pos={card.p} amp={0.07} speed={0.5 + (i % 4) * 0.12} phase={i * 1.7}>
      <Panel i={0}>
        <div style={{ opacity: k * (card.p[2] < -2 ? 0.78 : 1), transform: `scale(${0.85 + 0.15 * k})`, filter: card.p[2] < -2 ? 'blur(1.3px)' : 'none' }}>{card.el}</div>
      </Panel>
    </Bob>
  )
}
function Hero() {
  const g = useRef(); const t = useClock(0)
  useFrame((st) => {
    const tt = st.clock.elapsedTime
    const m = REDUCE ? 0 : 1
    g.current.rotation.y = (Math.sin(tt * 0.17) * 0.13 + S.smx * 0.16) * m
    g.current.rotation.x = (-S.smy * 0.08 + Math.sin(tt * 0.13) * 0.02) * m
  })
  return (
    <>
    <Bob amp={0.05} speed={0.45} tilt={0}><Panel i={0} pos={[0, 0.1, 0]}><HeroText t={t} /></Panel></Bob>
    <group ref={g}>
      <Glow pos={[0, 0, -4]} scale={34} opacity={0.1} />
      {HERO_CARDS.map((c, i) => <HeroCard key={i} card={c} i={i} t={t} />)}
    </group>
    </>
  )
}

/* ------------------ station 1: moment ------------------ */
function Moment() {
  const t = useClock(1)
  const tk = useRef()
  useFrame(() => {
    const k = seg(t, 4.0, 1.0)
    const drop = 1 - k
    // ticket falls from above, overshoots nothing (no bounce), settles with a tilt
    tk.current.position.set(4.2, 1.9 + drop * 7, 1.3 + drop * 0.6)
    tk.current.rotation.set(0.18 * k + drop * 0.5, -0.14 * k, -0.1 * k + drop * 0.3)
    tk.current.visible = t >= 3.95
  })
  return (
    <group position={ST[1].c} rotation={[0, ST[1].ry, 0]}>
      <Glow i={1} pos={[0, 0, -3]} scale={26} opacity={0.14} />
      <Bob amp={0.05} speed={0.6}><Panel i={1}><SlackPanel t={t} /></Panel></Bob>
      <group ref={tk}>
        <Bob amp={0.05} speed={0.8} phase={2}><Panel i={1}><TicketCard /></Panel></Bob>
        <Glow pos={[0, 0, -0.5]} scale={6} opacity={0.18} color={GLOW} />
      </group>
    </group>
  )
}

/* ------------------ station 2: feature ------------------ */
function Feature() {
  const t = useClock(2)
  const wait = useStore((s) => s.manual && !s.clicked)
  return (
    <group position={ST[2].c} rotation={[0, ST[2].ry, 0]}>
      <Glow i={2} pos={[0, 0, -3]} scale={30} opacity={0.2} />
      <Bob amp={0.05} speed={0.55} phase={1}><Panel i={2}><CrewApp t={t} wait={wait} /></Panel></Bob>
    </group>
  )
}

/* ------------------ station 3: result + shield ------------------ */
function Shield({ t }) {
  const r1 = useRef(), r2 = useRef(), r3 = useRef(), wire = useRef(), grp = useRef()
  useFrame((st) => {
    const tt = st.clock.elapsedTime
    r1.current.rotation.z = tt * 0.22; r2.current.rotation.z = -tt * 0.17; r3.current.rotation.z = tt * 0.12
    wire.current.rotation.y = tt * 0.06
    const k = seg(t, 1.2, 1.6)
    grp.current.scale.setScalar(0.85 + 0.15 * k)
    ;[r1, r2, r3].forEach((r) => (r.current.material.opacity = 0.42 * k))
    wire.current.material.opacity = 0.09 * k
  })
  const mat = <meshBasicMaterial color={GLOW} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
  return (
    <group ref={grp}>
      <mesh ref={r1} rotation={[1.25, 0.2, 0]}><torusGeometry args={[7.6, 0.026, 8, 160]} />{mat}</mesh>
      <mesh ref={r2} rotation={[1.0, -0.6, 0.4]}><torusGeometry args={[8.0, 0.02, 8, 160]} />{mat}</mesh>
      <mesh ref={r3} rotation={[1.55, 0.5, 0.2]}><torusGeometry args={[8.4, 0.015, 8, 160]} />{mat}</mesh>
      <mesh ref={wire}><icosahedronGeometry args={[7.4, 2]} /><meshBasicMaterial color={GLOW} wireframe transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
    </group>
  )
}
function Result() {
  const t = useClock(3)
  return (
    <group position={ST[3].c} rotation={[0, ST[3].ry, 0]}>
      <Glow i={3} pos={[0, 0, -3]} scale={30} opacity={0.2} />
      <Shield t={t} />
      <Bob amp={0.05} speed={0.5} phase={2}><Panel i={3}><ExperimentPanel t={t} /></Panel></Bob>
      <Bob amp={0.06} speed={0.7} phase={1} pos={[2.7, -2.5, 1.1]} tilt={1.2}><Panel i={3}><Toast t={t} /></Panel></Bob>
    </group>
  )
}

/* ------------------ station 4: proof monoliths ------------------ */
function Monolith({ x, children, phase }) {
  const g = useRef()
  useFrame(() => {
    const k = vis(4)
    g.current.visible = k > 0.01
    g.current.traverse((o) => {
      const m = o.material
      if (!m) return
      if (m.userData.base === undefined) m.userData.base = m.opacity
      m.opacity = m.userData.base * k
    })
  })
  return (
    <Bob pos={[x, 0, 0]} amp={0.07} speed={0.5} phase={phase}>
      <group ref={g} visible={false}>
      <RoundedBox args={[4.3, 6.8, 0.5]} radius={0.16} smoothness={4} position={[0, 0, -0.1]}>
        <meshPhysicalMaterial color="#d6d6da" transparent opacity={0.2} roughness={0.1} metalness={0.0} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={2.4} depthWrite={false} />
        <Edges threshold={20} color="#ffffff" />
      </RoundedBox>
      </group>
      <Panel i={4} pos={[0, 0, 0.25]}>{children}</Panel>
    </Bob>
  )
}
function Proof() {
  const t = useClock(4)
  return (
    <group position={ST[4].c} rotation={[0, ST[4].ry, 0]}>
      <Glow i={4} pos={[2.6, 0, -2]} scale={20} opacity={0.2} />
      <Glow i={4} pos={[-2.6, 0, -2]} scale={14} opacity={0.08} color="#9a9aa0" />
      <Monolith x={-2.75} phase={0}><MonolithA t={t} /></Monolith>
      <Monolith x={2.75} phase={1.6}><MonolithB t={t} /></Monolith>
    </group>
  )
}

/* ------------------ canvas ------------------ */
export default function Scene3D() {
  return (
    <Canvas
      className="cv"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: FOV, near: 0.1, far: 400, position: [0, 0.4, 16] }}
    >
      <Rig />
      <ambientLight intensity={0.6} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 6, 6]} scale={[14, 6, 1]} color="#ececf2" />
        <Lightformer form="rect" intensity={2} position={[-8, 1, 2]} rotation-y={Math.PI / 2} scale={[8, 6, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={2.5} position={[8, 0, 3]} rotation-y={-Math.PI / 2} scale={[8, 6, 1]} color={GLOW} />
      </Environment>
      <Grid />
      <Dust />
      <PathLine />
      <PathPulses />
      <Hero />
      <Moment />
      <Feature />
      <Result />
      <Proof />
    </Canvas>
  )
}
