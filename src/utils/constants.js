// ============================================================
// constants.js — Default prompts and provider configuration
// ============================================================

export const PROVIDERS = {
  TEXT: process.env.REACT_APP_TEXT_PROVIDER || 'gemini',   // 'openai' | 'gemini'
  IMAGE: process.env.REACT_APP_IMAGE_PROVIDER || 'dalle',  // 'dalle' | 'stability'
};

export const SYSTEM_PROMPTS = {
  ENHANCE: `You are an expert prompt engineer specialising in AI image generation.
Transform the user's simple request into a vivid, 50-word descriptive masterpiece.
Include: main subject, lighting quality, camera angle, colour palette, artistic style, and mood.
Return ONLY the enhanced prompt — no explanation, no preamble.`,

  ANALYZE_IMAGE: `You are a professional art director and computer vision expert.
Analyze the provided image and return a valid JSON object with exactly these keys:
{
  "mainSubject": "string — the primary object or scene",
  "colorPalette": ["array", "of", "dominant", "colours"],
  "artisticStyle": "string — e.g. Cyberpunk, Oil Painting, Photorealistic, Anime",
  "lighting": "string — e.g. Golden Hour, Studio, Neon, Natural Daylight",
  "mood": "string — e.g. Serene, Dramatic, Nostalgic",
  "variationPrompt": "string — a 60-word image generation prompt that captures this image's style for creating a variation"
}
Return ONLY the JSON — no markdown fences, no extra text.`,
};

export const PLACEHOLDER_PROMPTS = [
  'A lonely astronaut tending a garden on Mars',
  'A neon-lit Tokyo alley in heavy rain',
  'An ancient library inside a giant crystal cave',
  'A steampunk city floating among the clouds',
];
