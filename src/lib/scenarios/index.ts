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
import { informationGatheringScenario } from "./information-gathering";
import { nmapScanningScenario } from "./nmap-scanning";
import { enumerationScenario } from "./enumeration";
import { vulnAssessmentScenario } from "./vuln-assessment";
import { exploitationScenario } from "./exploitation";
import { webExploitationScenario } from "./web-exploitation";
import { postExploitationScenario } from "./post-exploitation";
import { linuxPrivescScenario } from "./linux-privesc";

export const scenarios: Scenario[] = [networkingScenario, linuxScenario, bashScenario, pythonScenario, powershellScenario, trafficScenario, linuxSecurityScenario, windowsSecurityScenario, cloudSecurityScenario, informationGatheringScenario, nmapScanningScenario, enumerationScenario, vulnAssessmentScenario, exploitationScenario, webExploitationScenario, postExploitationScenario, linuxPrivescScenario];

export function getScenario(slug: string): Scenario | undefined {
  return scenarios.find((s) => s.slug === slug);
}
