import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">404</p>
      <h1 className="mt-4 text-4xl font-semibold">Case study not found</h1>
      <Link
        href="/"
        className="mt-8 font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-fg"
      >
        ← Back home
      </Link>
    </main>
  );
}
