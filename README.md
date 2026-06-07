# TermSheet — Real Estate Deal Manager

[![CI](https://github.com/clefern/keepers-termsheet/actions/workflows/ci.yml/badge.svg)](https://github.com/clefern/keepers-termsheet/actions/workflows/ci.yml)

A small Angular 17 application to manage real estate deals (list, create, filter) behind an
authenticated area. Built as a take-home challenge with a focus on idiomatic Angular,
state management with RxJS, testing with Jest and an accessible, branded UI.

> 🔗 **Live demo:** https://clefern.github.io/keepers-termsheet/ — sign in with **admin** / **password**

## Tech stack

- **Angular 17** (standalone components, OnPush)
- **RxJS** `BehaviorSubject` store + `async` pipe
- **HttpClient** against a mock REST backend (`angular-in-memory-web-api`)
- **SCSS** design tokens, **Angular CDK** for accessibility
- **Jest** unit tests, **ESLint** + **Prettier**

## Getting started

```bash
npm ci
npm start          # dev server at http://localhost:4200
```

## Scripts

| Script | Description |
| --- | --- |
| `npm start` | Run the dev server |
| `npm run build` | Production build |
| `npm test` | Run unit tests (Jest) |
| `npm run test:cov` | Unit tests with coverage |
| `npm run lint` | Lint TypeScript and templates |
| `npm run format` | Format with Prettier |

## Domain

A **deal** has a name, address, purchase price and NOI (net operating income).
The **cap rate** is derived as `NOI / purchase price` and shown as a percentage
(a realistic range is 5%–12%).

---

_Architecture notes and decisions live in [`DECISIONS.md`](./DECISIONS.md)._
