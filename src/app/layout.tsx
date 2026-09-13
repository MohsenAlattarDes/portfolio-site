import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import JsonLd from "@/components/JsonLd";
import RedSquareCursor from "@/components/RedSquareCursor";
import LoadingScreen from "@/components/LoadingScreen";
import NavigationProgress from "@/components/NavigationProgress";
import SmoothScroll from "@/components/SmoothScroll";
import SideNav from "@/components/SideNav";
import ThemeProvider from "@/components/ThemeProvider";
import TopNav from "@/components/TopNav";
import { parseTheme, THEME_COOKIE, themeChromeColor, type Theme } from "@/lib/theme";
import {
  personJsonLd,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  LEGAL_NAME,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME} (Abdulmuhsin Alattar)`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [
    { name: SITE_NAME, url: SITE_URL },
    { name: LEGAL_NAME, url: SITE_URL },
  ],
  creator: `${SITE_NAME}, ${LEGAL_NAME}`,
  publisher: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  appleWebApp: {
    statusBarStyle: "black-translucent",
  },
  robots: {
    index: true,
    follow: true,
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
          <JsonLd data={personJsonLd()} />
          <LoadingScreen />
          <SmoothScroll />
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
