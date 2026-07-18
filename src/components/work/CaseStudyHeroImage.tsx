"use client";

import { useResponsiveMedia } from "@/lib/useResponsiveMedia";

export default function CaseStudyHeroImage({
  src,
  mobileSrc,
  alt,
  className,
}: {
  src: string;
  mobileSrc?: string;
  alt: string;
  className: string;
}) {
  const { src: activeSrc } = useResponsiveMedia({ src, mobileSrc });

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={activeSrc}
      alt={alt}
      className={className}
      decoding="async"
      loading="eager"
    />
  );
}
