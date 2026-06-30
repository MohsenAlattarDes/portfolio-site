import { jujuSodaCaseStudy } from "@/lib/work/content/juju-soda";
import { losAngelesGothicCaseStudy } from "@/lib/work/content/los-angeles-gothic";
import { microverseCaseStudy } from "@/lib/work/content/microverse";
import type { ProjectCaseStudy } from "@/lib/work/types";

const CASE_STUDIES: Record<string, ProjectCaseStudy> = {
  "los-angeles-gothic": losAngelesGothicCaseStudy,
  "juju-soda": jujuSodaCaseStudy,
  microverse: microverseCaseStudy,
};

export function getProjectCaseStudy(slug: string): ProjectCaseStudy | undefined {
  return CASE_STUDIES[slug];
}
