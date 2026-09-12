import { useState } from "react";
import { Play, RotateCcw, CheckCircle2 } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const STARTER = `def somma(a, b):
    return a + b`;

export default function Task09Functions({ markComplete, isComplete }: TaskContext) {
  const [code, setCode] = useState(STARTER);
  const [a, setA] = useState("3");
  const [b, setB] = useState("4");
  const [output, setOutput] = useState<string[]>([]);
  const [calls, setCalls] = useState(0);

  const run = () => {
    const defMatch = code.match(/def\s+(\w+)\s*\(\s*(\w+)\s*,\s*(\w+)\s*\):\s*([\s\S]*)/);
    if (!defMatch) {
      setOutput(["SyntaxError: la funzione deve avere la forma def nome(a, b):"]);
      return;
    }
    const name = defMatch[1];
    const body = (defMatch[4] ?? "").trim();
    const returnMatch = body.match(/return\s+(\w+)\s*\+\s*(\w+)/);
    if (!returnMatch) {
      setOutput([`La funzione ${name} non ha un return valido (serve: return a + b).`]);
      return;
    }
    const na = Number(a);
    const nb = Number(b);
    if (Number.isNaN(na) || Number.isNaN(nb)) {
      setOutput(["Gli argomenti devono essere numeri."]);
      return;
    }
    const res = na + nb;
    const line = `>>> ${name}(${na}, ${nb})\n${res}`;
    setOutput((o) => [...o, line]);
    const nc = calls + 1;
    setCalls(nc);
    if (nc >= 2) markComplete();
  };

  const reset = () => {
    setCode(STARTER);
    setOutput([]);
    setCalls(0);
  };

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-accent">
            <span>editor · funzioni.py</span>
            <button onClick={reset} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-3 w-3" /> reset
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="h-40 w-full resize-none rounded-md border border-border bg-background p-3 font-mono text-sm text-foreground outline-none focus:border-accent"
          />
          <div className="mt-3 grid grid-cols-2 gap-2">
            <label className="text-xs text-muted-foreground">
              a
              <input value={a} onChange={(e) => setA(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 font-mono text-sm text-foreground focus:border-accent" />
            </label>
            <label className="text-xs text-muted-foreground">
              b
              <input value={b} onChange={(e) => setB(e.target.value)} className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1 font-mono text-sm text-foreground focus:border-accent" />
            </label>
          </div>
          <button
            onClick={run}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:brightness-110"
          >
            <Play className="h-3.5 w-3.5" /> somma(a, b)
          </button>
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-black/40 p-4 font-mono text-sm text-emerald-200">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">REPL</div>
          {output.length === 0 && <span className="text-muted-foreground">Chiama la funzione per vedere il risultato.</span>}
          {output.map((l, i) => (
            <pre key={i} className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] animate-in fade-in slide-in-from-left-2 duration-200">{l}</pre>
          ))}
        </div>
      </div>

      <div className={cn("mt-3 flex items-center gap-2 text-xs", calls >= 2 ? "text-success" : "text-muted-foreground")}>
        {calls >= 2 && <CheckCircle2 className="h-3.5 w-3.5" />}
        Chiamate eseguite: {calls}/2
      </div>

      {!isComplete ? (
        <InfoNote>
          def nome(parametri): apre la funzione. return restituisce il risultato. Chiami la funzione con nome(argomenti).
        </InfoNote>
      ) : (
        <SuccessNote>
          Perfetto. Ora sai definire una funzione, chiamarla con argomenti diversi e riutilizzarla ovunque.
        </SuccessNote>
      )}
    </div>
  );
}
