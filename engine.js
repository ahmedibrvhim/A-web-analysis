/* ══════════════════════════════════════════════════════════════════
   engine.js — reference-based facial PROPORTION analysis (MediaPipe landmarks in).
   Stages (each exported, each inspectable on its own):
     validateLandmarks → getCorrectedLandmarks → estimateStomion → calculateMeasurements
     → calculateMeasurementConfidence → calculateReferenceDeviations → calculateFeatureScores
     → calculateOverallScore → generateReport        (detectFace lives in tool.html: it needs MediaPipe)

   STATUS OF THE NUMBERS — READ THIS
   • Nothing here is calibrated against a human-rated dataset. The output is a
     "Proportion / Harmony" index (similarity to a configurable reference), NOT a
     validated attractiveness prediction.
   • Every number in CONFIG / REFERENCE_PROFILES carries a `kind`:
       'definition' – mathematically defined (e.g. 1/3), 'ui' – presentation only,
       'heuristic'  – engineering judgement, no empirical backing,
       'placeholder'– stand-in for a value that SHOULD come from a measured dataset.
   • To calibrate later: replace REFERENCE_PROFILES entries (center/scale from your data),
     fit CONFIG.weights against ratings, nothing else in the pipeline needs to change.
══════════════════════════════════════════════════════════════════ */

export const CONFIG = {
  // pose: penalty = exp(-((|deg|-soft)/falloff)^2) beyond `soft`; hard reject beyond `reject`.   [heuristic]
  pose:   { yawReject: 20, pitchReject: 20, soft: 8, falloff: 12 },
  // expression: blendshape score → confidence factor, linear from 1 (≤free) to floor (≥full).   [heuristic]
  expr:   { smile: { free: .10, full: .60, floor: .35 }, jaw: { free: .05, full: .30, floor: .30 },
            brow:  { free: .15, full: .60, floor: .60 }, squint: { free: .20, full: .70, floor: .60 }, unknown: .80 },
  // image quality thresholds (ok → factor 1, bad → floor 0.4)                                    [heuristic]
  quality:{ facePx: { bad: 120, ok: 220 }, blur: { bad: 15, ok: 60 }, lightAsym: { ok: .15, bad: .45 },
            clip: { ok: .02, bad: .15 }, edgeMargin: .01, floor: .4 },
  // prior reliability of AUTO landmark placement (N/Sn/Ls/Li/Me). Not empirical.                  [heuristic]
  autoConf: { N: .70, Sn: .85, Ls: .65, Li: .80, Me: .85 },
  correctedConf: .85,            // a human-placed point: trusted, but not perfect                  [heuristic]
  moveTolFh: .003,               // a point moved more than this × face-height counts as CORRECTED   [ui]
  hair: { scanBase: .80, proxyAboveMesh10: .14, proxyConf: .25,        // proxy = mesh pt 10 − k·faceH; k is a heuristic
          contrast: { bad: .12, ok: .50 }, spread: { ok: .06, bad: .15 },
          shareReject: [.12, .55], sharePlausible: [.18, .45] },        // upper-third share sanity window [heuristic]
  stomion: { fracMin: .30, fracMax: .65, closedOpen: .03, openFalloff: .06, base: .75 },
  scoring: { tolSd: .5, neutral: .5 },   // plateau half-width in reference SDs; prior used when confidence is missing [heuristic]
  // feature weights (relative). Thirds family is deliberately split so hairline can't dominate.   [heuristic]
  weights: { thirdUp: .05, thirdMid: .05, thirdLow: .06, midLowBalance: .08, lowerSplit: .14, fwhr: .10,
             jawWidth: .08, eyeSpacing: .08, noseWidth: .08, mouthNose: .08, symmetry: .06 },
  uncertainty: { unknownSd: .29, floorIndex: 3, corrPerFh: 50 },  // sd of U(0,1)=.29 · ±3 pts floor (uncalibrated) · pts per Σ correction/fh
  confLabels: { high: .70, moderate: .45 },
  tierCuts: [40, 50, 62, 74, 85],        // index → tier label bands; labels are UI only                  [ui]
  pairAsymMax: .35, noiseIpdFrac: .003
};

const k = (kind, note) => ({ kind, note });
/* Reference profiles: { center, scale (robust ≈ SD), oneSided?, sexSpecific, kind }.
   Shared-by-default: a sex-specific value is used only where dimorphism is reported in the literature
   (fWHR, jaw/face width); even then the difference is a PLACEHOLDER of ~0.4 SD so distributions overlap. */
