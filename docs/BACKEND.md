# Backend & Database

HypeShelf uses [Convex](https://convex.dev) as a real-time Backend-as-a-Service. All database tables, server functions, and real-time subscriptions are managed through Convex.

---

## Why Convex

| Concern | Traditional Stack | Convex |
|---|---|---|
| Real-time updates | Polling or WebSocket server | Built-in reactive subscriptions |
| API layer | REST/GraphQL + controllers | Type-safe query/mutation functions |
| Database | PostgreSQL + ORM (Prisma) | Integrated document DB with indexes |
| Pagination | Manual cursor logic | Native `paginationOptsValidator` |
| Auth integration | Custom JWT middleware | First-class Clerk JWT verification |
| Deployment | Separate DB + API hosting | Single `npx convex deploy` command |

**Trade-off:** Vendor lock-in to Convex. For a larger production app, a more portable stack (Prisma + PostgreSQL) may be warranted. For this project, Convex reduced development surface while delivering superior real-time UX.

---

## Database Schema

Defined in [`convex/schema.ts`](../convex/schema.ts).

### `recommendations` Table

| Field | Type | Description |
|---|---|---|
| `userId` | `string` | Clerk user ID of the author (from JWT `subject`) |
| `userName` | `string` | Display name at time of creation |
| `userAvatar` | `string` | Avatar URL — Clerk profile image or DiceBear fallback |
| `title` | `string` | Movie title (1–200 chars) |
| `genre` | `string` | One of 21 allowed genres (validated server-side) |
| `link` | `string` | External URL — TMDB, IMDB, etc. (http/https only) |
| `blurb` | `string` | User's review text (1–250 chars) |
| `hypeScore` | `number` | Rating 1–10 (displayed as 0.5–5 stars in the UI) |
| `isStaffPick` | `boolean` | Whether an admin has curated this recommendation |
| `posterUrl` | `string` | TMDB poster image URL |

**Indexes:**

| Index | Field(s) | Used By |
|---|---|---|
| `by_genre` | `genre` | Genre filter tabs on `/shelf` and `/` |
| `by_userId` | `userId` | "My Recs" view — shows only the current user's recs |
| `by_staffPick` | `isStaffPick` | "Staff Picks" filter tab |

### `users` Table

| Field | Type | Description |
|---|---|---|
| `clerkId` | `string` | Clerk user ID (from JWT `subject`) |
| `role` | `"user" \| "admin"` | Role — determined by `ADMIN_EMAILS` env var |
| `name` | `string` | Full name synced from Clerk |
| `email` | `string` | Primary email synced from Clerk |

**Indexes:**

| Index | Field(s) | Used By |
|---|---|---|
| `by_clerkId` | `clerkId` | User lookup on every authenticated operation |

---

## Allowed Genres (21 total)

Enforced on both client ([`lib/validation.ts`](../lib/validation.ts)) and server ([`convex/recommendations.ts`](../convex/recommendations.ts)):

**Primary (shown in UI filter bar):** Action, Comedy, Sci-Fi, Horror, Thriller, Drama, Romance

**Extended (from TMDB mapping):** Other, Adventure, Animation, Crime, Documentary, Family, Fantasy, History, Music, Mystery, Science Fiction, TV Movie, War, Western

Any genre value not in this list is rejected by the `create` mutation with `"Invalid genre"`.

---

## Server Functions

All server logic lives in two files:

### [`convex/recommendations.ts`](../convex/recommendations.ts)

| Function | Type | Auth Required | Description |
|---|---|---|---|
| `getAll` | Query (paginated) | No | Fetches recommendations with cursor pagination. Accepts optional `genre`, `myRecs`, and `staffPicks` filters. Filters use database indexes for efficient queries. |
| `create` | Mutation | Yes | Creates a new recommendation. Validates all fields server-side (genre allowlist, URL sanitization, length limits, hypeScore range). Pulls `userId`, `userName`, `userAvatar` from the verified JWT + user record — never from client input. |
| `update` | Mutation | Yes | Updates an existing recommendation. Same 6-field validation as `create`. Ownership check: `rec.userId === identity.subject`. Admins bypass ownership check. Preserves `userId`, `userName`, `userAvatar`, `isStaffPick`. |
| `remove` | Mutation | Yes | Deletes a recommendation. Ownership check: `rec.userId === identity.subject`. Admins bypass ownership check via `user.role === "admin"`. |
| `toggleStaffPick` | Mutation | Yes (admin) | Toggles `isStaffPick` boolean. Only admins can call — non-admin callers get `"Only admins can toggle staff picks"` error. |

### [`convex/users.ts`](../convex/users.ts)

| Function | Type | Auth Required | Description |
|---|---|---|---|
| `store` | Mutation | Yes | Upserts user record on login. Checks email against `ADMIN_EMAILS` env var → assigns `"admin"` or `"user"` role. Updates name/email/role if changed. |
| `current` | Query | Yes | Returns the current user's Convex record by `clerkId`. Returns `null` if not authenticated. |

---

## Pagination

HypeShelf uses Convex's native cursor-based pagination:

1. `usePaginatedQuery` hook in `RecGrid` component requests initial batch of 50 items
2. An `IntersectionObserver` watches a sentinel div at the bottom of the grid
3. When the sentinel enters the viewport and `status === "CanLoadMore"`, `loadMore(25)` is called
4. Convex returns the next batch using an opaque cursor token — no offset counting, no skip/limit

This approach is:
- **Efficient** — no full-table scans, no duplicates from concurrent inserts
- **Real-time compatible** — new items added by other users appear at the top without breaking pagination
- **Framework-native** — zero custom pagination logic needed

---

## Real-Time Architecture

Convex maintains a persistent WebSocket connection between every open browser tab and the backend.

```
Client A adds a rec
  → Convex mutation creates document
  → Convex detects which queries are affected
  → Pushes updated results to ALL connected clients via WebSocket
  → Client B's RecGrid re-renders with the new card — no polling, no refresh
```

This means:
- Open two browser tabs — add a rec in one, it appears in the other instantly
- Admin toggles Staff Pick — the badge appears on all clients simultaneously
- User deletes a rec — it disappears from everyone's view immediately

---

## TMDB Integration

Movie search is powered by [TMDB API](https://www.themoviedb.org/documentation/api) via a Next.js Server Action in [`app/actions/tmdb.ts`](../app/actions/tmdb.ts).

**Why Server Action?** The TMDB API key stays entirely server-side. The `'use server'` directive ensures this function runs on the server only — the API key never appears in the client bundle.

**Flow:**
1. User types in the `MovieSearch` component (debounced 500ms)
2. Client calls `searchMovies(query)` — this is a Server Action, not an API route
3. Server fetches from `api.themoviedb.org/3/search/movie`
4. Server maps TMDB numeric genre IDs → human-readable genre names using a 19-entry lookup table
5. Returns top 5 results: `{ id, title, release_date, poster_path, genre }`
6. User selects a movie → title, poster, genre, and TMDB link auto-populate the form

**Genre ID Mapping (19 genres):**
```
28: Action, 12: Adventure, 16: Animation, 35: Comedy, 80: Crime,
99: Documentary, 18: Drama, 10751: Family, 14: Fantasy, 36: History,
27: Horror, 10402: Music, 9648: Mystery, 10749: Romance, 878: Sci-Fi,
10770: TV Movie, 53: Thriller, 10752: War, 37: Western
```

---

## Seed Data

HypeShelf ships with 220+ pre-built seed recommendations for testing and demo purposes. The seed script lives at [`scripts/seed.ts`](../scripts/seed.ts) and the seed mutation at [`convex/seed.ts`](../convex/seed.ts).

```bash
npx tsx scripts/seed.ts
```

This inserts recommendations across all 7 primary genres with realistic titles, blurbs, poster URLs, and hype scores.
