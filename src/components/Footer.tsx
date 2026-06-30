import Image from "next/image";
import Link from "next/link";
import FooterTimes from "@/components/FooterTimes";

export default function Footer() {
  return (
    <footer className="relative z-[2] flex-none select-text">
      <div
        data-footer-spacer
        aria-hidden="true"
        style={{
          paddingTop: "12px",
          paddingBottom: "12px",
          flexShrink: 0,
        }}
      />
      <div
        data-footer-line
        style={{ borderTop: "1px solid var(--red)" }}
      />
      <div
        data-footer-content
        className="flex items-center justify-center lg:justify-start gap-3 sm:gap-4 md:gap-6 lg:gap-8 px-3 sm:px-4 flex-wrap"
        style={{ paddingTop: "12px", paddingBottom: "12px" }}
      >
        {/* Stamp logo + brand — hidden on phone/tablet-portrait, where the big circle logo above takes its place */}
        <div className="selection-invert hidden lg:flex items-center gap-2">
          <Image
            src="/circle-logo.svg"
            alt="Mohsen Alattar stamp logo"
            width={90}
            height={90}
            unoptimized
            className="opacity-90 w-[50px] h-[50px] sm:w-[60px] sm:h-[60px] md:w-[70px] md:h-[70px] lg:w-[80px] lg:h-[80px] xl:w-[90px] xl:h-[90px]"
            style={{ paddingLeft: "0px" }}
          />
          <span
            className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[22px] pl-2 sm:pl-3 md:pl-4 lg:pl-[18px]"
            style={{
              fontFamily:
                "Impact, 'Haettenschweiler', 'Arial Narrow Bold', sans-serif",
              fontWeight: "bold",
              letterSpacing: "0em",
              lineHeight: "13px",
              color: "var(--red)",
              textTransform: "uppercase",
            }}
          >
            MOHSEN ALATTAR©
          </span>
        </div>

        {/* Copyright */}
        <p
          className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-[11px] xl:text-[12px]"
          style={{
            fontFamily: "var(--font-secondary)",
            color: "var(--fg-faint)",
            letterSpacing: "0.06em",
          }}
        >
          2026 All rights reserved. Designed and developed by Mohsen Alattar.
        </p>

        {/* Social links */}
        <div className="selection-invert flex items-center gap-2 sm:gap-3 md:gap-4">
          {[
            { label: "INSTAGRAM", href: "https://www.instagram.com" },
            { label: "LINKEDIN", href: "https://www.linkedin.com" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] sm:text-[10px] md:text-[11px] lg:text-[11px] xl:text-[12px]"
              style={{
                fontFamily: "var(--font-secondary)",
                fontWeight: "normal",
                letterSpacing: "0.12em",
                color: "var(--red)",
                textTransform: "uppercase",
                textDecoration: "underline",
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        <FooterTimes />
      </div>
    </footer>
  );
}
