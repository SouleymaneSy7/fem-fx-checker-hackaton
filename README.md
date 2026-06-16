# FX Checker — Foreign Exchange Currency Converter (Starter)

![Design preview for the FX Checker coding challenge](./public/preview.jpg)

> **FM30 Hackathon** · Frontend Mentor · June–July 2025

**FX Checker** is a currency converter built for the [Frontend Mentor FM30 Hackathon](https://www.frontendmentor.io/challenges/foreign-exchange-currency-converter). It pulls live exchange rates from the European Central Bank via the Frankfurter API — no key, no rate limits — and packages them into a full-featured converter with charts, multi-currency comparison, pinned favorites, and a conversion log.

**Live demo:** _link coming at deployment_  
**Solution page:** _link coming at submission_

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Known Limitations](#known-limitations)
- [Stretch Goals](#stretch-goals)
- [Deployment](#deployment)
- [Author](#author)

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

## Tech Stack

| Layer         | Choice                                          |
| ------------- | ----------------------------------------------- |
| Framework     | Next.js 16 (App Router) + React 19              |
| Language      | TypeScript                                      |
| Styling       | Tailwind CSS v4                                 |
| UI primitives | shadcn/ui (Radix-based)                         |
| State         | Zustand with `persist` middleware               |
| Data fetching | SWR — caching, deduplication, auto-revalidation |
| Charts        | Recharts                                        |
| Animation     | Framer Motion + GSAP                            |
| Validation    | Zod                                             |
| Icons         | Lucide React                                    |
| Linting       | Biome                                           |
| Font          | JetBrains Mono                                  |

---

## API Reference

All exchange rates come from [**Frankfurter**](https://frankfurter.dev/) — free, CORS-enabled, backed by the ECB.

| Endpoint                                      | Used for                      |
| --------------------------------------------- | ----------------------------- |
| `GET /v2/currencies`                          | Currency picker list          |
| `GET /v2/latest?base=USD`                     | Converter, ticker, comparison |
| `GET /v2/latest?base=USD&symbols=EUR`         | Single-pair lookup            |
| `GET /v2/{start}..{end}?base=USD&symbols=EUR` | Rate history chart            |

The base URL is set via environment variable:

```
NEXT_PUBLIC_EXCHANGE_API_BASE=https://api.frankfurter.dev/
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
fx-checker-hackaton/
├── public/                   # Static assets (flags, SVGs)
├── src/
│   ├── app/
│   │   ├── globals.css       # CSS variables, global resets
│   │   ├── layout.tsx        # Root layout — providers, font, metadata
│   │   └── page.tsx          # Main page (tabs: Converter / Markets / Compare / Favorites)
│   ├── components/
│   │   ├── ui/               # shadcn/ui primitives
│   ├── hooks/                # useCurrencies, useRates, useRateHistory, ...
│   ├── lib/
│   │   └── utils.ts            # cn helper (clsx + tailwind-merge)
│   ├── store/                # Zustand slices: favorites, log, ui
│   └── types/                # TypeScript interfaces for API + store
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Known Limitations

**No intraday data from Frankfurter.** The ECB publishes rates once per business day. The 1D range on the history chart therefore shows a single data point rather than an intraday curve. All other ranges (1W and above) work as expected. Switching to a paid API with intraday tick data would resolve this.

---

## Stretch Goals

A few ideas that didn't make the submission deadline:

- Light theme toggle
- Persistent URL for shareable conversions (`/convert?from=USD&to=EUR&amount=100`)
- Keyboard shortcuts (focus search, swap, change chart range)
- CSV export of the conversion log
- Crosshair on the rate chart showing exact date and rate on hover
- Offline fallback — cache last successful rates and show an out-of-date banner
- Full-stack version with accounts so favorites and log sync across devices

---

## Deployment

Deployed on [Vercel](https://vercel.com/) — zero config for Next.js. Add `NEXT_PUBLIC_EXCHANGE_API_BASE` in your project's environment variables and push.

---

## Author

_**Souleymane Sy**_

- **Portfolio**: [terminal-portfolio-website](https://terminal-portfolio-website-xi.vercel.app/)
- **GitHub**: [@SouleymaneSy7](https://github.com/SouleymaneSy7)
- **Frontend Mentor**: [@SouleymaneSy7](https://www.frontendmentor.io/profile/SouleymaneSy7)
- **LinkedIn**: [souleymanesy7](https://linkedin.com/in/souleymanesy7)
- **Twitter / X**: [@SouleymaneSy43](https://twitter.com/Souleymanesy43)
