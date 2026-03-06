# Project Structure

Annotated directory tree for the HypeShelf codebase.

---

```
hypeshelf/
│
├── app/                                  # Next.js 16 App Router pages
│   ├── layout.tsx                        # Root layout — wraps everything in ConvexClientProvider
│   │                                     #   (ClerkProvider + ConvexProviderWithClerk + Sonner toasts)
│   ├── page.tsx                          # Public landing page
│   │                                     #   - Hero section with animated content
│   │                                     #   - RecGrid in 'landing' mode (limited display)
│   │                                     #   - Visible to anonymous users
│   ├── globals.css                       # Tailwind CSS v4 imports + custom CSS variables
│   │
│   ├── shelf/
│   │   └── page.tsx                      # Protected dashboard (requires auth)
│   │                                     #   - Full RecGrid with infinite scroll
│   │                                     #   - FilterBar (genre pills, Staff Picks, My Recs)
│   │                                     #   - Server-side redirect to /sign-in if unauthenticated
│   │
│   ├── sign-in/[[...sign-in]]/
│   │   └── page.tsx                      # Custom Clerk sign-in page
│   │                                     #   - Branded UI (not Clerk's hosted page)
│   │                                     #   - Email + Google + X OAuth buttons
│   │
│   ├── sign-up/[[...sign-up]]/
│   │   └── page.tsx                      # Custom Clerk sign-up page
│   │                                     #   - Full name field + email + OAuth
│   │                                     #   - Redirect to /shelf on success
│   │
│   ├── sso-callback/
│   │   └── page.tsx                      # OAuth redirect handler
│   │                                     #   - Clerk's AuthenticateWithRedirectCallback
│   │
│   └── actions/
│       └── tmdb.ts                       # Server Action ('use server')
│                                         #   - searchMovies(query) → top 5 TMDB results
│                                         #   - TMDB_API_KEY accessed server-side only
│                                         #   - 19-genre ID mapping (TMDB → HypeShelf genres)
│
├── components/                           # React components
│   ├── header.tsx                        # Global navbar
│   │                                     #   - Transparent on scroll-top, solid on scroll
│   │                                     #   - Auth-aware: Login/Sign up (signed out) or
│   │                                     #     "+ add your recs" CTA + ProfileDropdown (signed in)
│   │                                     #   - Mobile hamburger menu
│   │
│   ├── hero.tsx                          # Landing page hero section
│   │                                     #   - Animated text and icons with motion/react
│   │                                     #   - CTA button linking to /sign-up
│   │
│   ├── rec-grid.tsx                      # Recommendation grid with infinite scroll
│   │                                     #   - usePaginatedQuery → recommendations.getAll
│   │                                     #   - IntersectionObserver triggers loadMore(25)
│   │                                     #   - Loading skeleton (12 pulsing placeholder cards)
│   │                                     #   - Empty state ("Your shelf is empty")
│   │                                     #   - Landing mode filters client-side, shelf mode uses indexes
│   │
│   ├── rec-card.tsx                      # Individual recommendation card
│   │                                     #   - Movie poster with gradient overlay
│   │                                     #   - Half-star rating display (MovieRatingStars)
│   │                                     #   - Genre badge, author badge (DiceBear avatar)
│   │                                     #   - Staff Pick gold badge (admin-curated)
│   │                                     #   - ⋮ dropdown menu: Edit, Delete, Staff Pick toggle
│   │                                     #   - Edit dialog with full form (Zod validated)
│   │                                     #   - Delete confirmation dialog
│   │                                     #   - Expandable blurb (click to show full text)
│   │
│   ├── filter-bar.tsx                    # Genre filter pills
│   │                                     #   - 7 primary genres + "Staff Picks" + "My Recs"
│   │                                     #   - Animated pill transitions with motion/react
│   │                                     #   - Horizontal scroll on mobile
│   │
│   ├── add-rec-modal.tsx                 # Add recommendation dialog (2-step flow)
│   │                                     #   - Step 1: MovieSearch (TMDB) or "Add manually"
│   │                                     #   - Step 2: Form with pre-filled fields from TMDB
│   │                                     #   - Star rating input (0.5 precision)
│   │                                     #   - Zod validation before submission
│   │                                     #   - Custom poster URL + link fields for manual entries
│   │
│   ├── convex-client-provider.tsx        # Provider wrapper
│   │                                     #   - ClerkProvider → ConvexProviderWithClerk
│   │                                     #   - Auto-calls users.store on auth state change
│   │                                     #   - Wraps entire app for real-time subscriptions
│   │
│   ├── ui/                               # shadcn/ui primitives
│   │   ├── button.tsx                    # Button variants (default, destructive, outline, ghost)
│   │   ├── dialog.tsx                    # Dialog/modal (Radix UI)
│   │   ├── form.tsx                      # Form components with react-hook-form
│   │   ├── input.tsx                     # Text input
│   │   ├── label.tsx                     # Form label
│   │   ├── select.tsx                    # Select dropdown
│   │   ├── slider.tsx                    # Range slider
│   │   ├── sonner.tsx                    # Toast notification provider
│   │   └── textarea.tsx                  # Multi-line text input
│   │
│   ├── shared/                           # Shared custom components
│   │   ├── movie-rating-stars.tsx        # Read-only half-star display (SVG-based)
│   │   │                                 #   - Renders 5 stars with fill based on hypeScore
│   │   │                                 #   - Supports half-star precision (score 1-10 → 0.5-5 stars)
│   │   ├── movie-search.tsx              # TMDB movie search with debounce
│   │   │                                 #   - Calls Server Action for API key protection
│   │   ├── star-rating-input.tsx         # Half-star precision rating input
│   │   │                                 #   - Click left/right halves for 0.5 precision
│   │   ├── profile-dropdown.tsx          # User profile dropdown
│   │   │                                 #   - Admin badge when user role is admin
│   │   │                                 #   - Manage account + Sign out
│   │   └── rec-author-badge.tsx          # Author avatar + name badge
│   │                                     #   - DiceBear fallback avatar
│   │                                     #   - Positioned at bottom of RecCard
│   │
│   └── animate-ui/                       # Animated icon components
│       ├── icons/                        # Individual animated icons (motion/react)
│       │   ├── activity.tsx, axe.tsx, badge-check.tsx, clapperboard.tsx,
│       │   │   compass.tsx, heart.tsx, moon-star.tsx, orbit.tsx,
│       │   │   party-popper.tsx, sparkles.tsx, star.tsx
│       │   └── icon.tsx                  # Base animated icon wrapper
│       └── primitives/
│           └── animate/
│               └── slot.tsx              # Animation slot primitive
│
├── convex/                               # Convex backend (server functions + schema)
│   ├── schema.ts                         # Database schema definition
│   │                                     #   - recommendations: 10 fields, 3 indexes
│   │                                     #   - users: 4 fields, 1 index
│   │
│   ├── recommendations.ts               # Recommendation CRUD + RBAC
│   │                                     #   - getAll: paginated query with 4 filter modes
│   │                                     #   - create: auth + 6-field validation + isSafeUrl
│   │                                     #   - update: auth + ownership/admin + same validation
│   │                                     #   - remove: auth + ownership/admin check
│   │                                     #   - toggleStaffPick: admin-only
│   │
│   ├── users.ts                          # User management
│   │                                     #   - store: upsert on login, assigns role from ADMIN_EMAILS
│   │                                     #   - current: returns authenticated user or null
│   │
│   ├── auth.config.ts                    # Clerk JWT issuer configuration
│   │                                     #   - Domain and applicationID for Convex auth
│   │
│   ├── seed.ts                           # Seed mutation (admin-only)
│   │                                     #   - Auth guard: requires admin email
│   │                                     #   - Bulk inserts sample recommendations
│   │
│   ├── lib/
│   │   └── admin.ts                      # Shared admin utilities
│   │                                     #   - getAdminEmails() reads ADMIN_EMAILS env var
│   │                                     #   - isAdminEmail() checks if email is admin
│   │                                     #   - Single source of truth for admin checks
│   │
│   ├── tsconfig.json                     # Convex-specific TypeScript config
│   │
│   └── _generated/                       # Auto-generated by Convex (do not edit)
│       ├── api.d.ts, api.js             # Typed API bindings
│       ├── dataModel.d.ts               # Database model types
│       └── server.d.ts, server.js       # Server function types
│
├── lib/                                  # Shared utilities
│   ├── constants.ts                      # MOVIE_GENRES array (7 primary genres)
│   │                                     #   - Used by FilterBar for genre pill rendering
│   │
│   ├── validation.ts                     # Zod schemas
│   │                                     #   - ALLOWED_GENRES (21 total = 7 primary + 14 extended)
│   │                                     #   - recommendationSchema: title, genre, blurb, link, posterUrl, hypeScore
│   │                                     #   - safeUrlSchema: http/https only (XSS prevention)
│   │
│   └── utils.ts                          # cn() utility — clsx + tailwind-merge
│
├── hooks/
│   └── use-is-in-view.tsx                # IntersectionObserver hook
│                                         #   - Used by RecGrid for infinite scroll trigger
│
├── docs/                                 # Documentation (you are here)
│   ├── ARCHITECTURE.md                   # System architecture and data flow patterns
│   ├── BACKEND.md                        # Backend, database schema, Convex functions, TMDB integration
│   ├── SECURITY.md                       # Three-layer auth, RBAC, validation, XSS prevention
│   ├── API.md                            # Full API reference — every query/mutation
│   ├── COMPONENTS.md                     # UI component reference with props
│   ├── DESIGN_DECISIONS.md               # 8 architectural decisions with reasoning
│   ├── GETTING_STARTED.md                # Setup guide with troubleshooting
│   ├── PROJECT_STRUCTURE.md              # This file
│   └── architecture.excalidraw           # Interactive diagram (Excalidraw)
│
├── scripts/
│   └── seed.ts                           # CLI seed script
│                                         #   - Fetches real movies from TMDB discover endpoint
│                                         #   - Generates ~220 recommendations across all genres
│                                         #   - Run: npx tsx scripts/seed.ts
│
├── public/                               # Static assets (icons, images)
│
├── proxy.ts                              # Clerk middleware
│                                         #   - clerkMiddleware + createRouteMatcher
│                                         #   - Public routes: /, /sign-in, /sign-up, /sso-callback
│                                         #   - All other routes require authentication
│
├── next.config.ts                        # Next.js configuration
├── package.json                          # Dependencies and scripts
├── tsconfig.json                         # TypeScript configuration (strict)
├── postcss.config.mjs                    # PostCSS + Tailwind CSS v4
├── eslint.config.mjs                     # ESLint configuration
├── components.json                       # shadcn/ui configuration
├── pnpm-lock.yaml                        # Lockfile
└── pnpm-workspace.yaml                   # pnpm workspace config
```
