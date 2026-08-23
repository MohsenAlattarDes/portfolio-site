import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import RedSquareCursor from "@/components/RedSquareCursor";
import LoadingScreen from "@/components/LoadingScreen";
import NavigationProgress from "@/components/NavigationProgress";
import SideNav from "@/components/SideNav";
import ThemeProvider from "@/components/ThemeProvider";
import TopNav from "@/components/TopNav";
import { parseTheme, THEME_COOKIE, themeChromeColor, type Theme } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Mohsen Alattar — Graphic Designer",
  description: "Portfolio of Mohsen Alattar — Designer and Strategist.",
  appleWebApp: {
    statusBarStyle: "black-translucent",
  },
};

export async function generateViewport(): Promise<Viewport> {
  const cookieStore = await cookies();
  const theme: Theme =
    parseTheme(cookieStore.get(THEME_COOKIE)?.value) ?? "light";

  return {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: themeChromeColor(theme),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const initialTheme: Theme =
    parseTheme(cookieStore.get(THEME_COOKIE)?.value) ?? "light";
  const chrome = themeChromeColor(initialTheme);

  return (
    <html
      lang="en"
      data-theme={initialTheme === "light" ? "light" : undefined}
      style={{
        colorScheme: initialTheme === "light" ? "light" : "dark",
        backgroundColor: chrome,
      }}
      suppressHydrationWarning
    >
      <body
        className="site-body flex overflow-x-hidden bg-[var(--bg)] text-[var(--fg)]"
        style={{ backgroundColor: chrome }}
      >
        <ThemeProvider initialTheme={initialTheme}>
          <LoadingScreen />
          <NavigationProgress />
          <SideNav />
          <div className="site-main relative z-[2] flex-1 min-w-0 flex flex-col text-[var(--fg)] select-text">
            <TopNav />
            <div className="site-top-nav-spacer lg:hidden" aria-hidden="true" />
            {children}
          </div>
          <RedSquareCursor />
        </ThemeProvider>
      </body>
    </html>
  );
}
