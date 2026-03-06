# Security

HypeShelf implements a defense-in-depth security model with three independent enforcement layers. No single layer is the security boundary — they work together so that bypassing one layer does not grant unauthorized access.

---

## Authentication Architecture

```
User → Clerk (sign-in / sign-up / OAuth) → JWT issued
  → Clerk Middleware (proxy.ts) validates session on every request
  → Convex validates JWT against Clerk JWKS on every mutation
  → ctx.auth.getUserIdentity() returns verified identity
```

### Three Layers of Auth Enforcement

| Layer | File | Mechanism | What It Does |
|---|---|---|---|
| **1. Clerk Middleware** | `proxy.ts` | `clerkMiddleware` + `createRouteMatcher` | Blocks unauthenticated users from `/shelf` and all non-public routes. Runs at the edge before the page even loads. |
| **2. Server-side Redirect** | `app/shelf/page.tsx` | `currentUser()` check | Second defense — if middleware is bypassed (e.g., misconfigured route), the page itself redirects to `/sign-in`. |
| **3. Convex JWT Verification** | `convex/recommendations.ts` | `ctx.auth.getUserIdentity()` | **Authoritative check.** Every write operation independently verifies the JWT against Clerk's JWKS endpoint. A direct API call without a valid token is rejected. |

### Key Principle

> No mutation trusts client-supplied user information. The `userId` is always derived from the cryptographically verified JWT token (`identity.subject`), never from request parameters.

This means a malicious client cannot impersonate another user by modifying the request payload.

---

## Role-Based Access Control (RBAC)

### Role Assignment

Roles are assigned at login in [`convex/users.ts`](../convex/users.ts):

1. Admin emails are configured via Convex environment variable: `ADMIN_EMAILS`
2. On login, `users.store` mutation checks the user's email against this allowlist
3. Matching emails get `role: "admin"`, everyone else gets `role: "user"`
4. The role is stored in the Convex `users` table and re-checked on every login

```bash
npx convex env set ADMIN_EMAILS "admin1@example.com,admin2@example.com"
```

**Why environment variable and not a database admin panel?**
- **Zero UI attack surface** — no admin panel endpoint that could be exploited for privilege escalation
- **Infrastructure-level control** — admin assignment requires Convex deployment access, not app-level access
- **Audit trail** — env var changes are tracked in the Convex dashboard

### Permission Matrix

| Action | Anonymous (not logged in) | User | Admin |
|---|---|---|---|
| Browse public shelf | ✅ | ✅ | ✅ |
| View all recommendations | ✅ | ✅ | ✅ |
| Create recommendation | ❌ | ✅ | ✅ |
| Edit own recommendation | ❌ | ✅ | ✅ |
| Edit any recommendation | ❌ | ❌ | ✅ |
| Delete own recommendation | ❌ | ✅ | ✅ |
| Delete any recommendation | ❌ | ❌ | ✅ |
| Toggle Staff Pick | ❌ | ❌ | ✅ |

### Enforcement — Server vs Client

| Layer | Purpose | Is it a security boundary? |
|---|---|---|
| **Convex mutations** (server) | Checks `ctx.auth.getUserIdentity()` + `user.role` before every write | **Yes — authoritative** |
| **React components** (client) | Conditionally renders admin-only buttons (delete any, staff pick toggle) | **No — UX convenience only** |

The client layer improves UX but provides no security guarantee. Hiding a React button is never a security boundary.

### Server-Side Authorization Pattern

Every mutation in [`convex/recommendations.ts`](../convex/recommendations.ts) follows the same pattern:

```typescript
// 1. Verify authentication
const identity = await ctx.auth.getUserIdentity();
if (!identity) throw new Error("Unauthenticated");

// 2. Look up user record (for role)
const user = await ctx.db
  .query("users")
  .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
  .unique();

// 3. Check authorization
if (rec.userId !== identity.subject && user?.role !== "admin") {
  throw new Error("Unauthorized: you can only modify your own recommendations");
}

// 4. Execute operation (same pattern for update, remove, toggleStaffPick)
await ctx.db.delete(args.id); // or ctx.db.patch(args.id, { ... })
```

---

## Input Validation (Defense-in-Depth)

Validation runs independently on both client and server. They are not redundant — they serve different purposes.

### Dual Validation Architecture

| Layer | Where | Purpose | Can be bypassed? |
|---|---|---|---|
| **Zod schema** | `lib/validation.ts` (client) | Instant UX feedback before data leaves the browser | Yes — a malicious client can call Convex directly |
| **Convex handler** | `convex/recommendations.ts` (server) | Authoritative security boundary — rejects invalid data regardless of client | No — runs on Convex servers |

### Validation Rules

