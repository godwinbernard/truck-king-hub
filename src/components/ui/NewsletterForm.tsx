'use client';

export function NewsletterForm() {
  return (
    <form
      className="flex w-full md:w-auto gap-0"
      onSubmit={(e) => e.preventDefault()}
      aria-label="Newsletter signup"
    >
      <input
        type="email"
        placeholder="Your email address"
        className="w-full md:w-72 px-4 py-3 text-sm text-white focus:outline-none transition-colors"
        style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
        aria-label="Email address"
      />
      <button
        type="submit"
        className="px-6 py-3 text-xs font-black uppercase tracking-widest transition-opacity hover:opacity-80 whitespace-nowrap"
        style={{ background: '#F5C518', color: '#0d0d0d' }}
      >
        Subscribe
      </button>
    </form>
  );
}
