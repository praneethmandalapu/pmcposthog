import React, { useEffect, useRef, useState } from 'react'

/* Every number on these slides is either from the case packet (cited by table / interview)
   or derived from packet numbers with the arithmetic shown. Anything we assumed is labelled. */

const T = ({ children }) => <h2 className="dk-title">{children}</h2>
const Foot = ({ step, src }) => (
  <div className="dk-foot"><span>{step}</span><span>{src}</span></div>
)
const Cite = ({ children }) => <span className="dk-cite">{children}</span>

const ROLES = [
  { r: 'Engineers', u: 48, e: 83 },
  { r: 'Founders', u: 14, e: 9 },
  { r: 'PMs and designers', u: 17, e: 6 },
  { r: 'Marketing, support, data', u: 21, e: 2 },
]

export const SLIDES = [
  /* 1 ---------------------------------------------------------------- */
  {
    id: 'title',
    body: ({ go }) => (
      <div className="dk-center">
        <h1 className="dk-hero">Crew<span className="ck"><svg viewBox="0 0 20 20"><path d="M5 10.5l3.2 3.2L15 6.8" /></svg></span></h1>
        <p className="dk-sub">A workspace for everyone on the team who doesn't write code.</p>
        <div className="dk-meta">PMC@UCSC × PostHog Product Case Competition · Fall 2026</div>
        <div className="dk-meta dim">Praneeth · Vinesh · Jasim</div>
      </div>
    ),
    notes: { say: 'Thirty seconds. Name the decision (one feature, $3.0M), say we recommend Crew, and promise two things: a demo and numbers we will challenge ourselves.', qa: [] },
  },
  /* 2 ---------------------------------------------------------------- */
  {
    id: 'decision',
    body: () => (
      <>
        <T>One budget, one feature. We recommend Crew.</T>
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
        <p className="dk-lead">Our ask: fund Crew's <b>$2.0M</b> build now, and release the <b>$0.8M</b> launch only if the pilot passes.</p>
        <Foot step="The decision" src="Tables B1, C1" />
      </>
    ),
    notes: { say: 'Read the ask. Leadership funds one feature and will not split the $3.0M. Our structure uses the pilot gate that is already in the case: the launch money is only spent if the pilot passes.', qa: [['Why not fund two?', 'The case says leadership funds one. We propose a cheap test of a second feature instead (slide 11).']] },
  },
  /* 3 ---------------------------------------------------------------- */
  {
    id: 'problem',
    body: () => (
      <>
        <T>PMs, support and marketing are 38% of weekly users and create 8% of experiments.</T>
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
            <p>Per weekly active person, an engineer creates about 8 times as many experiments as a PM, support or marketing teammate.</p>
            <p className="dk-calc">(83% ÷ 48%) ÷ (8% ÷ 38%) = 1.73 ÷ 0.21 ≈ 8.2</p>
            <p>Half of PostHog AI users are neither engineers nor founders. <Cite>Appendix A</Cite></p>
          </div>
        </div>
        <Foot step="Pick it · 20 pts" src="Table D4 (PMs and designers 17% + 6%, marketing, support and data 21% + 2%); Appendix A" />
      </>
    ),
    notes: {
      say: 'The 38% and the 8% are sums of two rows in Table D4: 17 + 21 = 38 for users, 6 + 2 = 8 for experiments. This is behaviour, not opinion. Founders are excluded from the 38%.',
      qa: [['Why not count founders as non-engineers?', 'Founders create 9% of experiments with 14% of users, close to parity, so they are not the gap. We exclude them on purpose.'], ['Where does 8x come from?', '83/48 = 1.73 experiments per share-point for engineers. 8/38 = 0.21 for the other roles. 1.73 / 0.21 = 8.2.']],
    },
  },
  /* 4 ---------------------------------------------------------------- */
  {
    id: 'did-said',
    body: () => (
      <>
        <T>What the PM did, and what the PM said.</T>
        <div className="dk-split2">
          <div className="dk-panel">
            <div className="dk-h">What they did</div>
            <ol className="dk-steps">
              <li>Asked PostHog AI and had a chart in a minute <Cite>E2.1</Cite></li>
              <li>Did nothing with it: three events sound like "signup" <Cite>E2.2</Cite></li>
              <li>Messaged an engineer. The answer came on Monday <Cite>E2.2</Cite></li>
              <li>Screenshots the chart into Slack to ask "is this right?" most weeks <Cite>E2.3</Cite></li>
              <li>Never ran an experiment. Files a ticket; about a week to get picked up <Cite>E2.4</Cite></li>
            </ol>
          </div>
          <div className="dk-panel">
            <div className="dk-h">What they said</div>
            <p className="dk-quote">"I think so? I'd be nervous about breaking something in production."</p>
            <Cite>E2.5, asked whether they would run experiments themselves</Cite>
            <div className="dk-twojobs">
              <div><b>Trust</b><span>Which event did the AI use?</span></div>
              <div><b>Safety</b><span>Can I launch without breaking production?</span></div>
            </div>
          </div>
        </div>
        <Foot step="Pick it · 20 pts" src="Interview E2: PM at a 150-person software company" />
      </>
    ),
    notes: { say: 'Separate behaviour from stated preference. What they did: wait, ask an engineer, file a ticket. What they said: they think they would do it themselves, but they are nervous. Crew has exactly two jobs: make the answer trustworthy and make the launch safe.', qa: [['Is one interview enough?', 'No. It explains the mechanism; Table D4 is the population evidence (38% of users, 8% of experiments).']] },
  },
  /* 5 ---------------------------------------------------------------- */
  {
    id: 'feature',
    body: ({ openDemo }) => (
      <>
        <T>Crew answers in plain English, shows its work, and launches safely.</T>
        <div className="dk-cards3">
          {[
            ['1', 'Ask', 'A question in plain English. The answer names the event it used, with an engineer\'s "verified" check, and lists the events it did not use.'],
            ['2', 'Launch', 'One click starts an experiment for 10% of users behind a feature flag. It stops automatically if errors rise.'],
            ['3', 'Inform', 'The engineer gets an FYI notification instead of a ticket. Results land in Crew when they are significant.'],
          ].map(([n, h, p]) => (
            <div className="dk-card" key={n}><div className="dk-num">{n}</div><div className="dk-card-h">{h}</div><p>{p}</p></div>
          ))}
        </div>
        <button className="dk-cta" onClick={openDemo}>Open the live demo</button>
        <Foot step="Show it · 20 pts" src="10% rollout is a product setting, not data" />
      </>
    ),
    notes: { say: 'Click "Open the live demo". In click-through mode, step to the Crew screen and click the launch button yourself. Under one minute. Then press the Slides button to come back.', qa: [['Is the 10% a statistic?', 'No. It is a safe default rollout setting in the prototype. All data in the demo is sample data.'], ['Who verifies the event?', 'An engineer. The demo shows "Verified by Vinesh (engineer)". The engineer stays in the loop, which fits PostHog\'s "Nothing ships without you".']] },
  },
  /* 6 ---------------------------------------------------------------- */
  {
    id: 'metric',
    body: () => (
      <>
        <T>One number shows the problem is getting solved.</T>
        <div className="dk-split">
          <div className="dk-panel dk-metric">
            <div className="dk-h">Experiments created by PMs, support and marketing</div>
            <div className="dk-flow"><span>8%</span><i>→</i><span className="t">20%</span></div>
            <div className="dk-note">Today (Table D4: 6% + 2%) → our target. The 20% is an assumption, not data.</div>
          </div>
          <div className="dk-panel dk-metric">
            <div className="dk-h">Time to launch an experiment</div>
            <div className="dk-flow"><span>≈1 week</span><i>→</i><span className="t">same day</span></div>
            <div className="dk-note">Today: "about a week to get picked up" (E2.4) → our target.</div>
          </div>
        </div>
        <p className="dk-lead">20% is about 40% of the way to parity with their 38% share of users: (20 − 8) ÷ (38 − 8) = 0.4.</p>
        <Foot step="Pick it · 20 pts" src="Table D4; E2.4" />
      </>
    ),
    notes: { say: 'The success metric is a share, so it cannot be gamed by sending more traffic. The 20% target is ours: roughly 40% of the way to parity. If a judge asks why 20, say it is a pilot gate we choose, not a forecast.', qa: [['Why not 38%?', 'Parity is not realistic because engineers will keep creating many experiments. 20% is a gate we can test in a pilot.']] },
  },
  /* 7 ---------------------------------------------------------------- */
  {
    id: 'finance',
    body: () => (
      <>
        <T>Start with Finance's numbers. On them, Crew ranks third.</T>
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
        <Foot step="Prove it · 30 pts" src="Table C1; a failed pilot is shelved, so it pays no launch cost and earns no payoff" />
      </>
    ),
    notes: { say: 'Say this first and plainly: on Finance\'s own table Crew is third. That honesty buys credibility for the next two slides, where we show which of Finance\'s assumptions we do not believe.', qa: [['Why do you start by showing Crew losing?', 'Because Table C1 holds claims from each proposer, not facts. The brief asks us to correct assumptions and show the value again. We do it for Crew first and then apply the same test to the other two.'], ['How is a failed pilot treated?', 'The feature is shelved: no launch cost, no payoff. Only the build is lost.']] },
  },
  /* 8 ---------------------------------------------------------------- */
  {
    id: 'challenge',
    body: () => (
      <>
        <T>We do not believe $14M = 2,000 teams × $7,000.</T>
        <div className="dk-cards3">
          <div className="dk-card">
            <div className="dk-card-h">Pricing is by usage, not seats</div>
            <p>Adding a person costs the team nothing, so more people in PostHog does not raise the bill by itself. The $7,000 has to come from added usage: AI credits, events, recordings.</p>
            <Cite>Table D4 note</Cite>
          </div>
          <div className="dk-card">
            <div className="dk-card-h">$7,000 only fits bigger teams</div>
            <div className="dk-mini"><span>Small $1,430</span><b>+490%</b></div>
            <div className="dk-mini"><span>Mid-size $10,670</span><b>+66%</b></div>
            <div className="dk-mini"><span>Large $60,000</span><b>+12%</b></div>
            <p className="dk-sm">+$7,000 as a share of average spend today.</p>
            <Cite>Table D3</Cite>
          </div>
          <div className="dk-card">
            <div className="dk-card-h">2,000 teams is a lot</div>
            <p>That is 13% of all 15,000 paying teams, and 44% of the 4,500 mid-size and large teams (3,750 + 750) that could plausibly add $7,000.</p>
            <Cite>Table D3</Cite>
          </div>
        </div>
        <p className="dk-lead">Mid-size and large teams are 30% of paying teams and 85% of ARR ($40M + $45M of $100M). That is our customer.</p>
        <Foot step="Prove it · 30 pts" src="Tables D3, D4; Table C1 note" />
      </>
    ),
    notes: { say: 'Three separate reasons. The strongest is the pricing note: seats are free, so Crew only earns money if it creates usage. That is the assumption a technical judge will probe, so we raise it ourselves.', qa: [['Then how does Crew make money?', 'Through usage that PMs, support and marketing create: AI credits from their questions, events and flag usage from the experiments they launch. That is exactly what the pilot measures.'], ['Why are small teams excluded?', 'Average small-team spend is $1,430; adding $7,000 would be a 490% increase.']] },
  },
  /* 9 ---------------------------------------------------------------- */
  {
    id: 'corrected',
    body: () => (
      <>
        <T>Corrected, Crew's value is about break-even. That is the honest number.</T>
        <table className="dk-table small">
          <thead><tr><th>Adopting share of 4,500 mid-size + large teams</th><th>Teams</th><th>Hit ARR (× $7,000)</th><th>Expected value</th></tr></thead>
          <tbody>
            <tr><td>10%</td><td>450</td><td>$3.15M</td><td className="neg">−$0.94M</td></tr>
            <tr className="on"><td>20% (our pilot gate)</td><td>900</td><td>$6.30M</td><td>≈ $0.0M</td></tr>
            <tr><td>30%</td><td>1,350</td><td>$9.45M</td><td>+$0.96M</td></tr>
            <tr><td>44% (Finance's 2,000)</td><td>2,000</td><td>$14.0M</td><td>+$2.32M</td></tr>
          </tbody>
        </table>
        <div className="dk-math">
          Crew EV = 0.6 × [ 0.5 × H + 0.5 × 2 − 0.8 ] − 2.0 · break-even H = <b>$6.27M</b> = about 895 teams = <b>19.9%</b> of 4,500.<br />
          Not in Finance's table: each point of yearly churn avoided on the $85M of mid-size and large ARR is worth $0.85M (1% × $85M). Churn data is not in the packet, so we treat it as upside to test, not as value we claim.
        </div>
        <Foot step="Prove it · 30 pts" src="Table C1, D3. 7,000 per team is Finance's own figure; adoption shares are our scenarios" />
      </>
    ),
    notes: { say: 'Before: $2.32M. After correcting adoption to the teams that can afford it: about break-even at 20%. We do not hide that. The pilot exists to find out whether 20% adoption and $7,000 are real.', qa: [['So why fund it?', 'Because the downside is capped by the pilot gate (a 40% chance of losing the $2.0M build, nothing more), the upside is the highest ceiling of the three ($14M vs $6M and $30M claimed), and the strategic case on slide 14 is not in the EV.'], ['Does Crew beat Budget Guard on EV?', 'No, not on Finance\'s numbers. To beat $3.02M, Crew would need a hit payoff of about $16.3M. We say so.']] },
  },
  /* 10 ---------------------------------------------------------------- */
  {
    id: 'preflight',
    body: () => (
      <>
        <T>The same test on Preflight: its payoff needs more teams than exist.</T>
        <div className="dk-cards3">
          <div className="dk-card">
            <div className="dk-card-h">3,000 teams, but 2,250 have it</div>
            <p>Finance assumes 3,000 teams use Preflight. Only 2,250 paying teams have self-driving turned on today (900 small, 1,125 mid-size, 225 large).</p>
            <Cite>Table C1 note, D5</Cite>
          </div>
          <div className="dk-card">
            <div className="dk-card-h">$10,000 more per team</div>
            <p>Small teams spend $1,430 a year on average. Mid-size and large teams with self-driving: 1,125 + 225 = 1,350. At $10,000 and 100% adoption that is $13.5M, not $30M.</p>
            <Cite>Table D3, D5</Cite>
          </div>
          <div className="dk-card">
            <div className="dk-card-h">Value after correcting</div>
            <p>0.35 × [ 0.6 × 13.5 − 0.6 ] − 2.4 = <b>$0.23M</b> at 100% adoption, and negative below about 92% of that.</p>
            <p className="dk-sm">Engineers say they would not trust a prediction (E1.5) and review 5 of 14 agent pull requests a week (D5).</p>
          </div>
        </div>
        <p className="dk-lead">PostHog gives up a breakthrough bet that has a 65% chance of failing its pilot.</p>
        <Foot step="Prove it · Backup" src="Tables C1, D3, D5; E1.5" />
      </>
    ),
    notes: { say: 'Use if asked "what does PostHog give up". Preflight: 0.35 pilot pass, $2.4M build, and a payoff that assumes more teams than have self-driving turned on.', qa: [['Where does "below about 92%" come from?', 'EV = 0.35 × (0.6 × H − 0.6) − 2.4 = 0 when H = $12.4M, which is 92% of $13.5M (100% adoption).']] },
  },
  /* 11 ---------------------------------------------------------------- */
  {
    id: 'budget',
    body: () => (
      <>
        <T>Budget Guard is the strongest rival. We say so, and we would test it.</T>
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
            <div className="dk-h">Where Budget Guard is limited</div>
            <ul className="dk-list">
              <li>Only 41% of non-paying teams at a limit cite fear of an unpredictable bill (127 of 310) <Cite>D2</Cite></li>
              <li>27% did not need more, 14% needed approval, 10% moved to another tool <Cite>D2</Cite></li>
              <li>Its best case is $6M. Capped paying teams could also spend less <Cite>B1, C1</Cite></li>
            </ul>
          </div>
          <div className="dk-panel">
            <div className="dk-h">Our proposed test (allowed by the brief)</div>
            <p>Show the projected monthly cost on the free-limit screen for a sample of teams at a limit. Compare add-a-card rates with today's 40% (992 of 2,480). <Cite>D1</Cite></p>
            <p className="dk-sm">Expected spend = build + P(pass) × launch. Concede: Budget Guard wins on EV per dollar.</p>
          </div>
        </div>
        <Foot step="Prove it · 30 pts" src="Tables C1, D1, D2; expected spend and ratios are our arithmetic" />
      </>
    ),
    notes: { say: 'Do not dodge. Budget Guard is the best risk-adjusted bet in Finance\'s table. Our case for Crew rests on ceiling, new users and strategy, not on beating it on EV per dollar.', qa: [['Why not Budget Guard?', 'Ceiling of $6M and it serves only the 41% who fear the bill. Crew\'s claimed ceiling is $14M and it opens a new user group. We also keep Budget Guard alive with a cheap test.'], ['What is "EV per $1 spent"?', 'EV divided by expected spend: build plus the pilot-pass probability times the launch cost. Preflight 2.4 + 0.35 × 0.6 = 2.61; Crew 2.0 + 0.6 × 0.8 = 2.48; Budget Guard 0.9 + 0.9 × 0.3 = 1.17.']] },
  },
  /* 12 ---------------------------------------------------------------- */
  {
    id: 'test',
    body: () => (
      <>
        <T>The assumption most likely to be false, and the cheapest test.</T>
        <div className="dk-split2">
          <div className="dk-panel">
            <div className="dk-h">Most likely false</div>
            <p className="dk-big sm">20% of mid-size and large teams adopt Crew and each spends $7,000 more.</p>
            <p>Seats are free, so the money only comes from usage that PMs, support and marketing create.</p>
          </div>
          <div className="dk-panel">
            <div className="dk-h">Cheapest test (our proposal)</div>
            <ul className="dk-list">
              <li>8-week pilot with a small group of mid-size and large teams</li>
              <li>Pass if experiments created by PMs, support and marketing reach <b>20%</b> (from 8%)</li>
              <li>and annualised usage rises by <b>$7,000</b> or more per adopting team</li>
              <li>Fail on either: shelve Crew, lose only the build</li>
            </ul>
          </div>
        </div>
        <Foot step="Prove it · 30 pts" src="Pilot size and thresholds are our assumptions" />
      </>
    ),
    notes: { say: 'This answers the judges\' question five directly. The thresholds come from the break-even math: $7,000 at 20% adoption is where EV crosses zero.', qa: [['Can a pilot really measure usage uplift in 8 weeks?', 'It measures a run-rate. We annualise it and say so. If the signal is ambiguous we extend, we do not launch.']] },
  },
  /* 13 ---------------------------------------------------------------- */
  {
    id: 'mind',
    body: () => (
      <>
        <T>What would change our mind.</T>
        <div className="dk-cards3">
          <div className="dk-card"><div className="dk-card-h">Exposure</div><p>If the pilot fails (a 40% chance), we lose the $2.0M build and nothing else. The $0.8M launch is never spent.</p></div>
          <div className="dk-card"><div className="dk-card-h">Stop rule</div><p>Adoption below 10% of eligible teams, or uplift under $3,500 per team, and we shelve Crew. At 10% adoption the EV is −$0.94M.</p></div>
          <div className="dk-card"><div className="dk-card-h">Then fund</div><p>Budget Guard: $0.9M to build and $0.3M to launch, with a 0.9 pilot pass chance. We would already have its fake-door test results.</p></div>
        </div>
        <Foot step="Pitch it · 30 pts" src="Table C1; thresholds are our assumptions" />
      </>
    ),
    notes: { say: 'Judges reward a team that says what would change its mind. We commit to a stop rule before we spend money.', qa: [['Where does $3,500 come from?', 'Half of $7,000. At 20% adoption, half the uplift gives a hit payoff of $3.15M, which is negative EV (−$0.94M). It is our stop rule, an assumption.']] },
  },
  /* 14 ---------------------------------------------------------------- */
  {
    id: 'future',
    body: () => (
      <>
        <T>PostHog won the engineers. Crew wins everyone they work with.</T>
        <div className="dk-split2">
          <div className="dk-panel">
            <div className="dk-h">Why this is PostHog's future</div>
            <ul className="dk-list">
              <li>PostHog AI is the default experience for new users, and half of them are not engineers or founders <Cite>Appendix A</Cite></li>
              <li>PostHog is moving from read-only analytics to software that does the work <Cite>Appendix A</Cite></li>
              <li>Amplitude and Mixpanel already build for PMs <Cite>Appendix A, B1</Cite></li>
            </ul>
          </div>
          <div className="dk-panel">
            <div className="dk-h">What Crew adds</div>
            <ul className="dk-list">
              <li>A way in for the roles that already use PostHog and were never designed for</li>
              <li>The engineer stays in control: verified events, flags, auto-stop, an FYI instead of a ticket</li>
              <li>A team with more of its people in PostHog is harder to leave (the head of growth's claim; we would measure churn in the pilot)</li>
            </ul>
          </div>
        </div>
        <Foot step="Pitch it · 30 pts" src="Appendix A, B" />
      </>
    ),
    notes: { say: 'This is the strategy slide the EV table cannot show. Keep it to three beats: the users are already here, PostHog is turning into something that acts, and Crew keeps the engineer in control so it fits "Nothing ships without you".', qa: [['Is the churn benefit proven?', 'No. The packet has no churn data. We list it as upside and put it in the pilot.']] },
  },
  /* 15 ---------------------------------------------------------------- */
  {
    id: 'ask',
    body: ({ openDemo }) => (
      <div className="dk-center">
        <h2 className="dk-title big">Fund Crew's $2.0M build. Gate the launch on a pilot.</h2>
        <p className="dk-sub">Keep Budget Guard's cheap test running alongside.</p>
        <div className="dk-meta">Praneeth · Vinesh · Jasim</div>
        <button className="dk-cta" onClick={openDemo}>Open the live demo</button>
      </div>
    ),
    notes: { say: 'Close with the ask in one sentence, then take questions. Every member should have spoken by now.', qa: [] },
  },
  /* 16 ---------------------------------------------------------------- */
  {
    id: 'appendix',
    body: () => (
      <>
        <T>Backup: sources, arithmetic and what we assumed.</T>
        <div className="dk-split2">
          <div className="dk-panel dk-tiny">
            <div className="dk-h">From the packet</div>
            <ul className="dk-list">
              <li>Table C1: costs, probabilities, ARR for all three features</li>
              <li>Table D1: 40,000 signed up, 24,800 sent a first event (62%), 9,920 had 2+ people looking in week 4 (40%), 2,480 hit a free limit, 992 added a card</li>
              <li>Table D3: 15,000 paying teams, $100M ARR; mid-size 3,750 ($40M), large 750 ($45M)</li>
              <li>Table D4: weekly users and experiments by role</li>
              <li>Table D5, Appendix E, Appendix A as cited</li>
            </ul>
          </div>
          <div className="dk-panel dk-tiny">
            <div className="dk-h">Our assumptions and arithmetic</div>
            <ul className="dk-list">
              <li>20% target for experiments by PMs, support and marketing</li>
              <li>"Same day" launch, and the 10% rollout default: product choices</li>
              <li>Adoption scenarios 10, 20, 30, 44% of 4,500 teams</li>
              <li>Pilot thresholds: 20% and $7,000; stop rule $3,500 and 10%</li>
              <li>Churn: 1 point on $85M = $0.85M; no churn data in the packet</li>
              <li>Demo funnel: 40,000 − 24,800 = 15,200 teams dropped off (Table D1)</li>
              <li>Names and the Northwind workspace are fictional. All data is sample data.</li>
            </ul>
          </div>
        </div>
        <Foot step="Backup" src="Student prototype. Not a real PostHog product. Sample data." />
      </>
    ),
    notes: { say: 'Do not present this. Keep it for questions about where a number came from.', qa: [] },
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
