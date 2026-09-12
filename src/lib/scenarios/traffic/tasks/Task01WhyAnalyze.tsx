import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw, Wrench, Shield, Search } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Cat = "trouble" | "security" | "forensic";

const CATS: { id: Cat; label: string; icon: typeof Wrench; color: string }[] = [
  { id: "trouble", label: "Troubleshooting", icon: Wrench, color: "border-accent/60 text-accent" },
  { id: "security", label: "Sicurezza", icon: Shield, color: "border-primary/60 text-primary-foreground" },
  { id: "forensic", label: "Forense", icon: Search, color: "border-gold-soft/60 text-gold" },
];

const SCENES: { text: string; answer: Cat }[] = [
  { text: "Un sito interno si apre lentamente e vogliamo capire dove si perde tempo", answer: "trouble" },
  { text: "Una workstation aziendale parla ogni 30 secondi con un IP sconosciuto in Cina", answer: "security" },
  { text: "Dopo un attacco ransomware, il cliente chiede di ricostruire quali dati sono usciti", answer: "forensic" },
  { text: "Un'app cade con timeout e vogliamo vedere se il server risponde davvero", answer: "trouble" },
  { text: "Sospettiamo un malware che esfiltra dati e vogliamo scoprirlo in tempo reale", answer: "security" },
  { text: "Serve una prova legale di quali file sono stati scaricati durante l'incidente", answer: "forensic" },
];

export default function Task01WhyAnalyze({ markComplete, isComplete }: TaskContext) {
  const [answers, setAnswers] = useState<(Cat | null)[]>(Array(SCENES.length).fill(null));
  const [checked, setChecked] = useState(false);

  const allSet = answers.every(Boolean);
  const score = answers.reduce((a: number, v, i) => a + (v === SCENES[i]?.answer ? 1 : 0), 0);

  const verify = () => {
    setChecked(true);
    if (score === SCENES.length) markComplete();
  };
  const reset = () => {
    setAnswers(Array(SCENES.length).fill(null));
    setChecked(false);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 grid gap-2 md:grid-cols-3">
          {CATS.map((c) => (
            <div key={c.id} className={cn("flex items-center gap-2 rounded-md border bg-background p-3", c.color)}>
              <c.icon className="h-4 w-4" />
              <span className="font-mono text-xs">{c.label}</span>
            </div>
          ))}
        </div>
        <ul className="space-y-3">
          {SCENES.map((s, i) => {
            const val = answers[i];
            const correct = checked && val === s.answer;
            const wrong = checked && val && val !== s.answer;
            return (
              <li key={i} className={cn(
                "rounded-md border p-3",
                correct ? "border-success bg-success/10" : wrong ? "border-destructive bg-destructive/10" : "border-border bg-background",
              )}>
                <div className="mb-2 text-sm text-foreground">{s.text}</div>
                <div className="flex flex-wrap items-center gap-2">
                  {CATS.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setChecked(false);
                        const next = [...answers];
                        next[i] = c.id;
                        setAnswers(next);
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1 font-mono text-[11px] transition",
                        val === c.id ? "border-accent bg-accent/20 text-foreground" : "border-border text-muted-foreground hover:border-accent/60",
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                  {checked && (
                    <span className="ml-auto inline-flex items-center gap-1 text-[11px]">
                      {correct ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}
                      {!correct && <span className="text-muted-foreground">→ {CATS.find((c) => c.id === s.answer)?.label}</span>}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex items-center gap-2">
          <button onClick={verify} disabled={!allSet} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40">
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
        <InfoNote>Attenzione: sicurezza è "sto scoprendo un attacco ora", forense è "ricostruisco cosa è successo".</InfoNote>
      ) : (
        <SuccessNote>Chiara la mappa: stessi pacchetti, tre lenti diverse.</SuccessNote>
      )}
    </div>
  );
}
