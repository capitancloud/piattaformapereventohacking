import { useState } from "react";
import { InteractiveTerminal, type TermResponse } from "@/components/lab/InteractiveTerminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Provider = "FileSystem" | "Env" | "Variable" | "Registry";

const DATA: Record<Provider, { header: string; rows: string[] }> = {
  FileSystem: {
    header: "Mode                LastWriteTime         Length Name",
    rows: [
      "d----          10/09/2026 09:12                Users",
      "d----          08/09/2026 22:04                Windows",
      "d----          15/08/2026 11:20                Program Files",
      "-a---          02/09/2026 18:47           1247 note.txt",
    ],
  },
  Env: {
    header: "Name                           Value",
    rows: [
      "COMPUTERNAME                   LAB-01",
      "USERNAME                       kali",
      "PATH                           C:\\Windows\\System32;C:\\PS",
      "TEMP                           C:\\Users\\kali\\AppData\\Local\\Temp",
    ],
  },
  Variable: {
    header: "Name                           Value",
    rows: [
      "PSVersionTable                 {7.4.0}",
      "HOME                           C:\\Users\\kali",
      "PWD                            C:\\Lab",
      "?                              True",
    ],
  },
  Registry: {
    header: "Name                           Property",
    rows: [
      "Microsoft                      {}",
      "Google                         {InstallDir}",
      "Adobe                          {Version}",
    ],
  },
};

const PROVIDER_LIST: { name: Provider; drive: string; desc: string }[] = [
  { name: "FileSystem", drive: "C:\\", desc: "File e cartelle" },
  { name: "Env", drive: "Env:", desc: "Variabili d'ambiente" },
  { name: "Variable", drive: "Variable:", desc: "Variabili PowerShell attive" },
  { name: "Registry", drive: "HKLM:\\Software", desc: "Chiavi di registro" },
];

export default function Task06Providers({ markComplete, isComplete }: TaskContext) {
  const [visited, setVisited] = useState<Set<Provider>>(new Set());

  const detect = (path: string): Provider | null => {
    const p = path.trim().replace(/^\.?\\|^\.\//, "");
    if (/^env:/i.test(p)) return "Env";
    if (/^variable:/i.test(p)) return "Variable";
    if (/^hk(lm|cu):/i.test(p)) return "Registry";
    if (/^[a-z]:\\?/i.test(p) || p === "" || p === ".") return "FileSystem";
    return null;
  };

  const handle = (raw: string): TermResponse | TermResponse[] => {
    const cmd = raw.trim();

    if (cmd.toLowerCase() === "help" || cmd === "?") {
      return { text: "Prova: Get-ChildItem C:\\   |   Get-ChildItem Env:   |   Get-ChildItem Variable:", kind: "info" };
    }
    if (cmd.toLowerCase() === "clear" || cmd.toLowerCase() === "cls") return { text: "", kind: "out" };

    const m = cmd.match(/^(?:Get-ChildItem|gci|ls|dir)\s+(.+)$/i);
    if (m) {
      const prov = detect(m[1]!);
      if (!prov) return { text: `Provider non riconosciuto per '${m[1]}'.`, kind: "err" };
      const d = DATA[prov];
      const next = new Set(visited);
      next.add(prov);
      setVisited(next);
      if (next.size >= 2) markComplete();
      return [
        { text: `[provider: ${prov}]`, kind: "info" },
        { text: d.header, kind: "info" },
        { text: d.header.replace(/[^ ]/g, "-"), kind: "info" },
        ...d.rows.map((r) => ({ text: r, kind: "out" as const })),
      ];
    }

    if (/^Get-ChildItem$/i.test(cmd)) {
      return { text: "Get-ChildItem: manca il percorso. Esempio: Get-ChildItem Env:", kind: "err" };
    }

    return { text: `'${cmd}' non riconosciuto. Digita help per esempi.`, kind: "err" };
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <InteractiveTerminal title="PowerShell" prompt="PS C:\Lab> " heightClass="min-h-[260px]" onCommand={handle} />
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Provider disponibili</div>
          <ul className="space-y-2">
            {PROVIDER_LIST.map((p) => {
              const done = visited.has(p.name);
              return (
                <li key={p.name} className={cn("rounded-md border p-2 text-sm transition", done ? "border-success/60 bg-success/10" : "border-border bg-background")}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-foreground">{p.drive}</span>
                    <span className={cn("text-[10px]", done ? "text-success" : "text-muted-foreground")}>{done ? "visitato" : "—"}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{p.desc}</div>
                </li>
              );
            })}
          </ul>
          <div className="mt-3 text-[11px] text-muted-foreground">Obiettivo: visita almeno 2 provider diversi.</div>
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Prova <span className="font-mono">Get-ChildItem C:\</span> e poi <span className="font-mono">Get-ChildItem Env:</span>.</InfoNote>
      ) : (
        <SuccessNote>Hai capito il concetto di provider: uno stesso cmdlet, mondi diversi.</SuccessNote>
      )}
    </div>
  );
}
