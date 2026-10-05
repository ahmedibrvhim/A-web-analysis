/* face-pipeline.js — shared by tool.html and validate.html
   Image → Quality check → MediaPipe → Verified landmarks → Measurements → Normalized ratios → Validated scoring.
   Rules: every point is ONE real MediaPipe Face Landmarker index. Nothing is guessed, interpolated, or
   found by scanning pixel brightness. If detection is not reliable the pipeline stops (no fallback points). */

const BASE = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const MODEL = 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

/* Quality thresholds (Step 3). These are conservative DEFAULTS, not validated numbers:
   validate.html reports reject rates so you can tune them on real data. */
export const QC = {
  minFaceH: 220, minFaceFrac: 0.22, edge: 0.01,
  yaw: 8, pitch: 10, roll: 8, noseOffset: 0.10,
  lumMin: 70, lumMax: 195, contrastMin: 28, lrMin: 0.6, clipHi: 0.06, clipLo: 0.25,
  blink: 0.5, jawOpen: 0.2, smile: 0.45,
  stability: 0.05            // max relative change of any ratio between the two detection passes
};

/* ── Step 4 · the fixed landmark list. [key, MediaPipe index, short code, English, Arabic] ── */
const SINGLE = [
  ['top', 10, 'Top', 'Forehead top (mesh point, not the true hairline)', 'أعلى الجبهة (نقطة الشبكة وليس خط الشعر)'],
  ['glab', 9, 'Gla', 'Glabella (between the brows)', 'ما بين الحاجبين'],
  ['nasion', 168, 'Nas', 'Nasion (nose bridge)', 'جذر الأنف'],
  ['subn', 2, 'Sn', 'Subnasale (base of the nose)', 'قاعدة الأنف'],
  ['chin', 152, 'Me', 'Chin bottom', 'أسفل الذقن']
];
const PAIRS = [   // [key, idA, idB, code, English, Arabic] — "L" = the point that is left in the photo
  ['fore', 54, 284, 'Fh', 'Forehead edge', 'حافة الجبهة'],
  ['face', 234, 454, 'Fw', 'Face edge (widest contour)', 'حافة الوجه (الأعرض)'],
  ['cheek', 127, 356, 'Zy', 'Cheekbone arch', 'قوس الوجنة'],
  ['jaw', 58, 288, 'Jw', 'Jaw angle', 'زاوية الفك'],
  ['eo', 33, 263, 'Eo', 'Outer eye corner', 'زاوية العين الخارجية'],
  ['ei', 133, 362, 'Ei', 'Inner eye corner', 'زاوية العين الداخلية'],
  ['nose', 129, 358, 'Nw', 'Nostril edge', 'حافة المنخر'],
  ['mouth', 61, 291, 'Mc', 'Mouth corner', 'زاوية الفم']
];
export const SPEC = [
  ...SINGLE.map(([k, id, code, en, ar]) => ({ k, id, code, en, ar })),
  ...PAIRS.flatMap(([k, a, b, code, en, ar]) => [
    { k: k + 'L', id: a, code: code + '-L', en: en + ' · left in photo', ar: ar + ' · يسار الصورة' },
    { k: k + 'R', id: b, code: code + '-R', en: en + ' · right in photo', ar: ar + ' · يمين الصورة' }
  ])
];

/* The 11 measurements (Step 4). Eye width = mean of both eyes; thirds = three segments along the midline. */
export const MEAS = [
  ['faceHeight', 'Face height', 'ارتفاع الوجه', '10–152'], ['faceWidth', 'Face width', 'عرض الوجه', '234–454'],
  ['foreheadWidth', 'Forehead width', 'عرض الجبهة', '54–284'], ['cheekWidth', 'Cheekbone width', 'عرض الوجنتين', '127–356'],
  ['jawWidth', 'Jaw width', 'عرض الفك', '58–288'], ['eyeWidth', 'Eye width (mean of both)', 'عرض العين (متوسط العينين)', '33–133, 263–362'],
  ['eyeSpacing', 'Eye spacing (inner corners)', 'المسافة بين العينين', '133–362'], ['noseWidth', 'Nose width', 'عرض الأنف', '129–358'],
  ['noseLength', 'Nose length', 'طول الأنف', '168–2'], ['mouthWidth', 'Mouth width', 'عرض الفم', '61–291'],
  ['thirds', 'Facial thirds', 'أثلاث الوجه', '10→9→2→152']
].map(([k, en, ar, ids]) => ({ k, en, ar, ids }));

