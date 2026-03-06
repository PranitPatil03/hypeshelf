# Getting Started

Complete setup guide for running HypeShelf locally.

---

## Prerequisites

| Requirement | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | JavaScript runtime |
| **pnpm** | Latest | Package manager (project uses pnpm workspaces) |
| **Clerk account** | Free tier | Authentication provider — [clerk.com](https://clerk.com) |
| **Convex account** | Free tier | Backend-as-a-Service — [convex.dev](https://convex.dev) |
| **TMDB API key** | Free | Movie metadata — [developer.themoviedb.org](https://developer.themoviedb.org/docs/getting-started) |

---

## 1. Clone and Install

```bash
git clone https://github.com/PranitPatil03/hypeshelf.git
cd hypeshelf
pnpm install
```

---

## 2. Environment Variables

Create `.env.local` in the project root:

```env
# Convex — get this from your Convex dashboard after running `npx convex dev`
NEXT_PUBLIC_CONVEX_URL=<your-convex-deployment-url>

# Clerk — from your Clerk dashboard → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
CLERK_SECRET_KEY=<your-clerk-secret-key>

# TMDB — from https://developer.themoviedb.org/docs/getting-started
TMDB_API_KEY=<your-tmdb-api-key>
```

### Where to find each value

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_CONVEX_URL` | Convex Dashboard → Settings → Deployment URL (created after first `npx convex dev`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys → Publishable key |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys → Secret key |
| `TMDB_API_KEY` | TMDB → Settings → API → API Key (v3 auth) |

---

## 3. Set Up Convex

Start the Convex development server. This deploys your schema and functions:

```bash
npx convex dev
```

This will:
- Create a new Convex project (first time) or connect to an existing one
- Deploy `convex/schema.ts` (creates `recommendations` and `users` tables)
- Deploy `convex/recommendations.ts` and `convex/users.ts` (server functions)
- Start watching for changes

### Configure Convex environment variables

Set the admin email(s) so your account gets the `admin` role on login:

```bash
npx convex env set ADMIN_EMAILS "your-email@example.com"
```

Multiple admins:

```bash
npx convex env set ADMIN_EMAILS "admin1@example.com,admin2@example.com"
```

Set the Clerk JWT issuer domain (required for Convex to verify Clerk tokens):

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN "https://<your-clerk-domain>.clerk.accounts.dev"
```

You can find your Clerk domain in: Clerk Dashboard → Settings → Domain.

---

## 4. Configure Clerk

1. Go to [clerk.com](https://clerk.com) and create a new application
2. **Enable sign-in methods:**
   - Email/Password
   - Google OAuth
   - X (Twitter) OAuth
3. **Create JWT template for Convex:**
   - Clerk Dashboard → JWT Templates → New Template
   - Select "Convex" template
   - Name it `convex`
   - Copy the **Issuer** URL — this is the `CLERK_JWT_ISSUER_DOMAIN` value
4. **Verify auth config matches:**
   - Open `convex/auth.config.ts` and confirm the domain matches your Clerk issuer

### Custom auth pages

HypeShelf uses custom sign-in/sign-up pages (not Clerk's hosted UI). The routes are already set up at `/sign-in` and `/sign-up`. No additional Clerk configuration is needed for this — it's handled by the catch-all routes: `app/sign-in/[[...sign-in]]/page.tsx`.

---

## 5. Seed the Database (Optional)

Populate the database with 220+ movie recommendations across all 21 genres:

```bash
npx tsx scripts/seed.ts
```

This script:
- Fetches real movie data from TMDB (popular movies per genre)
- Generates random user names and blurbs
- Inserts ~220 recommendations with real poster images
- Requires `TMDB_API_KEY` in `.env.local` and Convex dev server running

The seed data gives the shelf immediate visual impact and makes it easier to test filtering, pagination, and the grid layout.

---

## 6. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

| Page | URL | Access |
|---|---|---|
| Landing page | `/` | Public — hero section + limited recommendation grid |
| Shelf dashboard | `/shelf` | Protected — full grid with filters, infinite scroll, add/edit/delete |
| Sign in | `/sign-in` | Public — custom Clerk sign-in page |
| Sign up | `/sign-up` | Public — custom Clerk sign-up page |

### Verify everything works

1. **Landing page loads** — you should see the hero and recommendation cards (if seeded)
2. **Sign up** — create an account, you should be redirected to `/shelf`
3. **Admin role** — if your email matches `ADMIN_EMAILS`, you should see the Staff Pick toggle and delete buttons on all cards
4. **Add a rec** — click "+ add your recs", search for a movie via TMDB, submit
5. **Real-time** — open two browser tabs at `/shelf`, add a rec in one — it should appear in the other instantly

---

## Troubleshooting

| Issue | Solution |
|---|---|
| `npx convex dev` fails to connect | Make sure you've logged in with `npx convex login` first |
| TMDB search returns empty | Verify `TMDB_API_KEY` is set in `.env.local` (not in Convex env vars) |
| Sign-in redirects to wrong page | Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` matches your Clerk app |
| "Unauthenticated" errors in Convex | Ensure `CLERK_JWT_ISSUER_DOMAIN` is set correctly in Convex env vars |
| Admin features not showing | Verify your email is in `ADMIN_EMAILS` (case-insensitive, comma-separated) |
| Seed script fails | Ensure both `npx convex dev` is running AND `TMDB_API_KEY` is set |