const E = (c, s, o = {}) => ({ center: c, scale: s, sexSpecific: false, kind: 'placeholder', ...o });
const shared = {
  thirdUp: E(33.3, 3.0, { kind: 'definition', note: '1/3 canon used as centre only; scale is a placeholder' }),
  thirdMid: E(33.3, 2.5, { kind: 'definition' }), thirdLow: E(33.3, 2.5, { kind: 'definition' }),
  midLowBalance: E(.50, .035, { note: 'mid/(mid+low): Tr-independent' }),
  lowerSplit: E(1 / 3, .035, { kind: 'definition', note: '1:2 canon (Sn–Stm : Stm–Me)' }),
  eyeSpacing: E(.46, .025), noseWidth: E(1.05, .12), mouthNose: E(1.5, .17),
  symmetry: E(.03, .02, { oneSided: true, note: 'penalise asymmetry only; perfect symmetry earns no bonus' })
};
export const REFERENCE_PROFILES = {
  meta: { validated: false, label: 'reference-based facial proportion analysis' },
  male:   { ...shared, fwhr: E(1.95, .17, { sexSpecific: true }), jawWidth: E(.79, .05, { sexSpecific: true }) },
  female: { ...shared, fwhr: E(1.88, .17, { sexSpecific: true }), jawWidth: E(.75, .05, { sexSpecific: true }) }
};

/* ── helpers ── */
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const median = a => { const s = [...a].sort((x, y) => x - y), n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : NaN; };
const gmean = a => Math.exp(a.reduce((s, x) => s + Math.log(Math.max(1e-3, x)), 0) / a.length);
const ramp = (x, bad, ok, floor = 0) => floor + (1 - floor) * clamp((x - bad) / (ok - bad), 0, 1);   // bad→floor, ok→1
const poseF = deg => { const e = Math.max(0, Math.abs(deg) - CONFIG.pose.soft); return Math.exp(-((e / CONFIG.pose.falloff) ** 2)); };

/* ── POSE (MediaPipe 4×4 column-major facial transform) ── */
export function poseFromMatrix(m) {
  if (!m) return null;
  const D = 180 / Math.PI;
  return { yaw: Math.asin(clamp(-m[2], -1, 1)) * D, pitch: Math.atan2(m[6], m[10]) * D, roll: Math.atan2(m[1], m[0]) * D };
}

/* ── EXPRESSION (MediaPipe blendshapes) ── */
export function expressionFromBlendshapes(cats) {
  const X = CONFIG.expr, u = X.unknown;
  if (!cats || !cats.length) return { known: false, raw: {}, factors: { mouth: u, lower: u, brow: u, eyes: u } };
  const b = {}; cats.forEach(c => b[c.categoryName] = c.score);
  const g = n => b[n] || 0, p = (x, c) => 1 - clamp((x - c.free) / (c.full - c.free), 0, 1) * (1 - c.floor);
  const raw = { smile: Math.max(g('mouthSmileLeft'), g('mouthSmileRight')), jawOpen: g('jawOpen'),
    browRaise: Math.max(g('browInnerUp'), g('browOuterUpLeft'), g('browOuterUpRight')), squint: Math.max(g('eyeSquintLeft'), g('eyeSquintRight')) };
  const sm = p(raw.smile, X.smile), jw = p(raw.jawOpen, X.jaw);
  return { known: true, raw, factors: { mouth: sm * jw, lower: jw * Math.sqrt(sm), brow: p(raw.browRaise, X.brow), eyes: p(raw.squint, X.squint) * Math.sqrt(sm) } };
}