/* ── Step 5 · normalized ratios (dimensionless, so camera distance cancels out) ── */
const CH = r => r.t1 + r.t2 + r.t3;
export const RATIOS = [
  ['faceW_H', 'Face width ÷ face height', 'عرض الوجه ÷ ارتفاعه', '234–454 ÷ 10–152', r => r.faceWidth / r.faceHeight],
  ['foreW_cheekW', 'Forehead ÷ cheekbone width', 'الجبهة ÷ عرض الوجنتين', '54–284 ÷ 127–356', r => r.foreheadWidth / r.cheekWidth],
  ['cheekW_faceH', 'Cheekbone width ÷ face height', 'عرض الوجنتين ÷ ارتفاع الوجه', '127–356 ÷ 10–152', r => r.cheekWidth / r.faceHeight],
  ['jawW_cheekW', 'Jaw ÷ cheekbone width', 'الفك ÷ عرض الوجنتين', '58–288 ÷ 127–356', r => r.jawWidth / r.cheekWidth],
  ['jawW_faceW', 'Jaw ÷ face width', 'الفك ÷ عرض الوجه', '58–288 ÷ 234–454', r => r.jawWidth / r.faceWidth],
  ['foreW_faceW', 'Forehead ÷ face width', 'الجبهة ÷ عرض الوجه', '54–284 ÷ 234–454', r => r.foreheadWidth / r.faceWidth],
  ['eyeW_faceW', 'Eye width ÷ face width', 'عرض العين ÷ عرض الوجه', '(33–133, 263–362) ÷ 234–454', r => r.eyeWidth / r.faceWidth],
  ['eyeSp_eyeW', 'Eye spacing ÷ eye width', 'المسافة بين العينين ÷ عرض العين', '133–362 ÷ (33–133, 263–362)', r => r.eyeSpacing / r.eyeWidth],
  ['noseW_faceW', 'Nose width ÷ face width', 'عرض الأنف ÷ عرض الوجه', '129–358 ÷ 234–454', r => r.noseWidth / r.faceWidth],
  ['noseL_faceH', 'Nose length ÷ face height', 'طول الأنف ÷ ارتفاع الوجه', '168–2 ÷ 10–152', r => r.noseLength / r.faceHeight],
  ['mouthW_faceW', 'Mouth width ÷ face width', 'عرض الفم ÷ عرض الوجه', '61–291 ÷ 234–454', r => r.mouthWidth / r.faceWidth],
  ['noseW_mouthW', 'Nose width ÷ mouth width', 'عرض الأنف ÷ عرض الفم', '129–358 ÷ 61–291', r => r.noseWidth / r.mouthWidth],
  ['third1', 'Upper third share', 'حصة الثلث العلوي', '10→9 ÷ chain', r => r.t1 / CH(r)],
  ['third2', 'Middle third share', 'حصة الثلث الأوسط', '9→2 ÷ chain', r => r.t2 / CH(r)],
  ['third3', 'Lower third share', 'حصة الثلث السفلي', '2→152 ÷ chain', r => r.t3 / CH(r)]
].map(([k, en, ar, ids, f]) => ({ k, en, ar, ids, f }));

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const size = im => [im.naturalWidth || im.width, im.naturalHeight || im.height];

/* ── MediaPipe ── */
let lmk = null, failed = false;
export async function getLandmarker() {
  if (lmk || failed) return lmk;
  try {
    const v = await import(BASE + '/vision_bundle.mjs');
    const fs = await v.FilesetResolver.forVisionTasks(BASE + '/wasm');
    const mk = delegate => v.FaceLandmarker.createFromOptions(fs, {
      baseOptions: { modelAssetPath: MODEL, delegate }, runningMode: 'IMAGE', numFaces: 2,
      outputFacialTransformationMatrixes: true, outputFaceBlendshapes: true
    });
    try { lmk = await mk('GPU'); } catch (e) { lmk = await mk('CPU'); }
  } catch (e) { console.error('MediaPipe load failed', e); failed = true; lmk = null; }
  return lmk;
}

