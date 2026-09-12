import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

interface Query {
  q: string;
  suspicious: boolean;
  why: string;
}

const QUERIES: Query[] = [
  { q: "www.google.com", suspicious: false, why: "dominio popolare e leggibile" },
  { q: "xk7f2s9d1p8m3q.top", suspicious: true, why: "stringa casuale, TLD sospetto: sembra DGA" },
  { q: "api.github.com", suspicious: false, why: "servizio noto" },
  { q: "aGVsbG9fZnJvbV9jbGllbnQ.data.attacker.io", suspicious: true, why: "sottodominio lunghissimo in base64: tunneling DNS" },
  { q: "cdn.cloudflare.net", suspicious: false, why: "CDN legittima" },
  { q: "qwrtyplkjhgfd.info", suspicious: true, why: "nome senza senso: probabile DGA" },
  { q: "mail.protonmail.com", suspicious: false, why: "servizio email conosciuto" },
  { q: "eXhoMTIzX2V4ZmlsdHJhdGlvbg.tun.evil.xyz", suspicious: true, why: "sottodominio in base64: esfiltrazione via DNS" },
];

export default function Task08Dns({ markComplete, isComplete }: TaskContext) {
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(QUERIES.length).fill(null));
  const [checked, setChecked] = useState(false);

  const allSet = answers.every((a) => a !== null);
  const score = answers.reduce((a: number, v, i) => a + (v === QUERIES[i]?.suspicious ? 1 : 0), 0);

  const verify = () => {
    setChecked(true);
    if (score === QUERIES.length) markComplete();
  };
  const reset = () => {
    setAnswers(Array(QUERIES.length).fill(null));
    setChecked(false);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Per ogni query DNS, decidi: legittima o sospetta?
        </div>

        <ul className="space-y-2">
          {QUERIES.map((q, i) => {
            const val = answers[i];
            const correct = checked && val === q.suspicious;
            const wrong = checked && val !== null && val !== q.suspicious;
            return (
              <li key={i} className={cn(
                "rounded-md border p-3",
                correct ? "border-success bg-success/10" : wrong ? "border-destructive bg-destructive/10" : "border-border bg-background",
              )}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="font-mono text-xs text-ivory">{q.q}</div>
                    {checked && <div className="mt-1 text-[11px] text-muted-foreground">{q.why}</div>}
                  </div>
                  <div className="flex items-center gap-1">
                    {[
                      { v: false, label: "Legittima" },
                      { v: true, label: "Sospetta" },
                    ].map((opt) => (
                      <button
                        key={String(opt.v)}
                        onClick={() => {
                          setChecked(false);
                          const next = [...answers];
                          next[i] = opt.v;
                          setAnswers(next);
                        }}
                        className={cn(
                          "rounded-full border px-3 py-1 font-mono text-[11px] transition",
                          val === opt.v ? (opt.v ? "border-destructive bg-destructive/20 text-destructive" : "border-success bg-success/15 text-success") : "border-border text-muted-foreground hover:border-accent/60",
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                    {checked && (correct ? <CheckCircle2 className="ml-1 h-3.5 w-3.5 text-success" /> : <XCircle className="ml-1 h-3.5 w-3.5 text-destructive" />)}
                  </div>
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
          {checked && <span className="ml-auto font-mono text-xs text-muted-foreground">{score}/{QUERIES.length}</span>}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Guarda tre cose: leggibilità del nome, lunghezza dei sottodomini, TLD (top level: .com, .net, .top…).</InfoNote>
      ) : (
        <SuccessNote>Hai riconosciuto DGA e tunneling DNS. Sono tra i canali preferiti dai malware moderni.</SuccessNote>
      )}
    </div>
  );
}
