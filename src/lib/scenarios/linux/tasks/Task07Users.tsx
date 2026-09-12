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
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const choose = (id: number, withSudo: boolean) => {
    setChoices((c) => ({ ...c, [id]: withSudo }));
    setChecked((c) => ({ ...c, [id]: false }));
  };

  const verify = (id: number) => {
    const situation = SITUATIONS.find((s) => s.id === id)!;
    const correct = choices[id] === situation.needsSudo;
    setChecked((c) => ({ ...c, [id]: true }));
    if (SITUATIONS.every((s) => checked[s.id] || (s.id === id ? correct : choices[s.id] === s.needsSudo))) {
      const allCorrect = SITUATIONS.every((s) => choices[s.id] === s.needsSudo);
      if (allCorrect) markComplete();
    }
  };

  const allDone = SITUATIONS.every((s) => checked[s.id]);

  return (
    <div>
      <div className="space-y-4">
        {SITUATIONS.map((s) => {
          const picked = choices[s.id];
          const isChecked = checked[s.id];
          const correct = picked === s.needsSudo;
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
              {isChecked && (
                <div className={cn("mt-3 flex items-center gap-2 text-sm", correct ? "text-success" : "text-destructive")}>
                  {correct ? <CheckCircle2 className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                  {correct
                    ? "Giusto."
                    : s.needsSudo
                      ? "Serve sudo: questo comando tocca parti di sistema."
                      : "Non serve sudo: è un'operazione dell'utente corrente."}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => SITUATIONS.forEach((s) => verify(s.id))}
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
