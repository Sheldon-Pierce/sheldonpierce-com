import Link from "next/link";
import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";
import type { WorkEntry } from "@/lib/work";

interface FeaturedWorkProps {
  work: WorkEntry;
}

export function FeaturedWork({ work }: FeaturedWorkProps) {
  return (
    <section className="featured" id="featured">
      <div className="wrap">
        <FadeUpOnScroll>
          <div className="stratum-label">
            <span className="depth">— 12 m</span> Featured · {work.year}
          </div>
        </FadeUpOnScroll>

        <FadeUpOnScroll delay={0.05}>
          <Link className="feature-card" href={`/work/${work.slug}`}>
            <div className="feature-copy">
              <span className="pill">Case study</span>
              <h3>{work.title}</h3>
              <p>{work.summary}</p>
              <span className="case-link">
                Read the case study <span className="arr">→</span>
              </span>
            </div>
            <div className="feature-visual" aria-hidden="true">
              {/* abstract "two signals converging" mark */}
              <svg
                viewBox="0 0 420 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 180 C 90 180, 110 60, 210 60"
                  stroke="#C9824B"
                  strokeWidth="2.5"
                  opacity=".9"
                />
                <path
                  d="M10 60 C 90 60, 110 180, 210 180"
                  stroke="#8FC1C7"
                  strokeWidth="2.5"
                  opacity=".9"
                />
                <path
                  d="M210 60 C 290 60, 330 118, 410 120"
                  stroke="#C9824B"
                  strokeWidth="2.5"
                  opacity=".55"
                  strokeDasharray="3 7"
                />
                <path
                  d="M210 180 C 290 180, 330 122, 410 120"
                  stroke="#8FC1C7"
                  strokeWidth="2.5"
                  opacity=".55"
                  strokeDasharray="3 7"
                />
                <circle cx="410" cy="120" r="6" fill="#EDE8DF" />
                <circle cx="10" cy="60" r="4" fill="#8FC1C7" />
                <circle cx="10" cy="180" r="4" fill="#C9824B" />
              </svg>
            </div>
          </Link>
        </FadeUpOnScroll>
      </div>
    </section>
  );
}
