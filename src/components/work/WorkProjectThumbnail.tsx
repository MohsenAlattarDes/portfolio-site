"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  hasProjectThumbnail,
  isVideoThumbnail,
  type WorkProject,
} from "@/lib/work/projects";

export default function WorkProjectThumbnail({
  project,
  alt,
  className = "object-contain object-bottom",
  sizes,
  priority = false,
  playing = true,
}: {
  project: WorkProject;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  playing?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasPoster = Boolean(project.thumbnailPoster);
  const [showPoster, setShowPoster] = useState(hasPoster);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlaying = () => setShowPoster(false);
    const onStall = () => {
      if (hasPoster) setShowPoster(true);
    };

    if (playing) {
      video.preload = "auto";
      if (video.readyState === 0) {
        video.load();
      }
      void video.play().catch(onStall);
      video.addEventListener("playing", onPlaying);
      video.addEventListener("waiting", onStall);
      video.addEventListener("error", onStall);
    } else {
      video.pause();
      if (hasPoster) setShowPoster(true);
    }

    return () => {
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onStall);
      video.removeEventListener("error", onStall);
    };
  }, [hasPoster, playing]);

  if (!hasProjectThumbnail(project.thumbnail)) return null;

  if (isVideoThumbnail(project.thumbnail)) {
    const sources = project.thumbnailVideoSources ?? [
      { src: project.thumbnail, type: "" },
    ];
    const fitClass = project.thumbnailTransparent
      ? "object-contain object-center"
      : "object-cover object-center";

    return (
      <>
        {hasPoster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnailPoster}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 z-[2] h-full w-full ${fitClass}${showPoster ? " opacity-100" : " opacity-0"}`}
          />
        ) : null}
        <video
          ref={videoRef}
          loop
          muted
          playsInline
          preload="metadata"
          poster={project.thumbnailPoster}
          aria-label={alt}
          className={`absolute inset-0 z-[1] h-full w-full ${fitClass}`}
        >
          {sources.map((source) => (
            <source
              key={source.src}
              src={source.src}
              type={source.type || undefined}
            />
          ))}
        </video>
      </>
    );
  }

  if (project.thumbnailMotion === "pan-x") {
    return (
      <div className="work-thumbnail-pan-frame" aria-hidden={alt ? undefined : true}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.thumbnail}
          alt={alt}
          className="work-thumbnail-pan-media"
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          style={{ animationPlayState: playing ? "running" : "paused" }}
        />
      </div>
    );
  }

  return (
    <Image
      src={project.thumbnail}
      alt={alt}
      fill
      unoptimized
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