/* ── IMAGE QUALITY (luma = Float32Array of the face region resampled to a fixed width) ── */
export function assessQuality({ luma, w, h, facePx, meshNearEdge }) {
  const Q = CONFIG.quality, warn = [];
  let lap = 0, n = 0, clip = 0, L = 0, R = 0, nl = 0, nr = 0;
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) {
    const i = y * w + x, v = 4 * luma[i] - luma[i - 1] - luma[i + 1] - luma[i - w] - luma[i + w];
    lap += v * v; n++;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const v = luma[y * w + x]; if (v < 12 || v > 243) clip++;
    if (x < w / 2) { L += v; nl++; } else { R += v; nr++; }
  }
  const blurVar = n ? lap / n / 16 : 0, lm = L / nl, rm = R / nr, asym = Math.abs(lm - rm) / Math.max(1, (lm + rm) / 2), clipFrac = clip / (w * h);
  const f = { size: ramp(facePx, Q.facePx.bad, Q.facePx.ok, Q.floor), blur: ramp(blurVar, Q.blur.bad, Q.blur.ok, Q.floor),
    light: ramp(-asym, -Q.lightAsym.bad, -Q.lightAsym.ok, Q.floor) * ramp(-clipFrac, -Q.clip.bad, -Q.clip.ok, Q.floor),
    crop: meshNearEdge ? Q.floor : 1 };
  if (f.size < 1) warn.push('face is small / low resolution'); if (f.blur < 1) warn.push('image looks blurry');
  if (f.light < 1) warn.push('uneven or clipped lighting / strong shadow'); if (f.crop < 1) warn.push('face touches the image edge');
  return { score: gmean(Object.values(f)), factors: f, metrics: { blurVar, lightAsym: asym, clipFrac, facePx }, warnings: warn };
}

/* ── GEOMETRY ── */
export function faceGeometry(mesh) {
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (let i = 0; i < 468; i++) { const p = mesh[i]; x0 = Math.min(x0, p.x); x1 = Math.max(x1, p.x); y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); }
  const ipd = mesh.length > 473 ? dist(mesh[468], mesh[473]) : dist(mesh[33], mesh[263]);
  // midline: least-squares x = a + b·y through midline mesh points (tolerates roll/yaw lean)
  const M = [10, 9, 168, 6, 197, 195, 5, 4, 1, 2, 0, 17, 152].map(i => mesh[i]);
  const my = M.reduce((s, p) => s + p.y, 0) / M.length, mx = M.reduce((s, p) => s + p.x, 0) / M.length;
  let sxy = 0, syy = 0; M.forEach(p => { sxy += (p.x - mx) * (p.y - my); syy += (p.y - my) ** 2; });
  const b = syy ? sxy / syy : 0, a = mx - b * my;
  return { fw: x1 - x0, fh: y1 - y0, ipd, bz: dist(mesh[234], mesh[454]), midX: y => a + b * y, midSlope: b };
}

/* ── LANDMARK VALIDATION (mesh-level sanity, per region) ── */
export function validateLandmarks(mesh, W, H) {
  const G = faceGeometry(mesh), flags = [], fac = { eyes: 1, nose: 1, mouth: 1, chin: 1, cheeks: 1 };
  const bad = (g, msg) => { fac[g] *= .4; flags.push(msg); };
  if (mesh.some(p => !isFinite(p.x) || !isFinite(p.y) || p.x < -.02 * W || p.x > 1.02 * W || p.y < -.02 * H || p.y > 1.02 * H)) { Object.keys(fac).forEach(g => fac[g] *= .5); flags.push('landmark outside image'); }
  const off = i => Math.abs(mesh[i].x - G.midX(mesh[i].y)) / G.ipd;
  if (!(mesh[0].y < mesh[13].y && mesh[13].y <= mesh[14].y + 1 && mesh[14].y < mesh[17].y)) bad('mouth', 'mouth landmarks out of order');
  if (Math.max(off(0), off(13), off(14), off(17)) > .15) bad('mouth', 'mouth off the facial midline');
  if (Math.max(off(2), off(1)) > .12) bad('nose', 'nose off the facial midline');
  if (off(152) > .20) bad('chin', 'chin off the facial midline');
  if (Math.abs(mesh[33].y - mesh[263].y) / G.ipd > .12) bad('eyes', 'eye line tilted / unequal');
  const r = G.bz / G.ipd; if (r < 1.5 || r > 2.8) bad('cheeks', 'implausible face width / IPD ratio');
  const dl = G.midX(mesh[234].y) - mesh[234].x, dr = mesh[454].x - G.midX(mesh[454].y);
  if (Math.abs(dl - dr) / (dl + dr) > .30) bad('cheeks', 'face-width landmarks strongly asymmetric');
  return { geometry: G, factors: fac, flags, ok: Math.min(...Object.values(fac)) > .3 };
}

