import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";

export default function Task07ForEach({ markComplete, isComplete }: TaskContext) {
  const [n, setN] = useState(3);
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
  }, []);

  const run = () => {
    if (timer.current) window.clearInterval(timer.current);
    setLines([]);
    setRunning(true);
    let i = 1;
    timer.current = window.setInterval(() => {
      if (i > n) {
        window.clearInterval(timer.current!);
        timer.current = null;
        setRunning(false);
        if (n >= 3) markComplete();
        return;
      }
      setLines((prev) => [...prev, `server-${i}`]);
      i++;
    }, 350);
  };

  const reset = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    setRunning(false);
    setLines([]);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Genera N nomi di server usando la pipeline
        </div>

        <div className="mb-4 min-w-0 break-words [overflow-wrap:anywhere] rounded-md border border-border bg-black/60 p-3 font-mono text-sm">
          <span className="text-gold-soft">PS&gt;</span>{" "}
          <span className="text-ivory">1..</span>
          <span className="text-accent">{n}</span>
          <span className="text-ivory"> | ForEach-Object &#123; </span>
          <span className="text-primary">"server-$_"</span>
          <span className="text-ivory"> &#125;</span>
        </div>

        <label className="mb-1 block text-xs text-muted-foreground">Numero di elementi: <span className="font-mono text-foreground">{n}</span></label>
        <input
          type="range"
          min={1}
          max={8}
          value={n}
          onChange={(e) => setN(parseInt(e.target.value, 10))}
          disabled={running}
          className="w-full accent-[color:var(--color-primary)]"
        />

        <div className="mt-4 flex gap-2">
          <button
            onClick={run}
            disabled={running}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
          >
            <Play className="h-3.5 w-3.5" /> Esegui
          </button>
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs text-foreground hover:border-accent">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
        </div>

        {(lines.length > 0 || running) && (
          <div className="mt-4 rounded-md border border-border bg-black/70 p-3 font-mono text-sm">
            {lines.map((l, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-left-1 text-ivory duration-300">
                {l}
              </div>
            ))}
            {running && <div className="text-muted-foreground">▍</div>}
          </div>
        )}
      </div>

      {!isComplete ? (
        <InfoNote>Sposta lo slider ad almeno 3, poi premi Esegui. La variabile $_ è il numero corrente della sequenza.</InfoNote>
      ) : (
        <SuccessNote>ForEach-Object è la chiave dell'automazione: applica un blocco a ogni oggetto della pipeline.</SuccessNote>
      )}
    </div>
  );
}
