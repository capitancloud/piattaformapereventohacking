import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Kind = "enum" | "no";

const ACTIONS: { id: string; text: string; kind: Kind; why: string }[] = [
  {
    id: "a1",
    text: "Ti colleghi alla condivisione SMB del file server ed elenchi le cartelle visibili senza password",
    kind: "enum",
    why: "Stai dialogando con il servizio per estrarre nomi e strutture: è enumerazione pura.",
  },
  {
    id: "a2",
    text: "Invii un unico pacchetto a 1000 indirizzi per scoprire quali sono accesi",
    kind: "no",
    why: "Questa è scoperta degli host (host discovery): dici solo «chi c'è», non «cosa offre».",
  },
  {
    id: "a3",
    text: "Chiedi al server DNS la lista completa dei nomi della zona aziendale",
    kind: "enum",
    why: "Il DNS ti sta consegnando un elenco di nomi: un tesoro di enumerazione.",
  },
  {
    id: "a4",
    text: "Leggi su un motore di ricerca i documenti PDF pubblici dell'azienda",
    kind: "no",
    why: "Nessun contatto col bersaglio: è raccolta passiva (OSINT), fase precedente.",
  },
  {
    id: "a5",
    text: "Chiedi al server di posta se gli utenti «marco.rossi» e «admin» esistono",
    kind: "enum",
    why: "Verificare nomi utente uno a uno è enumerazione: il servizio ti risponde con informazioni.",
  },
  {
    id: "a6",
    text: "Provi la password «Password123» sull'account amministratore",
    kind: "no",
    why: "Qui stai tentando un accesso, non raccogliendo informazioni: sei già nella fase di sfruttamento.",
  },
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
                {(
                  [
                    { id: "enum", label: "Enumerazione" },
                    { id: "no", label: "Non lo è" },
                  ] as const
                ).map((o) => (
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
          La linea di confine è il dialogo: se il servizio ti risponde rivelando nomi, elenchi o
          versioni, stai enumerando. Se guardi da fuori o provi a entrare, sei in un'altra fase.
        </InfoNote>
      )}
      {checked && score < ACTIONS.length && (
        <WarnNote>
          {score} su {ACTIONS.length}. Ripensa a chi parla con chi: l'enumerazione è sempre una
          conversazione con un servizio del bersaglio.
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Ora distingui raccolta passiva, scoperta, enumerazione e sfruttamento: quattro fasi che
          nel rapporto di un pentest vanno sempre tenute separate.
        </SuccessNote>
      )}
    </div>
  );
}
