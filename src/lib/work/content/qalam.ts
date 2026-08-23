import type { ProjectCaseStudy } from "@/lib/work/types";

// Override locally (.env.local) to test against a qalam.design deploy preview.
const QALAM_EMBED_URL =
  process.env.NEXT_PUBLIC_QALAM_EMBED_URL ?? "https://qalam.design/";

export const qalamCaseStudy: ProjectCaseStudy = {
  slug: "qalam",
  hero: {
    src: "/work/qalam/hero/anatomy.webp",
    alt: "Qalam thesis book mockups",
    caption: "",
    kind: "hero-cycle",
    aspectRatio: "16 / 9",
    glyphIntervalMs: 2100,
    heroSlides: [
      {
        src: "/work/qalam/hero/anatomy.webp",
        alt: "Qalam thesis book mockup — Arabic letter anatomy spread",
      },
      {
        src: "/work/qalam/hero/ibn-muqla.webp",
        alt: "Qalam thesis book mockup — Ibn Muqla spread",
      },
      {
        src: "/work/qalam/hero/laptop.webp",
        alt: "Qalam thesis book mockup — laptop with guide pages",
      },
      {
        src: "/work/qalam/hero/linotype.webp",
        alt: "Qalam thesis book mockup — Linotype history spread",
      },
      {
        src: "/work/qalam/hero/nuqta.webp",
        alt: "Qalam thesis book mockup — nuqta spread",
      },
    ],
    heroStickers: [
      {
        src: "/work/qalam/characters/salem.svg",
        alt: "Salem character illustration",
      },
      {
        src: "/work/qalam/characters/hala.svg",
        alt: "Hala character illustration",
      },
      {
        src: "/work/qalam/characters/simsim.svg?v=2",
        alt: "Simsim character illustration",
      },
    ],
  },
  intro: {
    heading: "ABOUT THE PROJECT",
    paragraphs: [
      "Growing up in Kuwait, Arabic lived on street signs, newspapers, packaging, and storefronts. Studying graphic design later made its structure clearer: direction, connections, spacing, rhythm. A system with its own logic.",
      "In the West, I kept meeting designers who wanted to work with Arabic carefully. Qalam grew out of that gap: a digital guide to Arabic type and the thinking behind it.",
    ],
    media: [
      {
        src: "/work/qalam/old-display.webp?v=2",
        alt: "Early Qalam website display",
        caption: "",
        aspectRatio: "937 / 976",
        intrinsicSize: { width: 937, height: 976 },
        maxWidth: "26.4rem",
        align: "center",
        bare: true,
        transparent: true,
        enlarge: true,
      },
    ],
  },
  sections: [
    {
      id: "the-problem",
      heading: "THE PROBLEM",
      blocks: [
        {
          paragraphs: [
            "The knowledge about Arabic typography is already out there, in books, archives, foundries, and scholarship. What’s harder to find is a way in. Most practicing designers need enough orientation to make a bilingual identity, publication, package, or interface with care.",
            "Arabic is still often approached as ornament. For more than 400 million people, it shapes everyday reading, culture, and identity. When that system is mishandled, the cost shows up in clarity, trust, and respect.",
          ],
          media: [
            {
              src: "/work/qalam/scattered-resources.webp",
              alt: "Scattered stack of Arabic typography research books and papers",
              caption:
                "A sample of the research materials behind Qalam: books, papers, and foundry references.",
              aspectRatio: "2000 / 1740",
              intrinsicSize: { width: 2000, height: 1740 },
              bare: true,
              transparent: true,
              paperShadow: true,
              enlarge: true,
            },
          ],
        },
      ],
    },
    {
      id: "process",
      heading: "PROCESS",
      blocks: [
        {
          paragraphs: [
            "The work moved from a thesis digest of early ideas, to a schoolbook-inspired encyclopedia, then a denser editorial version, and finally a character-led interactive system. Across those shifts, the same instincts held: one idea at a time, image before explanation, system before decoration.",
          ],
          media: [
            {
              src: "/work/qalam/early-publication-digest.webp",
              alt: "Thesis digest spreads exploring early ideas for Qalam",
              caption:
                "Thesis digest and early ideas: process spreads that mapped how the guide might teach.",
              aspectRatio: "2400 / 2312",
              intrinsicSize: { width: 2400, height: 2312 },
              bare: true,
              transparent: true,
              enlarge: true,
            },
          ],
        },
        {
          paragraphs: [
            "Alongside the product, a 212-page thesis book holds the research behind Qalam. It traces the history of type and of Arabic type in particular, from Gutenberg and early printing through metal, phototype, and the shift to digital fonts.",
            "From there it moves into the making of the guide: the questions that shaped it, the paths tried and set aside, and the decisions that turned research into a system designers can use.",
          ],
          media: [
            {
              src: "/work/qalam/qalam-book-spreads.mov",
              alt: "Spreads from the 212-page Qalam thesis book",
              caption: "Spreads from the 212-page thesis book on the research and process behind Qalam.",
              aspectRatio: "1400 / 1434",
              kind: "video",
              bare: true,
              transparent: true,
              paperShadow: true,
              videoSpeedControls: true,
              poster: "/work/qalam/qalam-book-spreads-poster.webp",
              videoSources: [
                {
                  src: "/work/qalam/qalam-book-spreads.mov",
                  type: "video/quicktime",
                },
                {
                  src: "/work/qalam/qalam-book-spreads.webm",
                  type: "video/webm",
                },
              ],
              mobileVideoSources: [
                {
                  src: "/work/qalam/qalam-book-spreads-mobile.mov",
                  type: "video/quicktime",
                },
                {
                  src: "/work/qalam/qalam-book-spreads-mobile.webm",
                  type: "video/webm",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "product",
      heading: "PRODUCT",
      blocks: [
        {
          paragraphs: [
            [
              "The live guide is at ",
              {
                text: "qalam.design",
                href: "https://www.qalam.design",
              },
              ". Categories lead into focused entries, related ideas, and a Play section built around noticing: recognition, comparison, observation.",
            ],
            "Entries link out to related ideas, so exploring stays non-linear rather than a straight read, and the deeper research sits one layer down — there when you want it, out of the way when you don't.",
          ],
          media: [
            {
              src: QALAM_EMBED_URL,
              embedUrl: QALAM_EMBED_URL,
              embedDisplayUrl: "https://qalam.design/",
              alt: "Live Qalam guide website",
              caption: "The live guide at qalam.design.",
              kind: "site-embed",
              bare: true,
              aspectRatio: "16 / 11",
            },
          ],
        },
      ],
    },
    {
      id: "interface-character-design",
      heading: "INTERFACE, EXPERIENCE & CHARACTER DESIGN",
      blocks: [
        {
          paragraphs: [
            "Because the audience often learns faster from images than from dense text, the interface stays visual and quiet. Soft marks, a cream ground, and generous space set the tone before any reading begins, so the material feels approachable rather than academic.",
            "Salem, Hala, and Simsim run through it as quiet guides, drawn in the spirit of vintage schoolbook illustrations. Each carries a different kind of attention: calm observation, curiosity, and a lighter sense of play. Their forms draw on Arabic visual identity, so the cast belongs to the subject rather than borrowing familiar Western illustration habits.",
          ],
          media: [
            {
              src: "/work/qalam/characters/salem-crop.svg",
              alt: "Qalam character cast",
              caption: "",
              kind: "character-cast",
              bare: true,
              transparent: true,
              castImages: [
                {
                  src: "/work/qalam/characters/salem-crop.svg",
                  alt: "Salem character illustration",
                },
                {
                  src: "/work/qalam/characters/hala-crop.svg",
                  alt: "Hala character illustration",
                },
                {
                  src: "/work/qalam/characters/simsim-crop.svg",
                  alt: "Simsim character illustration",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "outcome",
      heading: "OUTCOME",
      blocks: [
        {
          paragraphs: [
            "The result is Qalam: a live guide, a 212-page thesis book, and a cast of characters that together turn scattered knowledge into something a designer can move through. Success looks like leaving more sure of what to notice, and able to meet Arabic on its own terms.",
          ],
          media: [
            {
              src: "/work/qalam/interface/logo-qalam-sticker.svg?v=3",
              alt: "Qalam logo",
              caption: "",
              intrinsicSize: { width: 360, height: 207 },
              maxWidth: "22.5rem",
              align: "center",
              bare: true,
              transparent: true,
            },
          ],
        },
      ],
    },
  ],
};
