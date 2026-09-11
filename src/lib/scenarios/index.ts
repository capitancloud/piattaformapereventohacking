import type { Scenario } from "./types";
import { idorScenario } from "./idor";
import { traversalScenario } from "./traversal";
import { reverseShellScenario } from "./reverseshell";

export const scenarios: Scenario[] = [
  idorScenario,
  traversalScenario,
  reverseShellScenario,
  {
    id: "reverse-engineering",
    slug: "reverse-engineering",
    title: "Reverse Engineering (base)",
    subtitle: "Analisi di script PowerShell con AI",
    intro:
      "Partire da uno script PowerShell offuscato, analizzarlo con l'aiuto dell'AI e ricostruire l'operazione inversa.",
    difficulty: "Intermedio",
    status: "coming-soon",
    tasks: [],
  },
];

export function getScenario(slug: string): Scenario | undefined {
  return scenarios.find((s) => s.slug === slug);
}
