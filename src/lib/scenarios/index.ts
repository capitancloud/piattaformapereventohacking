import type { Scenario } from "./types";
import { networkingScenario } from "./networking";
import { linuxScenario } from "./linux";
import { bashScenario } from "./bash";
import { pythonScenario } from "./python";
import { powershellScenario } from "./powershell";
import { trafficScenario } from "./traffic";
import { linuxSecurityScenario } from "./linux-security";
import { windowsSecurityScenario } from "./windows-security";
import { cloudSecurityScenario } from "./cloud-security";

export const scenarios: Scenario[] = [networkingScenario, linuxScenario, bashScenario, pythonScenario, powershellScenario, trafficScenario, linuxSecurityScenario, windowsSecurityScenario, cloudSecurityScenario];

export function getScenario(slug: string): Scenario | undefined {
  return scenarios.find((s) => s.slug === slug);
}
