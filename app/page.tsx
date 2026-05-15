import { Hero } from "@/components/hero/hero";
import { FeaturedWork } from "@/components/featured-work/featured-work";
import { WorkGrid } from "@/components/work-grid/work-grid";
import { About } from "@/components/about/about";
import { Contact } from "@/components/contact/contact";
import { Footer } from "@/components/footer/footer";
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

      <Contact />

      <Footer />
    </main>
  );
}
