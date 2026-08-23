import Image from "next/image";
import Footer from "@/components/Footer";
import AnimatedTitle from "@/components/AnimatedTitle";
import OceanWave from "@/components/OceanWave";
import MobileFloatWords from "@/components/MobileFloatWords";
import HomeScrollLock from "@/components/HomeScrollLock";

export default function Home() {
  return (
    <div className="home-page relative flex flex-col flex-1 min-h-0 w-full">
      <HomeScrollLock />
      <MobileFloatWords />

      {/* Hero — desktop / iPad landscape only (>= lg). ocean_wave sketch, 1900×704 frame. */}
      <OceanWave />

      {/* Spacer above the name block. On desktop this sits between the hero and the name. On phone/tablet-portrait the smaller flex ratio nudges the typographic stack upward. */}
      <div className="flex-1 min-h-[4px] max-lg:flex-[0.55_1_0%]" />

      {/* Name block */}
      <div className="selection-invert relative z-[2] flex-none px-3 pb-0 lg:pb-1 flex flex-col items-center lg:items-start max-lg:-translate-y-3 max-lg:mb-10 select-text">
        <AnimatedTitle />
        <h1
          className="select-text text-center lg:text-left lg:-ml-[0.025em] text-[60px] sm:text-[90px] md:text-[132px] lg:text-[165px] xl:text-[200px] 2xl:text-[200px]"
          style={{
            fontFamily:
              "Impact, 'Haettenschweiler', 'Arial Narrow Bold', sans-serif",
            fontWeight: 400,
            letterSpacing: "-0.03em",
            color: "rgba(255, 0, 0, 1)",
            lineHeight: 0.85,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          <span className="block xl:inline">MOHSEN</span>{" "}
          <span className="block xl:inline">ALATTAR</span>
        </h1>
      </div>

      {/* Circle logo — visible below lg (phone + iPad portrait), sits between the name stack and the footer */}
      <div className="lg:hidden flex justify-center px-3 max-lg:mt-2 max-lg:pb-8">
        <Image
          src="/circle-logo.svg"
          alt="Mohsen Alattar stamp logo"
          width={400}
          height={400}
          unoptimized
          className="opacity-90 mt-[55px] mb-[55px] max-lg:translate-y-[100px] w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[180px] md:h-[180px]"
        />
      </div>

      {/* Bottom spacer — only on phone / iPad portrait. Larger flex ratio pushes the circle logo down toward the footer. */}
      <div className="flex-1 min-h-[4px] lg:hidden max-lg:flex-[1.45_1_0%]" />

      <Footer />
    </div>
  );
}
