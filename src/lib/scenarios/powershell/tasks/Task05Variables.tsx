import { useState } from "react";
import { InteractiveTerminal, type TermResponse } from "@/components/lab/InteractiveTerminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Val = { type: "Int32" | "String" | "Double" | "Boolean"; raw: string; num?: number; str?: string; bool?: boolean };

export default function Task05Variables({ markComplete, isComplete }: TaskContext) {
  const [vars, setVars] = useState<Record<string, Val>>({});
  const [assignedInt, setAssignedInt] = useState(false);
  const [assignedString, setAssignedString] = useState(false);
  const [inspected, setInspected] = useState(false);

  const done = assignedInt && assignedString && inspected;

  const handle = (raw: string): TermResponse | TermResponse[] => {
    const cmd = raw.trim();

    // Assignment
    const assign = cmd.match(/^\$(\w+)\s*=\s*(.+)$/);
    if (assign) {
      const name = assign[1]!;
      const rhs = assign[2]!.trim();
      let val: Val;
      if (/^"([^"]*)"$/.test(rhs) || /^'([^']*)'$/.test(rhs)) {
        val = { type: "String", raw: rhs, str: rhs.slice(1, -1) };
        setAssignedString(true);
      } else if (/^-?\d+$/.test(rhs)) {
        val = { type: "Int32", raw: rhs, num: parseInt(rhs, 10) };
        setAssignedInt(true);
      } else if (/^-?\d+\.\d+$/.test(rhs)) {
        val = { type: "Double", raw: rhs, num: parseFloat(rhs) };
      } else if (/^\$(true|false)$/i.test(rhs)) {
        val = { type: "Boolean", raw: rhs, bool: /true/i.test(rhs) };
      } else {
        return { text: `Non riesco a interpretare '${rhs}'. Prova un numero, "testo" o $true/$false.`, kind: "err" };
      }
      setVars((v) => ({ ...v, [name]: val }));
      return { text: "", kind: "out" };
    }

    // GetType
    const gt = cmd.match(/^\$(\w+)\.GetType\(\)$/);
    if (gt) {
      const v = vars[gt[1]!];
      if (!v) return { text: `La variabile $${gt[1]} non esiste.`, kind: "err" };
      setInspected(true);
      const done2 = assignedInt && assignedString;
      if (done2) markComplete();
      return [
        { text: "IsPublic IsSerial Name       BaseType", kind: "info" },
        { text: "-------- -------- ----       --------", kind: "info" },
        { text: `True     True     ${v.type.padEnd(10)} System.ValueType`, kind: "out" },
      ];
    }

    // Length
    const len = cmd.match(/^\$(\w+)\.Length$/);
    if (len) {
      const v = vars[len[1]!];
      if (!v) return { text: `La variabile $${len[1]} non esiste.`, kind: "err" };
      if (v.type === "String") return { text: String(v.str!.length), kind: "out" };
      if (v.type === "Int32" || v.type === "Double") return { text: String(v.raw.length), kind: "out" };
      return { text: "", kind: "out" };
    }

    // Recall
    const recall = cmd.match(/^\$(\w+)$/);
    if (recall) {
      const v = vars[recall[1]!];
      if (!v) return { text: "", kind: "out" };
      if (v.type === "String") return { text: v.str!, kind: "out" };
      if (v.type === "Boolean") return { text: v.bool ? "True" : "False", kind: "out" };
      return { text: String(v.num), kind: "out" };
    }

    if (cmd.toLowerCase() === "clear" || cmd.toLowerCase() === "cls") return { text: "", kind: "out" };
    if (cmd.toLowerCase() === "help" || cmd === "?") {
      return { text: "Esempi: $a = 5   |   $s = \"ciao\"   |   $a.GetType()   |   $s.Length", kind: "info" };
    }
    return { text: `'${cmd}' non riconosciuto.`, kind: "err" };
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[1fr_240px]">
        <InteractiveTerminal
          title="PowerShell"
          prompt="PS C:\Lab> "
          heightClass="min-h-[260px]"
          onCommand={handle}
        />

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Checklist</div>
          <ul className="space-y-2 text-sm">
            {[
              { done: assignedInt, label: "Assegna un intero (es: $a = 5)" },
              { done: assignedString, label: "Assegna una stringa (es: $s = \"ciao\")" },
              { done: inspected, label: "Ispeziona il tipo con .GetType()" },
            ].map((s, i) => (
              <li key={i} className={cn("flex items-start gap-2", s.done ? "text-foreground" : "text-muted-foreground")}>
                <span className={cn("mt-1 h-2 w-2 rounded-full", s.done ? "bg-success" : "bg-border")} />
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
          {Object.keys(vars).length > 0 && (
            <>
              <div className="mt-4 mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Variabili attive</div>
              <ul className="space-y-1 font-mono text-[11px]">
                {Object.entries(vars).map(([k, v]) => (
                  <li key={k} className="flex justify-between gap-2">
                    <span className="text-accent">${k}</span>
                    <span className="text-muted-foreground">{v.type}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Prova la sequenza: <span className="font-mono">$a = 5</span> → <span className="font-mono">$s = "ciao"</span> → <span className="font-mono">$s.GetType()</span>. Digita <span className="font-mono">help</span> per un promemoria. {done ? "" : ""}</InfoNote>
      ) : (
        <SuccessNote>Hai visto che in PowerShell ogni variabile è un oggetto: tipo, proprietà, metodi sono sempre a un punto di distanza.</SuccessNote>
      )}
    </div>
  );
}
