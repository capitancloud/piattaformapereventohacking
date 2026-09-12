import { useState } from "react";
import { Play, FileCode2 } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const SCRIPT = `#!/bin/bash
echo "Primo argomento: $1"
echo "Secondo argomento: $2"
echo "Tutti insieme: $@"
echo "Quanti sono: $#"
`;

export default function Task05Args({ markComplete, isComplete }: TaskContext) {
  const [args, setArgs] = useState("");
  const [out, setOut] = useState<string[]>([]);
  const [runs, setRuns] = useState(0);

  const run = () => {
    const parts = args.trim().split(/\s+/).filter(Boolean);
    const out = [
      `Primo argomento: ${parts[0] ?? ""}`,
      `Secondo argomento: ${parts[1] ?? ""}`,
      `Tutti insieme: ${parts.join(" ")}`,
      `Quanti sono: ${parts.length}`,
    ];
    setOut(out);
    const next = runs + 1;
    setRuns(next);
    if (next >= 2 && parts.length >= 2) markComplete();
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-2">
            <FileCode2 className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs text-muted-foreground">saluta.sh</span>
          </div>
          <pre className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] bg-black/60 p-4 font-mono text-sm text-ivory">{SCRIPT}</pre>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Lancia lo script con argomenti</div>
          <div className="mb-3 grid min-w-0 grid-cols-[auto_auto_minmax(0,1fr)] items-center rounded-md border border-border bg-black/60 px-3 py-2 font-mono text-sm">
            <span className="whitespace-nowrap text-gold-soft">kali@lab:~$ </span>
            <span className="whitespace-nowrap">./saluta.sh </span>
            <input
              value={args}
              onChange={(e) => setArgs(e.target.value)}
              placeholder="Ada Lovelace"
              className="min-w-0 w-full bg-transparent text-ivory outline-none placeholder:text-muted-foreground/50"
            />
          </div>
          <button
            onClick={run}
            disabled={!args.trim()}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
          >
            <Play className="h-3.5 w-3.5" /> Esegui
          </button>

          {out.length > 0 && (
            <div className="mt-4 rounded-md border border-border bg-black/70 p-3 font-mono text-sm animate-in fade-in slide-in-from-bottom-2">
              {out.map((l, i) => (
                <div key={i} className="break-words [overflow-wrap:anywhere] text-ivory">{l}</div>
              ))}
            </div>
          )}

          <div className={cn("mt-3 text-xs", runs >= 2 ? "text-success" : "text-muted-foreground")}>
            Lanci effettuati: {runs}/2 (con almeno 2 argomenti)
          </div>
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Prova almeno due volte con argomenti diversi: nota come $1, $2 e $@ cambiano.</InfoNote>
      ) : (
        <SuccessNote>Ora sai passare input agli script: uno strumento riusabile invece che un pezzo unico.</SuccessNote>
      )}
    </div>
  );
}
