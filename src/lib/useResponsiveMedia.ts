"use client";

import { useIsMobile, usePrefersReducedMotion } from "@/lib/useMediaQuery";

export function useResponsiveMedia(item: {
  src: string;
  mobileSrc?: string;
  videoSources?: { src: string; type: string }[];
  mobileVideoSources?: { src: string; type: string }[];
}) {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const useMobile = isMobile || reducedMotion;

  return {
    isMobile,
    reducedMotion,
    src: useMobile && item.mobileSrc ? item.mobileSrc : item.src,
    videoSources:
      useMobile && item.mobileVideoSources?.length
        ? item.mobileVideoSources
        : item.videoSources,
  };
}
