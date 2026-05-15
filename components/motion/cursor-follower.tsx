"use client";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

export function CursorFollower() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 350, damping: 30 });
  const springY = useSpring(y, { stiffness: 350, damping: 30 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(hasFinePointer && !reduced);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a, button, [data-cursor='hover']"));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{ x: springX, y: springY }}
      className="pointer-events-none fixed left-0 top-0 z-[100] -translate-x-1/2 -translate-y-1/2"
    >
      <motion.div
        animate={{
          scale: hovering ? 2.5 : 1,
          opacity: hovering ? 0.8 : 0.6,
        }}
        transition={{ duration: 0.2 }}
        className="h-3 w-3 rounded-full gradient-accent blur-[1px]"
      />
    </motion.div>
  );
}
