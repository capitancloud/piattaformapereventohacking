import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const STARTER = `nome = input("Come ti chiami? ")\nprint("Ciao", nome)`;

export default function Task03PrintInput({ markComplete, isComplete }: TaskContext) {
  const [code, setCode] = useState(STARTER);
  const [reply, setReply] = useState("Ada");
  const [output, setOutput] = useState<string[]>([]);
  const [checks, setChecks] = useState({ hasInput: false, hasPrint: false, run: false });

  const run = () => {
    const hasInput = /input\s*\(/.test(code);
    const hasPrint = /print\s*\(/.test(code);
    const out: string[] = [];

    const promptMatch = code.match(/input\s*\(\s*(["'])([\s\S]*?)\1\s*\)/);
    if (promptMatch && promptMatch[2] !== undefined) {
      out.push(`> ${promptMatch[2]}${reply}`);
    }

    // find first print(...) and replace the "nome" occurrences with reply
    const printMatch = code.match(/print\s*\(([\s\S]*?)\)/);
    if (printMatch && printMatch[1] !== undefined) {
      const args = printMatch[1]
        .split(",")
        .map((a) => a.trim())
        .map((a) => {
          const s = a.match(/^(["'])([\s\S]*)\1$/);
          if (s && s[2] !== undefined) return s[2];
          if (a === "nome") return reply;
          return a;
        });
      out.push(args.join(" "));
    }

    setOutput(out);
    const nextChecks = { hasInput, hasPrint, run: true };
    setChecks(nextChecks);
    if (hasInput && hasPrint && out.length >= 2) markComplete();
  };

  const reset = () => {
    setCode(STARTER);
    setOutput([]);
    setChecks({ hasInput: false, hasPrint: false, run: false });
  };

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-2 flex items-center justify-between font-mono text-xs uppercase tracking-widest text-accent">
            <span>editor · hello.py</span>
            <button onClick={reset} className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <RotateCcw className="h-3 w-3" /> reset
            </button>
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="h-40 w-full resize-none rounded-md border border-border bg-background p-3 font-mono text-sm text-foreground outline-none focus:border-accent"
          />
          <div className="mt-3">
            <label className="mb-1 block text-xs text-muted-foreground">Risposta simulata dell'utente</label>
            <input
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
          <button
            onClick={run}
            className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:brightness-110"
          >
            <Play className="h-3.5 w-3.5" /> Esegui
          </button>
        </div>

        <div className="rounded-xl border border-border bg-black/40 p-4 font-mono text-sm text-emerald-200">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">Output</div>
          {output.length === 0 && <div className="text-muted-foreground">Premi Esegui per vedere il risultato.</div>}
          {output.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">{line}</div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
        <Check ok={checks.hasInput} label="Usa input()" />
        <Check ok={checks.hasPrint} label="Usa print()" />
        <Check ok={checks.run && output.length >= 2} label="Ha eseguito e prodotto output" />
      </div>

      {!isComplete ? (
        <InfoNote>
          input mostra la domanda e aspetta la risposta. print stampa. Insieme fanno il minimo indispensabile per un dialogo.
        </InfoNote>
      ) : (
        <SuccessNote>
          Hai scritto e simulato il tuo primo dialogo Python. Da qui in poi tutto è variazione sul tema.
        </SuccessNote>
      )}
    </div>
  );
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border px-2 py-1.5",
        ok ? "border-success/40 bg-success/10 text-success" : "border-border bg-surface text-muted-foreground",
      )}
    >
      <span className={cn("inline-block h-2 w-2 rounded-full", ok ? "bg-success" : "bg-border")} />
      {label}
    </div>
  );
}
