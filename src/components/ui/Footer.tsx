export function Footer() {
  return (
    <footer className="bg-navy-dark text-blue-200 mt-16 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-center">
          Summaries are for informational purposes only and do not constitute legal, insurance,
          financial, or compliance advice. Always consult a qualified professional before making
          business, regulatory, or insurance decisions.
        </p>
        <p className="text-xs text-center mt-2 text-blue-300">
          <a href="/contact/takedown" className="underline hover:text-white">Content takedown request</a>
        </p>
      </div>
    </footer>
  );
}
