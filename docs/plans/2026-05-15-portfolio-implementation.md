# sheldonpierce.com Portfolio — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a motion-forward, image-led personal portfolio site at sheldonpierce.com showcasing 6 case studies to freelance prospects.

**Architecture:** Single Next.js 15 app (App Router, RSC) with one landing page + dynamic case-study detail routes. MDX-driven content. Tailwind v4 (CSS-first config). Motion via `motion` (Framer Motion). Vercel hosting.

**Tech Stack:** Next.js 15, React 19, TypeScript (strict), Tailwind CSS v4, motion (framer-motion), MDX, Vitest, Playwright, Vercel.

**Spec:** [`docs/design.md`](../design.md)

---

## Testing strategy

- **Utility/lib code** (MDX loader, motion helpers): Vitest unit tests, written test-first (TDD).
- **React components:** Visual verification — run `npm run dev`, view in browser, check the specific behavior listed in each task. Optionally screenshot.
- **End-to-end smoke** (Phase 8): Playwright test that loads the site, clicks through all nav and case-study links, checks 200 responses.
- **Type safety:** TypeScript strict mode catches the bulk of regressions for component code; `npm run typecheck` runs in every commit's pre-push hook (Phase 8).

---

## Phase 1: Foundation

### Task 1.1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `next-env.d.ts`, `.eslintrc.json`

- [ ] **Step 1: Run create-next-app**

The project dir already exists with `.git/`, `.gitignore`, `README.md`, `docs/`. Use `--use-npm` and answer prompts with defaults shown.

Run from `/Users/sheldon/projects/PersonalProjects/sheldonpierce-com`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --use-npm --turbopack --no-experimental-https
```

If the prompt asks about overwriting existing files (README, .gitignore), answer **No** to each.

- [ ] **Step 2: Verify the scaffold runs**

Run:
```bash
npm run dev
```

Open <http://localhost:3000>. Expected: default Next.js welcome page renders. Stop the dev server with Ctrl-C.

- [ ] **Step 3: Pin React 19 and Next 15 versions**

Open `package.json`. Verify `"next": "^15.x"` and `"react": "^19.x"`. If versions are older, run:
```bash
npm install next@latest react@latest react-dom@latest
```

- [ ] **Step 4: Enable TypeScript strict mode**

Open `tsconfig.json`. Ensure `"strict": true` is set under `compilerOptions`. If missing, add it.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js 15 + Tailwind v4 + TypeScript strict"
```

---

### Task 1.2: Install motion library and MDX support

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
npm install motion @next/mdx @mdx-js/loader @mdx-js/react gray-matter
npm install --save-dev @types/mdx
```

- [ ] **Step 2: Install dev/test dependencies**

```bash
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test
```

- [ ] **Step 3: Verify install succeeded**

Run:
```bash
npm ls motion @next/mdx vitest
```

Expected: all three packages listed with versions, no peer-dep warnings.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add motion, MDX, vitest, playwright dependencies"
```

---

### Task 1.3: Configure fonts (Geist Sans + Mono)

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace app/layout.tsx contents**

```tsx
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sheldon Pierce — Software Engineer",
  description:
    "Software engineer building identity systems, platforms, and product UI. Seattle, WA.",
  metadataBase: new URL("https://sheldonpierce.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-bg text-fg font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Install Geist font package**

```bash
npm install geist
```

- [ ] **Step 3: Verify it builds**

Run:
```bash
npm run dev
```

Open <http://localhost:3000>. Expected: page renders (will look unstyled — Tailwind classes `bg-bg text-fg` don't exist yet, that's next task). No font 404s in browser devtools network tab. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx package.json package-lock.json
git commit -m "feat: wire Geist Sans + Mono via next/font"
```

---

### Task 1.4: Set up theme tokens via Tailwind v4 CSS-first config

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace app/globals.css contents**

```css
@import "tailwindcss";

@theme {
  --color-bg: #0a0a0b;
  --color-bg-muted: #1a1a1d;
  --color-fg: #ededef;
  --color-fg-muted: #9ca3af;
  --color-accent-violet: #7c3aed;
  --color-accent-cyan: #06b6d4;

  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);

  --spacing-section: 6rem;
  --spacing-section-mobile: 4rem;
}

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    background: var(--color-bg);
    color: var(--color-fg);
    overflow-x: hidden;
  }

  /* Selection */
  ::selection {
    background: var(--color-accent-violet);
    color: var(--color-fg);
  }
}

/* Subtle SVG noise overlay for dark sections */
.noise::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}

/* Accent gradient utility */
.gradient-accent {
  background-image: linear-gradient(
    135deg,
    var(--color-accent-violet),
    var(--color-accent-cyan)
  );
}

.text-gradient-accent {
  background-image: linear-gradient(
    135deg,
    var(--color-accent-violet),
    var(--color-accent-cyan)
  );
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

- [ ] **Step 2: Verify build**

Run `npm run dev`, open <http://localhost:3000>. Expected: background is dark `#0a0a0b`, text is `#ededef`. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: define Tailwind v4 theme tokens (palette, fonts, spacing)"
```

---

### Task 1.5: Create empty section placeholders on landing page

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx contents with section scaffolding**

```tsx
export default function Home() {
  return (
    <main>
      <section
        id="hero"
        className="relative flex min-h-screen items-center justify-center"
      >
        <h1 className="text-5xl font-bold">Hero (TBD)</h1>
      </section>

      <section id="featured" className="relative py-section">
        <h2 className="text-3xl font-semibold">Featured (TBD)</h2>
      </section>

      <section id="work" className="relative py-section">
        <h2 className="text-3xl font-semibold">Work (TBD)</h2>
      </section>

      <section id="about" className="relative py-section">
        <h2 className="text-3xl font-semibold">About (TBD)</h2>
      </section>

      <section id="contact" className="relative py-section">
        <h2 className="text-3xl font-semibold">Contact (TBD)</h2>
      </section>

      <footer className="border-t border-fg-muted/20 py-8 text-center text-fg-muted">
        © Sheldon Pierce · Seattle
      </footer>
    </main>
  );
}
```

- [ ] **Step 2: Verify the page renders all 5 sections**

Run `npm run dev`. Open <http://localhost:3000>. Scroll through. Expected: 5 sections each with "TBD" placeholder, plus footer. Each section >= 1 viewport tall except featured/work/about/contact (just text). Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: add landing page section scaffolding"
```

---

## Phase 2: Motion primitives

### Task 2.1: Set up Vitest

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`
- Modify: `package.json` (add test scripts)

- [ ] **Step 1: Create vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

- [ ] **Step 2: Create vitest.setup.ts**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Add test scripts to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 4: Verify vitest runs (with no tests yet)**

```bash
npm test
```

Expected: "No test files found" message, exit code 0. (If exit code is non-zero, fix vitest config.)

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json
git commit -m "chore: configure Vitest with React Testing Library + jsdom"
```

---

### Task 2.2: useReducedMotion hook

**Files:**
- Create: `components/motion/use-reduced-motion.ts`
- Test: `components/motion/use-reduced-motion.test.ts`

- [ ] **Step 1: Write failing test**

Create `components/motion/use-reduced-motion.test.ts`:
```ts
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { useReducedMotion } from "./use-reduced-motion";

describe("useReducedMotion", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns false when prefers-reduced-motion is not set", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((q) => ({
      matches: false,
      media: q,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it("returns true when prefers-reduced-motion: reduce is set", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((q) => ({
      matches: q.includes("reduce"),
      media: q,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});
```

- [ ] **Step 2: Run test, verify fail**

