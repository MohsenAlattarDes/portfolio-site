import CodesExperiments from "@/components/CodesExperiments";

export default function CodesPage() {
  return (
    <section className="flex-1 min-h-0 flex flex-col px-5 md:px-12 lg:px-20 pt-10 md:pt-16 pb-20">
      <p className="text-[13px] font-semibold tracking-widest text-[var(--fg-muted)] uppercase mb-3">
        Experiments
      </p>
      <h1
        className="text-[40px] sm:text-[42px] md:text-[62px] lg:text-[77px] xl:text-[96px] font-black uppercase leading-none text-[var(--red)] mb-4"
        style={{
          fontFamily:
            "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
        }}
      >
        CODES
      </h1>
      <p className="text-[var(--fg-subtle)] text-base md:text-lg leading-relaxed max-w-2xl mb-10 md:mb-14">
        Mouse-driven sketches that fill the frame — dense type fields, flowing
        lines, and full-bleed surfaces. Move through each canvas to warp the
        whole space.
      </p>

      <CodesExperiments />
    </section>
  );
}
