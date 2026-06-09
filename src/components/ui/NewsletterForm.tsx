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
        className="w-full md:w-72 px-4 py-3 text-sm bg-white/10 border border-white/20 text-white placeholder:text-silver focus:outline-none focus:border-crimson transition-colors"
        aria-label="Email address"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-crimson hover:bg-crimson-dark text-white text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
