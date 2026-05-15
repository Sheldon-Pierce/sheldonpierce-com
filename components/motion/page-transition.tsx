"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function PageTransition() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [key, setKey] = useState(pathname);

  useEffect(() => {
    setKey(pathname);
  }, [pathname]);

  if (reduced) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={key}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: [0, 1, 1, 0], originX: [0, 0, 1, 1] }}
        exit={{ opacity: 0 }}
        transition={{
          duration: 0.7,
          times: [0, 0.4, 0.6, 1],
          ease: [0.65, 0, 0.35, 1],
        }}
        className="pointer-events-none fixed inset-0 z-[90] gradient-accent"
        aria-hidden
      />
    </AnimatePresence>
  );
}
