import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type TypeId = "int" | "float" | "str" | "bool";

interface Value {
  id: string;
  label: string;
  type: TypeId;
}

const VALUES: Value[] = [
  { id: "v1", label: "30", type: "int" },
  { id: "v2", label: "9.90", type: "float" },
  { id: "v3", label: '"Ada"', type: "str" },
  { id: "v4", label: "True", type: "bool" },
  { id: "v5", label: "-7", type: "int" },
  { id: "v6", label: '"3.14"', type: "str" },
  { id: "v7", label: "False", type: "bool" },
  { id: "v8", label: "0.5", type: "float" },
];

const TYPES: { id: TypeId; label: string; desc: string; color: string }[] = [
  { id: "int", label: "int", desc: "numero intero", color: "border-primary/50 bg-primary/10" },
  { id: "float", label: "float", desc: "numero con virgola", color: "border-accent/50 bg-accent/10" },
  { id: "str", label: "str", desc: "stringa di testo", color: "border-fuchsia-400/50 bg-fuchsia-500/10" },
  { id: "bool", label: "bool", desc: "vero / falso", color: "border-emerald-400/50 bg-emerald-500/10" },
];

export default function Task02Types({ markComplete, isComplete }: TaskContext) {
  const [placement, setPlacement] = useState<Record<string, TypeId | null>>(
    Object.fromEntries(VALUES.map((v) => [v.id, null])),
  );
  const [tried, setTried] = useState(false);

  const allPlaced = VALUES.every((v) => placement[v.id] !== null);
  const allCorrect = VALUES.every((v) => placement[v.id] === v.type);

  const assign = (valueId: string, typeId: TypeId) => {
    setPlacement((p) => ({ ...p, [valueId]: typeId }));
    setTried(false);
  };
  const check = () => {
    setTried(true);
    if (allCorrect) markComplete();
  };
  const reset = () => {
    setPlacement(Object.fromEntries(VALUES.map((v) => [v.id, null])));
    setTried(false);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Assegna ogni valore al tipo corretto
        </div>

        <div className="mb-6 grid gap-3 sm:grid-cols-4">
          {TYPES.map((t) => {
            const items = VALUES.filter((v) => placement[v.id] === t.id);
            return (
              <div key={t.id} className={cn("min-h-24 rounded-lg border p-3", t.color)}>
                <div className="mb-2 flex items-baseline justify-between">
                  <span className="font-mono text-sm text-foreground">{t.label}</span>
                  <span className="text-[10px] text-muted-foreground">{t.desc}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {items.map((v) => {
                    const ok = tried && v.type === t.id;
                    const bad = tried && v.type !== t.id;
                    return (
                      <button
                        key={v.id}
                        onClick={() => assign(v.id, v.type === t.id ? t.id : t.id)}
                        className={cn(
                          "rounded-md border px-2 py-0.5 font-mono text-xs",
                          ok && "border-success bg-success/10 text-success",
                          bad && "border-destructive bg-destructive/10 text-destructive",
                          !tried && "border-border bg-background text-foreground",
                        )}
                      >
                        {v.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-2 text-xs text-muted-foreground">Valori da assegnare:</div>
        <div className="flex flex-wrap gap-2">
          {VALUES.filter((v) => placement[v.id] === null).map((v) => (
            <div key={v.id} className="flex items-center gap-1 rounded-md border border-border bg-background p-1">
              <span className="pl-1 pr-1 font-mono text-sm text-foreground">{v.label}</span>
              {TYPES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => assign(v.id, t.id)}
                  className="rounded border border-border/50 bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground hover:border-accent hover:text-foreground"
                >
                  {t.label}
                </button>
              ))}
            </div>
          ))}
          {VALUES.every((v) => placement[v.id] !== null) && (
            <span className="text-xs text-muted-foreground">Tutti assegnati.</span>
          )}
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={check}
            disabled={!allPlaced}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
          >
            Verifica
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground transition hover:border-accent"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Ricomincia
          </button>
          {tried && allCorrect && (
            <span className="ml-2 inline-flex items-center gap-1 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" /> Tutti corretti!
            </span>
          )}
          {tried && !allCorrect && (
            <span className="ml-2 text-sm text-destructive">Qualcosa non torna: controlla i colori.</span>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          Attenzione: "3.14" tra virgolette è una stringa, non un float. Le virgolette cambiano tutto.
        </InfoNote>
      ) : (
        <SuccessNote>
          Ora sai riconoscere i quattro tipi primitivi di Python: int, float, str, bool.
        </SuccessNote>
      )}
    </div>
  );
}
