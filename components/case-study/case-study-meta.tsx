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