```bash
npm test
```

Expected: FAIL — module `./use-reduced-motion` does not exist.

- [ ] **Step 3: Implement the hook**

Create `components/motion/use-reduced-motion.ts`:
```ts
"use client";
import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test
```

Expected: 2 passing.

- [ ] **Step 5: Commit**

```bash
git add components/motion/use-reduced-motion.ts components/motion/use-reduced-motion.test.ts
git commit -m "feat(motion): add useReducedMotion hook with tests"
```

---

### Task 2.3: FadeUpOnScroll component

**Files:**
- Create: `components/motion/fade-up-on-scroll.tsx`

- [ ] **Step 1: Implement component**

```tsx
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
```

Note: this uses `motion/react`'s built-in `useReducedMotion` (functionally equivalent to our hook from Task 2.2; our hook stays available for non-motion contexts).

- [ ] **Step 2: Smoke-test in landing page**

Edit `app/page.tsx` to wrap the hero h1:
```tsx
import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";

// in JSX, replace <h1> in #hero with:
<FadeUpOnScroll>
  <h1 className="text-5xl font-bold">Hero (TBD)</h1>
</FadeUpOnScroll>
```

Run `npm run dev`, open <http://localhost:3000>. Expected: hero text fades up on initial scroll/load. Stop dev server.

Then revert the `app/page.tsx` change (smoke-test only — hero gets built properly in Phase 3).

- [ ] **Step 3: Commit**

```bash
git add components/motion/fade-up-on-scroll.tsx
git commit -m "feat(motion): add FadeUpOnScroll with reduced-motion fallback"
```

---

### Task 2.4: MagneticButton component

**Files:**
- Create: `components/motion/magnetic-button.tsx`

- [ ] **Step 1: Implement component**

```tsx
"use client";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useRef, type ReactNode, type MouseEvent } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
}

export function MagneticButton({
  children,
  className,
  href,
  onClick,
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 18 });
  const springY = useSpring(y, { stiffness: 200, damping: 18 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * strength;
    const dy = (e.clientY - cy) * strength;
    x.set(dx);
    y.set(dy);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.div>
  );

  return href ? <a href={href}>{content}</a> : content;
}
```

- [ ] **Step 2: Smoke-test in landing page**

Temporarily add to `app/page.tsx` inside `#hero`:
```tsx
import { MagneticButton } from "@/components/motion/magnetic-button";
// inside <section id="hero">:
<MagneticButton className="rounded-full border border-fg-muted/30 px-6 py-3 hover:border-fg">
  Hover me
</MagneticButton>
```

Run dev server. Move mouse near the button. Expected: button subtly follows cursor within ~100px. Stop dev server, revert the page change.

- [ ] **Step 3: Commit**

```bash
git add components/motion/magnetic-button.tsx
git commit -m "feat(motion): add MagneticButton with spring physics + reduced-motion fallback"
```

---

### Task 2.5: ParallaxImage component

**Files:**
- Create: `components/motion/parallax-image.tsx`

- [ ] **Step 1: Implement component**

```tsx
"use client";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
}

export function ParallaxImage({
  src,
  alt,
  className,
  speed = 0.3,
  priority,
  fill,
  width,
  height,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yRaw = useTransform(scrollYProgress, [0, 1], ["0%", `${speed * 100}%`]);
  const y = reduced ? 0 : yRaw;

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div style={{ y }} className="h-full w-full">
        {fill ? (
          <Image src={src} alt={alt} fill priority={priority} className="object-cover" />
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width ?? 1600}
            height={height ?? 900}
            priority={priority}
            className="h-full w-full object-cover"
          />
        )}
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/motion/parallax-image.tsx
git commit -m "feat(motion): add ParallaxImage component"
```

---

### Task 2.6: CursorFollower component

**Files:**
- Create: `components/motion/cursor-follower.tsx`

- [ ] **Step 1: Implement component**

```tsx
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
```

- [ ] **Step 2: Wire into root layout**

Edit `app/layout.tsx`. Import and place inside `<body>`:
```tsx
import { CursorFollower } from "@/components/motion/cursor-follower";

// inside <body>, before {children}:
<CursorFollower />
```

- [ ] **Step 3: Verify visually**

Run `npm run dev`. Open <http://localhost:3000>. Expected on desktop: glowing dot follows cursor smoothly; grows when over the section headings (not interactive yet — they aren't `a`/`button`, so grow won't trigger). On mobile/devtools touch emulation: dot does not appear. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add components/motion/cursor-follower.tsx app/layout.tsx
git commit -m "feat(motion): add CursorFollower with hover state + touch fallback"
```

---

## Phase 3: Hero section

### Task 3.1: Animated name component

**Files:**
- Create: `components/hero/animated-name.tsx`

- [ ] **Step 1: Implement component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/hero/animated-name.tsx
git commit -m "feat(hero): add AnimatedName with per-letter blur reveal"
```

---

### Task 3.2: Typed subtitle component

**Files:**
- Create: `components/hero/typed-subtitle.tsx`

- [ ] **Step 1: Implement component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/hero/typed-subtitle.tsx
git commit -m "feat(hero): add TypedSubtitle with typewriter animation"
```

---

### Task 3.3: Background gradient orb

**Files:**
- Create: `components/hero/gradient-orb.tsx`

- [ ] **Step 1: Implement component**

```tsx
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
```

- [ ] **Step 2: Wire into layout**

Edit `app/layout.tsx`. Add inside `<body>` (before children, after CursorFollower):
```tsx
import { GradientOrb } from "@/components/hero/gradient-orb";
// ...
<GradientOrb />
```

- [ ] **Step 3: Verify visually**

Run `npm run dev`. Expected: soft violet→cyan glow in top-right that drifts as you scroll. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add components/hero/gradient-orb.tsx app/layout.tsx
git commit -m "feat(hero): add scroll-reactive background gradient orb"
```

---

### Task 3.4: Hero section composition

**Files:**
- Create: `components/hero/hero.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create Hero composition**

```tsx
import { AnimatedName } from "./animated-name";
import { TypedSubtitle } from "./typed-subtitle";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-start justify-center px-6 md:px-16 lg:px-24"
    >
      <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
        Software engineer · Seattle
      </p>
      <AnimatedName
        text="Sheldon Pierce"
        className="text-6xl font-bold leading-[1.05] tracking-tight md:text-8xl lg:text-9xl"
      />
      <TypedSubtitle
        text="Building identity systems, platforms, and product UI that get out of the way."
        startDelay={1.0}
        className="mt-8 max-w-2xl text-lg text-fg-muted md:text-xl"
      />
      <a
        href="#featured"
        className="mt-16 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg-muted transition-colors hover:text-fg"
      >
        <span className="h-px w-8 bg-current" />
        Scroll
      </a>
    </section>
  );
}
```

- [ ] **Step 2: Wire into app/page.tsx**

Replace the `<section id="hero">…</section>` block in `app/page.tsx` with:
```tsx
import { Hero } from "@/components/hero/hero";

// in JSX, instead of the placeholder hero section:
<Hero />
```

- [ ] **Step 3: Verify visually**

Run `npm run dev`. Open <http://localhost:3000>. Expected:
- "SOFTWARE ENGINEER · SEATTLE" caption fades in
- "Sheldon Pierce" reveals letter by letter with blur clearing
- Subtitle types itself in after ~1 sec delay
- Background orb drifts as you scroll
- Scroll indicator at bottom

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add components/hero/hero.tsx app/page.tsx
git commit -m "feat(hero): compose hero section with name + subtitle + scroll indicator"
```

---

