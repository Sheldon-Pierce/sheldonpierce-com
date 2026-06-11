export function FooterContent() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <span>© {year} Sheldon Pierce</span>
      <span className="coords">SEATTLE, WA · CORE SAMPLE №01 · LOGGED 2026</span>
    </footer>
  );
}

/** Standalone footer for side pages (case studies, 404), centered in a wrap. */
export function Footer() {
  return (
    <div className="wrap">
      <FooterContent />
    </div>
  );
}
