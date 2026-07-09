import Image from "next/image";
import WorkTitleText from "@/components/WorkTitleText";
import CaseStudyHeroVideo from "@/components/work/CaseStudyHeroVideo";
import { PLACEHOLDER_THUMBNAIL } from "@/lib/work/projects";
import type { WorkProject } from "@/lib/work/projects";
import type {
  ProjectCaseStudy,
  ProjectCaseStudyBlock,
  ProjectCaseStudyParagraph,
  ProjectCaseStudySection,
  ProjectMedia,
} from "@/lib/work/types";

const displayFont =
  "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif";

const secondaryFont = "var(--font-secondary)";

function isVideoMedia(item: ProjectMedia) {
  if (item.kind === "video") return true;
  if (item.kind === "image" || item.kind === "pdf") return false;
  return /\.(mov|mp4|webm)$/i.test(item.src);
}

function isPdfMedia(item: ProjectMedia) {
  if (item.kind === "pdf") return true;
  if (item.kind === "image" || item.kind === "video") return false;
  return /\.pdf$/i.test(item.src);
}

function hasVisualTreatment(item: ProjectMedia) {
  return item.cropLeft != null || item.rotate != null;
}

function cropWrapperStyle(item: ProjectMedia) {
  if (!item.cropLeft) return undefined;

  return {
    left: -item.cropLeft,
    width: `calc(100% + ${item.cropLeft}px)`,
  } as const;
}

