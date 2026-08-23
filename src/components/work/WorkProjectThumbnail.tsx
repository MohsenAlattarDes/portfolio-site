"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  hasProjectThumbnail,
  isVideoThumbnail,
  type WorkProject,
} from "@/lib/work/projects";

function isSlideVideo(src: string) {
  return isVideoThumbnail(src);
}

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
  const slideVideoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const hasPoster = Boolean(project.thumbnailPoster);
  const [showPoster, setShowPoster] = useState(hasPoster);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const slides = project.thumbnailSlides;
    if (!slides || slides.length < 2 || !playing) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Video slides advance when the clip ends; stills use the interval.
    if (isSlideVideo(slides[slideIndex] ?? "")) return;

    const id = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length);
    }, project.thumbnailSlideIntervalMs ?? 3200);

    return () => window.clearInterval(id);
  }, [
    playing,
    project.thumbnailSlideIntervalMs,
    project.thumbnailSlides,
    slideIndex,
  ]);

  useEffect(() => {
    const slides = project.thumbnailSlides;
    if (!slides?.length) return;

    slideVideoRefs.current.forEach((video, index) => {
      if (!video) return;
      if (index === slideIndex && playing) {
        if (video.paused || video.ended) {
          try {
            video.currentTime = 0;
          } catch {
            /* ignore seek before metadata */
          }
          void video.play().catch(() => {});
        }
      } else {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {
          /* ignore */
        }
      }
    });
  }, [playing, project.thumbnailSlides, slideIndex]);

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
    }

    return () => {
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onStall);
      video.removeEventListener("error", onStall);
    };
  }, [hasPoster, playing]);

  const posterVisible = hasPoster && (!playing || showPoster);

  if (!hasProjectThumbnail(project.thumbnail)) return null;

  if (project.thumbnailSlides?.length) {
    const slides = project.thumbnailSlides;
    return (
      <div className="work-thumbnail-cycle">
        {slides.map((src, index) => {
          const active = index === slideIndex;
          if (isSlideVideo(src)) {
            return (
              <video
                key={src}
                ref={(node) => {
                  slideVideoRefs.current[index] = node;
                }}
                muted
                playsInline
                preload={active || index === 0 ? "auto" : "metadata"}
                aria-label={active ? alt : undefined}
                aria-hidden={active ? undefined : true}
                className={`work-thumbnail-cycle__slide${active ? " is-active" : ""}`}
                style={{
                  objectPosition: project.thumbnailObjectPosition ?? "center",
                }}
                onEnded={() => {
                  if (!playing) return;
                  setSlideIndex((current) => (current + 1) % slides.length);
                }}
              >
                <source
                  src={src}
                  type={
                    src.endsWith(".webm")
                      ? "video/webm"
                      : src.endsWith(".mov")
                        ? "video/quicktime"
                        : "video/mp4"
                  }
                />
              </video>
            );
          }

          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt={active ? alt : ""}
              aria-hidden={active ? undefined : true}
              className={`work-thumbnail-cycle__slide${active ? " is-active" : ""}`}
              decoding="async"
              loading={index === 0 && priority ? "eager" : "lazy"}
              draggable={false}
              style={{
                objectPosition: project.thumbnailObjectPosition ?? "center",
              }}
            />
          );
        })}
      </div>
    );
  }

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
            className={`absolute inset-0 z-[2] h-full w-full ${fitClass}${posterVisible ? " opacity-100" : " opacity-0"}`}
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
    const zoom = project.thumbnailPanZoom ?? 1;
    const zoomed = zoom > 1;
    return (
      <div className="work-thumbnail-pan-frame" aria-hidden={alt ? undefined : true}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={project.thumbnail}
          alt={alt}
          className={`work-thumbnail-pan-media${zoomed ? " is-zoomed" : ""}`}
          decoding="async"
          loading={priority ? "eager" : "lazy"}
          style={{
            animationPlayState: playing ? "running" : "paused",
            ...(zoomed
              ? ({ "--thumb-pan-zoom": String(zoom) } as CSSProperties)
              : {}),
          }}
        />
      </div>
    );
  }

  const imageClassName = project.thumbnailObjectPosition
    ? "object-cover"
    : className;

  return (
    <Image
      src={project.thumbnail}
      alt={alt}
      fill
      unoptimized
      className={imageClassName}
      sizes={sizes}
      priority={priority}
      style={
        project.thumbnailObjectPosition
          ? { objectPosition: project.thumbnailObjectPosition }
          : undefined
      }
    />
  );
}
