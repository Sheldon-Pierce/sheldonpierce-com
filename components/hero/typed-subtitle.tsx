"use client";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

interface TypedSubtitleProps {
  text: string;
  className?: string;
  startDelay?: number;
}

export function TypedSubtitle({
  text,
  className,
  startDelay = 0,
}: TypedSubtitleProps) {
  const reduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(reduced ? text : "");

  useEffect(() => {
    if (reduced) return;
    let i = 0;
    let cancelled = false;
    const start = setTimeout(() => {
      const tick = () => {
        if (cancelled) return;
        i++;
        setDisplayed(text.slice(0, i));
        if (i < text.length) {
          setTimeout(tick, 18 + Math.random() * 22);
        }
      };
      tick();
    }, startDelay * 1000);
    return () => {
      cancelled = true;
      clearTimeout(start);
    };
  }, [text, startDelay, reduced]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: startDelay }}
      className={className}
    >
      {displayed}
      {!reduced && displayed.length < text.length && (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-current align-middle" />
      )}
    </motion.p>
  );
}
