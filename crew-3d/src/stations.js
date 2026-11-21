export const U = 0.01 // world units per CSS px
export const DF = 4 // drei distanceFactor => 4/400 = 0.01 units per px
export const FOV = 38

// c: centre, ry: yaw, w/h: framed content size in px
export const ST = [
  { id: 'hero',    c: [0, 0, 0],      ry: 0,     w: 1400, h: 740, look: -0.2 },
  { id: 'moment',  c: [12, 1.5, -14], ry: -0.4,  w: 1020, h: 700, look: 0.0 },
  { id: 'feature', c: [-10, -0.5, -30], ry: 0.36, w: 1080, h: 680, look: 0.0 },
  { id: 'result',  c: [11, 1, -46],   ry: -0.34, w: 940,  h: 640, look: 0.0 },
  { id: 'proof',   c: [0, 2, -62],    ry: 0,     w: 1020, h: 700, look: 0.0 },
  { id: 'close',   c: [0, 0, -30],    ry: 0,     w: 0,    h: 0 },
]

export const LABELS = ['', '01 The moment', '02 The feature', '03 The result', '04 The proof', '']
export const CAPTIONS = [
  '',
  "Praneeth gets a chart in a minute, but can't trust it. Testing an idea means a ticket and a week of waiting.",
  'Plain-English answers that show their work, verified by an engineer.',
  'Safe enough that a PM can ship an experiment without fear of breaking production.',
  'A week of waiting becomes same day. PMs, support and marketing are 38% of weekly users but create 8% of experiments.',
  '',
]
export const DWELL = [4, 7, 10.5, 7, 7, 6]
export const TRANSIT = 1.7
