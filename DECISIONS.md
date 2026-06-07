# Technical decisions

Short rationale for the choices that shaped this take-home. The goal was idiomatic, readable
Angular that I can defend in review — not the largest possible feature set.

## Framework & structure

- **Angular 17 (pinned).** The brief asks for Angular 17, so I stayed on it deliberately. In a
  production app I'd track the current major.
- **Standalone components + `OnPush` everywhere.** No `NgModule`s; change detection is push-based
  with `async`-pipe-driven templates, which keeps renders cheap and state flow explicit.
- **Layered folders** — `core/` (models, data, auth, deal services), `features/` (auth, deals),
  `shared/` (pipes, layout). Path aliases (`@core`, `@features`, `@shared`) keep imports flat.

## State management

- **`BehaviorSubject` store (`DealStore`).** The brief explicitly values BehaviorSubjects, pipes
  and clear state management. State lives in subjects; components read **read-only observables**
  and never subscribe manually — they use the `async` pipe (the list builds a single
  `combineLatest` view-model so it subscribes once).
- **Derived filtering.** `filteredDeals$` is `combineLatest(deals, filters)` mapped through a pure
  filter function, so filtering is reactive and components stay dumb.
- **Signals for local UI state.** Component-local concerns (submitting flag, live cap-rate preview)
  use signals/`computed` — the right tool for synchronous view state, complementing the RxJS store.

## Data layer

- **Mock REST backend (`angular-in-memory-web-api`) over a real `HttpClient`.** Rather than return
  arrays directly, the app performs real `GET`/`POST api/deals` requests. This exercises the same
  HTTP code path a real backend would (interceptor, error handling) — the job calls out
  "ensure front-end code can query APIs".

## Testing

- **Jest** (over Karma/Jasmine) — it's in the job's required stack, faster, and the default for
  most modern Angular teams. Coverage thresholds are enforced in CI so coverage can't silently rot.

## Auth

- **Mock `AuthService`** validating a demo account, with the session persisted in `localStorage`
  (a refresh keeps you signed in). A **functional guard** protects `/deals*` and a **functional
  interceptor** attaches the bearer token — the modern, tree-shakable Angular 17 APIs.

## UI & accessibility

- **Custom SCSS + design tokens, no component library.** A UI kit would hide the CSS/Angular depth
  this challenge is meant to assess; tokens (`--kp-*`) keep the brand consistent and themeable.
- **Accessible brand colors.** The bright Keepers gradient (`#00d084 → #0693e3`) fails WCAG AA with
  white text (light green ≈ 2:1). Text-bearing surfaces use a **darker gradient**
  (`#00875a → #055a9e`, ≥ 4.6:1) and a **darker action blue** (`#0a66c2`, ≈ 5.7:1). Brand hues are
  preserved; the bright tones remain as accents.
- **Semantic table, not virtual scroll.** The dataset is small, so an accessible `<table>` with
  `OnPush` + `track` is the right call. Virtualizing it would be premature optimization. The scale
  path, if the list grew to thousands of rows, is a role-based grid inside
  `cdk-virtual-scroll-viewport` — kept out of scope on purpose.
- Visible `:focus-visible` rings, `prefers-reduced-motion` support, `role="status"`/`role="alert"`
  live regions, `role="search"` filters, scoped table headers and an `sr-only` caption.

## Delivery

- **GitHub Pages** via GitHub Actions (production build with project base href + SPA `404.html`
  fallback). CI runs format, lint, test-with-coverage and build on every PR; `main` is protected.

## What I'd do next with more time

- Edit/delete deals and server-side validation against a real API.
- E2E smoke tests (Playwright) for the login → create → filter flow.
- Persisted, shareable filters via the URL query string.
- Virtualized table + pagination once the dataset justifies it.
