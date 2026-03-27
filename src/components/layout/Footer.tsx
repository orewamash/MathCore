import Link from "next/link";

export function Footer() {
  return (
    // ── Footer with top border ──
    <footer className="mt-32 border-t border-border bg-bg-base">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-text-secondary sm:flex-row">
        <p>© 2025 MathCore. Engineering Mathematics 1.</p>
        <div className="flex gap-6">
          <Link href="/lessons" className="hover:text-text-primary transition-colors">Lessons</Link>
          <Link href="/search" className="hover:text-text-primary transition-colors">Search</Link>
        </div>
      </div>
    </footer>
  );
}
