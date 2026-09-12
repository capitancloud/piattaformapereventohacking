import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const QUESTIONS = [
  {
    q: "Che cos'è, in una parola, l'enumerazione?",
    options: ["Scoperta degli host accesi", "Dialogo coi servizi per estrarne informazioni", "Sfruttamento di vulnerabilità"],
    answer: 1,
  },
  {
    q: "Cosa rivela subito un banner SSH come «SSH-2.0-OpenSSH_7.4»?",
    options: ["Le password degli utenti", "Prodotto e versione del server", "L'indirizzo del client"],
    answer: 1,
  },
  {
    q: "Le condivisioni SMB che finiscono con il dollaro (ADMIN$, C$)…",
    options: ["Sono aperte a tutti", "Sono nascoste e amministrative", "Contengono sempre backup"],
    answer: 1,
  },
  {
    q: "Quale record DNS indica dove passa la posta di un dominio?",
    options: ["A", "MX", "TXT"],
    answer: 1,
  },
  {
    q: "Cosa fa il comando SMTP «VRFY marco»?",
    options: ["Invia una mail a marco", "Chiede al server se l'utente esiste", "Cancella la casella di marco"],
    answer: 1,
  },
  {
    q: "Il tool gobuster serve a…",
    options: ["Craccare password", "Provare tanti nomi di percorsi su un sito", "Analizzare pacchetti di rete"],
    answer: 1,
  },
  {
    q: "SNMP con la community «public» è pericoloso perché…",
    options: ["Espone informazioni di sistema senza autenticazione", "Cripta il traffico troppo bene", "Impedisce il funzionamento del server"],
    answer: 0,
  },
  {
    q: "Un FTP che accetta l'utente «anonymous» significa che…",
    options: ["Il server è offline", "Chiunque può collegarsi senza password", "Il firewall blocca gli accessi"],
    answer: 1,
  },
  {
    q: "Il transferimento di zona DNS (AXFR) è pericoloso perché…",
    options: ["Consegna l'intero elenco dei nomi della zona", "Rende il DNS più lento", "Cancella i record"],
    answer: 0,
  },
  {
    q: "Nel rapporto di un pentest, una gravità «alta» corrisponde a…",
    options: ["Un'informazione utile ma non sfruttabile", "Una scoperta che porta a un impatto reale e immediato", "Un dettaglio da ignorare"],
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

      {!submitted && <InfoNote>Rispondi a tutte le domande e consegna: bastano 7 risposte corrette per completare lo scenario.</InfoNote>}
      {submitted && score < MIN && (
        <WarnNote>Ancora qualche dubbio: rileggi i micro-task che riguardano le domande sbagliate e ripeti il quiz.</WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Complimenti: hai completato lo scenario Enumerazione. Ora sai riconoscere quando un
          servizio parla più di quanto dovrebbe e come sfruttare quel dettaglio per orientare il resto del pentest.
        </SuccessNote>
      )}
    </div>
  );
}
