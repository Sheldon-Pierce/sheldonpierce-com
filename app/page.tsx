export default function Home() {
  return (
    <main>
      <section
        id="hero"
        className="relative flex min-h-screen items-center justify-center"
      >
        <h1 className="text-5xl font-bold">Hero (TBD)</h1>
      </section>

      <section id="featured" className="relative py-section">
        <h2 className="text-3xl font-semibold">Featured (TBD)</h2>
      </section>

      <section id="work" className="relative py-section">
        <h2 className="text-3xl font-semibold">Work (TBD)</h2>
      </section>

      <section id="about" className="relative py-section">
        <h2 className="text-3xl font-semibold">About (TBD)</h2>
      </section>

      <section id="contact" className="relative py-section">
        <h2 className="text-3xl font-semibold">Contact (TBD)</h2>
      </section>

      <footer className="border-t border-fg-muted/20 py-8 text-center text-fg-muted">
        © Sheldon Pierce · Seattle
      </footer>
    </main>
  );
}
