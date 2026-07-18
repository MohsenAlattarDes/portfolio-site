import Image from "next/image";
import WorkTitleText from "@/components/WorkTitleText";
import CaseStudyCodeFigure from "@/components/work/CaseStudyCodeFigure";
import CaseStudyCodeWindow from "@/components/work/CaseStudyCodeWindow";
import CaseStudyGlyphCycle from "@/components/work/CaseStudyGlyphCycle";
import CaseStudyPublicationFlipbook from "@/components/work/CaseStudyPublicationFlipbook";
import CaseStudyResponsiveHero from "@/components/work/CaseStudyResponsiveHero";
import CaseStudyHeroVideo from "@/components/work/CaseStudyHeroVideo";
import CaseStudyLoopVideo from "@/components/work/CaseStudyLoopVideo";
import CaseStudyMediaLightbox from "@/components/work/CaseStudyMediaLightbox";
import CaseStudyThemeImage from "@/components/work/CaseStudyThemeImage";
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

function isCodeMedia(item: ProjectMedia) {
  return item.kind === "code" && item.codeSketch != null;
}

function isVideoMedia(item: ProjectMedia) {
  if (item.kind === "code") return false;
  if (item.kind === "video") return true;
  if (item.kind === "image" || item.kind === "pdf") return false;
  return /\.(mov|mp4|webm)$/i.test(item.src);
}

