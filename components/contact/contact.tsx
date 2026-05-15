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
        <h2 className="text-4xl font-semibold md:text-6xl">Let&apos;s talk.</h2>
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