/* ── AUTO POINTS from mesh (also used by the consistency test) ── */
export function autoPointsFromMesh(mesh, trY) {
  const G = faceGeometry(mesh), mix = (a, b, t) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
  return { Tr: { x: mesh[10].x, y: trY ?? mesh[10].y - CONFIG.hair.proxyAboveMesh10 * G.fh },
           N: mix(mesh[9], mesh[168], .5), Sn: { ...mesh[2] }, Ls: { x: mesh[0].x, y: mesh[0].y - .012 * G.fh },
           Li: { ...mesh[17] }, Me: { ...mesh[152] } };
}

/* ── HAIRLINE: turn a raw brightness scan into {y, source, confidence, flags} ── */
export function resolveHairline(scan, p10y, nY, meY, fh) {
  const H = CONFIG.hair, flags = [], proxy = (why) => ({ y: p10y - H.proxyAboveMesh10 * fh, source: 'proxy', confidence: H.proxyConf, flags: [...flags, why] });
  if (!scan) return proxy('scan failed (dark/low-contrast skin, hair or hat)');
  const share = (nY - scan.y) / (meY - scan.y);
  if (share < H.shareReject[0] || share > H.shareReject[1]) return proxy('scan rejected: upper third implausible (' + (share * 100).toFixed(0) + '%)');
  let c = H.scanBase * ramp(scan.contrast, H.contrast.bad, H.contrast.ok, .15) * ramp(-scan.spread, -H.spread.bad, -H.spread.ok, .3);
  if (scan.contrast < H.contrast.bad * 1.5) flags.push('weak skin/hair contrast (light/blond hair or dark skin?)');
  if (scan.spread > H.spread.ok) flags.push('hairline differs across columns (recession / widow\'s peak / texture)');
  if (share < H.sharePlausible[0] || share > H.sharePlausible[1]) { c *= .5; flags.push('upper third unusual – verify Tr'); }
  return { y: scan.y, source: 'scan', confidence: c, flags };
}

/* ── LANDMARK CORRECTION: user points are authoritative; status + confidence per point ── */
export function getCorrectedLandmarks(points, autoPoints, ctx) {
  const { validation: V, hair, expr } = ctx, G = V.geometry, out = {}, flags = [];
  const grp = { N: 'nose', Sn: 'nose', Ls: 'mouth', Li: 'mouth', Me: 'chin' };
  let corrSum = 0;
  for (const id of ['Tr', 'N', 'Sn', 'Ls', 'Li', 'Me']) {
    const p = points[id], a = autoPoints[id], moved = dist(p, a) / G.fh;
    const corrected = moved > CONFIG.moveTolFh; if (corrected) corrSum += moved;
    let source = corrected ? 'corrected' : (id === 'Tr' && hair.source === 'proxy' ? 'estimated' : 'auto');
    let c = corrected ? CONFIG.correctedConf : id === 'Tr' ? hair.confidence : CONFIG.autoConf[id];
    const f = [];
    if (id === 'Tr' && !corrected) f.push(...hair.flags);
    if (!corrected && grp[id]) c *= V.factors[grp[id]];
    if (Math.abs(p.x - G.midX(p.y)) / G.ipd > .15) { c *= .6; f.push('off midline'); }
    if ((id === 'Ls' || id === 'Li') && !corrected) c *= expr.factors.mouth ** .5;
    out[id] = { x: p.x, y: p.y, source, confidence: clamp(c, 0, 1), flags: f, movedFh: moved, low: c < .45 };
    flags.push(...f.map(m => id + ': ' + m));
  }
  const order = ['Tr', 'N', 'Sn', 'Ls', 'Li', 'Me'], ordered = order.every((id, i) => !i || out[id].y > out[order[i - 1]].y);
  return { points: out, ordered, flags, corrSumFh: corrSum };
}

/* ── STOMION: the mesh has no stomion. Use this face's own lip geometry to place it between the
      (possibly corrected) Ls and Li, and say how little we trust it when the mouth is open/smiling. ── */
export function estimateStomion(lm, mesh, G, expr) {
  const S = CONFIG.stomion, f0 = (((mesh[13].y + mesh[14].y) / 2) - mesh[0].y) / (mesh[17].y - mesh[0].y);
  const f = clamp(f0, S.fracMin, S.fracMax), open = Math.abs(mesh[14].y - mesh[13].y) / G.ipd;
  let c = S.base * Math.exp(-Math.max(0, open - S.closedOpen) / S.openFalloff) * expr.factors.mouth;
  if (f !== f0) c *= .8;
  c *= Math.min(1, (lm.Ls.confidence + lm.Li.confidence) / 1.4);
  return { value: lm.Ls.y + f * (lm.Li.y - lm.Ls.y), x: (lm.Ls.x + lm.Li.x) / 2, fraction: f, mouthOpenIpd: open, confidence: clamp(c, 0, 1), source: 'estimated' };
}