### Task 3.5: Fixed nav with scroll-triggered solid background

**Files:**
- Create: `components/nav/nav.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Implement Nav**

```tsx
"use client";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    setSolid(v > 80);
  });

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-bg/80 backdrop-blur-md border-b border-fg-muted/10" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-16 lg:px-24">
        <Link href="/" className="font-mono text-sm font-semibold">
          sp.
        </Link>
        <div className="flex items-center gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-mono text-xs uppercase tracking-widest text-fg-muted transition-colors hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
```

- [ ] **Step 2: Wire into layout**

Edit `app/layout.tsx`. Add inside `<body>` before children:
```tsx
import { Nav } from "@/components/nav/nav";
// ...
<Nav />
```

- [ ] **Step 3: Verify visually**

Run dev server. Expected: nav slides down from top; transparent on hero; gains background blur + border once you scroll past ~80px. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add components/nav/nav.tsx app/layout.tsx
git commit -m "feat(nav): add fixed nav with scroll-triggered solid background"
```

---

## Phase 4: MDX content pipeline + featured case study

### Task 4.1: Configure MDX

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Replace next.config.ts contents**

```ts
import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
```

- [ ] **Step 2: Verify it builds**

```bash
npm run build
```

Expected: build succeeds. (May warn about no MDX files — that's fine.)

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "chore(mdx): enable MDX page extensions and image formats"
```

---

### Task 4.2: Work-content loader (lib/work.ts) with tests

**Files:**
- Create: `lib/work.ts`, `lib/work.test.ts`
- Create: `content/work/test-fixture.mdx` (temporary, for the test)

- [ ] **Step 1: Write failing test**

Create `lib/work.test.ts`:
```ts
import { describe, expect, it } from "vitest";
import { getAllWork, getWorkBySlug } from "./work";

describe("work loader", () => {
  it("loads all work entries sorted with featured first then by year desc", () => {
    const all = getAllWork();
    expect(all.length).toBeGreaterThan(0);
    expect(all[0].featured).toBe(true);
  });

  it("returns a single work entry by slug", () => {
    const entry = getWorkBySlug("test-fixture");
    expect(entry).not.toBeNull();
    expect(entry?.title).toBe("Test Fixture");
  });

  it("returns null for unknown slug", () => {
    expect(getWorkBySlug("does-not-exist")).toBeNull();
  });
});
```

Create `content/work/test-fixture.mdx`:
```mdx
---
slug: test-fixture
title: Test Fixture
year: 2026
featured: true
role: Test
stack: [Test]
heroImage: /work/test/hero.png
summary: A test fixture for the work loader.
---

Test body.
```

- [ ] **Step 2: Run test, verify fail**

```bash
npm test
```

Expected: FAIL — module `./work` does not exist.

- [ ] **Step 3: Implement lib/work.ts**

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export interface WorkFrontmatter {
  slug: string;
  title: string;
  year: number;
  featured?: boolean;
  role: string;
  stack: string[];
  liveUrl?: string | null;
  repoUrl?: string | null;
  heroImage: string;
  gallery?: string[];
  summary: string;
}

export interface WorkEntry extends WorkFrontmatter {
  body: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "work");

function readEntry(filename: string): WorkEntry {
  const filePath = path.join(CONTENT_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = data as WorkFrontmatter;
  return { ...fm, body: content };
}

export function getAllWork(): WorkEntry[] {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  const entries = files.map(readEntry);
  return entries.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.year - a.year;
  });
}

export function getWorkBySlug(slug: string): WorkEntry | null {
  try {
    const file = `${slug}.mdx`;
    if (!fs.existsSync(path.join(CONTENT_DIR, file))) return null;
    return readEntry(file);
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Run test, verify pass**

```bash
npm test
```

Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add lib/work.ts lib/work.test.ts content/work/test-fixture.mdx
git commit -m "feat(content): add MDX work loader with frontmatter parsing"
```

---

### Task 4.3: Write all 6 case-study MDX files

**Files:**
- Delete: `content/work/test-fixture.mdx`
- Create: `content/work/keycloak-theme.mdx`, `handyman-services.mdx`, `west-seattle-blog.mdx`, `adoreal-platform.mdx`, `capital-finder.mdx`, `urban-trail.mdx`

- [ ] **Step 1: Remove test fixture and update test**

```bash
rm content/work/test-fixture.mdx
```

Edit `lib/work.test.ts` to remove the test-fixture-specific assertions. Replace with:
```ts
import { describe, expect, it } from "vitest";
import { getAllWork, getWorkBySlug } from "./work";

describe("work loader", () => {
  it("loads all work entries sorted with featured first then by year desc", () => {
    const all = getAllWork();
    expect(all.length).toBe(6);
    expect(all[0].featured).toBe(true);
    expect(all[0].slug).toBe("keycloak-theme");
  });

  it("returns a single work entry by slug", () => {
    const entry = getWorkBySlug("handyman-services");
    expect(entry).not.toBeNull();
    expect(entry?.title).toBe("Handyman Services");
  });

  it("returns null for unknown slug", () => {
    expect(getWorkBySlug("does-not-exist")).toBeNull();
  });
});
```

- [ ] **Step 2: Create keycloak-theme.mdx (featured)**

```mdx
---
slug: keycloak-theme
title: Adoreal Keycloak Theme & Consumer Login
year: 2026
featured: true
role: Engineering lead — identity & UX
stack: [Keycloak, Keycloakify, React, TypeScript, Next.js, Tailwind CSS]
heroImage: /work/keycloak-theme/hero.png
gallery:
  - /work/keycloak-theme/login.png
  - /work/keycloak-theme/totp.png
  - /work/keycloak-theme/email.png
summary: Re-skinned the identity layer for a healthcare platform — login, TOTP, email — in the company's brand.
---

## Problem

The team migrated authentication to Keycloak from a legacy provider, and inherited Keycloak's stock theme — generic, blue, off-brand. The login screen is the first thing every patient sees. It needed to feel like the rest of the product.

## Approach

Built a Keycloakify-based theme inside a dedicated build pipeline so theme changes ship independently of the Keycloak server. Replaced the stock templates for login, registration, OTP (TOTP and email), forgot-password, and verify-email. Themed the transactional emails to match. Unified the Keycloak server image and theme image into one ECR pipeline so deploys stay simple.

## Result

A login experience that feels native to the product instead of bolted on. Consistent typography, color, and tone from the marketing site through to authentication. Faster iteration on identity UI because theme changes deploy on their own pipeline, separate from the Keycloak server.
```

- [ ] **Step 3: Create handyman-services.mdx**

```mdx
---
slug: handyman-services
title: Handyman Services
year: 2023
featured: false
role: Solo build — design & engineering
stack: [Next.js, TypeScript, Tailwind CSS, Vercel]
liveUrl: https://handyman-services-one.vercel.app
repoUrl: https://github.com/Sheldon-Pierce/HandymanServices
heroImage: /work/handyman-services/hero.png
gallery:
  - /work/handyman-services/services.png
  - /work/handyman-services/contact.png
summary: Local services landing page built end-to-end — design, copy, build, deploy.
---

## Problem

Small local-services businesses live and die by their phone ringing. A clean, fast website that loads on a mobile network and gets people to call is worth more than any feature list.

## Approach

Single-page Next.js site with a service grid, social proof, and a phone-first contact section. Mobile-first responsive layout. No CMS — content lives in the source so updates are a one-line PR.

## Result

A site that loads under a second on 4G, is trivial to update, and costs nothing to host on Vercel. Pattern reusable for any local-services client.
```

- [ ] **Step 4: Create west-seattle-blog.mdx**

```mdx
---
slug: west-seattle-blog
title: West Seattle Blog
year: 2023
featured: false
role: Solo build
stack: [Next.js, TypeScript, Tailwind CSS]
repoUrl: https://github.com/Sheldon-Pierce/WestSeattleBlog
heroImage: /work/west-seattle-blog/hero.png
gallery:
  - /work/west-seattle-blog/article.png
summary: Neighborhood blog with article browsing and category filtering.
---

## Problem

Neighborhood news sites are usually painful to browse — heavy ads, slow loads, stale layouts. I wanted to see what a clean, fast version looked like.

## Approach

Next.js site with a typed content model and category routing. Focus on legible typography and fast page transitions.

## Result

A pattern I've reused for other content-heavy sites. Easy to extend with new sections — the routing handles the heavy lifting.
```

- [ ] **Step 5: Create adoreal-platform.mdx**

```mdx
---
slug: adoreal-platform
title: Adoreal Platform Engineering
year: 2026
featured: false
role: Senior software engineer
stack: [.NET, C#, Terraform, AWS, Keycloak, RabbitMQ, MassTransit]
heroImage: /work/adoreal-platform/hero.png
gallery:
  - /work/adoreal-platform/architecture.png
summary: Platform-scale work at a healthcare startup — shared libraries, identity migration, infrastructure.
---

## Problem

A healthcare platform built across ~28 services accumulates the usual debts: duplicated utility code per service, an identity layer that grew faster than it was designed, infrastructure changes that block on tribal knowledge.

## Approach

Ship breaking changes as coordinated, versioned migrations — not as quiet patches. Move shared functionality into versioned NuGet packages so every service gets the same primitives. Treat identity as a product, not a piece of glue: migrate from a legacy provider to Keycloak with OIDC-native claims, and version the security library as a real semver release (v2.0.0) so consumers can adopt at their own pace.

## Result

Cleaner service boundaries, less per-service ceremony, and a security library that no longer requires reading every consumer's code to make a change. The team gained the ability to evolve identity behavior without spelunking through every microservice.
```

- [ ] **Step 6: Create capital-finder.mdx**

```mdx
---
slug: capital-finder
title: Capital Finder
year: 2023
featured: false
role: Solo build
stack: [Python, Flask, Vercel]
liveUrl: https://capital-finder-sheldon-pierce.vercel.app
repoUrl: https://github.com/Sheldon-Pierce/capital-finder
heroImage: /work/capital-finder/hero.png
summary: Tiny Python web app that looks up world capitals.
---

## Problem

A practice project to wire up a Python backend with a deployable frontend.

## Approach

Flask app, REST endpoint backed by a static dataset, deployed to Vercel.

## Result

A small, finished thing — and a complete end-to-end deploy story for Python on Vercel.
```

- [ ] **Step 7: Create urban-trail.mdx**

```mdx
---
slug: urban-trail
title: UrbanTrail
year: 2023
featured: false
role: Solo build
stack: [JavaScript, HTML, CSS]
repoUrl: https://github.com/Sheldon-Pierce/UrbanTrail
heroImage: /work/urban-trail/hero.png
summary: Browser-based urban exploration prototype.
---

## Problem

An early experiment in interactive maps and route discovery.

## Approach

Vanilla JS app with map rendering and route plotting.

## Result

A finished prototype — useful as a reference for later, more polished mapping work.
```

- [ ] **Step 8: Create placeholder image files**

For each case study, create a placeholder image. These will be replaced by the user with real screenshots later.

```bash
mkdir -p public/work/{keycloak-theme,handyman-services,west-seattle-blog,adoreal-platform,capital-finder,urban-trail}
```

Use a single shared placeholder by creating `public/work/placeholder.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" width="1600" height="900">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7c3aed"/>
      <stop offset="100%" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="900" fill="#0a0a0b"/>
  <rect width="1600" height="900" fill="url(#g)" opacity="0.18"/>
  <text x="800" y="450" font-family="monospace" font-size="48" fill="#ededef" text-anchor="middle" dominant-baseline="middle" opacity="0.7">replace with screenshot</text>
</svg>
```

Then for each case study, symlink-style copy:
```bash
for slug in keycloak-theme handyman-services west-seattle-blog adoreal-platform capital-finder urban-trail; do
  cp public/work/placeholder.svg "public/work/$slug/hero.png"
done
# Also create gallery placeholders for case studies that reference them
cp public/work/placeholder.svg public/work/keycloak-theme/login.png
cp public/work/placeholder.svg public/work/keycloak-theme/totp.png
cp public/work/placeholder.svg public/work/keycloak-theme/email.png
cp public/work/placeholder.svg public/work/handyman-services/services.png
cp public/work/placeholder.svg public/work/handyman-services/contact.png
cp public/work/placeholder.svg public/work/west-seattle-blog/article.png
cp public/work/placeholder.svg public/work/adoreal-platform/architecture.png
```

Note: copying SVG content into a `.png` extension works fine for Next.js `<Image>` because the file is served as-is. Final-quality screenshots will replace these before launch.

- [ ] **Step 9: Run tests**

```bash
npm test
```

Expected: 3 passing in work.test.ts.

- [ ] **Step 10: Commit**

```bash
git add content/work/ public/work/ lib/work.test.ts
git commit -m "feat(content): add all 6 case-study MDX files + placeholder images"
```

---

### Task 4.4: Featured case-study component

**Files:**
- Create: `components/featured-work/featured-work.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Implement component**

```tsx
import Link from "next/link";
import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";
import { ParallaxImage } from "@/components/motion/parallax-image";
import type { WorkEntry } from "@/lib/work";

interface FeaturedWorkProps {
  work: WorkEntry;
}

export function FeaturedWork({ work }: FeaturedWorkProps) {
  return (
    <section
      id="featured"
      className="relative px-6 py-section md:px-16 lg:px-24"
    >
      <FadeUpOnScroll>
        <p className="mb-8 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          Featured · {work.year}
        </p>
      </FadeUpOnScroll>

      <Link href={`/work/${work.slug}`} className="group block">
        <FadeUpOnScroll>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-fg-muted/10 bg-bg-muted">
            <ParallaxImage
              src={work.heroImage}
              alt={work.title}
              fill
              priority
              speed={0.25}
              className="absolute inset-0"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
          </div>
        </FadeUpOnScroll>

        <FadeUpOnScroll delay={0.1}>
          <h2 className="mt-10 max-w-4xl text-4xl font-semibold leading-tight md:text-6xl">
            {work.title}
          </h2>
        </FadeUpOnScroll>

        <FadeUpOnScroll delay={0.15}>
          <p className="mt-6 max-w-2xl text-lg text-fg-muted">{work.summary}</p>
        </FadeUpOnScroll>

        <FadeUpOnScroll delay={0.2}>
          <span className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg transition-colors group-hover:text-gradient-accent">
            Read case study
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </FadeUpOnScroll>
      </Link>
    </section>
  );
}
```

- [ ] **Step 2: Wire into app/page.tsx**

Update `app/page.tsx`:
```tsx
import { Hero } from "@/components/hero/hero";
import { FeaturedWork } from "@/components/featured-work/featured-work";
import { getAllWork } from "@/lib/work";

export default function Home() {
  const allWork = getAllWork();
  const featured = allWork.find((w) => w.featured);
  const rest = allWork.filter((w) => !w.featured);

  return (
    <main>
      <Hero />
      {featured && <FeaturedWork work={featured} />}

      <section id="work" className="relative py-section">
        <h2 className="text-3xl font-semibold px-6 md:px-16 lg:px-24">
          Selected work (TBD)
        </h2>
      </section>

      <section id="about" className="relative py-section">
        <h2 className="text-3xl font-semibold px-6 md:px-16 lg:px-24">
          About (TBD)
        </h2>
      </section>

      <section id="contact" className="relative py-section">
        <h2 className="text-3xl font-semibold px-6 md:px-16 lg:px-24">
          Contact (TBD)
        </h2>
      </section>

      <footer className="border-t border-fg-muted/20 py-8 text-center text-fg-muted">
        © Sheldon Pierce · Seattle
      </footer>
    </main>
  );
}
```

- [ ] **Step 3: Verify visually**

Run dev server. Expected:
- Featured section renders below hero
- Placeholder image with violet/cyan gradient
- "Featured · 2026" caption
- Big title "Adoreal Keycloak Theme & Consumer Login"
- Summary paragraph
- "Read case study →" link
- Image parallaxes when scrolling

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add components/featured-work/ app/page.tsx
git commit -m "feat(featured-work): add featured case-study card with parallax hero"
```

---

## Phase 5: Work grid

### Task 5.1: WorkCard component

**Files:**
- Create: `components/work-grid/work-card.tsx`

- [ ] **Step 1: Implement component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/work-grid/work-card.tsx
git commit -m "feat(work-grid): add WorkCard with hover ken-burns + accent glow"
```

---

### Task 5.2: WorkGrid section

**Files:**
- Create: `components/work-grid/work-grid.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Implement WorkGrid**

```tsx
import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";
import { WorkCard } from "./work-card";
import type { WorkEntry } from "@/lib/work";

interface WorkGridProps {
  work: WorkEntry[];
}

export function WorkGrid({ work }: WorkGridProps) {
  return (
    <section id="work" className="relative px-6 py-section md:px-16 lg:px-24">
      <FadeUpOnScroll>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          Selected work
        </p>
      </FadeUpOnScroll>
      <FadeUpOnScroll delay={0.1}>
        <h2 className="mb-16 text-4xl font-semibold md:text-5xl">
          More things I've built.
        </h2>
      </FadeUpOnScroll>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {work.map((entry, i) => (
          <FadeUpOnScroll key={entry.slug} delay={0.05 * i}>
            <WorkCard work={entry} />
          </FadeUpOnScroll>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page**

In `app/page.tsx`, replace the `<section id="work">` placeholder with:
```tsx
import { WorkGrid } from "@/components/work-grid/work-grid";
// ...
<WorkGrid work={rest} />
```

- [ ] **Step 3: Verify visually**

Run dev server. Expected:
- "Selected work" caption + heading
- 3-column grid on desktop (2-col tablet, 1-col mobile) with 5 cards
- Cards have placeholder image, year, stack snippet, title, summary
- Hover: image zooms slightly, gradient overlay appears, title shifts to gradient color

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add components/work-grid/work-grid.tsx app/page.tsx
git commit -m "feat(work-grid): add responsive grid section with staggered reveal"
```

---

## Phase 6: Case-study detail pages

### Task 6.1: Dynamic route + MDX rendering

**Files:**
- Create: `app/work/[slug]/page.tsx`
- Create: `app/work/[slug]/not-found.tsx`

- [ ] **Step 1: Create the not-found page**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">404</p>
      <h1 className="mt-4 text-4xl font-semibold">Case study not found</h1>
      <Link
        href="/"
        className="mt-8 font-mono text-xs uppercase tracking-widest text-fg-muted hover:text-fg"
      >
        ← Back home
      </Link>
    </main>
  );
}
```

- [ ] **Step 2: Create the dynamic route page**

```tsx
import { notFound } from "next/navigation";
import { getAllWork, getWorkBySlug } from "@/lib/work";
import { CaseStudyHero } from "@/components/case-study/case-study-hero";
import { CaseStudyBody } from "@/components/case-study/case-study-body";
import { CaseStudyGallery } from "@/components/case-study/case-study-gallery";
import { CaseStudyMeta } from "@/components/case-study/case-study-meta";
import { CaseStudyNext } from "@/components/case-study/case-study-next";
import { ScrollProgress } from "@/components/motion/scroll-progress";

