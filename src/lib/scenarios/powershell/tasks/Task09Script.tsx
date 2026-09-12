import { useState } from "react";
import { CheckCircle2, Circle, FileCode2, Play } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const DEFAULT = `param($nome)\nWrite-Host "Ciao $nome, benvenuto in PowerShell"\n`;

const CHECKS = {
  param: (s: string) => /^\s*param\s*\(\s*\$nome\s*\)/m.test(s),
  writeHost: (s: string) => /Write-Host\s+.*\$nome/.test(s),
};

export default function Task09Script({ markComplete, isComplete }: TaskContext) {
  const [content, setContent] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);
  const [runArg, setRunArg] = useState("Ada");
  const [output, setOutput] = useState<string | null>(null);

  const hasParam = CHECKS.param(content);
  const hasWrite = CHECKS.writeHost(content);

  const run = () => {
    if (!saved) {
      setOutput("PS> .\\saluta.ps1: file non salvato");
      return;
    }
    if (!hasParam || !hasWrite) {
      setOutput("errore: lo script deve avere param($nome) e Write-Host che usa $nome");
      return;
    }
    if (!runArg.trim()) {
      setOutput("errore: passa un nome con -nome");
      return;
    }
    // Extract the string inside Write-Host "..."
    const m = content.match(/Write-Host\s+"([^"]*)"/);
    const raw = m ? m[1]! : `Ciao $nome`;
    const out = raw.replace(/\$nome/g, runArg.trim());
    setOutput(out);
    markComplete();
  };

  const steps = [
    { id: "param", label: "param($nome) sulla prima riga", done: hasParam },
    { id: "write", label: "Write-Host che usa $nome", done: hasWrite },
    { id: "save", label: "Salvato come saluta.ps1", done: saved },
    { id: "run", label: "Eseguito con -nome", done: isComplete },
  ];

  return (
    <div>
      <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-2">
            <FileCode2 className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs text-muted-foreground">saluta.ps1</span>
            {!saved && <span className="ml-auto rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] text-destructive">non salvato</span>}
          </div>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setSaved(false);
            }}
            rows={7}
            spellCheck={false}
            className="w-full resize-none bg-black/60 p-4 font-mono text-sm text-ivory outline-none"
          />
          <div className="flex flex-wrap items-center gap-2 border-t border-border p-3">
            <button
              onClick={() => setSaved(true)}
              disabled={saved}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground transition hover:border-accent disabled:opacity-40"
            >
              Salva
            </button>
            <div className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
              -nome
              <input
                value={runArg}
                onChange={(e) => setRunArg(e.target.value)}
                className="w-24 rounded border border-border bg-background px-2 py-1 text-ivory outline-none focus:border-accent"
              />
            </div>
            <button
              onClick={run}
              className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              <Play className="h-3.5 w-3.5" /> .\saluta.ps1 -nome {runArg || "…"}
            </button>
          </div>
          {output !== null && (
            <div className="min-w-0 border-t border-border bg-black p-3 font-mono text-sm">
              <div className="break-all text-gold-soft">PS C:\Lab&gt; .\saluta.ps1 -nome {runArg}</div>
              <div className={cn("whitespace-pre-wrap break-words [overflow-wrap:anywhere]", output.startsWith("errore") || output.startsWith("PS>") ? "text-destructive" : "text-ivory")}>{output}</div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Checklist</div>
          <ul className="space-y-2">
            {steps.map((s) => (
              <li key={s.id} className="flex items-start gap-2 text-sm">
                {s.done ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
                <span className={cn(s.done ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Il prefisso .\ è obbligatorio per eseguire uno script nella cartella corrente: è una protezione di PowerShell.</InfoNote>
      ) : (
        <SuccessNote>Hai scritto ed eseguito il tuo primo script parametrico. È il punto di partenza per ogni automazione seria su Windows.</SuccessNote>
      )}
    </div>
  );
}
