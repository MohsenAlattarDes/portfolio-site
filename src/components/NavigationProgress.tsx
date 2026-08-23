"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

function isInternalNavLink(anchor: HTMLAnchorElement) {
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (
      url.pathname === window.location.pathname &&
      url.search === window.location.search
    ) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Instant feedback while App Router fetches the next route — without this,
 * slow Netlify navigations feel like the click did nothing.
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [pending, setPending] = useState(false);
  const safetyTimer = useRef<number | null>(null);

  useEffect(() => {
    setPending(false);
    if (safetyTimer.current) {
      window.clearTimeout(safetyTimer.current);
      safetyTimer.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalNavLink(anchor)) return;

      setPending(true);
      if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
      // Clear if navigation is cancelled / stuck.
      safetyTimer.current = window.setTimeout(() => setPending(false), 8000);
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      if (safetyTimer.current) window.clearTimeout(safetyTimer.current);
    };
  }, []);

  return (
    <div
      className={`nav-progress${pending ? " is-pending" : ""}`}
      aria-hidden
    />
  );
}
