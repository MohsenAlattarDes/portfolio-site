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
  kind?: "image" | "video" | "pdf" | "code" | "glyph-cycle" | "publication-flipbook";
  publicationSpreads?: PublicationSpread[];
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
  cropLeft?: number;
  rotate?: number;
  maxWidth?: string;
  align?: "start" | "center" | "end";
  paperShadow?: boolean;
  spacingTop?: string;
  captionSpacing?: string;
  enlarge?: boolean;
  rowFit?: "cover" | "contain" | "natural" | "wide";
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
  paragraphs: ProjectCaseStudyParagraph[];
  media: ProjectMedia[];
  copyMedia?: ProjectMedia[];
  afterCodeMedia?: ProjectMedia[];
  mobileMediaBeforeCopyMedia?: boolean;
  mobileMediaBeforeCodeWindow?: boolean;
  preserveMediaColumn?: boolean;
  mediaLayout?: "stack" | "row" | "hero" | "full";
  rowCaption?: string;
  codeWindow?: {
    title?: string;
    source: string;
  };
};

export type ProjectCaseStudySection = {
  id: string;
  heading?: string;
  blocks: ProjectCaseStudyBlock[];
};

export type ProjectCaseStudy = {
  slug: string;
  hero?: ProjectMedia;
  intro: {
    heading: string;
    paragraphs: ProjectCaseStudyParagraph[];
    media: ProjectMedia[];
    mobileMediaBeforeCodeWindow?: boolean;
    codeWindow?: {
      title?: string;
      source: string;
    };
  };
  sections: ProjectCaseStudySection[];
  footerNote?: string;
};
