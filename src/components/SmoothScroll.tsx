"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { resetSmoothScroll, setLenis } from "@/lib/smooth-scroll";

const DESKTOP_MQ = "(min-width: 62rem)";

function shouldPrevent(node: HTMLElement) {
  return Boolean(
    node.closest("[data-lenis-prevent]") ||
      node.closest(".work-case-lightbox") ||
      node.closest(".work-case-code-window__body"),
  );
}

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") return;

    const desktop = window.matchMedia(DESKTOP_MQ);
    let lenis: Lenis | null = null;

    const setup = () => {
      const wrapper = document.querySelector<HTMLElement>(".site-main");
      if (!wrapper || !desktop.matches) return;

      lenis = new Lenis({
        wrapper,
        content: wrapper,
        eventsTarget: wrapper,
        autoRaf: true,
        autoResize: true,
        lerp: 0.08,
        wheelMultiplier: 0.78,
        touchMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
        overscroll: false,
        allowNestedScroll: true,
        anchors: true,
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
        prevent: shouldPrevent,
      });

      setLenis(lenis);
      document.documentElement.classList.add("has-smooth-scroll");
      resetSmoothScroll();
    };

    const teardown = () => {
      document.documentElement.classList.remove("has-smooth-scroll");
      setLenis(null);
      lenis?.destroy();
      lenis = null;
    };

    const onBreakpoint = () => {
      teardown();
      setup();
    };

    setup();
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      desktop.removeEventListener("change", onBreakpoint);
      teardown();
    };
  }, [pathname]);

  return null;
}
