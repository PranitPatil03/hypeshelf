# HypeShelf

A shared movie recommendations hub where users sign in and share their favorite movies in one clean, public shelf.

> **"Collect and share the movies you're hyped about."**

![Next.js](https://img.shields.io/badge/Next.js_16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-FF6F00?logo=convex&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?logo=clerk&logoColor=white)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Security Considerations](#security-considerations)
- [Role-Base Access Control](#role-base-access-control)
- [Design Decisions & Trade-offs](#design-decisions--trade-offs)

---

## Features

### Public Experience (Unauthenticated)
- Landing page with hero section, tagline, and "Sign in to add yours" CTA
- Read-only grid of latest community recommendations pulled live from Convex
- Filter recommendations by genre (Action, Comedy, Drama, Horror, etc.)
- Infinite scroll with automatic pagination (50 items per page)

### Authenticated Experience
- **Add a recommendation** with TMDB movie search integration (auto-fills title, poster, genre, link)
- Manual entry fallback for movies not found on TMDB
- Star-based hype rating (half-star precision, mapped to 1–10 scale)
- Short blurb/review (250 character limit, enforced client + server)
- Filter by genre, "My Recs", and "Staff Picks" (admin only)
- Delete your own recommendations
- Real-time updates via Convex subscriptions

### Admin Experience
- Delete any user's recommendation
- Toggle "Staff Pick" badge on any recommendation
- View dedicated "Staff Picks" filter tab

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Authentication** | Clerk (Email + OAuth: Google, X) |
| **Backend/Database** | Convex (real-time BaaS) |
| **Validation** | Zod (frontend) + runtime checks (server) |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Movie Data** | TMDB API (server action) |
| **Animations** | Motion (Framer Motion) |
| **Deployment** | Vercel + Convex Cloud |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Next.js App                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │  Public   │  │  Auth    │  │  Shelf (Auth'd)  │   │
│  │  Landing  │  │  Pages   │  │  Dashboard       │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────────────┘   │
│       │              │             │                  │
│       ▼              ▼             ▼                  │
│  ┌──────────────────────────────────────────────┐    │
│  │           Clerk Middleware (proxy.ts)         │    │
│  │    Route protection + auth state management   │    │
│  └──────────────────────────────────────────────┘    │
│       │                                              │
│       ▼                                              │
│  ┌──────────────────────────────────────────────┐    │
│  │         Convex Client Provider                │    │
│  │    Real-time subscriptions + mutations         │    │
│  └──────────────────────┬───────────────────────┘    │
└─────────────────────────┼────────────────────────────┘
                          │
                          ▼
            ┌─────────────────────────┐
            │      Convex Backend      │
            │  ┌───────────────────┐   │
            │  │  recommendations  │   │  Queries, Mutations
            │  │  users            │   │  Auth validation
            │  └───────────────────┘   │  RBAC enforcement
            └─────────────────────────┘
```

**Data Flow:**
1. Clerk handles authentication and issues JWT tokens
2. Convex validates tokens via the configured auth provider
3. All mutations verify identity server-side before any writes
4. Queries stream real-time updates to subscribed clients
5. TMDB search runs as a Next.js Server Action (API key stays server-side)

---

## RBAC (Role-Based Access Control)

### Role Assignment
- Roles are assigned at first login in `convex/users.ts`
- Admin email(s) are configured via a Convex environment variable (`ADMIN_EMAILS`)
- All new users default to the `"user"` role
- The `users` table schema enforces `role: "user" | "admin"` via Convex validators

### Permission Matrix

| Action | `user` | `admin` |
|---|---|---|
| View public recommendations | ✅ | ✅ |
| Create a recommendation | ✅ | ✅ |
| Delete own recommendation | ✅ | ✅ |
| Delete any recommendation | ❌ | ✅ |
| Toggle Staff Pick | ❌ | ✅ |
| View Staff Picks filter | ❌ | ✅ |
| View "My Recs" filter | ✅ | ✅ |

### Enforcement Points
- **Server-side (Convex mutations):** Every mutation checks `ctx.auth.getUserIdentity()` and verifies ownership/role before performing write operations. This is the authoritative enforcement layer.
- **Client-side (React components):** Admin-only UI elements (delete buttons on others' recs, Staff Pick toggle, Staff Picks filter tab) are conditionally rendered based on the user's role from the `users.current` query. This is a UX convenience, not a security boundary.

---

## Security Considerations

### Input Validation (Defense-in-Depth)
- **Frontend (Zod):** All recommendation form data is validated using a Zod schema (`lib/validation.ts`) before submission. Enforces title/blurb length, genre allowlist, safe URL schemes, and hype score bounds.
- **Server (Convex handlers):** All mutations independently re-validate input regardless of client behavior. This prevents bypass via direct API calls or modified clients.

### URL Sanitization
- The `link` and `posterUrl` fields are validated to only accept `http://` or `https://` protocols on both client and server.
- This prevents XSS attacks via `javascript:` URI injection in `<a href>` tags.

### Authentication & Authorization
- **Clerk middleware** (`proxy.ts`) protects all routes except the public landing page, sign-in, sign-up, and SSO callback.
- **Server-side redirects** in page components provide a second layer of auth enforcement using `currentUser()`.
- **Convex mutations** independently verify the caller's identity via JWT validation. No mutation trusts client-supplied user information.

### API Key Protection
- TMDB API key is only used in a Next.js Server Action (`app/actions/tmdb.ts`), never exposed to the client.
- Clerk and Convex secrets are in `.env.local`, which is gitignored.

### Data Privacy
- User emails are stored in Convex for admin role assignment only.
- Public-facing recommendation cards display only username and avatar (generated via DiceBear).
- No PII is exposed on public pages.

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Clerk account ([clerk.com](https://clerk.com))
- Convex account ([convex.dev](https://convex.dev))
- TMDB API key ([themoviedb.org](https://developer.themoviedb.org))

### 1. Clone and install

```bash
git clone <your-repo-url>
cd hypeshelf
pnpm install
```

### 2. Environment variables

```bash
cp .env.example .env.local
```

Fill in your Clerk, Convex, and TMDB credentials. See `.env.example` for all required variables.

### 3. Set up Convex

```bash
npx convex dev
```

This will push the schema and functions to your Convex deployment. Set the admin email via:

```bash
npx convex env set ADMIN_EMAILS "your-email@example.com"
```

### 4. Configure Clerk

- Create a Clerk application at [clerk.com](https://clerk.com)
- Enable Email + Google + X (Twitter) authentication methods
- Set the Clerk JWT issuer URL in `convex/auth.config.ts`

### 5. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## Project Structure

```
hypeshelf/
├── app/
│   ├── page.tsx                    # Public landing page (hero + rec grid)
│   ├── layout.tsx                  # Root layout (Convex + Clerk providers)
│   ├── globals.css                 # Global styles + design tokens
│   ├── shelf/page.tsx              # Authenticated shelf dashboard
│   ├── sign-in/[[...sign-in]]/     # Custom Clerk sign-in page
│   ├── sign-up/[[...sign-up]]/     # Custom Clerk sign-up page
│   ├── sso-callback/               # OAuth redirect handler
│   └── actions/tmdb.ts             # Server Action for TMDB movie search
├── components/
│   ├── header.tsx                  # Global header with auth state
│   ├── hero.tsx                    # Landing page hero section
│   ├── rec-grid.tsx                # Recommendation grid with infinite scroll
│   ├── rec-card.tsx                # Individual recommendation card
│   ├── filter-bar.tsx              # Genre filter tabs
│   ├── add-rec-modal.tsx           # Add recommendation dialog (TMDB search)
│   ├── convex-client-provider.tsx  # Convex + Clerk client wrapper
│   └── ui/                         # shadcn/ui primitives
├── convex/
│   ├── schema.ts                   # Database schema (recommendations, users)
│   ├── recommendations.ts          # CRUD queries + mutations with RBAC
│   ├── users.ts                    # User sync + role assignment
│   ├── auth.config.ts              # Clerk JWT provider config
│   └── seed.ts                     # Development seed data
├── lib/
│   ├── constants.ts                # Genre constants
│   ├── validation.ts               # Zod schemas for input validation
│   └── utils.ts                    # Utility functions (cn)
├── proxy.ts                        # Clerk middleware (Next.js 16 convention)
├── .env.example                    # Environment variable template
└── README.md
```

---

## Design Decisions & Trade-offs

For a detailed breakdown of architectural choices, security reasoning, and trade-offs, see **[docs/DESIGN_DECISIONS.md](./docs/DESIGN_DECISIONS.md)**.
