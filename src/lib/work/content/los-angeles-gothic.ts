import type { ProjectCaseStudy } from "@/lib/work/types";

export const losAngelesGothicCaseStudy: ProjectCaseStudy = {
  slug: "los-angeles-gothic",
  hero: {
    src: "/work/los-angeles-gothic/lag-hero.mp4",
    alt: "Los Angeles Gothic hero animation",
    caption: "",
    aspectRatio: "16 / 9",
    bare: true,
    kind: "video",
    videoSources: [
      {
        src: "/work/los-angeles-gothic/lag-hero.mp4",
        type: "video/mp4",
      },
      {
        src: "/work/los-angeles-gothic/lag-hero.webm",
        type: "video/webm",
      },
    ],
  },
  intro: {
    heading: "ABOUT THE PROJECT",
    paragraphs: [
      "This project explores how a typographic voice can reflect both history and place. Los Angeles Gothic is a revival that reinterprets the American Gothic type tradition through a modern lens. The goal was to create a type system that balances the honesty and structure of early 20th-century grotesques with the diversity and rhythm of contemporary Los Angeles.",
    ],
    media: [],
  },
  sections: [
    {
      id: "font-process",
      heading: "FONT PROCESS",
      blocks: [
        {
          paragraphs: [
            "The process book documents the full development of Los Angeles Gothic, from research and early sketches to digital refinement and testing. Franklin Gothic served as my main reference, guiding the foundation of the design while I reinterpreted its proportions and tone to create a new visual language.",
          ],
          media: [
            {
              src: "",
              alt: "Los Angeles Gothic process book scans composited as a stop-motion stack",
              caption: "Process book scans, composited as stop-motion stack.",
              aspectRatio: "1350 / 1750",
              bare: true,
              kind: "code",
              codeSketch: "lag-process-stack",
              spacingTop: "-90px",
            },
          ],
        },
      ],
    },
    {
      id: "specimen-posters",
      heading: "SPECIMEN POSTERS",
      blocks: [
        {
          paragraphs: [
            "As part of the Los Angeles Gothic project, I created mini flyers to test how the typeface performs in real-world applications. Each flyer focuses on typographic composition, hierarchy, and scale, exploring how different weights and spacing interact in print. These small pieces were a way to experiment freely, to see how Los Angeles Gothic behaves off the grid, in motion, in texture, and in everyday use.",
            "They were also meant to be given to people as a way to promote and share the typeface, inviting them to download and interact with it, because I believe typography should feel alive when it meets people, not just exist in a specimen or on a screen.",
          ],
          media: [
            {
              src: "/work/los-angeles-gothic/red.jpg",
              alt: "Los Angeles Gothic red specimen poster",
              caption: "",
              aspectRatio: "3128 / 4068",
              bare: true,
              rotate: -3,
              maxWidth: "59%",
              align: "center",
            },
            {
              src: "/work/los-angeles-gothic/la-poster-mini11.mov",
              alt: "Los Angeles Gothic mini flyers and specimen poster",
              caption: "Mini flyers utilizing Los Angeles Gothic font.",
              aspectRatio: "6004 / 4982",
              bare: true,
              cropLeft: 2,
              rotate: -3,
              spacingTop: "2rem",
              captionSpacing: "calc(1.25rem + 10px)",
              kind: "video",
              videoSources: [
                {
                  src: "/work/los-angeles-gothic/la-poster-mini11.webm",
                  type: "video/webm",
                },
                {
                  src: "/work/los-angeles-gothic/la-poster-mini11.mov",
                  type: "video/quicktime",
                },
              ],
            },
          ],
        },
        {
          paragraphs: [
            "The specimen poster is set in German, a deliberate choice to both honor the Gothic type tradition and to test performance. German is known for its long compound words, which made it ideal for stress-testing the typeface’s rhythm, spacing, and readability. Because Los Angeles Gothic has an open structure and generous counters, setting it in German highlighted its legibility under tighter conditions. The result not only connects back to the historical roots of the Gothic genre but also demonstrates how the design adapts across language and context.",
          ],
          media: [
            {
              src: "/work/los-angeles-gothic/german-specimen-poster.jpg",
              alt: "German specimen poster for Los Angeles Gothic",
              caption: "Specimen Poster printed on a 24 x 36.",
              aspectRatio: "7200 / 10800",
              bare: true,
              paperShadow: true,
            },
          ],
        },
      ],
    },
  ],
  footerNote: "*Recognized by the HMCT Gallery.*",
};
