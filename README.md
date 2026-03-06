# 🌻 HypeShelf

**Collect and share the movies you're hyped about.**

A community-driven movie recommendations platform where users drop their favorite films on a shared shelf. Built with Next.js 16, Convex, and Clerk.

![Next.js](https://img.shields.io/badge/Next.js_16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Convex](https://img.shields.io/badge/Convex-FF6F00?logo=convex&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-6C47FF?logo=clerk&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)

---

## Features

| | Feature | Description |
|---|---|---|
| 🔐 | **Clerk Authentication** | Email + OAuth (Google, X) sign-in with custom auth pages |
| 🛡️ | **Role-Based Access Control** | Admin / User roles via environment-based email allowlist |
| 🎬 | **TMDB Movie Search** | Auto-fills title, poster, genre, and link from TMDB API |
| ✏️ | **Manual Entry Fallback** | Can't find a movie? Add it manually with custom details |
| ⭐ | **Hype Rating System** | Half-star precision (1–5 stars, mapped to 1–10 scale) |
| 🏅 | **Staff Picks** | Admin-curated featured recommendations with badge |
| 🔍 | **Genre Filtering** | Filter across 7 core genres + Staff Picks + My Recs |
| ♾️ | **Infinite Scroll** | Cursor-based pagination with automatic loading |
| ⚡ | **Real-time Updates** | Convex subscriptions push live data to all clients |
| 🛡️ | **Defense-in-Depth Validation** | Zod (client) + Convex runtime checks (server) |
| 🔗 | **URL Sanitization** | Blocks `javascript:` XSS via http/https-only URL validation |
| 🎨 | **Custom UI Components** | shadcn/ui + Motion animations + DiceBear avatars |
| 📱 | **Responsive Design** | Mobile-first with sidebar navigation and adaptive grid |
| 🗑️ | **Recommendation Management** | Delete own recs, admins can delete any |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Auth** | Clerk (Email + OAuth) |
| **Backend / DB** | Convex (real-time BaaS) |
| **Validation** | Zod (client) + runtime checks (server) |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **Animations** | Motion (Framer Motion) |
| **Movie Data** | TMDB API (Server Action) |
| **Avatars** | DiceBear (Notionists style) |
| **Deployment** | Vercel + Convex Cloud |

---

## Architecture

> 📐 Full interactive diagram: [`docs/architecture.excalidraw`](./docs/architecture.excalidraw) — open in [excalidraw.com](https://excalidraw.com)

```
┌─────────────────────────────────────────────────┐
│               Browser (Client)                   │
│                                                  │
│  Next.js 16 App Router                          │
│  ├── Clerk Middleware (route protection)         │
│  ├── Landing Page (public)                      │
│  ├── Auth Pages (sign-in / sign-up)             │
│  └── Shelf Dashboard (protected)                │
│                                                  │
│  Components                                      │
│  ├── Header / Hero / FilterBar                  │
│  ├── RecGrid / RecCard                          │
│  ├── AddRecModal → MovieSearch + StarRating     │
│  └── ProfileDropdown                            │
│                                                  │
│  Client Libs                                     │
│  ├── Zod validation (lib/validation.ts)         │
│  └── ConvexClientProvider (real-time sync)       │
└──────────┬──────────────────────┬───────────────┘
           │                      │
     Real-time sync          Auth flow
           │                      │
           ▼                      ▼
┌──────────────────┐   ┌──────────────────┐
│  Convex Backend   │   │     Clerk         │
│                   │◄──│  JWT verify       │
│  Tables:          │   │  Email + OAuth    │
│  • recommendations│   │  Session mgmt     │
│  • users          │   └──────────────────┘
│                   │
│  Mutations:       │   ┌──────────────────┐
│  • create/remove  │   │   TMDB API        │
│  • toggleStaffPick│◄──│   Movie search    │
│  • getAll (paginated) │   (Server Action)  │
│  • seed           │   └──────────────────┘
│                   │
│  Security:        │
│  • JWT auth       │
│  • Input sanitize │
│  • RBAC checks    │
└──────────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- [Clerk](https://clerk.com) account
- [Convex](https://convex.dev) account
- [TMDB API key](https://developer.themoviedb.org)

### 1. Clone & install

```bash
git clone <your-repo-url>
cd hypeshelf
pnpm install
```

### 2. Environment variables

Create `.env.local` with:

```env
NEXT_PUBLIC_CONVEX_URL=<your-convex-url>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-key>
CLERK_SECRET_KEY=<your-clerk-secret>
TMDB_API_KEY=<your-tmdb-key>
```

### 3. Set up Convex

```bash
npx convex dev
```

Set admin email:

```bash
npx convex env set ADMIN_EMAILS "your-email@example.com"
```

### 4. Configure Clerk

- Create a Clerk app at [clerk.com](https://clerk.com)
- Enable Email + Google + X authentication
- Set the JWT issuer URL in `convex/auth.config.ts`

### 5. Seed data (optional)

```bash
npx tsx scripts/seed.ts
```

### 6. Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
hypeshelf/
├── app/
│   ├── page.tsx                   # Public landing (hero + rec grid)
│   ├── layout.tsx                 # Root layout (providers)
│   ├── shelf/page.tsx             # Authenticated dashboard
│   ├── sign-in/[[...sign-in]]/    # Custom sign-in
│   ├── sign-up/[[...sign-up]]/    # Custom sign-up
│   ├── sso-callback/              # OAuth redirect
│   └── actions/tmdb.ts            # TMDB Server Action
├── components/
│   ├── header.tsx                 # Nav + auth state
│   ├── hero.tsx                   # Landing hero
│   ├── rec-grid.tsx               # Grid + infinite scroll
│   ├── rec-card.tsx               # Movie card
│   ├── filter-bar.tsx             # Genre filters
│   ├── add-rec-modal.tsx          # Add rec dialog
│   ├── convex-client-provider.tsx # Convex + Clerk wrapper
│   ├── shared/                    # Reusable components
│   │   ├── movie-search.tsx       # TMDB search widget
│   │   ├── star-rating-input.tsx  # Half-star rating
│   │   ├── movie-rating-stars.tsx # Display stars
│   │   ├── rec-author-badge.tsx   # Author avatar badge
│   │   └── profile-dropdown.tsx   # User dropdown
│   └── ui/                        # shadcn/ui primitives
├── convex/
│   ├── schema.ts                  # DB schema
│   ├── recommendations.ts         # CRUD + RBAC
│   ├── users.ts                   # User sync + roles
│   ├── auth.config.ts             # Clerk JWT config
│   └── seed.ts                    # Seed mutation
├── lib/
│   ├── constants.ts               # Genre constants
│   ├── validation.ts              # Zod schemas
│   └── utils.ts                   # Utilities (cn)
├── docs/                          # Documentation
├── proxy.ts                       # Clerk middleware
└── scripts/seed.ts                # Seed script
```

---

## Documentation

For detailed documentation, see the **[docs/](./docs/)** folder:

- [**Architecture**](./docs/architecture.excalidraw) — Interactive system diagram (Excalidraw)
- [**Design Decisions**](./docs/DESIGN_DECISIONS.md) — Architectural choices & trade-offs
- [**Security**](./docs/SECURITY.md) — Validation, RBAC, and XSS prevention
- [**Components**](./docs/COMPONENTS.md) — UI component reference
- [**Database**](./docs/DATABASE.md) — Schema, indexes, and data flow

---

## License

MIT
