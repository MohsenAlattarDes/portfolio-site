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

export type ProjectCaseStudyBlock = {
  paragraphs: string[];
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
    paragraphs: string[];
    media: ProjectMedia[];
  };
  sections: ProjectCaseStudySection[];
};
