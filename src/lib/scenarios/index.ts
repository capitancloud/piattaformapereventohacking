import type { Scenario } from "./types";
import { idorScenario } from "./idor";
import { traversalScenario } from "./traversal";
import { reverseShellScenario } from "./reverseshell";
import { reverseEngineeringScenario } from "./reveng";

export const scenarios: Scenario[] = [
  idorScenario,
  traversalScenario,
  reverseShellScenario,
  reverseEngineeringScenario,
];

export function getScenario(slug: string): Scenario | undefined {
  return scenarios.find((s) => s.slug === slug);
}
