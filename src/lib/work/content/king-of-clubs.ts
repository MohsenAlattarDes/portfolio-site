import type { ProjectCaseStudy } from "@/lib/work/types";

export const kingOfClubsCaseStudy: ProjectCaseStudy = {
  slug: "king-of-clubs",
  hero: {
    src: "/work/king-of-clubs/sphere.png",
    alt: "King of Clubs branding on the Las Vegas Sphere",
    caption: "Las Vegas Sphere.",
    aspectRatio: "1024 / 576",
    intrinsicSize: { width: 1024, height: 576 },
    bare: true,
  },
  intro: {
    heading: "ABOUT THE PROJECT",
    paragraphs: [
      "What if Las Vegas had an MLS team? A club rooted in Downtown energy, built for the city and its people.",
      "King of Clubs Football Club is a branding project for that idea. A soccer identity with Vegas attitude, made for community and entertainment.",
    ],
    more: {
      heading: "STRATEGY",
      closedLabel: "show me more +",
      openLabel: "show less −",
      blocks: [
        {
          heading: "RESEARCH",
          paragraphs: [
            "The brief started with a gap: Las Vegas has global entertainment brands and growing soccer interest, but no MLS club identity of its own. Early research looked at how existing MLS systems signal city, culture, and prestige, and where a Vegas club could sit without copying Strip spectacle.",
          ],
        },
        {
          heading: "POSITIONING",
          paragraphs: [
            "King of Clubs was framed as a Downtown-first club: local energy, community ownership, and entertainment-scale presence. The goal was an identity that feels rooted in the city while still competing for attention in a saturated visual market.",
          ],
        },
        {
          heading: "COMPETITIVE LANDSCAPE",
          paragraphs: [
            "Competitors fall in two camps. MLS club brands compete on soccer culture and league prestige. Vegas entertainment brands compete on spectacle and tourism. King of Clubs needed to borrow from both without becoming either.",
          ],
        },
        {
          heading: "AUDIENCE",
          paragraphs: [
            "Primary audiences are locals who want a club that represents the city, and visitors looking for something beyond casino culture. Secondary audiences include soccer fans and media who help carry the story outside Las Vegas.",
          ],
        },
        {
          heading: "SWOT",
          paragraphs: [
            "Strengths include tourist draw and Downtown momentum. Weaknesses include a crowded brand market and economic swings. Opportunities sit in sponsorships and rising U.S. soccer interest. Threats come from established competitors and market saturation.",
          ],
        },
      ],
    },
    media: [
      {
        src: "/work/king-of-clubs/mls-logos.png?v=3",
        alt: "MLS logos and their history",
        caption: "MLS club marks.",
        aspectRatio: "3840 / 2160",
        intrinsicSize: { width: 3840, height: 2160 },
        bare: true,
        enlarge: true,
      },
    ],
  },
  sections: [
    {
      id: "matchday",
      heading: "MATCHDAY",
      blocks: [
        {
          paragraphs: [
            "Matchday applications push the system into the stadium — wayfinding that reads from a distance, and field-side moments that put the crest in the middle of the game.",
          ],
          media: [],
          preserveMediaColumn: true,
        },
        {
          paragraphs: [],
          mediaLayout: "full",
          media: [
            {
              src: "/work/king-of-clubs/matchday-kits.png",
              alt: "King of Clubs home and away kits",
              caption: "Home and away kits.",
              aspectRatio: "2400 / 1560",
              intrinsicSize: { width: 2400, height: 1560 },
              kind: "hero-cycle",
              bare: true,
              transparent: true,
              enlarge: true,
              align: "center",
              glyphIntervalMs: 2200,
              heroCycleFadeMs: 0,
              heroCycleFit: "cover",
              heroOverlay: {
                src: "/work/king-of-clubs/matchday-kits.png",
                alt: "King of Clubs home and away kits",
                intrinsicSize: { width: 2400, height: 1560 },
              },
              heroSlides: [
                {
                  src: "/work/king-of-clubs/grass-01.jpg",
                  alt: "Grass field texture",
                },
                {
                  src: "/work/king-of-clubs/grass-02.jpg",
                  alt: "Grass field texture",
                },
              ],
            },
          ],
        },
        {
          paragraphs: [],
          mediaLayout: "row",
          mediaRowClass: "work-case-media-row--match-height",
          media: [
            {
              src: "/work/king-of-clubs/matchday-jacket-yellow.jpg",
              alt: "King of Clubs coach jacket — away colorway",
              caption: "Coach jackets.",
              aspectRatio: "1600 / 928",
              kind: "hero-cycle",
              bare: true,
              glyphIntervalMs: 1500,
              heroCycleFadeMs: 420,
              heroCycleFit: "cover",
              heroSlides: [
                {
                  src: "/work/king-of-clubs/matchday-jacket-yellow.jpg",
                  alt: "Coach jacket — away colorway (white and volt)",
                  intrinsicSize: { width: 1600, height: 928 },
                },
                {
                  src: "/work/king-of-clubs/matchday-jacket-purple.jpg",
                  alt: "Coach jacket — home colorway (black and purple)",
                  intrinsicSize: { width: 1600, height: 928 },
                },
              ],
            },
            {
              src: "/work/king-of-clubs/matchday-bag.jpg",
              alt: "King of Clubs branded sports bag",
              caption: "Matchday bag.",
              aspectRatio: "1600 / 2400",
              intrinsicSize: { width: 1600, height: 2400 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
              phoneSolo: true,
            },
            {
              src: "/work/king-of-clubs/lanyard.jpg",
              alt: "King of Clubs staff lanyard and badge",
              caption: "Staff badge.",
              aspectRatio: "1067 / 1600",
              intrinsicSize: { width: 1067, height: 1600 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
              phoneSolo: true,
            },
          ],
        },
        {
          paragraphs: [],
          mediaLayout: "row",
          media: [
            {
              src: "/work/king-of-clubs/apparel-white.jpg",
              alt: "King of Clubs apparel — white colorway",
              caption: "Training shorts.",
              aspectRatio: "1066 / 1600",
              kind: "hero-cycle",
              bare: true,
              glyphIntervalMs: 1500,
              heroCycleFadeMs: 420,
              heroCycleFit: "contain",
              heroCycleSyncId: "koc-apparel",
              heroSlides: [
                {
                  src: "/work/king-of-clubs/apparel-white.jpg",
                  alt: "Apparel — white shorts with purple mark",
                  intrinsicSize: { width: 1066, height: 1600 },
                },
                {
                  src: "/work/king-of-clubs/apparel-black.jpg",
                  alt: "Apparel — black shorts with volt mark",
                  intrinsicSize: { width: 1066, height: 1600 },
                },
              ],
            },
            {
              src: "/work/king-of-clubs/apparel-mesh-white.jpg",
              alt: "King of Clubs mesh apparel — white colorway",
              caption: "Mesh shorts.",
              aspectRatio: "1066 / 1600",
              kind: "hero-cycle",
              bare: true,
              glyphIntervalMs: 1500,
              heroCycleFadeMs: 420,
              heroCycleFit: "contain",
              heroCycleSyncId: "koc-apparel",
              heroSlides: [
                {
                  src: "/work/king-of-clubs/apparel-mesh-white.jpg",
                  alt: "Apparel — white mesh shorts with purple mark",
                  intrinsicSize: { width: 1066, height: 1600 },
                },
                {
                  src: "/work/king-of-clubs/apparel-mesh-black.jpg",
                  alt: "Apparel — black mesh shorts with volt mark",
                  intrinsicSize: { width: 1066, height: 1600 },
                },
              ],
            },
            {
              src: "/work/king-of-clubs/apparel-cap-white.jpg",
              alt: "King of Clubs fitted cap — white and purple colorway",
              caption: "Fitted caps.",
              aspectRatio: "1333 / 2000",
              kind: "hero-cycle",
              bare: true,
              glyphIntervalMs: 1500,
              heroCycleFadeMs: 420,
              heroCycleFit: "cover",
              heroCycleSyncId: "koc-apparel",
              heroSlides: [
                {
                  src: "/work/king-of-clubs/apparel-cap-white.jpg",
                  alt: "Fitted cap — white crown with purple brim",
                  intrinsicSize: { width: 1333, height: 2000 },
                },
                {
                  src: "/work/king-of-clubs/apparel-cap-black.jpg",
                  alt: "Fitted cap — black crown with volt brim",
                  intrinsicSize: { width: 1333, height: 2000 },
                },
              ],
            },
          ],
        },
        {
          paragraphs: [],
          mediaLayout: "row",
          mediaRowClass: "work-case-media-row--match-height",
          media: [
            {
              src: "/work/king-of-clubs/stadium-wayfinding.png",
              alt: "King of Clubs stadium wayfinding wall mockup",
              caption: "Stadium wayfinding.",
              aspectRatio: "1024 / 682",
              intrinsicSize: { width: 1024, height: 682 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
            {
              src: "/work/king-of-clubs/stadium-flag.png",
              alt: "King of Clubs circular flag on a stadium pitch",
              caption: "Pitch flag.",
              aspectRatio: "1024 / 682",
              intrinsicSize: { width: 1024, height: 682 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
            {
              src: "/work/king-of-clubs/stadium-flag-pole.png",
              alt: "King of Clubs black stadium flag with volt crest",
              caption: "Stadium flag.",
              aspectRatio: "1024 / 819",
              intrinsicSize: { width: 1024, height: 819 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
          ],
        },
        {
          paragraphs: [],
          mediaLayout: "row",
          media: [
            {
              src: "/work/king-of-clubs/type-arrows-v2.mp4",
              alt: "King of Clubs type motion — arrows",
              caption: "Type motion — arrows.",
              aspectRatio: "16 / 9",
              kind: "video",
              bare: true,
              rowFit: "wide",
              poster: "/work/king-of-clubs/type-arrows-v2-poster.jpg",
              videoSources: [
                {
                  src: "/work/king-of-clubs/type-arrows-v2.mp4",
                  type: "video/mp4",
                },
              ],
            },
            {
              src: "/work/king-of-clubs/type-match-score.mp4",
              alt: "King of Clubs type motion — match score",
              caption: "Type motion — match score.",
              aspectRatio: "16 / 9",
              kind: "video",
              bare: true,
              rowFit: "wide",
              poster: "/work/king-of-clubs/type-match-score-poster.jpg",
              videoSources: [
                {
                  src: "/work/king-of-clubs/type-match-score.mp4",
                  type: "video/mp4",
                },
              ],
            },
          ],
        },
        {
          paragraphs: [],
          mediaLayout: "row",
          media: [
            {
              src: "/work/king-of-clubs/type-born-to-shoot.mp4",
              alt: "King of Clubs type motion — Born to Shoot",
              caption: "Type motion — Born to Shoot.",
              aspectRatio: "16 / 9",
              kind: "video",
              bare: true,
              rowFit: "wide",
              poster: "/work/king-of-clubs/type-born-to-shoot-poster.jpg",
              videoSources: [
                {
                  src: "/work/king-of-clubs/type-born-to-shoot.mp4",
                  type: "video/mp4",
                },
              ],
            },
            {
              src: "/work/king-of-clubs/type-goal.mp4",
              alt: "King of Clubs type motion — GOAL",
              caption: "Type motion — GOAL.",
              aspectRatio: "16 / 9",
              kind: "video",
              bare: true,
              rowFit: "wide",
              poster: "/work/king-of-clubs/type-goal-poster.jpg",
              videoSources: [
                {
                  src: "/work/king-of-clubs/type-goal.mp4",
                  type: "video/mp4",
                },
              ],
            },
          ],
        },
        {
          paragraphs: [],
          mediaLayout: "row",
          media: [
            {
              src: "/work/king-of-clubs/type-score-player.mp4",
              alt: "King of Clubs type motion — GOAL, PLAYER 9, M 45+2, XAVI H.",
              caption: "Type motion — scoreline.",
              aspectRatio: "16 / 9",
              kind: "video",
              bare: true,
              rowFit: "wide",
              poster: "/work/king-of-clubs/type-score-player-poster.jpg",
              videoSources: [
                {
                  src: "/work/king-of-clubs/type-score-player.mp4?v=6",
                  type: "video/mp4",
                },
              ],
            },
            {
              src: "/work/king-of-clubs/type-slot-machine.mp4",
              alt: "King of Clubs type motion — slot machine",
              caption: "Type motion — slot machine.",
              aspectRatio: "16 / 9",
              kind: "video",
              bare: true,
              rowFit: "wide",
              poster: "/work/king-of-clubs/type-slot-machine-poster.jpg",
              videoSources: [
                {
                  src: "/work/king-of-clubs/type-slot-machine.mp4",
                  type: "video/mp4",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "city",
      blocks: [
        {
          heading: "CITY",
          paragraphs: [
            "Outside the stadium, the brand needs to hold its own against the visual noise of Las Vegas — on taxis, street banners, and the city’s biggest screens.",
          ],
          mediaLayout: "row",
          mediaRowClass: "work-case-media-row--match-height",
          media: [
            {
              src: "/work/king-of-clubs/sphere.png",
              alt: "King of Clubs branding on the Las Vegas Sphere",
              caption: "Las Vegas Sphere.",
              aspectRatio: "1024 / 576",
              intrinsicSize: { width: 1024, height: 576 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
            {
              src: "/work/king-of-clubs/street-banners.jpg",
              alt: "King of Clubs street light banners in volt and purple",
              caption: "Street banners.",
              aspectRatio: "1600 / 2400",
              intrinsicSize: { width: 1600, height: 2400 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
            {
              src: "/work/king-of-clubs/tape-purple.jpg",
              alt: "King of Clubs branded tape — purple",
              caption: "Branded tape.",
              aspectRatio: "1066 / 1600",
              kind: "hero-cycle",
              bare: true,
              glyphIntervalMs: 1500,
              heroCycleFadeMs: 420,
              heroCycleFit: "contain",
              rowFit: "natural",
              heroSlides: [
                {
                  src: "/work/king-of-clubs/tape-purple.jpg",
                  alt: "Branded tape — purple",
                  intrinsicSize: { width: 1066, height: 1600 },
                },
                {
                  src: "/work/king-of-clubs/tape-yellow.jpg",
                  alt: "Branded tape — volt",
                  intrinsicSize: { width: 1066, height: 1600 },
                },
              ],
            },
          ],
        },
        {
          paragraphs: [],
          mediaLayout: "row",
          mediaRowClass: "work-case-media-row--match-height",
          media: [
            {
              src: "/work/king-of-clubs/city-airport-screens.jpg",
              alt: "King of Clubs airport baggage claim screen takeover",
              caption: "Airport screens.",
              aspectRatio: "1600 / 2400",
              intrinsicSize: { width: 1600, height: 2400 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
              phoneSolo: true,
            },
            {
              src: "/work/king-of-clubs/cap-goal.jpg",
              alt: "King of Clubs taxi-roof cap mockups",
              caption: "Taxi-roof caps.",
              aspectRatio: "2 / 3",
              kind: "hero-cycle",
              bare: true,
              glyphIntervalMs: 2800,
              phoneSolo: true,
              heroSlides: [
                {
                  src: "/work/king-of-clubs/cap-goal.jpg",
                  alt: "Taxi-roof cap — GOAL graphic",
                  intrinsicSize: { width: 1000, height: 1500 },
                },
                {
                  src: "/work/king-of-clubs/cap-arrow.jpg",
                  alt: "Taxi-roof cap — chevron arrows graphic",
                  intrinsicSize: { width: 1000, height: 1500 },
                },
                {
                  src: "/work/king-of-clubs/cap-koc.jpg",
                  alt: "Taxi-roof cap — KING OF CLUBS wordmark",
                  intrinsicSize: { width: 1000, height: 1500 },
                },
              ],
            },
            {
              src: "/work/king-of-clubs/city-posters.jpg",
              alt: "King of Clubs wheatpaste posters on a city wall",
              caption: "Street posters.",
              aspectRatio: "2 / 3",
              intrinsicSize: { width: 1600, height: 2400 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
          ],
        },
      ],
    },
    {
      id: "collateral",
      heading: "COLLATERAL",
      blocks: [
        {
          paragraphs: [
            "Print and stationery bring the same energy into closer range — spreads that carry the club voice, and cards that make ownership feel immediate.",
          ],
          media: [
            {
              src: "/work/king-of-clubs/letter-spreads.png",
              alt: "King of Clubs letter-size print spreads",
              caption: "Letter-size brand spreads.",
              aspectRatio: "921 / 1024",
              intrinsicSize: { width: 921, height: 1024 },
              bare: true,
              enlarge: true,
            },
          ],
        },
        {
          paragraphs: [],
          mediaLayout: "row",
          media: [
            {
              src: "/work/king-of-clubs/letterhead.jpg",
              alt: "King of Clubs letterhead and keychain stationery mockup",
              caption: "Letterhead.",
              aspectRatio: "1600 / 1530",
              intrinsicSize: { width: 1600, height: 1530 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
            {
              src: "/work/king-of-clubs/business-cards.png",
              alt: "King of Clubs business card mockup",
              caption: "Business cards.",
              aspectRatio: "1024 / 768",
              intrinsicSize: { width: 1024, height: 768 },
              bare: true,
              enlarge: true,
              rowFit: "natural",
            },
          ],
        },
      ],
    },
    {
      id: "digital",
      heading: "DIGITAL",
      blocks: [
        {
          paragraphs: [
            "The website extends the identity into a living club presence — tickets, news, and matchday energy in one place.",
          ],
          media: [
            {
              src: "/work/king-of-clubs/website-mockup-03.mp4",
              alt: "King of Clubs website mockup on a phone held in hand",
              caption: "Website mockup.",
              aspectRatio: "4 / 3",
              kind: "video",
              bare: true,
              poster: "/work/king-of-clubs/website-mockup-03-poster.jpg",
              videoSources: [
                {
                  src: "/work/king-of-clubs/website-mockup-03.mp4",
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
