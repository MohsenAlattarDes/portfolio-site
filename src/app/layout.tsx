import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import RedSquareCursor from "@/components/RedSquareCursor";
import LoadingScreen from "@/components/LoadingScreen";
import SideNav from "@/components/SideNav";
import ThemeProvider from "@/components/ThemeProvider";
import TopNav from "@/components/TopNav";
import { parseTheme, THEME_COOKIE, type Theme } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Mohsen Alattar — Graphic Designer",
  description: "Portfolio of Mohsen Alattar — Designer and Strategist.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const initialTheme: Theme =
    parseTheme(cookieStore.get(THEME_COOKIE)?.value) ?? "dark";

  return (
    <html
      lang="en"
      data-theme={initialTheme === "light" ? "light" : undefined}
      style={{
        colorScheme: initialTheme === "light" ? "light" : "dark",
      }}
      suppressHydrationWarning
    >
      <body className="h-dvh flex overflow-x-hidden bg-[var(--bg)] text-[var(--fg)]">
        <ThemeProvider initialTheme={initialTheme}>
          <LoadingScreen />
          <SideNav />
          <div className="relative z-[2] flex-1 min-w-0 min-h-0 flex flex-col overflow-x-hidden overflow-y-auto text-[var(--fg)] select-text">
            <TopNav />
            {children}
          </div>
          <RedSquareCursor />
        </ThemeProvider>
      </body>
    </html>
  );
}
