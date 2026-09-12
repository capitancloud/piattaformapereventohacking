import type { Scenario } from "./types";
import { networkingScenario } from "./networking";
import { linuxScenario } from "./linux";
import { bashScenario } from "./bash";
import { pythonScenario } from "./python";
import { powershellScenario } from "./powershell";
import { trafficScenario } from "./traffic";
import { linuxSecurityScenario } from "./linux-security";

export const scenarios: Scenario[] = [networkingScenario, linuxScenario, bashScenario, pythonScenario, powershellScenario, trafficScenario, linuxSecurityScenario];

export function getScenario(slug: string): Scenario | undefined {
  return scenarios.find((s) => s.slug === slug);
}
