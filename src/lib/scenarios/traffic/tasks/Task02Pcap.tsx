import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Layer = "eth" | "ip" | "tcp" | "app";

const LAYERS: { id: Layer; label: string; sub: string }[] = [
  { id: "eth", label: "Ethernet (L2)", sub: "collegamento fisico" },
  { id: "ip", label: "IP (L3)", sub: "instradamento" },
  { id: "tcp", label: "TCP / UDP (L4)", sub: "trasporto" },
  { id: "app", label: "Applicativo (L7)", sub: "il contenuto vero" },
];

const FIELDS: { text: string; answer: Layer }[] = [
  { text: "aa:bb:cc:11:22:33 (indirizzo MAC)", answer: "eth" },
  { text: "192.168.1.10 (indirizzo IP sorgente)", answer: "ip" },
  { text: "porta 443", answer: "tcp" },
  { text: "GET /login HTTP/1.1", answer: "app" },
  { text: "TTL = 64", answer: "ip" },
  { text: "Host: www.example.com", answer: "app" },
  { text: "flag SYN", answer: "tcp" },
  { text: "EtherType 0x0800 (IPv4)", answer: "eth" },
];

export default function Task02Pcap({ markComplete, isComplete }: TaskContext) {
  const [answers, setAnswers] = useState<(Layer | null)[]>(Array(FIELDS.length).fill(null));
  const [checked, setChecked] = useState(false);

  const allSet = answers.every(Boolean);
  const score = answers.reduce((a: number, v, i) => a + (v === FIELDS[i]?.answer ? 1 : 0), 0);

  const verify = () => {
    setChecked(true);
    if (score === FIELDS.length) markComplete();
  };
  const reset = () => {
    setAnswers(Array(FIELDS.length).fill(null));
    setChecked(false);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 grid gap-2 md:grid-cols-4">
          {LAYERS.map((l) => (
            <div key={l.id} className="rounded-md border border-border bg-background p-2 text-center">
              <div className="font-mono text-xs text-accent">{l.label}</div>
              <div className="text-[10px] text-muted-foreground">{l.sub}</div>
            </div>
          ))}
        </div>

        <ul className="space-y-2">
          {FIELDS.map((f, i) => {
            const val = answers[i];
            const correct = checked && val === f.answer;
            const wrong = checked && val && val !== f.answer;
            return (
              <li key={i} className={cn(
                "flex flex-wrap items-center justify-between gap-3 rounded-md border p-3",
                correct ? "border-success bg-success/10" : wrong ? "border-destructive bg-destructive/10" : "border-border bg-background",
              )}>
                <span className="font-mono text-xs text-foreground">{f.text}</span>
                <div className="flex flex-wrap gap-1">
                  {LAYERS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => {
                        setChecked(false);
                        const next = [...answers];
                        next[i] = l.id;
                        setAnswers(next);
                      }}
                      className={cn(
                        "rounded-full border px-2 py-0.5 font-mono text-[10px] transition",
                        val === l.id ? "border-accent bg-accent/20 text-foreground" : "border-border text-muted-foreground hover:border-accent/60",
                      )}
                    >
                      {l.id.toUpperCase()}
                    </button>
                  ))}
                  {checked && (correct ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />)}
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
          {checked && <span className="ml-auto font-mono text-xs text-muted-foreground">{score}/{FIELDS.length}</span>}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Un pacchetto è una matrioska: Ethernet contiene IP, che contiene TCP, che contiene i dati applicativi.</InfoNote>
      ) : (
        <SuccessNote>Hai la mappa dei livelli. Ora ogni campo che vedi in Wireshark ha un posto preciso.</SuccessNote>
      )}
    </div>
  );
}
