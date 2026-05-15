"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

export function GradientOrb() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const yRaw = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const xRaw = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  const y = reduced ? "0%" : yRaw;
  const x = reduced ? "0%" : xRaw;

  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none fixed right-[-15%] top-[-10%] -z-10 h-[700px] w-[700px] rounded-full blur-3xl opacity-25"
    >
      <div className="h-full w-full gradient-accent rounded-full" />
    </motion.div>
  );
}
