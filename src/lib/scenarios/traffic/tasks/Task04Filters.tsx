import { useState } from "react";
import { CheckCircle2, RefreshCw, Play } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

interface Goal {
  text: string;
  match: RegExp;
  hint: string;
}

const GOALS: Goal[] = [
  { text: "Vedi solo il traffico verso o da 10.0.0.5", match: /^\s*ip\.addr\s*==\s*10\.0\.0\.5\s*$/i, hint: "ip.addr == 10.0.0.5" },
  { text: "Mostra solo il traffico HTTPS (porta 443)", match: /^\s*tcp\.port\s*==\s*443\s*$/i, hint: "tcp.port == 443" },
  { text: "Vedi solo le query DNS", match: /^\s*dns\s*$/i, hint: "dns" },
  { text: "Solo pacchetti HTTP verso 10.0.0.5", match: /^\s*(http\s+and\s+ip\.addr\s*==\s*10\.0\.0\.5|ip\.addr\s*==\s*10\.0\.0\.5\s+and\s+http)\s*$/i, hint: "http and ip.addr == 10.0.0.5" },
];

const CHIPS = ["ip.addr", "tcp.port", "http", "dns", "and", "==", "10.0.0.5", "443"];

export default function Task04Filters({ markComplete, isComplete }: TaskContext) {
  const [idx, setIdx] = useState(0);
  const [filter, setFilter] = useState("");
  const [feedback, setFeedback] = useState<"ok" | "no" | null>(null);
  const [solved, setSolved] = useState<boolean[]>(Array(GOALS.length).fill(false));

  const goal = GOALS[idx]!;
  const valid = goal.match.test(filter);

  const submit = () => {
    if (valid) {
      setFeedback("ok");
      const next = [...solved];
      next[idx] = true;
      setSolved(next);
      if (next.every(Boolean)) markComplete();
    } else {
      setFeedback("no");
    }
  };

  const next = () => {
    setIdx((i) => (i + 1) % GOALS.length);
    setFilter("");
    setFeedback(null);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-mono text-xs uppercase tracking-widest text-accent">
            Filtro {idx + 1}/{GOALS.length}
          </div>
          <div className="flex gap-1">
            {solved.map((s, i) => (
              <span key={i} className={cn("h-2 w-6 rounded-full", s ? "bg-success" : i === idx ? "bg-accent" : "bg-border")} />
            ))}
          </div>
        </div>

        <div className="mb-3 rounded-md border border-border bg-background p-3 text-sm text-foreground">
          {goal.text}
        </div>

        <div className={cn(
          "flex items-center gap-2 rounded-md border-2 bg-black/60 p-2 font-mono text-sm transition",
          feedback === "ok" && "border-success",
          feedback === "no" && "border-destructive",
          !feedback && (filter && !valid ? "border-destructive/50" : "border-border"),
        )}>
          <span className="rounded bg-accent/20 px-2 py-0.5 text-xs text-accent">filter</span>
          <input
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setFeedback(null);
            }}
            spellCheck={false}
            placeholder="scrivi qui il filtro..."
            className="flex-1 bg-transparent text-ivory outline-none placeholder:text-muted-foreground/50"
          />
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {CHIPS.map((c) => (
            <button
              key={c}
              onClick={() => setFilter((f) => (f ? f + " " + c : c))}
              className="rounded-md border border-border bg-background px-2 py-1 font-mono text-[11px] text-muted-foreground transition hover:border-accent hover:text-foreground"
            >
              {c}
            </button>
          ))}
          <button onClick={() => setFilter("")} className="ml-auto rounded-md border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground hover:border-destructive/60 hover:text-destructive">
            clear
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button onClick={submit} disabled={!filter} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40">
            <Play className="h-3.5 w-3.5" /> Applica filtro
          </button>
          <button onClick={next} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs text-foreground hover:border-accent">
            <RefreshCw className="h-3.5 w-3.5" /> Prossimo obiettivo
          </button>
          {feedback === "ok" && (
            <span className="ml-auto inline-flex items-center gap-1 font-mono text-xs text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> filtro corretto
            </span>
          )}
          {feedback === "no" && <span className="ml-auto font-mono text-xs text-destructive">non è la sintassi giusta</span>}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Completa tutti gli obiettivi. Ricorda: doppio uguale (==), ip.addr, tcp.port e combinatore <span className="font-mono">and</span>.</InfoNote>
      ) : (
        <SuccessNote>Filtri Wireshark padroneggiati. Ora un pcap enorme non fa più paura.</SuccessNote>
      )}
    </div>
  );
}
