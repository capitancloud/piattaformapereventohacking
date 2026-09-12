import { useEffect, useState } from "react";
import { ArrowDown, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const STEPS = [
  { id: "s1", text: "Scrivi il comando che vuoi eseguire in HKCU\\Software\\Classes\\ms-settings\\Shell\\Open\\command", order: 1 },
  { id: "s2", text: "Imposta il valore «DelegateExecute» a stringa vuota nella stessa chiave", order: 2 },
  { id: "s3", text: "Avvia fodhelper.exe (firmato Microsoft, si auto-eleva senza popup)", order: 3 },
  { id: "s4", text: "fodhelper legge la chiave HKCU e lancia il tuo comando con privilegi elevati", order: 4 },
];

export default function Task03Uac({ markComplete, isComplete }: TaskContext) {
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
              <button key={s.id} onClick={() => push(s.id)} className="block w-full min-w-0 rounded-md border border-border bg-background p-3 text-left text-sm text-foreground hover:border-accent/50">{s.text}</button>
            ))}
            {pool.length === 0 && <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">Tutti sistemati.</div>}
          </div>
        </div>
        <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">Piano del bypass (in ordine)</div>
          <div className="space-y-2">
            {seq.map((s, i) => (
              <div key={s.id}>
                <button onClick={() => pop(s.id)} className={cn("block w-full min-w-0 rounded-md border p-3 text-left text-sm transition", checked ? (s.order === i + 1 ? "border-success/60 bg-success/5" : "border-destructive/60 bg-destructive/5") : "border-accent/40 bg-accent/5 text-foreground")}>
                  <span className="mr-2 font-mono text-accent">{i + 1}.</span>{s.text}
                </button>
                {i < seq.length - 1 && <div className="my-1 flex justify-center"><ArrowDown className="h-4 w-4 text-muted-foreground" /></div>}
              </div>
            ))}
            {seq.length === 0 && <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">Aggiungi qui i passaggi nell'ordine corretto.</div>}
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button disabled={seq.length !== STEPS.length} onClick={() => setChecked(true)}>Verifica l'ordine</Button>
        <Button variant="outline" onClick={reset}>Ricomincia</Button>
      </div>
      {!checked && <InfoNote>fodhelper è un programma legittimo firmato Microsoft: il trucco è fargli leggere una chiave che decidi tu.</InfoNote>}
      {checked && !correct && <WarnNote>Ordine sbagliato. Ricorda: prima prepari la chiave, poi lanci fodhelper.</WarnNote>}
      {isComplete && <SuccessNote><ShieldCheck className="mr-1 inline h-4 w-4" /> Bypass eseguito: shell elevata senza popup UAC.</SuccessNote>}
    </div>
  );
}
