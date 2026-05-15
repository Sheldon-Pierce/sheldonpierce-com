"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { ParallaxImage } from "@/components/motion/parallax-image";
import type { WorkEntry } from "@/lib/work";

interface CaseStudyHeroProps {
  work: WorkEntry;
}

export function CaseStudyHero({ work }: CaseStudyHeroProps) {
  return (
    <section className="relative">
      <div className="px-6 pt-32 md:px-16 lg:px-24">
        <Link
          href="/#work"
          className="font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-fg"
        >
          ← All work
        </Link>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-12 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted"
        >
          {work.year} · {work.role}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-6 max-w-5xl text-4xl font-semibold leading-tight md:text-7xl"
        >
          {work.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 max-w-2xl text-lg text-fg-muted"
        >
          {work.summary}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8 flex flex-wrap gap-2"
        >
          {work.stack.slice(0, 6).map((s) => (
            <span
              key={s}
              className="rounded-full border border-fg-muted/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-muted"
            >
              {s}
            </span>
          ))}
        </motion.div>

        {(work.liveUrl || work.repoUrl) && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            {work.liveUrl && (
              <a
                href={work.liveUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="group inline-flex items-center gap-3 rounded-full px-6 py-3 font-mono text-xs uppercase tracking-widest text-bg gradient-accent transition-transform hover:-translate-y-0.5"
              >
                Visit live site
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  ↗
                </span>
              </a>
            )}
            {work.repoUrl && (
              <a
                href={work.repoUrl}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
                className="inline-flex items-center gap-3 rounded-full border border-fg-muted/30 px-6 py-3 font-mono text-xs uppercase tracking-widest text-fg-muted transition-colors hover:border-fg hover:text-fg"
              >
                View source
                <span aria-hidden>↗</span>
              </a>
            )}
          </motion.div>
        )}
      </div>

      <div className="mt-16 px-6 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-fg-muted/10 bg-bg-muted"
        >
          <ParallaxImage
            src={work.heroImage}
            alt={work.title}
            fill
            priority
            speed={0.2}
            className="absolute inset-0"
          />
        </motion.div>
      </div>
    </section>
  );
}
