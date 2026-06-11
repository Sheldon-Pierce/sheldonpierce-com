"use client";
import { motion, useReducedMotion } from "motion/react";
import { Terrain } from "./terrain";
import { TypedSubtitle } from "./typed-subtitle";

const FIRST = "Sheldon";
const LAST = "Pierce";

export function Hero() {
  const reduced = useReducedMotion();

  return (
    <section className="hero" aria-label="Intro">
      <Terrain />
      <div className="hero-fade" />
      <div className="wrap">
        <motion.div
          className="hero-eyebrow"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="dot" /> SOFTWARE ENGINEER — SEATTLE, WA · 47.60°N
          122.33°W
        </motion.div>

        <h1 aria-label="Sheldon Pierce">
          <AnimatedLine text={FIRST} reduced={reduced} offset={0} />
          <br />
          <AnimatedLine text={LAST} reduced={reduced} offset={FIRST.length} />
          <span className="thin" aria-hidden>
            .
          </span>
        </h1>

        <TypedSubtitle
          className="hero-sub"
          startDelay={0.9}
          text="I build identity systems, platform infrastructure, and product UI — the unglamorous middle layer, and the polished surface on top of it."
        />

        <motion.div
          className="hero-cta"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a className="btn primary" href="#work">
            See the work ↓
          </a>
          <a className="btn ghost" href="mailto:pierce55@icloud.com">
            pierce55@icloud.com
          </a>
        </motion.div>
      </div>
      <div className="scroll-hint">SCROLL TO DESCEND</div>
    </section>
  );
}

/** Letter-by-letter reveal for one line of the hero name (the kept flourish). */
function AnimatedLine({
  text,
  reduced,
  offset,
}: {
  text: string;
  reduced: boolean | null;
  offset: number;
}) {
  if (reduced) return <>{text}</>;
  return (
    <>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.7,
            delay: (offset + i) * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {char}
        </motion.span>
      ))}
    </>
  );
}
