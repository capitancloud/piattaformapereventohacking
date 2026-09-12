import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const PRIVS: { name: string; hot: boolean; why: string }[] = [
  { name: "SeImpersonatePrivilege", hot: true, why: "Base di JuicyPotato/PrintSpoofer: shell SYSTEM in secondi." },
  { name: "SeAssignPrimaryTokenPrivilege", hot: true, why: "Consente di assegnare token primari: fratello gemello di Impersonate." },
  { name: "SeBackupPrivilege", hot: true, why: "Permette di leggere SAM/SYSTEM e recuperare hash locali." },
  { name: "SeRestorePrivilege", hot: true, why: "Permette di scrivere file protetti: sovrascrittura di eseguibili di sistema." },
  { name: "SeDebugPrivilege", hot: true, why: "Attaccarsi ai processi di SYSTEM = token stealing." },
  { name: "SeShutdownPrivilege", hot: false, why: "Solo per spegnere il PC: innocuo." },
  { name: "SeChangeNotifyPrivilege", hot: false, why: "Attivo di default per tutti: nessun rischio." },
  { name: "SeUndockPrivilege", hot: false, why: "Vecchio privilegio per docking station: irrilevante." },
];

export default function Task07Tokens({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const hot = PRIVS.filter((p) => p.hot).map((p) => p.name);
  const correct = hot.every((n) => picked.has(n)) && [...picked].every((n) => hot.includes(n));
  useEffect(() => { if (checked && correct) markComplete(); }, [checked, correct, markComplete]);

  return (
    <div>
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-black p-4 font-mono text-[12px]">
        <div className="text-gold-soft">C:\&gt; whoami /priv</div>
        <div className="mt-2 grid gap-1 text-ivory">
          {PRIVS.map((p) => {
            const sel = picked.has(p.name);
            return (
              <button key={p.name} onClick={() => { setChecked(false); setPicked((s) => { const n = new Set(s); n.has(p.name) ? n.delete(p.name) : n.add(p.name); return n; }); }} className={cn("min-w-0 rounded border border-transparent px-2 py-1 text-left break-all [overflow-wrap:anywhere] transition", sel && "border-accent bg-accent/10", checked && p.hot && "text-destructive", checked && !p.hot && "text-ivory/60")}>
                {p.name.padEnd(34, " ")} Enabled
              </button>
            );
          })}
        </div>
      </div>

      <Button className="mt-4 w-full" onClick={() => setChecked(true)}>Verifica selezione</Button>

      {checked && (
        <div className="mt-4 space-y-1 text-xs">
          {PRIVS.map((p) => picked.has(p.name) && <div key={p.name} className={cn(p.hot ? "text-success" : "text-destructive")}><span className="font-mono">{p.name}:</span> {p.why}</div>)}
        </div>
      )}

      {!checked && <InfoNote>Cerca Impersonate, AssignPrimaryToken, Backup, Restore, Debug: sono tutti equivalenti a SYSTEM.</InfoNote>}
      {checked && !correct && <WarnNote>Alcuni innocui sono ancora selezionati o ne manca uno pericoloso. Riguarda.</WarnNote>}
      {isComplete && <SuccessNote>Token letto correttamente: da qui si passa a SYSTEM con PrintSpoofer o simili in pochi secondi.</SuccessNote>}
    </div>
  );
}
