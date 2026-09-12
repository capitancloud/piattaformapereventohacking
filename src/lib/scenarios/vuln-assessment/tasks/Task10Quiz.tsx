import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const QUESTIONS = [
  { q: "Che cos'è una vulnerabilità?", options: ["Un attacco riuscito", "Un punto debole sfruttabile", "Un antivirus"], answer: 1 },
  { q: "Qual è la prima fase di un vulnerability assessment?", options: ["Report", "Inventario degli asset", "Sfruttamento"], answer: 1 },
  { q: "Che cosa fa uno scanner come Nessus o OpenVAS?", options: ["Cifra il traffico", "Confronta ciò che trova con database di vulnerabilità note", "Cancella le vulnerabilità"], answer: 1 },
  { q: "Un CVSS di 9.8 è considerato…", options: ["Basso", "Medio", "Critico"], answer: 2 },
  { q: "Cos'è un falso positivo?", options: ["Un problema vero", "Una segnalazione che non corrisponde a un problema reale", "Un exploit riuscito"], answer: 1 },
  { q: "Cosa identifica un codice CVE?", options: ["Un utente", "Una vulnerabilità nota, in modo univoco", "Un firewall"], answer: 1 },
  { q: "Cosa aumenta la priorità di una vulnerabilità?", options: ["Essere in una rete isolata senza dati", "Essere esposta a internet con exploit pubblico e dati sensibili", "Avere un CVSS basso"], answer: 1 },
  { q: "Qual è la remediation migliore per un software vulnerabile?", options: ["Aggiornare alla versione patchata", "Cambiare la password dell'admin", "Nascondere il banner"], answer: 0 },
  { q: "Un report di vulnerability assessment dovrebbe contenere sempre…", options: ["Solo l'elenco dei tool usati", "Descrizione, CVSS, prova, impatto e remediation", "Solo screenshot"], answer: 1 },
  { q: "Il vulnerability assessment è utile perché…", options: ["Sostituisce il pentest", "Trova in modo sistematico i punti deboli prima degli attaccanti", "Rende inutile la formazione"], answer: 1 },
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
                <span className="mr-2 font-mono text-accent">{i + 1}.</span>{q.q}
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
      {!submitted && <InfoNote>Sette risposte corrette su dieci per completare lo scenario.</InfoNote>}
      {submitted && score < MIN && <WarnNote>Ancora qualche dubbio: rileggi i micro-task delle domande sbagliate e riprova.</WarnNote>}
      {isComplete && (
        <SuccessNote>
          Complimenti: hai completato lo scenario Vulnerability Assessment. Ora sai come si trova, si valuta e
          si racconta una vulnerabilità in modo utile.
        </SuccessNote>
      )}
    </div>
  );
}
