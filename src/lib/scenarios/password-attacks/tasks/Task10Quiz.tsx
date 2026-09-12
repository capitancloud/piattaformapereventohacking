import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const QUESTIONS = [
  {
    q: "Qual è la differenza principale tra attacco online e offline alle password?",
    options: [
      "L'online usa internet, l'offline no",
      "L'online parla con il servizio, l'offline lavora su hash già rubati",
      "Non c'è differenza",
    ],
    answer: 1,
  },
  {
    q: "Quale password è più difficile da craccare con brute force?",
    options: ["P@ssw0rd!", "Estate2024!", "gatto viola scarpa tuono lampada"],
    answer: 2,
  },
  {
    q: "Un hash che inizia con $2y$ è di solito…",
    options: ["MD5", "bcrypt", "SHA256"],
    answer: 1,
  },
  {
    q: "A cosa serve il sale (salt) negli hash delle password?",
    options: [
      "A rendere l'hash più corto",
      "A rendere inutili le rainbow table e a differenziare hash di password uguali",
      "A cifrare la password",
    ],
    answer: 1,
  },
  {
    q: "Cos'è una wordlist come rockyou.txt?",
    options: [
      "Un dizionario di password reali trapelate, ordinato per popolarità",
      "Un tool per craccare bcrypt",
      "Un file di configurazione di hashcat",
    ],
    answer: 0,
  },
  {
    q: "Perché il credential stuffing funziona così bene?",
    options: [
      "Perché indovina password nuove",
      "Perché tantissime persone riusano la stessa password in più servizi",
      "Perché rompe il TLS",
    ],
    answer: 1,
  },
  {
    q: "Il password spraying evita i blocchi perché…",
    options: [
      "Prova una sola password contro molti account, un tentativo per account",
      "Usa una VPN",
      "Cifra i tentativi",
    ],
    answer: 0,
  },
  {
    q: "Se sbagli la modalità -m su hashcat cosa succede?",
    options: [
      "Hashcat protesta e ti corregge",
      "Hashcat prova con l'algoritmo sbagliato e non trova nulla",
      "Hashcat trova comunque la password ma più lento",
    ],
    answer: 1,
  },
  {
    q: "Quale è la difesa più efficace contro il credential stuffing?",
    options: [
      "Cambiare password ogni 30 giorni",
      "Password diverse per ogni servizio + MFA",
      "Usare un antivirus",
    ],
    answer: 1,
  },
  {
    q: "Una GPU moderna prova miliardi di hash MD5 al secondo. Bcrypt invece…",
    options: [
      "Va alla stessa velocità",
      "Va molto più lento di proposito, per rendere il brute force inutile",
      "Non può essere craccato in alcun modo",
    ],
    answer: 1,
  },
];

const MIN = 7;

export default function Task10Quiz({ markComplete, isComplete }: TaskContext) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const score = answers.reduce((acc: number, a, i) => acc + (a === QUESTIONS[i]?.answer ? 1 : 0), 0);
  const all = answers.every((a) => a !== null);

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
      <div className="min-w-0 rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-accent">
          <span>10 domande · minimo {MIN}/10</span>
          {submitted && <span className={cn(score >= MIN ? "text-success" : "text-destructive")}>Punteggio: {score}/10</span>}
        </div>

        <ol className="space-y-4">
          {QUESTIONS.map((q, i) => (
            <li key={i} className="min-w-0 rounded-md border border-border bg-background p-3">
              <div className="mb-2 break-words text-sm text-foreground">
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
                        "min-w-0 rounded-md border px-3 py-1.5 text-left text-xs transition",
                        selected && !submitted && "border-accent bg-accent/15 text-foreground",
                        correct && "border-success bg-success/10 text-success",
                        wrong && "border-destructive bg-destructive/10 text-destructive",
                        !selected && !correct && !wrong && "border-border bg-surface text-muted-foreground hover:border-accent/50",
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex items-center gap-3">
          {!submitted ? (
            <Button disabled={!all} onClick={submit}>Consegna il quiz</Button>
          ) : (
            <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /> Riprova</Button>
          )}
        </div>
      </div>

      {!submitted && <InfoNote>Rispondi a tutte le domande e consegna: bastano 7 risposte corrette.</InfoNote>}
      {submitted && score < MIN && (
        <WarnNote>Rileggi i task delle domande sbagliate e riprova: sei vicinissimo.</WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai completato lo scenario Attacchi alle Password. Ora sai riconoscere l'attacco giusto per il contesto giusto — e sai anche come difenderti.
        </SuccessNote>
      )}
    </div>
  );
}
