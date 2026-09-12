import { useState } from "react";
import { GitBranch, Play } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const OPS = [
  { id: "-ge", label: "≥ (maggiore o uguale)" },
  { id: "-gt", label: "> (maggiore)" },
  { id: "-lt", label: "< (minore)" },
  { id: "-eq", label: "= (uguale)" },
];

export default function Task06IfElse({ markComplete, isComplete }: TaskContext) {
  const [eta, setEta] = useState(18);
  const [op, setOp] = useState("-ge");
  const [val, setVal] = useState(18);
  const [ran, setRan] = useState(0);
  const [branch, setBranch] = useState<"then" | "else" | null>(null);

  const evalCond = () => {
    if (op === "-ge") return eta >= val;
    if (op === "-gt") return eta > val;
    if (op === "-lt") return eta < val;
    return eta === val;
  };

  const run = () => {
    const b = evalCond() ? "then" : "else";
    setBranch(b);
    const next = ran + 1;
    setRan(next);
    if (next >= 2) markComplete();
  };

  const opLabel = OPS.find((o) => o.id === op)!.label;

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
          <GitBranch className="h-4 w-4" /> Componi la condizione
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="rounded-md border border-border bg-background p-3">
            <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Variabile $eta</div>
            <input
              type="range"
              min={0}
              max={100}
              value={eta}
              onChange={(e) => setEta(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="mt-1 font-mono text-lg text-accent">{eta}</div>
          </label>
          <div className="rounded-md border border-border bg-background p-3">
            <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Operatore</div>
            <div className="flex flex-wrap gap-1">
              {OPS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOp(o.id)}
                  className={cn(
                    "rounded border px-2 py-1 font-mono text-xs transition",
                    op === o.id ? "border-accent bg-accent/20 text-foreground" : "border-border text-muted-foreground hover:border-accent/60",
                  )}
                >
                  {o.id}
                </button>
              ))}
            </div>
          </div>
          <label className="rounded-md border border-border bg-background p-3">
            <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Valore soglia</div>
            <input
              type="range"
              min={0}
              max={100}
              value={val}
              onChange={(e) => setVal(Number(e.target.value))}
              className="w-full accent-accent"
            />
            <div className="mt-1 font-mono text-lg text-accent">{val}</div>
          </label>
        </div>

        <pre className="mt-4 overflow-auto rounded-md border border-border bg-black/70 p-3 font-mono text-xs text-ivory">
{`if [ "$eta" ${op} ${val} ]; then
  echo "Sei maggiorenne / condizione vera"
else
  echo "Condizione falsa"
fi`}
        </pre>

        <button
          onClick={run}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110"
        >
          <Play className="h-3.5 w-3.5" /> Esegui
        </button>

        {branch && (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className={cn("rounded-lg border p-3 transition", branch === "then" ? "border-success bg-success/10" : "border-border/50 opacity-40")}>
              <div className="mb-1 font-mono text-xs text-success">THEN</div>
              <div className="text-sm text-foreground">Condizione vera: {eta} {opLabel.split(" ")[0]} {val}</div>
            </div>
            <div className={cn("rounded-lg border p-3 transition", branch === "else" ? "border-destructive bg-destructive/10" : "border-border/50 opacity-40")}>
              <div className="mb-1 font-mono text-xs text-destructive">ELSE</div>
              <div className="text-sm text-foreground">Condizione falsa</div>
            </div>
          </div>
        )}

        <div className={cn("mt-3 text-xs", ran >= 2 ? "text-success" : "text-muted-foreground")}>
          Esecuzioni: {ran}/2
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Esegui almeno due volte cambiando valori o operatore per vedere entrambi i rami.</InfoNote>
      ) : (
        <SuccessNote>Le condizioni sono ovunque negli script: ora sai come costruirle e leggerle.</SuccessNote>
      )}
    </div>
  );
}