export function pointsFrom(lm, W, H) {
  const P = {}, px = i => ({ x: lm[i].x * W, y: lm[i].y * H });
  SINGLE.forEach(([k, id]) => { P[k] = { ...px(id), id }; });
  PAIRS.forEach(([k, a, b]) => {
    let A = px(a), B = px(b), ia = a, ib = b;
    if (A.x > B.x) { [A, B] = [B, A]; [ia, ib] = [ib, ia]; }       // L = left in the photo
    P[k + 'L'] = { ...A, id: ia }; P[k + 'R'] = { ...B, id: ib };
  });
  return P;
}

export function pose(res) {
  const m = res?.facialTransformationMatrixes?.[0]?.data;
  if (!m) return null;
  const s = Math.hypot(m[0], m[1], m[2]) || 1, k = 180 / Math.PI;
  let pitch = Math.atan2(m[6], m[10]) * k;
  if (pitch > 90) pitch = 180 - pitch; else if (pitch < -90) pitch = -180 - pitch;
  return { yaw: Math.asin(clamp(-m[2] / s, -1, 1)) * k, pitch };
}

/* Lighting is only used to ACCEPT or REJECT a photo — never to place a landmark. */
function lighting(img, P) {
  const [W, H] = size(img), xs = Object.values(P).map(p => p.x), ys = Object.values(P).map(p => p.y);
  const x0 = clamp(Math.min(...xs), 0, W - 2), x1 = clamp(Math.max(...xs), x0 + 1, W);
  const y0 = clamp(Math.min(...ys), 0, H - 2), y1 = clamp(Math.max(...ys), y0 + 1, H);
  const w = 96, h = Math.max(8, Math.round(w * (y1 - y0) / (x1 - x0)));
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.drawImage(img, x0, y0, x1 - x0, y1 - y0, 0, 0, w, h);
  const d = g.getImageData(0, 0, w, h).data;
  let s = 0, s2 = 0, l = 0, r = 0, ln = 0, rn = 0, hi = 0, lo = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const k = (y * w + x) * 4, v = 0.299 * d[k] + 0.587 * d[k + 1] + 0.114 * d[k + 2];
    s += v; s2 += v * v; if (x < w / 2) { l += v; ln++; } else { r += v; rn++; }
    if (v >= 250) hi++; if (v <= 12) lo++;
  }
  const n = w * h, mean = s / n, a = l / ln, b = r / rn;
  return { mean, std: Math.sqrt(Math.max(0, s2 / n - mean * mean)), lr: Math.min(a, b) / Math.max(a, b, 1e-6), clipHi: hi / n, clipLo: lo / n };
}

