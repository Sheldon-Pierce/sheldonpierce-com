import Link from "next/link";
import type { WorkEntry } from "@/lib/work";

interface WorkCardProps {
  work: WorkEntry;
}

export function WorkCard({ work }: WorkCardProps) {
  return (
    <Link className="work-card" href={`/work/${work.slug}`}>
      <div className="work-meta">
        <span>{work.stack.slice(0, 2).join(" · ")}</span>
        <span className="yr">{work.year}</span>
      </div>
      <h4>{work.title}</h4>
      <p>{work.summary}</p>
      <span className="case-link">
        Case study <span className="arr">→</span>
      </span>
    </Link>
  );
}
