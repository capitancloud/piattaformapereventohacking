import { useState } from "react";
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Sev = "alta" | "media" | "bassa";

const FINDINGS: { id: string; title: string; body: string; answer: Sev; why: string }[] = [
  {
    id: "f1",
    title: "FTP anonimo aperto con file di backup leggibile",
    body: "Un archivio contenente credenziali di servizio è scaricabile senza autenticazione.",
    answer: "alta",
    why: "Un attaccante può leggere credenziali senza sforzo: impatto immediato e sfruttamento banale.",
  },
  {
    id: "f2",
    title: "SNMP con community «public» attiva",
    body: "Espone sistema operativo, processi in esecuzione e mappa di rete interna.",
    answer: "media",
    why: "Nessun dato riservato viene rivelato, ma la superficie di attacco viene descritta in dettaglio.",
  },
  {
    id: "f3",
    title: "Banner SSH visibile (OpenSSH 8.9, versione aggiornata)",
    body: "Il servizio dichiara prodotto e versione: nessuna vulnerabilità nota per questa release.",
    answer: "bassa",
    why: "Informativa: aiuta l'attaccante a orientarsi, ma non offre una via d'ingresso.",
  },
  {
    id: "f4",
    title: "Server SMTP che risponde a VRFY con elenco utenti",
    body: "Permette di validare in silenzio nomi utente da usare in campagne di phishing mirate.",
    answer: "media",
    why: "Non concede accessi, ma prepara il terreno per attacchi molto efficaci.",
  },
];

const SEV: { id: Sev; label: string; icon: typeof ShieldAlert; color: string }[] = [
  { id: "alta", label: "Alta", icon: ShieldAlert, color: "border-destructive/60 bg-destructive/10 text-destructive" },
  { id: "media", label: "Media", icon: AlertTriangle, color: "border-gold/60 bg-gold/10 text-gold" },
  { id: "bassa", label: "Bassa", icon: ShieldCheck, color: "border-success/60 bg-success/10 text-success" },
];

export default function Task09Report({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Record<string, Sev>>({});
  const [checked, setChecked] = useState(false);

  const all = Object.keys(picked).length === FINDINGS.length;
  const score = FINDINGS.filter((f) => picked[f.id] === f.answer).length;

  return (
    <div>
      <div className="space-y-3">
        {FINDINGS.map((f) => {
          const value = picked[f.id];
          const right = checked && value === f.answer;
          const wrong = checked && value && value !== f.answer;
          return (
            <div
              key={f.id}
              className={cn(
                "min-w-0 rounded-xl border border-border bg-surface p-4 transition",
                right && "border-success/60",
                wrong && "border-destructive/60",
              )}
            >
              <p className="break-words text-sm font-medium text-foreground">{f.title}</p>
              <p className="mt-1 break-words text-xs leading-relaxed text-muted-foreground">{f.body}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {SEV.map((s) => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setChecked(false);
                        setPicked((p) => ({ ...p, [f.id]: s.id }));
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs transition active:scale-95",
                        value === s.id
                          ? s.color
                          : "border-border bg-background text-muted-foreground hover:border-accent/50",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" /> {s.label}
                    </button>
                  );
                })}
              </div>
              {checked && value && (
                <p className={cn("mt-3 break-words text-xs leading-relaxed", right ? "text-muted-foreground" : "text-destructive")}>
                  {f.why}
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
          if (FINDINGS.every((f) => picked[f.id] === f.answer)) markComplete();
        }}
      >
        Consegna il rapporto
      </Button>

      {!checked && (
        <InfoNote>
          Nel rapporto di un pentest la gravità nasce dall'incrocio tra impatto e facilità di
          sfruttamento: informazioni utili sono medie, dati direttamente sfruttabili sono alte.
        </InfoNote>
      )}
      {checked && score < FINDINGS.length && (
        <WarnNote>
          {score} su {FINDINGS.length}. Chiediti: cosa può fare un attaccante domani mattina con
          questa singola scoperta?
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai priorità coerenti: il cliente potrà chiudere prima i buchi che pesano davvero e
          affrontare in tempi ragionevoli quelli meno urgenti.
        </SuccessNote>
      )}
    </div>
  );
}