/* ── Step 3 · strict quality checks. Returns { fails: [[i18nKey, params], …], P, lm, pose, light } ── */
export function assess(img, res) {
  const [W, H] = size(img), n = res?.faceLandmarks?.length || 0, f = [];
  if (n === 0) return { fails: [['q_none']] };
  if (n > 1) return { fails: [['q_multi']] };
  const lm = res.faceLandmarks[0];
  if (lm.length < 468) return { fails: [['q_mesh']] };
  const P = pointsFrom(lm, W, H), d = (a, b) => Math.hypot(P[a].x - P[b].x, P[a].y - P[b].y);
  const fh = d('top', 'chin'), fw = d('faceL', 'faceR');

  if (fh < QC.minFaceH || fw / W < QC.minFaceFrac) f.push(['q_small', { px: Math.round(fh) }]);            // large enough
  if (Object.values(P).some(p => p.x < QC.edge * W || p.x > (1 - QC.edge) * W || p.y < QC.edge * H || p.y > (1 - QC.edge) * H)) f.push(['q_edge']);

  const ps = pose(res), roll = Math.atan2(P.eoR.y - P.eoL.y, P.eoR.x - P.eoL.x) * 180 / Math.PI;     // frontal + low yaw/pitch/roll
  if (!ps) f.push(['q_pose']);
  else {
    if (Math.abs(ps.yaw) > QC.yaw) f.push(['q_yaw', { v: Math.abs(ps.yaw).toFixed(1), max: QC.yaw }]);
    if (Math.abs(ps.pitch) > QC.pitch) f.push(['q_pitch', { v: Math.abs(ps.pitch).toFixed(1), max: QC.pitch }]);
  }
  if (Math.abs(roll) > QC.roll) f.push(['q_roll', { v: Math.abs(roll).toFixed(1), max: QC.roll }]);
  const nx = lm[1].x * W, off = Math.abs((nx - P.faceL.x) - (P.faceR.x - nx)) / fw;                     // independent geometric frontal check
  if (off > QC.noseOffset) f.push(['q_asym', { v: (off * 100).toFixed(0) }]);

  const bs = res.faceBlendshapes?.[0]?.categories;                                                      // occlusion / expression proxies
  if (bs) {
    const g = name => bs.find(c => c.categoryName === name)?.score ?? 0;
    if (Math.max(g('eyeBlinkLeft'), g('eyeBlinkRight')) > QC.blink) f.push(['q_blink']);
    if (g('jawOpen') > QC.jawOpen) f.push(['q_mouth']);
    if (Math.max(g('mouthSmileLeft'), g('mouthSmileRight')) > QC.smile) f.push(['q_smile']);
  }
  const light = lighting(img, P);                                                                       // lighting
  if (light.mean < QC.lumMin) f.push(['q_dark']);
  if (light.mean > QC.lumMax) f.push(['q_bright']);
  if (light.std < QC.contrastMin) f.push(['q_flat']);
  if (light.lr < QC.lrMin) f.push(['q_uneven']);
  if (light.clipHi > QC.clipHi || light.clipLo > QC.clipLo) f.push(['q_clip']);
  return { fails: f, P, lm, pose: { yaw: ps?.yaw, pitch: ps?.pitch, roll }, light, fh, fw };
}

/* ── Step 4/5 · measurements and normalized ratios ── */
export function measure(P) {
  const d = (a, b) => Math.hypot(P[a].x - P[b].x, P[a].y - P[b].y);
  const raw = {
    faceHeight: d('top', 'chin'), faceWidth: d('faceL', 'faceR'), foreheadWidth: d('foreL', 'foreR'),
    cheekWidth: d('cheekL', 'cheekR'), jawWidth: d('jawL', 'jawR'), eyeWidth: (d('eoL', 'eiL') + d('eoR', 'eiR')) / 2,
    eyeSpacing: d('eiL', 'eiR'), noseWidth: d('noseL', 'noseR'), noseLength: d('nasion', 'subn'), mouthWidth: d('mouthL', 'mouthR'),
    t1: d('top', 'glab'), t2: d('glab', 'subn'), t3: d('subn', 'chin')
  };
  const ordered = P.top.y < P.glab.y && P.glab.y < P.subn.y && P.subn.y < P.chin.y;
  if (!ordered || Object.values(raw).some(v => !(v > 0))) return { ok: false };
  const ratios = {}; RATIOS.forEach(x => { ratios[x.k] = x.f(raw); });
  return { ok: true, raw, ratios };
}

/* ── Step 1/2 · landmark pipeline with NO fallback ──
   pass 1 on the original → quality gate → level + crop → pass 2 on the leveled crop → stability check.
   Anything unreliable stops here. */
