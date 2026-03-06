import Link from 'next/link';
import { ArrowRight, Database, Layers, Shield } from 'lucide-react';

const docPages = [
  { href: '/docs/architecture', icon: Layers, title: 'Architecture', desc: 'System diagram, data flow, and how all services connect.' },
  { href: '/docs/backend', icon: Database, title: 'Backend & Database', desc: 'Convex schema, tables, indexes, mutations, queries, and real-time architecture.' },
  { href: '/docs/security', icon: Shield, title: 'Auth & Security', desc: 'Three-layer auth, RBAC, input validation, URL sanitization, and data protection.' },
];

export default function DocsOverview() {
  return (
    <div className="space-y-14">
      {/* Hero */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <img src="/icons/sunflower.png" alt="" width={36} height={36} />
          <span className="text-xs font-medium uppercase tracking-wider text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">v1.0</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-semibold text-slate-900 tracking-tight leading-tight">
          hypeshelf docs
        </h1>
        <p className="text-base text-slate-500 mt-4 max-w-2xl leading-relaxed">
          A community-driven movie recommendation platform where film lovers collect, rate, and share the movies they&apos;re hyped about. Built with Next.js 16, Convex, Clerk, and TypeScript.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400 mb-4">Documentation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {docPages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="group flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="p-2 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                <page.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">{page.title}</h3>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{page.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400 mb-4">Features</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <tbody className="divide-y divide-slate-100">
              <FeatureRow icon="🔐" title="Clerk Authentication" desc="Email + OAuth (Google, X) sign-in with custom auth pages" />
              <FeatureRow icon="🛡️" title="Role-Based Access Control" desc="Admin / User roles via environment-based email allowlist" />
              <FeatureRow icon="🎬" title="TMDB Movie Search" desc="Auto-fills title, poster, genre, and link from TMDB API" />
              <FeatureRow icon="✏️" title="Manual Entry Fallback" desc="Can&#39;t find a movie? Add it manually with custom details" />
              <FeatureRow icon="⭐" title="Hype Rating System" desc="Half-star precision (1–5 stars, mapped to 1–10 scale)" />
              <FeatureRow icon="🏅" title="Staff Picks" desc="Admin-curated featured recommendations with badge" />
              <FeatureRow icon="🔍" title="Genre Filtering" desc="Filter across 7 core genres + Staff Picks + My Recs" />
              <FeatureRow icon="♾️" title="Infinite Scroll" desc="Cursor-based pagination with automatic loading" />
              <FeatureRow icon="⚡" title="Real-time Updates" desc="Convex subscriptions push live data to all clients" />
              <FeatureRow icon="🔗" title="URL Sanitization" desc="Blocks javascript: XSS via http/https-only URL validation" />
              <FeatureRow icon="🎨" title="Custom UI Components" desc="shadcn/ui + Motion animations + DiceBear avatars" />
              <FeatureRow icon="📱" title="Responsive Design" desc="Mobile-first with sidebar navigation and adaptive grid" />
            </tbody>
          </table>
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400 mb-4">Tech Stack</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Layer</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Technology</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TechRow layer="Framework" tech="Next.js 16 (App Router, Turbopack)" />
              <TechRow layer="Language" tech="TypeScript" />
              <TechRow layer="Auth" tech="Clerk (Email + OAuth)" />
              <TechRow layer="Backend / DB" tech="Convex (real-time BaaS)" />
              <TechRow layer="Validation" tech="Zod (client) + runtime checks (server)" />
              <TechRow layer="Styling" tech="Tailwind CSS v4 + shadcn/ui" />
              <TechRow layer="Animations" tech="Motion (Framer Motion)" />
              <TechRow layer="Movie Data" tech="TMDB API (Server Action)" />
              <TechRow layer="Avatars" tech="DiceBear (Notionists style)" />
              <TechRow layer="Deployment" tech="Vercel + Convex Cloud" />
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Structure */}
      <div>
        <h2 className="text-sm font-medium uppercase tracking-wider text-slate-400 mb-4">Project Structure</h2>
        <div className="rounded-xl bg-slate-950 p-5 sm:p-6 overflow-x-auto">
          <pre className="text-[12.5px] text-slate-300 leading-relaxed font-mono">
            {`hypeshelf/
├── app/
│   ├── layout.tsx                   # Root layout (Clerk + Convex providers, Toaster)
│   ├── page.tsx                     # Public landing page (hero + rec grid)
│   ├── globals.css                  # Tailwind v4 base styles + custom utilities
│   ├── shelf/
│   │   └── page.tsx                 # Authenticated dashboard (filters + infinite scroll)
│   ├── sign-in/[[...sign-in]]/
│   │   └── page.tsx                 # Custom Clerk sign-in page
│   ├── sign-up/[[...sign-up]]/
│   │   └── page.tsx                 # Custom Clerk sign-up (with full name field)
│   ├── sso-callback/
│   │   └── page.tsx                 # OAuth redirect handler
│   ├── docs/
│   │   ├── layout.tsx               # Docs layout (sidebar + header)
│   │   ├── page.tsx                 # Docs overview (this page)
│   │   ├── architecture/page.tsx    # System architecture + data flow
│   │   ├── backend/page.tsx         # Convex backend + database docs
│   │   └── security/page.tsx        # Auth & security docs
│   └── actions/
│       └── tmdb.ts                  # TMDB search Server Action ('use server')
│
├── components/
│   ├── header.tsx                   # Global nav (auth-aware, mobile sidebar)
│   ├── hero.tsx                     # Landing hero section with CTA
│   ├── rec-grid.tsx                 # Infinite scroll grid (IntersectionObserver)
│   ├── rec-card.tsx                 # Movie recommendation card (poster + rating)
│   ├── filter-bar.tsx               # Genre filter tabs (7 genres + Staff Picks + My Recs)
│   ├── add-rec-modal.tsx            # Add recommendation dialog (search → form flow)
│   ├── convex-client-provider.tsx   # Convex + Clerk provider wrapper
│   ├── docs-sidebar.tsx             # Docs header + sidebar navigation
│   ├── shared/
│   │   ├── movie-search.tsx         # TMDB movie search widget (debounced)
│   │   ├── star-rating-input.tsx    # Half-star rating input (0.5–5)
│   │   ├── movie-rating-stars.tsx   # Display-only star rating component
│   │   ├── rec-author-badge.tsx     # Author name + DiceBear avatar badge
│   │   └── profile-dropdown.tsx     # User profile dropdown (sign out, avatar)
│   └── ui/                          # shadcn/ui primitives (button, dialog, form, etc.)
│
├── convex/
│   ├── schema.ts                    # Database schema (recommendations + users)
│   ├── recommendations.ts           # CRUD + RBAC (getAll, create, remove, toggleStaffPick)
│   ├── users.ts                     # User sync + role assignment (store, current)
│   ├── auth.config.ts               # Clerk JWT issuer configuration
│   ├── seed.ts                      # Database seed mutation (~220 recommendations)
│   └── _generated/                  # Auto-generated types (do not edit)
│
├── lib/
│   ├── constants.ts                 # Genre list (7 core) + MovieGenre type
│   ├── validation.ts                # Zod schemas + 21-genre allowlist + URL safety
│   └── utils.ts                     # Utility functions (cn helper)
│
├── hooks/
│   └── use-is-in-view.tsx           # IntersectionObserver hook for infinite scroll
│
├── docs/                            # Markdown documentation files
│   ├── DESIGN_DECISIONS.md          # Architectural decisions & trade-offs
│   ├── SECURITY.md                  # Security documentation
│   ├── COMPONENTS.md                # Component reference
│   └── DATABASE.md                  # Schema & data flow
│
├── scripts/
│   └── seed.ts                      # External seed script (tsx runner)
│
├── proxy.ts                         # Clerk middleware (route protection)
├── next.config.ts                   # Next.js configuration
├── package.json                     # Dependencies + scripts (pnpm)
├── tsconfig.json                    # TypeScript configuration
└── components.json                  # shadcn/ui configuration`}
          </pre>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <tr>
      <td className="px-4 py-2.5 text-center w-10 text-base">{icon}</td>
      <td className="px-2 py-2.5 font-semibold text-slate-900 text-[13px] whitespace-nowrap">{title}</td>
      <td className="px-4 py-2.5 text-xs text-slate-500">{desc}</td>
    </tr>
  );
}

function TechRow({ layer, tech }: { layer: string; tech: string }) {
  return (
    <tr>
      <td className="px-4 py-2.5 font-semibold text-slate-900 text-[13px]">{layer}</td>
      <td className="px-4 py-2.5 text-sm text-slate-600">{tech}</td>
    </tr>
  );
}
