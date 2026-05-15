import { Hero } from "@/components/hero/hero";
import { FeaturedWork } from "@/components/featured-work/featured-work";
import { WorkGrid } from "@/components/work-grid/work-grid";
import { About } from "@/components/about/about";
import { getAllWork } from "@/lib/work";

export default function Home() {
  const allWork = getAllWork();
  const featured = allWork.find((w) => w.featured);
  const rest = allWork.filter((w) => !w.featured);

  return (
    <main>
      <Hero />
      {featured && <FeaturedWork work={featured} />}
      <WorkGrid work={rest} />

      <About />

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
