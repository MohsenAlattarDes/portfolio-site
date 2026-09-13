import { ImageResponse } from "next/og";
import { OgBrandMarkup, OG_SIZE } from "@/lib/og-brand";
import { SITE_NAME, SITE_TITLE } from "@/lib/seo";

export const alt = SITE_TITLE;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <OgBrandMarkup title={SITE_NAME} />,
    { ...size },
  );
}
