# Database Schema

HypeShelf uses [Convex](https://convex.dev) as its real-time backend. All data is defined in `convex/schema.ts` and accessed through type-safe query/mutation functions.

---

## Tables

### `recommendations`

Stores every movie recommendation on the platform.

| Field | Type | Required | Description |
|---|---|---|---|
| `userId` | `string` | Yes | Clerk user ID of the author |
| `userName` | `string` | Yes | Display name at time of creation |
| `userAvatar` | `string` | Yes | Avatar URL (DiceBear or Clerk) |
| `title` | `string` | Yes | Movie title |
| `genre` | `string` | Yes | One of the allowed genres (see below) |
| `link` | `string` | Yes | External URL (TMDB, IMDB, etc.) |
| `blurb` | `string` | Yes | User's review text |
| `hypeScore` | `number` | Yes | Rating from 1–10 (displayed as 0.5–5 stars) |
| `isStaffPick` | `boolean` | Yes | Whether an admin has highlighted this rec |
| `posterUrl` | `string` | No | TMDB poster URL |

**Indexes:**

| Index | Fields | Purpose |
|---|---|---|
| `by_genre` | `genre` | Filter recommendations by genre tab |
| `by_userId` | `userId` | "My Recs" view / per-user queries |
| `by_staffPick` | `isStaffPick` | Staff Picks filter tab |

### `users`

Synced from Clerk on each authenticated session.

| Field | Type | Required | Description |
|---|---|---|---|
| `clerkId` | `string` | Yes | Clerk user ID |
| `role` | `string` | Yes | `"admin"` or `"user"` |
| `name` | `string` | Yes | Full name from Clerk |
| `email` | `string` | Yes | Primary email from Clerk |

**Indexes:**

| Index | Fields | Purpose |
|---|---|---|
| `by_clerkId` | `clerkId` | Lookup user record by Clerk ID |

---

## Allowed Genres

Enforced in both the client (`lib/constants.ts`) and Convex mutations:

```
Action, Comedy, Sci-Fi, Horror, Thriller, Drama, Romance
```

Any value outside this list is rejected by the `create` mutation.

---

## Mutations & Queries

### `recommendations.getAll`

**Type:** Paginated query

```
Args: { genre?: string, userId?: string, staffPicks?: boolean, paginationOpts }
Returns: PaginationResult<Recommendation>
```

Fetches recommendations with cursor-based pagination. Filters are mutually exclusive priority: `userId` > `staffPicks` > `genre`.

### `recommendations.create`

**Type:** Mutation (authenticated)

```
Args: { title, genre, link, blurb, hypeScore, posterUrl? }
```

Creates a recommendation. Pulls `userId`, `userName`, and `userAvatar` from the authenticated user's Convex record. Sets `isStaffPick` to `false` by default.

### `recommendations.remove`

**Type:** Mutation (authenticated)

Deletes a recommendation. Only the author or an admin can delete.

### `recommendations.toggleStaffPick`

**Type:** Mutation (authenticated, admin only)

Toggles the `isStaffPick` boolean on a recommendation.

### `users.store`

**Type:** Mutation (authenticated)

Upserts the user record on login. If the user's email matches `ADMIN_EMAILS` env var, assigns `role: "admin"`. Called automatically by `ConvexSyncUser` in the client provider.

### `users.current`

**Type:** Query (authenticated)

Returns the current user's Convex record by Clerk ID.

---

## Data Flow

```
User action (e.g. add rec)
  → Zod validation (client)
  → Convex mutation (server)
    → Auth token verified (Clerk JWT)
    → Genre allowlist check
    → User record lookup
    → Document inserted
  → Real-time subscription pushes update to all connected clients
```

All Convex queries are reactive — when data changes, every client viewing that data receives updates instantly via WebSocket.
