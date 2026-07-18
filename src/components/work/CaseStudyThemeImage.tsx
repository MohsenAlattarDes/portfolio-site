"use client";

import Image from "next/image";
import { useTheme } from "@/components/ThemeProvider";
import { useIsMobile } from "@/lib/useMediaQuery";

export default function CaseStudyThemeImage({
  src,
  mobileSrc,
  themeSrc,
  alt,
  className,
  intrinsicSize,
  transparent = false,
  style,
}: {
  src: string;
  mobileSrc?: string;
  themeSrc?: { dark: string; light: string };
  alt: string;
  className: string;
  intrinsicSize?: { width: number; height: number };
  transparent?: boolean;
  style?: React.CSSProperties;
}) {
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  const activeSrc = themeSrc
    ? theme === "light"
      ? themeSrc.light
      : themeSrc.dark
    : isMobile && mobileSrc
      ? mobileSrc
      : src;

  if (transparent) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={activeSrc}
        alt={alt}
        className={className}
        decoding="async"
        loading="lazy"
        style={
          intrinsicSize
            ? {
                width: "100%",
                height: "auto",
                background: "transparent",
                ...style,
              }
            : { background: "transparent", ...style }
        }
      />
    );
  }

  if (intrinsicSize) {
    return (
      <Image
        src={activeSrc}
        alt={alt}
        width={intrinsicSize.width}
        height={intrinsicSize.height}
        unoptimized
        className={className}
        sizes="(max-width: 992px) 100vw, 58vw"
        style={{ height: "auto", ...style }}
      />
    );
  }

  return (
    <Image
      src={activeSrc}
      alt={alt}
      fill
      unoptimized
      className={className}
      sizes="(max-width: 992px) 100vw, 58vw"
      style={style}
    />
  );
}
