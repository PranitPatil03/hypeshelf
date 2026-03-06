# Components

Reference for all UI components in HypeShelf, organized by category.

---

## Page Components

### `app/page.tsx` — Landing Page

The public-facing homepage. Redirects authenticated users to `/shelf`.

- Renders full-bleed background image, hero section, and recommendation grid
- Sticky genre filter bar below the hero
- Uses `RecGrid` in `mode="landing"` for public browsing

### `app/shelf/page.tsx` — Shelf Dashboard

The authenticated user's dashboard. Redirects to `/sign-in` if not logged in.

- Full-height layout with fixed header
- Genre filtering with "My Recs" tab (user's own recommendations)
- Uses `RecGrid` in `mode="shelf"` with overflow scrolling

### `app/sign-in/[[...sign-in]]/page.tsx` — Sign In

Custom Clerk sign-in page with email/password + OAuth (Google, X).

### `app/sign-up/[[...sign-up]]/page.tsx` — Sign Up

Custom sign-up with full name field that passes `firstName`/`lastName` to Clerk.

---

## Layout Components

### `Header`

**File:** `components/header.tsx`

Global navigation header. Supports two modes:

| Prop | Type | Default | Description |
|---|---|---|---|
| `transparentOnTop` | `boolean` | `false` | When true, header starts transparent and turns solid on scroll |

**Behavior:**
- Signed out: Shows Login, Sign up links, and "add your recs" CTA
- Signed in: Shows "add your recs" button + `ProfileDropdown`
- Mobile: Hamburger menu with slide-in sidebar
- Animates logo on landing page with Motion fade-in

### `Hero`

**File:** `components/hero.tsx`

Landing page hero section with staggered fade-in animations.

- Tagline: "Good taste deserves a better home."
- Subtitle + CTA button
- Uses Motion `initial`/`animate` with blur transitions

---

## Data Components

### `RecGrid`

**File:** `components/rec-grid.tsx`

Main recommendation grid with infinite scroll.

| Prop | Type | Description |
|---|---|---|
| `genre` | `string?` | Active genre filter |
| `mode` | `'landing' \| 'shelf'` | Controls layout and scrolling behavior |

**Features:**
- Uses `usePaginatedQuery` from Convex (cursor-based pagination)
- IntersectionObserver triggers `loadMore` at bottom
- Loading skeleton state with 12 pulsing placeholder cards
- Empty state with "Your shelf is empty" message

### `RecCard`

**File:** `components/rec-card.tsx`

Individual movie recommendation card.

**Features:**
- Poster image with hover zoom effect
- Title links to TMDB/external URL
- Star rating display + genre badge
- Expandable review text (click to toggle)
- Author badge with DiceBear avatar
- Staff Pick tooltip badge (top-right)
- Context menu (owner/admin): Delete + Toggle Staff Pick
- Delete confirmation dialog

### `FilterBar`

**File:** `components/filter-bar.tsx`

Horizontal scrollable genre filter tabs.

| Prop | Type | Description |
|---|---|---|
| `activeGenre` | `string` | Currently selected genre |
| `basePath` | `string` | Base URL for filter links (`/` or `/shelf`) |
| `showMyRecs` | `boolean` | Whether to show "My Recs" tab |

**Genres:** All Movies, Staff Picks, Action, Comedy, Sci-Fi, Horror, Thriller, Drama, Romance

Each genre has a custom PNG icon from `/public/icons/`.

### `AddRecModal`

**File:** `components/add-rec-modal.tsx`

Dialog for adding a new recommendation. Two-step flow:

1. **Search step:** `MovieSearch` component with TMDB integration
2. **Form step:** Movie info preview + star rating + review textarea

**Validation:** Runs Zod schema before submitting to Convex mutation.

---

## Shared Components (`components/shared/`)

### `MovieSearch`

**File:** `components/shared/movie-search.tsx`

TMDB-powered movie search with animated UI.

- Debounced search (500ms)
- Animated search bar with focus glow
- Staggered result list with poster thumbnails
- "Can't find it? Add manually" fallback
- Empty state shows manual add option

### `StarRatingInput`

**File:** `components/shared/star-rating-input.tsx`

Half-star precision rating input using custom star PNGs.

| Prop | Type | Description |
|---|---|---|
| `value` | `number` | Current rating (0.5–5) |
| `onChange` | `(value: number) => void` | Rating change handler |

Each star has left/right click zones for half-star precision. Uses `/icons/star.png` and `/icons/star-half.png`.

### `MovieRatingStars`

**File:** `components/shared/movie-rating-stars.tsx`

Read-only star display for recommendation cards.

| Prop | Type | Description |
|---|---|---|
| `hypeScore` | `number` | Score from 1–10, mapped to 1–5 stars |

Uses Lucide `Star` icons with amber fill for active stars.

### `RecAuthorBadge`

**File:** `components/shared/rec-author-badge.tsx`

Author attribution badge shown at the bottom of each rec card.

| Prop | Type | Description |
|---|---|---|
| `authorName` | `string` | Display name |
| `avatarUrl` | `string?` | Avatar URL, falls back to DiceBear |

### `ProfileDropdown`

**File:** `components/shared/profile-dropdown.tsx`

User profile dropdown menu with Clerk integration.

- Avatar button (DiceBear fallback if no Clerk image)
- User name + email display
- "Manage account" → opens Clerk profile
- "Sign out" with loading state
- Click-outside to close

---

## Infrastructure Components

### `ConvexClientProvider`

**File:** `components/convex-client-provider.tsx`

Wraps the app with Clerk + Convex providers. Also contains `ConvexSyncUser` which automatically calls the `users.store` mutation when a user authenticates, ensuring the Convex user record stays in sync with Clerk.

---

## UI Primitives (`components/ui/`)

shadcn/ui components used throughout:

| Component | Usage |
|---|---|
| `Button` | Form actions, CTAs |
| `Dialog` | Add rec modal, delete confirmation |
| `Input` | Manual entry fields |
| `Textarea` | Review input |
| `Tooltip` | Staff Pick badge |
| `Select` | Genre selection (admin) |
| `Slider` | Rating input (unused, replaced by star PNGs) |
| `Sonner` | Toast notifications |
| `Form` | Form state management |
| `Label` | Form field labels |