/* ── MEASUREMENTS (dimensionless; no raw pixels leak out) ── */
const PAIRS = [[33, 263], [133, 362], [105, 334], [129, 358], [61, 291], [234, 454], [172, 397]];
export function calculateMeasurements(lm, mesh, G, stm) {
  const y = id => lm[id].y, tot = y('Me') - y('Tr'), pct = v => v / tot * 100;
  const up = y('N') - y('Tr'), mid = y('Sn') - y('N'), low = y('Me') - y('Sn');
  // symmetry: per pair, deviation of (left-right)/(left+right) and vertical offset from the median
  // (the median removes yaw/roll bias), both relative to the pair's own half-width → same units.
  const S = [], V = [], hw = [];
  PAIRS.forEach(([i, j]) => {
    const [A, B] = mesh[i].x < mesh[j].x ? [mesh[i], mesh[j]] : [mesh[j], mesh[i]];
    const dl = G.midX(A.y) - A.x, dr = B.x - G.midX(B.y), w = (dl + dr) / 2;
    S.push((dl - dr) / (dl + dr)); V.push((A.y - B.y) / w); hw.push(w);
  });
  const sM = median(S), vM = median(V);
  const per = S.map((s, i) => Math.hypot(s - sM, V[i] - vM)), kept = per.filter(v => v <= CONFIG.pairAsymMax);
  const eyeW = (a, b) => dist(mesh[a], mesh[b]);
  const aspect = (u, d, a, b) => dist(mesh[u], mesh[d]) / eyeW(a, b);
  const tilt = (o, i) => Math.atan2(mesh[i].y - mesh[o].y, Math.abs(mesh[i].x - mesh[o].x)) * 180 / Math.PI;
  const jaw = dist(mesh[172], mesh[397]), ang = (() => { const a = Math.atan2(mesh[172].y - mesh[152].y, mesh[172].x - mesh[152].x), b = Math.atan2(mesh[397].y - mesh[152].y, mesh[397].x - mesh[152].x); return Math.abs(a - b) * 180 / Math.PI; })();
  return {
    facialThirds: { upper: pct(up), middle: pct(mid), lower: pct(low), midLowBalance: mid / (mid + low) },
    lowerThird: { upperLip: stm.value - y('Sn'), lowerLip: y('Me') - stm.value, split: (stm.value - y('Sn')) / low,
                  philtrumShare: pct(y('Ls') - y('Sn')), lipsShare: pct(y('Li') - y('Ls')), chinShare: pct(y('Me') - y('Li')) },
    facialWidthHeight: { fwhr: G.bz / (y('Ls') - y('N')), fullRatio: G.bz / tot },
    jaw: { width: jaw / G.bz, chinTaperAngleDeg: ang, note: 'frontal proxy: gonial angle needs a lateral view' },
    symmetry: { value: kept.length ? median(kept) : NaN, pairsUsed: kept.length, pairsTotal: per.length, perPair: per },
    eyes: { spacing: G.ipd / G.bz, openness: (aspect(159, 145, 33, 133) + aspect(386, 374, 263, 362)) / 2, canthalTiltDeg: (tilt(33, 133) + tilt(263, 362)) / 2 },
    nose: { alarToIntercanthal: dist(mesh[129], mesh[358]) / dist(mesh[133], mesh[362]), alarToIpd: dist(mesh[129], mesh[358]) / G.ipd },
    mouth: { widthToIpd: dist(mesh[61], mesh[291]) / G.ipd, toNose: dist(mesh[61], mesh[291]) / dist(mesh[129], mesh[358]) },
    _raw: { tot, up, mid, low }
  };
}

