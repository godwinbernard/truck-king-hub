import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-extrabold text-lg tracking-tight">
            Truck King<span className="text-gold"> Hub</span>
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm text-blue-200">
            <Link href="/brief" className="hover:text-white transition-colors">Brief</Link>
            <Link href="/compliance" className="hover:text-white transition-colors">Compliance</Link>
            <Link href="/insurance" className="hover:text-white transition-colors">Insurance</Link>
            <Link href="/resources" className="hover:text-white transition-colors">Resources</Link>
            <Link href="/search" className="hover:text-white transition-colors">Search</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