export function generateStaticParams() {
  return getAllWork().map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) return {};
  return {
    title: `${work.title} — Sheldon Pierce`,
    description: work.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();

  const all = getAllWork();
  const idx = all.findIndex((w) => w.slug === slug);
  const next = all[(idx + 1) % all.length];

  return (
    <main className="relative">
      <ScrollProgress />
      <CaseStudyHero work={work} />
      <CaseStudyBody body={work.body} />
      {work.gallery && work.gallery.length > 0 && (
        <CaseStudyGallery images={work.gallery} title={work.title} />
      )}
      <CaseStudyMeta work={work} />
      <CaseStudyNext next={next} />
    </main>
  );
}
```

(Components referenced are created in the following tasks.)

- [ ] **Step 3: Commit (will fail to build until later tasks land, but commit the route shell)**

```bash
git add app/work/
git commit -m "feat(case-study): add dynamic route + 404 page skeleton"
```

---

### Task 6.2: ScrollProgress component

**Files:**
- Create: `components/motion/scroll-progress.tsx`

- [ ] **Step 1: Implement component**

```tsx
"use client";
import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left gradient-accent"
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/motion/scroll-progress.tsx
git commit -m "feat(motion): add ScrollProgress top bar"
```

---

### Task 6.3: CaseStudyHero component

**Files:**
- Create: `components/case-study/case-study-hero.tsx`

- [ ] **Step 1: Implement component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add components/case-study/case-study-hero.tsx
git commit -m "feat(case-study): add hero with parallax image + entrance animations"
```

