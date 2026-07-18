"use client";

import CaseStudyHeroImage from "@/components/work/CaseStudyHeroImage";
import CaseStudyLoopVideo from "@/components/work/CaseStudyLoopVideo";
import type { ProjectMedia } from "@/lib/work/types";
import { useIsMobile } from "@/lib/useMediaQuery";
import { useEffect, useState } from "react";

export default function CaseStudyResponsiveHero({
  hero,
}: {
  hero: ProjectMedia;
}) {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    if (hero.poster) {
      return (
        <CaseStudyHeroImage
          src={hero.poster}
          alt={hero.alt}
          className="work-case-hero-media work-case-hero-media--transparent absolute inset-0 h-full w-full object-contain object-center"
        />
      );
    }
    return null;
  }

  const useMobileVideo = isMobile && Boolean(hero.mobileVideoSources?.length);

  if (useMobileVideo) {
    return (
      <CaseStudyLoopVideo
        item={{
          ...hero,
          kind: "video",
          src: hero.mobileVideoSources![0]!.src,
          videoSources: hero.mobileVideoSources,
        }}
        className="work-case-hero-media work-case-hero-media--transparent absolute inset-0 h-full w-full object-contain object-center"
      />
    );
  }

  return (
    <CaseStudyHeroImage
      src={hero.src}
      mobileSrc={hero.mobileSrc}
      alt={hero.alt}
      className="work-case-hero-media work-case-hero-media--transparent absolute inset-0 h-full w-full object-contain object-center"
    />
  );
}
