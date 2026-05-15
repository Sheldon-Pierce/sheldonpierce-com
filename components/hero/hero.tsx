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
