# VibeDeck AI — Build Plan (remaining ~40%)

> Companion to `docs/PROGRESS.md`. Plain JavaScript only. Validate every milestone with `npm run lint` + `npm run build` (exit 0).

## Milestone 1 — No-backend wins (do first)
1. **Real voice recorder (S)** — `MediaRecorder` in `VoiceBody` (`InteractionBodies.jsx`): mic permission UX, record/stop/playback, attach audio blob ref; fallback to simulation on denial. Accept: record → playback → answer attaches "Voice Note".
2. **Password/Lock card type (S)** — new `password` id in `buttonTypes.js` + `aiService` schema + `PasswordBody` (code input + clue + unlock); normalize legacy. Accept: locked card blocks advance until code matches.
3. **Real QR in exporter (XS)** — draw scannable QR of deck link on the 1200x630 canvas (`SocialExporter.jsx`). Zero-dep approach: embed tiny QR draw routine; if too big, add `qrcode` dep (decision at build time). Accept: phone scans QR → opens deck. Decision recorded: used `qrcode` npm dep (not hand-rolled) — PR #8, commit 81e785a.
4. **Tone switcher + chat tweak (M)** — reuse Gemini key: `rewriteDeck(deck, tone)` for 5 tones + one-line tweak prompt in Studio (`AiBar.jsx` extension, `aiService.js`). Accept: 1 click rewrites copy in chosen tone.
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
