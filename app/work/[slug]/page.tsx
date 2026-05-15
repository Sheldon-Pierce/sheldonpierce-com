import { notFound } from "next/navigation";
import { getAllWork, getWorkBySlug } from "@/lib/work";
import { CaseStudyHero } from "@/components/case-study/case-study-hero";
import { CaseStudyBody } from "@/components/case-study/case-study-body";
import { CaseStudyGallery } from "@/components/case-study/case-study-gallery";
import { CaseStudyMeta } from "@/components/case-study/case-study-meta";
import { CaseStudyNext } from "@/components/case-study/case-study-next";
import { Footer } from "@/components/footer/footer";
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
      <Footer />
    </main>
  );
}
