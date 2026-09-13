import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { mimeFromPath, OgBrandMarkup, OgPhotoMarkup, OG_SIZE } from "@/lib/og-brand";
import { getProjectCaseStudy } from "@/lib/work/content";
import { getWorkProject, isVideoThumbnail } from "@/lib/work/projects";
import { isShareImagePath, SITE_NAME, stripAssetQuery } from "@/lib/seo";

export const alt = `Selected work by ${SITE_NAME}`;
export const size = OG_SIZE;
export const contentType = "image/png";

const OG_FILE_LIMIT = 2_500_000;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getWorkProject(slug);
  const title = project?.lines.join(" ") ?? SITE_NAME;
  const category = project?.category ?? "Graphic Design";
  const photo = project ? await shareImageDataUri(slug) : undefined;

  if (photo) {
    return new ImageResponse(
      <OgPhotoMarkup src={photo} title={title} category={category} />,
      { ...size },
    );
  }

  return new ImageResponse(
    <OgBrandMarkup kicker={SITE_NAME} title={title} footer={category} />,
    { ...size },
  );
}

async function shareImageDataUri(slug: string) {
  const project = getWorkProject(slug);
  if (!project) return undefined;
  const study = getProjectCaseStudy(slug);
  const ordered: string[] = [];
  const add = (src?: string) => {
    if (!src || !isShareImagePath(src)) return;
    const clean = stripAssetQuery(src).replace(/^\//, "");
    if (clean && !ordered.includes(clean)) ordered.push(clean);
  };

  add(study?.hero?.src);
  for (const slide of study?.hero?.heroSlides ?? []) add(slide.src);
  if (!isVideoThumbnail(project.thumbnail)) add(project.thumbnail);
  add(study?.hero?.poster);
  add(project.thumbnailPoster);

  for (const relative of ordered) {
    // Satori/ImageResponse is unreliable with webp/avif data URIs.
    if (!/\.(gif|jpe?g|png)$/i.test(relative)) continue;
    const full = join(process.cwd(), "public", relative);
    try {
      const info = await stat(full);
      if (info.size <= 0 || info.size > OG_FILE_LIMIT) continue;
      const file = await readFile(full);
      return `data:${mimeFromPath(relative)};base64,${file.toString("base64")}`;
    } catch {
      continue;
    }
  }

  return undefined;
}
