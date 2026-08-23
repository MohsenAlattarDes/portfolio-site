export type Theme = "dark" | "light";

export const THEME_COOKIE = "theme";
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function parseTheme(value: string | undefined | null): Theme | null {
  if (value === "light" || value === "dark") return value;
  return null;
}

export function themeCookieValue(theme: Theme) {
  return `${THEME_COOKIE}=${theme}; path=/; max-age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
}

/** Solid Safari status-bar / overscroll color — must match page bg or iPhone shows a top border. */
export function themeChromeColor(theme: Theme) {
  return theme === "light" ? "#ffffff" : "#000000";
}

