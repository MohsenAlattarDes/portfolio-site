import Link from "next/link";
import WorkTitleText from "@/components/WorkTitleText";
import type { WorkProject } from "@/lib/work/projects";

const displayFont =
  "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";
const secondaryFont = "var(--font-secondary)";

export default function WorkCaseNextProject({
  project,
}: {
  project: WorkProject;
}) {
  return (
    <nav className="work-case-next" aria-label="Next project">
      <Link href={`/work/${project.slug}`} className="work-case-next__link">
        <span
          className="work-case-next__label"
          style={{ fontFamily: secondaryFont }}
        >
          Next project
        </span>
        <span className="work-case-next__row">
          <span className="work-case-next__title" style={{ fontFamily: displayFont }}>
            {project.lines.map((line, index) => (
              <span key={line}>
                {index > 0 ? (
                  <span className="work-case-next__title-gap" aria-hidden="true">
                    {" "}
                  </span>
                ) : null}
                <span className="work-case-next__title-part">
                  <WorkTitleText text={line} />
                </span>
              </span>
            ))}
          </span>
          <span className="work-case-next__arrow" aria-hidden="true">
            →
          </span>
        </span>
        <span
          className="work-case-next__category"
          style={{ fontFamily: secondaryFont }}
        >
          {project.category}
        </span>
      </Link>
    </nav>
  );
}
