import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    q: "Cosa è, in senso stretto, Linux?",
    options: ["Una distribuzione completa", "Il kernel", "Un desktop environment", "Un antivirus"],
    correct: 1,
  },
  {
    q: "Quale distribuzione è pensata principalmente per penetration testing?",
    options: ["Ubuntu", "Fedora", "Kali Linux", "CentOS"],
    correct: 2,
  },
  {
    q: "Quale comando mostra la cartella corrente?",
    options: ["whoami", "pwd", "ls", "cd"],
    correct: 1,
  },
  {
    q: "Cosa fa il comando cd ..?",
    options: ["Va nella cartella home", "Sale di una cartella", "Entra nella cartella '..'", "Cancella la cartella"],
    correct: 1,
  },
  {
    q: "Quale comando crea una nuova directory?",
    options: ["touch", "mkdir", "rm", "mv"],
    correct: 1,
  },
  {
    q: "In 'rwx', la x significa:",
    options: ["eseguire", "scrivere", "leggere", "eliminare"],
    correct: 0,
  },
  {
    q: "Quando serve sudo?",
    options: [
      "Sempre, per ogni comando",
      "Mai, è opzionale",
      "Per operazioni che richiedono privilegi di root",
      "Solo per aprire file nella home",
    ],
    correct: 2,
  },
  {
    q: "Quale comando termina un processo dato il suo PID?",
    options: ["ps", "top", "kill", "systemctl"],
    correct: 2,
  },
  {
    q: "Cosa fa apt update?",
    options: [
      "Installa nuovi pacchetti",
      "Aggiorna l'elenco dei pacchetti disponibili",
      "Rimuove pacchetti obsoleti",
      "Aggiorna il kernel",
    ],
    correct: 1,
  },
  {
    q: "Quale comando mostra l'utente corrente?",
    options: ["pwd", "whoami", "id", "user"],
    correct: 1,
  },
];

export default function Task10Quiz({ markComplete, isComplete }: TaskContext) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [checked, setChecked] = useState(false);

  const rightCount = QUESTIONS.filter((q, i) => answers[i] === q.correct).length;
  const passed = rightCount >= 7;

  const check = () => {
    setChecked(true);
    if (passed) markComplete();
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
          <span className={cn("text-sm", passed ? "text-success" : "text-muted-foreground")}>
            {rightCount} / {QUESTIONS.length} corrette
            {!passed && " — servono almeno 7/10."}
          </span>
        )}
      </div>

      {isComplete && (
        <SuccessNote>
          Hai completato il modulo Linux. Ora sai muoverti nella shell, gestire file, permessi, utenti, processi e
          pacchetti.
        </SuccessNote>
      )}
    </div>
  );
}
