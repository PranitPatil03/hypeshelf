# API Reference

All HypeShelf backend functions are implemented as [Convex queries and mutations](https://docs.convex.dev/functions). They are called via WebSocket — not HTTP — which means real-time reactivity is automatic and CSRF is structurally impossible.

---

## Recommendations

### `recommendations.getAll` — Query

Fetches a paginated list of recommendations with optional filtering.

**Args:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `genre` | `string` | No | Filter by genre name (e.g., `"Action"`, `"Comedy"`). Pass `"All"` or omit for no filter. |
| `myRecs` | `boolean` | No | If `true`, returns only the current user's recommendations. **Requires auth.** |
| `staffPicks` | `boolean` | No | If `true`, returns only staff-picked recommendations. |
| `paginationOpts` | `PaginationOptions` | Yes | Cursor-based pagination: `{ numItems: number, cursor: string \| null }` |

**Filter priority:** `myRecs` > `staffPicks` > `genre` > no filter (all, descending by creation time).

**Returns:** `PaginatedQueryResult<Recommendation>` — `{ page: Recommendation[], isDone: boolean, continueCursor: string }`

**Index usage:**
- `myRecs` → `by_userId` index
- `staffPicks` → `by_staffPick` index
- `genre` → `by_genre` index
- No filter → full table scan (descending)

**Auth required:** Only when `myRecs: true`. All other filter modes work without authentication.

---

### `recommendations.create` — Mutation

Creates a new recommendation. The author identity is derived from the JWT — never from args.

**Args:**

| Parameter | Type | Required | Constraints |
|---|---|---|---|
| `title` | `string` | Yes | 1–200 chars after trim |
| `genre` | `string` | Yes | Must be in `ALLOWED_GENRES` list (21 genres) |
| `blurb` | `string` | Yes | 1–250 chars after trim |
| `link` | `string` | Yes | Empty string or valid `http://` / `https://` URL |
| `posterUrl` | `string` | Yes | Empty string or valid `http://` / `https://` URL |
| `hypeScore` | `number` | Yes | 1–10 (supports decimals for half-star: 1, 1.5, 2, ... 5 maps to 1–10) |

**Server-side validation:**
1. Trims `title` and `blurb`, checks lengths
2. Validates `genre` against `ALLOWED_GENRES` allowlist
3. Validates `link` and `posterUrl` with `isSafeUrl()` (protocol check)
4. Validates `hypeScore` range (1–10)

**Inserted record includes:**
- `userId` — from `identity.subject` (Clerk user ID)
- `userName` — from the `users` table
- `userAvatar` — Clerk profile picture or DiceBear fallback: `https://api.dicebear.com/7.x/notionists/svg?seed={name}`
- `isStaffPick` — always `false` on creation

**Returns:** `Id<"recommendations">` — the document ID of the created recommendation.

**Auth required:** Yes. Throws `"Must be logged in to create a recommendation"` if unauthenticated.

---

### `recommendations.update` — Mutation

Updates an existing recommendation. Users can edit their own; admins can edit any.

**Args:**

| Parameter | Type | Required | Constraints |
|---|---|---|---|
| `id` | `Id<"recommendations">` | Yes | The document ID of the recommendation to update |
| `title` | `string` | Yes | 1–200 chars after trim |
| `genre` | `string` | Yes | Must be in `ALLOWED_GENRES` list (21 genres) |
| `blurb` | `string` | Yes | 1–250 chars after trim |
| `link` | `string` | Yes | Empty string or valid `http://` / `https://` URL |
| `posterUrl` | `string` | Yes | Empty string or valid `http://` / `https://` URL |
| `hypeScore` | `number` | Yes | 1–10 |

**Authorization logic:**
1. Verifies authentication via JWT
2. Fetches the recommendation by ID
3. Checks ownership: `rec.userId === identity.subject`
4. If not owner, checks admin via `isAdminEmail(identity.email)` against `ADMIN_EMAILS` env var
5. If neither, throws `"Unauthorized: you can only edit your own recommendations"`
6. Runs the same 6-field validation as `create`
7. Patches only the editable fields (userId, userName, userAvatar, isStaffPick are preserved)

**Returns:** `void`

**Auth required:** Yes. Role-based: owner OR admin.

---

### `recommendations.remove` — Mutation

Deletes a recommendation. Users can delete their own; admins can delete any.

**Args:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | `Id<"recommendations">` | Yes | The document ID of the recommendation to delete |

**Authorization logic:**
1. Verifies authentication via JWT
2. Fetches the recommendation by ID
3. Checks ownership: `rec.userId === identity.subject`
4. If not owner, checks admin via `isAdminEmail(identity.email)` against `ADMIN_EMAILS` env var
5. If neither, throws `"Unauthorized: you can only delete your own recommendations"`

**Returns:** `void`

**Auth required:** Yes. Role-based: owner OR admin.

---

### `recommendations.toggleStaffPick` — Mutation

Toggles the `isStaffPick` boolean on a recommendation. Admin-only.

**Args:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `id` | `Id<"recommendations">` | Yes | The document ID of the recommendation |

**Authorization logic:**
1. Verifies authentication via JWT
2. Checks admin via `isAdminEmail(identity.email)` against `ADMIN_EMAILS` env var
3. Toggles `isStaffPick` to the opposite boolean value

**Returns:** `void`

**Auth required:** Yes. Admin only. Throws `"Only admins can toggle staff picks"` for non-admins.

---

## Users

### `users.store` — Mutation

Called on every sign-in to upsert the user record. Creates the user if new, updates name/email/role if changed.

**Args:** None — all data is derived from the authenticated JWT identity.

**Logic:**
1. Gets `identity` from `ctx.auth.getUserIdentity()`
2. Looks up existing user by `identity.subject` using `by_clerkId` index
3. Computes role: checks `identity.email` against `ADMIN_EMAILS` env var
4. If user exists and any field changed → patches the record
5. If user doesn't exist → inserts new record

**Fields stored:**

| Field | Source | Description |
|---|---|---|
| `clerkId` | `identity.subject` | Clerk user ID (immutable after creation) |
| `name` | `identity.name` | Display name (falls back to `"Anonymous"`) |
| `email` | `identity.email` | Email address (falls back to `"None"`) |
| `role` | Computed | `"admin"` if email is in `ADMIN_EMAILS`, else `"user"` |

**Returns:** `Id<"users">` — the document ID (existing or newly created).

**Auth required:** Yes. Throws if called without authentication.

---

### `users.current` — Query

Returns the current user's record, or `null` if not authenticated.

**Args:** None.

**Returns:** `User | null` — the full user document including `_id`, `_creationTime`, `clerkId`, `name`, `email`, `role`.

**Auth required:** No (returns `null` for unauthenticated users instead of throwing).

---

## TMDB Server Action

### `searchMovies(query)` — Server Action

Searches TMDB for movies matching a query string. Runs server-side only (`'use server'` directive).

**Location:** `app/actions/tmdb.ts`

**Args:**

| Parameter | Type | Required | Description |
|---|---|---|---|
| `query` | `string` | Yes | Movie search string. Returns `[]` if empty. |

**Returns:** Array of up to 5 results:

```typescript
{
  id: number;           // TMDB movie ID
  title: string;        // Movie title
  release_date: string; // e.g., "2024-03-15"
  poster_path: string;  // e.g., "/abc123.jpg" (prepend https://image.tmdb.org/t/p/w500)
  genre: string;        // First genre mapped to HypeShelf genre name
}[]
```

**Genre mapping:** TMDB genre IDs → HypeShelf genre names (19 mappings). Unmapped genres default to `"Other"`.

| TMDB ID | HypeShelf Genre |
|---|---|
| 28 | Action |
| 12 | Adventure |
| 16 | Animation |
| 35 | Comedy |
| 80 | Crime |
| 99 | Documentary |
| 18 | Drama |
| 10751 | Family |
| 14 | Fantasy |
| 36 | History |
| 27 | Horror |
| 10402 | Music |
| 9648 | Mystery |
| 10749 | Romance |
| 878 | Sci-Fi |
| 10770 | TV Movie |
| 53 | Thriller |
| 10752 | War |
| 37 | Western |

**Security:** The `TMDB_API_KEY` is accessed via `process.env` inside a `'use server'` function — it never reaches the client bundle. The query parameter is encoded with `encodeURIComponent()` to prevent injection. `include_adult=false` filters explicit content.

---

## Database Schema

### `recommendations` table

| Field | Type | Description |
|---|---|---|
| `userId` | `string` | Clerk user ID of the author |
| `userName` | `string` | Display name of the author |
| `userAvatar` | `string` | Avatar URL (Clerk profile image or DiceBear fallback) |
| `title` | `string` | Movie/show title (1–200 chars) |
| `genre` | `string` | One of 21 allowed genres |
| `link` | `string` | External link (empty string or valid URL) |
| `blurb` | `string` | User review/description (1–250 chars) |
| `hypeScore` | `number` | Rating from 1–10 (mapped from 0.5–5 stars) |
| `isStaffPick` | `boolean` | Admin-curated flag |
| `posterUrl` | `string` | Movie poster URL (empty string or valid URL) |

**Indexes:** `by_genre(genre)`, `by_userId(userId)`, `by_staffPick(isStaffPick)`

### `users` table

| Field | Type | Description |
|---|---|---|
| `clerkId` | `string` | Clerk user ID |
| `role` | `"user" \| "admin"` | Role determined by `ADMIN_EMAILS` env var |
| `name` | `string` | Display name |
| `email` | `string` | Email address |

**Indexes:** `by_clerkId(clerkId)`
