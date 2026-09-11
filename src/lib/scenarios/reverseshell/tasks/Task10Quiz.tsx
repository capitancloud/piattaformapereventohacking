import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const QUESTIONS = [
  {
    q: "Perché si chiama reverse shell?",
    options: [
      "Perché la vittima si connette verso l'attaccante, non viceversa",
      "Perché inverte i caratteri dell'output",
      "Perché usa il protocollo UDP invece di TCP",
      "Perché gira al contrario nella memoria",
    ],
    correct: 0,
  },
  {
    q: "Cosa serve per far funzionare una webshell .aspx su IIS?",
    options: [
      "Che IIS abbia ASP.NET abilitato e che la cartella di destinazione permetta l'esecuzione di handler",
      "Solo che il file finisca con .aspx",
      "Che l'utente sia Administrator del server",
      "Che il firewall sia disattivato",
    ],
    correct: 0,
  },
  {
    q: "L'identità di default con cui IIS esegue il codice di un'app è:",
    options: [
      "NT AUTHORITY\\SYSTEM",
      "Administrator",
      "IIS APPPOOL\\<NomeAppPool>",
      "L'utente che ha aperto il browser",
    ],
    correct: 2,
  },
  {
    q: "Perché in una reverse shell si preferiscono porte come 443 o 8443?",
    options: [
      "Perché sono più veloci",
      "Perché si mimetizzano nel traffico HTTPS in uscita, spesso non filtrato",
      "Perché sono le uniche non usate",
      "Perché Windows le riserva a PowerShell",
    ],
    correct: 1,
  },
  {
    q: "A cosa serve nc -lvnp 4444?",
    options: [
      "A generare un payload",
      "Ad aprire un listener TCP sulla porta 4444 in attesa di connessioni",
      "A eseguire codice sul target",
      "A eseguire un port scan",
    ],
    correct: 1,
  },
  {
    q: "Validare l'estensione del file caricato solo lato client (JavaScript):",
    options: [
      "È una difesa robusta",
      "È inutile ai fini della sicurezza: un attaccante bypassa il browser",
      "Impedisce sempre gli upload di .aspx",
      "Richiede sempre HTTPS",
    ],
    correct: 1,
  },
  {
    q: "Quale configurazione impedisce che uno .aspx caricato per errore in /uploads venga eseguito?",
    options: [
      "Rinominare il file",
      "Disabilitare gli handler di script per quella cartella (accessPolicy=\"Read\")",
      "Comprimere la cartella",
      "Impostare un cookie di sessione",
    ],
    correct: 1,
  },
  {
    q: "Cos'è l'egress filtering e perché conta contro le reverse shell?",
    options: [
      "Un filtro sul traffico in ingresso",
      "Il filtraggio del traffico in uscita dal server: impedisce alla vittima di connettersi al listener dell'attaccante",
      "La cifratura delle password",
      "Un algoritmo di hashing",
    ],
    correct: 1,
  },
  {
    q: "Perché una webshell è più \"rumorosa\" di una reverse shell interattiva?",
    options: [
      "Perché ogni comando è un'ulteriore richiesta HTTP nei log di IIS, facile da individuare",
      "Perché fa suoni",
      "Perché usa più banda",
      "Perché richiede JavaScript",
    ],
    correct: 0,
  },
  {
    q: "Qual è la lezione principale del modulo?",
    options: [
      "L'unico modo è staccare Internet",
      "Serve difesa su più livelli: prevenire l'upload, impedire l'esecuzione, contenere l'identità del processo, rilevare comportamenti anomali",
      "Basta un buon antivirus",
      "Nessuna difesa è possibile",
    ],
    correct: 1,
  },
];

export default function Task10Quiz({ markComplete, isComplete }: TaskContext) {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
  const [checked, setChecked] = useState(false);
  const right = QUESTIONS.filter((q, i) => answers[i] === q.correct).length;
  const all = right === QUESTIONS.length;

  const verify = () => {
    setChecked(true);
    if (all) markComplete();
  };

  return (
    <div>
      <div className="space-y-4">
        {QUESTIONS.map((q, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-surface p-5 shadow-2xl shadow-black/40"
          >
            <p className="mb-3 font-serif text-lg text-ivory">
              <span className="mr-2 font-mono text-xs text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              {q.q}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, j) => {
                const sel = answers[i] === j;
                const isC = checked && j === q.correct;
                const isW = checked && sel && j !== q.correct;
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
                      sel
                        ? "border-gold bg-gold/10 text-ivory"
                        : "border-border bg-background text-muted-foreground hover:border-gold/50 hover:text-ivory",
                      isC && "border-success bg-success/10 text-ivory",
                      isW && "border-destructive bg-destructive/10 text-ivory",
                    )}
                  >
                    <span>{opt}</span>
                    {isC && <CheckCircle2 className="h-4 w-4 text-success" />}
                    {isW && <XCircle className="h-4 w-4 text-destructive" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          onClick={verify}
          disabled={answers.some((a) => a === null)}
          className="rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Verifica risposte
        </button>
        {checked && (
          <span
            className={cn(
              "text-sm",
              all ? "text-success" : "text-muted-foreground",
            )}
          >
            {right} / {QUESTIONS.length} corrette{!all && " — rivedi e riprova."}
          </span>
        )}
      </div>

      {isComplete && (
        <SuccessNote>
          Modulo completato. Ricapitolando la catena: <strong>ricognizione</strong> →{" "}
          <strong>upload di uno .aspx</strong> → <strong>listener</strong> →{" "}
          <strong>trigger</strong> → <strong>shell interattiva</strong> →{" "}
          <strong>post-exploitation</strong>. E ricapitolando la difesa: prevenire,
          contenere, rilevare.
        </SuccessNote>
      )}
    </div>
  );
}