/* ── CONFIDENCE per feature: geometric mean of the landmarks involved × pose × expression × quality ── */
export function calculateMeasurementConfidence(lm, stm, ctx) {
  const { pose, expr, quality: Q, validation: V } = ctx, c = id => lm[id].confidence, F = expr.factors;
  const pv = poseF(pose.pitch) * poseF(pose.yaw) ** .5, ph = poseF(pose.yaw) * poseF(pose.pitch) ** .5, q = Q.score;
  const tr = Math.sqrt(c('Tr')), cheek = V.factors.cheeks, m = (ids, ...fs) => clamp(gmean(ids.map(c)) * fs.reduce((a, b) => a * b, 1) * q, 0, 1);
  const sym = clamp(poseF(pose.yaw) ** 2 * q * V.factors.cheeks * V.factors.eyes, 0, 1);
  return {
    thirdUp: m(['Tr', 'N'], pv, F.brow), thirdMid: m(['N', 'Sn'], pv, F.brow) * tr, thirdLow: m(['Sn', 'Me'], pv, F.lower) * tr * Math.sqrt(stm.confidence),
    midLowBalance: m(['N', 'Sn', 'Me'], pv, F.brow, F.lower), lowerSplit: clamp(gmean([c('Sn'), c('Me'), stm.confidence]) * pv * F.lower * q, 0, 1),
    fwhr: m(['N', 'Ls'], ph, F.brow, cheek), jawWidth: clamp(V.factors.chin * cheek * ph * F.lower * q, 0, 1),
    eyeSpacing: clamp(V.factors.eyes * cheek * ph * F.eyes * q, 0, 1), noseWidth: clamp(V.factors.nose * ph * q, 0, 1),
    mouthNose: clamp(V.factors.mouth * V.factors.nose * ph * F.mouth * q, 0, 1), symmetry: sym
  };
}

/* ── REFERENCE COMPARISON ── */
export function featureValues(M) {
  return { thirdUp: M.facialThirds.upper, thirdMid: M.facialThirds.middle, thirdLow: M.facialThirds.lower, midLowBalance: M.facialThirds.midLowBalance,
    lowerSplit: M.lowerThird.split, fwhr: M.facialWidthHeight.fwhr, jawWidth: M.jaw.width, eyeSpacing: M.eyes.spacing,
    noseWidth: M.nose.alarToIntercanthal, mouthNose: M.mouth.toNose, symmetry: M.symmetry.value };
}
export function calculateReferenceDeviations(M, gender) {
  const ref = REFERENCE_PROFILES[gender] || REFERENCE_PROFILES.male, v = featureValues(M), out = {};
  for (const key in v) {
    const r = ref[key], z = (v[key] - r.center) / r.scale;
    const dev = r.oneSided ? Math.max(0, z - CONFIG.scoring.tolSd) : Math.max(0, Math.abs(z) - CONFIG.scoring.tolSd);
    out[key] = { value: v[key], center: r.center, scale: r.scale, z, excessSd: isFinite(dev) ? dev : NaN, sexSpecific: r.sexSpecific, kind: r.kind,
                 band: !isFinite(dev) ? 'n/a' : dev === 0 ? 'within' : dev < 1 ? 'slightly outside' : 'strong deviation' };
  }
  return out;
}

/* ── FEATURE SCORE: smooth, continuous, plateau inside tolerance, Gaussian fall-off outside ── */
export function calculateFeatureScores(dev, conf) {
  const out = {};
  for (const key in dev) { const s = isFinite(dev[key].excessSd) ? Math.exp(-.5 * dev[key].excessSd ** 2) : NaN; out[key] = { score: s, confidence: conf[key], weight: CONFIG.weights[key] }; }
  return out;
}

/* ── OVERALL: confidence-weighted mean, shrunk toward a neutral prior where confidence is missing ── */
export function calculateOverallScore(fs, ctx = {}) {
  let W = 0, eff = 0, acc = 0, v = 0;
  const U = CONFIG.uncertainty;
  for (const key in fs) { const f = fs[key]; if (!isFinite(f.score)) continue; W += f.weight; eff += f.weight * f.confidence; acc += f.weight * f.confidence * f.score + f.weight * (1 - f.confidence) * CONFIG.scoring.neutral; }
  for (const key in fs) { const f = fs[key]; if (isFinite(f.score)) v += (f.weight / W) ** 2 * (1 - f.confidence) ** 2 * U.unknownSd ** 2; }
  const index = 100 * acc / W, conf = eff / W;
  const unc = Math.sqrt(U.floorIndex ** 2 + (100 ** 2) * v + (U.corrPerFh * (ctx.corrSumFh || 0)) ** 2);
  const lab = conf >= CONFIG.confLabels.high ? 'High' : conf >= CONFIG.confLabels.moderate ? 'Moderate' : 'Low';
  return { index, uncertainty: unc, confidence: conf, confidenceLabel: lab };
}
export const tierKey = i => { const c = CONFIG.tierCuts; return i < c[0] ? 'sub5' : i < c[1] ? 'lt' : i < c[2] ? 'mt' : i < c[3] ? 'ht' : i < c[4] ? 'htplus' : 'elite'; };

