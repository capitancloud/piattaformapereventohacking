import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const QUESTIONS = [
  {
    q: "Cos'è la privilege escalation su Linux?",
    options: ["Entrare in un sistema da fuori", "Salire di privilegi sullo stesso sistema", "Spostarsi verso altre macchine"],
    answer: 1,
  },
  {
    q: "«sudo -l» a cosa serve?",
    options: ["A elencare i comandi che puoi lanciare via sudo", "A cambiare la password di root", "A vedere chi ha fatto login"],
    answer: 0,
  },
  {
    q: "Quale comando, se autorizzato via sudo NOPASSWD, ti dà una shell root?",
    options: ["sudo ls", "sudo find . -exec /bin/sh \\;", "sudo cat /etc/hosts"],
    answer: 1,
  },
  {
    q: "Cosa fa il bit SUID su un binario?",
    options: ["Lo cifra", "Lo esegue con i privilegi del proprietario", "Impedisce di eseguirlo"],
    answer: 1,
  },
  {
    q: "Il PATH hijacking funziona quando…",
    options: ["Il PATH contiene una cartella scrivibile prima delle cartelle di sistema", "Il PATH è vuoto", "Il PATH è /usr/bin"],
    answer: 0,
  },
  {
    q: "Uno script di root richiamato da cron e scrivibile da chiunque è…",
    options: ["Sicuro se ha estensione .sh", "Una privesc pronta: chi lo modifica esegue codice come root", "Innocuo"],
    answer: 1,
  },
  {
    q: "Quale capability trasforma un interprete come python in shell root?",
    options: ["cap_net_raw", "cap_setuid", "cap_chown"],
    answer: 1,
  },
  {
    q: "Come si trovano i binari SUID sul sistema?",
    options: ["find / -perm -4000 -type f 2>/dev/null", "ls -SUID /", "grep suid /etc/passwd"],
    answer: 0,
  },
  {
    q: "Un exploit del kernel come Dirty COW va scelto in base a…",
    options: ["Al colore del terminale", "Alla versione restituita da uname -r", "Alla distribuzione grafica"],
    answer: 1,
  },
  {
    q: "Perché in un pentest si prova il kernel exploit per ultimo?",
    options: ["Perché richiede un pagamento", "Perché è rumoroso e può mandare in crash la macchina", "Perché non funziona mai"],
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
          Hai completato lo scenario Privilege Escalation su Linux. Ora sai riconoscere in cinque
          minuti di enumerazione quali sono le vie più promettenti per diventare root.
        </SuccessNote>
      )}
    </div>
  );
}
