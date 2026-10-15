/**
 * Firebase Cloud Function (v2) — AI face morph.
 * Deploy:  firebase functions:secrets:set OPENAI_API_KEY
 *          firebase deploy --only functions:morph
 * Then put the function URL in morph.html → const AI_ENDPOINT = '...'
 *
 * Uses OpenAI's image-edit endpoint. Swap the fetch for Gemini image editing or
 * FLUX Kontext if you prefer; the prompt and the auth check stay the same.
 * Check the provider docs for the current model name and set IMAGE_MODEL.
 */
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
admin.initializeApp();
const KEY = defineSecret('OPENAI_API_KEY');

const buildPrompt = (gender, strength) => {
  const level = strength > .8 ? 'strong, dramatic' : strength > .5 ? 'clearly visible' : 'subtle';
  return `Edit this photo of the SAME person. Keep identity, skin tone, skin texture, hair, eye colour, expression, clothing, background, lighting direction, framing and head position exactly as they are. The head is already level and front-facing; do not rotate or re-crop it.
Apply a ${level} facial-structure change to this ${gender}:
- HOLLOW CHEEKS: remove buccal fat; a clear natural shadowed hollow under the cheekbone running toward the mouth corner.
- HIGH, PROMINENT ZYGOMATIC ARCHES: cheekbones projecting with a soft highlight on top, contrast comes from the hollow below, NOT from a wider or fatter face.
- DEFINED ANGULAR JAWLINE: visible gonial angle, narrower lower face, tapered strong chin, sharp jaw-to-neck separation.
- EYES: positive canthal tilt, deep-set hunter-eye look with the brow bone close above the lid. Do NOT add shadow, eyeshadow or dark patches above or under the eyes, do NOT make the eyes larger or show more white, no bags.
Photorealistic, natural pores and skin texture, no beauty filter, no smoothing, no makeup, no stylisation.`;
};

exports.morph = onRequest({ secrets: [KEY], cors: true, timeoutSeconds: 180, memory: '512MiB' }, async (req, res) => {
  try {
    const token = (req.get('Authorization') || '').replace('Bearer ', '');
    await admin.auth().verifyIdToken(token);                       // only signed-in users
    const { image, gender, strength } = req.body || {};
    if (!image || !/^data:image\/jpeg;base64,/.test(image)) return res.status(400).send('bad image');
    const buf = Buffer.from(image.split(',')[1], 'base64');
    if (buf.length > 6e6) return res.status(413).send('too large');

    const fd = new FormData();
    fd.append('model', process.env.IMAGE_MODEL || 'gpt-image-1');
    fd.append('image', new Blob([buf], { type: 'image/jpeg' }), 'face.jpg');
    fd.append('prompt', buildPrompt(gender === 'female' ? 'woman' : 'man', Number(strength) || .85));
    fd.append('size', '1024x1536');                                // matches the 2:3 crop made in the browser
    fd.append('quality', 'high');
    fd.append('input_fidelity', 'high');                           // keeps the person's identity

    const r = await fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${KEY.value()}` }, body: fd });
    if (!r.ok) return res.status(502).send(await r.text());
    const j = await r.json();
    res.json({ image: j.data[0].b64_json });
  } catch (e) { console.error(e); res.status(500).send('error'); }
});
