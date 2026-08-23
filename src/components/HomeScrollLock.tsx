"use client";

import { useEffect } from "react";

/** Locks document scroll on the homepage so the one-screen layout doesn't bounce. */
export default function HomeScrollLock() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("home-lock");
    return () => {
      root.classList.remove("home-lock");
    };
  }, []);

  return null;
}
