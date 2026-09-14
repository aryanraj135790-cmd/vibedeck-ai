# VibeDeck AI — Progress Record

> Source of truth: Master Plan v4.0 (`docs/VibeDeck AI - Master Plan, Feature Architecture & Business Strategy.docx`).
> Last audited: 2026-09-14 · Branch `feature/voice-recorder` · Overall: **~63% complete**.

## Done (shipped on main)
- Prompt-to-Deck via Gemini structured JSON (`src/services/aiService.js`, `AiBar.jsx`).
- 6 interaction types: runaway / options / slider / text / next (`player/InteractionBodies.jsx`, `useRunawayButton.js`).
- Real voice note recording: MediaRecorder + mic permission UX (denied/no-device/error states), 60s countdown, cleanup-on-unmount (no dangling mic), audio playback + fallback simulation (`player/InteractionBodies.jsx` `VoiceBody`).
- CI pipeline: GitHub Actions lint+build gate on PR/push to main (`.github/workflows/ci.yml`).
- Working agreement doc: branch/commit/PR/deploy/rollback rules (`docs/WORKING-AGREEMENT.md`).
- Envelope open + finale + confetti (`EnvelopeView.jsx`, `FinaleView.jsx`, `chrome/Backdrop.jsx`).
- Media hub: URL + upload (1.5MB guard) + 3 GIF presets (`studio/MediaPicker.jsx`).
- Web Audio synth SFX set: flip/tick/evasion/success/pop/fanfare/cyberbeep (`services/soundService.js`).
- 5 themes + 3D tilt + particles (`data/themes.js`, `hooks/useTilt.js`).
- WhatsApp/Telegram/SMS routing (`services/dispatchService.js`).
- Social exporter 1200x630 + PNG download (`studio/SocialExporter.jsx`) — QR is placeholder.
- Local Saved Decks library: save/rename/duplicate/play/delete (`services/libraryService.js`, `studio/SavedDecks.jsx`).
- lz-string `#deck=` share links + clipboard fallback + 60s banner (`services/shareService.js`).
- Studio editor: add/remove/reorder cards, per-card config, StudioPreview (`studio/*`).
- Responsive header, SVG favicon, meta title, custom scrollbars, cursor-pointer rule.

## Partial (works but below plan spec)
| Item | Gap | File |
|---|---|---|
| Voice note upload to deck | recorded blob lives in memory only; not persisted with deck | `InteractionBodies.jsx` |
| Social QR | fake checker pattern, not scannable | `SocialExporter.jsx` |
| Media finder | no Giphy/Tenor search, AI url + presets only | `aiService.js`, `MediaPicker.jsx` |
| Deploy/PWA | no vercel config, manifest, or SW verified | repo root |

## Todo (not started)
- In-context chat tweaks (funnier/translate/retheme), tone switcher (5 tones).
- Secret Password Box card type (lock + clue).
- Custom BGM MP3 / voice upload; persist recorded audio with deck (backend).
- Video loops, AI images, Tenor/Giphy search.
- Custom backgrounds/fonts/particle selector.
- Real QR in exporter; gift-card attach + affiliate.
- Lazy auth (guest → modal → dashboard) + response history/analytics.
- Backend persistence (Supabase/Firebase) + `/c/:id` short links (keep `#deck=` compat).
- Monetization: watermark enforcement, $1.99 pass, $6.99 VIP, Stripe.
- PWA + production deploy config.

## History
- 2026-09-14: audit vs plan v4.0 - PROGRESS.md + PLAN.md created (~60%).
- 2026-09-14: CI pipeline + WORKING-AGREEMENT.md added; real voice recorder shipped (MediaRecorder, permission UX, cleanup-on-unmount); ~63%.
