import React from 'react'
import { clamp, seg, eio, launchClick } from './store.js'

/* ---------- helpers ---------- */
const rise = (k, dy = 14) => ({ opacity: k, transform: `translateY(${(1 - k) * dy}px)` })
const pop = (k) => ({ opacity: k, transform: `translateY(${(1 - k) * 10}px) scale(${0.94 + 0.06 * k})` })

export function Win({ title, w, h, children, className = '' }) {
  return (
    <div className={`win ${className}`} style={{ width: w, height: h }}>
      <div className="win-bar"><div className="lights"><i className="r" /><i className="y" /><i className="g" /></div><span>{title}</span></div>
      <div className="win-body">{children}</div>
    </div>
  )
}

const CheckIco = () => <svg className="ci" viewBox="0 0 20 20"><path d="M5 10.5l3.2 3.2L15 6.8" /></svg>

const Avatar = ({ children, tone = 'navy' }) => <div className={`avatar ${tone}`}>{children}</div>

/* ---------- 01 THE MOMENT ---------- */
export const SLACK = { w: 940, h: 580 }
export function SlackPanel({ t }) {
  const m1 = seg(t, 0.3, 0.6)
  const chart = seg(t, 0.9, 1.1)
  const chips = [seg(t, 2.0, 0.5), seg(t, 2.13, 0.5), seg(t, 2.26, 0.5)]
  const reply = seg(t, 3.1, 0.6)
  return (
    <Win title="Slack-style · Northwind" w={SLACK.w} h={SLACK.h} className="slack">
      <div className="sl-side">
        <div className="sl-ws">Northwind</div>
        <div className="sl-h">Channels</div>
        <div className="sl-ch on"># product-team</div>
        <div className="sl-ch"># support<u /></div>
        <div className="sl-ch"># growth</div>
        <div className="sl-ch"># design</div>
        <div className="sl-h">Direct messages</div>
        <div className="sl-ch dm"><b className="g" />Vinesh</div>
        <div className="sl-ch dm"><b className="g" />Jasim</div>
        <div className="sl-ch dm"><b />Praneeth <em>you</em></div>
      </div>
      <div className="sl-main">
        <div className="sl-head"># product-team<span>Product, support and marketing in one place</span></div>
        <div className="sl-msgs">
          <div className="msg" style={rise(m1)}>
            <Avatar>P</Avatar>
            <div className="mb">
              <div className="mn">Praneeth <em>PM · 10:42</em></div>
              <div className="mt">is this right? the AI says 15,200 new teams dropped off 👀</div>
              <div className="attach" style={rise(chart, 10)}>
                <div className="at-top"><b>Onboarding funnel, one quarter</b><span>AI answer</span></div>
                <div className="at-funnel">
                  <div className="fn-row"><span>Signed up</span><div className="fn-track"><i style={{ width: `${100 * chart}%` }} /></div><b>40,000</b></div>
                  <div className="fn-row on"><span>First event</span><div className="fn-track"><i style={{ width: `${62 * chart}%` }} /></div><b>24,800</b></div>
                </div>
                <div className="at-chips">
                  {['signup?', 'user_signed_up?', 'sign_up_complete?'].map((c, i) => (
                    <span key={c} className="chip-amber" style={pop(chips[i])}>{c}</span>
                  ))}
                </div>
              </div>
              <div className="reacts" style={pop(seg(t, 2.7, 0.4))}><span className="react"><em>J</em>👀 Jasim</span></div>
            </div>
          </div>
          <div className="msg" style={rise(reply)}>
            <Avatar tone="slate">V</Avatar>
            <div className="mb">
              <div className="mn">Vinesh (engineer) <em>10:58</em></div>
              <div className="mt">I'll check on Monday</div>
            </div>
          </div>
        </div>
        <div className="typing-ind" style={{ opacity: t > 2.75 && t < 3.15 ? 1 : 0 }}>Vinesh is typing<i /><i /><i /></div>
        <div className="sl-input">Message #product-team</div>
      </div>
    </Win>
  )
}

