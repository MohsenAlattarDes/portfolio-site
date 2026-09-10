"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectMedia } from "@/lib/work/types";
import { useInView } from "@/lib/useInView";
import { useResponsiveMedia } from "@/lib/useResponsiveMedia";

export default function CaseStudyHeroVideo({ hero }: { hero: ProjectMedia }) {
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>("400px 0px");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPoster, setShowPoster] = useState(Boolean(hero.poster));
  const [allowLoad, setAllowLoad] = useState(false);
  const { src, videoSources } = useResponsiveMedia(hero);
  const sources = videoSources ?? [{ src, type: "" }];
  const sourceKey = sources.map((source) => source.src).join("|");

  useEffect(() => {
    if (inView) setAllowLoad(true);
  }, [inView]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.loop = true;
    video.muted = true;

    const play = () => {
      if (video.paused) {
        void video.play().catch(() => {});
      }
    };

    const onPlaying = () => setShowPoster(false);

    if (!inView) {
      video.pause();
      if (hero.poster) setShowPoster(true);
      return;
    }

    if (!allowLoad) return;

    video.preload = "metadata";
    if (video.readyState === 0) {
      video.load();
    }

    play();
    video.addEventListener("loadeddata", play);
    video.addEventListener("canplay", play);
    video.addEventListener("playing", onPlaying);

    return () => {
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("canplay", play);
      video.removeEventListener("playing", onPlaying);
    };
  }, [allowLoad, hero.poster, inView, sourceKey]);

  const fitClass = hero.transparent
    ? "object-contain object-center"
    : "object-cover object-center";

  return (
    <div ref={inViewRef} className="absolute inset-0">
      {hero.poster && showPoster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hero.poster}
          alt=""
          aria-hidden="true"
          className={`work-case-hero-media work-case-hero-poster absolute inset-0 z-[2] h-full w-full ${fitClass}`}
        />
      ) : null}
      <video
        ref={videoRef}
        autoPlay={inView}
        loop
        muted
        playsInline
        preload={allowLoad ? "metadata" : "none"}
        poster={hero.poster}
        aria-label={hero.alt}
        className={`work-case-hero-media absolute inset-0 z-[1] h-full w-full ${fitClass}${showPoster ? " opacity-0" : " opacity-100"}${hero.transparent ? " work-case-hero-media--transparent" : ""}`}
      >
        {allowLoad
          ? sources.map((source) => (
              <source
                key={source.src}
                src={source.src}
                type={source.type || undefined}
              />
            ))
          : null}
      </video>
    </div>
  );
}
