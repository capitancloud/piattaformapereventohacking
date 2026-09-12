import type { Scenario } from "./types";
import { networkingScenario } from "./networking";

export const scenarios: Scenario[] = [networkingScenario];

export function getScenario(slug: string): Scenario | undefined {
  return scenarios.find((s) => s.slug === slug);
}
