# VibeDeck AI — Progress Record

> Source of truth: Master Plan v4.0 (`reference/VibeDeck AI - Master Plan, Feature Architecture & Business Strategy.docx`).
> Last audited: 2026-09-14 · Branch `feature/password-card` · Overall: **~66% complete**.

## Done (shipped on main)
- Prompt-to-Deck via Gemini structured JSON (`src/services/aiService.js`, `AiBar.jsx`).
- 6 interaction types: runaway / options / slider / text / next (`player/InteractionBodies.jsx`, `useRunawayButton.js`).
- 7th type — Secret Password Box: locked card until code matches (case-insensitive); user sets passcode + hint via dedicated editor, preview shows masked dots + LOCKED badge; empty passcode = accept any; wrong-code error UX; unlock animation (`player/InteractionBodies.jsx` `PasswordBody`, `studio/CardConfig.jsx` `PasswordEditor`, `studio/StudioPreview.jsx`, `data/defaults.js` normalize, `aiService.js` schema+prompt).
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

- 2026-09-14: M1.2a Secret Password Box card type shipped (code+clue+unlock); password type added to schema, editor, preview; ~66%.
- 2026-09-14: M1.2b Option B — dedicated passcode + passwordHint fields added (`PasswordEditor`, `StudioPreview` masked dots + LOCKED badge, `PasswordBody` reads new shape with options[0] fallback, aiService prompt+schema updated, normalize includes new fields); ~66%.