import React, { useEffect, useRef, useState } from 'react'

/* Every number on these slides is either from the case packet (cited by table / interview)
   or derived from packet numbers with the arithmetic shown. Anything we assumed is labelled. */

const T = ({ children }) => <h2 className="dk-title">{children}</h2>
const Foot = ({ step, src }) => (
  <div className="dk-foot"><span>{step}</span><span>{src}</span></div>
)
const Cite = ({ children }) => <span className="dk-cite">{children}</span>


/* Evidence helpers: tables and quotes are copied from the case packet. Highlighted rows and notes are ours. */
const Ev = ({ title, cols, rows, note, small }) => {
  const hasNote = rows.some((r) => r.note)
  return (
    <div className={`dk-ev ${small ? 'small' : ''}`}>
      <div className="dk-ev-t">{title}</div>
      <table>
        <thead><tr>{cols.map((c, i) => <th key={i}>{c}</th>)}{hasNote && <th />}</tr></thead>
        <tbody>
          {rows.map((r, k) => (
            <tr key={k} className={r.hl ? 'hl' : ''}>
              {r.c.map((x, i) => <td key={i}>{x}</td>)}
              {hasNote && <td className="nt">{r.note || ''}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {note && <p className="dk-ev-note">{note}</p>}
    </div>
  )
}
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
  /* 1 */
  {
    id: 'title',
    body: () => (
      <div className="dk-center">
        <h1 className="dk-hero">Crew<span className="ck"><svg viewBox="0 0 20 20"><path d="M5 10.5l3.2 3.2L15 6.8" /></svg></span></h1>
        <p className="dk-sub">A workspace for the people on the team who don't write code.</p>
        <div className="dk-meta">PMC@UCSC × PostHog Product Case Competition · Fall 2026</div>
        <div className="dk-meta dim">Praneeth · Vinesh · Jasim</div>
      </div>
    ),
    notes: { say: 'Introduce ourselves. PostHog has $3.0M for one feature in 2027. We picked Crew. Tell them we will show a demo and then go through the numbers, including the parts that are not in our favor.', qa: [] },
  },
  /* 2 */
  {
    id: 'decision',
    body: () => (
      <>
        <T>Our recommendation: build Crew.</T>
        <div className="dk-cards3">
          {[
            ['Preflight', 'Engineers with self-driving on', 'Breakthrough', '9 months', '$2.4M'],
            ['Crew', 'PMs, support and marketing at paying teams', 'Platform', '6 months', '$2.0M', true],
            ['Budget Guard', 'Free teams at a limit, small paying teams', 'Derivative', '3 months', '$0.9M'],
          ].map(([n, c, ty, tm, b, on]) => (
            <div key={n} className={`dk-card ${on ? 'on' : ''}`}>
              <div className="dk-card-h">{n}</div>
              <div className="dk-row"><span>Customer</span><b>{c}</b></div>
              <div className="dk-row"><span>Type</span><b>{ty}</b></div>
              <div className="dk-row"><span>Time to launch</span><b>{tm}</b></div>
              <div className="dk-row"><span>Cost to build</span><b>{b}</b></div>
            </div>
          ))}
        </div>
        <p className="dk-lead">We're asking for the <b>$2.0M</b> to build Crew. The <b>$0.8M</b> launch money only gets spent if the pilot passes.</p>
        <Foot step="The decision" src="Tables B1, C1" />
      </>
    ),
    notes: { say: 'These are the three options from the case. We want the $2.0M build budget for Crew. The case already has a pilot step, so we only spend the launch money if the pilot passes.', qa: [['Why not split the money across two features?', 'The case says leadership will fund one. What we can do is propose a small test of another feature, and we do that for Budget Guard on slide 15.']] },
  },
  /* 3 */
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
          </div>
          <div className="dk-side">
            <div className="dk-big">≈8×</div>
            <p>Per weekly user, an engineer creates about 8 times as many experiments as someone in PM, support or marketing.</p>
            <p className="dk-calc">(83% ÷ 48%) ÷ (8% ÷ 38%) = 1.73 ÷ 0.21 ≈ 8.2</p>
            <p>Also, half of PostHog AI users are not engineers or founders. <Cite>Appendix A</Cite></p>
          </div>
        </div>
        <Foot step="Pick it · 20 pts" src="Table D4 (PMs and designers 17% + 6%, marketing, support and data 21% + 2%); Appendix A" />
      </>
    ),
    notes: {
      say: 'The 38% and the 8% each come from adding two rows of Table D4. For users it is 17 plus 21, and for experiments it is 6 plus 2. We left founders out because they create 9% of experiments with 14% of users, so they are close to even.',
      qa: [['Why not count founders as non-engineers too?', 'Founders are close to even on this table, 14% of users and 9% of experiments. The gap is in the PM, support and marketing rows.'], ['How did you get 8x?', 'Engineers are 83% of experiments and 48% of users, so 83 divided by 48 is 1.73. The other roles are 8 divided by 38, which is 0.21. 1.73 divided by 0.21 is about 8.']],
    },
  },
  /* Evidence: D4 */
  {
    id: 'ev-d4',
    body: () => (
      <>
        <T>Evidence: Table D4 and the PostHog AI user mix.</T>
        <div className="dk-split">
          <Ev
            title="Table D4. People active each week at paying teams, by role."
            cols={['Role', 'Share of weekly active people', 'Share of experiments created']}
            rows={[
              { c: ['Engineers', '48%', '83%'] },
              { c: ['Founders', '14%', '9%'] },
              { c: ['PMs and designers', '17%', '6%'], hl: true, note: '17% + 21% = 38% of users' },
              { c: ['Marketing, support, and data', '21%', '2%'], hl: true, note: '6% + 2% = 8% of experiments' },
            ]}
            note="Packet note: PostHog charges for usage (events, recordings, AI credits) and not for seats. Adding a person to a team costs the team nothing."
          />
          <div className="dk-qs">
            <Q id="Appendix A" who="PostHog fact sheet (public)">"Of the people who use PostHog AI, <mark>25 percent are engineers, 25 percent are founders, and 50 percent hold other roles</mark>."</Q>
          </div>
        </div>
        <Foot step="Evidence" src="Highlighted rows and the sums are our annotations; the table is copied from the packet" />
      </>
    ),
    notes: { say: 'Show this if a judge asks where the 38% and the 8% come from. The two highlighted rows are the PM and the marketing, support and data rows. We add them up. The founders row is left out on purpose.', qa: [['Is the usage-not-seats point really in the packet?', 'Yes, it is the note under Table D4: PostHog charges for usage and not for seats.']] },
  },
  /* 4 */
  {
    id: 'did-said',
    body: () => (
      <>
        <T>What the PM did, and what the PM said.</T>
        <div className="dk-split2">
          <div className="dk-panel">
            <div className="dk-h">What they did</div>
            <ol className="dk-steps">
              <li>Asked PostHog AI and got a chart in a minute <Cite>E2.1</Cite></li>
              <li>Didn't use it, because three events sound like "signup" <Cite>E2.2</Cite></li>
              <li>Messaged an engineer, who answered on Monday <Cite>E2.2</Cite></li>
              <li>Posts the chart in Slack and asks "is this right?" most weeks <Cite>E2.3</Cite></li>
              <li>Has never set up an experiment. They file a ticket and it takes about a week <Cite>E2.4</Cite></li>
            </ol>
          </div>
          <div className="dk-panel">
            <div className="dk-h">What they said</div>
            <p className="dk-quote">"I think so? I'd be nervous about breaking something in production."</p>
            <Cite>E2.5, when asked if they would set up experiments themselves</Cite>
            <div className="dk-twojobs">
              <div><b>Trust</b><span>Which event did the AI use?</span></div>
              <div><b>Safety</b><span>Will launching break production?</span></div>
            </div>
          </div>
        </div>
        <Foot step="Pick it · 20 pts" src="Interview E2: PM at a 150-person software company" />
      </>
    ),
    notes: { say: 'We split what the PM did from what they said. They did the same thing every week: get a chart, not trust it, ask an engineer, wait. They said they would probably run experiments themselves but they are nervous about production. So Crew has two jobs, making the answer trustworthy and making the launch safe.', qa: [['Is one interview enough?', 'No, it only shows how it happens. The population evidence is Table D4: 38% of users and 8% of experiments.']] },
  },
  /* Evidence: E2 */
  {
    id: 'ev-e2',
    body: () => (
      <>
        <T>Evidence: interview E2, in the PM's own words.</T>
        <div className="dk-qgrid">
          <Q id="E2.1" who="PM at a 150-person software company" tag="did">"Last Thursday. I wanted to know if the new onboarding cut drop-off. I asked PostHog AI and <mark>had a chart in a minute</mark>."</Q>
          <Q id="E2.2" who="same PM" tag="did">"Nothing yet. I wasn't sure it used the right event. <mark>We have three that sound like 'signup.'</mark> So I messaged our engineer. She answered on Monday."</Q>
          <Q id="E2.3" who="same PM" tag="did">"Most weeks. I screenshot the chart into Slack and ask, <mark>'is this right?'</mark>"</Q>
          <Q id="E2.4" who="same PM" tag="did">"No. I file a ticket. <mark>It takes about a week to get picked up.</mark>"</Q>
          <Q id="E2.5" who="same PM" tag="said">"I think so? <mark>I'd be nervous about breaking something in production.</mark>"</Q>
        </div>
        <Foot step="Evidence" src="Appendix E, interview E2. Highlights and the did / said tags are ours" />
      </>
    ),
    notes: { say: 'These are direct quotes from the packet, with the exchange numbers. The first four are things the PM did. The last one is what they said they would do, and it is hedged.', qa: [['Is this just one person?', 'Yes, one interview. We use it for the mechanism and use Table D4 for the numbers.']] },
  },
  /* 5 */
  {
    id: 'feature',
    body: ({ openDemo }) => (
      <>
        <T>What Crew does.</T>
        <div className="dk-cards3">
          {[
            ['1', 'Ask', 'You ask a question in plain English. The answer says which event it used, shows an engineer\'s "verified" check, and lists the events it didn\'t use.'],
            ['2', 'Launch', 'One click starts an experiment for 10% of users behind a feature flag. It stops on its own if errors go up.'],
            ['3', 'Inform', 'The engineer gets a notification instead of a ticket. Results show up in Crew once they\'re significant.'],
          ].map(([n, h, p]) => (
            <div className="dk-card" key={n}><div className="dk-num">{n}</div><div className="dk-card-h">{h}</div><p>{p}</p></div>
          ))}
        </div>
        <button className="dk-cta" onClick={openDemo}>Open the live demo</button>
        <Foot step="Show it · 20 pts" src="The 10% rollout is a setting we chose, not data" />
      </>
    ),
    notes: { say: 'Click "Open the live demo". It starts in click-through mode: step to the Crew screen, then click the launch button yourself. It takes under a minute. Press the Slides button to come back here.', qa: [['Is the 10% a statistic?', 'No, it is just the default rollout size in our prototype. All the data in the demo is sample data.'], ['Who verifies the event?', 'An engineer. In the demo it says "Verified by Vinesh (engineer)". The engineer stays involved, which matches PostHog\'s line that nothing ships without you.']] },
  },
  /* 6 */
  {
    id: 'metric',
    body: () => (
      <>
        <T>How we would know it's working.</T>
        <div className="dk-split">
          <div className="dk-panel dk-metric">
            <div className="dk-h">Experiments created by PMs, support and marketing</div>
            <div className="dk-flow"><span>8%</span><i>→</i><span className="t">20%</span></div>
            <div className="dk-note">8% is today (Table D4: 6% + 2%). 20% is our target, not data.</div>
          </div>
          <div className="dk-panel dk-metric">
            <div className="dk-h">Time to launch an experiment</div>
            <div className="dk-flow"><span>≈1 week</span><i>→</i><span className="t">same day</span></div>
            <div className="dk-note">A week is what the PM in E2.4 told us. Same day is our target.</div>
          </div>
        </div>
        <p className="dk-lead">20% gets about 40% of the way to their 38% share of users: (20 − 8) ÷ (38 − 8) = 0.4.</p>
        <Foot step="Pick it · 20 pts" src="Table D4; E2.4" />
      </>
    ),
    notes: { say: 'Our main number is the share of experiments created by PMs, support and marketing. It is a share, so more traffic cannot inflate it. The 20% is a target we picked, about 40% of the way to parity. We are not forecasting it.', qa: [['Why 20% and not 38%?', 'Engineers will keep creating a lot of experiments, so full parity is not realistic. 20% is something we can test in a pilot.']] },
  },
  /* 7 */
  {
    id: 'finance',
    body: () => (
      <>
        <T>Using Finance's numbers, Crew has the lowest expected value.</T>
        <table className="dk-table">
          <thead><tr><th /><th>Preflight</th><th className="on">Crew</th><th>Budget Guard</th></tr></thead>
          <tbody>
            <tr><td>Cost to build</td><td>$2.4M</td><td className="on">$2.0M</td><td>$0.9M</td></tr>
            <tr><td>P(pass pilot)</td><td>0.35</td><td className="on">0.6</td><td>0.9</td></tr>
            <tr><td>Cost to launch</td><td>$0.6M</td><td className="on">$0.8M</td><td>$0.3M</td></tr>
            <tr><td>P(hit target)</td><td>0.6</td><td className="on">0.5</td><td>0.7</td></tr>
            <tr><td>ARR if hit / if miss</td><td>$30M / $0</td><td className="on">$14M / $2M</td><td>$6M / $1.5M</td></tr>
            <tr className="ev"><td>Expected value</td><td>$3.69M</td><td className="on">$2.32M</td><td>$3.02M</td></tr>
          </tbody>
        </table>
        <div className="dk-math">
          EV = P(pilot) × [ P(hit) × hit + (1 − P(hit)) × miss − launch ] − build<br />
          Crew: 0.6 × [ 0.5 × 14 + 0.5 × 2 − 0.8 ] − 2.0 = 0.6 × 7.2 − 2.0 = <b>$2.32M</b> · Preflight: 0.35 × 17.4 − 2.4 = <b>$3.69M</b> · Budget Guard: 0.9 × 4.35 − 0.9 = <b>$3.02M</b>
        </div>
        <Foot step="Prove it · 30 pts" src="Table C1. A feature that fails its pilot is shelved, so it pays no launch cost and earns no payoff" />
      </>
    ),
    notes: { say: 'We start from Finance\'s table without changing anything, and Crew comes out lowest. Say that directly. The next two slides are about which of Finance\'s assumptions we do not believe, which the brief asks for.', qa: [['Why show Crew losing first?', 'Table C1 is each proposer\'s claim, not fact. The brief asks us to correct assumptions and show the value again, so we do that for Crew and then apply the same check to the other two.'], ['How do you treat a failed pilot?', 'The feature is shelved. You don\'t pay the launch cost and you don\'t get a payoff. You only lose the build cost.']] },
  },
  /* 8 */
  {
    id: 'challenge',
    body: () => (
      <>
        <T>Finance's Crew payoff is 2,000 teams × $7,000 = $14M. We don't think that holds.</T>
        <div className="dk-cards3">
          <div className="dk-card">
            <div className="dk-card-h">Pricing is by usage, not seats</div>
            <p>Adding a person costs the team nothing, so more people using PostHog doesn't raise the bill. The extra $7,000 would have to come from more usage: AI credits, events, recordings.</p>
            <Cite>Table D4 note</Cite>
          </div>
          <div className="dk-card">
            <div className="dk-card-h">$7,000 is a lot for small teams</div>
            <div className="dk-mini"><span>Small $1,430</span><b>+490%</b></div>
            <div className="dk-mini"><span>Mid-size $10,670</span><b>+66%</b></div>
            <div className="dk-mini"><span>Large $60,000</span><b>+12%</b></div>
            <p className="dk-sm">Extra $7,000 as a share of what each size spends today.</p>
            <Cite>Table D3</Cite>
          </div>
          <div className="dk-card">
            <div className="dk-card-h">2,000 teams is a big share</div>
            <p>That's 13% of all 15,000 paying teams, and 44% of the 4,500 mid-size and large teams (3,750 + 750), which are the only ones likely to add $7,000.</p>
            <Cite>Table D3</Cite>
          </div>
        </div>
        <p className="dk-lead">Mid-size and large teams are 30% of paying teams but 85% of ARR ($40M + $45M out of $100M), so they're who we're building for.</p>
        <Foot step="Prove it · 30 pts" src="Tables D3, D4; Table C1 note" />
      </>
    ),
    notes: { say: 'We have three reasons. The main one is the pricing note: seats are free, so Crew only makes money if people use more of the product. A technical judge will probably ask about this, so we bring it up ourselves.', qa: [['Then how does Crew make money?', 'From the usage PMs, support and marketing create: AI credits from their questions, and events and flag usage from the experiments they run. The pilot is designed to measure that.'], ['Why leave out small teams?', 'Small teams spend $1,430 a year on average. Adding $7,000 would be a 490% increase.']] },
  },
  /* Evidence: D3 + Finance note */
  {
    id: 'ev-d3',
    body: () => (
      <>
        <T>Evidence: Table D3 and Finance's note on Crew.</T>
        <Ev
          title="Table D3. Paying teams, ARR, and average spend by team size."
          cols={['Team size', 'Paying teams', 'Share of teams', 'ARR', 'Share of ARR', 'Average spend per team per year']}
          rows={[
            { c: ['Small', '10,500', '70%', '$15M', '15%', '$1,430'], hl: true, note: '$7,000 extra = +490%' },
            { c: ['Mid-size', '3,750', '25%', '$40M', '40%', '$10,670'], note: '+66%' },
            { c: ['Large', '750', '5%', '$45M', '45%', '$60,000'], note: '+12%' },
            { c: ['All paying teams', '15,000', '100%', '$100M', '100%', '$6,670'] },
          ]}
          note="Packet note: small teams have 1 to 10 people, mid-size teams 11 to 100, and large teams more than 100. Mid-size + large = 4,500 teams (30%) and $85M of ARR (85%)."
          small
        />
        <div className="dk-qs wide">
          <Q id="Table C1 note" who="Finance, on Crew">"The $14M assumes 2,000 paying teams each spend $7,000 a year more once their PMs, support, and marketing use PostHog directly."</Q>
        </div>
        <Foot step="Evidence" src="The percentages in the right-hand column are our arithmetic: 7,000 ÷ 1,430, 7,000 ÷ 10,670, 7,000 ÷ 60,000" />
      </>
    ),
    notes: { say: 'Table D3 is how we check Finance\'s $7,000. It is 490% of what a small team spends today, 66% for mid-size and 12% for large. The quote is Finance\'s own note under Table C1.', qa: [['Are you saying Crew should only target mid-size and large teams?', 'For the revenue case, yes. Small teams are 70% of teams but only 15% of ARR.']] },
  },
  /* 9 */
  {
    id: 'corrected',
    body: () => (
      <>
        <T>With adoption corrected, Crew is about break-even.</T>
        <table className="dk-table small">
          <thead><tr><th>Share of the 4,500 mid-size and large teams that adopt</th><th>Teams</th><th>Hit ARR (× $7,000)</th><th>Expected value</th></tr></thead>
          <tbody>
            <tr><td>10%</td><td>450</td><td>$3.15M</td><td className="neg">−$0.94M</td></tr>
            <tr className="on"><td>20% (our pilot target)</td><td>900</td><td>$6.30M</td><td>≈ $0.0M</td></tr>
            <tr><td>30%</td><td>1,350</td><td>$9.45M</td><td>+$0.96M</td></tr>
            <tr><td>44% (Finance's 2,000)</td><td>2,000</td><td>$14.0M</td><td>+$2.32M</td></tr>
          </tbody>
        </table>
        <div className="dk-math">
          Crew EV = 0.6 × [ 0.5 × H + 0.5 × 2 − 0.8 ] − 2.0, where H is the hit payoff. It equals zero at H = <b>$6.27M</b>, which is about 895 teams, or <b>19.9%</b> of 4,500.<br />
          Finance's table leaves out churn. Each point of yearly churn we prevent on the $85M of mid-size and large ARR is worth $0.85M (1% × $85M). There's no churn data in the packet, so we're treating that as something to test, not counting it.
        </div>
        <Foot step="Prove it · 30 pts" src="Tables C1, D3. The $7,000 is Finance's number; the adoption shares are our scenarios" />
      </>
    ),
    notes: { say: 'Finance had $2.32M. If we only count the mid-size and large teams that could afford the extra spend, and assume 20% of them adopt, it comes out around zero. We are not hiding that. The pilot exists to find out whether 20% adoption and $7,000 are realistic.', qa: [['So why fund it?', 'The most we can lose is the $2.0M build, and that happens 40% of the time. The upside is bigger than the other two if it works, and there is a strategy argument that is not in the EV table (slide 19).'], ['Does Crew beat Budget Guard on EV?', 'No, not on Finance\'s numbers. Crew would need a hit payoff of about $16.3M to match Budget Guard\'s $3.02M. We are not claiming it does.']] },
  },
  /* 10 */
  {
    id: 'preflight',
    body: () => (
      <>
        <T>Preflight's payoff assumes more teams than have the feature turned on.</T>
        <div className="dk-cards3">
          <div className="dk-card">
            <div className="dk-card-h">3,000 teams, but only 2,250 have it</div>
            <p>Finance assumes 3,000 teams use Preflight. Only 2,250 paying teams have self-driving turned on today (900 small, 1,125 mid-size, 225 large).</p>
            <Cite>Table C1 note, D5</Cite>
          </div>
          <div className="dk-card">
            <div className="dk-card-h">$10,000 more per team</div>
            <p>Small teams spend $1,430 a year on average, so we only count mid-size and large teams with self-driving: 1,125 + 225 = 1,350. At $10,000 each and 100% adoption that's $13.5M, not $30M.</p>
            <Cite>Table D3, D5</Cite>
          </div>
          <div className="dk-card">
            <div className="dk-card-h">Value after the correction</div>
            <p>0.35 × [ 0.6 × 13.5 − 0.6 ] − 2.4 = <b>$0.23M</b> at 100% adoption. It goes negative below about 92% of that.</p>
            <p className="dk-sm">Engineers also said they wouldn't trust a prediction (E1.5), and they look at 5 of 14 agent pull requests a week (D5).</p>
          </div>
        </div>
        <p className="dk-lead">By not picking Preflight, PostHog skips a project with a 65% chance of failing its pilot.</p>
        <Foot step="Prove it · Backup" src="Tables C1, D3, D5; E1.5" />
      </>
    ),
    notes: { say: 'Use this if someone asks what PostHog gives up by not building Preflight. It has a 0.35 chance of passing its pilot, a $2.4M build cost, and a payoff that assumes more teams than actually have self-driving turned on.', qa: [['Where does the 92% come from?', 'EV = 0.35 × (0.6 × H − 0.6) − 2.4 equals zero when H is $12.4M. That is 92% of $13.5M, which is what you get at 100% adoption.']] },
  },
  /* Evidence: D5 + E1 */
  {
    id: 'ev-d5',
    body: () => (
      <>
        <T>Evidence: Table D5, Finance's note on Preflight, and an engineer's view.</T>
        <div className="dk-split2">
          <div>
            <Ev
              title="Table D5. Agent pull requests in a week at the average team with self-driving turned on."
              cols={['Step', 'Per team per week']}
              rows={[
                { c: ['Opened by PostHog\'s agents', '14'] },
                { c: ['Looked at by an engineer within 7 days', '5'] },
                { c: ['Merged', '3'] },
                { c: ['Never looked at', '9'] },
              ]}
              note="Packet note: 2,250 paying teams have self-driving turned on: 900 small, 1,125 mid-size, and 225 large."
              small
            />
            <div className="dk-qs wide"><Q id="Table C1 note" who="Finance, on Preflight">"The $30M assumes <mark>3,000 teams</mark> use Preflight and each spends $10,000 a year more with us."</Q></div>
          </div>
          <div className="dk-qs">
            <Q id="E1.1" who="staff engineer at a 40-person AI startup">"Monday. 31 pull requests from the weekend. I merged four. … <mark>The rest I never opened.</mark>"</Q>
            <Q id="E1.5" who="same engineer">"I'd want it to tell me what happens if I merge. <mark>I don't know if I'd believe a prediction, though.</mark>"</Q>
          </div>
        </div>
        <Foot step="Evidence" src="Tables C1, D5; Appendix E, interview E1. Highlights are ours; the ellipsis marks words we left out" />
      </>
    ),
    notes: { say: 'This backs up the Preflight slide: 3,000 teams in Finance\'s note versus 2,250 teams with self-driving on, and an engineer who says he would not trust a prediction.', qa: [] },
  },
  /* 11 */
  {
    id: 'budget',
    body: () => (
      <>
        <T>Budget Guard is the strongest alternative.</T>
        <table className="dk-table small">
          <thead><tr><th /><th>EV</th><th>Expected spend</th><th>EV per $1 spent</th><th>Chance pilot fails</th></tr></thead>
          <tbody>
            <tr><td>Preflight</td><td>$3.69M</td><td>$2.61M</td><td>1.41</td><td>65%</td></tr>
            <tr className="on"><td>Crew</td><td>$2.32M</td><td>$2.48M</td><td>0.94</td><td>40%</td></tr>
            <tr><td>Budget Guard</td><td>$3.02M</td><td>$1.17M</td><td>2.58</td><td>10%</td></tr>
          </tbody>
        </table>
        <div className="dk-split2">
          <div className="dk-panel">
            <div className="dk-h">Limits of Budget Guard</div>
            <ul className="dk-list">
              <li>Only 41% of teams at a limit that didn't add a card gave fear of an unpredictable bill as the reason (127 of 310) <Cite>D2</Cite></li>
              <li>27% didn't need more, 14% needed approval, and 10% moved to another tool <Cite>D2</Cite></li>
              <li>Its best case is $6M, and capped paying teams could end up spending less <Cite>B1, C1</Cite></li>
            </ul>
          </div>
          <div className="dk-panel">
            <div className="dk-h">A test we would run on it</div>
            <p>Show the projected monthly cost on the free-limit screen for some teams at a limit, and compare how many add a card against today's 40% (992 of 2,480). <Cite>D1</Cite></p>
            <p className="dk-sm">Expected spend = build + P(pass) × launch. Budget Guard has the best EV per dollar and we're not disputing that.</p>
          </div>
        </div>
        <Foot step="Prove it · 30 pts" src="Tables C1, D1, D2; expected spend and the ratios are our arithmetic" />
      </>
    ),
    notes: { say: 'Be upfront here. Budget Guard is the best bet in Finance\'s table once you account for how little it costs. Our reasons for Crew are the bigger upside and the new group of users, not that it wins on EV per dollar.', qa: [['Why not Budget Guard?', 'Its best case is $6M, and it only helps the 41% who are afraid of the bill. Crew\'s claimed upside is $14M and it brings in a new group of users. We also keep Budget Guard going with a small test.'], ['What is "EV per $1 spent"?', 'It is EV divided by expected spend, where expected spend is the build cost plus the pilot-pass chance times the launch cost. Preflight is 2.4 + 0.35 × 0.6 = 2.61. Crew is 2.0 + 0.6 × 0.8 = 2.48. Budget Guard is 0.9 + 0.9 × 0.3 = 1.17.']] },
  },
  /* Evidence: D1 + D2 + E3 */
  {
    id: 'ev-d1',
    body: () => (
      <>
        <T>Evidence: Tables D1 and D2, and a free-plan founder.</T>
        <div className="dk-split2">
          <Ev
            title="Table D1. New-team funnel, 40,000 teams signed up in one quarter, followed for 90 days."
            cols={['Step', 'Teams', 'From step above']}
            rows={[
              { c: ['Signed up', '40,000', ''] },
              { c: ['Sent a first event', '24,800', '62%'] },
              { c: ['2 or more people looked at data in week 4', '9,920', '40%'] },
              { c: ['Reached a free limit within 90 days', '2,480', '25%'], hl: true },
              { c: ['Added a card', '992', '40%'], hl: true },
            ]}
            note="Packet note: of the 2,480 teams that reached a free limit, 1,488 did not add a card. Another 6,000 teams from earlier quarters are at a free limit today."
            small
          />
          <Ev
            title="Table D2. Main reason for not adding a card, 310 survey responses."
            cols={['Reason', 'Responses', 'Share']}
            rows={[
              { c: ['Afraid of a bill I cannot predict', '127', '41%'], hl: true },
              { c: ['Did not need more: turned the product off or waited for the monthly reset', '84', '27%'] },
              { c: ['Needed someone else\'s approval to pay', '43', '14%'] },
              { c: ['Moved to another tool', '31', '10%'] },
              { c: ['Other', '25', '8%'] },
            ]}
            note="Packet note: the survey went to the 1,488 teams that reached a limit and did not add a card, and 310 responded (21 percent)."
            small
          />
        </div>
        <div className="dk-qs wide"><Q id="E3.5" who="solo founder on the free plan">"If I knew it was <mark>$50 a month, flat, I'd pay today</mark>."</Q></div>
        <Foot step="Evidence" src="Appendix D, tables D1 and D2; Appendix E, interview E3. Highlights are ours" />
      </>
    ),
    notes: { say: 'This is the evidence for the Budget Guard slide. The highlighted row in Table D2 is the 41% who are afraid of an unpredictable bill. 992 of 2,480 added a card, which is the 40% we compare a Budget Guard test against.', qa: [['Does the survey represent everyone?', 'Not necessarily. 310 of 1,488 responded, which is 21%, so we treat 41% as a rough share.']] },
  },
  /* 12 */
  {
    id: 'test',
    body: () => (
      <>
        <T>The assumption most likely to be wrong, and a cheap way to test it.</T>
        <div className="dk-split2">
          <div className="dk-panel">
            <div className="dk-h">Most likely wrong</div>
            <p className="dk-big sm">20% of mid-size and large teams adopt Crew and each one spends $7,000 more.</p>
            <p>Seats are free, so any extra revenue has to come from usage that PMs, support and marketing create.</p>
          </div>
          <div className="dk-panel">
            <div className="dk-h">Our proposed test</div>
            <ul className="dk-list">
              <li>An 8-week pilot with a small group of mid-size and large teams</li>
              <li>It passes if PMs, support and marketing create <b>20%</b> of experiments (up from 8%)</li>
              <li>and usage grows by <b>$7,000</b> or more per year for each adopting team (annualised)</li>
              <li>If either fails, we shelve Crew and only the build cost is lost</li>
            </ul>
          </div>
        </div>
        <Foot step="Prove it · 30 pts" src="The pilot size and the thresholds are our assumptions" />
      </>
    ),
    notes: { say: 'This answers the judges\' question about the assumption most likely to be false and the cheapest test. The thresholds come straight from the break-even math: $7,000 at 20% adoption is where the expected value crosses zero.', qa: [['Can an 8-week pilot really measure usage growth?', 'It measures a run rate, which we annualise, and we say that. If the result is unclear we would extend the pilot instead of launching.']] },
  },
  /* 13 */
  {
    id: 'mind',
    body: () => (
      <>
        <T>What would make us stop.</T>
        <div className="dk-cards3">
          <div className="dk-card"><div className="dk-card-h">What we'd lose</div><p>If the pilot fails (a 40% chance), we lose the $2.0M build. The $0.8M launch money is never spent.</p></div>
          <div className="dk-card"><div className="dk-card-h">When we'd stop</div><p>If fewer than 10% of eligible teams adopt, or usage grows by less than $3,500 per team, we shelve Crew. At 10% adoption the EV is −$0.94M.</p></div>
          <div className="dk-card"><div className="dk-card-h">What we'd fund instead</div><p>Budget Guard, which costs $0.9M to build and $0.3M to launch and has a 0.9 chance of passing its pilot.</p></div>
        </div>
        <Foot step="Pitch it · 30 pts" src="Table C1; the thresholds are our assumptions" />
      </>
    ),
    notes: { say: 'We decide the stop rule now, before spending anything. If the numbers come in below it, we shelve Crew and fund Budget Guard.', qa: [['Where does $3,500 come from?', 'It is half of $7,000. At 20% adoption that gives a hit payoff of $3.15M, and the expected value is −$0.94M. It is our own stop rule, so it is an assumption.']] },
  },
  /* 14 */
  {
    id: 'future',
    body: () => (
      <>
        <T>Why Crew fits where PostHog is going.</T>
        <div className="dk-split2">
          <div className="dk-panel">
            <div className="dk-h">Why now</div>
            <ul className="dk-list">
              <li>PostHog AI is now the default for new users, and half of them aren't engineers or founders <Cite>Appendix A</Cite></li>
              <li>PostHog is moving from read-only analytics to software that does the work <Cite>Appendix A</Cite></li>
              <li>Amplitude and Mixpanel already build for PMs <Cite>Appendix A, B1</Cite></li>
            </ul>
          </div>
          <div className="dk-panel">
            <div className="dk-h">What Crew adds</div>
            <ul className="dk-list">
              <li>A product for the roles that already use PostHog but weren't the target</li>
              <li>Engineers stay in control: they verify events, and launches use flags, auto-stop and an FYI instead of a ticket</li>
              <li>Finance doesn't count retention. The head of growth says teams with more people in PostHog don't leave, and we'd measure that in the pilot</li>
            </ul>
          </div>
        </div>
        <Foot step="Pitch it · 30 pts" src="Appendix A, B" />
      </>
    ),
    notes: { say: 'This is the part the EV table can\'t show. Three points: the non-engineer users are already there, PostHog is moving toward software that does the work, and Crew keeps the engineer in control, which fits their "nothing ships without you" approach.', qa: [['Is the retention benefit proven?', 'No. The packet has no churn data. We list it as possible upside and we would measure it in the pilot.']] },
  },
  /* 15 */
  {
    id: 'ask',
    body: ({ openDemo }) => (
      <div className="dk-center">
        <h2 className="dk-title big">Our ask: fund Crew's $2.0M build, and only launch if the pilot passes.</h2>
        <p className="dk-sub">We'd also run the small Budget Guard test alongside it.</p>
        <div className="dk-meta">Praneeth · Vinesh · Jasim</div>
        <button className="dk-cta" onClick={openDemo}>Open the live demo</button>
      </div>
    ),
    notes: { say: 'Say the ask once, then open it up for questions. Check that all three of us have spoken by now.', qa: [] },
  },
  /* 16 */
  {
    id: 'appendix',
    body: () => (
      <>
        <T>Backup: sources and assumptions.</T>
        <div className="dk-split2">
          <div className="dk-panel dk-tiny">
            <div className="dk-h">From the packet</div>
            <ul className="dk-list">
              <li>Table C1: costs, probabilities and ARR for all three features</li>
              <li>Table D1: 40,000 signed up, 24,800 sent a first event (62%), 9,920 had 2+ people looking in week 4 (40%), 2,480 hit a free limit, 992 added a card</li>
              <li>Table D3: 15,000 paying teams and $100M ARR; mid-size 3,750 ($40M), large 750 ($45M)</li>
              <li>Table D4: weekly users and experiments by role</li>
              <li>Table D5, Appendix E and Appendix A, as cited</li>
            </ul>
          </div>
          <div className="dk-panel dk-tiny">
            <div className="dk-h">What we assumed or calculated</div>
            <ul className="dk-list">
              <li>The 20% target for experiments created by PMs, support and marketing</li>
              <li>"Same day" launch and the 10% rollout, which are product choices</li>
              <li>Adoption scenarios of 10%, 20%, 30% and 44% of the 4,500 teams</li>
              <li>Pilot thresholds of 20% and $7,000, and a stop rule at 10% and $3,500</li>
              <li>Churn: 1 point on $85M is $0.85M. The packet has no churn data</li>
              <li>In the demo: 40,000 − 24,800 = 15,200 teams dropped off (Table D1)</li>
              <li>The names and the Northwind workspace in the demo are made up. All data is sample data.</li>
            </ul>
          </div>
        </div>
        <Foot step="Backup" src="Student prototype. Not a real PostHog product. Sample data." />
      </>
    ),
    notes: { say: 'Don\'t present this one. Keep it for when someone asks where a number came from.', qa: [] },
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
