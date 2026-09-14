# VibeDeck AI - Working Agreement (Staff FDE operating manual)

> How we ship production code here. CI enforces it; this doc explains it.
> Stack: React 19 + Vite 8 + Tailwind 4, plain JavaScript (no TypeScript).

## 1. Branching and commits
- Never push directly to main. Work on feature/*, fix/*, docs/* branches.
- Conventional commits: feat:, fix:, docs:, refactor:, chore:.
- One concern per commit; keep diffs reviewable.

## 2. Definition of done (every PR)
- [ ] npm run lint exits 0
- [ ] npm run build exits 0
- [ ] No secrets committed (.env.local never staged; CI uses repo secrets)
- [ ] docs/PROGRESS.md updated: item moved, % bumped, date + commit hash in History
- [ ] UI changes include a screenshot or recording in the PR description
- [ ] Graceful degradation: every browser-API feature (mic, clipboard, audio) has a fallback that never dead-ends the user

## 3. CI/CD pipeline
- .github/workflows/ci.yml runs on every PR to main: npm ci, then lint, then build.
- Red CI blocks merge. Fix forward on the branch; never force-push main.
- Deploy: merge to main triggers Vercel preview/prod auto-deploy (Milestone 4 wires this). Rollback means revert commit, never history rewrite.

## 4. Production code standards (teaching notes)
- Own every resource lifecycle: streams, recorders, timers, object URLs, listeners. Acquire in handlers/effects, release in cleanup. A mic LED left on after navigation is a P0 privacy bug.
- Specific errors, not generic catches: NotAllowedError (permission denied) vs NotFoundError (no device) get different UX copy.
- Feature-detect before use: navigator.mediaDevices?.getUserMedia, typeof MediaRecorder.
- State machines over booleans: idle | requesting | recording | recorded | error beats three flags and prevents impossible states.
- Keep useApp.js the single state owner; components stay small and focused (player/, studio/, chrome/).

## 5. PR description template
- What / Why (plain language) / How tested (lint+build output) / Screenshots / PROGRESS.md delta.