---

### Task 6.4: CaseStudyBody component (MDX-rendered)

**Files:**
- Create: `components/case-study/case-study-body.tsx`
- Create: `mdx-components.tsx` (Next.js MDX customization)

- [ ] **Step 1: Create mdx-components.tsx in repo root**

```tsx
import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h2: ({ children }) => (
      <h2 className="mt-16 text-2xl font-semibold md:text-3xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 text-xl font-semibold">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mt-6 text-lg leading-relaxed text-fg-muted">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mt-6 list-disc space-y-2 pl-6 text-fg-muted">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-6 list-decimal space-y-2 pl-6 text-fg-muted">{children}</ol>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="underline decoration-fg-muted/40 underline-offset-4 transition-colors hover:decoration-fg"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded bg-bg-muted px-1.5 py-0.5 font-mono text-sm">
        {children}
      </code>
    ),
    ...components,
  };
}
```

- [ ] **Step 2: Create CaseStudyBody component using MDXRemote**

For rendering arbitrary MDX strings at runtime, install `next-mdx-remote-client`:
```bash
npm install next-mdx-remote-client
```

Then create `components/case-study/case-study-body.tsx`:
```tsx
import { MDXRemote } from "next-mdx-remote-client/rsc";
import { useMDXComponents } from "@/mdx-components";

interface CaseStudyBodyProps {
  body: string;
}

export function CaseStudyBody({ body }: CaseStudyBodyProps) {
  const components = useMDXComponents({});
  return (
    <article className="mx-auto mt-24 max-w-3xl px-6 md:px-0">
      <MDXRemote source={body} components={components} />
    </article>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add mdx-components.tsx components/case-study/case-study-body.tsx package.json package-lock.json
git commit -m "feat(case-study): render MDX body with custom typographic components"
```

---

### Task 6.5: CaseStudyGallery with lightbox

**Files:**
- Create: `components/case-study/case-study-gallery.tsx`

