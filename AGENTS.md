# AGENTS.md - RESUMETECH

## Commands

- `npm run dev` — Vite dev server on port 3000
- `npm run build` — Production build to `dist/`
- `npm run lint` — Oxlint (only linter available)
- **No typecheck, no test runner, no formatter** — do not attempt `npm test`, `npx tsc`, or `npx prettier`

## Architecture

- **Single-package SPA** (not a monorepo). All code lives in `src/`.
- **React 19 + Vite 5**, plain JSX (no TypeScript, no router library).
- Navigation is state-driven via `currentView` in `App.jsx` (`landing`, `auth`, `dashboard`, `builder`).
- All persistence is **localStorage** (`resumetech_session`, `resumetech_users`, `resumetech_scheme`).
- All "AI" features are **client-side simulations** (setTimeout + templates) — rebranding removed. No backend, no API keys.

## Key Files

| File | Role |
|---|---|
| `src/App.jsx` | Root component, routing state, theme/color, navbar/footer |
| `src/components/ResumeBuilder.jsx` | Core editor (1255 lines) — wizard, forms, text rewrite, templates, PDF export |
| `src/components/AiAssistant.jsx` | Floating chat widget — career advice, interview sim, job analysis (no AI branding) |
| `src/components/LandingPage.jsx` | Marketing page with ATS simulator |
| `src/components/Dashboard.jsx` | Resume list, user profile |
| `src/components/Auth.jsx` | Login/register (localStorage, plaintext passwords) |
| `src/index.css` | Design system: CSS custom properties, 4 color schemes, dark mode, animations |

## Conventions

- **Language**: All UI text is Brazilian Portuguese (`pt-BR`). Keep new strings in Portuguese.
- **Styling**: Each component has a co-located `.css` file. Design tokens live in `index.css` via `[data-color-scheme]` and `[data-theme]` selectors.
- **Icons**: `lucide-react` — check existing imports before adding new icon libraries.
- **PDF export**: Uses `html2pdf.js`. Print styles are in component CSS files via `@media print`.

## Deploy

- GitHub Pages via `.github/workflows/deploy.yml`
- Triggers on push to `main` or manual dispatch
- Vite `base` is set to `/Crurriculo-IA-pro/` — do not change unless you also update the workflow
- Node 20, `npm ci` → `npm run build` → uploads `dist/`

## Gotchas

- `dist/` is pre-built in the repo but is gitignored — build locally before testing deploy
- No test suite exists — verify changes manually with `npm run dev`
- ResumeBuilder.jsx is the largest file (1255 lines) — be careful with large refactors
- The app stores user passwords in plaintext in localStorage — this is a known limitation of the TCC project scope