const CROP = { pad: 0.42, side: 0.32, aspect: 4 / 5, maxSide: 1600 };
function levelAndCrop(img, lm, rollDeg, pivot) {
  const [W, H] = size(img), r = rollDeg * Math.PI / 180, cos = Math.cos(r), sin = Math.sin(r);
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  lm.forEach(p => {
    const dx = p.x * W - pivot.x, dy = p.y * H - pivot.y, x = pivot.x + dx * cos + dy * sin, y = pivot.y - dx * sin + dy * cos;
    x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
  });
  const fw = x1 - x0, fh = y1 - y0;
  let mx = 0;
  [10, 168, 1, 152].forEach(i => { const p = lm[i], dx = p.x * W - pivot.x, dy = p.y * H - pivot.y; mx += pivot.x + dx * cos + dy * sin; });
  const cx = mx / 4, cy = (y0 + y1) / 2;
  let h = fh * (1 + 2 * CROP.pad), w = Math.max(fw * (1 + 2 * CROP.side), h * CROP.aspect);
  h = Math.max(h, w / CROP.aspect);
  const bx = cx - w / 2, by = cy - h / 2, k = Math.min(1, CROP.maxSide / Math.max(w, h));
  const c = document.createElement('canvas'); c.width = Math.round(w * k); c.height = Math.round(h * k);
  const g = c.getContext('2d');
  g.fillStyle = '#0b0b0b'; g.fillRect(0, 0, c.width, c.height);
  g.scale(k, k); g.translate(-bx, -by);
  g.translate(pivot.x, pivot.y); g.rotate(-r); g.translate(-pivot.x, -pivot.y);
  g.drawImage(img, 0, 0);
  return c;
}

export async function analyzeImage(img) {
  const m = await getLandmarker();
  if (!m) return { ok: false, reasons: [['q_model']] };
  let r1, r2;
  try { r1 = m.detect(img); } catch (e) { console.error(e); return { ok: false, reasons: [['q_model']] }; }
  const a = assess(img, r1);
  if (a.fails.length) return { ok: false, reasons: a.fails, pose: a.pose, light: a.light };

  const pivot = { x: (a.P.eoL.x + a.P.eoR.x) / 2, y: (a.P.eoL.y + a.P.eoR.y) / 2 };
  const canvas = levelAndCrop(img, a.lm, a.pose.roll, pivot);
  try { r2 = m.detect(canvas); } catch (e) { console.error(e); return { ok: false, reasons: [['q_model']] }; }
  const b = assess(canvas, r2);
  if (b.fails.length) return { ok: false, reasons: b.fails, pose: a.pose, light: a.light };

  const M1 = measure(a.P), M2 = measure(b.P);
  if (!M1.ok || !M2.ok) return { ok: false, reasons: [['q_unstable', { pct: '—' }]] };
  const drift = Math.max(...RATIOS.map(x => Math.abs(M2.ratios[x.k] - M1.ratios[x.k]) / M1.ratios[x.k]));
  if (drift > QC.stability) return { ok: false, reasons: [['q_unstable', { pct: (drift * 100).toFixed(1) }]], pose: a.pose, light: a.light };

  return { ok: true, canvas, P: b.P, P1: a.P, raw: M2.raw, ratios: M2.ratios, pose: a.pose, light: a.light, drift };
}

/* ── Steps 7/8/10 · scoring from validated reference data only ──
   norms.json is produced by validate.html. Per gender it holds mean/sd of every ratio, weights fitted from
   rated faces, and the quantiles of the composite. With no validated norms there is NO score. */
export function composite(ratios, G) {
  const z = {}; let s = 0, w = 0;
  for (const k of Object.keys(G.ratios)) {
    const st = G.ratios[k];
    if (!(st.sd > 0) || !(k in ratios)) continue;
    z[k] = (ratios[k] - st.mean) / st.sd;
    const wk = G.weights?.[k] ?? 0;
    s += wk * Math.min(Math.abs(z[k]), 4); w += wk;
  }
  return w > 0 ? { z, comp: s / w } : null;
}
export function scoreFace(ratios, gender, norms) {
  if (!norms || norms.validated !== true) return { ok: false, why: 'uncalibrated' };
  const G = norms.groups?.[gender];
  if (!G || G.n < (norms.minN || 300) || !G.composite_quantiles) return { ok: false, why: 'small' };
  const c = composite(ratios, G);
  if (!c) return { ok: false, why: 'noweights' };
  const q = G.composite_quantiles; let i = 0;
  while (i < q.length && q[i] < c.comp) i++;
  return { ok: true, z: c.z, comp: c.comp, score: Math.round(100 - (i / (q.length - 1)) * 100) };
}
