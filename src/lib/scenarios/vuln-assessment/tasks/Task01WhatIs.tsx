import { useState } from "react";
import { Check, X } from "lucide-react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const ITEMS = [
  { id: "a", text: "WordPress 5.0 esposto su internet, con un exploit pubblico", vuln: true, why: "Software datato + exploit disponibile = vulnerabilità concreta." },
  { id: "b", text: "Un server con tutte le patch installate e i servizi ridotti al minimo", vuln: false, why: "Nessun punto debole noto: è la condizione ideale, non una vulnerabilità." },
  { id: "c", text: "La password dell'amministratore è «admin123»", vuln: true, why: "Credenziali deboli sono una vulnerabilità di configurazione." },
  { id: "d", text: "Il sito usa HTTPS con un certificato valido e aggiornato", vuln: false, why: "È una misura di protezione, non un punto debole." },
  { id: "e", text: "Il pannello phpMyAdmin è raggiungibile da chiunque senza password", vuln: true, why: "Interfaccia sensibile esposta: chiunque può leggere i database." },
  { id: "f", text: "Il firewall blocca tutte le porte tranne 80 e 443", vuln: false, why: "Restringere la superficie è una difesa, non una debolezza." },
];

export default function Task01WhatIs({ markComplete, isComplete }: TaskContext) {
  const [choices, setChoices] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState(false);

  const score = ITEMS.filter((it) => choices[it.id] === it.vuln).length;
  const all = ITEMS.every((it) => choices[it.id] !== undefined);

  const check = () => {
    setChecked(true);
    if (score === ITEMS.length) markComplete();
  };

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        Per ogni situazione decidi: è una vulnerabilità o no?
      </p>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        {ITEMS.map((it) => {
          const choice = choices[it.id];
          const good = checked && choice === it.vuln;
          const bad = checked && choice !== undefined && choice !== it.vuln;
          return (
            <div
              key={it.id}
              className={cn(
                "min-w-0 rounded-xl border p-4 transition",
                good && "border-success bg-success/10",
                bad && "border-destructive bg-destructive/10",
                !good && !bad && "border-border bg-surface",
              )}
            >
              <p className="mb-3 break-words text-sm text-foreground">{it.text}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setChoices((c) => ({ ...c, [it.id]: true }))}
                  className={cn(
                    "flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs transition",
                    choice === true
                      ? "border-destructive bg-destructive/15 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-accent/50",
                  )}
                >
                  <X className="h-3.5 w-3.5" /> Vulnerabilità
                </button>
                <button
                  onClick={() => setChoices((c) => ({ ...c, [it.id]: false }))}
                  className={cn(
                    "flex items-center gap-1 rounded-md border px-3 py-1.5 text-xs transition",
                    choice === false
                      ? "border-success bg-success/15 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-accent/50",
                  )}
                >
                  <Check className="h-3.5 w-3.5" /> Non lo è
                </button>
              </div>
              {checked && choice !== undefined && (
                <p className="mt-2 break-words text-xs text-muted-foreground">{it.why}</p>
              )}
            </div>
          );
        })}
      </div>
      {!checked && (
        <button
          onClick={check}
          disabled={!all}
          className="mt-4 rounded-md border border-accent bg-accent/15 px-4 py-2 text-sm text-foreground transition hover:bg-accent/25 disabled:opacity-40"
        >
          Verifica le risposte
        </button>
      )}
      {checked && score < ITEMS.length && (
        <WarnNote>
          {score}/{ITEMS.length} corrette. Correggi quelle sbagliate e premi di nuovo «Verifica le risposte».
          <button onClick={() => setChecked(false)} className="ml-2 underline">Correggi</button>
        </WarnNote>
      )}
      {checked && !isComplete && score === ITEMS.length && null}
      {isComplete && (
        <SuccessNote>
          Perfetto: una vulnerabilità è un punto debole sfruttabile — software vecchio, configurazioni
          sbagliate, credenziali deboli. Le difese non contano come vulnerabilità.
        </SuccessNote>
      )}
      {!checked && <InfoNote>Ricorda: software datato, errori di configurazione e credenziali deboli sono le tre famiglie classiche di vulnerabilità.</InfoNote>}
    </div>
  );
}
