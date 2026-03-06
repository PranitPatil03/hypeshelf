export default function SecurityPage() {
  return (
    <div className="space-y-12">
      {/* Breadcrumb */}
      <div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
          <span>Docs</span>
          <span>›</span>
          <span className="text-slate-600 font-medium">Auth &amp; Security</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">Auth &amp; Security</h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-2xl">
          Three-layer authentication, role-based access control, defense-in-depth input validation, and URL sanitization.
        </p>
      </div>

      {/* Three-layer Auth */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Authentication Layers</h2>
        <p className="text-sm text-slate-500 mb-4">Security is enforced at three independent layers — if any single layer fails, the other two still protect the system.</p>

        <div className="rounded-xl border border-slate-200 bg-slate-950 p-5 sm:p-6 overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <AuthLayer
              num="1"
              title="Clerk Identity"
              color="violet"
              items={[
                'Email/password sign-in',
                'Google OAuth',
                'X (Twitter) OAuth',
                'JWT token issued on auth',
                'Session refresh + management',
              ]}
            />
            <AuthLayer
              num="2"
              title="Middleware"
              color="blue"
              items={[
                'proxy.ts — runs on every request',
                'Public: /, /sign-in, /sign-up, /docs',
                'Protected: /shelf and all other routes',
                'auth.protect() redirects guests',
                'Injects auth state into request',
              ]}
            />
            <AuthLayer
              num="3"
              title="Convex Server"
              color="emerald"
              items={[
                'ctx.auth.getUserIdentity() called',
                'Clerk JWT verified via JWKS endpoint',
                'User record looked up by clerkId',
                'Role checked for admin operations',
                'Throws error if any check fails',
              ]}
            />
          </div>
        </div>
      </div>

      {/* RBAC */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Role-Based Access Control</h2>
        <p className="text-sm text-slate-500 mb-4">
          Two roles: <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">user</code> and <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">admin</code>. Role is assigned by the <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">users.store</code> mutation by checking the user&apos;s email against the <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">ADMIN_EMAILS</code> environment variable.
        </p>

        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Action</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider text-center">Guest</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider text-center">User</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider text-center">Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <PermRow action="Browse landing page" guest user admin />
              <PermRow action="View /shelf dashboard" guest={false} user admin />
              <PermRow action="Add recommendation" guest={false} user admin />
              <PermRow action="Delete own recommendation" guest={false} user admin />
              <PermRow action="Delete any recommendation" guest={false} user={false} admin />
              <PermRow action="Toggle Staff Pick" guest={false} user={false} admin />
              <PermRow action="View docs" guest user admin />
            </tbody>
          </table>
        </div>

        <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200/60 text-xs text-slate-600 space-y-1.5">
          <p><strong>How enforcement works:</strong></p>
          <p>• <code className="font-mono bg-slate-100 px-1 rounded">recommendations.remove</code> — checks <code className="font-mono bg-slate-100 px-1 rounded">rec.userId === identity.subject</code> (owner) OR <code className="font-mono bg-slate-100 px-1 rounded">user.role === &quot;admin&quot;</code></p>
          <p>• <code className="font-mono bg-slate-100 px-1 rounded">recommendations.toggleStaffPick</code> — checks <code className="font-mono bg-slate-100 px-1 rounded">user.role === &quot;admin&quot;</code> only</p>
          <p>• <code className="font-mono bg-slate-100 px-1 rounded">recommendations.create</code> — requires any authenticated user</p>
        </div>
      </div>

      {/* Input Validation */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Input Validation (Defense-in-Depth)</h2>
        <p className="text-sm text-slate-500 mb-4">
          Every user input is validated <strong>twice</strong> — once on the client with Zod before the network request, and again on the Convex server in the mutation handler. Even if client validation is bypassed, server validation catches it.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">Client — Zod Schema</h3>
              <p className="text-[11px] font-mono text-slate-400">lib/validation.ts</p>
            </div>
            <div className="p-4 space-y-1.5 text-xs text-slate-600">
              <p>• <strong>title</strong> — 1–200 chars, trimmed</p>
              <p>• <strong>genre</strong> — must be in ALLOWED_GENRES</p>
              <p>• <strong>blurb</strong> — 1–250 chars, trimmed</p>
              <p>• <strong>link</strong> — empty or valid http(s) URL</p>
              <p>• <strong>posterUrl</strong> — empty or valid http(s) URL</p>
              <p>• <strong>hypeScore</strong> — number 1–10</p>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900">Server — Convex Mutation</h3>
              <p className="text-[11px] font-mono text-slate-400">convex/recommendations.ts</p>
            </div>
            <div className="p-4 space-y-1.5 text-xs text-slate-600">
              <p>• <strong>title</strong> — same constraints + trimmed</p>
              <p>• <strong>genre</strong> — server-side ALLOWED_GENRES check</p>
              <p>• <strong>blurb</strong> — same constraints + trimmed</p>
              <p>• <strong>link</strong> — <code className="font-mono bg-slate-100 px-1 rounded">isSafeUrl()</code> protocol check</p>
              <p>• <strong>posterUrl</strong> — same <code className="font-mono bg-slate-100 px-1 rounded">isSafeUrl()</code> check</p>
              <p>• <strong>hypeScore</strong> — range 1–10 validated</p>
              <p>• <strong>auth</strong> — identity must exist</p>
            </div>
          </div>
        </div>
      </div>

      {/* URL Sanitization */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">URL Sanitization</h2>
        <p className="text-sm text-slate-500 mb-4">
          All URL fields run through a protocol whitelist to prevent XSS via <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">javascript:</code>, <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-700">data:</code>, and other dangerous protocols.
        </p>

        <div className="rounded-xl border border-slate-200 bg-slate-950 p-5 overflow-x-auto">
          <pre className="text-[12.5px] text-slate-300 leading-relaxed font-mono">
            {`function isSafeUrl(url: string): boolean {
  if (url === "") return true;        // Allow optional (empty)
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:"
        || parsed.protocol === "https:";
  } catch {
    return false;                     // Reject malformed URLs
  }
}

// ✅ Allowed: https://themoviedb.org/movie/123
// ✅ Allowed: http://imdb.com/title/tt1234567
// ✅ Allowed: "" (empty string = optional)
// ❌ Blocked: javascript:alert(1)
// ❌ Blocked: data:text/html,<script>...
// ❌ Blocked: vbscript:, file://, ftp://`}
          </pre>
        </div>
      </div>

      {/* API Key Protection */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">API Key Protection</h2>
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Secret</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Exposure</th>
                <th className="px-4 py-2.5 font-semibold text-slate-700 text-xs uppercase tracking-wider">Protection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-2 font-mono text-[11px] text-slate-700">CLERK_SECRET_KEY</td>
                <td className="px-4 py-2 text-xs text-slate-500">Server only</td>
                <td className="px-4 py-2 text-xs text-slate-500">No NEXT_PUBLIC_ prefix — never in client bundle</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-[11px] text-slate-700">TMDB_API_KEY</td>
                <td className="px-4 py-2 text-xs text-slate-500">Server only</td>
                <td className="px-4 py-2 text-xs text-slate-500">Used in Server Action (&apos;use server&apos;) — tree-shaken from client</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-[11px] text-slate-700">ADMIN_EMAILS</td>
                <td className="px-4 py-2 text-xs text-slate-500">Convex runtime</td>
                <td className="px-4 py-2 text-xs text-slate-500">process.env in Convex — never reaches frontend</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-[11px] text-slate-700">NEXT_PUBLIC_*</td>
                <td className="px-4 py-2 text-xs text-slate-500">Client (public)</td>
                <td className="px-4 py-2 text-xs text-slate-500">Only Clerk publishable key + Convex URL — safe to expose</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Checklist */}
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Security Checklist</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'Clerk middleware on every protected route',
            'JWT verified server-side on every mutation',
            'Admin role checked for privileged actions',
            'Owner check before delete (userId match)',
            'Client Zod validation before network calls',
            'Server re-validation in Convex mutations',
            'URL protocol whitelist (http/https only)',
            'No secrets in client bundle (NEXT_PUBLIC_ only for safe keys)',
            'Genre allowlist prevents data injection',
            'User sync keeps Convex ↔ Clerk in lockstep',
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200/60 bg-white">
              <div className="w-4.5 h-4.5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs text-slate-600">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuthLayer({ num, title, color, items }: { num: string; title: string; color: string; items: string[] }) {
  const colors: Record<string, { border: string; badge: string; title: string }> = {
    violet: { border: 'border-violet-500/30', badge: 'bg-violet-500/20 text-violet-300', title: 'text-violet-400' },
    blue: { border: 'border-blue-500/30', badge: 'bg-blue-500/20 text-blue-300', title: 'text-blue-400' },
    emerald: { border: 'border-emerald-500/30', badge: 'bg-emerald-500/20 text-emerald-300', title: 'text-emerald-400' },
  };
  const c = colors[color];
  return (
    <div className={`rounded-lg border ${c.border} bg-[#13161f] p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${c.badge}`}>{num}</span>
        <span className={`text-[13px] font-semibold ${c.title}`}>{title}</span>
      </div>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-[11px] text-slate-400">
            <span className="text-slate-600 mt-px shrink-0">•</span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PermRow({ action, guest, user, admin }: { action: string; guest: boolean; user: boolean; admin: boolean }) {
  return (
    <tr>
      <td className="px-4 py-2 text-xs text-slate-700 font-medium">{action}</td>
      <td className={`px-4 py-2 text-xs text-center ${guest ? 'text-emerald-500' : 'text-red-400'}`}>{guest ? '✓' : '✗'}</td>
      <td className={`px-4 py-2 text-xs text-center ${user ? 'text-emerald-500' : 'text-red-400'}`}>{user ? '✓' : '✗'}</td>
      <td className={`px-4 py-2 text-xs text-center ${admin ? 'text-emerald-500' : 'text-red-400'}`}>{admin ? '✓' : '✗'}</td>
    </tr>
  );
}
