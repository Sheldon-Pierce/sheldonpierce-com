"use client";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import Link from "next/link";
import { useState } from "react";

export function Nav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 40);
  });

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`site-nav${scrolled ? " scrolled" : ""}`}
    >
      <Link className="wordmark" href="/#top">
        sp<span>.</span>
      </Link>
      <div className="links">
        <Link href="/#work">Work</Link>
        <Link href="/#about">About</Link>
        <Link href="/#contact">Contact</Link>
        <a
          href="https://github.com/Sheldon-Pierce"
          target="_blank"
          rel="noopener"
        >
          GitHub ↗
        </a>
      </div>
    </motion.nav>
  );
}
