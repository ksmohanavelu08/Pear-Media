// ============================================================
// apiHelpers.js — Groq (free text) + Pollinations (free images)
// ============================================================
import { SYSTEM_PROMPTS } from './constants';

// ── TEXT ENHANCEMENT via Groq (Free) ─────────────────────────
const enhanceViaGroq = async (userPrompt) => {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_GROQ_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPTS.ENHANCE },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 200,
      temperature: 0.85,
    }),
  });
  if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data.choices[0].message.content.trim();
};

export const getEnhancedPrompt = async (userPrompt) => {
  try {
    return await enhanceViaGroq(userPrompt);
  } catch (err) {
    console.error('Enhancement failed:', err);
    throw err;
  }
};

// ── IMAGE GENERATION via Pollinations (100% Free, No Key) ────
export const generateImage = async (prompt) => {
  try {
    const encoded = encodeURIComponent(prompt);
    const seed = Math.floor(Math.random() * 99999);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;
    return url;
  } catch (err) {
    console.error('Image generation failed:', err);
    throw new Error('Image generation failed. Please try again.');
  }
};

// ── IMAGE ANALYSIS via Groq Vision (Free) ────────────────────
const analyzeViaGroq = async (base64Image, mimeType = 'image/jpeg') => {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.REACT_APP_GROQ_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.2-11b-vision-preview',
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: `data:${mimeType};base64,${base64Image}` },
          },
          {
            type: 'text',
            text: SYSTEM_PROMPTS.ANALYZE_IMAGE,
          },
        ],
      }],
      max_tokens: 500,
      temperature: 0.4,
    }),
  });
  if (!res.ok) throw new Error(`Groq Vision ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const raw = data.choices[0].message.content.trim();
  return JSON.parse(raw.replace(/```json|```/g, '').trim());
};

export const analyzeImage = async (base64Image, mimeType = 'image/jpeg') => {
  try {
    return await analyzeViaGroq(base64Image, mimeType);
  } catch (err) {
    console.error('Image analysis failed:', err);
    throw err;
  }
};

// ── Utility: File → Base64 ────────────────────────────────────
export const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = () => reject(new Error('File read failed'));
    reader.readAsDataURL(file);
  });