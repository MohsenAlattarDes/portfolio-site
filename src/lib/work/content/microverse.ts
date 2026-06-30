import type { ProjectCaseStudy } from "@/lib/work/types";

export const microverseCaseStudy: ProjectCaseStudy = {
  slug: "microverse",
  hero: {
    src: "/work/microverse/microverse-hero-clip.mp4",
    alt: "Microverse final 3D motion animation",
    caption: "",
    aspectRatio: "16 / 9",
    bare: true,
    kind: "video",
    videoSources: [
      {
        src: "/work/microverse/microverse-hero-clip.mp4",
        type: "video/mp4",
      },
      {
        src: "/work/microverse/microverse-hero-clip.webm",
        type: "video/webm",
      },
    ],
  },
  intro: {
    heading: "ABOUT THE PROJECT",
    paragraphs: [
      "Microverse is a 3D motion project that explores the hidden world of micro-organisms through abstract form and movement. The goal was not to illustrate scientific accuracy, but to interpret the unseen rhythm of life at a microscopic scale, using animation to express diversity, growth, and interconnected systems.",
    ],
    media: [
      {
        src: "/work/microverse/process-sketches.gif",
        alt: "Microverse sketches, mind maps, and storyboard",
        caption: "Sketches, mind-maps, and storyboard.",
        aspectRatio: "1800 / 1357",
        bare: true,
        paperShadow: true,
      },
    ],
  },
  sections: [
    {
      id: "research",
      heading: "RESEARCH & CONCEPT DEVELOPMENT",
      blocks: [
        {
          paragraphs: [
            "The process began with mind mapping to define the visual and behavioral characteristics of the micro-organisms. I explored how diversity could be expressed through form variation and movement. This was followed by initial sketching and storyboarding to translate the conceptual direction into a motion-based sequence.",
          ],
          media: [],
          preserveMediaColumn: true,
        },
      ],
    },
    {
      id: "motion-exploration",
      heading: "MOTION EXPLORATION",
      blocks: [
        {
          paragraphs: [
            "I produced an experimental video to study movement patterns inspired by micro-organisms. This exploration helped define principles of rhythm and interaction, serving as a reference point rather than a direct step toward the final animation.",
          ],
          media: [
            {
              src: "/work/microverse/motion-exploration.mp4",
              alt: "Microverse motion exploration video",
              caption: "",
              aspectRatio: "16 / 9",
              bare: true,
              kind: "video",
              videoControls: true,
              videoSources: [
                {
                  src: "/work/microverse/motion-exploration.mp4",
                  type: "video/mp4",
                },
                {
                  src: "/work/microverse/motion-exploration.webm",
                  type: "video/webm",
                },
                {
                  src: "/work/microverse/motion-exploration.mov",
                  type: "video/quicktime",
                },
              ],
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
            "The final animation builds on the conceptual research, using 3D form variation and motion to express the idea of separate entities evolving into a cohesive structure. Rather than replicating the exploration video, it focuses on interpreting the concept with clarity and spatial depth, framing diversity as a pathway to unity.",
          ],
          media: [
            {
              src: "/work/microverse/microverse-hero.mp4",
              alt: "Microverse final 3D motion animation",
              caption: "",
              aspectRatio: "16 / 9",
              bare: true,
              kind: "video",
              videoControls: true,
              videoSources: [
                {
                  src: "/work/microverse/microverse-hero.mp4",
                  type: "video/mp4",
                },
                {
                  src: "/work/microverse/microverse-hero.webm",
                  type: "video/webm",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
