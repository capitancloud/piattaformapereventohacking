import { useState } from "react";
import { InteractiveTerminal, type TermResponse } from "@/components/lab/InteractiveTerminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";

const CMDLETS = ["Get-Process", "Get-Service", "Get-ChildItem", "Get-Content", "Get-Command", "Get-Help", "Get-Date"];

const HELP: Record<string, string> = {
  "Get-Process": "NAME\n    Get-Process\n\nSYNOPSIS\n    Ottiene i processi in esecuzione sul computer locale.\n\nEXAMPLES\n    Get-Process\n    Get-Process -Name chrome",
  "Get-Service": "NAME\n    Get-Service\n\nSYNOPSIS\n    Ottiene i servizi Windows presenti sul computer.\n\nEXAMPLES\n    Get-Service\n    Get-Service -Name Spooler",
  "Get-ChildItem": "NAME\n    Get-ChildItem\n\nSYNOPSIS\n    Elenca il contenuto di una posizione (cartella, provider).\n\nEXAMPLES\n    Get-ChildItem C:\\\n    Get-ChildItem Env:",
  "Get-Command": "NAME\n    Get-Command\n\nSYNOPSIS\n    Elenca i comandi installati (cmdlet, funzioni, alias).\n\nEXAMPLES\n    Get-Command -Verb Get\n    Get-Command -Noun Service",
  "Get-Content": "NAME\n    Get-Content\n\nSYNOPSIS\n    Legge il contenuto di un file.\n\nEXAMPLES\n    Get-Content .\\note.txt",
  "Get-Date": "NAME\n    Get-Date\n\nSYNOPSIS\n    Restituisce la data e l'ora correnti come oggetto DateTime.",
};

export default function Task03GetHelp({ markComplete, isComplete }: TaskContext) {
  const [usedGetCommand, setUsedGetCommand] = useState(false);
  const [helpReadCount, setHelpReadCount] = useState(0);

  const handle = (raw: string): TermResponse | TermResponse[] => {
    const cmd = raw.trim();
    const low = cmd.toLowerCase();

    if (low === "help" || low === "?") {
      return { text: "Prova: Get-Command -Verb Get     oppure     Get-Help Get-Process", kind: "info" };
    }
    if (low === "clear" || low === "cls") return { text: "", kind: "out" };

    if (low.startsWith("get-command")) {
      setUsedGetCommand(true);
      const verbMatch = cmd.match(/-Verb\s+(\w+)/i);
      const nounMatch = cmd.match(/-Noun\s+(\w+)/i);
      let list = CMDLETS;
      if (verbMatch) list = list.filter((c) => c.toLowerCase().startsWith(verbMatch[1]!.toLowerCase() + "-"));
      if (nounMatch) list = list.filter((c) => c.toLowerCase().endsWith("-" + nounMatch[1]!.toLowerCase()));
      const rows = list.map((c) => `Cmdlet   ${c.padEnd(18)}  Microsoft.PowerShell.Management`);
      return [
        { text: "CommandType   Name                Source", kind: "info" },
        { text: "-----------   ----                ------", kind: "info" },
        ...rows.map((r) => ({ text: r, kind: "out" as const })),
      ];
    }

    if (low.startsWith("get-help")) {
      const parts = cmd.split(/\s+/);
      const target = parts[1];
      if (!target) return { text: "Get-Help: specifica il nome del cmdlet (es: Get-Help Get-Process)", kind: "err" };
      const key = Object.keys(HELP).find((k) => k.toLowerCase() === target.toLowerCase());
      if (!key) return { text: `Get-Help: nessun aiuto per '${target}'`, kind: "err" };
      const body = HELP[key]!;
      const withExamples = /-Examples/i.test(cmd);
      const all = body.split("\n");
      const lines: string[] = withExamples ? all : all.filter((l) => !/^EXAMPLES|^\s{4}Get-/.test(l));
      setHelpReadCount(helpReadCount + 1);
      if (usedGetCommand) markComplete();
      return lines.map((l) => ({ text: l, kind: "out" as const }));
    }

    return { text: `'${cmd}' non è riconosciuto. Prova Get-Command o Get-Help.`, kind: "err" };
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-mono text-xs uppercase tracking-widest text-accent">Mini terminale PowerShell</div>
          <div className="flex gap-2 text-[11px]">
            <span className={usedGetCommand ? "text-success" : "text-muted-foreground"}>◉ Get-Command</span>
            <span className={helpReadCount >= 1 ? "text-success" : "text-muted-foreground"}>◉ Get-Help</span>
          </div>
        </div>
        <InteractiveTerminal
          title="PowerShell"
          prompt="PS C:\Lab> "
          heightClass="min-h-[240px]"
          onCommand={handle}
        />
      </div>

      {!isComplete ? (
        <InfoNote>Prova prima <span className="font-mono">Get-Command -Verb Get</span>, poi <span className="font-mono">Get-Help Get-Process</span>.</InfoNote>
      ) : (
        <SuccessNote>Sai auto-documentarti in PowerShell: due comandi bastano per scoprire e capire migliaia di cmdlet.</SuccessNote>
      )}
    </div>
  );
}
