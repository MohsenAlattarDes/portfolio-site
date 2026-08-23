"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { themeChromeColor, themeCookieValue, type Theme } from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_TRANSITION_MS = 380;
const MODE_WIPE_COVER_MS = 260;
const MODE_WIPE_REVEAL_MS = 420;

type ModeWipePhase = "idle" | "covering" | "revealing";

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

function readDomTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // private browsing
  }

  return null;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setThemeColor(color: string) {
  let themeMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeMeta) {
    themeMeta = document.createElement("meta");
    themeMeta.setAttribute("name", "theme-color");
    document.head.appendChild(themeMeta);
  }
  themeMeta.setAttribute("content", color);
}

function applyChromeColor(color: string) {
  document.documentElement.style.backgroundColor = color;
  document.body.style.backgroundColor = color;
  setThemeColor(color);
}

function syncChromeToTheme(theme: Theme) {
  applyChromeColor(themeChromeColor(theme));
}

function commitTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }

  root.style.colorScheme = theme;
  document.cookie = themeCookieValue(theme);
  syncChromeToTheme(theme);

  try {
    localStorage.setItem("theme", theme);
  } catch {
    // private browsing
  }
}

function applyTheme(theme: Theme, animate = false) {
  const root = document.documentElement;
  const motionOk = animate && !prefersReducedMotion();

  if (motionOk) {
    root.classList.add("theme-fallback-transition");
    void root.offsetWidth;
  }

  commitTheme(theme);

  if (motionOk) {
    window.setTimeout(() => {
      root.classList.remove("theme-fallback-transition");
    }, THEME_TRANSITION_MS);
  }
}

export default function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme: Theme;
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [wipePhase, setWipePhase] = useState<ModeWipePhase>("idle");
  const [wipeTarget, setWipeTarget] = useState<Theme>(initialTheme);
  const coverTimer = useRef<number | null>(null);
  const revealTimer = useRef<number | null>(null);

  useEffect(() => {
    const stored = readStoredTheme();
    const resolved = stored ?? readDomTheme();

    if (resolved !== readDomTheme()) {
      applyTheme(resolved);
    } else {
      commitTheme(resolved);
    }

    setTheme(resolved);
  }, []);

  useEffect(() => {
    return () => {
      if (coverTimer.current) clearTimeout(coverTimer.current);
      if (revealTimer.current) clearTimeout(revealTimer.current);
    };
  }, []);

  const toggle = useCallback(() => {
    if (wipePhase !== "idle") return;

    const next: Theme = readDomTheme() === "dark" ? "light" : "dark";
    if (prefersReducedMotion()) {
      applyTheme(next);
      setTheme(next);
      return;
    }

    setWipeTarget(next);
    setWipePhase("covering");
    applyChromeColor("#ff0000");

    coverTimer.current = window.setTimeout(() => {
      applyTheme(next);
      setTheme(next);
      applyChromeColor("#ff0000");
      setWipePhase("revealing");

      revealTimer.current = window.setTimeout(() => {
        setWipePhase("idle");
        syncChromeToTheme(next);
      }, MODE_WIPE_REVEAL_MS);
    }, MODE_WIPE_COVER_MS);
  }, [wipePhase]);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
      <div
        className={`theme-mode-wipe theme-mode-wipe--${wipePhase} theme-mode-wipe--to-${wipeTarget}`}
        aria-hidden="true"
      >
        <div className="theme-mode-wipe__panel">
          <span className="theme-mode-wipe__label">{wipeTarget}</span>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
