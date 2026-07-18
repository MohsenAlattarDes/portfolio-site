import type { PublicationSpread } from "@/lib/work/types";

const PAGE_COUNT = 36;
const PAGE_SIZE = { width: 1639, height: 2155 } as const;

export const UNCOMMON_THREAD_PUBLICATION_SPREADS: PublicationSpread[] =
  Array.from({ length: PAGE_COUNT }, (_, i) => {
    const page = String(i + 1).padStart(2, "0");
    return {
      src: `/work/uncommon-thread/flipbook-pages/page-${page}.jpg`,
      alt: `Uncommon Thread publication page ${i + 1}`,
      intrinsicSize: PAGE_SIZE,
    };
  });
