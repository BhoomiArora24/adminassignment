# Admin Dashboard (Next.js + MUI + Zustand + DummyJSON)

Users and products admin using Next.js 14 (App Router), MUI v6, Zustand, and Auth.js (next-auth v4) Credentials against DummyJSON.

## Setup
```bash
npm install
cp .env.example .env.local   # set NEXTAUTH_SECRET: openssl rand -base64 32
npm run dev                  # http://localhost:3000
npm run lint && npm run build && npm start
```
Test login: `emilys` / `emilyspass` (official DummyJSON test account).

## Authentication
`lib/auth.js` (server only) POSTs to `https://dummyjson.com/auth/login`; the session is created only on success. The access token is stored in the encrypted JWT cookie and exposed to the session; the refresh token is dropped. `AuthSync` (in `DashboardShell`) mirrors the session into `authStore` (memory only). Protection: `middleware.js` plus a server-side `getServerSession` check in `app/dashboard/layout.js`. Logout clears the store and calls `signOut`. Refresh keeps the session via the cookie.

## API endpoints
`/auth/login`, `/users`, `/users/search`, `/users/{id}`, `/products`, `/products/search`, `/products/category-list`, `/products/category/{c}`, `/products/{id}`.

## Zustand architecture
`authStore` (session mirror), `usersStore`, `productsStore` (items, total, query, page, loading/error, cache, async actions). Zustand: tiny API, no providers, plain async actions, selector subscriptions, less boilerplate than Redux for an app of this size.

## Caching
In-memory per-store cache keyed `query|limit|skip` (users) and `query|category|limit|skip` (products), 60 s TTL (`CACHE_TTL_MS` in `lib/api.js`). Errors are never cached; stale responses from superseded requests are ignored; identical in-flight requests are deduped; the Retry button forces a refetch. Detail records are cached the same way.

## Performance
API pagination (10/page), 350 ms debounced search, `React.memo` on table rows and product cards, store selectors, lazy-loaded images, skeletons.

## Known limitations
- Search and category are mutually exclusive (DummyJSON cannot combine them); picking one clears the other.
- Product image gallery uses plain `<img>` (no `next/image` remote config).
- No automated tests; the dashboard overview shows totals only (no recently viewed list).
- DummyJSON tokens are short-lived (60 min); the session expires with them.

## Publish
```bash
git init && git add . && git commit -m "Admin dashboard"
gh repo create admin-dashboard --public --source=. --push
```
