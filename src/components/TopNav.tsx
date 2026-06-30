"use client";

import ThemeToggle from "@/components/ThemeToggle";
import NavLinks from "@/components/NavLinks";

const topInset =
  "max(1.125rem, calc(env(safe-area-inset-top, 0px) + 0.625rem))";

export default function TopNav() {
  return (
    <nav
      className="lg:hidden sticky top-0 z-50 grid w-full shrink-0 grid-cols-[3rem_1fr_3rem] items-center gap-2 px-4 pb-3"
      style={{
        paddingTop: topInset,
        fontFamily: "var(--font-secondary)",
        textTransform: "uppercase",
        letterSpacing: "-0.2px",
      }}
      aria-label="Site"
    >
      {/* Balances the mood toggle so links stay centered */}
      <div className="w-12" aria-hidden="true" />

      <div className="flex items-center justify-center">
        <NavLinks
          orientation="horizontal"
          linkClassName="text-[14px]"
          gapClassName="gap-5"
        />
      </div>

      <div className="flex items-center justify-end">
        <ThemeToggle />
      </div>
    </nav>
  );
}
