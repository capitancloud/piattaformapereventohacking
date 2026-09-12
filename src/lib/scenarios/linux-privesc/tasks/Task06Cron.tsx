import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const OPTIONS = [
  { id: "bad1", label: "chmod +s /bin/bash", ok: true, why: "Aggiunge il SUID di root a bash: dopo il tick, «bash -p» ti darà uid=0." },
  { id: "bad2", label: "rm -rf /", ok: false, why: "Distruttivo e inutile: cancelli l'intera macchina che ti serve." },
  { id: "bad3", label: "echo 'hi'", ok: false, why: "Innocuo, non porta alcun vantaggio." },
  { id: "bad4", label: "cat /etc/passwd", ok: false, why: "Lo puoi già leggere senza essere root: non serve." },
];

export default function Task06Cron({ markComplete, isComplete }: TaskContext) {
  const [seconds, setSeconds] = useState(0);
  const [pick, setPick] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [ticked, setTicked] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s + 1) % 60), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!checked || pick !== "bad1") return;
    const t = setTimeout(() => setTicked(true), 1400);
    return () => clearTimeout(t);
  }, [checked, pick]);

  const angle = (seconds / 60) * 360;

  return (
    <div>
      <div className="grid min-w-0 gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
        <div className="min-w-0 rounded-xl border border-border bg-surface p-4 text-center">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-accent">cron tick</p>
          <div className="relative mx-auto h-32 w-32 rounded-full border-2 border-border bg-black/60">
            <div
              className="absolute left-1/2 top-1/2 h-14 w-0.5 origin-top bg-accent"
              style={{ transform: `translate(-50%, 0) rotate(${angle}deg)` }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          <p className="mt-2 font-mono text-[11px] text-muted-foreground">*/1 * * * * root /opt/backup.sh</p>
          <p className="mt-1 text-[10px] text-muted-foreground">gira ogni minuto come root</p>
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-accent">/opt/backup.sh (scrivibile da tutti)</p>
          <pre className="min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-md bg-black/60 p-3 font-mono text-[11px] text-ivory/90">
{`#!/bin/bash
tar czf /var/backups/site.tgz /var/www/html
# <-- aggiungi qui la tua riga
`}
          </pre>
          <p className="mt-3 break-words text-xs text-muted-foreground">Quale riga aggiungeresti?</p>
          <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
            {OPTIONS.map((o) => {
              const selected = pick === o.id;
              const right = checked && selected && o.ok;
              const wrong = checked && selected && !o.ok;
              return (
                <button
                  key={o.id}
                  onClick={() => {
                    setChecked(false);
                    setTicked(false);
                    setPick(o.id);
                  }}
                  className={cn(
                    "min-w-0 break-all rounded-md border px-3 py-2 text-left font-mono text-[11px] transition active:scale-95",
                    selected && !checked && "border-accent bg-accent/15 text-foreground",
                    right && "border-success bg-success/10 text-success",
                    wrong && "border-destructive bg-destructive/10 text-destructive",
                    !selected && "border-border bg-background text-muted-foreground hover:border-accent/50",
                  )}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <Button
        className="mt-4 w-full"
        disabled={!pick}
        onClick={() => {
          setChecked(true);
          if (pick === "bad1") markComplete();
        }}
      >
        Aspetta il prossimo tick
      </Button>

      {checked && ticked && pick === "bad1" && (
        <div className="mt-3 rounded-md border border-success/50 bg-success/10 p-3 font-mono text-[11px] text-success">
          [tick] cron esegue /opt/backup.sh come root → chmod +s /bin/bash applicato.
          <br />
          alex@web01:~$ /bin/bash -p
          <br />
          # id  →  uid=1001(alex) euid=0(root) groups=1001(alex)
        </div>
      )}

      {!checked && (
        <InfoNote>
          Il file backup.sh è scrivibile da tutti ma viene eseguito come root ogni minuto. Qualunque
          riga aggiungi partirà con i privilegi di root al prossimo tick.
        </InfoNote>
      )}
      {checked && pick && pick !== "bad1" && (
        <WarnNote>{OPTIONS.find((o) => o.id === pick)?.why}</WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Cron ha eseguito la tua riga come root. Ora /bin/bash è SUID: «bash -p» mantiene i
          privilegi elevati e ti trovi con un euid=0.
        </SuccessNote>
      )}
    </div>
  );
}