- [ ] **Step 1: Implement component**

```tsx
"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";

interface CaseStudyGalleryProps {
  images: string[];
  title: string;
}

export function CaseStudyGallery({ images, title }: CaseStudyGalleryProps) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? null : (i - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  return (
    <section className="mt-24 px-6 md:px-16 lg:px-24">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {images.map((src, i) => (
          <button
            key={src}
            onClick={() => setOpen(i)}
            data-cursor="hover"
            className="relative aspect-[4/3] overflow-hidden rounded-xl border border-fg-muted/10 bg-bg-muted"
          >
            <Image
              src={src}
              alt={`${title} screenshot ${i + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-bg/95 backdrop-blur-md p-6"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-h-[90vh] w-full max-w-6xl"
            >
              <Image
                src={images[open]}
                alt={`${title} screenshot ${open + 1}`}
                width={1920}
                height={1080}
                className="h-auto max-h-[90vh] w-full object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/case-study/case-study-gallery.tsx
git commit -m "feat(case-study): add gallery with keyboard-navigable lightbox"
```

---

### Task 6.6: CaseStudyMeta component (stack + links)

**Files:**
- Create: `components/case-study/case-study-meta.tsx`

- [ ] **Step 1: Implement component**

```tsx
import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";
import type { WorkEntry } from "@/lib/work";

interface CaseStudyMetaProps {
  work: WorkEntry;
}

export function CaseStudyMeta({ work }: CaseStudyMetaProps) {
  return (
    <FadeUpOnScroll>
      <section className="mt-24 px-6 md:px-16 lg:px-24">
        <div className="grid grid-cols-1 gap-12 border-t border-fg-muted/10 pt-12 md:grid-cols-2">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
              Stack
            </p>
            <div className="flex flex-wrap gap-2">
              {work.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-fg-muted/20 px-3 py-1 font-mono text-xs text-fg-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {(work.liveUrl || work.repoUrl) && (
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
                Links
              </p>
              <div className="flex flex-col gap-2">
                {work.liveUrl && (
                  <a
                    href={work.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm text-fg underline decoration-fg-muted/40 underline-offset-4 hover:decoration-fg"
                  >
                    Live site ↗
                  </a>
                )}
                {work.repoUrl && (
                  <a
                    href={work.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-sm text-fg underline decoration-fg-muted/40 underline-offset-4 hover:decoration-fg"
                  >
                    GitHub ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </FadeUpOnScroll>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/case-study/case-study-meta.tsx
git commit -m "feat(case-study): add stack/links meta section"
```

---

### Task 6.7: CaseStudyNext component

**Files:**
- Create: `components/case-study/case-study-next.tsx`

- [ ] **Step 1: Implement component**

```tsx
import Link from "next/link";
import Image from "next/image";
import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";
import type { WorkEntry } from "@/lib/work";

interface CaseStudyNextProps {
  next: WorkEntry;
}

export function CaseStudyNext({ next }: CaseStudyNextProps) {
  return (
    <FadeUpOnScroll>
      <section className="mt-32 border-t border-fg-muted/10">
        <Link
          href={`/work/${next.slug}`}
          className="group block px-6 py-16 md:px-16 lg:px-24"
        >
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
            Up next
          </p>
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-3xl font-semibold transition-colors group-hover:text-gradient-accent md:text-5xl">
                {next.title}
              </h3>
              <p className="mt-4 text-fg-muted">{next.summary}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-fg">
                Read
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </div>
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-fg-muted/10 bg-bg-muted">
              <Image src={next.heroImage} alt={next.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
          </div>
        </Link>
      </section>
    </FadeUpOnScroll>
  );
}
```

- [ ] **Step 2: Verify the full case-study page renders**

Run dev server. Visit <http://localhost:3000/work/keycloak-theme>. Expected:
- ScrollProgress bar at top
- "All work" back link
- Year + role caption, big title, summary
- Parallax hero image
- MDX body (Problem / Approach / Result) with styled typography
- Gallery grid (3 images for keycloak-theme), click opens lightbox; Esc/arrow keys work
- Stack tags
- "Up next" linking to next case study

Click "Up next" and verify navigation works. Visit `/work/does-not-exist` and verify 404 page.

Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add components/case-study/case-study-next.tsx
git commit -m "feat(case-study): add 'Up next' link to keep visitors on site"
```

---

## Phase 7: About / Contact / Footer

### Task 7.1: About section

**Files:**
- Create: `components/about/about.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Implement About**

```tsx
import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";

const skills = [
  "TypeScript",
  "React / Next.js",
  ".NET / C#",
  "Node.js",
  "Tailwind CSS",
  "Framer Motion",
  "Terraform",
  "AWS",
  "Keycloak",
  "RabbitMQ",
  "Postgres",
];

export function About() {
  return (
    <section id="about" className="relative px-6 py-section md:px-16 lg:px-24">
      <FadeUpOnScroll>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          About
        </p>
      </FadeUpOnScroll>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
        <FadeUpOnScroll delay={0.05}>
          <div>
            <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
              I build the unglamorous middle layer — and the polished surface on top of it.
            </h2>
            <div className="mt-8 space-y-6 text-lg text-fg-muted">
              <p>
                I'm a software engineer based in Seattle. Day-to-day I work on
                identity systems, platform infrastructure, and product UI for a
                healthcare startup — the kind of work that's invisible when it's
                done right.
              </p>
              <p>
                I care most about software that gets out of the way: fast,
                quiet, and honest about what it does. I've shipped things from
                marketing sites to multi-service migrations, and I take both
                kinds of work seriously.
              </p>
              <p>
                Outside of work, I build small projects, ride bikes around West
                Seattle, and read more than I write.
              </p>
            </div>
          </div>
        </FadeUpOnScroll>

        <FadeUpOnScroll delay={0.15}>
          <div className="md:pt-2">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
              Stack
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-fg-muted/20 px-3 py-1 font-mono text-xs text-fg-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </FadeUpOnScroll>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire into page**

In `app/page.tsx`, replace the `<section id="about">` placeholder with:
```tsx
import { About } from "@/components/about/about";
// ...
<About />
```

- [ ] **Step 3: Verify visually**

Run dev server. Scroll to About section. Expected: two-column layout (single column on mobile), bio paragraphs, stack pills. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add components/about/about.tsx app/page.tsx
git commit -m "feat(about): add two-column About section with bio + stack"
```

---

### Task 7.2: Contact section

**Files:**
- Create: `components/contact/contact.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Implement Contact**

```tsx
import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";
import { MagneticButton } from "@/components/motion/magnetic-button";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative px-6 py-section md:px-16 lg:px-24"
    >
      <FadeUpOnScroll>
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          Contact
        </p>
      </FadeUpOnScroll>

      <FadeUpOnScroll delay={0.05}>
        <h2 className="text-4xl font-semibold md:text-6xl">Let's talk.</h2>
      </FadeUpOnScroll>

      <FadeUpOnScroll delay={0.1}>
        <p className="mt-6 max-w-xl text-lg text-fg-muted">
          For freelance work, collaborations, or anything you want to make
          together — drop me a line.
        </p>
      </FadeUpOnScroll>

      <FadeUpOnScroll delay={0.15}>
        <a
          href="mailto:pierce55@icloud.com"
          className="mt-12 inline-block text-3xl font-semibold text-gradient-accent md:text-5xl"
        >
          pierce55@icloud.com
        </a>
      </FadeUpOnScroll>

      <FadeUpOnScroll delay={0.2}>
        <div className="mt-16 flex flex-wrap items-center gap-4">
          <MagneticButton
            href="https://github.com/Sheldon-Pierce"
            className="rounded-full border border-fg-muted/30 px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors hover:border-fg"
          >
            GitHub
          </MagneticButton>
          <MagneticButton
            href="https://www.linkedin.com/in/sheldon-pierce/"
            className="rounded-full border border-fg-muted/30 px-5 py-2 font-mono text-xs uppercase tracking-widest transition-colors hover:border-fg"
          >
            LinkedIn
          </MagneticButton>
        </div>
      </FadeUpOnScroll>
    </section>
  );
}
```

**Note:** LinkedIn URL is a best-guess slug. User to confirm; replace `sheldon-pierce` with actual slug before launch.

- [ ] **Step 2: Wire into page**

In `app/page.tsx`, replace the `<section id="contact">` placeholder with:
```tsx
import { Contact } from "@/components/contact/contact";
// ...
<Contact />
```

- [ ] **Step 3: Verify visually**

Run dev server. Expected: "Let's talk" heading, large gradient email link, GitHub/LinkedIn magnetic buttons. Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add components/contact/contact.tsx app/page.tsx
git commit -m "feat(contact): add Contact section with email link + GitHub/LinkedIn buttons"
```

---

### Task 7.3: Footer

**Files:**
- Create: `components/footer/footer.tsx`
- Modify: `app/page.tsx`, `app/work/[slug]/page.tsx`

- [ ] **Step 1: Implement Footer**

```tsx
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-fg-muted/10 px-6 py-12 md:px-16 lg:px-24">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          © {year} Sheldon Pierce
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          Seattle, WA
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Replace footer in app/page.tsx**

```tsx
import { Footer } from "@/components/footer/footer";
// ...
// Replace the existing <footer>...</footer> with:
<Footer />
```

- [ ] **Step 3: Add Footer to case-study pages**

Edit `app/work/[slug]/page.tsx`. Import and add `<Footer />` at the end of `<main>`:
```tsx
import { Footer } from "@/components/footer/footer";
// ... at the end of <main>:
<Footer />
```

- [ ] **Step 4: Verify**

Run dev server. Footer appears on both `/` and `/work/keycloak-theme`. Stop dev server.

- [ ] **Step 5: Commit**

```bash
git add components/footer/ app/page.tsx app/work/[slug]/page.tsx
git commit -m "feat(footer): add shared footer used on landing + case-study pages"
```

---

## Phase 8: Polish & deploy

### Task 8.0: Page transition wipe

**Files:**
- Create: `components/motion/page-transition.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Implement PageTransition**

The wipe is implemented as a fixed overlay that scales from left-to-right on route change, then exits. Keyed on `pathname` so the animation runs every navigation.

```tsx
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
```

The animation: at t=0 the overlay is collapsed at the left (`scaleX: 0`, anchored left). It expands rightward to cover the screen (`scaleX: 1`), holds briefly, then collapses to the right edge (`originX: 1`, `scaleX: 0`). The whole thing is 700ms and runs only on navigations (key change).

- [ ] **Step 2: Wire into layout**

Edit `app/layout.tsx`. Add inside `<body>`:
```tsx
import { PageTransition } from "@/components/motion/page-transition";
// ...
<PageTransition />
```

- [ ] **Step 3: Verify visually**

Run dev server. From `/`, click a work card. Expected: violet→cyan band sweeps across the screen left-to-right as the page changes, then exits. Click "All work" back link — same wipe in reverse.

Test reduced-motion: open devtools → Rendering → Emulate CSS prefers-reduced-motion: reduce. Click between pages. Expected: no wipe overlay.

Stop dev server.

- [ ] **Step 4: Commit**

```bash
git add components/motion/page-transition.tsx app/layout.tsx
git commit -m "feat(motion): add page-transition wipe between routes"
```

---

### Task 8.1: SEO metadata + OG image

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/opengraph-image.tsx`, `app/icon.tsx`

- [ ] **Step 1: Expand layout metadata**

In `app/layout.tsx`, replace `metadata` with:
```tsx
export const metadata: Metadata = {
  title: {
    default: "Sheldon Pierce — Software Engineer",
    template: "%s — Sheldon Pierce",
  },
  description:
    "Software engineer building identity systems, platforms, and product UI. Available for select freelance work. Seattle, WA.",
  metadataBase: new URL("https://sheldonpierce.com"),
  openGraph: {
    title: "Sheldon Pierce — Software Engineer",
    description:
      "Software engineer building identity systems, platforms, and product UI.",
    url: "https://sheldonpierce.com",
    siteName: "Sheldon Pierce",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sheldon Pierce — Software Engineer",
    description:
      "Software engineer building identity systems, platforms, and product UI.",
  },
  robots: { index: true, follow: true },
};
```

- [ ] **Step 2: Generate OG image (dynamic, gradient + name)**

Create `app/opengraph-image.tsx`:
```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sheldon Pierce — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
          color: "#0a0a0b",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          fontFamily: "monospace",
        }}
      >
        <div style={{ fontSize: 24, opacity: 0.7 }}>sheldonpierce.com</div>
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05 }}>
          Sheldon Pierce
        </div>
        <div style={{ fontSize: 28, opacity: 0.8 }}>
          Software engineer · Seattle
        </div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 3: Generate favicon (simple "sp." with gradient)**

Create `app/icon.tsx`:
```tsx
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
          color: "#0a0a0b",
          fontSize: 18,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
          borderRadius: 6,
        }}
      >
        sp
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 4: Verify**

Run `npm run build`. Expected: build succeeds, generates `/opengraph-image` and `/icon` routes. Run `npm run start`, visit <http://localhost:3000/opengraph-image> — should render the 1200×630 OG card.

- [ ] **Step 5: Commit**

```bash
git add app/layout.tsx app/opengraph-image.tsx app/icon.tsx
git commit -m "feat(seo): add metadata, dynamic OG image, and favicon"
```

---

### Task 8.2: Sitemap and robots.txt

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`

- [ ] **Step 1: Create app/sitemap.ts**

```ts
import type { MetadataRoute } from "next";
import { getAllWork } from "@/lib/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://sheldonpierce.com";
  const now = new Date();
  const workEntries = getAllWork().map((w) => ({
    url: `${base}/work/${w.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...workEntries,
  ];
}
```

- [ ] **Step 2: Create app/robots.ts**

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://sheldonpierce.com/sitemap.xml",
  };
}
```

- [ ] **Step 3: Verify**

Run `npm run build && npm run start`. Visit <http://localhost:3000/sitemap.xml> and <http://localhost:3000/robots.txt>. Expected: both return valid responses.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat(seo): add sitemap + robots.txt"
```

---

### Task 8.3: Playwright smoke test

**Files:**
- Create: `playwright.config.ts`, `e2e/smoke.spec.ts`
- Modify: `package.json` (add e2e script)

- [ ] **Step 1: Init Playwright config**

Create `playwright.config.ts`:
```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 2: Add e2e script to package.json**

Under `"scripts"`:
```json
"e2e": "playwright test",
"e2e:install": "playwright install chromium"
```

Run once:
```bash
npm run e2e:install
```

- [ ] **Step 3: Write smoke test**

Create `e2e/smoke.spec.ts`:
```ts
import { test, expect } from "@playwright/test";

const caseStudies = [
  "keycloak-theme",
  "handyman-services",
  "west-seattle-blog",
  "adoreal-platform",
  "capital-finder",
  "urban-trail",
];

test("landing page renders all sections", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /sheldon pierce/i })).toBeVisible();
  await expect(page.locator("#featured")).toBeVisible();
  await expect(page.locator("#work")).toBeVisible();
  await expect(page.locator("#about")).toBeVisible();
  await expect(page.locator("#contact")).toBeVisible();
});

test("contact email link is correct", async ({ page }) => {
  await page.goto("/");
  const email = page.getByRole("link", { name: /pierce55@icloud.com/i });
  await expect(email).toHaveAttribute("href", "mailto:pierce55@icloud.com");
});

for (const slug of caseStudies) {
  test(`case study /work/${slug} renders`, async ({ page }) => {
    const res = await page.goto(`/work/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("main")).toBeVisible();
  });
}

test("404 on unknown case study", async ({ page }) => {
  const res = await page.goto("/work/does-not-exist");
  expect(res?.status()).toBe(404);
});
```

- [ ] **Step 4: Add e2e/ to .gitignore for test artifacts**

Append to `.gitignore`:
```
playwright-report/
test-results/
```

- [ ] **Step 5: Run smoke tests**

```bash
npm run e2e
```

Expected: 9 tests passing. If any fail, fix the underlying issue before continuing.

- [ ] **Step 6: Commit**

```bash
git add playwright.config.ts e2e/ package.json package-lock.json .gitignore
git commit -m "test(e2e): add Playwright smoke tests covering all pages"
```

---

### Task 8.4: Lighthouse pass

**Files:** (no file changes; this is verification + targeted fixes)

- [ ] **Step 1: Run production build locally**

```bash
npm run build && npm run start
```

- [ ] **Step 2: Run Lighthouse against the production build**

Open Chrome DevTools → Lighthouse → check Performance, Accessibility, Best Practices, SEO. Run in "Mobile" mode against <http://localhost:3000>.

Expected target: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 100.

- [ ] **Step 3: Address any sub-95 score**

Common fixes if Performance drops:
- Largest Contentful Paint: ensure hero image has `priority`
- Cumulative Layout Shift: verify all `<Image>` have explicit dimensions or `fill`
- Total Blocking Time: motion-heavy initial paint — consider `dynamic()` imports for CursorFollower

Common fixes if Accessibility drops:
- Color contrast on `text-fg-muted` over `bg`: verify contrast ratio ≥ 4.5:1 for body text. If too low, darken background or lighten muted text.
- Missing `alt` on images: every `<Image>` needs a meaningful alt.

Apply fixes, re-run Lighthouse, commit each fix as its own commit:
```bash
git commit -m "perf: <description>"
```

- [ ] **Step 4: Final Lighthouse confirmation**

Re-run Lighthouse. Confirm all 4 categories ≥ 95. Stop dev server.

---

### Task 8.5: Deploy to Vercel (preview URL)

**Files:** (no file changes; this is the deploy step)

- [ ] **Step 1: Install Vercel CLI globally if not present**

```bash
npm install -g vercel
```

- [ ] **Step 2: Log in and link project**

```bash
vercel login
```

(Use the GitHub OAuth option with the same account as the repo.)

Then from the project root:
```bash
vercel link
```

Answer:
- Set up "sheldonpierce-com"? **yes**
- Which scope? **<your personal scope>**
- Link to existing project? **no**
- Project name? **sheldonpierce-com**
- Directory? **`.`**

- [ ] **Step 3: Deploy a preview**

```bash
vercel
```

Wait for build to complete. Note the preview URL (e.g., `https://sheldonpierce-com-xyz.vercel.app`).

- [ ] **Step 4: Verify preview manually**

Open the preview URL. Click through:
- Hero loads, animations play
- Featured case study links to detail page
- All 5 work cards load
- About + Contact + Footer render
- Email link works
- Visit each case study, scroll through, open lightbox
- 404 case study returns 404 page

- [ ] **Step 5: STOP — user approval gate**

Do not promote to production. Share the preview URL with the user and wait for explicit approval. User reviews the live preview, requests any adjustments. Iterate via additional commits + `vercel` redeploys.

---

### Task 8.6: Promote to production and connect sheldonpierce.com

**Files:** Create: `docs/dns-setup.md`

- [ ] **Step 1: Promote the approved preview to production**

```bash
vercel --prod
```

- [ ] **Step 2: Connect the custom domain via Vercel dashboard**

In Vercel dashboard → `sheldonpierce-com` project → Settings → Domains:
1. Add `sheldonpierce.com`
2. Add `www.sheldonpierce.com` (with redirect to apex)
3. Vercel will display the DNS records you need to create at your registrar

- [ ] **Step 3: Write DNS setup doc**

Create `docs/dns-setup.md`:
```markdown
# DNS setup — sheldonpierce.com → Vercel

## Records to create

In your registrar's DNS panel for `sheldonpierce.com`, set:

| Type  | Host | Value (from Vercel) | TTL  |
|-------|------|--------------------|------|
| A     | @    | `76.76.21.21`      | 3600 |
| CNAME | www  | `cname.vercel-dns.com` | 3600 |

(Vercel's actual recommended values are shown in the Vercel dashboard when you add the domain — use those if they differ from above.)

## Backup the existing site first

If something is already live at sheldonpierce.com:
1. Note the current DNS provider and records
2. Take screenshots of any content you want to preserve
3. Save them to `docs/backups/<date>/`

## Cutover

1. Apply the DNS records above at your registrar
2. Wait 5–60 minutes for propagation
3. Vercel will auto-issue a TLS cert via Let's Encrypt — visible in Vercel dashboard under the domain
4. Verify:
   - `https://sheldonpierce.com` loads the new site
   - `https://www.sheldonpierce.com` redirects to apex
   - The TLS cert is valid in your browser

## Troubleshooting

- **Domain shows "Invalid configuration" in Vercel:** wait longer, or check that the A and CNAME records are exactly as Vercel specifies
- **Cert doesn't issue:** trigger a re-check in Vercel; ensure no CAA records block Let's Encrypt
- **Old site still showing:** clear browser cache / try incognito; DNS propagation can take up to 48 hours in worst case
```

- [ ] **Step 4: Apply DNS records at registrar**

This is a user-execution step (Sheldon does this in his registrar's UI). Confirm registrar at this step (likely Namecheap, Google Domains/Squarespace, or Cloudflare).

- [ ] **Step 5: Wait for propagation + verify**

Wait 10–30 minutes. Visit `https://sheldonpierce.com`. Expected: new site loads with valid TLS.

- [ ] **Step 6: Final commit**

```bash
git add docs/dns-setup.md
git commit -m "docs: add DNS setup guide for sheldonpierce.com"
git push
```

---

## Final checklist

- [ ] All Playwright tests pass: `npm run e2e`
- [ ] All Vitest tests pass: `npm test`
- [ ] TypeScript clean: `npm run typecheck`
- [ ] Lighthouse Performance ≥ 95 on mobile
- [ ] Lighthouse Accessibility ≥ 95
- [ ] All 6 case-study pages render
- [ ] Email link works (clickable mailto:)
- [ ] sheldonpierce.com resolves to the new site with valid TLS
- [ ] User has replaced placeholder images with real screenshots (or accepted placeholders for v1)
- [ ] User confirmed LinkedIn URL (or removed the link)

---

## Open items at plan approval

These are not blockers; they're caught later in the flow:

- [ ] User provides real screenshots for each case study (replace `public/work/*/`)
- [ ] User confirms LinkedIn URL or asks to remove
- [ ] About-page photo decision (currently no photo — text only)
- [ ] Current registrar for sheldonpierce.com (asked at Task 8.6)
- [ ] Existing sheldonpierce.com content — backup needed?
