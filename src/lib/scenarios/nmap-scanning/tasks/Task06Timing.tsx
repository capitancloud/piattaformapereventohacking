import { useState } from "react";
import { AlertTriangle, Clock, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const PROFILES = [
  { t: 0, name: "paranoid", minutes: 620, noise: 3 },
  { t: 1, name: "sneaky", minutes: 180, noise: 10 },
  { t: 2, name: "polite", minutes: 42, noise: 22 },
  { t: 3, name: "normal", minutes: 9, noise: 45 },
  { t: 4, name: "aggressive", minutes: 3, noise: 72 },
  { t: 5, name: "insane", minutes: 1, noise: 95 },
];

const TARGETS = [
  {
    id: "legacy",
    icon: Server,
    title: "Gestionale in produzione, hardware datato",
    desc: "Il cliente teme che troppe connessioni contemporanee blocchino gli ordini in corso. Non c'è fretta: la finestra è di due notti.",
    accept: [1, 2],
    why: "Su un sistema fragile si scende di ritmo: meglio impiegare ore in più che causare un fermo.",
  },
  {
    id: "lab",
    icon: Clock,
    title: "Laboratorio interno di collaudo",
    desc: "Macchine virtuali usa e getta, nessun utente collegato, rete dedicata e isolata dal resto.",
    accept: [4, 5],
    why: "Qui la velocità non danneggia nessuno: puoi spingere e recuperare tempo per le analisi.",
  },
  {
    id: "window",
    icon: AlertTriangle,
    title: "Finestra autorizzata di 30 minuti",
    desc: "Sistemi solidi ma il mandato copre solo mezz'ora notturna, monitorata dal team interno.",
    accept: [3, 4],
    why: "Serve un compromesso: abbastanza rapido da stare nella finestra, non tanto da saturare la rete.",
  },
];

export default function Task06Timing({ markComplete, isComplete }: TaskContext) {
  const [values, setValues] = useState<Record<string, number>>({ legacy: 3, lab: 3, window: 3 });
  const [checked, setChecked] = useState(false);

  const ok = TARGETS.every((t) => t.accept.includes(values[t.id]!));

  return (
    <div>
      <div className="space-y-3">
        {TARGETS.map((t) => {
          const v = values[t.id]!;
          const p = PROFILES[v]!;
          const Icon = t.icon;
          const right = checked && t.accept.includes(v);
          return (
            <div
              key={t.id}
              className={cn(
                "rounded-xl border border-border bg-surface p-5 transition",
                right && "border-success/60",
                checked && !right && "border-destructive/60",
              )}
            >
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/20">
                  <Icon className="h-4 w-4 text-accent" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{t.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t.desc}</p>
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={5}
                step={1}
                value={v}
                onChange={(e) => {
                  setChecked(false);
                  setValues((s) => ({ ...s, [t.id]: Number(e.target.value) }));
                }}
                className="mt-4 w-full accent-[var(--color-accent,currentColor)]"
                aria-label={`Timing per ${t.title}`}
              />

              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Profilo</p>
                  <p className="font-mono text-sm text-accent">-T{p.t} {p.name}</p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Durata stimata</p>
                  <p className="font-mono text-sm text-ivory/90">
                    {p.minutes >= 60 ? `${Math.round(p.minutes / 60)} h` : `${p.minutes} min`}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-background p-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Disturbo</p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        p.noise > 65 ? "bg-destructive" : p.noise > 30 ? "bg-gold" : "bg-success",
                      )}
                      style={{ width: `${p.noise}%` }}
                    />
                  </div>
                </div>
              </div>

              {checked && (
                <p className={cn("mt-3 text-xs leading-relaxed", right ? "text-muted-foreground" : "text-destructive")}>
                  {t.why}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Button
        className="mt-4 w-full"
        onClick={() => {
          setChecked(true);
          if (ok) markComplete();
        }}
      >
        Conferma i tre profili
      </Button>

      {!checked && (
        <InfoNote>
          I profili da <code className="font-mono">-T0</code> a <code className="font-mono">-T5</code> regolano
          pause e parallelismo. Non esiste un valore giusto in assoluto: dipende da quanto regge il
          bersaglio e da quanto tempo hai.
        </InfoNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai calibrato la velocità sul contesto invece che sull'abitudine. È così che si evita il
          danno più imbarazzante di un pentest: far cadere il servizio che dovevi solo osservare.
        </SuccessNote>
      )}
    </div>
  );
}
