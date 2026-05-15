import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";
import { WorkCard } from "./work-card";
import type { WorkEntry } from "@/lib/work";

interface WorkGridProps {
  work: WorkEntry[];
}

export function WorkGrid({ work }: WorkGridProps) {
  return (
    <section id="work" className="relative px-6 py-section md:px-16 lg:px-24">
      <FadeUpOnScroll>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          Selected work
        </p>
      </FadeUpOnScroll>
      <FadeUpOnScroll delay={0.1}>
        <h2 className="mb-16 text-4xl font-semibold md:text-5xl">
          More things I&apos;ve built.
        </h2>
      </FadeUpOnScroll>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {work.map((entry, i) => (
          <FadeUpOnScroll key={entry.slug} delay={0.05 * i}>
            <WorkCard work={entry} />
          </FadeUpOnScroll>
        ))}
      </div>
    </section>
  );
}
