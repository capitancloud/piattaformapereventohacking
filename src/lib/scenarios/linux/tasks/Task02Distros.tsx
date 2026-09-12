import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const DISTROS = [
  { name: "Ubuntu", use: "Desktop e server, facile per chi inizia" },
  { name: "Debian", use: "Stabile, base di Ubuntu e Kali" },
  { name: "Fedora", use: "Innovazione, desktop, ambiente aziendale Red Hat" },
  { name: "CentOS / Rocky", use: "Server aziendali, stabilità a lungo termine" },
  { name: "Kali Linux", use: "Sicurezza, penetration testing, forensics" },
];

const USES = [
  "Desktop e server, facile per chi inizia",
  "Stabile, base di Ubuntu e Kali",
  "Innovazione, desktop, ambiente aziendale Red Hat",
  "Server aziendali, stabilità a lungo termine",
  "Sicurezza, penetration testing, forensics",
];

export default function Task02Distros({ markComplete, isComplete }: TaskContext) {
  const [matches, setMatches] = useState<Record<number, string | undefined>>({});
  const [checked, setChecked] = useState(false);

  const allRight = DISTROS.every((d, i) => matches[i] === d.use) && Object.keys(matches).length === DISTROS.length;

  const verify = () => {
    setChecked(true);
    if (allRight) markComplete();
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Associa ogni distribuzione al suo uso tipico
        </div>
        <div className="space-y-3">
          {DISTROS.map((d, i) => {
            const picked = matches[i];
            const correct = checked && picked === d.use;
            const wrong = checked && picked && picked !== d.use;
            return (
              <div
                key={d.name}
                className={cn(
                  "rounded-md border bg-background p-3",
                  correct && "border-success/60",
                  wrong && "border-destructive/60",
                  !correct && !wrong && "border-border",
                )}
              >
                <div className="mb-2 flex items-center gap-2 font-mono text-sm text-foreground">
                  {correct && <CheckCircle2 className="h-4 w-4 text-success" />}
                  {wrong && <XCircle className="h-4 w-4 text-destructive" />}
                  <span>{d.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {USES.map((u) => (
                    <button
                      key={u}
                      onClick={() => {
                        setMatches({ ...matches, [i]: u });
                        setChecked(false);
                      }}
                      className={cn(
                        "rounded-md border px-2.5 py-1 text-xs transition",
                        picked === u
                          ? "border-accent bg-accent/15 text-foreground"
                          : "border-border text-muted-foreground hover:border-accent/60 hover:text-foreground",
                      )}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={verify}
          disabled={Object.keys(matches).length !== DISTROS.length}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Verifica
        </button>
      </div>

      {!isComplete ? (
        <InfoNote>
          Kali Linux è una Debian specializzata: contiene centinaia di tool per test di sicurezza, già configurati e
          pronti all'uso.
        </InfoNote>
      ) : (
        <SuccessNote>
          Kali è la cassetta degli attrezzi del penetration tester, ma è sempre Linux sotto: imparare la shell ti serve
          ovunque.
        </SuccessNote>
      )}
    </div>
  );
}
