import type { ProjectCaseStudy } from "@/lib/work/types";

export const anoraCaseStudy: ProjectCaseStudy = {
  slug: "anora",
  intro: {
    heading: "ABOUT THE PROJECT",
    paragraphs: [
      "Anora is a contemporary readable blackletter inspired by the Rotunda script.",
      "The project explores how blackletter can move beyond its historical and ornamental associations to become a functional typeface for contemporary use.",
      "By balancing calligraphic rhythm with refined proportions, Anora preserves the character of traditional blackletter while improving readability for modern applications.",
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
            [
              "The project began with researching the history and evolution of blackletter through references such as ",
              {
                text: "Fraktur Mon Amour",
                href: "https://www.amazon.com/Fraktur-Mon-Amour-Judith-Schalansky/dp/156898801X",
              },
              " and ",
              {
                text: "Blackletter: Type and National Identity",
                href: "https://www.amazon.com/Blackletter-National-Identity-Shaw-Bain/dp/1568981252",
              },
              ". This research focused on understanding the cultural context and structural principles behind the script. I visited ",
              {
                text: "HMCT",
                href: "https://hmctartcenter.org/",
              },
              " to conduct this research and locate the reference books in their archive.",
            ],
            "From there, the design developed through sketching and analyzing the underlying construction of blackletter, refining anatomy, proportions, rhythm, and spacing through multiple iterations until arriving at a cohesive and readable typeface.",
          ],
          media: [],
          preserveMediaColumn: true,
        },
      ],
    },
    {
      id: "specimen-book-posters",
      heading: "SPECIMEN BOOK & POSTERS",
      blocks: [
        {
          paragraphs: [
            "As part of the Anora project, I designed a series of six 24 × 36 inch posters to see how the typeface performs outside of a traditional specimen. Each poster uses a different composition and short pieces of writing to give the typeface a distinct presence while also serving as promotional material.",
            "The project is accompanied by a newspaper-format specimen book that expands on the same visual language established by the posters. Rather than existing as a separate publication, the book continues the series through larger editorial compositions, with many of its spreads designed to stand on their own as smaller posters.",
          ],
          media: [],
          preserveMediaColumn: true,
        },
      ],
    },
  ],
};
