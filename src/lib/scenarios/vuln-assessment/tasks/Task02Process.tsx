import { useState } from "react";
import { ArrowDown, RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const CORRECT = ["inventario", "scansione", "analisi", "priorita", "report"] as const;

const STEPS: { id: (typeof CORRECT)[number]; title: string; desc: string }[] = [
  { id: "scansione", title: "Scansione", desc: "Gli scanner automatici interrogano ogni asset e raccolgono i possibili punti deboli." },
  { id: "inventario", title: "Inventario degli asset", desc: "Elenca server, pc, siti e dispositivi: non puoi proteggere ciò che non sai di avere." },
  { id: "priorita", title: "Priorità", desc: "Ordini i risultati per gravità ed esposizione: prima ciò che fa più danno." },
  { id: "analisi", title: "Analisi dei risultati", desc: "Verifichi i risultati dello scanner, elimini i falsi positivi e confermi i problemi veri." },
  { id: "report", title: "Report e remediation", desc: "Scrivi il rapporto con le soluzioni: patch, riconfigurazioni, mitigazioni." },
];

export default function Task02Process({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<(typeof CORRECT)[number][]>([]);
  const [checked, setChecked] = useState(false);

  const ok = CORRECT.every((id, i) => picked[i] === id);

  const pick = (id: (typeof CORRECT)[number]) => {
    if (checked) return;
    setPicked((p) => (p.includes(id) ? p : [...p, id]));
  };

  const verify = () => {
    setChecked(true);
    if (ok) markComplete();
  };

  const reset = () => {
    setPicked([]);
    setChecked(false);
  };

  const remaining = STEPS.filter((s) => !picked.includes(s.id));

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        Ricostruisci il ciclo di un vulnerability assessment cliccando le fasi nell'ordine giusto, dalla prima all'ultima.
      </p>

      <div className="mb-4 min-w-0 rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">Il tuo ciclo ({picked.length}/5)</div>
        {picked.length === 0 && <p className="text-sm text-muted-foreground">Clicca una fase qui sotto per iniziare…</p>}
        <ol className="space-y-2">
          {picked.map((id, i) => {
            const s = STEPS.find((x) => x.id === id)!;
            const wrongHere = checked && id !== CORRECT[i];
            return (
              <li key={id}>
                <div
                  className={cn(
                    "flex min-w-0 items-center gap-3 rounded-md border p-3",
                    checked && !wrongHere && "border-success bg-success/10",
                    wrongHere && "border-destructive bg-destructive/10",
                    !checked && "border-border bg-background",
                  )}
                >
                  <span className="font-mono text-xs text-accent">{i + 1}.</span>
                  <div className="min-w-0">
                    <div className="break-words text-sm font-medium text-foreground">{s.title}</div>
                    <div className="break-words text-xs text-muted-foreground">{s.desc}</div>
                  </div>
                </div>
                {i < picked.length - 1 && <ArrowDown className="mx-auto my-1 h-4 w-4 text-muted-foreground" />}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid min-w-0 gap-2 sm:grid-cols-2">
        {remaining.map((s) => (
          <button
            key={s.id}
            onClick={() => pick(s.id)}
            className="min-w-0 rounded-md border border-border bg-background p-3 text-left transition hover:border-accent/60"
          >
            <div className="break-words text-sm font-medium text-foreground">{s.title}</div>
            <div className="break-words text-xs text-muted-foreground">{s.desc}</div>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        {picked.length === 5 && !checked && (
          <button onClick={verify} className="rounded-md border border-accent bg-accent/15 px-4 py-2 text-sm text-foreground transition hover:bg-accent/25">
            Verifica l'ordine
          </button>
        )}
        {(picked.length > 0 || checked) && (
          <button onClick={reset} className="flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition hover:border-accent/50">
            <RotateCcw className="h-3.5 w-3.5" /> Ricomincia
          </button>
        )}
      </div>

      {checked && !ok && <WarnNote>L'ordine non convince: non puoi scansionare ciò che non hai inventariato, né scrivere un report prima di aver analizzato. Riprova!</WarnNote>}
      {!checked && <InfoNote>Pensa al medico: prima l'anagrafica del paziente, poi gli esami, poi la diagnosi, poi la cura. Qui funziona uguale.</InfoNote>}
      {isComplete && (
        <SuccessNote>
          Esatto: inventario → scansione → analisi → priorità → report. Questo ciclo si ripete in continuazione,
          perché ogni settimana nascono vulnerabilità nuove.
        </SuccessNote>
      )}
    </div>
  );
}
