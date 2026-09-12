import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    q: "Cosa è Linux, in senso stretto?",
    options: [
      "Una distribuzione completa di sistema operativo",
      "Il kernel che gestisce hardware e processi",
      "Un programma per scrivere codice",
      "Un antivirus open source",
    ],
    correct: 1,
  },
  {
    q: "Chi ha creato il kernel Linux?",
    options: ["Richard Stallman", "Linus Torvalds", "Steve Jobs", "Bill Gates"],
    correct: 1,
  },
  {
    q: "Cosa distingue Linux da Windows o macOS?",
    options: [
      "È a pagamento per uso aziendale",
      "Il codice sorgente è pubblico e modificabile",
      "Funziona solo su server",
      "Non ha un'interfaccia a riga di comando",
    ],
    correct: 1,
  },
];

export default function Task01Intro({ markComplete, isComplete }: TaskContext) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [checked, setChecked] = useState(false);

  const rightCount = QUESTIONS.filter((q, i) => answers[i] === q.correct).length;
  const allRight = rightCount === QUESTIONS.length;

  const check = () => {
    setChecked(true);
    if (allRight) markComplete();
  };

  return (
    <div>
      <div className="space-y-4">
        {QUESTIONS.map((q, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-5">
            <p className="mb-3 font-display text-lg text-foreground">
              <span className="mr-2 font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              {q.q}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, j) => {
                const selected = answers[i] === j;
                const isCorrect = checked && j === q.correct;
                const isWrong = checked && selected && j !== q.correct;
                return (
                  <button
                    key={j}
                    onClick={() => {
                      const a = [...answers];
                      a[i] = j;
                      setAnswers(a);
                      setChecked(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md border px-4 py-2.5 text-left text-sm transition",
                      selected
                        ? "border-accent bg-accent/10 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-accent/50 hover:text-foreground",
                      isCorrect && "border-success bg-success/10 text-foreground",
                      isWrong && "border-destructive bg-destructive/10 text-foreground",
                    )}
                  >
                    <span>{opt}</span>
                    {isCorrect && <CheckCircle2 className="h-4 w-4 text-success" />}
                    {isWrong && <XCircle className="h-4 w-4 text-destructive" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          onClick={check}
          disabled={answers.some((a) => a === null)}
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Verifica risposte
        </button>
        {checked && (
          <span className={cn("text-sm", allRight ? "text-success" : "text-muted-foreground")}>
            {rightCount} / {QUESTIONS.length} corrette
            {!allRight && " — riprova."}
          </span>
        )}
      </div>

      {!isComplete ? (
        <InfoNote>
          Linux è solo il kernel. A quel kernel si aggiungono programmi, librerie e strumenti per formare una
          distribuzione.
        </InfoNote>
      ) : (
        <SuccessNote>
          Ottimo inizio. Linux = kernel open source creato da Linus Torvalds. Tutto il resto è una distribuzione.
        </SuccessNote>
      )}
    </div>
  );
}
