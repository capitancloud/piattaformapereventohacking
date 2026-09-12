import { useState } from "react";
import { InteractiveTerminal, type TermResponse } from "@/components/lab/InteractiveTerminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Alias {
  name: string;
  cmd: string;
}

const EXAMPLES: Alias[] = [
  { name: "ll", cmd: "ls -la" },
  { name: "cls", cmd: "clear" },
  { name: "myip", cmd: "hostname -I" },
];

const FAKE_OUTPUT: Record<string, string> = {
  "ls -la": "drwxr-xr-x  3 kali kali 4096 report/\n-rw-r--r--  1 kali kali  128 notes.txt",
  "clear": "",
  "hostname -I": "10.10.5.42",
};

export default function Task09Alias({ markComplete, isComplete }: TaskContext) {
  const [aliases, setAliases] = useState<Alias[]>([]);
  const [name, setName] = useState("");
  const [cmd, setCmd] = useState("");
  const [invoked, setInvoked] = useState<Set<string>>(new Set());

  const add = () => {
    const n = name.trim();
    const c = cmd.trim();
    if (!n || !c) return;
    if (aliases.find((a) => a.name === n)) return;
    setAliases([...aliases, { name: n, cmd: c }]);
    setName("");
    setCmd("");
  };
  const remove = (n: string) => setAliases(aliases.filter((a) => a.name !== n));

  const onCommand = (raw: string): TermResponse | TermResponse[] | undefined => {
    const trimmed = raw.trim();

    const declare = trimmed.match(/^alias\s+([a-zA-Z_][\w-]*)=(['"])(.+)\2$/);
    if (declare) {
      const [, n, , c] = declare;
      if (!aliases.find((a) => a.name === n)) setAliases((a) => [...a, { name: n, cmd: c }]);
      return { text: `alias registrato: ${n}='${c}'`, kind: "info" };
    }

    if (trimmed === "alias") {
      return aliases.length
        ? aliases.map((a) => ({ text: `alias ${a.name}='${a.cmd}'`, kind: "info" as const }))
        : { text: "nessun alias definito", kind: "info" };
    }

    const first = trimmed.split(/\s+/)[0];
    const found = aliases.find((a) => a.name === first);
    if (found) {
      const next = new Set(invoked);
      next.add(found.name);
      setInvoked(next);
      if (aliases.length >= 1 && next.size >= 1) markComplete();
      const out = FAKE_OUTPUT[found.cmd] ?? `[esegue: ${found.cmd}]`;
      return [
        { text: `# ${found.name} → ${found.cmd}`, kind: "info" },
        { text: out || " ", kind: "out" },
      ];
    }

    if (FAKE_OUTPUT[trimmed] !== undefined) {
      return { text: FAKE_OUTPUT[trimmed] || " ", kind: "out" };
    }

    return { text: `bash: ${first}: comando non riconosciuto`, kind: "err" };
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[1fr_280px]">
        <InteractiveTerminal title="bash simulato" onCommand={onCommand} heightClass="min-h-[280px]" />

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Crea un alias</div>
          <div className="mb-3 space-y-2">
            <div className="flex items-center gap-2 rounded-md border border-border bg-background px-2 py-1.5">
              <span className="font-mono text-xs text-muted-foreground">alias</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9_-]/g, ""))}
                placeholder="ll"
                className="w-16 bg-transparent font-mono text-sm text-foreground outline-none"
              />
              <span className="text-muted-foreground">=</span>
              <span className="text-muted-foreground">'</span>
              <input
                value={cmd}
                onChange={(e) => setCmd(e.target.value)}
                placeholder="ls -la"
                className="flex-1 bg-transparent font-mono text-sm text-foreground outline-none"
              />
              <span className="text-muted-foreground">'</span>
            </div>
            <button
              onClick={add}
              disabled={!name.trim() || !cmd.trim()}
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" /> Aggiungi
            </button>
          </div>

          <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">Esempi rapidi</div>
          <div className="mb-3 flex flex-wrap gap-1">
            {EXAMPLES.map((e) => (
              <button
                key={e.name}
                onClick={() => {
                  if (!aliases.find((a) => a.name === e.name)) setAliases([...aliases, e]);
                }}
                className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[11px] text-muted-foreground transition hover:border-accent hover:text-foreground"
              >
                {e.name}
              </button>
            ))}
          </div>

          {aliases.length > 0 && (
            <div className="border-t border-border/60 pt-3">
              <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">I tuoi alias</div>
              <ul className="space-y-1">
                {aliases.map((a) => (
                  <li key={a.name} className={cn("flex items-center justify-between rounded border px-2 py-1 font-mono text-xs", invoked.has(a.name) ? "border-success/50 bg-success/10" : "border-border bg-background")}>
                    <span><span className="text-accent">{a.name}</span> → <span className="text-gold-soft">{a.cmd}</span></span>
                    <button onClick={() => remove(a.name)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Definisci almeno un alias e invocalo nel terminale. Puoi scriverlo anche direttamente: alias ll='ls -la'.</InfoNote>
      ) : (
        <SuccessNote>Gli alias sono la tua firma personale sulla shell. Salvali in ~/.bashrc per averli sempre.</SuccessNote>
      )}
    </div>
  );
}
