import { FadeUpOnScroll } from "@/components/motion/fade-up-on-scroll";

const fieldNotes = [
  "Ex-geologist, current engineer",
  "Event-driven systems w/ RabbitMQ",
  "Coaching devs @ UPLIFT Foundation",
  "Bikes around West Seattle",
  "Flies drones — fun & science",
  "Reads more than he writes",
];

const stack: { k: string; v: string[] }[] = [
  { k: "Languages", v: ["TypeScript", "C#", "Python", "SQL"] },
  {
    k: "Frameworks",
    v: ["React / Next.js", ".NET", "Node.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    k: "Infrastructure",
    v: ["AWS", "Terraform", "Keycloak", "RabbitMQ", "Postgres"],
  },
];

export function About() {
  return (
    <section className="about" id="about">
      <div className="wrap">
        <FadeUpOnScroll>
          <div className="stratum-label">
            <span className="depth">— 110 m</span> About
          </div>
        </FadeUpOnScroll>

        <div className="about-grid">
          <div>
            <FadeUpOnScroll>
              <h2>
                I build the unglamorous middle layer —{" "}
                <em>and the polished surface on top of it.</em>
              </h2>
            </FadeUpOnScroll>
            <FadeUpOnScroll>
              <p>
                I&apos;m a software engineer based in Seattle. Day-to-day I work
                on <strong>identity systems, platform infrastructure, and
                product UI</strong> for a healthcare startup — the kind of work
                that&apos;s invisible when it&apos;s done right.
              </p>
            </FadeUpOnScroll>
            <FadeUpOnScroll>
              <p>
                I started my career studying rocks and groundwater. Somewhere
                between seismic surveys and sensor datasets, I found myself
                writing scripts to make the work easier — and never stopped. The
                instinct is the same: understand what&apos;s under the surface,
                then build something reliable on top of it.
              </p>
            </FadeUpOnScroll>
            <FadeUpOnScroll>
              <p>
                I care most about software that gets out of the way:{" "}
                <strong>fast, quiet, and honest about what it does.</strong>{" "}
                I&apos;ve shipped everything from marketing sites to
                multi-service migrations, and I take both kinds of work
                seriously.
              </p>
            </FadeUpOnScroll>
          </div>

          <FadeUpOnScroll className="field-notes">
            <span className="fn-title">{"// Field notes"}</span>
            {fieldNotes.map((note) => (
              <div className="fn-item" key={note}>
                {note}
              </div>
            ))}
          </FadeUpOnScroll>
        </div>

        <div className="stack">
          <FadeUpOnScroll>
            <div className="stratum-label">
              <span className="depth">— 150 m</span> Stack
            </div>
          </FadeUpOnScroll>
          <FadeUpOnScroll className="stack-rows">
            {stack.map((row) => (
              <div className="stack-row" key={row.k}>
                <span className="k">{row.k}</span>
                <span className="v">
                  {row.v.map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </FadeUpOnScroll>
        </div>
      </div>
    </section>
  );
}
