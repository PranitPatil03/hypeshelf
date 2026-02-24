# Design Decisions & Trade-offs

This document outlines the key architectural and implementation decisions made during the development of HypeShelf, along with the reasoning behind each choice and the associated trade-offs.

---

## 1. Convex over Traditional REST API

**Decision:** Used Convex as the backend/database layer instead of building a custom API.

**Reasoning:** Convex provides real-time subscriptions out of the box, meaning the recommendation grid updates instantly when any user adds a new rec. It also provides type-safe queries/mutations with built-in argument validation, eliminating an entire class of bugs. Pagination support is native to the platform, so implementing infinite scroll required minimal boilerplate.

**Trade-off:** Vendor lock-in to the Convex platform. For a larger production app, this might warrant a more portable solution (e.g., Prisma + PostgreSQL + custom API layer). However, for the scope of this project, Convex dramatically reduced development time while delivering a better real-time UX.

---

## 2. Custom Auth Pages over Clerk's Prebuilt Components

**Decision:** Built fully custom sign-in/sign-up forms instead of using Clerk's `<SignIn />` / `<SignUp />` components.

**Reasoning:** Full design control to match the app's minimal aesthetic. The custom forms allow styling OAuth buttons, controlling layout, and integrating seamlessly with the application's visual language. Also ensures consistent branding across the entire auth flow.

**Trade-off:** More code to maintain and handle edge cases (MFA, password reset, email verification). Clerk's prebuilt components handle all of these automatically. For a production application, using Clerk's components with theme customization may be more maintainable.

---

## 3. TMDB Integration for Movie Search

**Decision:** Integrated TMDB's search API as a Next.js Server Action to auto-populate movie details (title, poster, genre, link).

**Reasoning:** Massively improves UX — users don't need to manually type titles, find genres, or hunt for poster URLs. The Server Action pattern keeps the TMDB API key entirely server-side, never exposing it to the client. Search results are debounced (500ms) to minimize API calls.

**Trade-off:** Added an external dependency. If TMDB is down or rate-limited, movie search degrades. Mitigated with a "Can't find it? Add manually" fallback button. The TMDB genre IDs are mapped to our app's genre allowlist server-side, which requires maintenance if genres change.

---

## 4. Server-Side Genre Validation with Allowlist

**Decision:** Genres are validated against a hardcoded allowlist on both client (Zod) and server (Convex handler).

**Reasoning:** Prevents data integrity issues from arbitrary genre values injected via the API. Since recommendations are publicly visible and filterable by genre, ensuring data cleanliness is critical. The TMDB genre mapping converts TMDB's numeric genre IDs to human-readable strings that match our allowlist.

**Trade-off:** New genre additions require code changes in two places: `lib/validation.ts` (frontend) and `convex/recommendations.ts` (backend). A more dynamic approach would store genres in the database, but for a fixed genre taxonomy, the allowlist approach is simpler and more secure.

---

## 5. Defense-in-Depth Validation

**Decision:** Input validation runs on both the frontend (Zod schema) and backend (Convex mutation handler), independently.

**Reasoning:**
- **Frontend (Zod):** Provides instant feedback to the user before data leaves the browser. Catches typos, too-long blurbs, and invalid URLs in real-time.
- **Backend (Convex):** Acts as the authoritative security boundary. A malicious client can bypass frontend validation entirely (by calling the Convex mutation directly), but the server will independently reject invalid data.

This approach ensures that:
- Title: 1–200 characters
- Blurb: 1–250 characters
- Genre: Must be in the allowlist
- Link & Poster URL: Must use `http://` or `https://` (blocks `javascript:` XSS)
- Hype Score: Must be between 1–10

There is no scenario where invalid data can be inserted, regardless of how the client behaves.

---

## 6. Admin Role via Environment Variable

**Decision:** Admin emails are configured via a Convex environment variable (`ADMIN_EMAILS`) rather than a database-driven admin panel or Clerk organization roles.

**Reasoning:** This approach was chosen for several security and simplicity reasons:

- **No UI attack surface:** There is no admin panel, invite link, or API endpoint that could be exploited for privilege escalation. The only way to become an admin is to have deployment-level access to the Convex environment.
- **Separation of concerns:** Admin assignment is an infrastructure-level decision, not a user-facing feature. It belongs in environment configuration, not in the application database.
- **Simplicity:** For a small team (1–5 admins), editing an environment variable is faster and less error-prone than building an admin management UI.
- **Auditability:** Changes to environment variables are tracked in the Convex dashboard, providing a built-in audit log.

**How it works:**
1. Admin emails are set on the Convex deployment:
   ```bash
   npx convex env set ADMIN_EMAILS "admin1@example.com,admin2@example.com"
   ```
2. On first login, `convex/users.ts` checks the user's email against `ADMIN_EMAILS`.
3. If matched, the user is assigned the `"admin"` role; otherwise, `"user"`.
4. The role is stored in the Convex `users` table and used for all subsequent RBAC checks.

**Alternative approaches considered:**
- **Clerk Organizations/Roles:** More scalable for large teams, but adds complexity and Clerk plan requirements.
- **Database-driven admin panel:** More flexible, but introduces a privilege escalation attack surface that needs its own auth layer.
- **Static hardcoded email:** Less secure (visible in source code) and requires code deployment to change.

**Trade-off:** Doesn't scale to many admins or self-service admin management. For a production healthcare application, a Clerk Organization-based role system with audit logging would be more appropriate.

---

## 7. URL Sanitization Against XSS

**Decision:** Both `link` and `posterUrl` fields are validated to only accept `http://` or `https://` protocols on both client and server.

**Reasoning:** Recommendation links are rendered as `<a href={rec.link}>` in the UI. Without URL validation, a malicious user could submit `javascript:alert('XSS')` as a link, which would execute arbitrary JavaScript when clicked. The `posterUrl` is rendered as an `<img src>`, which has a different (but related) attack surface.

**Implementation:**
- **Frontend:** Zod schema uses a regex refine: `/^https?:\/\/.+/`
- **Backend:** Convex handler uses `new URL(url)` parsing and checks `protocol === "http:" || "https:"`
- **Rendering:** Links use `rel="noopener noreferrer"` and `target="_blank"` to prevent tab hijacking

---

## 8. Convex Auth Token Validation

**Decision:** Every Convex mutation independently calls `ctx.auth.getUserIdentity()` to validate the caller's identity, rather than trusting any client-supplied user information.

**Reasoning:** The JWT token is validated by Convex against the configured Clerk issuer. This means:
- The `userId` in the token is cryptographically verified — it cannot be spoofed.
- No client-supplied `userId` parameter is ever trusted for authorization decisions.
- The `users.store` mutation syncs user metadata (name, email) but derives the `clerkId` from the verified token, not from client input.

This pattern ensures that even if a malicious client modifies the request payload, they cannot impersonate another user or escalate their permissions.