/* ── FULL PIPELINE ── input: { points, autoPoints, mesh, W, H, gender, pose, blendshapes, quality, hair } (all px in the same frame) */
export function generateReport(inp) {
  const { mesh, W, H, gender } = inp;
  const validation = validateLandmarks(mesh, W, H), expr = expressionFromBlendshapes(inp.blendshapes), G = validation.geometry;
  const ctx = { validation, hair: inp.hair, expr, pose: inp.pose, quality: inp.quality };
  const L = getCorrectedLandmarks(inp.points, inp.autoPoints, ctx);
  if (!L.ordered) return { bad: true, landmarks: L };
  const stm = estimateStomion(L.points, mesh, G, expr);
  const M = calculateMeasurements(L.points, mesh, G, stm);
  const conf = calculateMeasurementConfidence(L.points, stm, ctx);
  const dev = calculateReferenceDeviations(M, gender), fs = calculateFeatureScores(dev, conf), overall = calculateOverallScore(fs, { corrSumFh: L.corrSumFh });
  const warnings = [...validation.flags, ...L.flags, ...inp.quality.warnings];
  if (expr.known && Math.min(...Object.values(expr.factors)) < .8) warnings.push('expression affects confidence (smile / open mouth / raised brows / squint)');
  if (poseF(inp.pose.yaw) < .8 || poseF(inp.pose.pitch) < .8) warnings.push('head pose reduces confidence');
  const lo = overall.index - overall.uncertainty, hi = overall.index + overall.uncertainty;
  return { bad: false, gender, landmarks: L, stomion: stm, validation, expression: expr, pose: inp.pose, quality: inp.quality, measurements: M, confidence: conf,
           deviations: dev, featureScores: fs, overall, tier: tierKey(overall.index), tierRange: [tierKey(lo), tierKey(hi)], warnings, profileMeta: REFERENCE_PROFILES.meta };
}

/* ── CONSISTENCY TESTING (dev): perturb landmarks, re-run, report spread ── */
function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
const gauss = r => Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r());
export function perturbInput(inp, { scale = 1, dx = 0, dy = 0, noisePx = 0, seed = 1 } = {}) {
  const r = rng(seed), f = p => ({ x: p.x * scale + dx + gauss(r) * noisePx, y: p.y * scale + dy + gauss(r) * noisePx });
  const pts = o => Object.fromEntries(Object.entries(o).map(([id, p]) => [id, f(p)]));
  return { ...inp, mesh: inp.mesh.map(f), points: pts(inp.points), autoPoints: pts(inp.autoPoints), W: inp.W * scale, H: inp.H * scale };
}
export function consistencyTest(inp, { trials = 30 } = {}) {
  const base = generateReport(inp), G = base.validation.geometry, rows = [];
  for (let t = 0; t < trials; t++) {
    const r = rng(t + 7), v = perturbInput(inp, { scale: .7 + .6 * r(), dx: (r() - .5) * 40, dy: (r() - .5) * 40, noisePx: CONFIG.noiseIpdFrac * G.ipd, seed: t + 100 });
    const rep = generateReport(v); rows.push({ index: rep.overall.index, vals: featureValues(rep.measurements) });
  }
  const b = featureValues(base.measurements), maxDelta = {};
  for (const key in b) maxDelta[key] = Math.max(...rows.map(r => Math.abs(r.vals[key] - b[key])));
  const idx = rows.map(r => r.index), mean = idx.reduce((a, c) => a + c, 0) / idx.length;
  return { baseIndex: base.overall.index, sdIndex: Math.sqrt(idx.reduce((a, c) => a + (c - mean) ** 2, 0) / idx.length),
           maxIndexDelta: Math.max(...idx.map(i => Math.abs(i - base.overall.index))), maxFeatureDelta: maxDelta, stable: Math.max(...idx.map(i => Math.abs(i - base.overall.index))) < base.overall.uncertainty };
}
