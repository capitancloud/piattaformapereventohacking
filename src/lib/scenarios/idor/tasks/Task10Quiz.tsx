import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    q: "Cosa significa l'acronimo IDOR?",
    options: [
      "Internal Data Object Reference",
      "Insecure Direct Object Reference",
      "Identity Denial Or Refusal",
      "Indirect Domain Object Request",
    ],
    correct: 1,
  },
  {
    q: "Qual è la mitigazione principale contro un IDOR?",
    options: [
      "Nascondere gli id agli utenti",
      "Verificare l'autorizzazione lato server per ogni richiesta",
      "Usare solo HTTPS",
      "Cifrare gli id in base64",
    ],
    correct: 1,
  },
  {
    q: "Perché gli UUID casuali sono preferibili agli id incrementali?",
    options: [
      "Sono più corti",
      "Non sono indovinabili in sequenza",
      "Sono cifrati per default",
      "Rendono inutile l'autorizzazione",
    ],
    correct: 1,
  },
  {
    q: "Un bottone disabilitato lato client è sufficiente a impedire un'azione?",
    options: [
      "Sì, il browser lo blocca",
      "No, il controllo va replicato sul server",
    ],
    correct: 1,
  },
  {
    q: "Dove può nascondersi un id manipolabile?",
    options: [
      "Solo nella barra dell'URL",
      "Solo nei cookie",
      "In URL, query string, header, body, campi hidden dei form",
      "Solo nelle API REST",
    ],
    correct: 2,
  },
  {
    q: "In un form, da dove il server deve prendere l'id dell'utente che sta agendo?",
    options: [
      "Da un campo hidden del form",
      "Dalla sessione autenticata lato server",
      "Da un parametro nell'URL",
      "Da un header inviato dal client",
    ],
    correct: 1,
  },
  {
    q: "Un attaccante che itera tutti gli id vicini per trovare risorse altrui sta facendo:",
    options: [
      "Phishing",
      "SQL injection",
      "ID enumeration (fuzzing)",
      "Cross-site scripting",
    ],
    correct: 2,
  },
  {
    q: "Perché l'id 1 è spesso pericoloso in un sistema con id incrementali?",
    options: [
      "È bloccato di default",
      "Corrisponde tipicamente al primo account, spesso amministratore",
      "È riservato al sistema operativo",
      "Non esiste mai in produzione",
    ],
    correct: 1,
  },
  {
    q: "Un IDOR può portare a privilege escalation?",
    options: [
      "No, permette solo di leggere dati",
      "Sì, se combinato con id prevedibili di account privilegiati",
      "Solo se il sito usa HTTP",
      "Solo nelle applicazioni mobile",
    ],
    correct: 1,
  },
  {
    q: "Quale principio riassume meglio la difesa contro l'IDOR?",
    options: [
      "Security through obscurity",
      "Never trust the client, autorizza sempre lato server",
      "Cifra tutto in base64",
      "Nascondi gli endpoint",
    ],
    correct: 1,
  },
];

export default function Task10Quiz({ markComplete, isComplete }: TaskContext) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
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
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-border bg-surface p-5 shadow-2xl shadow-black/40"
          >
            <p className="mb-3 font-serif text-lg text-ivory">
              <span className="mr-2 font-mono text-xs text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
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

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          onClick={check}
          disabled={answers.some((a) => a === null)}
          className="rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Verifica risposte
        </button>
        {checked && (
          <span
            className={cn(
              "text-sm",
              allRight ? "text-success" : "text-muted-foreground",
            )}
          >
            {rightCount} / {QUESTIONS.length} corrette
            {!allRight && " — rivedi le sbagliate e riprova."}
          </span>
        )}
      </div>

      {isComplete && (
        <SuccessNote>
          Complimenti. Hai completato il modulo IDOR. Le tre regole d'oro:{" "}
          <strong>autorizzazione server-side</strong>, <strong>id non prevedibili</strong>,{" "}
          <strong>nessuna fiducia nel client</strong>.
        </SuccessNote>
      )}
    </div>
  );
}
