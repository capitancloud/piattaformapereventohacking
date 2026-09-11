import type { Scenario } from "./types";
import { idorScenario } from "./idor";

export const scenarios: Scenario[] = [
  idorScenario,
  {
    id: "directory-traversal",
    slug: "directory-traversal",
    title: "Directory Traversal",
    subtitle: "Path traversal e lettura di file arbitrari",
    intro:
      "Manipolare i percorsi per leggere file al di fuori della cartella prevista dall'applicazione.",
    difficulty: "Base",
    status: "coming-soon",
    tasks: [],
  },
  {
    id: "reverse-shell",
    slug: "reverse-shell",
    title: "Reverse Shell su IIS",
    subtitle: "Payload ASPX su Windows IIS",
    intro:
      "Caricare uno script ASPX su un server IIS Windows e ottenere una shell inversa remota controllata.",
    difficulty: "Intermedio",
    status: "coming-soon",
    tasks: [],
  },
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
