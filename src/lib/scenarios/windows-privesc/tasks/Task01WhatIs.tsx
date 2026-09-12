import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Kind = "privesc" | "no";

const ACTIONS: { id: string; text: string; kind: Kind; why: string }[] = [
  { id: "a1", text: "Sei l'utente «alex» su win10-dev e sfrutti un servizio scrivibile per aprire una shell come SYSTEM sullo stesso PC.", kind: "privesc", why: "Stesso sistema, salita da utente a SYSTEM: è privilege escalation." },
  { id: "a2", text: "Da kali lanci un exploit su porta 445 per ottenere una shell iniziale su un server Windows.", kind: "no", why: "Stai entrando da fuori: è exploitation, non privesc." },
  { id: "a3", text: "Come Administrator locale usi PsExec per aprire una sessione su un altro PC del dominio.", kind: "no", why: "Ti stai spostando verso un altro host: è movimento laterale." },
  { id: "a4", text: "Sfrutti SeImpersonatePrivilege del token di IIS per passare a SYSTEM sulla stessa macchina.", kind: "privesc", why: "Salita di privilegi sullo stesso host tramite token: è privesc." },
  { id: "a5", text: "Trovi la password di un altro utente nel file Unattend.xml e fai runas come lui, sullo stesso PC.", kind: "privesc", why: "Escalation orizzontale sullo stesso sistema." },
  { id: "a6", text: "Con nmap scopri quali porte sono aperte sulla rete dell'azienda.", kind: "no", why: "Ricognizione dall'esterno, non privesc." },
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
            <div key={a.id} className={cn("flex min-w-0 flex-col rounded-xl border border-border bg-surface p-4", right && "border-success/60", wrong && "border-destructive/60")}>
              <p className="min-w-0 break-words text-sm leading-relaxed text-foreground">{a.text}</p>
              <div className="mt-3 flex gap-2">
                {([{ id: "privesc", label: "Privilege escalation" }, { id: "no", label: "Altra fase" }] as const).map((o) => (
                  <button key={o.id} onClick={() => { setChecked(false); setPicked((p) => ({ ...p, [a.id]: o.id })); }} className={cn("rounded-md border px-3 py-1.5 text-xs transition active:scale-95", value === o.id ? "border-accent bg-accent/15 text-foreground" : "border-border bg-background text-muted-foreground hover:border-accent/50")}>{o.label}</button>
                ))}
              </div>
              {checked && value && <p className={cn("mt-3 text-xs leading-relaxed", right ? "text-muted-foreground" : "text-destructive")}>{a.why}</p>}
            </div>
          );
        })}
      </div>
      <Button className="mt-4 w-full" disabled={!all} onClick={() => { setChecked(true); if (ACTIONS.every((a) => picked[a.id] === a.kind)) markComplete(); }}>Verifica la classificazione</Button>
      {!checked && <InfoNote>Privesc = stesso sistema + salita di privilegi. Se entri da fuori è exploitation; se salti a un altro host è movimento laterale.</InfoNote>}
      {checked && score < ACTIONS.length && <WarnNote>{score} su {ACTIONS.length}. Guarda dove ti trovi e cosa stai salendo.</WarnNote>}
      {isComplete && <SuccessNote>Perfetto. Ora ci occupiamo solo della salita: dal posto in cui sei fino a SYSTEM.</SuccessNote>}
    </div>
  );
}
