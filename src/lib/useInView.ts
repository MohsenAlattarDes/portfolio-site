"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends Element>(
  rootMargin = "120px 0px",
  threshold = 0.15,
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const scrollRoot = document.querySelector<HTMLElement>(".site-main");
    const root =
      scrollRoot &&
      scrollRoot.contains(node) &&
      scrollRoot.scrollHeight > scrollRoot.clientHeight
        ? scrollRoot
        : null;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root, rootMargin, threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return { ref, inView };
}
