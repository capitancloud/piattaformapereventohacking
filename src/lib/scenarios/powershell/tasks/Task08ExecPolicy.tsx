import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Policy = "Restricted" | "AllSigned" | "RemoteSigned" | "Bypass";

const POLICIES: { id: Policy; desc: string; tone: string }[] = [
  { id: "Restricted", desc: "Nessuno script può essere eseguito", tone: "border-destructive/50 text-destructive" },
  { id: "AllSigned", desc: "Solo script firmati digitalmente", tone: "border-gold-soft/60 text-gold" },
  { id: "RemoteSigned", desc: "Script locali liberi, remoti solo se firmati", tone: "border-accent/60 text-accent" },
  { id: "Bypass", desc: "Nessun controllo, tutto permesso", tone: "border-success/60 text-success" },
];

interface Scene {
  id: string;
  text: string;
  answer: Policy;
}

const SCENES: Scene[] = [
  { id: "s1", text: "Server bloccato che accetta solo software approvato dall'IT aziendale", answer: "AllSigned" },
  { id: "s2", text: "Workstation Windows di uno sviluppatore che scrive spesso script locali", answer: "RemoteSigned" },
  { id: "s3", text: "Macchina virtuale usa e getta in un laboratorio isolato per test rapidi", answer: "Bypass" },
  { id: "s4", text: "PC di un ufficio senza necessità di eseguire alcuno script", answer: "Restricted" },
];

export default function Task08ExecPolicy({ markComplete, isComplete }: TaskContext) {
  const [choices, setChoices] = useState<Record<string, Policy | null>>({ s1: null, s2: null, s3: null, s4: null });
  const [checked, setChecked] = useState(false);

  const allSet = SCENES.every((s) => choices[s.id]);
  const score = SCENES.reduce((acc, s) => acc + (choices[s.id] === s.answer ? 1 : 0), 0);

  const verify = () => {
    setChecked(true);
    if (score === SCENES.length) markComplete();
  };

  const reset = () => {
    setChoices({ s1: null, s2: null, s3: null, s4: null });
    setChecked(false);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Associa a ogni contesto la policy più adatta
        </div>

        <div className="mb-4 grid gap-2 md:grid-cols-4">
          {POLICIES.map((p) => (
            <div key={p.id} className={cn("rounded-md border bg-background p-2 text-center", p.tone)}>
              <div className="font-mono text-xs">{p.id}</div>
              <div className="mt-1 text-[10px] text-muted-foreground">{p.desc}</div>
            </div>
          ))}
        </div>

        <ul className="space-y-3">
          {SCENES.map((s) => {
            const val = choices[s.id];
            const correct = checked && val === s.answer;
            const wrong = checked && val && val !== s.answer;
            return (
              <li key={s.id} className={cn(
                "rounded-md border p-3",
                correct ? "border-success bg-success/10" : wrong ? "border-destructive bg-destructive/10" : "border-border bg-background",
              )}>
                <div className="mb-2 text-sm text-foreground">{s.text}</div>
                <div className="flex flex-wrap gap-2">
                  {POLICIES.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setChecked(false);
                        setChoices((c) => ({ ...c, [s.id]: p.id }));
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1 font-mono text-[11px] transition",
                        val === p.id ? "border-accent bg-accent/20 text-foreground" : "border-border text-muted-foreground hover:border-accent/60",
                      )}
                    >
                      {p.id}
                    </button>
                  ))}
                  {checked && (
                    <span className="ml-auto inline-flex items-center gap-1 text-[11px]">
                      {correct ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}
                      {!correct && <span className="text-muted-foreground">→ {s.answer}</span>}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={verify}
            disabled={!allSet}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
          >
            Verifica
          </button>
          {checked && (
            <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs text-foreground hover:border-accent">
              <RotateCcw className="h-3.5 w-3.5" /> Riprova
            </button>
          )}
          {checked && <span className="ml-auto font-mono text-xs text-muted-foreground">{score}/{SCENES.length}</span>}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Regola generale: meno fiducia hai nel codice, più stretta deve essere la policy.</InfoNote>
      ) : (
        <SuccessNote>Ottimo. Saper scegliere la ExecutionPolicy giusta è il primo passo per un uso sicuro di PowerShell in produzione.</SuccessNote>
      )}
    </div>
  );
}
