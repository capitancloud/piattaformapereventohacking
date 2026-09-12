import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

interface Q {
  q: string;
  options: string[];
  answer: number;
}

const QUESTIONS: Q[] = [
  { q: "Python è un linguaggio...", options: ["Compilato", "Interpretato", "Assemblato"], answer: 1 },
  { q: "In Python i blocchi di codice sono definiti da...", options: ["Parentesi graffe { }", "L'indentazione", "Il punto e virgola ;"], answer: 1 },
  { q: "Quale di questi è un float?", options: ["30", "\"30\"", "9.90"], answer: 2 },
  { q: "Come richiami la variabile nome in una f-string?", options: ["$nome", "{nome} dentro f\"...\"", "%nome%"], answer: 1 },
  { q: "input() restituisce sempre...", options: ["Un intero", "Una stringa", "Un booleano"], answer: 1 },
  { q: "Come aggiungi un elemento in fondo a una lista?", options: [".push()", ".append()", ".add()"], answer: 1 },
  { q: "Un dizionario è una collezione di...", options: ["Elementi in ordine", "Coppie chiave → valore", "Numeri unici"], answer: 1 },
  { q: "Quale parola apre il ramo intermedio di un if?", options: ["else if", "elif", "elseif"], answer: 1 },
  { q: "range(3) produce...", options: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3"], answer: 1 },
  { q: "Quale parola definisce una funzione?", options: ["function", "def", "func"], answer: 1 },
];

const MIN = 7;

export default function Task10Quiz({ markComplete, isComplete }: TaskContext) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const score = answers.reduce((acc: number, a, i) => acc + (a === QUESTIONS[i]?.answer ? 1 : 0), 0);
  const allAnswered = answers.every((a) => a !== null);

  const submit = () => {
    setSubmitted(true);
    if (score >= MIN) markComplete();
  };
  const reset = () => {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setSubmitted(false);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-accent">
          <span>10 domande · minimo {MIN}/10</span>
          {submitted && <span className={cn(score >= MIN ? "text-success" : "text-destructive")}>Punteggio: {score}/10</span>}
        </div>

        <ol className="space-y-4">
          {QUESTIONS.map((q, i) => (
            <li key={i} className="rounded-md border border-border bg-background p-3">
              <div className="mb-2 text-sm text-foreground">
                <span className="mr-2 font-mono text-accent">{i + 1}.</span>
                {q.q}
              </div>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[i] === oi;
                  const correct = submitted && oi === q.answer;
                  const wrong = submitted && selected && oi !== q.answer;
                  return (
                    <button
                      key={oi}
                      onClick={() => {
                        if (submitted) return;
                        const next = [...answers];
                        next[i] = oi;
                        setAnswers(next);
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition",
                        selected && !submitted && "border-accent bg-accent/15 text-foreground",
                        correct && "border-success bg-success/10 text-success",
                        wrong && "border-destructive bg-destructive/10 text-destructive",
                        !selected && !submitted && "border-border text-muted-foreground hover:border-accent/60 hover:text-foreground",
                      )}
                    >
                      {correct && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {wrong && <XCircle className="h-3.5 w-3.5" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-4 flex gap-2">
          {!submitted ? (
            <button
              onClick={submit}
              disabled={!allAnswered}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
            >
              Consegna
            </button>
          ) : (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground transition hover:border-accent"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Riprova
            </button>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Rileggi il task corrispondente se una domanda ti mette in dubbio: la teoria è tutta lì.</InfoNote>
      ) : (
        <SuccessNote>Modulo Python completato! Hai le basi per leggere codice altrui e scrivere i tuoi primi script.</SuccessNote>
      )}
    </div>
  );
}
