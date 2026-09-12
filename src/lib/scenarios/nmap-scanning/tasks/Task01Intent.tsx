import { useState } from "react";
import { Gauge, ShieldCheck, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Action = {
  id: string;
  label: string;
  desc: string;
  level: "silenzioso" | "moderato" | "rumoroso";
  note: string;
};

const ACTIONS: Action[] = [
  {
    id: "dns",
    label: "Risolvere il nome dell'host",
    desc: "Chiedere a un resolver pubblico l'indirizzo associato al dominio.",
    level: "silenzioso",
    note: "La richiesta arriva al resolver, non al bersaglio: traccia minima.",
  },
  {
    id: "topports",
    label: "nmap --top-ports 20 con timing lento",
    desc: "Provare solo le porte più comuni, con pause fra i pacchetti.",
    level: "moderato",
    note: "Pochi pacchetti, ma è comunque contatto diretto con l'host.",
  },
  {
    id: "fullscan",
    label: "nmap -p- su tutta la sottorete",
    desc: "65.535 porte per ogni host del segmento di rete.",
    level: "rumoroso",
    note: "Volume di pacchetti altissimo: compare nei log e negli allarmi.",
  },
  {
    id: "sv",
    label: "nmap -sV su tre porte aperte",
    desc: "Interrogare i servizi già trovati per stimarne la versione.",
    level: "moderato",
    note: "Apre connessioni vere e lascia banner nei log applicativi.",
  },
  {
    id: "brute",
    label: "Script NSE di brute force sulle credenziali",
    desc: "Tentare molte combinazioni utente/password sui servizi trovati.",
    level: "rumoroso",
    note: "Può bloccare account reali: serve un mandato esplicito e scritto.",
  },
];

const LEVELS: { id: Action["level"]; label: string; icon: typeof VolumeX }[] = [
  { id: "silenzioso", label: "Silenzioso", icon: VolumeX },
  { id: "moderato", label: "Moderato", icon: Gauge },
  { id: "rumoroso", label: "Rumoroso", icon: Volume2 },
];

export default function Task01Intent({ markComplete, isComplete }: TaskContext) {
  const [placed, setPlaced] = useState<Record<string, Action["level"]>>({});
  const [checked, setChecked] = useState(false);

  const score = ACTIONS.filter((a) => placed[a.id] === a.level).length;
  const all = Object.keys(placed).length === ACTIONS.length;

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center justify-between gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <span>Bilancia del rumore</span>
          <span className="font-mono text-accent">{Object.keys(placed).length}/{ACTIONS.length}</span>
        </div>

        <div className="relative mb-5 h-1.5 overflow-hidden rounded-full bg-gradient-to-r from-success via-gold to-destructive opacity-70" />

        <div className="space-y-3">
          {ACTIONS.map((a) => {
            const value = placed[a.id];
            const right = checked && value === a.level;
            const wrong = checked && value && value !== a.level;
            return (
              <div
                key={a.id}
                className={cn(
                  "rounded-lg border border-border bg-background p-4 transition",
                  right && "border-success/60",
                  wrong && "border-destructive/60",
                )}
              >
                <p className="text-sm text-foreground">{a.label}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.desc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {LEVELS.map((l) => {
                    const Icon = l.icon;
                    return (
                      <Button
                        key={l.id}
                        size="sm"
                        variant={value === l.id ? "default" : "outline"}
                        onClick={() => {
                          setChecked(false);
                          setPlaced((p) => ({ ...p, [a.id]: l.id }));
                        }}
                      >
                        <Icon /> {l.label}
                      </Button>
                    );
                  })}
                </div>
                {checked && value && (
                  <p
                    className={cn(
                      "mt-3 text-xs leading-relaxed",
                      right ? "text-muted-foreground" : "text-destructive",
                    )}
                  >
                    {right ? a.note : `Rivedi: ${a.note}`}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <Button
          className="mt-5 w-full"
          disabled={!all}
          onClick={() => {
            setChecked(true);
            if (ACTIONS.every((a) => placed[a.id] === a.level)) markComplete();
          }}
        >
          <ShieldCheck /> Valuta la bilancia
        </Button>
      </div>

      {!checked && (
        <InfoNote>
          Chiediti sempre due cose: quanti pacchetti sto generando e chi li riceve. Un'azione
          rumorosa non è vietata, ma va concordata con chi gestisce i sistemi.
        </InfoNote>
      )}
      {checked && score < ACTIONS.length && (
        <WarnNote>
          {score} risposte su {ACTIONS.length} sono corrette. Ricorda che leggere una fonte esterna
          è diverso dal bussare direttamente alla porta dell'organizzazione.
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai ordinato le azioni per impatto: ora puoi scegliere l'intensità della scansione in base
          alla fragilità del bersaglio e al mandato ricevuto.
        </SuccessNote>
      )}
    </div>
  );
}