export const TICKET = { w: 330, h: 200 }
export function TicketCard() {
  return (
    <div className="ticket" style={{ width: TICKET.w }}>
      <div className="tk-top"><span className="tk-id">TICKET #482</span><span className="tk-type">Eng request</span></div>
      <div className="tk-title">Set up onboarding experiment</div>
      <div className="tk-by">Requested by Praneeth</div>
      <div className="tk-row"><span className="tk-pill">Waiting · ~1 week</span><span className="tk-av">V</span></div>
    </div>
  )
}

/* ---------- 02 THE FEATURE ---------- */
export const APP = { w: 1060, h: 660 }
const Q = 'How many new teams dropped off in onboarding?'
export function CrewApp({ t, wait = false }) {
  const awaiting = wait && t >= 6.8 && t < 99
  const n = Math.floor(clamp((t - 0.5) / 1.9) * Q.length)
  const typing = t < 2.4
  const ans = seg(t, 2.9, 0.7)
  const bB = seg(t, 3.4, 0.9)
  const bA = seg(t, 3.7, 0.9)
  const head = seg(t, 4.3, 0.5)
  const chip = seg(t, 5.2, 0.5)
  const nu = seg(t, 5.75, 0.5)
  const btn = seg(t, 6.2, 0.5)
  const cur = eio(clamp((t - 7.0) / 1.4))
  const click = t > 8.5
  const ripple = clamp((t - 8.5) / 0.8)
  const curOp = t >= 99 || wait ? 0 : t < 6.9 ? 0 : t > 9.2 ? clamp(1 - (t - 9.2) / 0.4) : 1
  const dots = t > 2.35 && t < 2.95
  const press = t > 8.45 && t < 8.7
  return (
    <Win title="Crew" w={APP.w} h={APP.h} className="app">
      <div className="ap-side">
        <div className="wordmark">Crew<Ck sm /></div>
        <div className="ap-nav on"><svg viewBox="0 0 20 20"><path d="M3 5h14v8H9l-4 3v-3H3z" /></svg>Ask</div>
        <div className="ap-nav"><svg viewBox="0 0 20 20"><path d="M7 3h6M8 3v5l-4 8h12l-4-8V3" /></svg>Experiments</div>
        <div className="ap-nav"><svg viewBox="0 0 20 20"><path d="M4 4h12v12H4zM7 8h6M7 12h4" /></svg>Surveys</div>
        <div className="ap-nav"><svg viewBox="0 0 20 20"><path d="M10 3v9M6 8l4 4 4-4M4 16h12" /></svg>Requests</div>
        <div className="ap-who"><Avatar>P</Avatar><div><b>Praneeth</b><span>Product manager · 150-person company</span></div></div>
      </div>
      <div className="ap-main">
        <div className="ap-title">Ask Crew <span>Plain English, no code</span></div>
        <div className={`ap-input ${t > 0.3 && t < 2.6 ? "focus" : ""}`}>
          <svg viewBox="0 0 20 20" className="spark"><path d="M10 2l1.8 5.2L17 9l-5.2 1.8L10 16l-1.8-5.2L3 9l5.2-1.8z" /></svg>
          <span>{Q.slice(0, n)}</span>{typing && <i className="caret" />}
          <div className="ap-send"><svg viewBox="0 0 20 20"><path d="M10 15.5v-11M5.2 9.2L10 4.5l4.8 4.7" /></svg></div>
        </div>
        <div className="ap-answer" style={{ ...rise(ans, 40), visibility: ans > 0 ? 'visible' : 'hidden' }}>
          <div className="bars">
            <div className="bar-col">
              <div className="bar grey" style={{ height: 150 * bB }} />
              <div className="bar-lbl">Signed up<br /><b>40,000</b></div>
            </div>
            <div className="bar-col">
              <div className="bar acc" style={{ height: 93 * bA }} />
              <div className="bar-lbl on">First event<br /><b>24,800</b></div>
            </div>
          </div>
          <div className="ans-r">
            <div className="ans-h" style={rise(head, 12)}>15,200 teams dropped off</div>
            <div className="ans-s" style={rise(head, 12)}>Of 40,000 teams that signed up in a quarter, 24,800 sent a first event. The other 15,200 did not (Table D1).</div>
            <div className="verified" style={pop(chip)}>
              <b><CheckIco /></b><span className="ev">user_signed_up</span><span className="vd">— Verified by Vinesh (engineer)</span>
            </div>
            <div className="notused" style={rise(nu, 6)}>not used: signup, sign_up_complete</div>
            <div className="btn-wrap" style={rise(btn, 14)}>
              {awaiting && <div className="click-hint">Click to launch</div>}
              <div className={`cta ${click ? 'done' : ''} ${awaiting ? 'await' : ''}`} onClick={awaiting ? launchClick : undefined} role={awaiting ? 'button' : undefined} style={{ transform: press ? 'scale(.97)' : 'none' }}>
                {click && t > 8.8 ? <><CheckIco />Launching to 10% of users</> : 'Test it → launch to 10% of users'}
                <span className="ripple" style={{ opacity: click && ripple < 1 ? 1 - ripple : 0, transform: `translate(-50%,-50%) scale(${ripple * 14})` }} />
              </div>
              <svg className="cursor" viewBox="0 0 24 24" style={{ opacity: curOp * btn, transform: `translate(${-260 + 330 * cur}px, ${-170 + 190 * cur}px)` }}>
                <path d="M5.4 3.1v15.6l3.9-3.7 2.7 5.8 2.7-1.3-2.6-5.7h5.3z" fill="#000" stroke="#fff" strokeWidth="1.25" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        {dots && <div className="thinking"><i /><i /><i /></div>}
      </div>
    </Win>
  )
}

