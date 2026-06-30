"use client";

import { useRef, type CSSProperties } from "react";
import { useTheme } from "@/components/ThemeProvider";

const verticalStyle: CSSProperties = {
  writingMode: "vertical-rl",
  transform: "rotate(180deg)",
};

type ThemeToggleProps = {
  variant?: "default" | "vertical";
  className?: string;
};

export default function ThemeToggle({
  variant = "default",
  className = "",
}: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const lastTap = useRef(0);
  const switchHint =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  const handleToggle = () => {
    const now = Date.now();
    if (now - lastTap.current < 350) return;
    lastTap.current = now;
    toggle();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={switchHint}
      title={switchHint}
      aria-pressed={theme === "light"}
      className={`relative shrink-0 inline-flex items-center justify-center border-0 bg-transparent select-none text-[var(--red)] hover:text-[var(--hover)] active:text-[var(--hover)] active:opacity-70 ${
        variant === "default"
          ? "min-h-12 min-w-12 cursor-pointer touch-manipulation p-3 leading-none text-[20px]"
          : "p-0 leading-none"
      } ${className}`}
      style={{
        fontFamily: "var(--font-secondary)",
        WebkitTapHighlightColor: "rgba(255,255,255,0.15)",
        ...(variant === "vertical" ? verticalStyle : undefined),
      }}
    >
      ◐
    </button>
  );
}
