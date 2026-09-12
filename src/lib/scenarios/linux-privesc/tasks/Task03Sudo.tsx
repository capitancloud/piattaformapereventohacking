import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const CMDS: { id: string; cmd: string; danger: boolean; how: string }[] = [
  { id: "find", cmd: "sudo find /etc -name passwd", danger: true, how: "sudo find . -exec /bin/sh \\; -quit  →  shell root." },
  { id: "vim", cmd: "sudo vim /etc/motd", danger: true, how: "In vim digiti :!sh e ottieni una shell come root." },
  { id: "less", cmd: "sudo less /var/log/syslog", danger: true, how: "Dentro less digiti !sh: less lancia una shell come root." },
  { id: "awk", cmd: "sudo awk 'NR==1' /etc/hosts", danger: true, how: "sudo awk 'BEGIN{system(\"/bin/sh\")}'  →  shell root." },
  { id: "ls", cmd: "sudo ls /root", danger: false, how: "ls non offre modi di eseguire comandi arbitrari: leggi la directory e basta." },
  { id: "systemctl", cmd: "sudo systemctl status apache2", danger: false, how: "Con «status» sei solo lettura; il pericolo di systemctl è con edit/start di unit scrivibili, non qui." },
];

export default function Task03Sudo({ markComplete, isComplete }: TaskContext) {
  const [pick, setPick] = useState<Record<string, "root" | "safe">>({});
  const [checked, setChecked] = useState(false);

  const all = Object.keys(pick).length === CMDS.length;
  const score = CMDS.filter((c) => (pick[c.id] === "root") === c.danger).length;

  return (
    <div>
      <div className="min-w-0 rounded-xl border border-border bg-surface p-3">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-accent">sudo -l — output su web01</p>
        <pre className="min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-md bg-black/60 p-3 font-mono text-[11px] text-ivory/90">
User alex may run the following commands on web01 (NOPASSWD):
    (ALL) NOPASSWD: /usr/bin/find, /usr/bin/vim, /usr/bin/less, /usr/bin/awk,
                    /bin/ls, /bin/systemctl
        </pre>
      </div>

      <div className="mt-3 space-y-2">
        {CMDS.map((c) => {
          const v = pick[c.id];
          const right = checked && v && (v === "root") === c.danger;
          const wrong = checked && v && (v === "root") !== c.danger;
          return (
            <div
              key={c.id}
              className={cn(
                "min-w-0 rounded-lg border border-border bg-surface p-3 transition",
                right && "border-success/60",
                wrong && "border-destructive/60",
              )}
            >
              <div className="grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <code className="min-w-0 break-all font-mono text-xs text-foreground">{c.cmd}</code>
                <div className="flex gap-2">
                  {(
                    [
                      { id: "root", label: "→ shell root" },
                      { id: "safe", label: "Non pericoloso" },
                    ] as const
                  ).map((o) => (
                    <button
                      key={o.id}
                      onClick={() => {
                        setChecked(false);
                        setPick((p) => ({ ...p, [c.id]: o.id }));
                      }}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-xs transition active:scale-95",
                        v === o.id
                          ? "border-accent bg-accent/15 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-accent/50",
                      )}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
              {checked && v && (
                <p className={cn("mt-2 break-words text-xs leading-relaxed", right ? "text-muted-foreground" : "text-destructive")}>
                  {c.how}
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
          if (CMDS.every((c) => (pick[c.id] === "root") === c.danger)) markComplete();
        }}
      >
        Verifica i comandi
      </Button>

      {!checked && (
        <InfoNote>
          Chiediti: questo comando permette in qualche modo di eseguire un altro comando o di aprire
          una shell? Se sì, con sudo diventa root. Consulta GTFOBins nella vita reale.
        </InfoNote>
      )}
      {checked && score < CMDS.length && (
        <WarnNote>{score} su {CMDS.length}. Ricordati di find, vim, less, awk: sono i «cavalli di Troia» di sudo.</WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Sai leggere «sudo -l» come un pentester: quattro dei sei comandi elencati aprono una
          strada diretta a root, gli altri due no.
        </SuccessNote>
      )}
    </div>
  );
}
