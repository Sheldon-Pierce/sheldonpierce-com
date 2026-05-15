import { Hero } from "@/components/hero/hero";
import { FeaturedWork } from "@/components/featured-work/featured-work";
import { getAllWork } from "@/lib/work";

export default function Home() {
  const allWork = getAllWork();
  const featured = allWork.find((w) => w.featured);

  return (
    <main>
      <Hero />
      {featured && <FeaturedWork work={featured} />}

      <section id="work" className="relative py-section">
        <h2 className="text-3xl font-semibold px-6 md:px-16 lg:px-24">
          Selected work (TBD)
        </h2>
      </section>

      <section id="about" className="relative py-section">
        <h2 className="text-3xl font-semibold px-6 md:px-16 lg:px-24">
          About (TBD)
        </h2>
      </section>

      <section id="contact" className="relative py-section">
        <h2 className="text-3xl font-semibold px-6 md:px-16 lg:px-24">
          Contact (TBD)
        </h2>
      </section>

      <footer className="border-t border-fg-muted/20 py-8 text-center text-fg-muted">
        © Sheldon Pierce · Seattle
      </footer>
    </main>
  );
}
