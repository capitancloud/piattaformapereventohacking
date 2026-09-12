import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const QUESTIONS = [
  { q: "Cosa distingue un ethical hacker da un attaccante?", options: ["La quantità di strumenti usati", "L'autorizzazione scritta e lo scope concordato", "Il sistema operativo che usa"], answer: 1 },
  { q: "Qual è la prima fase di un pentest?", options: ["Exploitation", "Ricognizione", "Report"], answer: 1 },
  { q: "A cosa serve un virtualizzatore come VirtualBox?", options: ["A cifrare i file", "A far girare macchine virtuali isolate dal PC vero", "A scansionare le porte"], answer: 1 },
  { q: "Kali Linux è…", options: ["Un antivirus", "Una distribuzione Linux piena di strumenti di sicurezza", "Un browser sicuro"], answer: 1 },
  { q: "Dalla versione 2020.1 di Kali il login predefinito è…", options: ["root / toor", "kali / kali", "admin / admin"], answer: 1 },
  { q: "Vuoi che due VM si vedano tra loro E abbiano Internet. Quale modalità di rete usi?", options: ["Host-only pura", "NAT Network / Internal", "Nessuna, staccale dalla rete"], answer: 1 },
  { q: "Docker serve principalmente a…", options: ["Sostituire il sistema operativo", "Eseguire applicazioni in container isolati e leggeri", "Fare scansioni di rete"], answer: 1 },
  { q: "Dopo «sudo usermod -aG docker $USER» cosa devi fare perché abbia effetto?", options: ["Riavviare Docker", "Rifare login (o riavviare la sessione)", "Nulla, è immediato"], answer: 1 },
  { q: "DVWA è…", options: ["Un firewall", "Un'applicazione web deliberatamente vulnerabile per esercitarsi", "Un antivirus per Docker"], answer: 1 },
  { q: "Prima di iniziare qualunque test su un sistema del cliente devi…", options: ["Avvisarlo a voce basterà", "Avere un permesso scritto e uno scope definito", "Aspettare la notte per non farti vedere"], answer: 1 },
];

const MIN = 7;

export default function Task10Quiz({ markComplete, isComplete }: TaskContext) {
  const [answers, setAnswers] = useState<(number | null)[]>(Array(QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  const score = answers.reduce((acc: number, a, i) => acc + (a === QUESTIONS[i]?.answer ? 1 : 0), 0);
  const all = answers.every((a) => a !== null);

  const submit = () => { setSubmitted(true); if (score >= MIN) markComplete(); };
  const reset = () => { setAnswers(Array(QUESTIONS.length).fill(null)); setSubmitted(false); };

  return (
    <div>
      <div className="space-y-4">
        {QUESTIONS.map((q, i) => (
          <div key={i} className="rounded-xl border border-border bg-surface p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">{i + 1}. {q.q}</p>
            <div className="space-y-2">
              {q.options.map((o, oi) => {
                const chosen = answers[i] === oi;
                const right = submitted && oi === q.answer;
                const wrong = submitted && chosen && oi !== q.answer;
                return (
                  <button
                    key={oi}
                    onClick={() => { if (!submitted) { const a = [...answers]; a[i] = oi; setAnswers(a); } }}
                    disabled={submitted}
                    className={cn(
                      "flex w-full min-w-0 items-start gap-2 rounded-md border p-2 text-left text-xs transition",
                      chosen ? "border-accent bg-accent/10" : "border-border bg-background",
                      right && "border-success/60 bg-success/10",
                      wrong && "border-destructive/60 bg-destructive/10",
                    )}
                  >
                    <span className="min-w-0 flex-1 text-foreground/90">{o}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!submitted && <Button className="mt-4 w-full" disabled={!all} onClick={submit}>Consegna il quiz</Button>}
      {submitted && (
        <div className="mt-4 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={reset}><RotateCcw className="mr-2 h-3.5 w-3.5" /> Riprova</Button>
        </div>
      )}

      {!submitted && <InfoNote>Dieci domande sui fondamentali. Ti bastano {MIN} risposte giuste per chiudere lo scenario.</InfoNote>}
      {submitted && score < MIN && <WarnNote>{score} su {QUESTIONS.length}. Rileggi i task precedenti sui punti deboli e riprova.</WarnNote>}
      {isComplete && <SuccessNote>Fondamenta solide. Ora puoi passare agli scenari specifici: networking, Linux, web, e via così.</SuccessNote>}
    </div>
  );
}
