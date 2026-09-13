import type { MetadataRoute } from "next";
import { getProjectCaseStudy } from "@/lib/work/content";
import { WORK_PROJECTS } from "@/lib/work/projects";
import { absoluteUrl, getProjectOgImagePath, SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/work"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/codes"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  for (const project of WORK_PROJECTS) {
    const study = getProjectCaseStudy(project.slug);
    const image = getProjectOgImagePath(project, study);
    pages.push({
      url: absoluteUrl(`/work/${project.slug}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
      images: image ? [absoluteUrl(image)] : undefined,
    });
  }

  return pages;
}
