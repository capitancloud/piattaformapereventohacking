import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const QUESTIONS = [
  { q: "Qual è l'account con più privilegi su Windows?", options: ["Administrator", "NT AUTHORITY\\SYSTEM", "Guest"], answer: 1 },
  { q: "winPEAS a cosa serve?", options: ["A patchare il sistema", "A enumerare potenziali privesc locali", "A cifrare i file"], answer: 1 },
  { q: "Un UAC bypass con fodhelper funziona perché…", options: ["fodhelper è un virus", "fodhelper si auto-eleva e legge una chiave HKCU scrivibile dall'utente", "fodhelper disabilita l'antivirus"], answer: 1 },
  { q: "Un servizio con «BUILTIN\\Users: FullControl» sull'ACL è…", options: ["Sicuro", "Modificabile dall'utente: privesc quasi automatica", "Un servizio di sistema"], answer: 1 },
  { q: "«C:\\Program Files\\Vuln App\\svc.exe» senza virgolette permette…", options: ["Niente di che", "Di piazzare C:\\Program.exe ed eseguirlo come SYSTEM", "Di crashare il sistema"], answer: 1 },
  { q: "AlwaysInstallElevated a 1 in HKLM e HKCU vuol dire che…", options: ["Il sistema è aggiornato", "Ogni .msi installato da un utente gira come SYSTEM", "L'antivirus è attivo"], answer: 1 },
  { q: "Quale privilegio del token è la strada regia verso SYSTEM per un account di servizio?", options: ["SeShutdownPrivilege", "SeImpersonatePrivilege", "SeUndockPrivilege"], answer: 1 },
  { q: "Dove NON si trovano tipicamente credenziali dimenticate su Windows?", options: ["HKLM\\...\\Winlogon (AutoAdminLogon)", "C:\\Windows\\Panther\\Unattend.xml", "C:\\Windows\\System32\\kernel32.dll"], answer: 2 },
  { q: "Il comando «whoami /priv» serve a…", options: ["Cambiare password", "Vedere i privilegi del proprio token", "Elencare gli utenti"], answer: 1 },
  { q: "Perché in un pentest si documenta con cura ogni privesc?", options: ["Per farla vedere agli amici", "Per permettere al cliente di rimediare puntualmente", "Non si documenta"], answer: 1 },
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
      <div className="min-w-0 rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-accent">
          <span>10 domande · minimo {MIN}/10</span>
          {submitted && <span className={cn(score >= MIN ? "text-success" : "text-destructive")}>Punteggio: {score}/10</span>}
        </div>
        <ol className="space-y-4">
          {QUESTIONS.map((q, i) => (
            <li key={i} className="min-w-0 rounded-md border border-border bg-background p-3">
              <div className="mb-2 break-words text-sm text-foreground"><span className="mr-2 font-mono text-accent">{i + 1}.</span>{q.q}</div>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[i] === oi;
                  const correct = submitted && oi === q.answer;
                  const wrong = submitted && selected && oi !== q.answer;
                  return (
                    <button key={oi} onClick={() => { if (submitted) return; const next = [...answers]; next[i] = oi; setAnswers(next); }} className={cn("min-w-0 rounded-md border px-3 py-1.5 text-left text-xs transition", selected && !submitted && "border-accent bg-accent/15 text-foreground", correct && "border-success bg-success/10 text-success", wrong && "border-destructive bg-destructive/10 text-destructive", !selected && !correct && !wrong && "border-border bg-surface text-muted-foreground hover:border-accent/50")}>{opt}</button>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-5 flex items-center gap-3">
          {!submitted ? <Button disabled={!all} onClick={submit}>Consegna il quiz</Button> : <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" /> Riprova</Button>}
        </div>
      </div>
      {!submitted && <InfoNote>Rispondi a tutte le domande e consegna: bastano 7 risposte corrette.</InfoNote>}
      {submitted && score < MIN && <WarnNote>Rileggi i task delle domande sbagliate e riprova.</WarnNote>}
      {isComplete && <SuccessNote>Hai completato lo scenario Privilege Escalation su Windows. Ora sai riconoscere in cinque minuti le vie più promettenti verso SYSTEM.</SuccessNote>}
    </div>
  );
}
