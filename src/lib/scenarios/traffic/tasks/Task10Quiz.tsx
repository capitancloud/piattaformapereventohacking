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
  { q: "Cosa contiene un file .pcap?", options: ["Log applicativi", "Pacchetti di rete catturati", "File eseguibili"], answer: 1 },
  { q: "In quale livello si trovano gli indirizzi IP?", options: ["L2 Ethernet", "L3 IP", "L4 TCP"], answer: 1 },
  { q: "Il filtro Wireshark per porta 443 è...", options: ["port=443", "tcp.port == 443", "tcp:443"], answer: 1 },
  { q: "Il three-way handshake TCP è...", options: ["SYN → ACK → FIN", "SYN → SYN/ACK → ACK", "GET → 200 OK → close"], answer: 1 },
  { q: "A cosa serve Follow TCP Stream?", options: ["A bloccare una connessione", "A ricostruire la conversazione tra due host", "A cifrare il traffico"], answer: 1 },
  { q: "Perché non si vedono credenziali HTTPS in chiaro?", options: ["Perché HTTPS le cifra prima di inviarle", "Perché Wireshark le nasconde", "Perché le password non passano via HTTPS"], answer: 0 },
  { q: "Un sottodominio molto lungo in base64 è tipico di...", options: ["Un errore di configurazione", "DNS tunneling", "Un CDN"], answer: 1 },
  { q: "Il comando tshark per leggere un pcap è...", options: ["tshark -f capture.pcap", "tshark -r capture.pcap", "tshark --open capture.pcap"], answer: 1 },
  { q: "Per estrarre solo alcuni campi con tshark si usa...", options: ["-T fields -e", "-only", "-select"], answer: 0 },
  { q: "Vuoi vedere solo il traffico da o verso 10.0.0.5. Il filtro giusto è...", options: ["ip.src=10.0.0.5", "ip.addr == 10.0.0.5", "host 10.0.0.5"], answer: 1 },
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
            <button onClick={submit} disabled={!allAnswered} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40">
              Consegna
            </button>
          ) : (
            <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2 text-sm text-foreground transition hover:border-accent">
              <RotateCcw className="h-3.5 w-3.5" /> Riprova
            </button>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Ripassa i filtri Wireshark e la struttura a livelli: sono i concetti che tornano più spesso.</InfoNote>
      ) : (
        <SuccessNote>Modulo di analisi del traffico completato! Ora sai leggere pcap, filtrare, ricostruire dialoghi e usare tshark.</SuccessNote>
      )}
    </div>
  );
}
