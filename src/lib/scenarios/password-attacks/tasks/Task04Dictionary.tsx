import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const WORDLIST_TOP = [
  "123456", "password", "qwerty", "111111", "iloveyou", "admin", "welcome",
  "monkey", "dragon", "master", "letmein", "shadow", "abc123", "football",
  "estate2024", "inverno2024", "juventus", "milan", "roma", "napoli",
];

const TARGETS = [
  { user: "mario", password: "iloveyou", label: "Utente medio con password comune" },
  { user: "laura", password: "estate2024", label: "Utente con parola stagionale" },
  { user: "sara", password: "K4nguro-Viola-Lampada!", label: "Utente con passphrase" },
];

export default function Task04Dictionary({ markComplete, isComplete }: TaskContext) {
  const [targetIdx, setTargetIdx] = useState(0);
  const [i, setI] = useState(0);
  const [running, setRunning] = useState(false);
  const [found, setFound] = useState<string | null>(null);
  const [tried, setTried] = useState(0);
  const [completedTargets, setCompletedTargets] = useState<Set<number>>(new Set());
  const timer = useRef<number | null>(null);

  const target = TARGETS[targetIdx]!;

  useEffect(() => {
    if (!running) return;
    timer.current = window.setInterval(() => {
      setI((prev) => {
        const next = prev + 1;
        const word = WORDLIST_TOP[prev];
        if (word === target.password) {
          setFound(word);
          setRunning(false);
          setCompletedTargets((c) => new Set(c).add(targetIdx));
        }
        if (next >= WORDLIST_TOP.length) {
          setRunning(false);
        }
        setTried((t) => t + 1);
        return next;
      });
    }, 180);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [running, target.password, targetIdx]);

  useEffect(() => {
    if (completedTargets.size >= 2) markComplete();
  }, [completedTargets]); // eslint-disable-line

  const reset = () => {
    setI(0);
    setTried(0);
    setFound(null);
    setRunning(false);
  };

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        La wordlist scorre in ordine di popolarità. Scegli un bersaglio, lancia l'attacco e osserva quando (e se) la password viene trovata. Completa due bersagli diversi per proseguire.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {TARGETS.map((t, idx) => (
          <button
            key={t.user}
            onClick={() => {
              setTargetIdx(idx);
              reset();
            }}
            className={cn(
              "rounded-md border px-3 py-1.5 text-xs transition",
              targetIdx === idx
                ? "border-accent bg-accent/15 text-foreground"
                : "border-border bg-surface text-muted-foreground hover:border-accent/50",
              completedTargets.has(idx) && "ring-1 ring-success/60",
            )}
          >
            {t.user} — {t.label}
          </button>
        ))}
      </div>

      <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-black shadow-2xl shadow-black/60">
          <div className="flex items-center gap-2 border-b border-border/60 bg-surface-2 px-3 py-2 text-xs">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-gold/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
            </div>
            <span className="ml-2 font-mono text-[11px] text-muted-foreground">
              dictionary attack — target: {target.user}
            </span>
          </div>
          <div className="min-w-0 space-y-0.5 p-3 font-mono text-[12px] leading-relaxed">
            {WORDLIST_TOP.map((w, idx) => {
              const isCurrent = idx === i - 1 && running;
              const isPast = idx < i;
              const isFound = found === w;
              return (
                <div
                  key={w}
                  className={cn(
                    "min-w-0 rounded px-2 py-0.5 break-all transition",
                    isFound && "bg-success/20 text-success",
                    !isFound && isCurrent && "bg-accent/20 text-foreground",
                    !isFound && !isCurrent && isPast && "text-destructive/60 line-through",
                    !isPast && !isCurrent && "text-ivory/70",
                  )}
                >
                  <span className="mr-2 text-muted-foreground">[{String(idx + 1).padStart(2, "0")}]</span>
                  {w}
                  {isFound && "   ← MATCH!"}
                  {!isFound && isPast && "   ✗"}
                </div>
              );
            })}
            {!running && i >= WORDLIST_TOP.length && !found && (
              <div className="mt-2 text-destructive">Wordlist esaurita: nessuna password trovata.</div>
            )}
          </div>
        </div>

        <aside className="min-w-0 space-y-3">
          <div className="rounded-xl border border-border bg-surface p-3 text-xs">
            <div className="mb-1 text-muted-foreground">Tentativi</div>
            <div className="font-mono text-2xl text-foreground">{tried}</div>
            <div className="mt-2 text-muted-foreground">Password vera</div>
            <div className="font-mono text-sm text-gold break-all">{found ?? "•••••"}</div>
          </div>
          <div className="flex gap-2">
            {!running ? (
              <Button className="flex-1" disabled={i >= WORDLIST_TOP.length || !!found} onClick={() => setRunning(true)}>
                <Play className="h-4 w-4" /> Avvia
              </Button>
            ) : (
              <Button className="flex-1" variant="outline" onClick={() => setRunning(false)}>
                <Square className="h-4 w-4" /> Pausa
              </Button>
            )}
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </aside>
      </div>

      {!isComplete && (
        <InfoNote>
          Nota: la passphrase di sara non appare nemmeno nella top 20. Un attacco a dizionario semplice si ferma qui.
        </InfoNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai visto perché una password comune cade nei primi tentativi, mentre una passphrase resta al sicuro dal dizionario base.
        </SuccessNote>
      )}
    </div>
  );
}
