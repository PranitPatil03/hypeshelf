export default function BackendPage() {
  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <span>Docs</span>
          <span>›</span>
          <span className="text-slate-600 font-medium">Backend &amp; Database</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">Backend &amp; Database</h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">
          Convex powers the entire backend — real-time database, serverless functions, WebSocket sync, and auth verification. No separate API server needed.
        </p>
      </div>

      {/* Why Convex */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Why Convex?</h2>
        <p className="text-sm text-slate-500 mb-4 leading-relaxed">
          Instead of building a REST API + database + WebSocket server, Convex provides all three in a single platform. Every query is a live subscription — when data changes, connected clients update instantly.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <FeatureCard
            title="Reactive Queries"
            desc="Every useQuery/usePaginatedQuery hook opens a WebSocket subscription. When underlying data changes, all clients receive updates automatically — zero polling, zero refetching."
          />
          <FeatureCard
            title="ACID Transactions"
            desc="Mutations run in full ACID transactions. If server-side validation fails, the entire operation rolls back. No partial writes, no inconsistent state."
          />
          <FeatureCard
            title="Cursor Pagination"
            desc="The getAll query uses Convex's built-in paginator with cursor tokens. The client requests the next page, server returns the batch + new cursor. Efficient for infinite scroll."
          />
          <FeatureCard
            title="Integrated Auth"
            desc="Every mutation/query calls ctx.auth.getUserIdentity() to verify the Clerk JWT. Token is passed automatically via ConvexProviderWithClerk — no manual header management."
          />
        </div>
      </div>

      {/* Schema */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Schema Definition</h2>
        <p className="text-sm text-slate-500 mb-4">
          Defined in <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">convex/schema.ts</code> — Convex validates all writes against this schema at runtime.
        </p>
        <div className="rounded-xl border border-slate-200 bg-slate-950 p-5 overflow-x-auto">
          <pre className="text-[12.5px] text-slate-300 leading-relaxed font-mono">
            {`import { v } from "convex/values";
import { defineSchema, defineTable } from "convex/server";

export default defineSchema({

  recommendations: defineTable({
    userId:      v.string(),     // Clerk user ID
    userName:    v.string(),     // Display name at creation time
    userAvatar:  v.string(),     // Avatar URL (Clerk or DiceBear)
    title:       v.string(),     // Movie title (1–200 chars)
    genre:       v.string(),     // Must be in ALLOWED_GENRES
    link:        v.string(),     // External URL (http/https only)
    blurb:       v.string(),     // User review (1–250 chars)
    hypeScore:   v.number(),     // Rating 1–10 (displayed as stars)
    isStaffPick: v.boolean(),    // Admin-curated highlight
    posterUrl:   v.string(),     // TMDB poster image URL
  })
    .index("by_genre",     ["genre"])
    .index("by_userId",    ["userId"])
    .index("by_staffPick", ["isStaffPick"]),

  users: defineTable({
    clerkId: v.string(),                                // Clerk subject ID
    role:    v.union(v.literal("user"), v.literal("admin")),
    name:    v.string(),                                // Full name
    email:   v.string(),                                // Primary email
  })
    .index("by_clerkId", ["clerkId"]),
});`}
          </pre>
        </div>
      </div>

      {/* recommendations table */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Table: recommendations</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Field</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Type</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Constraints</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <FieldRow name="_id" type="Id" constraint="Auto-generated document ID" />
              <FieldRow name="_creationTime" type="number" constraint="Auto-generated Unix ms timestamp" />
              <FieldRow name="userId" type="string" constraint="Indexed (by_userId)" />
              <FieldRow name="userName" type="string" constraint="Snapshot at creation time" />
              <FieldRow name="userAvatar" type="string" constraint="Clerk URL or DiceBear fallback" />
              <FieldRow name="title" type="string" constraint="1–200 chars, trimmed" />
              <FieldRow name="genre" type="string" constraint="Indexed (by_genre), allowlist-only" />
              <FieldRow name="link" type="string" constraint="http/https URL or empty" />
              <FieldRow name="blurb" type="string" constraint="1–250 chars, trimmed" />
              <FieldRow name="hypeScore" type="number" constraint="1–10 integer" />
              <FieldRow name="isStaffPick" type="boolean" constraint="Indexed (by_staffPick)" />
              <FieldRow name="posterUrl" type="string" constraint="http/https URL or empty" />
            </tbody>
          </table>
        </div>
      </div>

      {/* users table */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Table: users</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Field</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Type</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Constraints</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <FieldRow name="_id" type="Id" constraint="Auto-generated document ID" />
              <FieldRow name="clerkId" type="string" constraint="Unique, indexed (by_clerkId)" />
              <FieldRow name="role" type='"user" | "admin"' constraint="Set by ADMIN_EMAILS env var" />
              <FieldRow name="name" type="string" constraint="From Clerk identity" />
              <FieldRow name="email" type="string" constraint="From Clerk identity" />
            </tbody>
          </table>
        </div>

        <div className="mt-3 p-3.5 rounded-lg bg-amber-50 border border-amber-200/60">
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-semibold">Admin role logic:</span> The <code className="font-mono bg-amber-100 px-1 rounded">users.store</code> mutation reads <code className="font-mono bg-amber-100 px-1 rounded">ADMIN_EMAILS</code> from Convex env vars. If the user&apos;s email matches, they get <code className="font-mono bg-amber-100 px-1 rounded">role: &quot;admin&quot;</code>. Changes take effect on next sign-in.
          </p>
        </div>
      </div>

      {/* Indexes */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Indexes</h2>
        <p className="text-sm text-slate-500 mb-4">Convex indexes enable efficient filtering. Without an index, queries scan the entire table.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <IndexCard name="by_genre" table="recommendations" field="genre" usage='Genre tab filtering — "Action", "Comedy", etc.' />
          <IndexCard name="by_userId" table="recommendations" field="userId" usage="My Recs tab — shows only the current user's recs" />
          <IndexCard name="by_staffPick" table="recommendations" field="isStaffPick" usage='Staff Picks tab — filters where isStaffPick === true' />
          <IndexCard name="by_clerkId" table="users" field="clerkId" usage="User lookup by Clerk subject ID on every auth check" />
        </div>
      </div>

      {/* Allowed Genres */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Allowed Genres</h2>
        <p className="text-sm text-slate-500 mb-3">Enforced on both client (Zod) and server (Convex mutation). Anything outside this list is rejected.</p>
        <div className="flex flex-wrap gap-1.5">
          {['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller', 'Romance'].map((g) => (
            <span key={g} className="px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-medium">
              {g}
            </span>
          ))}
          {['Documentary', 'Adventure', 'Animation', 'Crime', 'Family', 'Fantasy', 'History', 'Music', 'Mystery', 'Science Fiction', 'TV Movie', 'War', 'Western', 'Other'].map((g) => (
            <span key={g} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200/60">
              {g}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 mt-2">Dark pills = primary filter tabs. Light pills = extended TMDB genres accepted on creation.</p>
      </div>

      {/* Server Functions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Server Functions</h2>

        <div className="space-y-3">
          <FunctionCard
            name="recommendations.getAll"
            badge="query"
            badgeColor="bg-blue-50 text-blue-700"
            args="genre?, myRecs?, staffPicks?, paginationOpts"
            returns="PaginationResult<Recommendation>"
            desc="Paginated query with filter priority: myRecs (auth required) → staffPicks → genre → all."
          />
          <FunctionCard
            name="recommendations.create"
            badge="mutation"
            badgeColor="bg-emerald-50 text-emerald-700"
            args="title, genre, blurb, link, posterUrl, hypeScore"
            returns="Id<recommendations>"
            desc="Validates all inputs server-side. Looks up user for name/avatar. Inserts with isStaffPick: false."
          />
          <FunctionCard
            name="recommendations.remove"
            badge="mutation"
            badgeColor="bg-emerald-50 text-emerald-700"
            args="id"
            returns="void"
            desc="Deletes a recommendation. Authorization: owner (userId match) OR admin role."
          />
          <FunctionCard
            name="recommendations.toggleStaffPick"
            badge="mutation"
            badgeColor="bg-amber-50 text-amber-700"
            args="id"
            returns="void"
            desc="Flips the isStaffPick boolean. Restricted to admin role only."
          />
          <FunctionCard
            name="users.store"
            badge="mutation"
            badgeColor="bg-emerald-50 text-emerald-700"
            args="(reads from auth identity)"
            returns="Id<users>"
            desc="Upserts user on login. If email matches ADMIN_EMAILS, assigns admin role. Called automatically by ConvexSyncUser."
          />
          <FunctionCard
            name="users.current"
            badge="query"
            badgeColor="bg-blue-50 text-blue-700"
            args="(none)"
            returns="User | null"
            desc="Returns the current user's Convex record by Clerk ID. Used for role checks in the UI."
          />
        </div>
      </div>

      {/* Data Flow Diagram */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Data Flow</h2>
        <div className="rounded-xl border border-slate-200 bg-slate-950 p-5 overflow-x-auto">
          <pre className="text-[12px] text-slate-400 leading-relaxed font-mono">
            {`Client                          Convex                         External
──────                          ──────                         ────────
                                
RecGrid mounts
  └─ usePaginatedQuery ────────→ recommendations.getAll
                                  ├─ Select index (genre/user/staffPick)
                                  ├─ Paginate with cursor
                                  └─ Return batch ──────────→ Render cards
                                
User submits form
  └─ Zod validates ──────────→ recommendations.create
                                  ├─ ctx.auth.getUserIdentity()
                                  │     └─────────────────────→ Clerk JWKS ✔
                                  ├─ Validate inputs server-side
                                  ├─ Lookup user record
                                  ├─ db.insert(recommendations, {...})
                                  └─ Broadcast update ─────→ All clients update
                                
User clicks "Add manually"
  └─ No TMDB search needed     (skips TMDB)
  
User searches movie
  └─ Server Action ────────────────────────────────────────→ TMDB API
       └─ Return results ──→ User selects → populate form`}
          </pre>
        </div>
      </div>

      {/* Real-time Architecture */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Real-time Architecture</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          Every Convex query is a <strong>live subscription</strong>. When a RecGrid component mounts, it opens a WebSocket connection to Convex. If User A adds a recommendation, User B&apos;s grid updates instantly — no polling, no refetch triggers. The Convex runtime tracks which documents each subscription depends on and pushes granular updates only when relevant data changes.
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white">
      <h3 className="text-sm font-semibold text-slate-900 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}

function FieldRow({ name, type, constraint }: { name: string; type: string; constraint: string }) {
  return (
    <tr>
      <td className="px-4 py-2 font-mono text-xs font-medium text-slate-700">{name}</td>
      <td className="px-4 py-2 font-mono text-xs text-emerald-600">{type}</td>
      <td className="px-4 py-2 text-xs text-slate-500">{constraint}</td>
    </tr>
  );
}

function IndexCard({ name, table, field, usage }: { name: string; table: string; field: string; usage: string }) {
  return (
    <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
      <div className="font-mono text-xs font-bold text-slate-900">{name}</div>
      <div className="text-[11px] text-slate-400 mt-0.5">
        <span className="font-mono">{table}</span> → <span className="font-mono">[{field}]</span>
      </div>
      <div className="text-[11px] text-slate-500 mt-1">{usage}</div>
    </div>
  );
}

function FunctionCard({ name, badge, badgeColor, args, returns, desc }: {
  name: string; badge: string; badgeColor: string; args: string; returns: string; desc: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <h3 className="text-sm font-semibold font-mono text-slate-900">{name}</h3>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${badgeColor}`}>{badge}</span>
      </div>
      <p className="text-xs text-slate-500 mt-1">{desc}</p>
      <div className="flex flex-col sm:flex-row gap-x-5 gap-y-0.5 mt-2.5 text-[11px]">
        <span><span className="text-slate-400">Args: </span><span className="font-mono text-slate-600">{args}</span></span>
        <span><span className="text-slate-400">Returns: </span><span className="font-mono text-slate-600">{returns}</span></span>
      </div>
    </div>
  );
}
