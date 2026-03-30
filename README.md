# ◈ Pear Media AI Prototype

A responsive web application that bridges simple user inputs with advanced AI outputs through two distinct workflows: **text-to-image** and **image-to-variation**.

---

## ✦ Live Demo

> **Hosted Link:** `https://pearmedia-ai-prototype.vercel.app` *(replace after deploy)*
> **Screen Recording:** `https://drive.google.com/...` *(replace after recording)*

---

## ◉ Features

### Workflow A — Creative Studio (Text → Image)
1. User enters a simple creative idea
2. AI enhances it into a rich 50-word descriptive prompt (lighting, style, camera angle)
3. User reviews and edits the enhanced prompt (human-in-the-loop)
4. Enhanced prompt is sent to an image generation API
5. Final image is displayed with download option

### Workflow B — Style Lab (Image → Variation)
1. User uploads any image (drag & drop or file picker)
2. Computer vision model analyzes: subject, colour palette, artistic style, lighting, mood
3. A variation prompt is auto-constructed from the analysis
4. User edits the variation prompt before generating
5. Stylistic variation is generated and shown side-by-side with the original

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, CSS3 (custom — no UI library) |
| Text Enhancement | OpenAI GPT-4o-mini **or** Gemini 1.5 Flash |
| Image Generation | OpenAI DALL-E 3 **or** Stability AI SDXL |
| Vision Analysis | Gemini 1.5 Flash (multimodal) **or** OpenAI Vision |
| Hosting | Vercel (frontend) |

---

## 📁 Project Structure

```
pearmedia-ai-prototype/
├── .env                    # Secret API keys (never commit)
├── .env.example            # Template for environment variables
├── .gitignore
├── README.md
├── package.json
└── src/
    ├── App.js              # Root component — state management & layout
    ├── App.css             # All styles (editorial dark theme)
    ├── index.js            # React DOM entry point
    ├── components/
    │   ├── Navbar.js       # Navigation bar with tab switching
    │   ├── WorkflowText.js # Creative Studio — text workflow
    │   ├── WorkflowImage.js# Style Lab — image workflow
    │   └── ImageCard.js    # Reusable result card with download
    └── utils/
        ├── apiHelpers.js   # All API fetch logic by provider
        └── constants.js    # System prompts & provider config
```

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- API keys (see below)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/pearmedia-ai-prototype.git
cd pearmedia-ai-prototype
npm install
```

### 2. Configure API Keys

```bash
cp .env.example .env
```

Open `.env` and fill in your keys:

```env
REACT_APP_OPENAI_KEY=sk-...          # OpenAI (GPT-4o-mini + DALL-E 3)
REACT_APP_GEMINI_KEY=AI...           # Google Gemini 1.5 Flash (vision + text)
REACT_APP_STABILITY_KEY=sk-...       # Stability AI SDXL (optional)

REACT_APP_TEXT_PROVIDER=openai       # 'openai' or 'gemini'
REACT_APP_IMAGE_PROVIDER=dalle       # 'dalle' or 'stability'
```

### 3. Start Development Server

```bash
npm start
```

App runs at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
```

---

## 🔑 API Keys — Where to Get Them

| API | Free Tier | Sign Up |
|---|---|---|
| OpenAI (GPT-4o-mini + DALL-E 3) | $5 free credit | platform.openai.com |
| Google Gemini 1.5 Flash | Generous free tier | aistudio.google.com |
| Stability AI SDXL | 25 free credits/day | platform.stability.ai |

**Recommended minimum:** One OpenAI key covers both text enhancement and DALL-E 3 image generation.

---

## 🚀 Deploying to Vercel

1. Push repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. In **Environment Variables**, add all keys from your `.env`
4. Click **Deploy**

---

## 📸 Screenshots

*(Add screenshots of both workflows here after running the app)*

---

## 🎯 Evaluation Checklist

- [x] Both workflows functional end-to-end
- [x] Multiple APIs integrated (OpenAI + Gemini + Stability AI)
- [x] Human-in-the-loop approval step in text workflow
- [x] Image analysis with structured JSON output
- [x] Drag-and-drop image upload
- [x] Side-by-side original vs variation comparison
- [x] Download generated images
- [x] Responsive design (mobile + desktop)
- [x] Error handling with user-friendly messages
- [x] Environment variables properly secured
- [x] `.env` in `.gitignore`

---

## 💡 Bonus Features Implemented

- Swappable API providers via environment variables (no code change needed)
- Editable enhanced prompts before image generation
- Colour palette extraction and display
- Side-by-side image comparison
- Drag-and-drop file upload
- Progress indicator for each workflow step
- Animated status bar during API calls

---

*Built for Pear Media Assignment — 6-hour sprint*
