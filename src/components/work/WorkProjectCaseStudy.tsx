import Image from "next/image";
import WorkTitleText from "@/components/WorkTitleText";
import CaseStudyCodeFigure from "@/components/work/CaseStudyCodeFigure";
import CaseStudyCodeWindow from "@/components/work/CaseStudyCodeWindow";
import CaseStudyGlyphCycle from "@/components/work/CaseStudyGlyphCycle";
import CaseStudyPublicationFlipbook from "@/components/work/CaseStudyPublicationFlipbook";
import CaseStudyScatteredStack from "@/components/work/CaseStudyScatteredStack";
import CaseStudyCharacterCast from "@/components/work/CaseStudyCharacterCast";
import CaseStudyInterfaceKit from "@/components/work/CaseStudyInterfaceKit";
import CaseStudyInteractiveSvg from "@/components/work/CaseStudyInteractiveSvg";
import CaseStudyShowMore from "@/components/work/CaseStudyShowMore";
import CaseStudySiteEmbed from "@/components/work/CaseStudySiteEmbed";
import CaseStudyVideoSpeed from "@/components/work/CaseStudyVideoSpeed";
import CaseStudyResponsiveHero from "@/components/work/CaseStudyResponsiveHero";
import CaseStudyHeroCycle from "@/components/work/CaseStudyHeroCycle";
import CaseStudyHeroVideo from "@/components/work/CaseStudyHeroVideo";
import CaseStudyLoopVideo from "@/components/work/CaseStudyLoopVideo";
import CaseStudyMediaLightbox from "@/components/work/CaseStudyMediaLightbox";
import CaseStudyThemeImage from "@/components/work/CaseStudyThemeImage";
import ScrollReveal from "@/components/work/ScrollReveal";
import { PLACEHOLDER_THUMBNAIL } from "@/lib/work/projects";
import type { WorkProject } from "@/lib/work/projects";
import type {
  CaseStudyShowMoreContent,
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
  if (item.kind === "image" || item.kind === "pdf" || item.kind === "hero-cycle")
    return false;
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

function isScatteredStackMedia(item: ProjectMedia) {
  return item.kind === "scattered-stack" && Boolean(item.scatterImages?.length);
}

function isCharacterCastMedia(item: ProjectMedia) {
  return item.kind === "character-cast" && Boolean(item.castImages?.length);
}

function isHeroCycleMedia(item: ProjectMedia) {
  return item.kind === "hero-cycle" && Boolean(item.heroSlides?.length);
}

function isSiteEmbedMedia(item: ProjectMedia) {
  return item.kind === "site-embed" && Boolean(item.embedUrl || item.src);
}

function isInterfaceKitMedia(item: ProjectMedia) {
  return (
    item.kind === "interface-kit" &&
    Boolean(item.interfaceColors?.length || item.interfaceCategories?.length)
  );
}

const ROW_MEDIA_ASPECT = "768 / 1024";
const CASE_STUDY_HERO_ASPECT = "3612 / 1850";

/** Width/height for flex-grow in equal-height full-width rows. */
function mediaAspectValue(item: ProjectMedia): number {
  if (item.intrinsicSize?.width && item.intrinsicSize?.height) {
    return item.intrinsicSize.width / item.intrinsicSize.height;
  }
  const raw = item.aspectRatio ?? item.rowAspectRatio;
  if (raw) {
    const parts = raw.split("/").map((part) => Number.parseFloat(part.trim()));
    if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
      return parts[0] / parts[1];
    }
  }
  return 1;
}

/** Relative aspect tolerance so near-identical crops can share a phone row. */
function aspectsMatchHeight(a: number, b: number, tolerance = 0.08): boolean {
  const mid = (a + b) / 2;
  if (mid <= 0) return false;
  return Math.abs(a - b) / mid <= tolerance;
}

/**
 * Phone layout groups: only consecutive items with matching height share a row.
 * Mismatched items, wide/motion pieces, and phoneSolo items get their own row.
 */
