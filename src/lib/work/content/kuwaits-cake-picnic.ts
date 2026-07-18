import type { ProjectCaseStudy } from "@/lib/work/types";
import { CAKE_PICNIC_ORNAMENT_SOURCE } from "@/lib/work/kuwaits-cake-picnic/ornamentSource";
import { CAKE_WORKSHOP_SADU_SOURCE } from "@/lib/work/kuwaits-cake-picnic/saduSource";

export const kuwaitsCakePicnicCaseStudy: ProjectCaseStudy = {
  slug: "kuwaits-cake-picnic",
  hero: {
    src: "/work/kuwaits-cake-picnic/hero.jpg",
    alt: "Cake Picnic Kuwait posters installed along a palm-lined street",
    caption: "",
    aspectRatio: "3456 / 3035",
    bare: true,
  },
  intro: {
    heading: "ABOUT THE PROJECT",
    paragraphs: [
      "Cake Picnic Kuwait is a speculative branding project for a cultural gathering imagined in Al Shaheed Park: a picnic where cakes are shared, conversations unfold outdoors, and a workshop takes place alongside the event. The concept highlights why community matters and how food can bring people closer through something made to be shared.",
      [
        "The identity is generative: ornaments and visual systems are drawn in code with ",
        {
          text: "p5.js",
          href: "https://p5js.org/",
        },
        ", so the graphics can stay fluid and unique rather than fixed as a static pattern.",
      ],
    ],
    codeWindow: {
      title: "ornament.p5.js",
      source: CAKE_PICNIC_ORNAMENT_SOURCE,
    },
    mobileMediaBeforeCodeWindow: true,
    media: [
      {
        src: "",
        alt: "Generative Cake Picnic ornament growing in blue calligraphic lines",
        caption: "Live generative ornament drawn in p5.js. Hint: hit R to re-generate.",
        aspectRatio: "16 / 9",
        bare: true,
        transparent: true,
        kind: "code",
        codeSketch: "cake-picnic-ornament",
      },
    ],
  },
  sections: [
    {
      id: "cake-picnic",
      heading: "CAKE PICNIC",
      blocks: [
        {
          paragraphs: [
            "The picnic is the heart of the day. People bring cakes from home kitchens and local bakeries, then share the stories behind them: who made each one, what inspired it, how it came together. Visitors try unfamiliar flavors, meet people they have not met before, and sit in Al Shaheed Park to enjoy the afternoon with Kuwait City behind them.",
            "What the picnic celebrates is not spectacle. It is craftsmanship and curiosity: the patience of frosting, the quiet pride of bringing something you made, and the ease of leaving space for someone else to take a slice. Creativity here is practical and social. It lives in conversation as much as in decoration.",
            "The visual identity is generative. Abstract cake elements, like frosting lace, piping, and decoration, are coded to animate around each design piece. On every refresh, the system draws a new random pattern, so no two outputs feel the same while the language still reads as cake craft rather than a fixed illustration.",
          ],
          media: [
            {
              src: "/work/kuwaits-cake-picnic/street-animated-poster.mp4",
              alt: "Animated Cake Picnic posters displayed along a Kuwait City street",
              caption: "Street poster installation with generative ornament animation.",
              aspectRatio: "4000 / 3262",
              bare: true,
              kind: "video",
              videoPlaybackRate: 2,
              poster: "/work/kuwaits-cake-picnic/street-animated-poster-poster.jpg",
              mobileSrc: "/work/kuwaits-cake-picnic/street-animated-poster-mobile.mp4",
              mobileVideoSources: [
                {
                  src: "/work/kuwaits-cake-picnic/street-animated-poster-mobile.mp4",
                  type: "video/mp4",
                },
              ],
            },
            {
              src: "/work/kuwaits-cake-picnic/street-poster-closeup.jpg",
              alt: "Close-up of a red Cake Picnic poster installed on a city wall",
              caption: "Street poster detail.",
              aspectRatio: "2637 / 948",
              intrinsicSize: { width: 2637, height: 948 },
              bare: true,
              enlarge: true,
            },
          ],
          mobileMediaBeforeCopyMedia: true,
          copyMedia: [
            {
              src: "/work/kuwaits-cake-picnic/tote-bag.png",
              alt: "Cream Cake Picnic tote bag with blue generative ornament and event details",
              caption: "Tote bag application.",
              aspectRatio: "682 / 1024",
              intrinsicSize: { width: 682, height: 1024 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
            {
              src: "/work/kuwaits-cake-picnic/apron.png",
              alt: "Cake Picnic apron with blue logo lockup and generative frosting ornament",
              caption: "Apron with logo lockup and ornament.",
              aspectRatio: "682 / 1024",
              intrinsicSize: { width: 682, height: 1024 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
            {
              src: "/work/kuwaits-cake-picnic/shopping-bag.png",
              alt: "Blue and white Cake Picnic shopping bag with generative ornament",
              caption: "Shopping bag mockup.",
              aspectRatio: "682 / 1024",
              intrinsicSize: { width: 682, height: 1024 },
              bare: true,
              enlarge: true,
              rowAspectRatio: "971 / 1024",
              objectPosition: "center calc(50% + 10px)",
            },
            {
              src: "/work/kuwaits-cake-picnic/necklace.png",
              alt: "Metal Cake Picnic ornament necklace worn over a white shirt",
              caption: "Ornament as wearable object.",
              aspectRatio: "971 / 1024",
              intrinsicSize: { width: 971, height: 1024 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
          ],
          preserveMediaColumn: true,
        },
      ],
    },
    {
      id: "cake-workshop",
      heading: "CAKE WORKSHOP",
      blocks: [
        {
          paragraphs: [
            "The Cake Workshop celebrates Kuwait’s flavors, heritage, and culture through a hands-on experience devoted to decorating, frosting, piping, and creative experimentation.",
            "Its visual identity reinterprets Bedouin Sadu weaving through a modern generative system. The code transforms the rhythm, movement, and structure of Sadu into patterns that feel contemporary while remaining connected to the city’s cultural heritage. Across its combinations of outer structures, cores, arms, satellites, scale, spacing, and color, the code can generate roughly 49 million possible motif configurations.",
            "Each ticket is generated individually, giving every holder a unique pattern to discover. No two tickets are the same, making each one a personal part of the workshop experience.",
          ],
          codeWindow: {
            title: "sadu.p5.js",
            source: CAKE_WORKSHOP_SADU_SOURCE,
          },
          mobileMediaBeforeCodeWindow: true,
          copyMedia: [
            {
              src: "/work/kuwaits-cake-picnic/workshop-signup-phone.jpg",
              alt: "Cake Workshop signup interface displayed on a phone",
              caption: "",
              aspectRatio: "3680 / 2760",
              intrinsicSize: { width: 3680, height: 2760 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
            {
              src: "/work/kuwaits-cake-picnic/workshop-ticket-phone.jpg",
              alt: "Cake Workshop generated guest ticket displayed on a phone",
              caption: "",
              aspectRatio: "6000 / 4500",
              intrinsicSize: { width: 6000, height: 4500 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
          ],
          rowCaption:
            "Workshop signup and generated guest ticket with a unique Sadu pattern.",
          media: [
            {
              src: "",
              alt: "Generative Sadu motif building cell by cell in pink and brown",
              caption: "Four random Sadu motifs generated from the same system.",
              aspectRatio: "4 / 1",
              bare: true,
              transparent: true,
              kind: "code",
              codeSketch: "cake-workshop-sadu",
              codeSketchCopies: 4,
              maxWidth: "100%",
              align: "center",
            },
          ],
          afterCodeMedia: [
            {
              src: "/work/kuwaits-cake-picnic/cake-workshop-posters.jpg",
              alt: "Cake Workshop posters installed on a wall as a person walks past",
              caption: "Cake Workshop poster wall.",
              aspectRatio: "5231 / 3488",
              intrinsicSize: { width: 5231, height: 3488 },
              bare: true,
              enlarge: true,
            },
          ],
          preserveMediaColumn: true,
        },
      ],
    },
  ],
  footerNote:
    "*Cake Picnic Kuwait is a speculative student project and is not affiliated with the official Cake Picnic organization.*",
};
