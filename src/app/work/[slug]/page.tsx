import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import WorkCaseNextProject from "@/components/work/WorkCaseNextProject";
import WorkProjectCaseStudy from "@/components/work/WorkProjectCaseStudy";
import WorkTitleText from "@/components/WorkTitleText";
import { getProjectCaseStudy } from "@/lib/work/content";
import {
  getNextWorkProject,
  getWorkProject,
  WORK_PROJECTS,
} from "@/lib/work/projects";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return WORK_PROJECTS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getWorkProject(slug);
  if (!project) return { title: "Project — Mohsen Alattar" };
  return {
    title: `${project.lines.join(" ")} — Mohsen Alattar`,
  };
}

export default async function WorkProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getWorkProject(slug);
  if (!project) notFound();

  const caseStudy = getProjectCaseStudy(slug);
  const nextProject = getNextWorkProject(slug);

  if (caseStudy) {
    return (
      <div className="work-project-page flex w-full flex-1 flex-col">
        <section className="work-case-wrap flex-1">
          <WorkProjectCaseStudy project={project} content={caseStudy} />
          {nextProject ? <WorkCaseNextProject project={nextProject} /> : null}
        </section>
        <Footer />
      </div>
    );
  }

  const title = project.lines.join(" ");

  return (
    <div className="flex w-full flex-1 flex-col">
      <section className="flex-1 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 pt-10 sm:pt-16 md:pt-20 lg:pt-24 pb-10 md:pb-16">
        <Link
          href="/work"
          className="inline-block mb-10 text-[11px] sm:text-[12px] tracking-[0.12em] uppercase text-[var(--fg-muted)] hover:text-[var(--fg-subtle)] transition-colors"
          style={{ fontFamily: "var(--font-secondary)" }}
        >
          ← Back to work
        </Link>

        <div className="max-w-3xl">
          <h1
            className="uppercase text-[var(--red)] text-[40px] sm:text-[52px] md:text-[72px] lg:text-[88px] leading-[0.88] mb-4"
            style={{
              fontFamily:
                "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
              letterSpacing: "-0.03em",
            }}
          >
            {project.lines.map((line) => (
              <span key={line} className="block">
                <WorkTitleText text={line} />
              </span>
            ))}
          </h1>

          <p
            className="mb-10 text-[12px] sm:text-[13px] tracking-[0.08em] uppercase text-[var(--fg-muted)]"
            style={{ fontFamily: "var(--font-secondary)" }}
          >
            {project.category}
          </p>

          <div className="relative aspect-[4/3] w-full max-w-xl border border-[color-mix(in_srgb,var(--red)_30%,transparent)] bg-[var(--surface)]">
            <Image
              src={project.thumbnail}
              alt={title}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 576px"
            />
          </div>

          <p
            className="mt-10 text-[var(--fg-subtle)] text-base leading-relaxed"
            style={{ fontFamily: "var(--font-secondary)" }}
          >
            Project page coming soon.
          </p>
        </div>

        {nextProject ? <WorkCaseNextProject project={nextProject} /> : null}
      </section>
      <Footer />
    </div>
  );
}
