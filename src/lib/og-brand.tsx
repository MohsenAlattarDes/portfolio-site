import { SITE_JOB_TITLE, SITE_NAME } from "@/lib/seo";

export const OG_SIZE = {
  width: 1200,
  height: 630,
} as const;

export function OgBrandMarkup({
  kicker = SITE_JOB_TITLE,
  title = SITE_NAME,
  footer = "Kuwait + Los Angeles",
}: {
  kicker?: string;
  title?: string;
  footer?: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#ffffff",
        color: "#ff0000",
        padding: "72px 80px",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 28,
          letterSpacing: 6,
          textTransform: "uppercase",
        }}
      >
        {kicker}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 18 ? 72 : 96,
            lineHeight: 0.9,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 32 }}>
          {footer}
        </div>
      </div>
    </div>
  );
}

export function OgPhotoMarkup({
  src,
  title,
  category,
}: {
  src: string;
  title: string;
  category: string;
}) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        background: "#111111",
      }}
    >
      <img
        src={src}
        alt=""
        width={OG_SIZE.width}
        height={OG_SIZE.height}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          padding: "36px 48px",
          background: "#ff0000",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: title.length > 22 ? 42 : 52,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: -1,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", marginTop: 8, fontSize: 24 }}>
          {category}
        </div>
      </div>
    </div>
  );
}

export function mimeFromPath(path: string) {
  const ext = path.split(".").pop()?.toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "gif") return "image/gif";
  if (ext === "webp") return "image/webp";
  if (ext === "avif") return "image/avif";
  return "image/jpeg";
}
