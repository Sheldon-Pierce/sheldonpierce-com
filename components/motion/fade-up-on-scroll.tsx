"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface FadeUpOnScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function FadeUpOnScroll({
  children,
  delay = 0,
  className,
}: FadeUpOnScrollProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
