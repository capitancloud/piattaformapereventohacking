import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Cat = "bash" | "ps" | "both";

const STATEMENTS: { text: string; answer: Cat }[] = [
  { text: "Passa oggetti nella pipeline, non testo", answer: "ps" },
  { text: "I comandi hanno nome libero, come ls o kill", answer: "bash" },
  { text: "Le variabili iniziano con $", answer: "both" },
  { text: "I comandi hanno forma Verbo-Sostantivo (Get-Process)", answer: "ps" },
  { text: "È nato su Unix negli anni '80", answer: "bash" },
  { text: "Ha cicli, condizioni e funzioni", answer: "both" },
];

const LABELS: Record<Cat, string> = {
  bash: "Bash",
  ps: "PowerShell",
  both: "Entrambe",
};

const ORDER: Cat[] = ["bash", "ps", "both"];

export default function Task01Intro({ markComplete, isComplete }: TaskContext) {
  const [answers, setAnswers] = useState<(Cat | null)[]>(Array(STATEMENTS.length).fill(null));
  const [checked, setChecked] = useState(false);

  const allSet = answers.every((a) => a !== null);
  const score = answers.reduce((acc: number, a, i) => acc + (a === STATEMENTS[i]?.answer ? 1 : 0), 0);
  const perfect = score === STATEMENTS.length;

  const cycle = (i: number) => {
    setChecked(false);
    setAnswers((prev) => {
      const next = [...prev];
      const cur = next[i];
      const idx = cur ? ORDER.indexOf(cur) : -1;
      next[i] = ORDER[(idx + 1) % ORDER.length] ?? "bash";
      return next;
    });
  };

  const verify = () => {
    setChecked(true);
    if (score === STATEMENTS.length) markComplete();
  };

  const reset = () => {
    setAnswers(Array(STATEMENTS.length).fill(null));
    setChecked(false);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Clicca l'etichetta per cambiarla: Bash → PowerShell → Entrambe
        </div>
        <ul className="space-y-2">
          {STATEMENTS.map((s, i) => {
            const val = answers[i];
            const correct = checked && val === s.answer;
            const wrong = checked && val && val !== s.answer;
            return (
              <li
                key={i}
                className={cn(
                  "flex items-center justify-between gap-4 rounded-md border p-3 text-sm",
                  correct ? "border-success bg-success/10" : wrong ? "border-destructive bg-destructive/10" : "border-border bg-background",
                )}
              >
                <span className="text-foreground">{s.text}</span>
                <button
                  onClick={() => cycle(i)}
                  className={cn(
                    "min-w-[110px] rounded-full border px-3 py-1 font-mono text-xs transition",
                    val === "bash" && "border-accent bg-accent/20 text-accent",
                    val === "ps" && "border-primary bg-primary/25 text-primary-foreground",
                    val === "both" && "border-gold-soft bg-gold-soft/20 text-gold",
                    !val && "border-border text-muted-foreground hover:border-accent/60",
                  )}
                >
                  {val ? LABELS[val] : "scegli"}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={verify}
            disabled={!allSet}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
          >
            Verifica
          </button>
          {checked && (
            <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs text-foreground hover:border-accent">
              <RotateCcw className="h-3.5 w-3.5" /> Riprova
            </button>
          )}
          {checked && (
            <span className={cn("ml-auto font-mono text-xs", perfect ? "text-success" : "text-destructive")}>
              {score}/{STATEMENTS.length}
            </span>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Suggerimento: due affermazioni valgono per entrambe le shell.</InfoNote>
      ) : (
        <SuccessNote>
          <CheckCircle2 className="mr-1 inline h-4 w-4" /> Perfetto: hai colto la differenza fondamentale tra testo e oggetti.
        </SuccessNote>
      )}
    </div>
  );
}
