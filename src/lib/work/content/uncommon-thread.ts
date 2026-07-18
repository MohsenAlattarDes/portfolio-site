import type { ProjectCaseStudy } from "@/lib/work/types";
import { UNCOMMON_THREAD_PUBLICATION_SPREADS } from "@/lib/work/uncommon-thread/publicationSpreads";

export const uncommonThreadCaseStudy: ProjectCaseStudy = {
  slug: "uncommon-thread",
  hero: {
    src: "/work/uncommon-thread/research-casablanca-school.jpg",
    alt: "The Casablanca School exhibiting modernist artworks in Jemaa el-Fna Square, Marrakech, 1969",
    caption:
      "The Casablanca School exhibiting in Jemaa el-Fna Square, Marrakech, 1969.",
    aspectRatio: "21 / 9",
    intrinsicSize: { width: 3771, height: 2292 },
    bare: true,
    imageMotion: "pan-x",
  },
  intro: {
    heading: "ABOUT THE PROJECT",
    paragraphs: [
      "Uncommon Thread began with a desire to understand how design ideas move, how they travel across borders, shift through cultures, and take on new forms over time. The project looks at the migration of modernist design principles and how they quietly shape visual languages in places far from where they originated.",
      "What started as a question about Arab visual culture grew into a broader exploration of influence, adaptation, and reinterpretation. This publication maps those connections, tracing how one idea can stretch across eras, geographies, and mediums while forming something entirely new along the way.",
    ],
    media: [
      {
        src: "/work/uncommon-thread/cover.png",
        alt: "Uncommon Thread publication cover with Bauhaus logo and Arabic monogram",
        caption:
          "The cover merges the Bauhaus logo with an Arabic monogram of the publication's title, symbolizing the dialogue between Bauhaus modernism and Arab design culture.",
        aspectRatio: "1200 / 1646",
        intrinsicSize: { width: 1200, height: 1646 },
        bare: true,
        enlarge: true,
        maxWidth: "70%",
        align: "center",
      },
    ],
  },
  sections: [
    {
      id: "inspiration",
      heading: "INSPIRATION",
      blocks: [
        {
          paragraphs: [
            "Uncommon Thread began from pure curiosity. I kept wondering where the visual language of 1950s – 60s Egyptian and Arab movie posters, theater graphics and their typographic structure came from. Their styles were distinct, expressive, and modern. I wanted to understand what shaped them, what they were responding to, and where those design decisions originated.",
          ],
          media: [
            {
              src: "/work/uncommon-thread/inspiration-posters.png",
              alt: "Grid of 1950s and 60s Egyptian and Arab movie posters",
              caption:
                "1950s – 60s Egyptian and Arab movie posters that sparked the project's initial question.",
              aspectRatio: "900 / 1612",
              intrinsicSize: { width: 900, height: 1612 },
              bare: true,
              enlarge: true,
            },
          ],
        },
      ],
    },
    {
      id: "research",
      heading: "RESEARCH",
      blocks: [
        {
          paragraphs: [
            "That question eventually led me to the Bauhaus. I became interested in how its ideas traveled beyond Europe and how Bauhaus educators brought modernist principles into the Arab world, especially in places like Morocco, where they contributed to early design education. Seeing how form, simplicity, and clarity were introduced into these contexts began to connect some of the dots for me.",
          ],
          media: [
            {
              src: "/work/uncommon-thread/research-casablanca-school-full.jpg",
              alt: "The Casablanca School exhibiting modernist artworks in Jemaa el-Fna Square, Marrakech, 1969",
              caption:
                "The Casablanca School exhibiting in Jemaa el-Fna Square, Marrakech, 1969.",
              aspectRatio: "4000 / 2630",
              intrinsicSize: { width: 4000, height: 2630 },
              bare: true,
              enlarge: true,
              paperShadow: true,
            },
          ],
        },
        {
          paragraphs: [
            "From there, my curiosity shifted forward in time. I wanted to know if Bauhaus influence still exists physically in our world today. That's when IKEA became a key reference point. To me, IKEA represents a contemporary extension of Bauhaus ideas: design as accessible, functional, affordable, and universal. The same foundations, simplicity, clarity, and \"design for all\", continue to shape how people interact with everyday objects and spaces.",
          ],
          media: [
            {
              src: "/work/uncommon-thread/research-ikea-dubai.png",
              alt: "IKEA store exterior in Dubai with Arabic and English signage",
              caption:
                "IKEA as a contemporary extension of Bauhaus principles in everyday design.",
              aspectRatio: "1024 / 592",
              intrinsicSize: { width: 1024, height: 592 },
              bare: true,
              enlarge: true,
              paperShadow: true,
            },
          ],
        },
      ],
    },
    {
      id: "production",
      heading: "PRODUCTION",
      blocks: [
        {
          paragraphs: [
            "The publication is at the center of Uncommon Thread. Written and designed by me, it gathers the research, the visual mappings, and the connections uncovered throughout the project. This carousel highlights the book's structure and progression, showing how the ideas developed through writing, analysis, and design.",
          ],
          media: [
            {
              src: "",
              alt: "Uncommon Thread publication spreads",
              caption:
                "Flip through the publication spreads. Use the arrows or swipe to move between pages.",
              kind: "publication-flipbook",
              publicationSpreads: UNCOMMON_THREAD_PUBLICATION_SPREADS,
            },
          ],
        },
        {
          paragraphs: [
            [
              "To summarize the publication, I created a triptych poster series that distills the project into three bold visual statements. The layout is directly inspired by ",
              {
                text: "Bruno Monguzzi",
                href: "https://hmctartcenter.org/archive/bruno-monguzzi",
              },
              "'s City of Chiasso posters, especially ",
              {
                text: "César Domela",
                href: "https://hmctartcenter.org/archive/image/bruno-monguzzi-2000",
              },
              " and the ",
              {
                text: "Chiasso Cinema series",
                href: "https://hmctartcenter.org/archive/image/bruno-monguzzi-2005",
              },
              ". His structured rhythm and dynamic typographic compositions offered a framework for translating my research into a clear, impactful visual system. The three posters work together as one piece, echoing the same theme of movement, connection, and cultural exchange that shapes the publication.",
            ],
          ],
          media: [],
          preserveMediaColumn: true,
        },
        {
          paragraphs: [],
          media: [
            {
              src: "/work/uncommon-thread/triptych-poster-1.jpg",
              alt: "First Uncommon Thread triptych poster",
              caption: "",
              aspectRatio: "2 / 3",
              intrinsicSize: { width: 2000, height: 3000 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
            {
              src: "/work/uncommon-thread/triptych-poster-2.jpg",
              alt: "Second Uncommon Thread triptych poster",
              caption: "",
              aspectRatio: "2 / 3",
              intrinsicSize: { width: 2000, height: 3000 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
            {
              src: "/work/uncommon-thread/triptych-poster-3.jpg",
              alt: "Third Uncommon Thread triptych poster",
              caption: "",
              aspectRatio: "2 / 3",
              intrinsicSize: { width: 2000, height: 3000 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
          ],
          mediaLayout: "row",
          rowCaption:
            "Uncommon Thread triptych poster series. Each poster is 24 × 36 inches.",
        },
        {
          paragraphs: [
            "In the end, my original question didn't lead to a single clear answer. I didn't find a direct line between mid-century Arab posters and the Bauhaus. But I still believe the early influence, especially the spread of Bauhaus principles into the Arab world, helped shape the broader design environment especially in its typographic structure. This project became less about finding one origin, and more about mapping how ideas travel, intersect, and transform across cultures and time.",
          ],
          media: [],
          preserveMediaColumn: true,
        },
      ],
    },
  ],
};
