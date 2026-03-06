# HypeShelf

**A community-driven movie recommendation platform where users share the films they're hyped about on a real-time, collaborative shelf.**

Built with Next.js 16, Convex, Clerk, and the TMDB API — not a standard CRUD app with a movie paint job.

![Next.js](https://img.shields.io/badge/Next.js_16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-FF6F00?logo=convex&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?logo=clerk&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)

---

## What Makes This Different

- **Real movie data** — TMDB API integration auto-fills title, poster, genre, and year. Users search for actual movies instead of typing everything manually.
- **Half-star precision** — 0.5-step star ratings (1–5 stars mapped to 1–10 internal score), not just whole numbers.
- **True real-time** — Convex WebSocket subscriptions, not polling. Every create/edit/delete pushes to all connected clients instantly.
- **Full CRUD with RBAC** — Users edit/delete their own recs. Admins edit/delete anyone's. Authorization enforced server-side.
- **Generated identity** — Every user gets a unique DiceBear Notionists-style avatar as fallback.
- **Infinite scroll** — IntersectionObserver + cursor-based pagination, not a "Load More" button.
- **Server Action for TMDB** — API key never reaches the client bundle.
- **Independent dual validation** — Zod on client + Convex runtime checks on server. Neither trusts the other.

---

## Features

Ordered by impact.

- **TMDB Movie Search** — Search TMDB to auto-fill title, poster, genre, and year in 2 clicks
- **Half-Star Rating System** — 0.5-precision star input (1–5 stars) mapped to a 1–10 internal hype score
- **Real-time Collaborative Shelf** — Convex WebSocket subscriptions push every change to all clients instantly
- **Full CRUD** — Create, edit, and delete recommendations. Users manage their own; admins manage all.
- **Staff Picks Curation** — Admins mark standout recs with a gold Staff Pick badge
- **Role-Based Access Control** — Admin/User roles via server-side email allowlist with zero UI attack surface
- **Genre Filtering** — 21 filterable genres (8 primary + 13 extended from TMDB) with animated pill UI
- **Cursor-Based Infinite Scroll** — IntersectionObserver triggers automatic page loads
- **Defense-in-Depth Validation** — Zod schemas on client + independent Convex runtime checks on server
- **Clerk Authentication** — Email + Google + X OAuth with fully custom sign-in/sign-up pages
- **DiceBear Avatar Generation** — Notionists-style unique avatars from username seeds
- **Motion Animations** — Framer Motion card transitions, hero animations, animated filter pills
- **XSS-Safe URL Handling** — `link` and `posterUrl` validated against `javascript:` injection on both layers
- **Manual Entry Fallback** — Movies not in TMDB can be added with fully manual fields
- **Responsive Grid Layout** — Mobile-first 1→2→3→4 column grid with adaptive header

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) | Server Components + Server Actions for TMDB |
| **Language** | TypeScript (strict) | End-to-end type safety from schema to UI |
| **Auth** | Clerk (`@clerk/nextjs`) | Email + OAuth + JWT + custom pages |
| **Backend + DB** | Convex | Real-time BaaS with WebSocket subscriptions |
| **Validation** | Zod 4 + Convex runtime | Defense-in-depth — neither layer trusts the other |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first + accessible Radix primitives |
| **Animations** | motion/react (Framer Motion) | Declarative animations for cards, filters, hero |
| **Movie Data** | TMDB API via Server Action | Real metadata without exposing API key |
| **Avatars** | DiceBear (Notionists) | Unique generated avatars from username seeds |
| **Forms** | react-hook-form + @hookform/resolvers | Performant forms with Zod schema integration |

---

## Architecture

> Full architecture details, data flow patterns, and service dependencies: **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**

![Architecture Diagram](./docs/image.png)

---

## Security & RBAC

> Full security documentation: **[docs/SECURITY.md](./docs/SECURITY.md)**

Three-layer auth — no single layer is the boundary:

| Layer | Where | What |
|---|---|---|
| Clerk Middleware | Edge (`proxy.ts`) | Blocks unauthenticated `/shelf` access |
| Server Redirect | `app/shelf/page.tsx` | Second defense if middleware misconfigured |
| Convex JWT | Every mutation | Independent JWT verification via Clerk JWKS |

**Permission Matrix:**

| Action | Anonymous | User | Admin |
|---|---|---|---|
| Browse landing page | Yes | Yes | Yes |
| View recommendations | No | Yes | Yes |
| Create recommendation | No | Yes | Yes |
| Edit own recommendation | No | Yes | Yes |
| Edit any recommendation | No | No | Yes |
| Delete own recommendation | No | Yes | Yes |
| Delete any recommendation | No | No | Yes |
| Toggle Staff Pick | No | No | Yes |

---

## Getting Started

> Full setup guide with troubleshooting: **[docs/GETTING_STARTED.md](./docs/GETTING_STARTED.md)**

Quick start:

```bash
git clone https://github.com/PranitPatil03/hypeshelf.git
cd hypeshelf
pnpm install
```

Create `.env.local`:

```env
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-key>
CLERK_SECRET_KEY=<your-clerk-secret>
TMDB_API_KEY=<your-tmdb-key>
```

```bash
npx convex dev                    # Start Convex (deploys schema + functions)
npx convex env set ADMIN_EMAILS "your-email@example.com"
npx convex env set CLERK_JWT_ISSUER_DOMAIN "https://<domain>.clerk.accounts.dev"
npx tsx scripts/seed.ts           # Optional: seed 220+ recs
pnpm dev                          # Start Next.js
```

---

## Project Structure

> Full annotated tree: **[docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)**

```
hypeshelf/
├── app/                    # Next.js pages (landing, shelf, auth, SSO callback)
│   └── actions/tmdb.ts     # TMDB Server Action
├── components/             # UI components (RecGrid, RecCard, FilterBar, AddRecModal, etc.)
│   ├── ui/                 # shadcn/ui primitives
│   ├── ui-custom/          # Half-star display, author badge
│   └── animate-ui/         # Motion-animated icons
├── convex/                 # Backend: schema, recommendations CRUD, users, auth config
├── lib/                    # Constants, Zod validation schemas, utilities
├── hooks/                  # IntersectionObserver hook
├── docs/                   # Detailed documentation (markdown)
├── scripts/seed.ts         # Database seeding script
└── proxy.ts                # Clerk middleware (route protection)
```

---

## Documentation

| Document | What's Inside |
|---|---|
| [**Getting Started**](./docs/GETTING_STARTED.md) | Prerequisites, env vars, Clerk/Convex setup, seeding, troubleshooting |
| [**Architecture**](./docs/ARCHITECTURE.md) | System diagram, 6 data flow patterns, real-time model, service dependencies |
| [**Backend**](./docs/BACKEND.md) | Database schema, Convex functions, pagination, TMDB integration, seed data |
| [**Security**](./docs/SECURITY.md) | Three-layer auth, RBAC, dual validation, XSS prevention, API key protection |
| [**API Reference**](./docs/API.md) | Every query/mutation — args, returns, auth, authorization logic |
| [**Components**](./docs/COMPONENTS.md) | UI component reference — props, behavior, composition |
| [**Design Decisions**](./docs/DESIGN_DECISIONS.md) | 8 architectural decisions with reasoning and trade-offs |
| [**Project Structure**](./docs/PROJECT_STRUCTURE.md) | Full annotated directory tree |
| [**Excalidraw Diagram**](./docs/architecture.excalidraw) | Interactive architecture diagram — open at [excalidraw.com](https://excalidraw.com) |
