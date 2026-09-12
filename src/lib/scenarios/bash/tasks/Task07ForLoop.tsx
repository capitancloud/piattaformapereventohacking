import { useEffect, useState } from "react";
import { Play, Repeat } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";

const NAMES = ["web1", "web2", "web3", "web4", "web5", "web6"];

export default function Task07ForLoop({ markComplete, isComplete }: TaskContext) {
  const [n, setN] = useState(3);
  const [running, setRunning] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [ran, setRan] = useState(0);

  useEffect(() => {
    if (!running) return;
    const items = NAMES.slice(0, n);
    setOutput([]);
    let i = 0;
    const id = setInterval(() => {
      if (i >= items.length) {
        setRunning(false);
        clearInterval(id);
        setRan((r) => {
          const nr = r + 1;
          if (nr >= 1 && n >= 3) markComplete();
          return nr;
        });
        return;
      }
      setOutput((o) => [...o, `→ ping ${items[i]}: risposta in ${(Math.random() * 20 + 5).toFixed(1)}ms`]);
      i++;
    }, 500);
    return () => clearInterval(id);
  }, [running, n, markComplete]);

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
          <Repeat className="h-4 w-4" /> Ripeti un'azione con for
        </div>

        <label className="mb-4 block rounded-md border border-border bg-background p-3">
          <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            Quanti host vuoi contattare? <span className="text-accent">{n}</span>
          </div>
          <input
            type="range"
            min={1}
            max={NAMES.length}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            className="w-full accent-primary"
            disabled={running}
          />
        </label>

        <pre className="overflow-auto rounded-md border border-border bg-black/70 p-3 font-mono text-xs text-ivory">
{`for host in ${NAMES.slice(0, n).join(" ")}; do
  ping -c1 $host
done`}
        </pre>

        <button
          onClick={() => setRunning(true)}
          disabled={running}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
        >
          <Play className="h-3.5 w-3.5" /> {running ? "In esecuzione…" : "Esegui"}
        </button>

        {output.length > 0 && (
          <div className="mt-4 rounded-md border border-border bg-black/70 p-3 font-mono text-xs text-ivory">
            {output.map((l, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">{l}</div>
            ))}
          </div>
        )}

        <div className="mt-3 text-xs text-muted-foreground">
          Servono almeno 3 elementi per completare. Esecuzioni: {ran}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Aumenta lo slider e osserva ogni riga apparire una alla volta: è esattamente ciò che fa il for.</InfoNote>
      ) : (
        <SuccessNote>Il for scala: un file, cento file, mille IP. La stessa logica, riusata.</SuccessNote>
      )}
    </div>
  );
}
