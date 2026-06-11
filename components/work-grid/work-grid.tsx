import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";
import { WorkCard } from "./work-card";
import type { WorkEntry } from "@/lib/work";

interface WorkGridProps {
  work: WorkEntry[];
}

export function WorkGrid({ work }: WorkGridProps) {
  return (
    <section className="work" id="work">
      <div className="wrap">
        <FadeUpOnScroll>
          <div className="stratum-label">
            <span className="depth">— 40 m</span> Selected work
          </div>
        </FadeUpOnScroll>
        <div className="work-grid">
          {work.map((entry, i) => (
            <FadeUpOnScroll key={entry.slug} delay={0.05 * i}>
              <WorkCard work={entry} />
            </FadeUpOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
