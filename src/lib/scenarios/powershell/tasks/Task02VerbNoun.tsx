import { useState } from "react";
import { CheckCircle2, RefreshCw } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const VERBS = ["Get", "Set", "New", "Remove", "Stop", "Start"];
const NOUNS = ["Process", "Service", "Item", "ChildItem", "Content"];

interface Goal {
  text: string;
  verb: string;
  noun: string;
}

const GOALS: Goal[] = [
  { text: "Elenca i processi in esecuzione", verb: "Get", noun: "Process" },
  { text: "Crea un nuovo file o cartella", verb: "New", noun: "Item" },
  { text: "Ferma un servizio Windows", verb: "Stop", noun: "Service" },
  { text: "Elenca il contenuto di una cartella", verb: "Get", noun: "ChildItem" },
];

export default function Task02VerbNoun({ markComplete, isComplete }: TaskContext) {
  const [idx, setIdx] = useState(0);
  const [verb, setVerb] = useState<string | null>(null);
  const [noun, setNoun] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<"ok" | "no" | null>(null);
  const [solved, setSolved] = useState<boolean[]>(Array(GOALS.length).fill(false));

  const goal = GOALS[idx]!;

  const check = () => {
    if (verb === goal.verb && noun === goal.noun) {
      setFeedback("ok");
      const next = [...solved];
      next[idx] = true;
      setSolved(next);
      if (next.every(Boolean)) markComplete();
    } else {
      setFeedback("no");
    }
  };

  const goNext = () => {
    setIdx((i) => (i + 1) % GOALS.length);
    setVerb(null);
    setNoun(null);
    setFeedback(null);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-mono text-xs uppercase tracking-widest text-accent">
            Obiettivo {idx + 1} / {GOALS.length}
          </div>
          <div className="flex gap-1">
            {solved.map((s, i) => (
              <span
                key={i}
                className={cn(
                  "h-2 w-6 rounded-full",
                  s ? "bg-success" : i === idx ? "bg-accent" : "bg-border",
                )}
              />
            ))}
          </div>
        </div>

        <div className="mb-4 rounded-md border border-border bg-background p-3 text-sm text-foreground">
          {goal.text}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Verbo</div>
            <div className="flex flex-wrap gap-2">
              {VERBS.map((v) => (
                <button
                  key={v}
                  onClick={() => {
                    setVerb(v);
                    setFeedback(null);
                  }}
                  className={cn(
                    "rounded-md border px-3 py-1.5 font-mono text-xs transition",
                    verb === v ? "border-accent bg-accent/20 text-foreground" : "border-border text-muted-foreground hover:border-accent/60",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Sostantivo</div>
            <div className="flex flex-wrap gap-2">
              {NOUNS.map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setNoun(n);
                    setFeedback(null);
                  }}
                  className={cn(
                    "rounded-md border px-3 py-1.5 font-mono text-xs transition",
                    noun === n ? "border-primary bg-primary/25 text-primary-foreground" : "border-border text-muted-foreground hover:border-accent/60",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-md border border-border bg-black/60 p-3 font-mono text-sm">
          <span className="text-gold-soft">PS C:\Lab&gt;</span>
          <span className={cn(verb ? "text-accent" : "text-muted-foreground/50")}>{verb ?? "Verbo"}</span>
          <span className="text-muted-foreground">-</span>
          <span className={cn(noun ? "text-primary-foreground" : "text-muted-foreground/50")}>{noun ?? "Sostantivo"}</span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={check}
            disabled={!verb || !noun}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
          >
            Verifica
          </button>
          <button
            onClick={goNext}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs text-foreground hover:border-accent"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Prossimo obiettivo
          </button>
          {feedback === "ok" && (
            <span className="ml-auto inline-flex items-center gap-1 font-mono text-xs text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> corretto
            </span>
          )}
          {feedback === "no" && <span className="ml-auto font-mono text-xs text-destructive">non è la combinazione giusta</span>}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Completa tutti e {GOALS.length} gli obiettivi per finire il task. Passa da uno all'altro con "Prossimo obiettivo".</InfoNote>
      ) : (
        <SuccessNote>Bravo! Ora sai comporre cmdlet in modo intuitivo, senza dover cercare ogni volta il nome esatto.</SuccessNote>
      )}
    </div>
  );
}
