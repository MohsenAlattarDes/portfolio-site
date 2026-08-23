import { anoraCaseStudy } from "@/lib/work/content/anora";
import { jujuSodaCaseStudy } from "@/lib/work/content/juju-soda";
import { kingOfClubsCaseStudy } from "@/lib/work/content/king-of-clubs";
import { kuwaitsCakePicnicCaseStudy } from "@/lib/work/content/kuwaits-cake-picnic";
import { losAngelesGothicCaseStudy } from "@/lib/work/content/los-angeles-gothic";
import { microverseCaseStudy } from "@/lib/work/content/microverse";
import { qalamCaseStudy } from "@/lib/work/content/qalam";
import { uncommonThreadCaseStudy } from "@/lib/work/content/uncommon-thread";
import type { ProjectCaseStudy } from "@/lib/work/types";

const CASE_STUDIES: Record<string, ProjectCaseStudy> = {
  qalam: qalamCaseStudy,
  anora: anoraCaseStudy,
  "king-of-clubs": kingOfClubsCaseStudy,
  "los-angeles-gothic": losAngelesGothicCaseStudy,
  "juju-soda": jujuSodaCaseStudy,
  "kuwaits-cake-picnic": kuwaitsCakePicnicCaseStudy,
  microverse: microverseCaseStudy,
  "uncommon-thread": uncommonThreadCaseStudy,
};

export function getProjectCaseStudy(slug: string): ProjectCaseStudy | undefined {
  return CASE_STUDIES[slug];
}
