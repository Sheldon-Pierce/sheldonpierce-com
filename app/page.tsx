import { Hero } from "@/components/hero/hero";
import { FeaturedWork } from "@/components/featured-work/featured-work";
import { WorkGrid } from "@/components/work-grid/work-grid";
import { About } from "@/components/about/about";
import { Contact } from "@/components/contact/contact";
import { getAllWork } from "@/lib/work";

export default function Home() {
  const allWork = getAllWork();
  const featured = allWork.find((w) => w.featured);
  const rest = allWork.filter((w) => !w.featured);

  return (
    <main id="top">
      <Hero />
      {featured && <FeaturedWork work={featured} />}
      <WorkGrid work={rest} />

      <svg
        className="boundary"
        viewBox="0 0 1440 26"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M0 13 Q 120 4 260 14 T 540 12 T 820 16 T 1100 10 T 1440 14"
          stroke="currentColor"
          fill="none"
          strokeWidth="1"
        />
      </svg>

      <About />
      <Contact />
    </main>
  );
}
