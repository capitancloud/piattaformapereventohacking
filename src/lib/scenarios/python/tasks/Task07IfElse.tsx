import { useState, useMemo } from "react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

export default function Task07IfElse({ markComplete, isComplete }: TaskContext) {
  const [eta, setEta] = useState(18);
  const [visited, setVisited] = useState<Set<string>>(new Set());

  const branch = useMemo(() => {
    if (eta >= 18) return "adult";
    if (eta >= 14) return "teen";
    return "minor";
  }, [eta]);

  const label = branch === "adult" ? "maggiorenne" : branch === "teen" ? "adolescente" : "minore";

  const onChange = (v: number) => {
    setEta(v);
    const nb = v >= 18 ? "adult" : v >= 14 ? "teen" : "minor";
    const next = new Set(visited);
    next.add(nb);
    setVisited(next);
    if (next.size === 3) markComplete();
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          Muovi lo slider e visita tutti e tre i rami (minore, adolescente, maggiorenne)
        </div>

        <pre className="mb-4 overflow-x-auto rounded-lg border border-border bg-background p-3 font-mono text-sm text-foreground">
{`eta = ${eta}
if eta >= 18:
    print("maggiorenne")
elif eta >= 14:
    print("adolescente")
else:
    print("minore")`}
        </pre>

        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          <Ramo active={branch === "minor"} visited={visited.has("minor")} label="minore" cond="else" />
          <Ramo active={branch === "teen"} visited={visited.has("teen")} label="adolescente" cond="elif eta >= 14" />
          <Ramo active={branch === "adult"} visited={visited.has("adult")} label="maggiorenne" cond="if eta >= 18" />
        </div>

        <input
          type="range"
          min={0}
          max={30}
          value={eta}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span className="font-mono text-accent">eta = {eta} → {label}</span>
          <span>30</span>
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          Rami visitati: <span className="text-accent">{visited.size}/3</span>
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          I due punti dopo la condizione aprono il blocco. L'indentazione (4 spazi) definisce cosa ci sta dentro.
        </InfoNote>
      ) : (
        <SuccessNote>
          Perfetto. Hai visto come if / elif / else si escludono a vicenda: solo un ramo viene eseguito.
        </SuccessNote>
      )}
    </div>
  );
}

function Ramo({ active, visited, label, cond }: { active: boolean; visited: boolean; label: string; cond: string }) {
  return (
    <div
      className={cn(
        "rounded-md border p-3 transition",
        active ? "border-accent bg-accent/10" : visited ? "border-success/40 bg-success/5" : "border-border bg-background",
      )}
    >
      <div className="font-mono text-xs text-muted-foreground">{cond}</div>
      <div className={cn("mt-1 font-display text-lg", active ? "text-accent" : "text-foreground")}>
        {label}
      </div>
    </div>
  );
}
