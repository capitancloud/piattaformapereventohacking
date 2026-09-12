import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Kind = "privesc" | "no";

const ACTIONS: { id: string; text: string; kind: Kind; why: string }[] = [
  {
    id: "a1",
    text: "Sei l'utente «alex» su web01 e sfrutti un binario SUID per aprire una shell come root sullo stesso host.",
    kind: "privesc",
    why: "Stesso sistema, salita da utente a root: è privilege escalation verticale, il caso classico.",
  },
  {
    id: "a2",
    text: "Da kali lanci un exploit SMB per ottenere una shell iniziale su una macchina Windows.",
    kind: "no",
    why: "Stai entrando da fuori: è exploitation, non privilege escalation.",
  },
  {
    id: "a3",
    text: "Come www-data trovi la password di mario nel .bash_history e fai «su mario» per lavorare come lui.",
    kind: "privesc",
    why: "Escalation orizzontale: passi da un utente ad un altro sulla stessa macchina.",
  },
  {
    id: "a4",
    text: "Usi le credenziali estratte da web01 per aprire una sessione SSH su fileserver01.",
    kind: "no",
    why: "Ti sposti verso un altro host: è movimento laterale, non escalation.",
  },
  {
    id: "a5",
    text: "Sfrutti la capability cap_setuid su python3 per eseguire os.setuid(0) e ottenere uid=0.",
    kind: "privesc",
    why: "Sali di privilegi restando sulla stessa macchina: privilege escalation via capabilities.",
  },
  {
    id: "a6",
    text: "Con nmap scopri quali porte sono aperte sulla rete perimetrale di un'azienda.",
    kind: "no",
    why: "Sei ancora fuori e osservi: è ricognizione, non privesc.",
  },
];

export default function Task01WhatIs({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Record<string, Kind>>({});
  const [checked, setChecked] = useState(false);

  const all = Object.keys(picked).length === ACTIONS.length;
  const score = ACTIONS.filter((a) => picked[a.id] === a.kind).length;

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        La privilege escalation è come trovare una scala nascosta dentro un palazzo in cui sei già entrato. Non devi più forzare porte dall'esterno: devi solo salire. Leggi ogni situazione e decidi se si tratta di una vera scalata di privilegi, oppure di exploitation o movimento laterale.
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
              <div className="mt-3 flex gap-2">
                {(
                  [
                    { id: "privesc", label: "Privilege escalation" },
                    { id: "no", label: "Altra fase" },
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
          Privilege escalation = stesso sistema + salita di privilegi. Se stai entrando da fuori è
          exploitation; se salti su un'altra macchina è movimento laterale.
        </InfoNote>
      )}
      {checked && score < ACTIONS.length && (
        <WarnNote>{score} su {ACTIONS.length}. Guarda dove ti trovi e cosa stai salendo.</WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Perfetto. D'ora in poi ci occupiamo solo della salita: dallo stesso posto in cui sei, fino
          ai privilegi di root.
        </SuccessNote>
      )}
    </div>
  );
}
