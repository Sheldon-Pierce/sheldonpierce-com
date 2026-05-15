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
                I&apos;m a software engineer based in Seattle. Day-to-day I work on
                identity systems, platform infrastructure, and product UI for a
                healthcare startup — the kind of work that&apos;s invisible when it&apos;s
                done right.
              </p>
              <p>
                I care most about software that gets out of the way: fast,
                quiet, and honest about what it does. I&apos;ve shipped things from
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
