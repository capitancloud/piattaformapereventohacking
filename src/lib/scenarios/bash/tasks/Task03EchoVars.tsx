import { useState } from "react";
import { InteractiveTerminal, type TermResponse } from "@/components/lab/InteractiveTerminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: string;
  label: string;
  check: (cmd: string, vars: Record<string, string>) => boolean;
}

const STEPS: Step[] = [
  {
    id: "echo",
    label: "Stampa qualcosa con echo",
    check: (cmd) => /^echo\s+.+/.test(cmd),
  },
  {
    id: "set",
    label: "Crea una variabile NAME con il tuo nome",
    check: (cmd, v) => /^NAME=\S+/.test(cmd) && !!v["NAME"],
  },
  {
    id: "use",
    label: "Stampa la variabile: echo \"Ciao $NAME\"",
    check: (cmd, v) => /^echo\s+.*\$NAME/.test(cmd) && !!v["NAME"],
  },
];

export default function Task03EchoVars({ markComplete, isComplete }: TaskContext) {
  const [vars, setVars] = useState<Record<string, string>>({});
  const [done, setDone] = useState<Record<string, boolean>>({});

  const complete = (id: string, updated: Record<string, boolean>) => {
    if (STEPS.every((s) => updated[s.id])) markComplete();
    setDone(updated);
  };

  const onCommand = (raw: string): TermResponse | TermResponse[] | undefined => {
    const cmd = raw.trim();

    // Assignment
    const assign = cmd.match(/^([A-Z_][A-Z0-9_]*)=(.+)$/i);
    if (assign) {
      const [, name, val] = assign;
      const cleanVal = val.replace(/^["']|["']$/g, "");
      const newVars = { ...vars, [name]: cleanVal };
      setVars(newVars);
      const updated = { ...done };
      for (const s of STEPS) if (!updated[s.id] && s.check(cmd, newVars)) updated[s.id] = true;
      complete("", updated);
      return { text: "", kind: "out" };
    }

    // echo
    if (cmd.startsWith("echo")) {
      let arg = cmd.slice(4).trim();
      arg = arg.replace(/^["']|["']$/g, "");
      const out = arg.replace(/\$([A-Z_][A-Z0-9_]*)/gi, (_, n) => vars[n] ?? "");
      const updated = { ...done };
      for (const s of STEPS) if (!updated[s.id] && s.check(cmd, vars)) updated[s.id] = true;
      complete("", updated);
      return { text: out, kind: "out" };
    }

    if (cmd === "env" || cmd === "set") {
      return Object.entries(vars).map(([k, v]) => ({ text: `${k}=${v}`, kind: "info" as const }));
    }
    if (cmd === "clear") return undefined;

    return { text: `bash: ${cmd.split(" ")[0]}: comando non riconosciuto in questa simulazione`, kind: "err" };
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <InteractiveTerminal title="bash simulato" onCommand={onCommand} heightClass="min-h-[260px]" />
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Checklist</div>
          <ul className="space-y-2">
            {STEPS.map((s) => (
              <li key={s.id} className="flex items-start gap-2 text-sm">
                {done[s.id] ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className={cn(done[s.id] ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
              </li>
            ))}
          </ul>
          {Object.keys(vars).length > 0 && (
            <div className="mt-4 border-t border-border/60 pt-3">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Variabili</div>
              {Object.entries(vars).map(([k, v]) => (
                <div key={k} className="font-mono text-xs text-foreground">
                  <span className="text-accent">{k}</span>=<span className="text-gold-soft">{v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Ricorda: niente spazi attorno all'uguale. NAME=Ada va bene, NAME = Ada no.</InfoNote>
      ) : (
        <SuccessNote>Bene! Hai capito il ciclo memorizza-riusa. È la base di tutti gli script.</SuccessNote>
      )}
    </div>
  );
}
