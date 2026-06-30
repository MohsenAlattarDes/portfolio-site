export const PLACEHOLDER_THUMBNAIL = "/work/placeholder.svg";

export type WorkProject = {
  slug: string;
  lines: string[];
  category: string;
  /** Image, GIF, or video path under /public */
  thumbnail: string;
  thumbnailVideoSources?: { src: string; type: string }[];
};

export function hasProjectThumbnail(thumbnail: string) {
  return thumbnail !== PLACEHOLDER_THUMBNAIL;
}

export function isVideoThumbnail(thumbnail: string) {
  return /\.(mov|mp4|webm)$/i.test(thumbnail);
}

export const WORK_PROJECTS: WorkProject[] = [
  {
    slug: "qalam",
    lines: ["QALAM"],
    category: "Master's Thesis Project",
    thumbnail: "/work/placeholder.svg",
  },
  {
    slug: "los-angeles-gothic",
    lines: ["LOS ANGELES", "GOTHIC"],
    category: "Font + Poster Design",
    thumbnail: "/work/los-angeles-gothic/lag-hero.mp4",
    thumbnailVideoSources: [
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
  {
    slug: "anora",
    lines: ["ANORA"],
    category: "Font Design + Specimen Design",
    thumbnail: "/work/placeholder.svg",
  },
  {
    slug: "uncommon-thread",
    lines: ["UNCOMMON", "THREAD"],
    category: "Publication + Poster Design + Design Research",
    thumbnail: "/work/placeholder.svg",
  },
  {
    slug: "kuwaits-cake-picnic",
    lines: ["KUWAIT'S CAKE", "PICNIC"],
    category: "Branding + Creative coding",
    thumbnail: "/work/placeholder.svg",
  },
  {
    slug: "juju-soda",
    lines: ["JUJU", "SODA"],
    category: "Packaging Design",
    thumbnail: "/work/juju-soda/hero.jpg",
  },
  {
    slug: "microverse",
    lines: ["MICROVERSE"],
    category: "3D Motion",
    thumbnail: "/work/microverse/microverse-hero-clip.mp4",
    thumbnailVideoSources: [
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
];

export function getWorkProject(slug: string) {
  return WORK_PROJECTS.find((project) => project.slug === slug);
}
