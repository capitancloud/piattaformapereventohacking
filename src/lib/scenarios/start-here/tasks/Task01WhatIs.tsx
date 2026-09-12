import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Kind = "eth" | "no";

const ACTIONS: { id: string; text: string; kind: Kind; why: string }[] = [
  { id: "a1", text: "Fai un pentest sull'app di un'azienda che ti ha firmato un contratto scritto", kind: "eth", why: "C'è un permesso scritto e uno scope chiaro: è la definizione di ethical hacking." },
  { id: "a2", text: "Entri nel Wi-Fi del vicino perché la password è banale", kind: "no", why: "Manca il permesso: senza autorizzazione è accesso abusivo, non è ethical hacking." },
  { id: "a3", text: "Trovi un bug e lo segnali al vendor tramite il suo programma di bug bounty", kind: "eth", why: "Divulgazione responsabile dentro le regole del programma: è etica." },
  { id: "a4", text: "Vendi in un forum una vulnerabilità mai comunicata al produttore", kind: "no", why: "Zero-day sul mercato nero: aiuta chi attacca, non chi difende." },
  { id: "a5", text: "Simuli un attacco sul tuo laboratorio virtuale, sulle tue macchine", kind: "eth", why: "Attacchi te stesso su hardware tuo: massima libertà di sperimentazione." },
  { id: "a6", text: "Provi credenziali rubate su siti terzi «per vedere se funzionano»", kind: "no", why: "Credential stuffing su servizi altrui: è un reato, non un test." },
];

export default function Task01WhatIs({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Record<string, Kind>>({});
  const [checked, setChecked] = useState(false);

  const all = Object.keys(picked).length === ACTIONS.length;
  const score = ACTIONS.filter((a) => picked[a.id] === a.kind).length;

  return (
    <div>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        {ACTIONS.map((a) => {
          const value = picked[a.id];
          const right = checked && value === a.kind;
          const wrong = checked && value && value !== a.kind;
          return (
            <div
              key={a.id}
              className={cn(
                "flex min-w-0 flex-col rounded-xl border border-border bg-surface p-4 transition",
                right && "border-success/60",
                wrong && "border-destructive/60",
              )}
            >
              <p className="min-w-0 break-words text-sm leading-relaxed text-foreground">{a.text}</p>
              <div className="mt-3 flex gap-2">
                {([
                  { id: "eth", label: "Etico" },
                  { id: "no", label: "Non etico" },
                ] as const).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setChecked(false);
                      setPicked((p) => ({ ...p, [a.id]: o.id }));
                    }}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs transition active:scale-95",
                      value === o.id
                        ? "border-accent bg-accent/15 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-accent/50",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              {checked && value && (
                <p className={cn("mt-3 text-xs leading-relaxed", right ? "text-muted-foreground" : "text-destructive")}>
                  {a.why}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Button
        className="mt-4 w-full"
        disabled={!all}
        onClick={() => {
          setChecked(true);
          if (ACTIONS.every((a) => picked[a.id] === a.kind)) markComplete();
        }}
      >
        Verifica la classificazione
      </Button>

      {!checked && (
        <InfoNote>
          Regola d'oro: senza un'autorizzazione scritta, qualunque test — anche il più «innocuo» —
          è considerato accesso non autorizzato. L'etica del hacker sta prima nella carta, poi nei
          comandi.
        </InfoNote>
      )}
      {checked && score < ACTIONS.length && (
        <WarnNote>
          {score} su {ACTIONS.length}. Rileggi ogni scenario chiedendoti: c'è un permesso? Il
          bersaglio è mio o è stato messo a disposizione per il test?
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Perfetto. Un ethical hacker lavora con permesso, dentro uno scope e a fin di bene:
          trovare i problemi prima di chi li userebbe contro il cliente.
        </SuccessNote>
      )}
    </div>
  );
}
