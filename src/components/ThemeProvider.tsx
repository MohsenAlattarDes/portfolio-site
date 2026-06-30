"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { themeCookieValue, type Theme } from "@/lib/theme";

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_TRANSITION_MS = 380;

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

function commitTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }

  root.style.colorScheme = theme;
  document.cookie = themeCookieValue(theme);

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

  const toggle = useCallback(() => {
    const next: Theme = readDomTheme() === "dark" ? "light" : "dark";
    applyTheme(next, true);
    setTheme(next);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}