| Field | Client (Zod) | Server (Convex) |
|---|---|---|
| `title` | `.trim().min(1).max(200)` | `trim() + length check` |
| `blurb` | `.trim().min(1).max(250)` | `trim() + length check` |
| `genre` | `.refine(ALLOWED_GENRES.includes)` | `ALLOWED_GENRES.includes()` check |
| `link` | Regex: `/^https?:\/\/.+/` | `new URL()` + protocol check |
| `posterUrl` | Regex: `/^https?:\/\/.+/` | `new URL()` + protocol check |
| `hypeScore` | `.min(1).max(10)` | `< 1 \|\| > 10` range check |

### Genre Allowlist (21 genres)

The genre allowlist is hardcoded in both [`lib/validation.ts`](../lib/validation.ts) and [`convex/recommendations.ts`](../convex/recommendations.ts). Submissions with any genre not in this list are rejected:

```
Action, Comedy, Sci-Fi, Horror, Thriller, Drama, Romance, Other,
Adventure, Animation, Crime, Documentary, Family, Fantasy, History,
Music, Mystery, Science Fiction, TV Movie, War, Western
```

---

## URL Sanitization (XSS Prevention)

Both `link` and `posterUrl` fields are validated to only accept `http://` or `https://` protocols.

### Why This Matters

- `link` is rendered as `<a href={rec.link}>` — without validation, `javascript:alert('XSS')` would execute arbitrary JavaScript when clicked
- `posterUrl` is rendered as `<img src={rec.posterUrl}>` — different but related attack surface via `onerror` handlers

### Implementation

| Layer | How |
|---|---|
| **Client** (Zod) | Regex refine: `/^https?:\/\/.+/` |
| **Server** (Convex) | `new URL(url)` parsing + `parsed.protocol === "http:" \|\| parsed.protocol === "https:"` |
| **Rendering** | All external links use `rel="noopener noreferrer"` + `target="_blank"` to prevent tab hijacking |

The `isSafeUrl()` function in `convex/recommendations.ts`:
```typescript
function isSafeUrl(url: string): boolean {
  if (url === "") return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}
```

---

## API Key Protection

| Secret | Located In | Runtime | Exposed to Client? |
|---|---|---|---|
| `TMDB_API_KEY` | Server Action (`app/actions/tmdb.ts`) | Server only | **No** — `'use server'` directive ensures server-only execution |
| `CLERK_SECRET_KEY` | `.env.local` | Server only | **No** — used by Clerk middleware |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `.env.local` | Client | Yes — safe by design (public key) |
| `NEXT_PUBLIC_CONVEX_URL` | `.env.local` | Client | Yes — safe by design (Convex handles auth per-request) |
| `CLERK_JWT_ISSUER_DOMAIN` | Convex env vars | Convex server | **No** — used for JWT verification |
| `ADMIN_EMAILS` | Convex env vars | Convex server | **No** — used for role assignment |

---

## Data Privacy

- User emails are stored in Convex for admin role assignment only — never displayed in the UI
- Public recommendation cards display only `userName` + avatar (DiceBear-generated or Clerk profile image)
- No PII is exposed on public-facing pages (the landing page at `/`)
- Clerk user IDs (`identity.subject`) are opaque identifiers — not guessable or enumerable

---

## Transport Security

- All Convex communication uses WSS (WebSocket Secure) — encrypted in transit
- All Clerk communication uses HTTPS
- Convex encrypts all data at rest
- TMDB API calls from the server use HTTPS

---

## Additional Defenses

| Defense | Implementation |
|---|---|
| **CSRF protection** | Convex mutations are called via authenticated WebSocket, not HTTP forms — CSRF is structurally impossible |
| **XSS prevention** | React's JSX auto-escaping + no `dangerouslySetInnerHTML` usage + URL protocol validation |
| **Tab-nabbing prevention** | All external links use `rel="noopener noreferrer"` |
| **Pagination cap** | Server-side `MAX_PAGE_SIZE = 100` — `Math.min(args.paginationOpts.numItems, MAX_PAGE_SIZE)` caps every query |
| **Error messages** | Server errors reference error types, not user data — no PII leakage in error responses |

---

## Privacy Controls

While HypeShelf is not a healthcare application, it implements privacy patterns inspired by real-world compliance frameworks:

| Principle | Implementation |
|---|---|
| **Minimum necessary access** | Public landing page shows recommendations without ownership info. Authenticated users see ownership only for authorization purposes. |
| **Data encryption in transit** | All communication uses TLS — HTTPS for API calls, WSS for Convex WebSocket. No plaintext channels. |
| **Data encryption at rest** | Convex encrypts all stored data at rest. |
| **Input validation** | Every mutation validates all inputs server-side (length, format, enum membership). Client-side validation mirrors this for UX but is never trusted. |
| **No PII in logs** | Error messages and console logs reference error types, not user data. Clerk user-IDs are opaque identifiers. |
| **RBAC enforcement** | Authorization checks happen at the data layer (Convex mutations), not at the API or UI layer, preventing privilege escalation. |
| **Opaque identifiers** | Clerk `identity.subject` values are non-guessable, non-enumerable strings — not sequential IDs. |