function CaseStudyMedia({ item }: { item: ProjectMedia }) {
  const ratio = item.aspectRatio ?? "4 / 3";
  const isVideo = isVideoMedia(item);
  const isPdf = isPdfMedia(item);
  const styled = hasVisualTreatment(item);
  const cropStyle = cropWrapperStyle(item);
  const mediaClassName = item.bare
    ? "object-contain object-center"
    : "object-contain object-center p-3 sm:p-4";

  const video = item.videoControls ? (
    <video
      controls
      playsInline
      preload="metadata"
      poster={item.poster}
      aria-label={item.alt}
      className="work-case-video--controls block h-full w-full object-contain object-center"
    >
      {(item.videoSources ?? [{ src: item.src, type: "" }]).map((source) => (
        <source
          key={source.src}
          src={source.src}
          type={source.type || undefined}
        />
      ))}
    </video>
  ) : (
    <video
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      aria-label={item.alt}
      className={`${styled ? "absolute top-0 h-full" : "absolute inset-0 h-full w-full"} ${mediaClassName}`}
      style={styled ? cropStyle : undefined}
    >
      {(item.videoSources ?? [{ src: item.src, type: "" }]).map((source) => (
        <source
          key={source.src}
          src={source.src}
          type={source.type || undefined}
        />
      ))}
    </video>
  );

  const image =
    styled && cropStyle ? (
      <div className="absolute top-0 h-full" style={cropStyle}>
        <div className="relative h-full w-full">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            unoptimized
            className={mediaClassName}
            sizes="(max-width: 992px) 100vw, 58vw"
          />
        </div>
      </div>
    ) : (
      <Image
        src={item.src}
        alt={item.alt}
        fill
        unoptimized
        className={mediaClassName}
        sizes="(max-width: 992px) 100vw, 58vw"
      />
    );

  const mediaContent = isPdf ? (
    <iframe
      src={`${item.src}#toolbar=0&navpanes=0`}
      title={item.alt}
      className="absolute inset-0 h-full w-full border-0 bg-transparent"
    />
  ) : isVideo ? (
    video
  ) : (
    image
  );

  const figureStyle = {
    ...(item.maxWidth ? { maxWidth: item.maxWidth, width: "100%" } : {}),
    ...(item.spacingTop ? { marginTop: item.spacingTop } : {}),
    ...(item.align === "center"
      ? { alignSelf: "center" }
      : item.align === "start"
        ? { alignSelf: "flex-start" }
        : item.align === "end"
          ? { alignSelf: "flex-end" }
          : {}),
  };

  return (
    <figure
      className="work-case-figure"
      style={Object.keys(figureStyle).length > 0 ? figureStyle : undefined}
    >
      <div
        className={`work-case-media-frame relative w-full${styled ? " work-case-media-frame--styled" : item.videoControls ? " work-case-media-frame--video-controls" : item.paperShadow ? "" : " overflow-hidden"}${item.paperShadow ? " work-case-media-frame--paper-scan" : ""}${item.bare ? "" : " work-grey-box"}`}
        style={{ aspectRatio: ratio }}
      >
        {styled ? (
          <div
            className="work-case-media-rotate"
            style={
              item.rotate != null
                ? { transform: `rotate(${item.rotate}deg)` }
                : undefined
            }
          >
            <div className="work-case-media-crop">{mediaContent}</div>
          </div>
        ) : (
          mediaContent
        )}
      </div>
      {item.caption ? (
        <figcaption
          className="work-case-caption"
          style={{
            fontFamily: secondaryFont,
            ...(item.captionSpacing ? { marginTop: item.captionSpacing } : {}),
          }}
        >
          {item.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

function CaseStudyParagraph({ paragraph }: { paragraph: ProjectCaseStudyParagraph }) {
  if (typeof paragraph === "string") return paragraph;

  return paragraph.map((part, index) =>
    typeof part === "string" ? (
      <span key={index}>{part}</span>
    ) : (
      <a
        key={index}
        href={part.href}
        target="_blank"
        rel="noopener noreferrer"
        className="work-case-link"
      >
        {part.text}
      </a>
    ),
  );
}

function CaseStudyBlock({
  heading,
  paragraphs,
  media,
  preserveMediaColumn = false,
  subBlock = false,
}: {
  heading?: string;
  paragraphs: ProjectCaseStudyParagraph[];
  media: ProjectMedia[];
  preserveMediaColumn?: boolean;
  subBlock?: boolean;
}) {
  const showMediaColumn = media.length > 0 || preserveMediaColumn;

  return (
    <div
      className={`work-case-split${subBlock ? " work-case-split--sub" : ""}`}
    >
      <div className="work-case-copy">
        {heading ? (
          <h2 className="work-case-heading" style={{ fontFamily: displayFont }}>
            {heading}
          </h2>
        ) : null}
        {paragraphs.length > 0 ? (
          <div className="work-case-body" style={{ fontFamily: secondaryFont }}>
            {paragraphs.map((paragraph) => (
              <p key={JSON.stringify(paragraph).slice(0, 48)}>
                <CaseStudyParagraph paragraph={paragraph} />
              </p>
            ))}
          </div>
        ) : null}
      </div>
      {showMediaColumn ? (
        <div
          className={`work-case-media${media.length === 0 ? " work-case-media--empty" : ""}`}
        >
          {media.map((item) => (
            <CaseStudyMedia key={`${item.alt}-${item.caption}`} item={item} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function CaseStudySection({ section }: { section: ProjectCaseStudySection }) {
  return (
    <section className="work-case-section" aria-labelledby={section.id}>
      {section.blocks.map((block: ProjectCaseStudyBlock, index) => (
        <CaseStudyBlock
          key={`${section.id}-${index}`}
          heading={index === 0 ? section.heading : undefined}
          paragraphs={block.paragraphs}
          media={block.media}
          preserveMediaColumn={block.preserveMediaColumn}
          subBlock={index > 0}
        />
      ))}
    </section>
  );
}

export default function WorkProjectCaseStudy({
  project,
  content,
}: {
  project: WorkProject;
  content: ProjectCaseStudy;
}) {
  const showHero =
    content.hero && content.hero.src !== PLACEHOLDER_THUMBNAIL;

  return (
    <article className="work-case">
      <header className="work-case-header">
        <h1 className="work-case-title" style={{ fontFamily: displayFont }}>
          {project.lines.map((line, index) => (
            <span key={line}>
              {index > 0 ? (
                <span className="work-case-title-gap" aria-hidden="true">
                  {" "}
                </span>
              ) : null}
              <span className="work-case-title-part">
                <WorkTitleText text={line} />
              </span>
            </span>
          ))}
        </h1>
        <p className="work-case-category" style={{ fontFamily: secondaryFont }}>
          {project.category}
        </p>
      </header>

      {showHero ? (
        <div
          className={`work-case-hero relative w-full overflow-hidden${content.hero?.bare ? "" : " work-grey-box"}`}
          style={{ aspectRatio: content.hero?.aspectRatio ?? "21 / 9" }}
        >
          {isVideoMedia(content.hero!) ? (
            <CaseStudyHeroVideo hero={content.hero!} />
          ) : (
            <Image
              src={content.hero!.src}
              alt={content.hero!.alt}
              fill
              unoptimized
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          )}
        </div>
      ) : null}

      <section className="work-case-section work-case-section--intro">
        <CaseStudyBlock
          heading={content.intro.heading}
          paragraphs={content.intro.paragraphs}
          media={content.intro.media}
        />
      </section>

      {content.sections.map((section) => (
        <CaseStudySection key={section.id} section={section} />
      ))}
    </article>
  );
}
