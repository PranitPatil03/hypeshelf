export default function ArchitecturePage() {
  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <span>Docs</span>
          <span>›</span>
          <span className="text-slate-600 font-medium">Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">System Architecture</h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">
          Complete system design showing how the frontend, Convex backend, and external services interact in real-time.
        </p>
      </div>

      {/* SVG Architecture Diagram */}
      <div className="rounded-xl border border-slate-200 bg-[#0d1117] p-4 sm:p-6 overflow-x-auto">
        <svg viewBox="0 0 1100 720" className="w-full min-w-[700px]" xmlns="http://www.w3.org/2000/svg">
          {/* Defs */}
          <defs>
            <marker id="arrow-right" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="none" stroke="#64748b" strokeWidth="1.5" />
            </marker>
            <marker id="arrow-left" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
              <path d="M8,0 L0,3 L8,6" fill="none" stroke="#64748b" strokeWidth="1.5" />
            </marker>
            <marker id="arrow-down" markerWidth="6" markerHeight="8" refX="3" refY="8" orient="auto">
              <path d="M0,0 L3,8 L6,0" fill="none" stroke="#64748b" strokeWidth="1.5" />
            </marker>
          </defs>

          {/* Title */}
          <text x="550" y="30" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600" letterSpacing="2" fontFamily="ui-monospace, monospace">HYPESHELF — SYSTEM ARCHITECTURE</text>

          {/* ====== BROWSER / CLIENT ====== */}
          <rect x="30" y="55" width="330" height="620" rx="12" fill="#111827" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.8" />
          <text x="50" y="80" fill="#60a5fa" fontSize="10" fontWeight="700" letterSpacing="2" fontFamily="ui-monospace, monospace">⬡ FRONTEND</text>
          <text x="285" y="80" fill="#475569" fontSize="9" fontFamily="ui-monospace, monospace">Next.js 16</text>

          {/* Clerk Middleware */}
          <rect x="55" y="100" width="280" height="52" rx="8" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1" />
          <text x="70" y="122" fill="#a78bfa" fontSize="11" fontWeight="600" fontFamily="system-ui">🔐 Clerk Middleware</text>
          <text x="70" y="140" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Route protection — JWT injection on every request</text>

          {/* App Router */}
          <rect x="55" y="168" width="280" height="70" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="70" y="190" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="system-ui">📄 App Router</text>
          <text x="70" y="206" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">/ → Landing (public, SSR)</text>
          <text x="70" y="220" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">/shelf → Dashboard (protected)</text>

          {/* React UI Components */}
          <rect x="55" y="254" width="280" height="90" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="70" y="276" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="system-ui">🎬 React Components</text>
          <text x="70" y="294" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">RecGrid → infinite scroll (IntersectionObserver)</text>
          <text x="70" y="308" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">RecCard → poster, rating, review, actions</text>
          <text x="70" y="322" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">AddRecModal → search + form (2-step flow)</text>

          {/* State & Hooks */}
          <rect x="55" y="360" width="280" height="60" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="70" y="382" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="system-ui">⚛️ Convex React Hooks</text>
          <text x="70" y="398" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">useQuery, useMutation, usePaginatedQuery</text>
          <text x="70" y="410" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Real-time subscriptions via WebSocket</text>

          {/* Zod Validation */}
          <rect x="55" y="436" width="134" height="48" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="70" y="458" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="system-ui">✅ Zod</text>
          <text x="70" y="472" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Client validation</text>

          {/* Server Action */}
          <rect x="201" y="436" width="134" height="48" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="215" y="458" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="system-ui">🔍 Server Action</text>
          <text x="215" y="472" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">TMDB search</text>

          {/* UI layer */}
          <rect x="55" y="500" width="280" height="52" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="70" y="522" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="system-ui">🎨 UI Layer</text>
          <text x="70" y="538" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">shadcn/ui · motion/react · Tailwind CSS v4</text>

          {/* FilterBar */}
          <rect x="55" y="568" width="280" height="52" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="70" y="590" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="system-ui">🏷️ Genre Filter</text>
          <text x="70" y="606" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">7 genres + Staff Picks + My Recs tabs</text>

          {/* Star Rating */}
          <rect x="55" y="636" width="280" height="30" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="70" y="656" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">⭐ Half-star rating input (0.5–5 precision)</text>

          {/* ====== CONVEX BACKEND ====== */}
          <rect x="420" y="55" width="300" height="620" rx="12" fill="#111827" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.8" />
          <text x="440" y="80" fill="#34d399" fontSize="10" fontWeight="700" letterSpacing="2" fontFamily="ui-monospace, monospace">⚡ BACKEND</text>
          <text x="640" y="80" fill="#475569" fontSize="9" fontFamily="ui-monospace, monospace">Convex Cloud</text>

          {/* Query Engine */}
          <rect x="445" y="100" width="250" height="70" rx="8" fill="#052e16" stroke="#16a34a" strokeWidth="1" />
          <text x="460" y="122" fill="#4ade80" fontSize="11" fontWeight="600" fontFamily="system-ui">📡 Query Engine</text>
          <text x="460" y="140" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Reactive subscriptions for all clients</text>
          <text x="460" y="156" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Push updates via persistent WebSocket</text>

          {/* Mutation Engine */}
          <rect x="445" y="186" width="250" height="70" rx="8" fill="#052e16" stroke="#16a34a" strokeWidth="1" />
          <text x="460" y="208" fill="#4ade80" fontSize="11" fontWeight="600" fontFamily="system-ui">⚙️ Mutation Engine</text>
          <text x="460" y="226" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">ACID transactions on every write</text>
          <text x="460" y="242" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">create, remove, toggleStaffPick, store</text>

          {/* Auth Validation */}
          <rect x="445" y="272" width="250" height="52" rx="8" fill="#1a0f2e" stroke="#7c3aed" strokeWidth="1" />
          <text x="460" y="294" fill="#a78bfa" fontSize="11" fontWeight="600" fontFamily="system-ui">🛡️ Auth Verification</text>
          <text x="460" y="312" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">ctx.auth.getUserIdentity() — Clerk JWT</text>

          {/* Server Validation */}
          <rect x="445" y="340" width="250" height="68" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="460" y="362" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="system-ui">🔒 Server Validation</text>
          <text x="460" y="380" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Genre allowlist · URL sanitization</text>
          <text x="460" y="394" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Length limits · hypeScore range (1–10)</text>

          {/* Database — recommendations */}
          <rect x="445" y="424" width="250" height="88" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
          <text x="460" y="446" fill="#fbbf24" fontSize="11" fontWeight="600" fontFamily="system-ui">🗄️ recommendations</text>
          <text x="460" y="462" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">title, genre, blurb, hypeScore, posterUrl</text>
          <text x="460" y="476" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">userId, userName, userAvatar, isStaffPick</text>
          <text x="460" y="496" fill="#475569" fontSize="9" fontFamily="ui-monospace, monospace">idx: by_genre · by_userId · by_staffPick</text>

          {/* Database — users */}
          <rect x="445" y="528" width="250" height="68" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
          <text x="460" y="550" fill="#fbbf24" fontSize="11" fontWeight="600" fontFamily="system-ui">👤 users</text>
          <text x="460" y="566" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">clerkId, role (user | admin), name, email</text>
          <text x="460" y="582" fill="#475569" fontSize="9" fontFamily="ui-monospace, monospace">idx: by_clerkId</text>

          {/* Pagination */}
          <rect x="445" y="612" width="250" height="52" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="460" y="634" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="system-ui">📊 Cursor Pagination</text>
          <text x="460" y="650" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Built-in paginator with cursor tokens</text>

          {/* ====== EXTERNAL SERVICES ====== */}
          <rect x="780" y="55" width="290" height="420" rx="12" fill="#111827" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.8" />
          <text x="800" y="80" fill="#fbbf24" fontSize="10" fontWeight="700" letterSpacing="2" fontFamily="ui-monospace, monospace">🌐 EXTERNAL SERVICES</text>

          {/* Clerk */}
          <rect x="805" y="100" width="240" height="100" rx="8" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="1" />
          <text x="820" y="122" fill="#a78bfa" fontSize="11" fontWeight="600" fontFamily="system-ui">🔑 Clerk</text>
          <text x="820" y="140" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">OAuth: Google, X (Twitter)</text>
          <text x="820" y="156" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Email/password authentication</text>
          <text x="820" y="172" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">JWT token issuance &amp; session mgmt</text>
          <text x="820" y="188" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">JWKS endpoint for Convex verification</text>

          {/* TMDB API */}
          <rect x="805" y="216" width="240" height="80" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="820" y="238" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="system-ui">🎞️ TMDB API</text>
          <text x="820" y="256" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Movie search (title, poster, genres)</text>
          <text x="820" y="272" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Genre ID → name mapping (19 genres)</text>
          <text x="820" y="288" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Called via Next.js Server Action</text>

          {/* DiceBear */}
          <rect x="805" y="312" width="240" height="60" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <text x="820" y="334" fill="#e2e8f0" fontSize="11" fontWeight="600" fontFamily="system-ui">👾 DiceBear</text>
          <text x="820" y="352" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Notionists-style avatar generation</text>
          <text x="820" y="366" fill="#6b7280" fontSize="9.5" fontFamily="system-ui">Fallback when no Clerk profile image</text>

          {/* ====== CONNECTION ARROWS ====== */}

          {/* Frontend ↔ Convex: WebSocket */}
          <line x1="335" y1="390" x2="445" y2="135" stroke="#10b981" strokeWidth="1.5" markerEnd="url(#arrow-right)" opacity="0.7" />
          <text x="368" y="240" fill="#34d399" fontSize="8.5" fontWeight="600" transform="rotate(-40, 368, 240)" fontFamily="ui-monospace, monospace">WebSocket</text>

          {/* Frontend ← Convex: Real-time push */}
          <line x1="445" y1="155" x2="335" y2="305" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#arrow-left)" opacity="0.5" />

          {/* Frontend → Convex: Mutations */}
          <line x1="335" y1="300" x2="445" y2="220" stroke="#64748b" strokeWidth="1" markerEnd="url(#arrow-right)" opacity="0.5" />
          <text x="370" y="278" fill="#64748b" fontSize="8" fontFamily="ui-monospace, monospace">mutations</text>

          {/* Convex → Clerk: JWT verify */}
          <line x1="695" y1="298" x2="805" y2="165" stroke="#7c3aed" strokeWidth="1.5" markerEnd="url(#arrow-right)" opacity="0.6" />
          <text x="730" y="218" fill="#7c3aed" fontSize="8" fontWeight="600" transform="rotate(-30, 730, 218)" fontFamily="ui-monospace, monospace">JWT verify</text>

          {/* Frontend middleware → Clerk */}
          <line x1="335" y1="126" x2="805" y2="126" stroke="#7c3aed" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#arrow-right)" opacity="0.4" />
          <text x="565" y="118" fill="#7c3aed" fontSize="8" fontFamily="ui-monospace, monospace">session check</text>

          {/* Server Action → TMDB */}
          <line x1="335" y1="460" x2="805" y2="260" stroke="#64748b" strokeWidth="1" strokeDasharray="4 3" markerEnd="url(#arrow-right)" opacity="0.4" />
          <text x="550" y="372" fill="#64748b" fontSize="8" transform="rotate(-18, 550, 372)" fontFamily="ui-monospace, monospace">Server Action → search movies</text>

          {/* Legend */}
          <rect x="780" y="500" width="290" height="170" rx="12" fill="#111827" stroke="#334155" strokeWidth="1" />
          <text x="800" y="524" fill="#94a3b8" fontSize="10" fontWeight="700" letterSpacing="1.5" fontFamily="ui-monospace, monospace">LEGEND</text>
          <line x1="800" y1="540" x2="835" y2="540" stroke="#10b981" strokeWidth="1.5" />
          <text x="845" y="544" fill="#6b7280" fontSize="9" fontFamily="system-ui">WebSocket (real-time)</text>
          <line x1="800" y1="560" x2="835" y2="560" stroke="#10b981" strokeWidth="1.5" strokeDasharray="5 3" />
          <text x="845" y="564" fill="#6b7280" fontSize="9" fontFamily="system-ui">Real-time push updates</text>
          <line x1="800" y1="580" x2="835" y2="580" stroke="#7c3aed" strokeWidth="1.5" />
          <text x="845" y="584" fill="#6b7280" fontSize="9" fontFamily="system-ui">Auth / JWT flow</text>
          <line x1="800" y1="600" x2="835" y2="600" stroke="#64748b" strokeWidth="1" strokeDasharray="4 3" />
          <text x="845" y="604" fill="#6b7280" fontSize="9" fontFamily="system-ui">API request (REST)</text>
          <rect x="800" y="620" width="16" height="12" rx="3" fill="#052e16" stroke="#16a34a" strokeWidth="0.8" />
          <text x="825" y="630" fill="#6b7280" fontSize="9" fontFamily="system-ui">Convex runtime</text>
          <rect x="800" y="642" width="16" height="12" rx="3" fill="#1e1b4b" stroke="#7c3aed" strokeWidth="0.8" />
          <text x="825" y="652" fill="#6b7280" fontSize="9" fontFamily="system-ui">Auth layer</text>
        </svg>
      </div>

      {/* Data Flow */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Request Flow — Adding a Recommendation</h2>
        <div className="space-y-0">
          <FlowStep step={1} title="User clicks &#34;+ add your recs&#34;" desc="Opens AddRecModal dialog — first presents MovieSearch (TMDB), then the rating + review form." />
          <FlowConnector />
          <FlowStep step={2} title="Client-side validation (Zod)" desc="recommendationSchema validates title (1–200 chars), genre (allowlist), blurb (1–250 chars), URLs (http/https), hypeScore (1–10)." />
          <FlowConnector />
          <FlowStep step={3} title="Convex mutation fires" desc="recommendations.create runs server-side. Clerk JWT is verified via ctx.auth.getUserIdentity(). User record looked up for name + avatar." />
          <FlowConnector />
          <FlowStep step={4} title="Server re-validates" desc="Genre checked against ALLOWED_GENRES. URLs run through isSafeUrl(). Title and blurb trimmed + length checked. hypeScore range validated." />
          <FlowConnector />
          <FlowStep step={5} title="ACID insert" desc="Document inserted into recommendations table with all fields. isStaffPick defaults to false. Transaction is atomic." />
          <FlowConnector />
          <FlowStep step={6} title="Real-time broadcast" desc="Convex pushes update via WebSocket to ALL connected clients. Every open RecGrid receives the new card instantly — zero polling." />
        </div>
      </div>

      {/* Auth Flow */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Auth Flow — Sign In → Dashboard</h2>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 overflow-x-auto">
          <pre className="text-[12px] text-slate-600 leading-relaxed font-mono whitespace-pre">
            {`User visits /shelf
│
├─ Clerk middleware (proxy.ts) intercepts
│  └─ No session? → redirect to /sign-in
│
├─ User authenticates
│  ├─ Email/password  OR
│  ├─ Google OAuth     OR
│  └─ X (Twitter) OAuth
│
├─ Clerk issues JWT token
│  └─ ConvexProviderWithClerk passes token to Convex client
│
├─ ConvexSyncUser triggers automatically
│  └─ calls users.store mutation
│     ├─ Upserts user record (clerkId, name, email)
│     └─ Checks ADMIN_EMAILS env var → assigns role
│
└─ User lands on /shelf with full access
   └─ All Convex queries now include auth identity`}</pre>
        </div>
      </div>

      {/* Environment Variables */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Environment Variables</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Variable</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Runtime</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <EnvRow name="NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" runtime="Client" purpose="Clerk SDK initialization" />
              <EnvRow name="CLERK_SECRET_KEY" runtime="Server" purpose="Clerk middleware + server operations" />
              <EnvRow name="NEXT_PUBLIC_CONVEX_URL" runtime="Client" purpose="Convex deployment endpoint" />
              <EnvRow name="TMDB_API_KEY" runtime="Server" purpose="Movie search via Server Action (never in client bundle)" />
              <EnvRow name="CLERK_JWT_ISSUER_DOMAIN" runtime="Convex" purpose="JWT verification for incoming auth tokens" />
              <EnvRow name="ADMIN_EMAILS" runtime="Convex" purpose="Comma-separated admin email addresses" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FlowStep({ step, title, desc }: { step: number; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-bold shrink-0">{step}</div>
      <div className="pt-0.5">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function FlowConnector() {
  return <div className="w-[1px] h-4 bg-slate-200 ml-[13px]" />;
}

function EnvRow({ name, runtime, purpose }: { name: string; runtime: string; purpose: string }) {
  return (
    <tr>
      <td className="px-4 py-2 font-mono text-[11px] text-slate-700 break-all">{name}</td>
      <td className="px-4 py-2 text-xs text-slate-500">{runtime}</td>
      <td className="px-4 py-2 text-xs text-slate-500">{purpose}</td>
    </tr>
  );
}
