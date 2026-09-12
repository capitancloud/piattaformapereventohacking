import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Kind = "online" | "offline" | "reuse";

const ACTIONS: { id: string; text: string; kind: Kind; why: string }[] = [
  {
    id: "a1",
    text: "Un attaccante prova 3.000 password contro il login SSH di un server esposto su internet.",
    kind: "online",
    why: "Sta parlando col servizio in diretta: è un attacco online.",
  },
  {
    id: "a2",
    text: "Dopo un'esfiltrazione, l'attaccante scarica /etc/shadow e lo passa a hashcat sulla sua GPU.",
    kind: "offline",
    why: "Nessuno parla con il server: gli hash sono già rubati, l'attacco è offline.",
  },
  {
    id: "a3",
    text: "Un elenco di email e password trapelato da un vecchio forum viene provato in massa su Netflix.",
    kind: "reuse",
    why: "Nessuno indovina: si riusano credenziali già trapelate. È credential stuffing.",
  },
  {
    id: "a4",
    text: "Un attaccante prova la password Autunno2024! contro 3.000 account aziendali diversi.",
    kind: "online",
    why: "Sta ancora bussando al servizio, un account alla volta: è online (password spraying).",
  },
  {
    id: "a5",
    text: "Un dump del database di un e-commerce viene passato a john the ripper per giorni.",
    kind: "offline",
    why: "Gli hash sono in mano all'attaccante e vengono lavorati localmente: offline.",
  },
  {
    id: "a6",
    text: "Le credenziali usate su un sito di ricette vengono ritentate sull'home banking dello stesso utente.",
    kind: "reuse",
    why: "Riuso puro di credenziali già in possesso dell'attaccante.",
  },
];

const OPTIONS: { id: Kind; label: string }[] = [
  { id: "online", label: "Attacco online" },
  { id: "offline", label: "Attacco offline" },
  { id: "reuse", label: "Riuso di credenziali" },
];

export default function Task01WhatIs({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Record<string, Kind>>({});
  const [checked, setChecked] = useState(false);

  const all = Object.keys(picked).length === ACTIONS.length;
  const score = ACTIONS.filter((a) => picked[a.id] === a.kind).length;

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        Ogni scenario qui sotto è un vero attacco alle password. Il tuo compito è classificarlo nella famiglia giusta: parla con il servizio dal vivo, lavora su un file di hash già rubato, oppure riusa credenziali trapelate?
      </p>
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
              <div className="mt-3 flex flex-wrap gap-2">
                {OPTIONS.map((o) => (
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
          Online = parlo col servizio. Offline = lavoro su hash rubati. Riuso = ripropongo password già trapelate.
        </InfoNote>
      )}
      {checked && score < ACTIONS.length && (
        <WarnNote>{score} su {ACTIONS.length}. Guarda dove sono le password: nel server, in un file, in un vecchio dump.</WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Perfetto. Ora sai in che famiglia rientra ogni attacco: nei prossimi task entriamo nel dettaglio uno per uno.
        </SuccessNote>
      )}
    </div>
  );
}
