# Ark Translator (Next.js + shadcn/ui)

Minimal translation UI inspired by DeepL, powered by Ark Doubao Seed Translation. Built with Next.js App Router, Tailwind, and shadcn/ui components.

## Stack
- Next.js 14 (App Router, TypeScript)
- TailwindCSS + shadcn/ui primitives
- Ark API (`/api/translate`) proxy for server-side key safety

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` with your credentials:
   ```bash
   ARK_API_KEY=your_ark_api_key
   ARK_MODEL_ID=your_model_id   # e.g. ep-20251203210101-2zkcm
   # Optional override, defaults to official endpoint:
   # ARK_API_URL=https://ark.cn-beijing.volces.com/api/v3/responses
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

## Vercel Deployment
1. Push this project to your repo.
2. Import to Vercel, set the environment variables above in **Project Settings → Environment Variables**.
3. Deploy. No extra build steps are needed; Vercel uses `npm run build`.

## Project Layout
- `app/page.tsx` – translation UI (language selectors, swap, loader/error states).
- `app/api/translate/route.ts` – server route that calls Ark with `input_text` + `translation_options`.
- `components/ui/*` – lightweight shadcn-style primitives.
- `app/globals.css` & `tailwind.config.ts` – styling, theme tokens, animations.

## Notes
- The API key stays server-side; the client only talks to `/api/translate`.
- Swap keeps UX simple: source ↔ target and moves translated text back.
- Caching is intentionally off for freshness; add edge caching if desired.
