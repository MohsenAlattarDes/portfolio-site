export type ProjectMedia = {
  src: string;
  alt: string;
  caption: string;
  aspectRatio?: string;
  bare?: boolean;
  kind?: "image" | "video" | "pdf";
  videoSources?: { src: string; type: string }[];
  poster?: string;
  videoControls?: boolean;
  cropLeft?: number;
  rotate?: number;
  maxWidth?: string;
  align?: "start" | "center" | "end";
  paperShadow?: boolean;
  spacingTop?: string;
  captionSpacing?: string;
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
  preserveMediaColumn?: boolean;
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
  };
  sections: ProjectCaseStudySection[];
};
