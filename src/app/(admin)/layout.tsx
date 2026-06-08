import { getSession } from '@/lib/admin/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session.adminId) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-extrabold text-navy text-sm">Truck King Hub Admin</span>
          <Link href="/admin" className="text-xs text-slate-600 hover:text-navy">Dashboard</Link>
          <Link href="/admin/queue" className="text-xs text-slate-600 hover:text-navy">Queue</Link>
          <Link href="/admin/sources" className="text-xs text-slate-600 hover:text-navy">Sources</Link>
          <Link href="/admin/directory" className="text-xs text-slate-600 hover:text-navy">Directory</Link>
          <Link href="/admin/takedowns" className="text-xs text-slate-600 hover:text-navy">Takedowns</Link>
        </div>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="text-xs text-slate-400 hover:text-slate-700">Sign out</button>
        </form>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">{children}</main>
    </div>
  );
}
