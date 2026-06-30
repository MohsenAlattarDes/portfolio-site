"use client";

import CodeExperiment from "@/components/CodeExperiment";
import {
  EXPERIMENTS,
  EXPERIMENT_SECTIONS,
} from "@/lib/code-sketches/registry";

export default function CodesExperiments() {
  return (
    <div className="flex flex-col gap-12 md:gap-16">
      {EXPERIMENT_SECTIONS.map((section) => {
        const items = EXPERIMENTS.filter((e) => e.section === section.id);
        if (items.length === 0) return null;

        return (
          <div key={section.id} className="flex flex-col gap-8 md:gap-10">
            <h2
              className="text-[var(--fg-muted)] text-xs md:text-sm uppercase tracking-[0.25em]"
              style={{ fontFamily: "var(--font-secondary)", fontWeight: 700 }}
            >
              {section.label}
            </h2>
            {items.map((experiment) => (
              <CodeExperiment key={experiment.id} {...experiment} />
            ))}
          </div>
        );
      })}
    </div>
  );
}
