# Security

This document covers HypeShelf's security architecture, including authentication, authorization, input validation, and XSS prevention.

---

## Authentication Flow

```
User → Clerk (sign-in/sign-up) → JWT issued → Convex validates JWT → Access granted
```

### Layers of Auth Enforcement

| Layer | Mechanism | Purpose |
|---|---|---|
| **Clerk Middleware** (`proxy.ts`) | `clerkMiddleware` + route matcher | Blocks unauthenticated access to `/shelf` and other protected routes |
| **Server-side Redirects** | `currentUser()` in page components | Second layer — redirects to `/sign-in` if no user |
| **Convex Mutations** | `ctx.auth.getUserIdentity()` | Authoritative check — every write operation verifies JWT independently |

### Key Principle

No mutation trusts client-supplied user information. The `userId` is always derived from the cryptographically verified JWT token, never from request parameters.

---

## Role-Based Access Control (RBAC)

### Role Assignment

Roles are assigned at first login in `convex/users.ts`:

1. Admin emails are configured via Convex environment variable: `ADMIN_EMAILS`
2. On login, the user's email is checked against this allowlist
3. Matching emails get `role: "admin"`, everyone else gets `role: "user"`

```bash
npx convex env set ADMIN_EMAILS "admin1@example.com,admin2@example.com"
```

### Permission Matrix

| Action | User | Admin |
|---|---|---|
| View recommendations | ✅ | ✅ |
| Create recommendation | ✅ | ✅ |
| Delete own recommendation | ✅ | ✅ |
| Delete any recommendation | ❌ | ✅ |
| Toggle Staff Pick | ❌ | ✅ |

### Enforcement Points

- **Server-side (authoritative):** Every Convex mutation checks identity and role before performing writes
- **Client-side (UX only):** Admin-only UI elements are conditionally rendered, but this is not a security boundary

---

## Input Validation (Defense-in-Depth)

Validation runs independently on both client and server:

### Client (Zod) — `lib/validation.ts`

Provides instant user feedback before data leaves the browser.

### Server (Convex) — `convex/recommendations.ts`

Acts as the authoritative security boundary. A malicious client can bypass frontend validation, but the server will reject invalid data.

### Validation Rules

| Field | Rule |
|---|---|
| `title` | 1–200 characters, trimmed |
| `blurb` | 1–250 characters, trimmed |
| `genre` | Must be in the hardcoded allowlist |
| `link` | Must be empty or `http://` / `https://` URL |
| `posterUrl` | Must be empty or `http://` / `https://` URL |
| `hypeScore` | Integer between 1–10 |

---

## URL Sanitization (XSS Prevention)

Both `link` and `posterUrl` are validated to only accept `http://` or `https://` protocols.

**Why this matters:**
- `link` is rendered as `<a href={rec.link}>` — without validation, `javascript:alert('XSS')` would execute
- `posterUrl` is rendered as `<img src>` — has a different but related attack surface

**Implementation:**
- Frontend: Zod regex refine: `/^https?:\/\/.+/`
- Backend: `new URL(url)` parsing + `protocol === "http:" || "https:"` check
- Links use `rel="noopener noreferrer"` and `target="_blank"` to prevent tab hijacking

---

## API Key Protection

| Secret | Location | Exposure |
|---|---|---|
| TMDB API key | Server Action (`app/actions/tmdb.ts`) | Never reaches client |
| Clerk secret | `.env.local` (gitignored) | Server-side only |
| Convex URL | `NEXT_PUBLIC_CONVEX_URL` | Public (by design — Convex handles auth) |

---

## Data Privacy

- User emails are stored in Convex for admin role assignment only
- Public recommendation cards display only username + DiceBear-generated avatar
- No PII is exposed on public pages
