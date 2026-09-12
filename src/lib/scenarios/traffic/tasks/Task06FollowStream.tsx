import { useState } from "react";
import { ArrowUp, ArrowDown, CheckCircle2, RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

interface Line {
  id: string;
  side: "c" | "s";
  text: string;
}

const CORRECT: Line[] = [
  { id: "req-line", side: "c", text: "GET /account HTTP/1.1" },
  { id: "req-host", side: "c", text: "Host: bankofmoon.example" },
  { id: "req-cookie", side: "c", text: "Cookie: session=abc123" },
  { id: "res-status", side: "s", text: "HTTP/1.1 200 OK" },
  { id: "res-ctype", side: "s", text: "Content-Type: text/html" },
  { id: "res-body", side: "s", text: "<html><body>Ciao Ada, saldo: 1.240 EUR</body></html>" },
];

const SHUFFLED: Line[] = [CORRECT[3]!, CORRECT[0]!, CORRECT[2]!, CORRECT[5]!, CORRECT[1]!, CORRECT[4]!];

export default function Task06FollowStream({ markComplete, isComplete }: TaskContext) {
  const [order, setOrder] = useState<Line[]>(SHUFFLED);
  const [checked, setChecked] = useState(false);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j]!, next[i]!];
    setOrder(next);
    setChecked(false);
  };

  const verify = () => {
    setChecked(true);
    if (order.every((l, i) => l.id === CORRECT[i]!.id)) markComplete();
  };

  const reset = () => {
    setOrder(SHUFFLED);
    setChecked(false);
  };

  const allGood = checked && order.every((l, i) => l.id === CORRECT[i]!.id);

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-mono text-xs uppercase tracking-widest text-accent">
            Ricostruisci l'ordine della conversazione HTTP
          </div>
          <div className="flex gap-3 font-mono text-[10px]">
            <span className="inline-flex items-center gap-1"><span className="h-2 w-4 rounded bg-primary/70" /> client</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-4 rounded bg-gold-soft/70" /> server</span>
          </div>
        </div>

        <ol className="space-y-1.5">
          {order.map((l, i) => {
            const correct = checked && l.id === CORRECT[i]!.id;
            const wrong = checked && l.id !== CORRECT[i]!.id;
            return (
              <li key={l.id} className={cn(
                "flex items-center gap-2 rounded-md border p-2 font-mono text-[12px]",
                correct ? "border-success bg-success/10" : wrong ? "border-destructive bg-destructive/10" : "border-border bg-background",
                l.side === "c" ? "text-primary-foreground" : "text-gold",
              )}>
                <span className="w-6 text-center text-muted-foreground">{i + 1}</span>
                <span className={cn(
                  "rounded-full px-2 py-0.5 text-[10px]",
                  l.side === "c" ? "bg-primary/25" : "bg-gold-soft/25",
                )}>
                  {l.side === "c" ? "C" : "S"}
                </span>
                <span className="flex-1 text-ivory">{l.text}</span>
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => move(i, -1)} disabled={i === 0} className="rounded border border-border p-0.5 text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-30" aria-label="su">
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === order.length - 1} className="rounded border border-border p-0.5 text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-30" aria-label="giù">
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 flex items-center gap-2">
          <button onClick={verify} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110">
            Verifica ordine
          </button>
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs text-foreground hover:border-accent">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          {allGood && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> conversazione ricostruita
            </span>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Regola: prima parla il client con la sua richiesta completa (metodo + header), poi il server risponde (status + header + body).</InfoNote>
      ) : (
        <SuccessNote>Hai ricostruito lo scambio. Su HTTP puro si legge tutto, cookie di sessione compresi: buon motivo per usare HTTPS.</SuccessNote>
      )}
    </div>
  );
}
