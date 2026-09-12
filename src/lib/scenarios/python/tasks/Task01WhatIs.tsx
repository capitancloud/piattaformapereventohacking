import { useState } from "react";
import { FileCode, Cpu, PlayCircle, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const PIECES = [
  { id: "code", label: "Codice .py", desc: "Tu scrivi in un file di testo", icon: FileCode, color: "from-primary/40 to-transparent" },
  { id: "interp", label: "Interprete Python", desc: "Legge il file riga per riga", icon: PlayCircle, color: "from-fuchsia-500/30 to-transparent" },
  { id: "cpu", label: "CPU", desc: "Esegue le istruzioni tradotte", icon: Cpu, color: "from-accent/40 to-transparent" },
];

const SOLUTION = ["code", "interp", "cpu"];

export default function Task01WhatIs({ markComplete, isComplete }: TaskContext) {
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState<null | boolean>(null);

  const pick = (id: string) => {
    if (order.includes(id)) return;
    const next = [...order, id];
    setOrder(next);
    setChecked(null);
    if (next.length === 3) {
      const ok = next.every((v, i) => v === SOLUTION[i]);
      setChecked(ok);
      if (ok) markComplete();
    }
  };

  const reset = () => {
    setOrder([]);
    setChecked(null);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Ordina il flusso: dal codice all'esecuzione
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-border bg-background/60 p-3 min-h-16">
          {order.length === 0 && (
            <span className="text-xs text-muted-foreground">Clicca i pezzi sotto per costruire la catena</span>
          )}
          {order.map((id, i) => {
            const p = PIECES.find((x) => x.id === id)!;
            return (
              <div key={id} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="inline-flex items-center gap-2 rounded-md border border-accent/50 bg-accent/10 px-3 py-1.5 text-sm text-foreground">
                  <p.icon className="h-4 w-4 text-accent" />
                  {p.label}
                </span>
                {i < order.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            );
          })}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {PIECES.map((p) => {
            const used = order.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => pick(p.id)}
                disabled={used}
                className={cn(
                  "group relative overflow-hidden rounded-xl border p-4 text-left transition",
                  used ? "border-border/40 bg-surface/30 opacity-40" : "border-border bg-background hover:border-accent hover:-translate-y-0.5",
                )}
              >
                <div className={cn("pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60", p.color)} />
                <div className="relative">
                  <p.icon className="mb-2 h-6 w-6 text-accent" />
                  <div className="font-display text-lg text-foreground">{p.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{p.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {checked !== null && (
          <div className={cn("mt-4 flex items-center gap-2 text-sm", checked ? "text-success" : "text-destructive")}>
            {checked ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {checked ? "Esatto! Codice → Interprete → CPU." : "Non è l'ordine giusto: prova ancora."}
            {!checked && (
              <button onClick={reset} className="ml-3 rounded-md border border-border bg-surface px-2 py-1 text-xs text-foreground hover:border-accent">
                Ricomincia
              </button>
            )}
          </div>
        )}
      </div>

      {!isComplete ? (
        <InfoNote>
          Python è un linguaggio interpretato: nessun passaggio di compilazione, l'interprete legge il tuo .py e lo esegue.
        </InfoNote>
      ) : (
        <SuccessNote>
          Perfetto. Da ora quando avvii un file .py sai cosa succede sotto: l'interprete lo traduce e la CPU lo esegue.
        </SuccessNote>
      )}
    </div>
  );
}
