import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    q: "Quale di questi è un indirizzo IP privato?",
    options: ["8.8.8.8", "192.168.1.10", "127.0.0.1", "93.184.216.34"],
    correct: 1,
  },
  {
    q: "Cosa significa la notazione /24 dopo un indirizzo IP?",
    options: [
      "24 sono i bit riservati agli host",
      "24 sono i bit che identificano la rete",
      "L'IP appartiene alla classe A",
      "Il TTL vale 24",
    ],
    correct: 1,
  },
  {
    q: "L'indirizzo MAC lavora a livello…",
    options: ["Applicativo", "Livello 2 (data link)", "Livello 3 (network)", "Livello 4 (trasporto)"],
    correct: 1,
  },
  {
    q: "Il protocollo ARP serve a:",
    options: [
      "Assegnare un IP a un nuovo dispositivo",
      "Tradurre un IP nella LAN nel suo MAC address",
      "Risolvere un nome a dominio in IP",
      "Cifrare il traffico interno",
    ],
    correct: 1,
  },
  {
    q: "Uno switch, all'inizio, con la MAC-table vuota…",
    options: [
      "Non inoltra nulla",
      "Fa flooding: manda il frame a tutte le porte tranne quella di origine",
      "Blocca l'host sorgente",
      "Genera un errore ARP",
    ],
    correct: 1,
  },
  {
    q: "Un router lavora principalmente al livello…",
    options: ["2 (data link)", "3 (network / IP)", "4 (trasporto / TCP)", "7 (applicativo)"],
    correct: 1,
  },
  {
    q: "A cosa serve il TTL nell'header IP?",
    options: [
      "Cifra il payload",
      "Impedisce che i pacchetti girino all'infinito: ogni router lo decrementa",
      "Autentica il mittente",
      "Contiene la porta di destinazione",
    ],
    correct: 1,
  },
  {
    q: "Il NAT permette di…",
    options: [
      "Assegnare un IP pubblico a ogni dispositivo interno",
      "Far uscire più dispositivi interni con un solo IP pubblico, distinguendoli via porta",
      "Cifrare il traffico verso Internet",
      "Bloccare tutte le connessioni entranti",
    ],
    correct: 1,
  },
  {
    q: "Il DNS traduce…",
    options: [
      "Un IP nel suo MAC",
      "Un nome a dominio in un indirizzo IP",
      "Una porta nel nome del servizio",
      "Un pacchetto TCP in UDP",
    ],
    correct: 1,
  },
  {
    q: "Una porta con stato «filtered» in un port scan significa che…",
    options: [
      "Il servizio è attivo e risponde",
      "Nessun servizio è in ascolto",
      "Un firewall in mezzo scarta la richiesta senza risposta",
      "La rete è caduta",
    ],
    correct: 2,
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
            <p className="mb-3 font-display text-lg text-foreground">
              <span className="mr-2 font-mono text-xs text-accent">
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
          Hai completato Networking. Ora hai i mattoncini per capire gli scenari successivi:
          scanning, MITM, hijacking, exploit, difesa perimetrale.
        </SuccessNote>
      )}
    </div>
  );
}
