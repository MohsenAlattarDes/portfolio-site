"use client";

import { useEffect, useRef, useState } from "react";
import type { ProjectMedia } from "@/lib/work/types";
import { useInView } from "@/lib/useInView";
import { useResponsiveMedia } from "@/lib/useResponsiveMedia";

export default function CaseStudyLoopVideo({
  item,
  className,
  style,
}: {
  item: ProjectMedia;
  className: string;
  style?: React.CSSProperties;
}) {
  const { ref: inViewRef, inView } = useInView<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPoster, setShowPoster] = useState(Boolean(item.poster));
  const { src, videoSources } = useResponsiveMedia(item);
  const sources = videoSources ?? [{ src, type: "video/mp4" }];
  const sourceKey = sources.map((source) => source.src).join("|");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = item.videoPlaybackRate ?? 1;
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
      if (item.poster) setShowPoster(true);
      return;
    }

    video.preload = "auto";
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
  }, [inView, item.poster, item.videoPlaybackRate, sourceKey]);

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
        preload="metadata"
        poster={item.poster}
        aria-label={item.alt}
        className={`${className}${showPoster ? " opacity-0" : " opacity-100"}`}
        style={style}
      >
        {sources.map((source) => (
          <source
            key={source.src}
            src={source.src}
            type={source.type || "video/mp4"}
          />
        ))}
      </video>
    </div>
  );
}
