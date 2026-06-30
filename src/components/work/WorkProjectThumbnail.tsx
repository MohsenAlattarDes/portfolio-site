"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (playing) {
      void video.play().catch(() => {});
      return;
    }

    video.pause();
  }, [playing]);

  if (!hasProjectThumbnail(project.thumbnail)) return null;

  if (isVideoThumbnail(project.thumbnail)) {
    const sources = project.thumbnailVideoSources ?? [
      { src: project.thumbnail, type: "" },
    ];

    return (
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload={playing ? "auto" : "metadata"}
        aria-label={alt}
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
