import { ABOUT_CONTACT_LINKS } from "@/lib/about/contact";
import { getProjectCaseStudy } from "@/lib/work/content";
import {
  isVideoThumbnail,
  type WorkProject,
} from "@/lib/work/projects";
import type {
  ProjectCaseStudy,
  ProjectCaseStudyParagraph,
} from "@/lib/work/types";
import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohsendesign.com";

export const SITE_NAME = "Mohsen Alattar";
export const LEGAL_NAME = "Abdulmuhsin Alattar";
export const NAME_ALIASES = [
  "Abdulmuhsin Alattar",
  "Abdulmohsen Alattar",
  "Mohsen Alattar",
] as const;
export const SITE_TITLE =
  "Mohsen Alattar (Abdulmuhsin Alattar) | Graphic Designer";
export const SITE_DESCRIPTION =
  "Portfolio of Mohsen Alattar, also known as Abdulmuhsin Alattar: a graphic designer working across type, branding, motion, packaging, and Arabic typography. Based in Kuwait and Los Angeles.";

export const SITE_JOB_TITLE = "Graphic Designer";
export const LINKEDIN_URL = "https://www.linkedin.com/in/abdulmohsen-alattar";
export const EMAIL = "alattar@mohsendesign.com";
export const HEADSHOT_PATH = "/about/headshot-light.jpg";

const IMAGE_EXT = /\.(avif|gif|jpe?g|png|webp)$/i;

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalized, SITE_URL).toString();
}

export function stripAssetQuery(src: string) {
  return src.split("?")[0] ?? src;
}

export function isShareImagePath(src: string) {
  return IMAGE_EXT.test(stripAssetQuery(src));
}

function paragraphText(paragraph: ProjectCaseStudyParagraph) {
  if (typeof paragraph === "string") return paragraph.trim();
  return paragraph
    .map((part) => (typeof part === "string" ? part : part.text))
    .join("")
    .trim();
}

export function descriptionFromParagraphs(
  paragraphs: ProjectCaseStudyParagraph[],
  fallback = SITE_DESCRIPTION,
) {
  const texts = paragraphs.map(paragraphText).filter(Boolean);
  const preferred =
    texts.find((text) => text.length >= 90 && text.length <= 200) ??
    texts[0] ??
    fallback;

  if (preferred.length <= 200) return preferred;
  return `${preferred.slice(0, 177).replace(/\s+\S*$/, "")}...`;
}

export function caseStudyDescription(study: ProjectCaseStudy) {
  return descriptionFromParagraphs(study.intro.paragraphs);
}

function collectOgCandidates(
  project: WorkProject,
  study?: ProjectCaseStudy,
) {
  const candidates: string[] = [];
  const push = (src?: string) => {
    if (!src || !isShareImagePath(src)) return;
    const clean = stripAssetQuery(src);
    if (!candidates.includes(clean)) candidates.push(clean);
  };

  push(study?.hero?.src);
  for (const slide of study?.hero?.heroSlides ?? []) push(slide.src);
  if (!isVideoThumbnail(project.thumbnail)) push(project.thumbnail);
  push(study?.hero?.poster);
  push(project.thumbnailPoster);

  return candidates;
}

export function getProjectOgImagePath(
  project: WorkProject,
  study = getProjectCaseStudy(project.slug),
) {
  return collectOgCandidates(project, study)[0];
}

export function routeMetadata({
  title,
  description,
  path,
  ogTitle,
}: {
  title: string;
  description: string;
  path: string;
  ogTitle?: string;
}): Metadata {
  const url = path;
  const resolvedOgTitle = ogTitle ?? `${title} | ${SITE_NAME} (${LEGAL_NAME})`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: resolvedOgTitle,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: resolvedOgTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedOgTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export function personJsonLd() {
  const telephone = ABOUT_CONTACT_LINKS.find((link) =>
    link.href.startsWith("tel:"),
  )?.href.replace("tel:", "");

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: SITE_NAME,
    givenName: "Abdulmuhsin",
    additionalName: "Mohsen",
    familyName: "Alattar",
    alternateName: [...NAME_ALIASES],
    url: SITE_URL,
    image: absoluteUrl(HEADSHOT_PATH),
    jobTitle: SITE_JOB_TITLE,
    description: SITE_DESCRIPTION,
    email: EMAIL,
    telephone,
    sameAs: [LINKEDIN_URL],
    address: [
      {
        "@type": "PostalAddress",
        addressLocality: "Los Angeles",
        addressRegion: "CA",
        addressCountry: "US",
      },
      {
        "@type": "PostalAddress",
        addressLocality: "Kuwait",
        addressCountry: "KW",
      },
    ],
  };
}

export function creativeWorkJsonLd(
  project: WorkProject,
  study?: ProjectCaseStudy,
) {
  const title = project.lines.join(" ");
  const description = study
    ? caseStudyDescription(study)
    : `${title}, ${project.category} by ${SITE_NAME}.`;
  const imagePath = getProjectOgImagePath(project, study);

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: title,
    description,
    url: absoluteUrl(`/work/${project.slug}`),
    image: imagePath ? absoluteUrl(imagePath) : undefined,
    genre: project.category,
    author: {
      "@id": `${SITE_URL}/#person`,
    },
    creator: {
      "@id": `${SITE_URL}/#person`,
    },
  };
}

export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const WORK_INDEX_DESCRIPTION =
  "Selected work by Mohsen Alattar: typefaces, branding, publications, packaging, motion, and Arabic typography.";

export const ABOUT_DESCRIPTION =
  "Abdulmuhsin Alattar, who works as Mohsen Alattar, is a graphic designer from Kuwait, based between Kuwait and Los Angeles. His work starts with Arabic type and expands into branding, type design, motion, and design research.";

export const CODES_DESCRIPTION =
  "Interactive type and motion sketches by Mohsen Alattar: mouse-driven canvases, dense type fields, and full-bleed experiments.";

export const INDEXABLE_HOME_COPY = SITE_DESCRIPTION;
