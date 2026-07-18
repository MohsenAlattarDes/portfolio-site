"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/components/ThemeProvider";

export default function CaseStudyMediaLightbox({
  src,
  themeSrc,
  alt,
  intrinsicSize,
  children,
}: {
  src: string;
  themeSrc?: { dark: string; light: string };
  alt: string;
  intrinsicSize?: { width: number; height: number };
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const activeSrc = themeSrc
    ? theme === "light"
      ? themeSrc.light
      : themeSrc.dark
    : src;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const lightbox =
    open && mounted
      ? createPortal(
          <div
            className="work-case-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            onClick={() => setOpen(false)}
          >
            <div className="work-case-lightbox__frame">
              {intrinsicSize ? (
                <Image
                  src={activeSrc}
                  alt={alt}
                  width={intrinsicSize.width}
                  height={intrinsicSize.height}
                  unoptimized
                  className="work-case-lightbox__image"
                />
              ) : (
                <div className="work-case-lightbox__image-fill">
                  <Image
                    src={activeSrc}
                    alt={alt}
                    fill
                    unoptimized
                    className="object-contain"
                    sizes="92vw"
                  />
                </div>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        className="work-case-media-enlarge"
        aria-label={`Enlarge image: ${alt}`}
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      {lightbox}
    </>
  );
}
