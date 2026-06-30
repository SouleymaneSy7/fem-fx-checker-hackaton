# FX Checker — Foreign Exchange Currency Converter

> **Starter README** — This file will be updated as the project progresses. The status table below tracks what's done and what's still ahead. Live demo and solution page links will be added before July 13.

![Design preview for the FX Checker coding challenge](./public/preview.jpg)

**FM30 Hackathon** · Frontend Mentor · June 12 – July 13, 2026

**FX Checker** is a currency converter built for the [Frontend Mentor FM30 Hackathon](https://www.frontendmentor.io/challenges/foreign-exchange-currency-converter). It pulls live rates from the European Central Bank via the Frankfurter API — no key, no rate limits — and presents them through a converter, historical charts, multi-currency comparison, pinned favorites, and a conversion log.

**Live demo:** [https://fem-fx-checker-hackaton.vercel.app/](https://fem-fx-checker-hackaton.vercel.app/)

**Solution page:** _coming at submission_

**WakaTime (coding time):** [![wakatime](https://wakatime.com/badge/user/018cb534-87bb-4814-975b-ca5e3cb8572b/project/3744af2b-53c9-404d-b9c4-ac6165f9e277.svg)](https://wakatime.com/badge/user/018cb534-87bb-4814-975b-ca5e3cb8572b/project/3744af2b-53c9-404d-b9c4-ac6165f9e277)

---

## Table of Contents

- [Project Status](#project-status)
- [Features](#features)
- [Design System](#design-system)
- [Tech Stack](#tech-stack)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Known Limitations](#known-limitations)
- [Judging Criteria](#judging-criteria)
- [Stretch Goals](#stretch-goals)
- [Deployment](#deployment)
- [Author](#author)

---

## Project Status

Six phases between now and **July 13, 2026 at 14:00 BST**. Results on July 16. Commit history tracks progress in more detail than this table does.

| Phase                       | Scope                                                                   | Status      |
| --------------------------- | ----------------------------------------------------------------------- | ----------- |
| 1 — Scaffolding             | Repo setup, routing, design tokens, Zustand slices, SWR wrappers        | In progress |
| 2 — Converter               | Currency picker, amount input, swap, live rate display                  | Planned     |
| 3 — Markets & History       | Ticker, rate chart, time-range selector                                 | Planned     |
| 4 — Compare, Favorites, Log | Compare table, pin system, conversion log, localStorage persistence     | Planned     |
| 5 — Polish                  | Animations (GSAP + Framer Motion), responsive pass, accessibility audit | Planned     |
| 6 — Deploy                  | Vercel deployment, final README update, hackathon submission            | Planned     |

_Last updated: June 2026 — Phase 1_

---

## Features

### Converter

- Type an amount and see the converted value update in real time (300ms debounce)
- Pick currencies from a searchable picker — flag, code, name — grouped into _Popular_ and _Other_
- Swap send/receive currencies in one click
- Live rate displayed for the active pair (e.g. `1 USD = 0.8530 EUR`)
- Log a conversion or pin the active pair directly from the converter

### Live Markets

- Scrolling ticker showing current rates and 24h change for a set of pairs
- Rate history chart for the active pair with range selector: 1D / 1W / 1M / 3M / 1Y / 5Y
- Open, last, absolute change, and percentage change shown per selected range

### Compare

- Convert a send amount into multiple currencies at once, side by side
- Pin or unpin any row directly from the comparison table

### Favorites

- Pinned pairs with live rates and 24h change
- Click any row to load that pair into the converter
- Persisted in `localStorage` (with `try/catch` on every read/write)

### Conversion Log

- Auto-logged on each conversion: relative time, pair, send and receive amounts
- Delete individual entries or clear the full log
- Capped at 100 entries (FIFO)
- Persisted in `localStorage`

### Accessibility

- Fully responsive: mobile → tablet → desktop
- Keyboard-navigable throughout
- Visible focus and hover states on every interactive element
- Empty states for favorites, log, comparison, and chart errors — no silent blank panels

---

## Design System

Dark theme. One font. Two accent colors. The token list below is what goes into `globals.css` — it's the reference if something looks off.

### Colors

```css
/* Neutrals */
--neutral-900: oklch(0.1448 0 0);   /* page background */
--neutral-700: oklch(0.2055 0.0039 286.05);
--neutral-600: oklch(0.2443 0.0038 286.12);
--neutral-500: oklch(0.3012 0 0);
--neutral-400: oklch(0.36 0 0);
--neutral-300: oklch(0.3911 0.0033 286.24);
--neutral-200: oklch(0.696 0 0);
--neutral-100: oklch(0.8266 0 0);
--neutral-50:  oklch(1 0 0);   /* primary text */

/* Accent */
--lime-500: oklch(0.9157 0.2054 121.64);      /* primary accent */
--lime-800: oklch(0.3 0.0726 121.83);      /* accent backgrounds, hover states */

/* Semantic */
--green-500: oklch(0.8217 0.267 140.6);     /* positive change */
--red-500:   oklch(0.6607 0.2258 25.95);     /* negative change */
```

### Typography

Single font: **JetBrains Mono** (weights: 400 / 500 / 700).

| Preset        | Size | Line height | Letter spacing | Weight  |
| ------------- | ---- | ----------- | -------------- | ------- |
| Preset 1      | 40px | 100%        | -0.5px         | Bold    |
| Preset 1 Tab  | 32px | 100%        | -0.5px         | Bold    |
| Preset 2      | 20px | 120%        | -0.5px         | Regular |
| Preset 2 Bold | 20px | 140%        | -0.5px         | Bold    |
| Preset 3      | 16px | 120%        | 1px            | Regular |
| Preset 3 Med  | 16px | 120%        | 1px            | Medium  |
| Preset 3 Bold | 16px | 110%        | 1px            | Bold    |
| Preset 4      | 14px | 120%        | 1px            | Regular |
| Preset 5      | 12px | 120%        | 0.5px          | Regular |
| Preset 5 Med  | 12px | 130%        | 0.5px          | Medium  |
| Preset 6      | 10px | 100%        | 0px            | Regular |

### Spacing

| Token       | Value | Token        | Value |
| ----------- | ----- | ------------ | ----- |
| spacing-025 | 2px   | spacing-600  | 48px  |
| spacing-050 | 4px   | spacing-800  | 64px  |
| spacing-075 | 6px   | spacing-1000 | 80px  |
| spacing-100 | 8px   | spacing-1200 | 96px  |
| spacing-125 | 10px  | spacing-1400 | 112px |
| spacing-150 | 12px  | spacing-1600 | 128px |
| spacing-200 | 16px  | spacing-1800 | 140px |
| spacing-250 | 20px  |              |       |
| spacing-300 | 24px  |              |       |
| spacing-400 | 32px  |              |       |
| spacing-500 | 40px  |              |       |

### Border Radius

| Token       | Value |
| ----------- | ----- |
| radius-0    | 0px   |
| radius-4    | 4px   |
| radius-6    | 6px   |
| radius-8    | 8px   |
| radius-10   | 10px  |
| radius-12   | 12px  |
| radius-16   | 16px  |
| radius-20   | 20px  |
| radius-24   | 24px  |
| radius-full | 999px |

---

## Tech Stack

| Layer         | Choice                                          |
| ------------- | ----------------------------------------------- |
| Framework     | Next.js 16 (App Router) + React 19              |
| Language      | TypeScript                                      |
| Styling       | Tailwind CSS v4                                 |
| UI primitives | shadcn/ui (Radix-based)                         |
| State         | Zustand with `persist` middleware               |
| Data fetching | SWR — caching, deduplication, auto-revalidation |
| HTTP client   | Axios                                           |
| Charts        | Recharts                                        |
| Animation     | Framer Motion + GSAP                            |
| Validation    | Zod                                             |
| Icons         | Lucide React                                    |
| Linting       | Biome                                           |
| Font          | JetBrains Mono                                  |

---

## API Reference

All exchange rates come from [**Frankfurter**](https://frankfurter.dev/) — free, CORS-enabled, no API key required, rates blended across 84 central banks for 201 currencies.

| Endpoint                                         | Used for                |
| ------------------------------------------------ | ----------------------- |
| `GET /currencies`                                | Currency picker list    |
| `GET /rate/{base}/{quote}`                       | Converter (single pair) |
| `GET /rates?base=USD&quotes=EUR,GBP`             | Ticker, comparison      |
| `GET /rates?base=USD&quotes=EUR&from=...&to=...` | Rate history chart      |

There's no separate "latest" or date-range path — one `/rates` endpoint covers the latest rate, a specific date (`date=`), and a time series (`from`/`to`), differentiated by query params. `quotes` is the equivalent of what other FX APIs call `symbols`.

The base URL (already includes `/v2`) is set via environment variable:

```
NEXT_PUBLIC_EXCHANGE_API_BASE=https://api.frankfurter.dev/v2
```

---

## Getting Started

```bash
git clone https://github.com/SouleymaneSy7/fx-checker-hackaton.git
cd fx-checker-hackaton

bun install       # or npm i / yarn / pnpm i
bun dev           # or npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The `.env.local` file already contains the API base URL. No other variables are needed.

```bash
bun run lint      # biome check
bun run format    # biome format --write
```

---

## Folder Structure

```
src/
├── app/ # Next.js App Router Configuration
│ ├── layout.tsx # Root layout (metadata, providers, etc.)
│ └── page.tsx # Main home page
│
├── style/ # Global project styles
│ └── globals.css # Global CSS + custom Tailwind variables
│
├── components/ # All React components
│ ├── ui/ # Shadcn/UI components (generated via CLI)
│ ├── layout/ # Layout components (Header, Footer, TabNav, etc.)
│ ├── shared/ # Components reused by 2+ features (ex: CurrencyPicker, RateDisplay)
│ ├── common/ # Very generic reusable components (not related to FX business)
│ └── features/ # Components organized by business feature
│  ├── converter/ # Everything related to the converter
│  ├── markets/ # Ticker, chart, etc.
│  ├── compare/ # Multi-currency comparison
│  ├── favorites/ # Favorite pairs management
│  └── log/ # Conversion history
│
├── hooks/ # Custom React hooks
│
├── services/ # Business logic and API calls
│
├── store/ # Zustand stores (global state)
│
├── utils/ # Pure utilities (formatting, helpers, constants)
│
└── types/ # Centralized TypeScript declarations
```

> This is the starter scaffold. The `components/` tree will grow as features get built.

### Detailed explanations of the folders structure

- **`app/`** → Next.js App Router configuration and routes.
- **`style/`** → Global styles and CSS variables (colors, typography, spacing).
- **`components/ui/`** → Low-level UI components generated by Shadcn.
- **`components/layout/`** → Global interface structure elements.
- **`components/shared/`** → Components shared across multiple features.
- **`components/common/`** → Very generic components (not related to FX business).
- **`components/features/`** → Organization by feature (one feature = one subfolder).
- **`hooks/`** → All custom hooks.
- **`services/`** → API layer and business logic.
- **`store/`** → Zustand stores for persistent state.
- **`utils/`** → Pure utility functions.
- **`types/`** → Project TypeScript interfaces and types.

---

## Known Limitations

**No intraday data from Frankfurter.** Most providers behind the API publish rates once per business day. The 1D chart range shows a single data point, not an intraday curve. Every other range (1W and above) works fine. Fixing it would require a paid API with tick data — out of scope for this hackathon.

---

## Judging Criteria

The FM30 panel evaluates submissions on five points:

- **Code quality** — typed, readable, no shortcuts that will bite later
- **Requirements** — core features covered, edge cases handled, accessibility solid
- **README** — clear, honest, actually useful to someone cloning the repo
- **Commit history** — progression is visible, commits say something
- **Live demo + public repo** — both accessible at submission time

---

## Stretch Goals

Things I'd like to add if the core features land early enough before July 13:

- Light theme toggle
- URL persistence for shareable conversions (`/convert?from=USD&to=EUR&amount=100`)
- Keyboard shortcuts (focus search, swap currencies, switch chart range)
- CSV export of the conversion log
- Crosshair on the rate chart showing exact date and rate on hover
- Offline fallback — cache last successful rates, show a stale-data banner when the API is down
- Full-stack version with accounts so favorites and log sync across devices

---

## Deployment

Deployed on [Vercel](https://vercel.com/) — the Next.js config is picked up without extra setup. Add `NEXT_PUBLIC_EXCHANGE_API_BASE` and `NEXT_PUBLIC_RATE_REFRESH_INTERVAL` in the project's environment variables and push.

**Live URL:** [https://fem-fx-checker-hackaton.vercel.app/](https://fem-fx-checker-hackaton.vercel.app/)

---

## Author

_**Souleymane Sy**_

- **Portfolio**: [terminal-portfolio-website](https://terminal-portfolio-website-xi.vercel.app/)
- **GitHub**: [@SouleymaneSy7](https://github.com/SouleymaneSy7)
- **Frontend Mentor**: [@SouleymaneSy7](https://www.frontendmentor.io/profile/SouleymaneSy7)
- **LinkedIn**: [souleymanesy7](https://linkedin.com/in/souleymanesy7)
- **Twitter / X**: [@SouleymaneSy43](https://twitter.com/Souleymanesy43)