function isPdfMedia(item: ProjectMedia) {
  if (item.kind === "pdf") return true;
  if (item.kind === "image" || item.kind === "video" || item.kind === "code")
    return false;
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

function isGlyphCycleMedia(item: ProjectMedia) {
  return item.kind === "glyph-cycle";
}

function isFlipbookMedia(item: ProjectMedia) {
  return (
    item.kind === "publication-flipbook" &&
    Boolean(item.publicationSpreads?.length)
  );
}

const ROW_MEDIA_ASPECT = "768 / 1024";
const CASE_STUDY_HERO_ASPECT = "3612 / 1850";

function CaseStudyHeroSlot({ item }: { item: ProjectMedia }) {
  const isVideo = isVideoMedia(item);

  return (
    <figure
      className="work-case-figure work-case-figure--hero-slot"
      style={item.spacingTop ? { marginTop: item.spacingTop } : undefined}
    >
      <div
        className={`work-case-hero-slot relative w-full overflow-hidden${item.bare ? "" : " work-grey-box"}${item.transparent ? " work-case-hero--transparent" : ""}`}
        style={{
          aspectRatio: item.aspectRatio ?? CASE_STUDY_HERO_ASPECT,
          ...(item.poster
            ? {
                backgroundImage: `url(${item.poster})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : {}),
        }}
      >
        {item.transparent && !isVideo ? (
          <CaseStudyThemeImage
            src={item.src}
            mobileSrc={item.mobileSrc}
            themeSrc={item.themeSrc}
            alt={item.alt}
            className="work-case-hero-media work-case-hero-media--transparent absolute inset-0 h-full w-full object-contain object-center"
            transparent
          />
        ) : isVideo ? (
          item.videoControls ? (
            <video
              controls
              playsInline
              preload="metadata"
              poster={item.poster}
              aria-label={item.alt}
              className="work-case-hero-media absolute inset-0 z-[1] h-full w-full object-cover object-center"
            >
              {(item.videoSources ?? [{ src: item.src, type: "" }]).map(
                (source) => (
                  <source
                    key={source.src}
                    src={source.src}
                    type={source.type || undefined}
                  />
                ),
              )}
            </video>
          ) : (
            <CaseStudyHeroVideo hero={item} />
          )
        ) : (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            unoptimized
            className="object-contain object-center"
            sizes="100vw"
          />
        )}
      </div>
      {item.caption ? (
        <figcaption
          className="work-case-caption work-case-caption--hero-slot"
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

function CaseStudyMedia({
  item,
  inRow = false,
}: {
  item: ProjectMedia;
  inRow?: boolean;
}) {
  if (isGlyphCycleMedia(item)) {
    return <CaseStudyGlyphCycle item={item} />;
  }

  if (isFlipbookMedia(item)) {
    return (
      <CaseStudyPublicationFlipbook
        spreads={item.publicationSpreads!}
        caption={item.caption}
      />
    );
  }

  if (isCodeMedia(item)) {
    return <CaseStudyCodeFigure item={item} />;
  }

  const rowNatural = inRow && item.rowFit === "natural";
  const rowContain = inRow && item.rowFit === "contain";
  const rowWide = inRow && item.rowFit === "wide";
  const rowCover = inRow && !rowNatural && !rowContain && !rowWide;
  const useIntrinsicSize = Boolean(item.intrinsicSize) && (!inRow || rowNatural);
  const ratio = rowWide
    ? (item.aspectRatio ?? "4 / 3")
    : inRow && !rowNatural
      ? (item.rowAspectRatio ?? ROW_MEDIA_ASPECT)
      : (item.aspectRatio ?? "4 / 3");
  const isVideo = isVideoMedia(item);
  const isPdf = isPdfMedia(item);
  const styled = hasVisualTreatment(item);
  const cropStyle = cropWrapperStyle(item);
  const mediaClassName = useIntrinsicSize
    ? "block h-auto w-full"
    : rowCover
      ? "object-cover object-center"
      : rowWide || rowContain
        ? "object-contain object-center"
        : item.bare
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
    <CaseStudyLoopVideo item={item} className={`${styled ? "absolute top-0 h-full" : "absolute inset-0 h-full w-full"} ${mediaClassName}`} style={styled ? cropStyle : undefined} />
  );

  const image =
    styled && cropStyle ? (
      <div className="absolute top-0 h-full" style={cropStyle}>
        <div className="relative h-full w-full">
          <CaseStudyThemeImage
            src={item.src}
            mobileSrc={item.mobileSrc}
            themeSrc={item.themeSrc}
            alt={item.alt}
            className={mediaClassName}
            intrinsicSize={useIntrinsicSize ? item.intrinsicSize : undefined}
            transparent={item.transparent}
            style={
              item.objectPosition
                ? { objectPosition: item.objectPosition }
                : undefined
            }
          />
        </div>
      </div>
    ) : (
      <CaseStudyThemeImage
        src={item.src}
        mobileSrc={item.mobileSrc}
        themeSrc={item.themeSrc}
        alt={item.alt}
        className={mediaClassName}
        intrinsicSize={useIntrinsicSize ? item.intrinsicSize : undefined}
        transparent={item.transparent}
        style={
          item.objectPosition
            ? { objectPosition: item.objectPosition }
            : undefined
        }
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

  const mediaFrame = (
    <div
      className={`work-case-media-frame relative w-full${item.transparent ? " work-case-media-frame--transparent" : ""}${rowCover ? " work-case-media-frame--row overflow-hidden" : rowWide ? " work-case-media-frame--row-wide overflow-hidden" : rowContain ? " work-case-media-frame--row-contain overflow-hidden" : styled ? " work-case-media-frame--styled" : item.videoControls ? " work-case-media-frame--video-controls" : item.paperShadow ? "" : useIntrinsicSize ? "" : " overflow-hidden"}${item.paperShadow ? " work-case-media-frame--paper-scan" : ""}${item.bare ? "" : " work-grey-box"}`}
      style={useIntrinsicSize ? undefined : { aspectRatio: ratio }}
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
  );

  return (
    <figure
      className={`work-case-figure${rowNatural ? " work-case-figure--row-natural" : ""}${rowContain ? " work-case-figure--row-contain" : ""}${rowWide ? " work-case-figure--row-wide" : ""}`}
      style={Object.keys(figureStyle).length > 0 ? figureStyle : undefined}
    >
      {item.enlarge && !isVideo && !isPdf ? (
        <CaseStudyMediaLightbox
          src={item.src}
          themeSrc={item.themeSrc}
          alt={item.alt}
          intrinsicSize={item.intrinsicSize}
        >
          {mediaFrame}
        </CaseStudyMediaLightbox>
      ) : (
        mediaFrame
      )}
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
  copyMedia = [],
  afterCodeMedia = [],
  mobileMediaBeforeCopyMedia = false,
  mobileMediaBeforeCodeWindow = false,
  preserveMediaColumn = false,
  mediaLayout = "stack",
  rowCaption,
  subBlock = false,
  codeWindow,
}: {
  heading?: string;
  paragraphs: ProjectCaseStudyParagraph[];
  media: ProjectMedia[];
  copyMedia?: ProjectMedia[];
  afterCodeMedia?: ProjectMedia[];
  mobileMediaBeforeCopyMedia?: boolean;
  mobileMediaBeforeCodeWindow?: boolean;
  preserveMediaColumn?: boolean;
  mediaLayout?: "stack" | "row" | "hero" | "full";
  rowCaption?: string;
  subBlock?: boolean;
  codeWindow?: {
    title?: string;
    source: string;
  };
}) {
  const showMediaColumn =
    media.length > 0 || afterCodeMedia.length > 0 || preserveMediaColumn;
  const mediaOnlyRow =
    mediaLayout === "row" && paragraphs.length === 0 && media.length > 0;
  const mediaHeroLayout =
    mediaLayout === "hero" && paragraphs.length === 0 && media.length > 0;
  const mediaFullLayout =
    mediaLayout === "full" && paragraphs.length === 0 && media.length > 0;
  const detachCodeWindow = Boolean(codeWindow && mobileMediaBeforeCodeWindow);
  const detachCopyMedia = Boolean(
    copyMedia.length > 0 &&
      (mobileMediaBeforeCopyMedia || mobileMediaBeforeCodeWindow),
  );
  const splitAfterCodeMedia = Boolean(
    detachCodeWindow && afterCodeMedia.length > 0,
  );

  if (mediaHeroLayout) {
    return (
      <>
        {media.map((item) => (
          <CaseStudyHeroSlot key={`${item.alt}-${item.caption}`} item={item} />
        ))}
      </>
    );
  }

  if (mediaFullLayout) {
    return (
      <div
        className={`work-case-split work-case-split--full${subBlock ? " work-case-split--sub" : ""}`}
      >
        <div className="work-case-media work-case-media--full">
          {media.map((item) => (
            <CaseStudyMedia key={`${item.alt}-${item.caption}`} item={item} />
          ))}
        </div>
      </div>
    );
  }

  if (mediaOnlyRow) {
    return (
      <div className="work-case-media-row-wrap">
        <div
          className={`work-case-media-row${media.length === 2 ? " work-case-media-row--pair" : ""}${media.length === 3 ? " work-case-media-row--triptych" : ""}`}
        >
          {media.map((item) => (
            <CaseStudyMedia
              key={`${item.alt}-${item.caption}`}
              item={item}
              inRow
            />
          ))}
        </div>
        {rowCaption ? (
          <p
            className="work-case-caption work-case-row-caption"
            style={{ fontFamily: secondaryFont }}
          >
            {rowCaption}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`work-case-split${subBlock ? " work-case-split--sub" : ""}${mobileMediaBeforeCopyMedia ? " work-case-split--mobile-media-first" : ""}${detachCodeWindow ? " work-case-split--mobile-media-before-code" : ""}${splitAfterCodeMedia ? " work-case-split--mobile-after-code-media" : ""}`}
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
        {codeWindow && !detachCodeWindow ? (
          <CaseStudyCodeWindow
            title={codeWindow.title}
            source={codeWindow.source}
          />
        ) : null}
        {!detachCopyMedia && copyMedia.length > 0 ? (
          <div className="work-case-copy-media-wrap">
            <div className="work-case-media-row work-case-media-row--pair work-case-copy-media-row">
              {copyMedia.map((item) => (
                <CaseStudyMedia
                  key={`${item.alt}-${item.caption}`}
                  item={item}
                  inRow
                />
              ))}
            </div>
            {rowCaption ? (
              <p
                className="work-case-caption work-case-copy-media-caption"
                style={{ fontFamily: secondaryFont }}
              >
                {rowCaption}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
      {showMediaColumn ? (
        <div
          className={`work-case-media${media.length === 0 && !splitAfterCodeMedia ? " work-case-media--empty" : ""}`}
        >
          {media.map((item) => (
            <CaseStudyMedia key={`${item.alt}-${item.caption}`} item={item} />
          ))}
          {splitAfterCodeMedia ? (
            <div className="work-case-media-desktop-after-code">
              {afterCodeMedia.map((item) => (
                <CaseStudyMedia
                  key={`desktop-${item.alt}-${item.caption}`}
                  item={item}
                />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      {detachCodeWindow && codeWindow ? (
        <div className="work-case-detached-code-window">
          <CaseStudyCodeWindow
            title={codeWindow.title}
            source={codeWindow.source}
          />
        </div>
      ) : null}
      {splitAfterCodeMedia ? (
        <div className="work-case-media work-case-media--after-code">
          {afterCodeMedia.map((item) => (
            <CaseStudyMedia
              key={`mobile-${item.alt}-${item.caption}`}
              item={item}
            />
          ))}
        </div>
      ) : null}
      {detachCopyMedia ? (
        <div className="work-case-copy-media-wrap">
          <div className="work-case-media-row work-case-media-row--pair work-case-copy-media-row">
            {copyMedia.map((item) => (
              <CaseStudyMedia
                key={`${item.alt}-${item.caption}`}
                item={item}
                inRow
              />
            ))}
          </div>
          {rowCaption ? (
            <p
              className="work-case-caption work-case-copy-media-caption"
              style={{ fontFamily: secondaryFont }}
            >
              {rowCaption}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function CaseStudySection({ section }: { section: ProjectCaseStudySection }) {
  return (
    <section id={section.id} className="work-case-section" aria-labelledby={section.id}>
      {section.blocks.map((block: ProjectCaseStudyBlock, index) => (
        <CaseStudyBlock
          key={`${section.id}-${index}`}
          heading={index === 0 ? section.heading : undefined}
          paragraphs={block.paragraphs}
          media={block.media}
          copyMedia={block.copyMedia}
          afterCodeMedia={block.afterCodeMedia}
          mobileMediaBeforeCopyMedia={block.mobileMediaBeforeCopyMedia}
          mobileMediaBeforeCodeWindow={block.mobileMediaBeforeCodeWindow}
          preserveMediaColumn={block.preserveMediaColumn}
          mediaLayout={block.mediaLayout}
          rowCaption={block.rowCaption}
          codeWindow={block.codeWindow}
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
    <article className={`work-case work-case--${content.slug}`}>
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
          className={`work-case-hero relative w-full overflow-hidden${content.hero?.bare ? "" : " work-grey-box"}${content.hero?.transparent ? " work-case-hero--transparent" : ""}`}
          style={{ aspectRatio: content.hero?.aspectRatio ?? "21 / 9" }}
        >
          {content.hero!.transparent && content.hero!.kind === "image" ? (
            <CaseStudyResponsiveHero hero={content.hero!} />
          ) : isVideoMedia(content.hero!) ? (
            <CaseStudyHeroVideo hero={content.hero!} />
          ) : content.hero!.imageMotion === "pan-x" ? (
            <Image
              src={content.hero!.src}
              alt={content.hero!.alt}
              width={content.hero!.intrinsicSize?.width ?? 4000}
              height={content.hero!.intrinsicSize?.height ?? 2630}
              unoptimized
              priority
              className="work-case-hero-pan-media"
              sizes="100vw"
            />
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
          mobileMediaBeforeCodeWindow={
            content.intro.mobileMediaBeforeCodeWindow
          }
          codeWindow={content.intro.codeWindow}
        />
      </section>

      {content.sections.map((section) => (
        <CaseStudySection key={section.id} section={section} />
      ))}

      {content.footerNote ? (
        <p
          className="work-case-footer-note"
          style={{ fontFamily: secondaryFont }}
        >
          {content.footerNote}
        </p>
      ) : null}
    </article>
  );
}
