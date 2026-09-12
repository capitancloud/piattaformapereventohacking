import { useState } from "react";
import { ArrowRight, ArrowUp, ArrowDown, Play, CheckCircle2 } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

interface Stage {
  id: string;
  label: string;
  desc: string;
}

const CORRECT: Stage[] = [
  { id: "get", label: "Get-Process", desc: "Prende tutti i processi" },
  { id: "where", label: "Where-Object { $_.CPU -gt 10 }", desc: "Filtra solo quelli con CPU > 10" },
  { id: "sort", label: "Sort-Object CPU -Descending", desc: "Ordina per CPU dal più al meno" },
  { id: "select", label: "Select-Object -First 3", desc: "Tiene solo i primi 3" },
];

const SHUFFLED: Stage[] = [CORRECT[2]!, CORRECT[0]!, CORRECT[3]!, CORRECT[1]!];

export default function Task04Pipeline({ markComplete, isComplete }: TaskContext) {
  const [order, setOrder] = useState<Stage[]>(SHUFFLED);
  const [ran, setRan] = useState(false);
  const [ok, setOk] = useState(false);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j]!, next[i]!];
    setOrder(next);
    setRan(false);
  };

  const run = () => {
    setRan(true);
    const good = order.every((s, i) => s.id === CORRECT[i]!.id);
    setOk(good);
    if (good) markComplete();
  };

  const RESULT = ["chrome    (CPU 84.2)", "firefox   (CPU 47.5)", "code      (CPU 31.1)"];

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Obiettivo: i 3 processi che consumano più CPU (soglia &gt; 10)
        </div>

        <ol className="space-y-2">
          {order.map((s, i) => (
            <li
              key={s.id}
              className={cn(
                "flex items-center gap-3 rounded-md border p-3",
                ran && s.id === CORRECT[i]!.id ? "border-success bg-success/10" : ran ? "border-destructive bg-destructive/10" : "border-border bg-background",
              )}
            >
              <span className="w-6 font-mono text-xs text-accent">{i + 1}.</span>
              <div className="flex-1">
                <div className="font-mono text-sm text-foreground">{s.label}</div>
                <div className="text-[11px] text-muted-foreground">{s.desc}</div>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="rounded border border-border p-1 text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-30"
                  aria-label="sposta su"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === order.length - 1}
                  className="rounded border border-border p-1 text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-30"
                  aria-label="sposta giù"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-border bg-black/60 p-3 font-mono text-[11px]">
          <span className="text-gold-soft">PS&gt;</span>
          {order.map((s, i) => (
            <span key={s.id} className="flex items-center gap-2">
              <span className="text-ivory">{s.label}</span>
              {i < order.length - 1 && <ArrowRight className="h-3 w-3 text-primary" />}
            </span>
          ))}
        </div>

        <button
          onClick={run}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110"
        >
          <Play className="h-3.5 w-3.5" /> Esegui la pipeline
        </button>

        {ran && (
          <div className="mt-4 rounded-md border border-border bg-black/70 p-3 font-mono text-xs">
            {ok ? (
              <>
                <div className="mb-1 text-success">Pipeline corretta. Output:</div>
                {RESULT.map((r) => (
                  <div key={r} className="text-ivory">{r}</div>
                ))}
              </>
            ) : (
              <div className="text-destructive">L'ordine non è quello ottimale: prima prendi, poi filtra, poi ordina, poi limita.</div>
            )}
          </div>
        )}

        {ok && (
          <div className="mt-3 inline-flex items-center gap-1 text-xs text-success">
            <CheckCircle2 className="h-3.5 w-3.5" /> pipeline ottimizzata
          </div>
        )}
      </div>

      {!isComplete ? (
        <InfoNote>Se sorti prima di filtrare, PowerShell ordina anche gli oggetti che poi butti via: spreco di tempo.</InfoNote>
      ) : (
        <SuccessNote>Hai composto una pipeline efficiente. Questo pattern è alla base di tutti gli script di ricognizione in PowerShell.</SuccessNote>
      )}
    </div>
  );
}
