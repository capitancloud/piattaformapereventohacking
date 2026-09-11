import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    q: "Qual è la mitigazione principale contro un IDOR?",
    options: [
      "Nascondere gli id agli utenti",
      "Verificare l'autorizzazione lato server per ogni richiesta",
      "Usare HTTPS",
      "Cifrare gli id in base64",
    ],
    correct: 1,
  },
  {
    q: "Perché gli UUID sono meglio degli id incrementali?",
    options: [
      "Sono più corti",
      "Non sono indovinabili in sequenza",
      "Sono cifrati",
      "Non serviranno mai autorizzazione",
    ],
    correct: 1,
  },
  {
    q: "Un bottone disabilitato lato client è sufficiente a impedire un'azione?",
    options: ["Sì, il browser lo blocca", "No, il controllo va replicato sul server"],
    correct: 1,
  },
];

export default function Task10Quiz({ markComplete, isComplete }: TaskContext) {
  const [answers, setAnswers] = useState<(number | null)[]>([null, null, null]);
  const [checked, setChecked] = useState(false);

  const allRight = QUESTIONS.every((q, i) => answers[i] === q.correct);

  const check = () => {
    setChecked(true);
    if (allRight) markComplete();
  };

  return (
    <div>
      <div className="space-y-4">
        {QUESTIONS.map((q, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-2xl shadow-black/40"
          >
            <p className="mb-3 font-serif text-lg text-ivory">{q.q}</p>
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
                        ? "border-gold bg-gold/10 text-ivory"
                        : "border-border bg-background text-muted-foreground hover:border-gold/50 hover:text-ivory",
                      isCorrect && "border-success bg-success/10 text-ivory",
                      isWrong && "border-destructive bg-destructive/10 text-ivory",
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

      <button
        onClick={check}
        disabled={answers.some((a) => a === null)}
        className="mt-4 rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Verifica risposte
      </button>

      {isComplete && (
        <SuccessNote>
          Complimenti. Hai completato il modulo IDOR. Le tre regole d'oro: <strong>autorizzazione
          server-side</strong>, <strong>id non prevedibili</strong>, <strong>nessuna fiducia nel
          client</strong>.
        </SuccessNote>
      )}
    </div>
  );
}
