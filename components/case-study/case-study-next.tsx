import Link from "next/link";
import Image from "next/image";
import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";
import type { WorkEntry } from "@/lib/work";

interface CaseStudyNextProps {
  next: WorkEntry;
}

export function CaseStudyNext({ next }: CaseStudyNextProps) {
  return (
    <FadeUpOnScroll>
      <section className="mt-32 border-t border-fg-muted/10">
        <Link
          href={`/work/${next.slug}`}
          className="group block px-6 py-16 md:px-16 lg:px-24"
        >
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
            Up next
          </p>
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-3xl font-semibold transition-colors group-hover:text-gradient-accent md:text-5xl">
                {next.title}
              </h3>
              <p className="mt-4 text-fg-muted">{next.summary}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg">
                Read
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-fg-muted/10 bg-bg-muted">
              <Image src={next.heroImage} alt={next.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
        </Link>
      </section>
    </FadeUpOnScroll>
  );
}
