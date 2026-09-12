import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const KERNELS = [
  { id: "k1", ver: "3.13.0-32-generic", answer: "overlayfs", note: "Ubuntu 14.04: OverlayFS local privesc (CVE-2015-1328)." },
  { id: "k2", ver: "4.4.0-31-generic", answer: "dirtycow", note: "Dirty COW (CVE-2016-5195): kernel 2.6.22 → 4.8." },
  { id: "k3", ver: "5.8.0-50-generic", answer: "dirtypipe", note: "DirtyPipe (CVE-2022-0847): kernel 5.8 → 5.16." },
  { id: "k4", ver: "6.1.0-13-amd64", answer: "none", note: "Kernel recente e patchato: nessun exploit noto della lista qui." },
];

const EXPLOITS = [
  { id: "dirtycow", label: "Dirty COW (CVE-2016-5195)" },
  { id: "dirtypipe", label: "DirtyPipe (CVE-2022-0847)" },
  { id: "overlayfs", label: "OverlayFS (CVE-2015-1328)" },
  { id: "none", label: "Nessuno: cerca altre vie" },
];

export default function Task08Kernel({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const all = Object.keys(picked).length === KERNELS.length;
  const score = KERNELS.filter((k) => picked[k.id] === k.answer).length;

  return (
    <div>
      <div className="grid min-w-0 gap-3 md:grid-cols-2">
        {KERNELS.map((k) => {
          const v = picked[k.id];
          const right = checked && v === k.answer;
          const wrong = checked && v && v !== k.answer;
          return (
            <div
              key={k.id}
              className={cn(
                "min-w-0 rounded-xl border border-border bg-surface p-4 transition",
                right && "border-success/60",
                wrong && "border-destructive/60",
              )}
            >
              <p className="mb-1 font-mono text-[11px] uppercase tracking-widest text-accent">uname -r</p>
              <p className="min-w-0 break-all font-mono text-sm text-foreground">{k.ver}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                {EXPLOITS.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => {
                      setChecked(false);
                      setPicked((p) => ({ ...p, [k.id]: e.id }));
                    }}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-[11px] transition active:scale-95",
                      v === e.id
                        ? "border-accent bg-accent/15 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-accent/50",
                    )}
                  >
                    {e.label}
                  </button>
                ))}
              </div>

              {checked && v && (
                <p className={cn("mt-2 break-words text-xs leading-relaxed", right ? "text-muted-foreground" : "text-destructive")}>
                  {k.note}
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
          if (KERNELS.every((k) => picked[k.id] === k.answer)) markComplete();
        }}
      >
        Verifica gli abbinamenti
      </Button>

      {!checked && (
        <InfoNote>
          Regola pratica: 2.6/3.x/4.4 → area Dirty COW; 3.13 → OverlayFS; 5.8-5.16 → DirtyPipe;
          kernel recenti e patchati → nessuna delle vie in questa lista.
        </InfoNote>
      )}
      {checked && score < KERNELS.length && (
        <WarnNote>{score} su {KERNELS.length}. Guarda l'intervallo di versione: ogni exploit vive in una finestra precisa.</WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          L'exploit del kernel è l'ultima carta: rumoroso, può crashare la macchina. Prima si prova
          tutto il resto — sudo, SUID, PATH, cron, capabilities — poi eventualmente il kernel.
        </SuccessNote>
      )}
    </div>
  );
}
