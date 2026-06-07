# TermSheet — Real Estate Deal Manager

[![CI](https://github.com/clefern/keepers-termsheet/actions/workflows/ci.yml/badge.svg)](https://github.com/clefern/keepers-termsheet/actions/workflows/ci.yml)

An Angular 17 app to manage real estate deals — list, create and filter deals behind an
authenticated area, with the cap rate calculated automatically. Built as a take-home challenge
with a focus on idiomatic Angular, RxJS state management, testing and an accessible, branded UI.

> 🔗 **Live demo:** https://clefern.github.io/keepers-termsheet/ — sign in with **admin** / **password**

## Features

- 🔐 **Authentication** — login required to reach the private deals area; the session survives a
  refresh (persisted in `localStorage`).
- 📋 **Deals list** — accessible, branded table with currency formatting and the derived cap rate;
  loading, error (with retry) and empty states.
- ➕ **Create deals** — validated reactive form with a **live cap rate** that updates as you type
  and warns when it leaves the realistic 5%–12% range.
- 🔎 **Filtering** — by name and by purchase price (min / max), with the **matched term
  highlighted** in the table (bonus).

## Tech stack

- **Angular 17** — standalone components, `OnPush` change detection, functional guards/interceptors
- **RxJS** — `BehaviorSubject` store with derived streams, consumed via the `async` pipe
- **HttpClient** against a mock REST backend (`angular-in-memory-web-api`)
- **SCSS** design tokens + **Angular CDK**; **Jest** unit tests; **ESLint** + **Prettier**
- **GitHub Actions** — CI (format, lint, test, build) and GitHub Pages deploy

## Architecture

```
src/app/
├── core/
│   ├── models/     Deal, NewDeal, DealFilters, User, capRate()
│   ├── data/       in-memory REST backend + seeded deals (5%–12% cap rates)
│   ├── auth/       AuthService (BehaviorSubject), functional guard + interceptor
│   └── deals/      DealApiService (HttpClient), DealStore (state + filtering)
├── features/
│   ├── auth/login/         reactive login form
│   └── deals/              deal-list, deal-form, deal-filters
└── shared/
    ├── layout/app-shell/   branded chrome (top bar, sign out)
    └── pipes/              capRate, highlight
```

**Key patterns:** a single `BehaviorSubject` store is the source of truth; the list composes a
`combineLatest` view-model so the template subscribes once with `async` (no manual subscriptions);
`filteredDeals$` derives the visible list reactively; components are `OnPush`; routes are lazy and
guarded. See [`DECISIONS.md`](./DECISIONS.md) for the rationale and trade-offs.

## Getting started

```bash
npm ci
npm start          # dev server at http://localhost:4200
```

Sign in with **admin** / **password**.

## Scripts

| Script | Description |
| --- | --- |
| `npm start` | Run the dev server |
| `npm run build` | Production build |
| `npm test` | Run unit tests (Jest) |
| `npm run test:cov` | Unit tests with coverage |
| `npm run lint` | Lint TypeScript and templates |
| `npm run format` | Format with Prettier |

## Testing

Jest with coverage thresholds enforced in CI (`npm run test:cov`). Specs cover the store and
filtering, the API client, the auth service/guard/interceptor, the pipes and every component
(states, validation, live cap rate, highlighting).

## Accessibility

Semantic table with a scoped caption, associated form labels, `aria-invalid` and inline errors,
`role="status"` / `role="alert"` live regions, `role="search"` filters, visible `:focus-visible`
rings, `prefers-reduced-motion` support, and brand colors adjusted to meet WCAG AA contrast.

## Domain

A **deal** has a name, address, purchase price and NOI (net operating income). The **cap rate** is
derived as `NOI / purchase price` and shown as a percentage; a realistic range is 5%–12%.

## What I'd do next

Edit/delete deals against a real API, Playwright E2E for the core flow, URL-persisted filters, and
a virtualized table once the dataset justifies it.
