"use client";

import Image from "next/image";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";
import ThemeToggle from "@/components/ThemeToggle";

const verticalBase: React.CSSProperties = {
  writingMode: "vertical-rl",
  transform: "rotate(180deg)",
  fontFamily: "var(--font-secondary)",
  letterSpacing: "-0.2px",
  textTransform: "uppercase",
  userSelect: "none",
};

export default function SideNav() {
  return (
    <aside
      className="relative z-[3] hidden lg:flex flex-none flex-col items-center pt-4 sm:pt-[18px] md:pt-5 lg:pt-[21px] xl:pt-[23px]"
      style={{
        width: "var(--sidebar-w)",
        position: "sticky",
        top: 5,
        marginTop: 5,
        alignSelf: "stretch",
      }}
    >
      <div className="flex flex-col items-center gap-6 mb-[5px]">
        {/* Brand logo */}
        <Link href="/" aria-label="Home" className="block shrink-0">
          <div
            style={{
              width: "var(--sidebar-w)",
              height: "var(--logo-length)",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Image
              src="/horizontal-logo.svg"
              alt="Mohsen Alattar"
              width={1485}
              height={161}
              unoptimized
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: "var(--logo-length)",
                height: "auto",
                maxWidth: "none",
                transform: "translate(-50%, -50%) rotate(-90deg)",
              }}
            />
          </div>
        </Link>

        <NavLinks
          orientation="vertical"
          linkClassName="text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] xl:text-[21px]"
          linkStyle={verticalBase}
          gapClassName="gap-6"
        />

        <ThemeToggle
          variant="vertical"
          className="text-[18px] sm:text-[19px] md:text-[20px] lg:text-[21px] xl:text-[23px]"
        />
      </div>
    </aside>
  );
}
