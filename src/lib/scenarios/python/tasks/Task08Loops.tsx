import { useState } from "react";
import { Play } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";

export default function Task08Loops({ markComplete, isComplete }: TaskContext) {
  const [n, setN] = useState(4);
  const [mode, setMode] = useState<"for" | "while">("for");
  const [output, setOutput] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [runs, setRuns] = useState(0);

  const run = async () => {
    if (running) return;
    setRunning(true);
    setOutput([]);
    for (let i = 0; i < n; i++) {
      await new Promise((r) => setTimeout(r, 350));
      setOutput((o) => [...o, mode === "for" ? `i = ${i}` : `x = ${i + 1}`]);
    }
    setRunning(false);
    const nr = runs + 1;
    setRuns(nr);
    if (nr >= 2) markComplete();
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          Prova sia il for che il while (esegui almeno due cicli)
        </div>

        <div className="mb-3 flex gap-2">
          {(["for", "while"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={
                mode === m
                  ? "rounded-md border border-accent bg-accent/10 px-3 py-1.5 font-mono text-sm text-accent"
                  : "rounded-md border border-border bg-background px-3 py-1.5 font-mono text-sm text-muted-foreground hover:border-accent"
              }
            >
              {m}
            </button>
          ))}
        </div>

        <pre className="mb-4 overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-sm text-foreground">
{mode === "for"
  ? `for i in range(${n}):
    print(f"i = {i}")`
  : `x = 0
while x < ${n}:
    x += 1
    print(f"x = {x}")`}
        </pre>

        <div className="mb-4">
          <label className="mb-1 block text-xs text-muted-foreground">Numero di iterazioni: {n}</label>
          <input
            type="range"
            min={1}
            max={8}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </div>

        <button
          onClick={run}
          disabled={running}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-40"
        >
          <Play className="h-3.5 w-3.5" /> Esegui
        </button>

        <div className="mt-4 min-h-24 rounded-lg border border-border bg-black/40 p-3 font-mono text-sm text-emerald-200">
          {output.length === 0 && <span className="text-muted-foreground">Output vuoto</span>}
          {output.map((l, i) => (
            <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-200">{l}</div>
          ))}
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          Cicli eseguiti: <span className="text-accent">{runs}/2</span>
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          for è comodo quando sai su cosa iterare. while è utile quando la fine dipende da una condizione dinamica.
        </InfoNote>
      ) : (
        <SuccessNote>
          Fatto. Hai visto come for e while eseguono lo stesso lavoro con logiche diverse.
        </SuccessNote>
      )}
    </div>
  );
}
