import type { Metadata } from "next";
import Footer from "@/components/Footer";
import AboutContent from "@/components/AboutContent";
import { ABOUT_DESCRIPTION, routeMetadata } from "@/lib/seo";

export const metadata: Metadata = routeMetadata({
  title: "About",
  description: ABOUT_DESCRIPTION,
  path: "/about",
});

export default function About() {
  return (
    <div className="about-page flex w-full flex-1 flex-col">
      <AboutContent />
      <Footer />
    </div>
  );
}
