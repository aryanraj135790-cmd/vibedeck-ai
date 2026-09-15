# VibeDeck AI — Build Plan (remaining ~40%)

> Companion to `docs/PROGRESS.md`. Plain JavaScript only. Validate every milestone with `npm run lint` + `npm run build` (exit 0).

## Milestone 1 — No-backend wins (do first)
1. **Real voice recorder (S)** — `MediaRecorder` in `VoiceBody` (`InteractionBodies.jsx`): mic permission UX, record/stop/playback, attach audio blob ref; fallback to simulation on denial. Accept: record → playback → answer attaches "Voice Note".
2. **Password/Lock card type (S)** — new `password` id in `buttonTypes.js` + `aiService` schema + `PasswordBody` (code input + clue + unlock); normalize legacy. Accept: locked card blocks advance until code matches.
3. **Real QR in exporter (XS)** — draw scannable QR of deck link on the 1200x630 canvas (`SocialExporter.jsx`). Zero-dep approach: embed tiny QR draw routine; if too big, add `qrcode` dep (decision at build time). Accept: phone scans QR → opens deck. Decision recorded: used `qrcode` npm dep (not hand-rolled) — PR #8, commit 81e785a.
4. **Tone switcher + chat tweak (M)** — standalone `AiRewriteBar.jsx` (new component, mounted below `AiBar.jsx` in `App.jsx` editor tab) + `rewriteDeckCopy(deck, tone, tweakPrompt)` in `aiService.js` + `rewriting`/`handleRewrite` in `useApp.js`. Reuses the existing `VITE_GEMINI_API_KEY` + `@google/genai` gemini-3.5-flash call shape — no new dependency.

**Tones (voice-of-voice, NOT visual themes):**
- `playful` — light, fun, breezy, emoji-friendly
- `romantic` — warm, sincere, intimate, soft
- `sarcastic` — dry, witty, slightly biting, self-aware, tongue-in-cheek
- `dramatic` — bold, heightened, cinematic, urgent
- `minimal` — short, clean, direct, spare

`playful` is pre-selected by default so 1 click rewrites immediately.

**Scope of rewrite:** question + subtitle on every card, plus option wording on runaway/options cards (option count per card preserved). Does NOT touch: `id`, `type`, `mediaUrl`, `passcode`, `passwordHint`, or deck-level fields (`title`, `themeId`, `senderName`, `recipientName`, `phoneNum`).

**Gemini shape:** structured JSON array `[{ id, question, subtitle, options }]` → merged by card id (so card order changes are safe); temperature 0.6, maxOutputTokens 1200. On any API/parse failure, returns the original deck unchanged and the caller toasts the failure — the deck is never lost.

**Accept:** 1 click rewrites copy in the chosen tone; `npm run lint` + `npm run build` both exit 0.
5. **Media search lite (M)** — Tenor/Giphy search tab in `MediaPicker.jsx` (env key, debounce, pick-to-assign). Accept: search → thumbnail → assigned to card.

## Milestone 2 — Backend + short links
6. **Persistence + `/c/:id` (L)** — choose Supabase (default) or Firebase; `services/deckStore.js`: save/load JSON, short id route, keep `#deck=` backward compat. Accept: fresh browser opens `/c/:id` deck.
7. **Share migration (S)** — Save&Share writes backend first, falls back to hash link offline. Accept: links survive cache clear.

## Milestone 3 — Growth (auth + dashboard)
8. **Lazy auth modal (M)** — guest-first; modal on Save/Publish/Dashboard; Google OAuth first, OTP/magic later. Accept: guest builds + previews; publish prompts login.
9. **Dashboard (M)** — my decks, link analytics (opens), response history inbox. Accept: creator sees answers per deck.

## Milestone 4 — Monetization + launch
10. **Paywall (M)** — free: 3 cards + watermark; Single $1.99 / VIP $6.99 via Stripe; watermark enforced in exporter/player footer. Accept: unpaid decks carry watermark; paid remove it.
11. **Gift cards (S)** — finale attach (Amazon/Starbucks/DoorDash) + affiliate tag passthrough. Accept: link tracked per deck.
12. **PWA + deploy (S)** — manifest, icons, service worker, `vercel.json`/netlify config, OG meta. Accept: installable, green Lighthouse PWA.

## Conventions
- Update `docs/PROGRESS.md` each milestone: move items Done, add % + date + commit hash.
- No TypeScript. Keep `useApp.js` as state owner; small components under `player/`, `studio/`, `chrome/`.
- Open decisions: Supabase vs Firebase; mic-permission UX copy.
