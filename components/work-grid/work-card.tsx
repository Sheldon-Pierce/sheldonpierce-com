"use client";
import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import type { WorkEntry } from "@/lib/work";

interface WorkCardProps {
  work: WorkEntry;
}

export function WorkCard({ work }: WorkCardProps) {
  const reduced = useReducedMotion();

  return (
    <Link
      href={`/work/${work.slug}`}
      data-cursor="hover"
      className="group relative block overflow-hidden rounded-xl border border-fg-muted/10 bg-bg-muted"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          whileHover={reduced ? undefined : { scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={work.heroImage}
            alt={work.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/0 to-transparent opacity-100 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 gradient-accent mix-blend-overlay" />
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-center justify-between text-fg-muted">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{work.year}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-right">
            {work.stack.slice(0, 2).join(" · ")}
          </span>
        </div>
        <h3 className="text-xl font-semibold leading-tight transition-colors group-hover:text-gradient-accent">
          {work.title}
        </h3>
        <p className="mt-2 text-sm text-fg-muted line-clamp-2">{work.summary}</p>
      </div>
    </Link>
  );
}
