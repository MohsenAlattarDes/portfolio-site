"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectMedia } from "@/lib/work/types";
import { useInView } from "@/lib/useInView";
import { useResponsiveMedia } from "@/lib/useResponsiveMedia";

export default function CaseStudyLoopVideo({
  item,
  className,
  style,
  playbackRate,
}: {
  item: ProjectMedia;
  className: string;
  style?: React.CSSProperties;
  playbackRate?: number;
}) {
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>("400px 0px");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPoster, setShowPoster] = useState(Boolean(item.poster));
  const [allowLoad, setAllowLoad] = useState(false);
  const { src, videoSources } = useResponsiveMedia(item);
  const sources = videoSources ?? [{ src, type: "video/mp4" }];
  const sourceKey = sources.map((source) => source.src).join("|");

  const rate = playbackRate ?? item.videoPlaybackRate ?? 1;

  useEffect(() => {
    if (inView) setAllowLoad(true);
  }, [inView]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !allowLoad) return;
    video.load();
  }, [allowLoad, sourceKey]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");

    const play = () => {
      if (video.paused) {
        void video.play().catch(() => {});
      }
    };

    const onPlaying = () => setShowPoster(false);

    if (!inView || !allowLoad) {
      if (!inView) {
        video.pause();
        if (item.poster) setShowPoster(true);
      }
      return;
    }

    play();
    video.addEventListener("loadeddata", play);
    video.addEventListener("canplay", play);
    video.addEventListener("canplaythrough", play);
    video.addEventListener("playing", onPlaying);

    return () => {
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("canplay", play);
      video.removeEventListener("canplaythrough", play);
      video.removeEventListener("playing", onPlaying);
    };
  }, [allowLoad, inView, item.poster, rate, sourceKey]);

  return (
    <div ref={inViewRef} className="absolute inset-0">
      {item.poster && showPoster ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.poster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 z-[2] h-full w-full ${className}`}
          style={style}
        />
      ) : null}
      <video
        ref={videoRef}
        autoPlay={inView}
        loop
        muted
        playsInline
        preload={allowLoad ? "metadata" : "none"}
        poster={item.poster}
        aria-label={item.alt}
        className={`${className}${showPoster ? " opacity-0" : " opacity-100"}`}
        style={style}
      >
        {allowLoad
          ? sources.map((source) => (
              <source
                key={source.src}
                src={source.src}
                type={source.type || "video/mp4"}
              />
            ))
          : null}
      </video>
    </div>
  );
}