function phoneMediaGroups(items: ProjectMedia[]): ProjectMedia[][] {
  const groups: ProjectMedia[][] = [];
  let i = 0;
  while (i < items.length) {
    const current = items[i]!;
    const next = items[i + 1];
    const currentSolo =
      current.phoneSolo || current.rowFit === "wide";
    const nextSolo = Boolean(
      next && (next.phoneSolo || next.rowFit === "wide"),
    );
    if (
      next &&
      !currentSolo &&
      !nextSolo &&
      aspectsMatchHeight(mediaAspectValue(current), mediaAspectValue(next))
    ) {
      groups.push([current, next]);
      i += 2;
      continue;
    }
    groups.push([current]);
    i += 1;
  }
  return groups;
}

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
  if (isHeroCycleMedia(item)) {
    const ratio = item.aspectRatio ?? "2 / 3";
    const aspect = mediaAspectValue(item);
    return (
      <figure
        className="work-case-figure"
        style={{
          ...(inRow ? { ["--media-aspect" as string]: aspect } : {}),
          ...(item.spacingTop ? { marginTop: item.spacingTop } : {}),
          ...(item.maxWidth
            ? { width: item.maxWidth, maxWidth: "100%" }
            : {}),
        }}
      >
        <div
          className={`work-case-media-frame relative w-full overflow-hidden${item.bare ? "" : " work-grey-box"}`}
          style={{ aspectRatio: ratio }}
        >
          <CaseStudyHeroCycle
            slides={item.heroSlides!}
            stickers={item.heroStickers}
            overlay={item.heroOverlay}
            backdropShape={item.heroBackdropShape}
            intervalMs={item.glyphIntervalMs}
            fadeMs={item.heroCycleFadeMs}
            slideFit={item.heroCycleFit ?? "contain"}
            syncId={item.heroCycleSyncId}
            variant="media"
          />
        </div>
        {item.caption ? (
          <figcaption
            className="work-case-caption"
            style={{
              fontFamily: secondaryFont,
              ...(item.captionSpacing
                ? { marginTop: item.captionSpacing }
                : {}),
            }}
          >
            {item.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

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

  if (isScatteredStackMedia(item)) {
    return (
      <CaseStudyScatteredStack
        items={item.scatterImages!}
        caption={item.caption}
      />
    );
  }

  if (isCharacterCastMedia(item)) {
    return (
      <CaseStudyCharacterCast
        items={item.castImages!}
        caption={item.caption}
      />
    );
  }

  if (isSiteEmbedMedia(item)) {
    return (
      <CaseStudySiteEmbed
        src={item.embedUrl ?? item.src}
        displaySrc={item.embedDisplayUrl}
        title={item.alt}
        caption={item.caption}
      />
    );
  }

  if (isInterfaceKitMedia(item)) {
    return (
      <CaseStudyInterfaceKit
        colors={item.interfaceColors ?? []}
        categories={item.interfaceCategories ?? []}
        caption={item.caption}
      />
    );
  }

  if (item.videoSpeedControls && isVideoMedia(item)) {
    return <CaseStudyVideoSpeed item={item} />;
  }

  if (isCodeMedia(item)) {
    return <CaseStudyCodeFigure item={item} />;
  }

  const rowNatural = inRow && item.rowFit === "natural";
  const rowContain = inRow && (item.rowFit === "contain" || item.rowFit === undefined);
  const rowWide = inRow && item.rowFit === "wide";
  const rowCover = inRow && item.rowFit === "cover";
  const useIntrinsicSize = Boolean(item.intrinsicSize) && (!inRow || rowNatural);
  const ratio = rowWide
    ? (item.aspectRatio ?? "4 / 3")
    : inRow && !rowNatural
      ? (item.rowAspectRatio ?? ROW_MEDIA_ASPECT)
      : (item.aspectRatio ?? "4 / 3");
  const isVideo = isVideoMedia(item);
  const isPdf = isPdfMedia(item);
  const isInteractiveSvg = item.kind === "interactive-svg";
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

  const mediaContent = isInteractiveSvg ? (
    <CaseStudyInteractiveSvg alt={item.alt} className={mediaClassName} />
  ) : isPdf ? (
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
    ...(inRow ? { ["--media-aspect" as string]: mediaAspectValue(item) } : {}),
    ...(item.maxWidth
      ? { width: item.maxWidth, maxWidth: "100%" }
      : {}),
    ...(item.spacingTop ? { marginTop: item.spacingTop } : {}),
    ...(item.align === "center"
      ? { alignSelf: "center", marginInline: "auto" }
      : item.align === "start"
        ? { alignSelf: "flex-start" }
        : item.align === "end"
          ? { alignSelf: "flex-end", marginInlineStart: "auto" }
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
  headingAs = "h2",
  paragraphs,
  media,
  copyMedia = [],
  afterCodeMedia = [],
  mobileMediaBeforeCopyMedia = false,
  mobileMediaBeforeCodeWindow = false,
  preserveMediaColumn = false,
  mediaLayout = "stack",
  rowCaption,
  mediaRowClass,
  subBlock = false,
  solo = false,
  codeWindow,
  more,
}: {
  heading?: string;
  headingAs?: "h2" | "h3";
  paragraphs: ProjectCaseStudyParagraph[];
  media: ProjectMedia[];
  copyMedia?: ProjectMedia[];
  afterCodeMedia?: ProjectMedia[];
  mobileMediaBeforeCopyMedia?: boolean;
  mobileMediaBeforeCodeWindow?: boolean;
  preserveMediaColumn?: boolean;
  mediaLayout?: "stack" | "row" | "grid-3" | "hero" | "full";
  rowCaption?: string;
  mediaRowClass?: string;
  subBlock?: boolean;
  solo?: boolean;
  codeWindow?: {
    title?: string;
    source: string;
  };
  more?: CaseStudyShowMoreContent;
}) {
  const showMediaColumn =
    media.length > 0 || afterCodeMedia.length > 0 || preserveMediaColumn;
  const mediaOnlyRow =
    mediaLayout === "row" && paragraphs.length === 0 && media.length > 0;
  const mediaRowAfterCopy =
    mediaLayout === "row" && paragraphs.length > 0 && media.length > 0;
  const mediaGrid3 =
    mediaLayout === "grid-3" && paragraphs.length === 0 && media.length > 0;
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

  const headingNode = heading ? (
    headingAs === "h3" ? (
      <h3 className="work-case-subheading" style={{ fontFamily: displayFont }}>
        {heading}
      </h3>
    ) : (
      <h2 className="work-case-heading" style={{ fontFamily: displayFont }}>
        {heading}
      </h2>
    )
  ) : null;

  const bodyNode =
    paragraphs.length > 0 ? (
      <div className="work-case-body" style={{ fontFamily: secondaryFont }}>
        {paragraphs.map((paragraph) => (
          <p key={JSON.stringify(paragraph).slice(0, 48)}>
            <CaseStudyParagraph paragraph={paragraph} />
          </p>
        ))}
      </div>
    ) : null;

  const moreNode = more ? (
    <CaseStudyShowMore
      heading={more.heading}
      blocks={more.blocks}
      closedLabel={more.closedLabel}
      openLabel={more.openLabel}
    />
  ) : null;

  if (solo) {
    return (
      <ScrollReveal>
        <div className="work-case-subblock">
          {headingNode}
          {bodyNode}
        </div>
      </ScrollReveal>
    );
  }

  if (mediaHeroLayout) {
    return (
      <ScrollReveal>
        {media.map((item) => (
          <CaseStudyHeroSlot key={`${item.alt}-${item.caption}`} item={item} />
        ))}
      </ScrollReveal>
    );
  }

  if (mediaFullLayout) {
    return (
      <ScrollReveal>
        <div
          className={`work-case-split work-case-split--full${subBlock ? " work-case-split--sub" : ""}`}
        >
          <div className="work-case-media work-case-media--full">
            {media.map((item) => (
              <CaseStudyMedia key={`${item.alt}-${item.caption}`} item={item} />
            ))}
          </div>
        </div>
      </ScrollReveal>
    );
  }

  if (mediaGrid3 || mediaOnlyRow || mediaRowAfterCopy) {
    return (
      <ScrollReveal>
        <div
          className={`work-case-media-row-wrap${mediaRowAfterCopy ? " work-case-media-row-wrap--with-copy" : ""}${subBlock ? " work-case-media-row-wrap--sub" : ""}`}
        >
          {mediaRowAfterCopy ? (
            <div className="work-case-media-row-copy">
              {headingNode}
              {bodyNode}
            </div>
          ) : null}
          <div
            className={`work-case-media-row${mediaGrid3 ? " work-case-media-row--grid-3" : ""}${!mediaGrid3 && media.length === 2 ? " work-case-media-row--pair" : ""}${!mediaGrid3 && media.length === 3 ? " work-case-media-row--triptych" : ""}${!mediaGrid3 && media.length === 4 ? " work-case-media-row--quad" : ""}${!mediaGrid3 && media.length === 5 ? " work-case-media-row--five" : ""}${mediaRowClass ? ` ${mediaRowClass}` : ""}`}
          >
            {phoneMediaGroups(media).map((group, groupIndex) => {
              const groupAspect = group.reduce(
                (sum, item) => sum + mediaAspectValue(item),
                0,
              );
              return (
                <div
                  key={`phone-group-${groupIndex}`}
                  className={`work-case-media-row__phone-group${group.length === 1 ? " work-case-media-row__phone-group--solo" : ""}`}
                  style={{ ["--group-aspect" as string]: groupAspect }}
                >
                  {group.map((item) => (
                    <CaseStudyMedia
                      key={`${item.alt}-${item.caption}`}
                      item={item}
                      inRow
                    />
                  ))}
                </div>
              );
            })}
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
      </ScrollReveal>
    );
  }

  return (
    <ScrollReveal>
    <div
      className={`work-case-split${subBlock ? " work-case-split--sub" : ""}${mobileMediaBeforeCopyMedia ? " work-case-split--mobile-media-first" : ""}${detachCodeWindow ? " work-case-split--mobile-media-before-code" : ""}${splitAfterCodeMedia ? " work-case-split--mobile-after-code-media" : ""}`}
    >
      <div className="work-case-copy">
        {headingNode}
        {bodyNode}
        {moreNode}
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
    </ScrollReveal>
  );
}

function CaseStudySection({ section }: { section: ProjectCaseStudySection }) {
  const hasSectionHeading = Boolean(section.heading);
  const blocksLayout = section.blocksLayout ?? "stack";
  const isBlocksGrid = blocksLayout === "grid-2";

  const blocks = section.blocks.map((block: ProjectCaseStudyBlock, index) => (
    <CaseStudyBlock
      key={`${section.id}-${index}`}
      heading={
        hasSectionHeading
          ? block.heading
          : index === 0
            ? (block.heading ?? section.heading)
            : block.heading
      }
      headingAs={hasSectionHeading && block.heading ? "h3" : "h2"}
      paragraphs={block.paragraphs}
      media={isBlocksGrid ? [] : block.media}
      copyMedia={isBlocksGrid ? [] : block.copyMedia}
      afterCodeMedia={isBlocksGrid ? [] : block.afterCodeMedia}
      mobileMediaBeforeCopyMedia={
        isBlocksGrid ? false : block.mobileMediaBeforeCopyMedia
      }
      mobileMediaBeforeCodeWindow={
        isBlocksGrid ? false : block.mobileMediaBeforeCodeWindow
      }
      preserveMediaColumn={isBlocksGrid ? false : block.preserveMediaColumn}
      mediaLayout={block.mediaLayout}
      rowCaption={block.rowCaption}
      mediaRowClass={block.mediaRowClass}
      codeWindow={isBlocksGrid ? undefined : block.codeWindow}
      subBlock={!isBlocksGrid && index > 0}
      solo={isBlocksGrid}
    />
  ));

  return (
    <section
      id={section.id}
      className="work-case-section"
      aria-labelledby={hasSectionHeading ? `${section.id}-heading` : section.id}
    >
      {hasSectionHeading ? (
        <h2
          id={`${section.id}-heading`}
          className="work-case-heading work-case-heading--section"
          style={{ fontFamily: displayFont }}
        >
          {section.heading}
        </h2>
      ) : null}
      {isBlocksGrid ? (
        <div className="work-case-blocks-grid work-case-blocks-grid--2">
          {blocks}
        </div>
      ) : (
        blocks
      )}
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
          className={`work-case-hero relative w-full${
            isHeroCycleMedia(content.hero!) && content.hero!.heroStickers?.length
              ? " work-case-hero--stickers"
              : " overflow-hidden"
          }${content.hero?.bare ? "" : " work-grey-box"}${content.hero?.transparent ? " work-case-hero--transparent" : ""}`}
          style={{ aspectRatio: content.hero?.aspectRatio ?? "21 / 9" }}
        >
          {isHeroCycleMedia(content.hero!) ? (
            <CaseStudyHeroCycle
              slides={content.hero!.heroSlides!}
              stickers={content.hero!.heroStickers}
              intervalMs={content.hero!.glyphIntervalMs}
            />
          ) : content.hero!.transparent && content.hero!.kind === "image" ? (
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
              className="object-contain object-center"
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
          more={content.intro.more}
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
        <ScrollReveal>
          <p
            className="work-case-footer-note"
            style={{ fontFamily: secondaryFont }}
          >
            {content.footerNote}
          </p>
        </ScrollReveal>
      ) : null}
    </article>
  );
}
