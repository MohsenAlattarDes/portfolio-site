export type CaseStudyCodeSketchId =
  | "anora-process-stack"
  | "lag-process-stack"
  | "cake-picnic-ornament"
  | "cake-workshop-sadu";

export type PublicationSpread = {
  src: string;
  alt: string;
  intrinsicSize?: {
    width: number;
    height: number;
  };
};

export type ProjectMedia = {
  src: string;
  alt: string;
  caption: string;
  mobileSrc?: string;
  aspectRatio?: string;
  themeSrc?: {
    dark: string;
    light: string;
  };
  intrinsicSize?: {
    width: number;
    height: number;
  };
  bare?: boolean;
  transparent?: boolean;
  imageMotion?: "pan-x";
  kind?: "image" | "video" | "pdf" | "code" | "glyph-cycle" | "publication-flipbook" | "scattered-stack" | "character-cast" | "site-embed" | "interface-kit" | "interactive-svg" | "hero-cycle";
  publicationSpreads?: PublicationSpread[];
  scatterImages?: PublicationSpread[];
  castImages?: PublicationSpread[];
  heroSlides?: PublicationSpread[];
  heroStickers?: PublicationSpread[];
  /** Static foreground image over cycling heroSlides (e.g. kits over grass). */
  heroOverlay?: PublicationSpread;
  /** Clip cycling slides to a circle behind the overlay. */
  heroBackdropShape?: "rect" | "circle";
  heroCycleFit?: "contain" | "cover";
  heroCycleFadeMs?: number;
  /** Shared id so multiple hero-cycles advance on the same clock. */
  heroCycleSyncId?: string;
  interfaceColors?: { name: string; hex: string; on?: "light" | "dark" }[];
  interfaceCategories?: { label: string; color: string }[];
  interfaceElements?: PublicationSpread[];
  embedUrl?: string;
  embedDisplayUrl?: string;
  codeSketch?: CaseStudyCodeSketchId;
  codeSketchCopies?: number;
  mobileVideoFallback?: string;
  glyphs?: string[];
  glyphExclude?: string[];
  glyphIntervalMs?: number;
  videoSources?: { src: string; type: string }[];
  mobileVideoSources?: { src: string; type: string }[];
  poster?: string;
  videoControls?: boolean;
  videoPlaybackRate?: number;
  videoSpeedControls?: boolean;
  cropLeft?: number;
  rotate?: number;
  maxWidth?: string;
  align?: "start" | "center" | "end";
  paperShadow?: boolean;
  spacingTop?: string;
  captionSpacing?: string;
  enlarge?: boolean;
  rowFit?: "cover" | "contain" | "natural" | "wide";
  /** Force a full-width phone row even when a neighbor shares the same aspect. */
  phoneSolo?: boolean;
  rowAspectRatio?: string;
  objectPosition?: string;
};

export type ProjectCaseStudyLink = {
  text: string;
  href: string;
};

export type ProjectCaseStudyParagraph =
  | string
  | Array<string | ProjectCaseStudyLink>;

export type ProjectCaseStudyBlock = {
  heading?: string;
  paragraphs: ProjectCaseStudyParagraph[];
  media: ProjectMedia[];
  copyMedia?: ProjectMedia[];
  afterCodeMedia?: ProjectMedia[];
  mobileMediaBeforeCopyMedia?: boolean;
  mobileMediaBeforeCodeWindow?: boolean;
  preserveMediaColumn?: boolean;
  mediaLayout?: "stack" | "row" | "grid-3" | "hero" | "full";
  rowCaption?: string;
  /** Extra class on media-only rows (e.g. equal-height pair). */
  mediaRowClass?: string;
  codeWindow?: {
    title?: string;
    source: string;
  };
};

export type ProjectCaseStudySection = {
  id: string;
  heading?: string;
  /** Lay subsection blocks out in columns instead of a vertical stack. */
  blocksLayout?: "stack" | "grid-2";
  blocks: ProjectCaseStudyBlock[];
};

export type CaseStudyShowMoreContent = {
  heading?: string;
  closedLabel?: string;
  openLabel?: string;
  blocks: {
    heading: string;
    paragraphs: string[];
  }[];
};

export type ProjectCaseStudy = {
  slug: string;
  hero?: ProjectMedia;
  intro: {
    heading: string;
    paragraphs: ProjectCaseStudyParagraph[];
    media: ProjectMedia[];
    more?: CaseStudyShowMoreContent;
    mobileMediaBeforeCodeWindow?: boolean;
    codeWindow?: {
      title?: string;
      source: string;
    };
  };
  sections: ProjectCaseStudySection[];
  footerNote?: string;
};
