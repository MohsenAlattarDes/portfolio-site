import type { ProjectCaseStudy } from "@/lib/work/types";

export const anoraCaseStudy: ProjectCaseStudy = {
  slug: "anora",
  hero: {
    src: "/work/anora/anora_comp_3.apng",
    alt: "Anora newspaper specimen composition animation",
    caption: "",
    aspectRatio: "3612 / 1850",
    bare: true,
    transparent: true,
    kind: "image",
    poster: "/work/anora/anora_comp_3-poster.png",
    mobileVideoSources: [
      {
        src: "/work/anora/anora_comp_3-alpha.mov",
        type: "video/quicktime",
      },
      {
        src: "/work/anora/anora_comp_3.webm",
        type: "video/webm",
      },
    ],
  },
  intro: {
    heading: "ABOUT THE PROJECT",
    paragraphs: [
      "Anora is a contemporary readable blackletter inspired by the Rotunda script.",
      "The project explores how blackletter can move beyond its historical and ornamental associations to become a functional typeface for contemporary use.",
      "By balancing calligraphic rhythm with refined proportions, Anora preserves the character of traditional blackletter while improving readability for modern applications.",
    ],
    media: [
      {
        src: "",
        alt: "Anora typeface glyph cycle",
        caption: "",
        kind: "glyph-cycle",
        glyphExclude: ["H", "Y", "J", "h", "y", "j"],
        glyphIntervalMs: 1800,
      },
    ],
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
          media: [
            {
              src: "",
              alt: "Anora process book scans composited as a stop-motion stack",
              caption: "Process book scans, composited as stop-motion stack.",
              aspectRatio: "1350 / 1750",
              bare: true,
              kind: "code",
              codeSketch: "anora-process-stack",
              spacingTop: "-30px",
            },
          ],
        },
        {
          paragraphs: [],
          mediaLayout: "row",
          media: [
            {
              src: "/work/anora/process-fraktur-reference.png",
              alt: "Fraktur Mon Amour reference book from HMCT archive",
              caption: "",
              aspectRatio: "767 / 1024",
              intrinsicSize: { width: 767, height: 1024 },
              bare: true,
              enlarge: true,
            },
            {
              src: "/work/anora/process-blackletter-sheets.png",
              alt: "Early blackletter typeface development sheets with red markup",
              caption: "",
              aspectRatio: "768 / 1024",
              intrinsicSize: { width: 768, height: 1024 },
              bare: true,
              enlarge: true,
            },
            {
              src: "/work/anora/process-digital-testing.png",
              alt: "Early digital typeface testing on screen with sculptural reference book",
              caption: "",
              aspectRatio: "768 / 1024",
              intrinsicSize: { width: 768, height: 1024 },
              bare: true,
              enlarge: true,
            },
            {
              src: "/work/anora/posters-wall.jpg",
              alt: "Six Anora posters installed on a wall",
              caption: "",
              aspectRatio: "768 / 1024",
              intrinsicSize: { width: 768, height: 1024 },
              bare: true,
              enlarge: true,
            },
            {
              src: "/work/anora/process-calligraphy-sketches.png",
              alt: "Hand-drawn blackletter calligraphy sketches in a process notebook",
              caption: "",
              aspectRatio: "1016 / 724",
              intrinsicSize: { width: 1016, height: 724 },
              bare: true,
              enlarge: true,
              rowFit: "wide",
            },
          ],
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
          media: [
            {
              src: "/work/anora/specimen-spreads-transparent.png",
              mobileSrc: "/work/anora/specimen-spreads-transparent-mobile.png",
              alt: "Anora newspaper-format specimen book spreads",
              caption: "Newspaper-format specimen book spreads.",
              aspectRatio: "3840 / 3340",
              intrinsicSize: { width: 3840, height: 3340 },
              bare: true,
              transparent: true,
              spacingTop: "-20px",
              captionSpacing: "0.625rem",
            },
          ],
        },
        {
          paragraphs: [],
          mediaLayout: "hero",
          media: [
            {
              src: "/work/anora/anora_people_walking_posters.mp4",
              alt: "People walking past Anora poster wall installation",
              caption: "Poster wall installation.",
              aspectRatio: "3840 / 2160",
              kind: "video",
              bare: true,
              poster: "/work/anora/anora_people_walking_posters-poster.jpg",
              videoSources: [
                {
                  src: "/work/anora/anora_people_walking_posters.mp4",
                  type: "video/mp4",
                },
                {
                  src: "/work/anora/anora_people_walking_posters.mov",
                  type: "video/quicktime",
                },
              ],
              mobileVideoSources: [
                {
                  src: "/work/anora/anora_people_walking_posters-mobile.mp4",
                  type: "video/mp4",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};