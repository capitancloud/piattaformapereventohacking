import { useState } from "react";
import { CheckCircle2, Shield } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const SITUATIONS = [
  {
    id: 1,
    text: "Vuoi installare un nuovo tool di sicurezza su Kali.",
    command: "apt install nmap",
    needsSudo: true,
  },
  {
    id: 2,
    text: "Vuoi vedere in quale cartella ti trovi.",
    command: "pwd",
    needsSudo: false,
  },
  {
    id: 3,
    text: "Devi modificare il file di configurazione di rete del sistema.",
    command: "nano /etc/network/interfaces",
    needsSudo: true,
  },
];

export default function Task07Users({ markComplete, isComplete }: TaskContext) {
  const [choices, setChoices] = useState<Record<number, boolean | undefined>>({});
  const [checked, setChecked] = useState(false);

  const choose = (id: number, withSudo: boolean) => {
    setChoices((c) => ({ ...c, [id]: withSudo }));
    setChecked(false);
  };

  const allCorrect = SITUATIONS.every((s) => choices[s.id] === s.needsSudo) && Object.keys(choices).length === SITUATIONS.length;

  const verify = () => {
    setChecked(true);
    if (allCorrect) markComplete();
  };

  return (
    <div>
      <div className="space-y-4">
        {SITUATIONS.map((s) => {
          const picked = choices[s.id];
          const correct = checked && picked === s.needsSudo;
          const wrong = checked && picked !== undefined && picked !== s.needsSudo;
          return (
            <div key={s.id} className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-2 text-sm text-foreground">{s.text}</div>
              <div className="mb-3 font-mono text-xs text-accent">Comando: {s.command}</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => choose(s.id, true)}
                  className={cn(
                    "flex items-center gap-2 rounded-md border px-3 py-2 text-xs transition",
                    picked === true
                      ? "border-accent bg-accent/15 text-foreground"
                      : "border-border text-muted-foreground hover:border-accent/60",
                  )}
                >
                  <Shield className="h-3.5 w-3.5" />
                  sudo {s.command}
                </button>
                <button
                  onClick={() => choose(s.id, false)}
                  className={cn(
                    "rounded-md border px-3 py-2 text-xs transition",
                    picked === false
                      ? "border-accent bg-accent/15 text-foreground"
                      : "border-border text-muted-foreground hover:border-accent/60",
                  )}
                >
                  {s.command}
                </button>
              </div>
              {checked && (
                <div className={cn("mt-3 flex items-center gap-2 text-sm", correct ? "text-success" : wrong ? "text-destructive" : "text-muted-foreground")}>
                  {correct && <CheckCircle2 className="h-4 w-4" />}
                  {correct
                    ? "Giusto."
                    : wrong
                      ? s.needsSudo
                        ? "Serve sudo: questo comando tocca parti di sistema."
                        : "Non serve sudo: è un'operazione dell'utente corrente."
                      : "Scegli un'opzione."}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={verify}
        disabled={SITUATIONS.some((s) => choices[s.id] === undefined)}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Verifica tutto
      </button>

      {!isComplete ? (
        <InfoNote>
          <code className="text-accent">sudo</code> ti fa agire come root. Serve per installare pacchetti, modificare
          file di sistema e gestire utenti. Non serve per file nella tua home.
        </InfoNote>
      ) : (
        <SuccessNote>
          root ha poteri illimitati: un errore può danneggiare il sistema. Per questo si usa un utente normale + sudo solo
          quando serve.
        </SuccessNote>
      )}
    </div>
  );
}
