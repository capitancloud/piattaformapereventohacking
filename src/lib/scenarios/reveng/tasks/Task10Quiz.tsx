import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    q: "In PowerShell, il carattere $ davanti a un nome indica…",
    options: ["Un commento", "Una variabile", "Un operatore di redirezione", "Un cmdlet"],
    correct: 1,
  },
  {
    q: "Il flag -EncodedCommand di powershell.exe si aspetta:",
    options: [
      "Un file .ps1 firmato",
      "Base64 di una stringa Unicode (UTF-16 LE)",
      "Base64 di una stringa ASCII",
      "Un URL da scaricare ed eseguire",
    ],
    correct: 1,
  },
  {
    q: "Perché un attaccante usa -WindowStyle Hidden?",
    options: [
      "Per rendere lo script più veloce",
      "Per evitare che l'utente veda la finestra di PowerShell aprirsi",
      "Per bypassare la firma digitale",
      "Per criptare l'output",
    ],
    correct: 1,
  },
  {
    q: "La chiave di registro HKCU\\...\\CurrentVersion\\Run serve a:",
    options: [
      "Registrare le versioni di Windows Update",
      "Eseguire automaticamente programmi al login dell'utente",
      "Memorizzare le password dei browser",
      "Bloccare i programmi non firmati",
    ],
    correct: 1,
  },
  {
    q: "Cosa fa Invoke-Expression (iex) su una stringa?",
    options: [
      "La stampa a schermo",
      "La esegue come codice PowerShell",
      "La cifra con la chiave dell'utente",
      "La invia via email",
    ],
    correct: 1,
  },
  {
    q: "Concatenare 'In'+'vo'+'ke' per formare 'Invoke' è un esempio di:",
    options: [
      "Compressione dei dati",
      "Offuscamento — serve a eludere pattern testuali degli antivirus",
      "Ottimizzazione delle prestazioni",
      "Firma digitale del codice",
    ],
    correct: 1,
  },
  {
    q: "Uno XOR con chiave singola, applicato due volte con la stessa chiave:",
    options: [
      "Raddoppia la cifratura",
      "Restituisce il testo originale",
      "Distrugge i dati",
      "Genera una firma HMAC",
    ],
    correct: 1,
  },
  {
    q: "Uno script sospetto va analizzato:",
    options: [
      "Eseguendolo sul PC di lavoro per vedere cosa fa",
      "Staticamente, o dentro una sandbox isolata senza rete verso l'interno",
      "Aprendolo con Word",
      "Solo dopo averlo compilato",
    ],
    correct: 1,
  },
  {
    q: "Cosa si intende per IoC (Indicator of Compromise)?",
    options: [
      "Un tipo di firewall",
      "Un artefatto osservabile (URL, hash, chiave di registro) che indica una compromissione",
      "Un log di sistema",
      "Un ruolo aziendale",
    ],
    correct: 1,
  },
  {
    q: "Scrivere lo script 'inverso' in un incident significa:",
    options: [
      "Girare i caratteri del malware al contrario",
      "Ricostruire le azioni del malware per annullarne gli effetti (remediation)",
      "Decompilare il .NET Framework",
      "Cifrare i file del malware",
    ],
    correct: 1,
  },
];

export default function Task10Quiz({ markComplete, isComplete }: TaskContext) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = Object.entries(answers).filter(
    ([i, v]) => QUESTIONS[Number(i)]!.correct === v,
  ).length;

  const submit = () => {
    setSubmitted(true);
    if (score === QUESTIONS.length) markComplete();
  };

  return (
    <div className="space-y-6">
      {QUESTIONS.map((q, i) => (
        <div key={i} className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-baseline gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-sm text-ivory">{q.q}</span>
          </div>
          <div className="grid gap-2">
            {q.options.map((opt, oi) => {
              const picked = answers[i] === oi;
              const isCorrect = q.correct === oi;
              const state = !submitted
                ? picked
                  ? "sel"
                  : "idle"
                : isCorrect
                  ? "ok"
                  : picked
                    ? "ko"
                    : "idle";
              return (
                <button
                  key={oi}
                  onClick={() => !submitted && setAnswers({ ...answers, [i]: oi })}
                  className={cn(
                    "flex items-start gap-3 rounded-md border border-border bg-background px-3 py-2 text-left text-sm text-ivory/90 transition hover:border-gold/60",
                    state === "sel" && "border-gold/60 bg-gold/5",
                    state === "ok" && "border-success/60 bg-success/10",
                    state === "ko" && "border-destructive/60 bg-destructive/10",
                  )}
                >
                  <span className="mt-0.5">
                    {state === "ok" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : state === "ko" ? (
                      <XCircle className="h-4 w-4 text-destructive" />
                    ) : (
                      <span
                        className={cn(
                          "inline-block h-4 w-4 rounded-full border",
                          state === "sel"
                            ? "border-gold bg-gold/40"
                            : "border-muted-foreground/50",
                        )}
                      />
                    )}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        {!submitted ? (
          <button
            onClick={submit}
            disabled={Object.keys(answers).length < QUESTIONS.length}
            className="rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Consegna il quiz
          </button>
        ) : (
          <button
            onClick={() => {
              setSubmitted(false);
              setAnswers({});
            }}
            className="rounded-md border border-border bg-background px-5 py-2.5 text-sm text-ivory hover:border-gold/60"
          >
            Riprova
          </button>
        )}
        {submitted && (
          <span className="font-mono text-sm text-ivory">
            Punteggio: <span className="text-gold">{score}</span> / {QUESTIONS.length}
          </span>
        )}
      </div>

      {isComplete && (
        <SuccessNote>
          Modulo completato. Hai imparato a leggere uno script PowerShell, a smontare
          tre livelli di offuscamento (Base64, concatenazione, char-code, XOR), a
          usare l'AI come collega di analisi e a scrivere uno script di remediation.
        </SuccessNote>
      )}
    </div>
  );
}
