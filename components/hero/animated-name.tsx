"use client";
import { motion, useReducedMotion } from "motion/react";

interface AnimatedNameProps {
  text: string;
  className?: string;
}

export function AnimatedName({ text, className }: AnimatedNameProps) {
  const reduced = useReducedMotion();
  const letters = text.split("");

  if (reduced) {
    return <h1 className={className}>{text}</h1>;
  }

  return (
    <h1 className={className} aria-label={text}>
      {letters.map((char, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.7,
            delay: i * 0.05,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </h1>
  );
}
