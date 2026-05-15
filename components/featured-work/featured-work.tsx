import Link from "next/link";
import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";
import { ParallaxImage } from "@/components/motion/parallax-image";
import type { WorkEntry } from "@/lib/work";

interface FeaturedWorkProps {
  work: WorkEntry;
}

export function FeaturedWork({ work }: FeaturedWorkProps) {
  return (
    <section
      id="featured"
      className="relative px-6 py-section md:px-16 lg:px-24"
    >
      <FadeUpOnScroll>
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          Featured · {work.year}
        </p>
      </FadeUpOnScroll>

      <Link href={`/work/${work.slug}`} className="group block">
        <FadeUpOnScroll>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-fg-muted/10 bg-bg-muted">
            <ParallaxImage
              src={work.heroImage}
              alt={work.title}
              fill
              priority
              speed={0.25}
              className="absolute inset-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
          </div>
        </FadeUpOnScroll>

        <FadeUpOnScroll delay={0.1}>
          <h2 className="mt-10 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            {work.title}
          </h2>
        </FadeUpOnScroll>

        <FadeUpOnScroll delay={0.15}>
          <p className="mt-6 max-w-2xl text-lg text-fg-muted">{work.summary}</p>
        </FadeUpOnScroll>

        <FadeUpOnScroll delay={0.2}>
          <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg transition-colors group-hover:text-gradient-accent">
            Read case study
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </FadeUpOnScroll>
      </Link>
    </section>
  );
}