/* ---------- 03 THE RESULT ---------- */
export const EXP = { w: 940, h: 600 }
const CHECKS = [
  'Behind a feature flag, only 10% of users see it',
  'Auto-stops if errors rise',
  'Vinesh notified: FYI, no ticket',
  'Results land in Crew when they\'re significant',
]
export function ExperimentPanel({ t }) {
  const hd = seg(t, 0.2, 0.6)
  const fill = seg(t, 0.8, 1.3)
  return (
    <Win title="Crew · Experiments" w={EXP.w} h={EXP.h} className="exp">
      <div className="ex-pad">
        <div className="ex-head" style={rise(hd, 10)}>
          <span className="live"><i />Live</span>
          <div>
            <div className="ex-title">New onboarding flow</div>
            <div className="ex-sub">Launched by Praneeth · same day, no ticket</div>
          </div>
        </div>
        <div className="roll" style={rise(hd, 10)}>
          <div className="roll-top"><span>Rollout</span><b>{Math.round(10 * fill)}% of users</b></div>
          <div className="track"><div className="fillbar" style={{ width: `${10 * fill}%` }} /></div>
          <div className="roll-scale"><span>0%</span><span>100%</span></div>
        </div>
        <div className="checks">
          {CHECKS.map((c, i) => {
            const k = seg(t, 2.2 + i * 0.7, 0.5)
            const ck = seg(t, 2.45 + i * 0.7, 0.4)
            return (
              <div className="check" key={c} style={rise(k, 18)}>
                <span className="cc"><svg viewBox="0 0 20 20"><path d="M5 10.5l3.2 3.2L15 6.8" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - ck} /></svg></span>
                <span>{c}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Win>
  )
}

/* ---------- 04 THE PROOF ---------- */
export const MONO = { w: 400, h: 640 }
export function MonolithA({ t }) {
  const a = seg(t, 0.3, 0.6)
  const wk = seg(t, 0.9, 0.6)
  const strike = seg(t, 1.8, 0.5)
  const same = seg(t, 2.7, 0.7)
  return (
    <div className="mono" style={{ width: MONO.w, height: MONO.h }}>
      <div className="mo-lbl" style={rise(a)}>Time to launch an experiment</div>
      <div className="mo-body">
        <div className="mo-old" style={rise(wk, 20)}>
          1 week<i style={{ transform: `scaleX(${strike})` }} />
        </div>
        <div className="mo-new" style={{ ...rise(same, 26), filter: `blur(${(1 - same) * 6}px)` }}>Same day</div>
      </div>
      <div className="mo-fine" style={rise(seg(t, 3.4, 0.6), 10)}>Today a ticket takes about a week to get picked up (interview E2.4). Same day is our target, not data.</div>
    </div>
  )
}
export function MonolithB({ t }) {
  const a = seg(t, 0.6, 0.6)
  const c = seg(t, 1.0, 1.4)
  const val = Math.round(8 * c)
  const ext = seg(t, 2.6, 1.0)
  const tg = seg(t, 3.2, 0.5)
  const fp = seg(t, 3.8, 0.6)
  return (
    <div className="mono" style={{ width: MONO.w, height: MONO.h }}>
      <div className="mo-lbl" style={rise(a)}>Experiments created by PMs, support and marketing</div>
      <div className="mo-body b">
        <div className="mo-num" style={rise(seg(t, 0.9, 0.5), 20)}>{val}%</div>
        <div className="mo-sub" style={{ opacity: seg(t, 1.0, 0.5) }}>today</div>
        <div className="mo-meter" style={{ opacity: seg(t, 1.0, 0.5) }}>
          <div className="mm-fill" style={{ width: `${40 * c}%` }} />
          <div className="mm-ghost" style={{ left: '40%', width: `${60 * ext}%` }} />
          <span style={{ left: '40%' }} />
          <span className="end" style={{ opacity: tg }} />
        </div>
        <div className="mm-labels">
          <b style={{ left: '40%', opacity: seg(t, 1.2, 0.5) }}>8% today</b>
          <b className="tg" style={{ opacity: tg }}>20% target</b>
        </div>
      </div>
      <div className="mo-fine" style={rise(fp, 10)}>Today 8%, though these roles are 38% of weekly users (Table D4). 20% is our target, not data.</div>
    </div>
  )
}

/* ---------- HERO ---------- */
export const HERO = { w: 1180, h: 520 }
export const Ck = ({ sm }) => (
  <span className={`ck ${sm ? 'sm' : ''}`}>{!sm && <svg viewBox="0 0 20 20"><path d="M5 10.5l3.2 3.2L15 6.8" /></svg>}</span>
)
export function HeroText({ t }) {
  const a = seg(t, 0.1, 0.9), b = seg(t, 0.7, 0.7), c = seg(t, 1.1, 0.7)
  return (
    <div className="hero-txt" style={{ width: HERO.w }}>
      <h1 style={{ ...rise(a, 30), filter: `blur(${(1 - a) * 10}px)` }}>Crew<Ck /></h1>
      <p className="tag" style={rise(b, 16)}>A workspace for everyone on the team who doesn't write code.</p>
      <p className="half" style={rise(c, 12)}>Half of AI users on the platform are not engineers or founders.</p>
    </div>
  )
}
export const Chip = ({ children }) => <div className="gcard gchip">{children}</div>
export const MiniLine = () => (
  <div className="gcard gline">
    <div className="gl-t">Signups</div>
    <svg viewBox="0 0 220 80"><path d="M0 60 L30 50 L60 54 L90 34 L120 40 L150 22 L180 26 L220 8" fill="none" stroke="#f2f2f2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /><circle cx="220" cy="8" r="4.5" fill="#fff" /></svg>
  </div>
)
export const MiniBars = () => (
  <div className="gcard gbars">
    <div className="gl-t">Funnel</div>
    <div className="gb-row">{[70, 52, 40, 28].map((h, i) => <i key={i} style={{ height: h }} className={i === 3 ? 'on' : ''} />)}</div>
  </div>
)
export const HeroTicket = () => (
  <div className="gcard gticket"><b>ticket #482</b><span>Waiting…</span></div>
)
export const Bubble = () => <div className="gcard gbubble">is this right?</div>

/* ---------- macOS-style notification (engineer gets an FYI, not a ticket) ---------- */
export const TOAST = { w: 380 }
export function Toast({ t }) {
  const k = seg(t, 4.9, 0.7)
  return (
    <div className="toast" style={{ width: TOAST.w, opacity: k, transform: `translateX(${(1 - k) * 60}px) scale(${0.96 + 0.04 * k})` }}>
      <div className="to-ic">C</div>
      <div className="to-b">
        <div className="to-t"><b>Crew</b><span>now</span></div>
        <div className="to-s">FYI for Vinesh</div>
        <div className="to-m">Praneeth launched New onboarding flow behind a feature flag. No ticket needed.</div>
      </div>
    </div>
  )
}
