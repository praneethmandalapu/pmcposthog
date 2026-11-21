import React, { useEffect, useRef, useState } from 'react'

/* Every number on these slides is either from the case packet (cited by table / interview)
   or derived from packet numbers with the arithmetic shown. Anything we assumed is labelled. */

const T = ({ children }) => <h2 className="dk-title">{children}</h2>
const Foot = ({ step, src }) => (
  <div className="dk-foot"><span>{step}</span><span>{src}</span></div>
)
const Cite = ({ children }) => <span className="dk-cite">{children}</span>


/* Evidence helpers: tables and quotes are copied from the case packet. Highlighted rows and notes are ours. */
const Q = ({ id, who, tag, children }) => (
  <figure className="dk-q">
    <blockquote>{children}</blockquote>
    <figcaption><b>{id}</b><span>{who}</span>{tag && <i>{tag}</i>}</figcaption>
  </figure>
)

const ROLES = [
  { r: 'Engineers', u: 48, e: 83 },
  { r: 'Founders', u: 14, e: 9 },
  { r: 'PMs and designers', u: 17, e: 6 },
  { r: 'Marketing, support, data', u: 21, e: 2 },
]

export const SLIDES = [
  /* 1 · title and ask */
  {
    id: 'title',
    body: () => (
      <div className="dk-center">
        <h1 className="dk-hero">Crew<span className="ck"><svg viewBox="0 0 20 20"><path d="M5 10.5l3.2 3.2L15 6.8" /></svg></span></h1>
        <p className="dk-sub">A workspace for the people on the team who don't write code.</p>
        <p className="dk-lead">We want PostHog's <b>$2.0M</b> build budget for Crew. The <b>$0.8M</b> for launch? Only if the pilot passes.</p>
        <div className="dk-why">
          <div><b>A measured gap</b><span>38% of weekly users create 8% of experiments</span></div>
          <div><b>A low bar to clear</b><span>Crew breaks even at 20% adoption. Preflight needs 92%</span></div>
          <div><b>A hard stop</b><span>If the pilot fails, we lose only the $2.0M build</span></div>
        </div>
        <div className="dk-meta">PMC@UCSC × PostHog Product Case Competition · Fall 2026</div>
        <div className="dk-meta dim">Praneeth · Vinesh · Jasim</div>
      </div>
    ),
    notes: {
      say: "Say hi. PostHog has $3.0M and one slot in 2027, and we picked Crew. Say the ask now so nobody wonders where this is going: $2.0M to build, and the $0.8M for launch only if the pilot passes. Give the three reasons in one breath. A gap we can measure. A bar that's low compared with Preflight. A hard stop if it doesn't work. Promise a demo, then the numbers, including the ones that don't help us.",
      qa: [['Why not split the money across two features?', 'The case says leadership funds one. What we can do is propose a small test of another feature, and we do that for Budget Guard.']],
    },
  },
  /* 2 · the problem */
  {
    id: 'problem',
    body: () => (
      <>
        <T>PMs, support and marketing are 38% of weekly users but create only 8% of experiments.</T>
        <div className="dk-split">
          <div className="dk-panel">
            <div className="dk-legend"><i className="g" />Share of weekly active people <i className="o" />Share of experiments created</div>
            {ROLES.map((x) => (
              <div className="dk-bars" key={x.r}>
                <div className="dk-bl">{x.r}</div>
                <div className="dk-bt"><div className="g" style={{ width: `${x.u}%` }}><b>{x.u}%</b></div></div>
                <div className="dk-bt"><div className="o" style={{ width: `${Math.max(x.e, 3)}%` }}><b>{x.e}%</b></div></div>
              </div>
            ))}
            <p className="dk-ev-note">Table D4. The PM row and the marketing, support and data row are the ones we add up: 17% + 21% = 38% of users, 6% + 2% = 8% of experiments. Founders stay out.</p>
          </div>
          <div className="dk-qs">
            <Q id="E2.2" who="PM at a 150-person software company" tag="did">"I wasn't sure it used the right event. <mark>We have three that sound like 'signup.'</mark> So I messaged our engineer. She answered on Monday."</Q>
            <Q id="E2.4" who="same PM" tag="did">"No. I file a ticket. <mark>It takes about a week to get picked up.</mark>"</Q>
            <Q id="E2.5" who="same PM" tag="said">"I think so? <mark>I'd be nervous about breaking something in production.</mark>"</Q>
          </div>
        </div>
        <Foot step="Pick it · 20 pts" src="Table D4; Appendix E, interview E2. Highlights and did / said tags are ours" />
      </>
    ),
    notes: {
      say: "The 38% and the 8% both come from adding two rows of Table D4. Users: 17 plus 21. Experiments: 6 plus 2. Per weekly user, an engineer creates about eight times as many experiments as someone in these roles. Then the interview: the PM did the same thing every week. Got a chart, didn't trust it, asked an engineer, waited. What they said was softer. They'd probably do it themselves, but they're nervous about production. That gives Crew two jobs. Make the answer trustworthy. Make the launch safe.",
      qa: [
        ['Why not count founders as non-engineers too?', "Founders are close to even on that table, 14% of users and 9% of experiments. The gap sits in the PM, support and marketing rows."],
        ['How did you get 8x?', 'Engineers are 83% of experiments and 48% of users, so 83 divided by 48 is 1.73. The other roles are 8 divided by 38, which is 0.21. 1.73 over 0.21 is about 8.'],
        ['Is one interview enough?', 'No. It shows how it happens. Table D4 is the population evidence.'],
        ['Is the usage-not-seats point in the packet?', "Yes. It's the note under Table D4: PostHog charges for usage and not for seats."],
      ],
    },
  },
  /* 3 · the feature and the demo */
  {
    id: 'feature',
    body: ({ openDemo }) => (
      <>
        <T>What Crew does, and how we'd know it works.</T>
        <div className="dk-cards3">
          {[
            ['1', 'Ask', 'Ask a question in plain English. The answer names the event it used, shows an engineer\'s "verified" check, and lists the events it skipped.'],
            ['2', 'Launch', 'One click starts an experiment for 10% of users behind a feature flag. If errors go up, it stops itself.'],
            ['3', 'Inform', 'The engineer gets a notification, not a ticket. Results land in Crew once they\'re significant.'],
          ].map(([n, h, p]) => (
            <div className="dk-card" key={n}><div className="dk-num">{n}</div><div className="dk-card-h">{h}</div><p>{p}</p></div>
          ))}
        </div>
        <div className="dk-split2 dk-gap">
          <div className="dk-panel dk-metric slim">
            <div className="dk-h">Experiments created by PMs, support and marketing</div>
            <div className="dk-flow"><span>8%</span><i>→</i><span className="t">20%</span></div>
            <div className="dk-note">8% is today (Table D4: 6% + 2%). 20% is our target, not data.</div>
          </div>
          <div className="dk-panel dk-metric slim">
            <div className="dk-h">Time to launch an experiment</div>
            <div className="dk-flow"><span>≈1 week</span><i>→</i><span className="t">same day</span></div>
            <div className="dk-note">A week is what the PM in E2.4 told us. Same day is our target.</div>
          </div>
        </div>
        <button className="dk-cta" onClick={openDemo}>Open the live demo</button>
        <Foot step="Show it · 20 pts" src="The 10% rollout is a setting we chose, not data" />
      </>
    ),
    notes: {
      say: "Click Open the live demo. It starts in click-through mode. Step to the Crew screen and click the launch button yourself. Under a minute. Hit the Slides button to come back. Our main number is the share of experiments PMs, support and marketing create. More traffic can't inflate a share. The 20% is a target we picked, about 40% of the way to parity with their 38% of users. It isn't a forecast.",
      qa: [
        ['Is the 10% a statistic?', "No. It's a default rollout size in our prototype. Everything in the demo is sample data."],
        ['Who verifies the event?', "An engineer. The demo says Verified by Vinesh (engineer). The engineer stays involved, which matches PostHog's line that nothing ships without you."],
        ['Why 20% and not 38%?', "Engineers will keep making plenty of experiments, so full parity isn't realistic. 20% is something a pilot can test."],
      ],
    },
  },
  /* 4 · the numbers */
  {
    id: 'numbers',
    body: () => (
      <>
        <T>On Finance's numbers Crew comes last. Corrected for who can actually pay, it's about break-even.</T>
        <div className="dk-split">
          <div>
            <table className="dk-table small">
              <thead><tr><th /><th>Expected value</th></tr></thead>
              <tbody>
                <tr><td>Preflight</td><td>$3.69M</td></tr>
                <tr><td>Budget Guard</td><td>$3.02M</td></tr>
                <tr><td>Crew, Finance's numbers</td><td>$2.32M</td></tr>
                <tr className="on"><td>Crew, corrected</td><td>≈ $0.0M</td></tr>
              </tbody>
            </table>
            <div className="dk-math">
              EV = P(pilot) × [ P(hit) × hit + (1 − P(hit)) × miss − launch ] − build<br />
              Crew: 0.6 × [ 0.5 × 14 + 0.5 × 2 − 0.8 ] − 2.0 = <b>$2.32M</b><br />
              Corrected: 20% of the 4,500 mid-size and large teams = 900 teams × $7,000 = $6.3M hit. 0.6 × [ 0.5 × 6.3 + 1 − 0.8 ] − 2.0 ≈ <b>$0.0M</b>. Break-even is <b>$6.27M</b>, about 895 teams.
            </div>
          </div>
          <div className="dk-panel dk-tiny">
            <div className="dk-h">Why we don't buy $14M = 2,000 teams × $7,000</div>
            <ul className="dk-list">
              <li>PostHog charges for usage, not seats. A new person costs the team nothing <Cite>D4 note</Cite></li>
              <li>$7,000 is +490% for a small team ($1,430), +66% for mid-size, +12% for large <Cite>D3</Cite></li>
              <li>2,000 teams is 44% of the 4,500 mid-size and large teams <Cite>D3</Cite></li>
              <li>Mid-size and large teams are 30% of teams and 85% of ARR, so they're our customer <Cite>D3</Cite></li>
            </ul>
            <p className="dk-sm">Budget Guard has the best EV per dollar (2.58 vs Crew's 0.94). That's real, so the next slide is about why Crew anyway.</p>
          </div>
        </div>
        <Foot step="Prove it · 30 pts" src="Tables C1, D3, D4. The corrected adoption share is our scenario; $7,000 is Finance's number" />
      </>
    ),
    notes: {
      say: "Start from Finance's table, unchanged. Crew comes out last at $2.32M. Say so out loud. Then correct one assumption. Seats are free, so the $7,000 only exists if people use more of the product, and that's only believable for mid-size and large teams. Count just those teams, assume 20% adopt, and the value lands around zero. We're not hiding that. The pilot is there to find out whether 20% adoption and $7,000 are realistic. We also don't claim Crew beats Budget Guard on EV.",
      qa: [
        ['Why show Crew losing first?', "Table C1 holds each proposer's claims, not facts. The brief wants us to correct assumptions and show the value again. We do it for Crew, then run the same check on the other two."],
        ['How do you treat a failed pilot?', 'The feature gets shelved. No launch cost, no payoff. Only the build is lost.'],
        ['Then how does Crew make money?', 'Through usage that PMs, support and marketing create. Their AI questions use credits. Their experiments create events and flag usage. The pilot is built to measure exactly that.'],
        ['So why fund it?', "The most we can lose is the $2.0M build, and that happens 40% of the time. If it works, the upside is bigger than the other two. And there's a strategy argument the EV table can't show."],
        ['Does Crew beat Budget Guard on EV?', "No, not on Finance's numbers. Crew would need a hit payoff near $16.3M to match Budget Guard's $3.02M."],
        ['What is EV per $1 spent?', 'EV divided by expected spend. Expected spend is the build cost plus the pilot-pass chance times the launch cost. Preflight: 2.4 + 0.35 × 0.6 = 2.61. Crew: 2.0 + 0.6 × 0.8 = 2.48. Budget Guard: 0.9 + 0.9 × 0.3 = 1.17. EV over that gives 1.41, 0.94 and 2.58.'],
        ['Where does the Preflight correction come from?', 'Only 2,250 paying teams have self-driving on (900 small, 1,125 mid-size, 225 large), and small teams spend $1,430 a year. Count the 1,350 mid-size and large teams at $10,000 each and 100% adoption and you get $13.5M, not $30M. EV = 0.35 × [0.6 × 13.5 − 0.6] − 2.4 = $0.23M, and it goes negative below about 92% adoption.'],
        ['Why not Budget Guard?', "Its best case is $6M and it only helps the 41% who fear the bill (127 of 310 in Table D2). Crew's claimed upside is $14M and it brings in a new group of users. We'd keep Budget Guard alive with a small test: show the projected monthly cost on the free-limit screen and compare add-a-card rates against today's 40% (992 of 2,480, Table D1)."],
      ],
    },
  },
  /* 5 · why Crew, and the pilot */
  {
    id: 'ask',
    body: () => (
      <>
        <T>Why Crew over the other two, and how we'd prove it first.</T>
        <div className="dk-split">
          <table className="dk-table small dk-cmp">
            <thead><tr><th /><th>Preflight</th><th className="on">Crew</th><th>Budget Guard</th></tr></thead>
            <tbody>
              <tr><td>Breaks even if</td><td>92% of its 1,350 mid-size and large teams pay $10,000 more</td><td className="on">20% of 4,500 mid-size and large teams spend $7,000 more</td><td>1,012 of 5,000 capped teams start paying $1,200</td></tr>
              <tr><td>Pilot fails</td><td>65%</td><td className="on">40%</td><td>10%</td></tr>
              <tr><td>If the launch misses</td><td>$0 ARR</td><td className="on">$2M ARR</td><td>$1.5M ARR</td></tr>
              <tr><td>Customer</td><td>Engineers. Only 2,250 teams have self-driving on</td><td className="on">A new group: 38% of weekly users. We start with mid-size and large teams, 85% of ARR</td><td>Free teams at a limit, and small paying teams (70% of paying teams, 15% of ARR)</td></tr>
              <tr><td>Role</td><td>Breakthrough. Unproven that simulated users act like real ones</td><td className="on">Platform. A base for the PM market Amplitude and Mixpanel already serve</td><td>Derivative. Best case $6M</td></tr>
            </tbody>
          </table>
          <div className="dk-panel dk-tiny">
            <div className="dk-h">Our pilot, and the stop rule</div>
            <ul className="dk-list">
              <li>8 weeks, a small group of mid-size and large teams</li>
              <li>Pass: PMs, support and marketing create <b>20%</b> of experiments, and usage grows <b>$7,000</b> a year per adopting team</li>
              <li>Under 10% adoption or under $3,500 per team, we shelve Crew and fund Budget Guard</li>
              <li>Retention isn't in Finance's numbers. We'd measure it too <Cite>A</Cite></li>
            </ul>
            <p className="dk-ask">The ask: <b>$2.0M</b> to build. The <b>$0.8M</b> for launch only if the pilot passes.</p>
          </div>
        </div>
        <Foot step="Pitch it · 30 pts" src="Tables B1, C1, D1, D3, D5. Break-even points and the pilot thresholds are our arithmetic and assumptions" />
      </>
    ),
    notes: {
      say: "This is the slide for why Crew wins even though Budget Guard has the higher EV. Read the first row: Crew breaks even when one in five eligible teams adopts. Preflight needs nearly all of its teams. Then the customer. Crew serves a group that's 38% of weekly users, and we start with the mid-size and large teams that hold 85% of ARR. The PM market is the one PostHog's competitors already sell to. Then the pilot, the stop rule, and the ask. Check that all three of us have spoken.",
      qa: [
        ['Where do the break-even numbers come from?', "Set the expected value to zero and solve for the hit payoff. Crew: 0.6 × [0.5 × H + 1 − 0.8] − 2.0 = 0, so H is $6.27M. At $7,000 a team that's about 895 teams, 19.9% of 4,500. Preflight: 0.35 × [0.6 × H − 0.6] − 2.4 = 0, so H is $12.43M, which is 1,243 of the 1,350 teams at $10,000. That's 92%. Budget Guard: 0.9 × [0.7 × H + 0.15] − 0.9 = 0, so H is $1.21M, or 1,012 teams at $1,200. That's 20% of Finance's 5,000."],
        ['Budget Guard breaks even at about the same share. Why not that one?', "It does, and it costs less and passes its pilot more often. We're not claiming otherwise. Our case for Crew is the size of the customer and the direction. A mid-size team spends $10,670 a year and a large team $60,000 (D3), and a Budget Guard convert spends about $1,200 (D1). Budget Guard's best case is $6M. Crew's eligible base is 4,500 teams, so at Finance's own $7,000 a team the ceiling is $31.5M at full adoption. And it's the only one of the three that brings a new group of users onto PostHog. We'd also keep Budget Guard alive with a small test: show the projected monthly cost on the free-limit screen and compare add-a-card rates against today's 40% (992 of 2,480, Table D1)."],
        ['Why not Preflight?', "Its pilot fails 65% of the time, its payoff assumes 3,000 teams when 2,250 have self-driving on, and small teams spend $1,430 a year, so $10,000 more doesn't fit them. Count only the 1,350 mid-size and large teams at 100% adoption and you get $13.5M, not $30M. EV is $0.23M, and it goes negative below 92% adoption. The engineer in E1 also said he wouldn't trust a prediction (E1.5)."],
        ['Can an 8-week pilot really measure usage growth?', "It measures a run rate, which we annualise, and we say so. If the result is murky, we extend the pilot. We don't launch."],
        ['Where does $3,500 come from?', "It's half of $7,000. At 20% adoption that gives a hit payoff of $3.15M and an expected value of −$0.94M. It's our own stop rule, so it's an assumption."],
        ['Is the retention benefit proven?', "No. The packet has no churn data. One point of yearly churn on the $85M of mid-size and large ARR would be worth $0.85M, so it's possible upside, and we'd measure it in the pilot."],
      ],
    },
  },
]

export default function Deck({ onClose, openDemo }) {
  const [i, setI] = useState(0)
  const [notes, setNotes] = useState(false)
  const [scale, setScale] = useState(1)
  const root = useRef(null)
  const n = SLIDES.length

  useEffect(() => {
    const fit = () => setScale(Math.min(window.innerWidth / 1280, (window.innerHeight - 96) / 720, 1.6))
    fit(); window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const k = e.key
      if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k) && !(k === ' ' && e.shiftKey)) { e.preventDefault(); setI((v) => Math.min(n - 1, v + 1)) }
      else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(k) || (k === ' ' && e.shiftKey)) { e.preventDefault(); setI((v) => Math.max(0, v - 1)) }
      else if (k === 'Home') setI(0)
      else if (k === 'End') setI(n - 1)
      else if (k === 'Escape') onClose()
      else if (k === 'n' || k === 'N') setNotes((v) => !v)
      e.stopImmediatePropagation()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [n, onClose])

  const S = SLIDES[i]
  return (
    <div className="deck" ref={root} role="dialog" aria-label="Pitch slides">
      <div className="deck-stage" onClick={(e) => { if (e.target.closest('button,a')) return; setI((v) => Math.min(n - 1, v + 1)) }}>
        <div className="deck-slide" style={{ transform: `scale(${scale})` }} key={S.id}>
          {S.body({ openDemo })}
        </div>
      </div>
      <div className="deck-bar">
        <button onClick={onClose} className="dk-b">Close</button>
        <div className="dk-dots">{SLIDES.map((s, k) => <button key={s.id} className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} />)}</div>
        <span className="dk-count">{i + 1} / {n}</span>
        <button className="dk-b" onClick={() => setNotes((v) => !v)} aria-pressed={notes}>Notes</button>
        <button className="dk-b" disabled={i === 0} onClick={() => setI(i - 1)}>Back</button>
        <button className="dk-b pri" onClick={() => (i < n - 1 ? setI(i + 1) : onClose())}>{i < n - 1 ? 'Next' : 'Done'}</button>
      </div>
      {notes && (
        <aside className="deck-notes">
          <div className="dn-h">Speaker notes · slide {i + 1}</div>
          <p>{S.notes.say}</p>
          {S.notes.qa.length > 0 && <div className="dn-h">Likely judge questions</div>}
          {S.notes.qa.map(([q, a]) => (<div key={q} className="dn-q"><b>{q}</b><span>{a}</span></div>))}
        </aside>
      )}
    </div>
  )
}
