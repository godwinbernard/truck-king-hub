import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/admin/session';
import { CMS_NAV } from '@/lib/admin/cms-dashboard';

const WORKSPACES = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Articles', href: '/admin/articles' },
  { label: 'Directory', href: '/admin/directory' },
  { label: 'Ads', href: '/admin/ads' },
  { label: 'Team', href: '/admin/users' },
  { label: 'Logins', href: '/admin/logins' },
  { label: 'Takedowns', href: '/admin/takedowns' },
  { label: 'Queue', href: '/admin/queue' },
] as const;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session.adminId) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-parchment text-ink">
      <div className="grid min-h-screen lg:grid-cols-[18rem_1fr]">
        <aside className="border-r border-silver-light bg-white/95 backdrop-blur sticky top-0 hidden h-screen lg:block">
          <div className="flex h-full flex-col">
            <div className="border-b border-silver-light px-6 py-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-crimson">Truck King Hub</p>
              <h1 className="mt-2 text-2xl font-editorial font-bold">CMS Console</h1>
              <p className="mt-2 text-sm text-charcoal">WordPress-style publishing for the trucking newsroom.</p>
            </div>

            <nav className="flex-1 overflow-y-auto px-4 py-5">
              <div className="mb-6">
                <p className="px-2 text-[11px] font-bold uppercase tracking-[0.22em] text-silver mb-3">Workspaces</p>
                <div className="space-y-1">
                  {WORKSPACES.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-charcoal transition hover:bg-parchment hover:text-crimson"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="px-2 text-[11px] font-bold uppercase tracking-[0.22em] text-silver mb-3">Dashboard sections</p>
                <div className="space-y-1">
                  {CMS_NAV.map((item) => (
                    <a
                      key={item.href}
                      href={`/admin${item.href}`}
                      className="block rounded-xl px-3 py-2 text-sm font-medium text-charcoal transition hover:bg-parchment hover:text-crimson"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </nav>

            <div className="border-t border-silver-light px-6 py-5">
              <div className="rounded-2xl bg-parchment p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-silver">Signed in as</p>
                <p className="mt-1 text-sm font-semibold text-ink">{session.email}</p>
              </div>
              <form action="/api/admin/logout" method="POST" className="mt-4">
                <button
                  type="submit"
                  className="w-full rounded-xl border border-silver-light px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-crimson hover:text-crimson"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </aside>

        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-20 border-b border-silver-light bg-white/90 backdrop-blur">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-crimson">Truck King Hub CMS</p>
                <p className="mt-1 text-sm text-charcoal">Editorial control center</p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/admin/articles/new"
                  className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-charcoal"
                >
                  New Post
                </Link>
                <Link
                  href="/"
                  className="hidden rounded-full border border-silver-light px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-crimson hover:text-crimson sm:inline-flex"
                >
                  View Site
                </Link>
              </div>
            </div>
            <div className="border-t border-silver-light px-4 py-3 sm:px-6 lg:hidden">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {WORKSPACES.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="whitespace-nowrap rounded-full border border-silver-light px-3 py-1.5 text-xs font-semibold text-charcoal"
                  >
                    {item.label}
                  </Link>
                ))}
                {CMS_NAV.slice(0, 6).map((item) => (
                  <a
                    key={item.href}
                    href={`/admin${item.href}`}
                    className="whitespace-nowrap rounded-full border border-silver-light px-3 py-1.5 text-xs font-semibold text-charcoal"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
