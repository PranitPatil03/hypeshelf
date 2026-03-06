# Architecture

This document covers HypeShelf's system architecture, data flow patterns, and the relationships between all services.

---

## System Overview

HypeShelf is a three-tier application:

1. **Browser (Next.js 16)** — renders the UI, handles client-side validation, manages real-time subscriptions
2. **Convex Backend** — stores data, enforces authorization, validates inputs, pushes real-time updates
3. **External Services** — Clerk (auth), TMDB (movie data), DiceBear (avatars)

Communication uses **WebSocket** (Convex real-time) and **HTTPS** (Clerk auth, TMDB API, DiceBear CDN). There are no REST endpoints.

---

## Architecture Diagram

![Architecture Diagram](./image.png)

---

## Data Flow Patterns

### 1. User Sign-In Flow

```
User clicks "Sign In"
  → Clerk sign-in page (/sign-in) renders custom UI
  → User enters email/password or clicks Google/X OAuth
  → Clerk issues JWT token
  → ConvexClientProvider detects auth change
  → Calls users.store mutation automatically
  → Convex verifies JWT via Clerk JWKS
  → Checks email against ADMIN_EMAILS env var
  → Upserts user record with role (admin or user)
  → User redirected to /shelf
```

### 2. Add Recommendation Flow

```
User clicks "+ add your recs" button
  → AddRecModal opens (step 1: movie search)
  → User types movie name
  → Server Action (tmdb.ts) calls TMDB API with 'use server'
  → Returns top 5 results (title, poster, genre, year)
  → User selects a movie → form pre-filled (step 2)
  → User writes blurb, sets star rating (0.5 precision)
  → Zod validates all fields client-side (instant feedback)
  → On submit: recommendations.create mutation called
  → Convex independently validates all 6 fields server-side
  → isSafeUrl() checks link and posterUrl for XSS
  → Genre checked against ALLOWED_GENRES allowlist
  → Record inserted with userId from JWT (not from args)
  → All connected clients receive the new rec via WebSocket
```

### 3. Edit Recommendation Flow

```
User/Admin clicks ⋮ menu on a RecCard → "Edit"
  → Edit dialog opens with current values pre-filled
  → User modifies fields (title, genre, blurb, rating, etc.)
  → Zod validates client-side
  → On submit: recommendations.update mutation called
  → Convex verifies: auth + ownership (or admin role)
  → Same 6-field validation as create
  → Record patched (only changed fields)
  → All clients update in real-time
```

### 4. Infinite Scroll Flow

```
RecGrid mounts
  → usePaginatedQuery subscribes to recommendations.getAll
  → Convex pushes first page (50 items) via WebSocket
  → User scrolls down
  → IntersectionObserver (useIsInView hook) fires
  → loadMore(25) called → next cursor page requested
  → Convex pushes next 25 items
  → Repeat until isDone === true
```

### 5. Staff Pick Toggle Flow

```
Admin clicks ⋮ menu on any RecCard → "Staff Pick"
  → recommendations.toggleStaffPick mutation called
  → Convex verifies: auth + admin role check
  → isStaffPick boolean toggled
  → All clients see the badge appear/disappear in real-time
```

### 6. Delete Recommendation Flow

```
User/Admin clicks ⋮ menu → "Delete"
  → Confirmation dialog appears
  → On confirm: recommendations.remove mutation called
  → Convex verifies: auth + ownership check (or admin role)
  → Record deleted
  → All clients see the card disappear in real-time
```

---

## Real-Time Architecture

HypeShelf uses Convex's built-in real-time subscription model:

| Aspect | Implementation |
|---|---|
| **Protocol** | WSS (WebSocket Secure) |
| **Subscription** | `usePaginatedQuery` / `useQuery` from `convex/react` |
| **Push model** | Server pushes updated results when underlying data changes |
| **No polling** | Zero polling intervals — pure push-based reactivity |
| **Consistency** | Convex guarantees serializable transactions |

When any mutation (create, update, remove, toggleStaffPick) modifies the `recommendations` table, every client with an active `usePaginatedQuery` subscription receives the updated result set automatically.

---

## Service Dependencies

```
HypeShelf
├── Convex (required) — all data storage, real-time, server functions
├── Clerk (required) — authentication, JWT tokens, OAuth providers
├── TMDB (optional) — movie search auto-fill (manual entry fallback exists)
└── DiceBear (optional) — avatar generation (Clerk profile image fallback)
```

| Service | If Down | Fallback |
|---|---|---|
| Convex | App non-functional | None — Convex is the data layer |
| Clerk | Can't sign in/out | Existing sessions remain valid until JWT expires |
| TMDB | Movie search fails | "Can't find it? Add manually" button in AddRecModal |
| DiceBear | Avatar returns 404 | Broken image — Clerk profile image used if available |
