export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-fg-muted/10 px-6 py-12 md:px-16 lg:px-24">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          © {year} Sheldon Pierce
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          Seattle, WA
        </p>
      </div>
    </footer>
  );
}
