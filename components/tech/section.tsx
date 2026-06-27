import { TECH_STACK } from "@/config/tech-stack";

import { TechStackView } from "./view";

export function TechStackSection() {
  return <TechStackView items={TECH_STACK} />;
}
