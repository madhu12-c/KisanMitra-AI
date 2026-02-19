# KisanMitra AI

Intelligent Government Scheme Discovery Platform for farmers. This is a **selection-round working prototype**: rule-based eligibility, AI only for explanation and translation.

## Architecture

- **Eligibility**: Deterministic, rule-based engine. No AI decides eligibility.
- **AI (Groq Llama 3)**: Explanation, Hindi/English translation, conversational formatting only.
- **Data**: `src/data/schemes.json` (8–10 schemes; `benefitAmount` is numeric for ranking).
- **Explainability**: Per-scheme `eligibilityStatus`, `matchedConditions`, `failedConditions`, `eligibilityScore`.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy env and add your Groq API key:
   ```bash
   cp .env.local.example .env.local
   ```
   Edit `.env.local` and set `GROQ_API_KEY` (get from [Groq Console](https://console.groq.com)).

3. Run dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

## Flow

1. User answers 5 profile questions (land size, crop, income, irrigation, state).
2. Frontend sends `userProfile` to `POST /api/recommend`.
3. Backend loads schemes, runs **eligibility engine** (rule-based), then **ranking** (by `benefitAmount` and `eligibilityScore`), then **AI explanation**.
4. Response includes `structuredResult` (eligible, not eligible, reasons, top 3) and `aiExplanation`.
5. UI shows scheme cards and AI text; language toggle re-fetches explanation in Hindi/English.

## Out of scope (documentation/PPT only)

- Real government database integration  
- Aadhaar verification  
- OCR document validation  
- Offline sync  
- 700+ scheme coverage  
- 10M concurrent scaling  

## Folder structure

```
src/
  app/          # Next.js App Router, API route
  data/         # schemes.json
  lib/
    eligibility/  # engine, ranking, types
    ai/           # explain (Groq)
  components/   # Chat, SchemeCard, LanguageToggle, VoiceInput
```
