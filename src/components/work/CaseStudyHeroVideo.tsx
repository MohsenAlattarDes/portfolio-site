"use client";

import { useEffect, useRef } from "react";
import type { ProjectMedia } from "@/lib/work/types";

export default function CaseStudyHeroVideo({ hero }: { hero: ProjectMedia }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.loop = true;
    video.muted = true;

    const play = () => {
      if (video.paused) {
        void video.play().catch(() => {});
      }
    };

    play();
    video.addEventListener("loadeddata", play);
    video.addEventListener("canplay", play);

    return () => {
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("canplay", play);
    };
  }, [hero.src]);

  const sources = hero.videoSources ?? [{ src: hero.src, type: "" }];

  return (
    <video
      ref={ref}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      aria-label={hero.alt}
      className="absolute inset-0 h-full w-full object-cover object-center"
    >
      {sources.map((source) => (
        <source
          key={source.src}
          src={source.src}
          type={source.type || undefined}
        />
      ))}
    </video>
  );
}
