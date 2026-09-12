import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Chunk = { id: string; label: string };

const ALL: Chunk[] = [
  { id: "cmd", label: "hydra" },
  { id: "L", label: "-l admin" },
  { id: "P", label: "-P rockyou.txt" },
  { id: "t", label: "-t 4" },
  { id: "target", label: "ssh://10.10.10.5" },
];

const CORRECT = ["cmd", "L", "P", "t", "target"];

const ATTEMPTS = [
  "admin:123456",
  "admin:password",
  "admin:iloveyou",
  "admin:qwerty",
  "admin:letmein",
  "admin:admin",
  "admin:welcome",
  "admin:Estate2024!",
  "admin:P@ssw0rd",
];
const FOUND_INDEX = 7;

export default function Task06Hydra({ markComplete, isComplete }: TaskContext) {
  const [order, setOrder] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState<{ text: string; kind: "info" | "err" | "ok" }[]>([]);
  const timer = useRef<number | null>(null);

  const correct = order.length === CORRECT.length && order.every((id, i) => id === CORRECT[i]);

  useEffect(() => {
    if (!running) return;
    let i = 0;
    setLines([
      { text: "[INFO] Hydra v9.5 (c) 2024 by van Hauser", kind: "info" },
      { text: `[DATA] max 4 tasks per 1 server, ${ATTEMPTS.length} tries, ~${ATTEMPTS.length} login tries per task`, kind: "info" },
      { text: "[DATA] attacking ssh://10.10.10.5:22/", kind: "info" },
    ]);
    timer.current = window.setInterval(() => {
      const a = ATTEMPTS[i];
      if (!a) {
        setRunning(false);
        if (timer.current) window.clearInterval(timer.current);
        return;
      }
      if (i === FOUND_INDEX) {
        setLines((L) => [
          ...L,
          { text: `[22][ssh] host: 10.10.10.5   login: admin   password: ${a.split(":")[1]}`, kind: "ok" },
          { text: "[STATUS] 1 valid password found. Exit.", kind: "ok" },
        ]);
        setRunning(false);
        markComplete();
        if (timer.current) window.clearInterval(timer.current);
        return;
      }
      setLines((L) => [...L, { text: `[ATTEMPT] target 10.10.10.5 - login "admin" - pass "${a.split(":")[1]}" - failed`, kind: "err" }]);
      i++;
    }, 350);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [running]); // eslint-disable-line

  const toggle = (id: string) => {
    setOrder((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));
  };

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        Clicca i frammenti nell'ordine corretto per comporre il comando hydra. Poi «Esegui» per vedere l'attacco online contro un finto server SSH.
      </p>

      <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Costruisci il comando</div>
        <div className="mt-2 min-w-0 rounded-md border border-border bg-black p-3">
          <code className="block min-w-0 break-all font-mono text-[13px] text-gold">
            {order.length === 0 ? <span className="text-muted-foreground">clicca i frammenti qui sotto…</span> : order.map((id) => ALL.find((c) => c.id === id)?.label).join(" ")}
          </code>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {ALL.map((c) => {
            const on = order.includes(c.id);
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id)}
                className={cn(
                  "rounded-md border px-2.5 py-1.5 font-mono text-xs transition active:scale-95",
                  on
                    ? "border-accent bg-accent/15 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-accent/50",
                )}
              >
                {c.label}
              </button>
            );
          })}
          <button
            onClick={() => setOrder([])}
            className="rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            reset
          </button>
        </div>

        <Button
          className="mt-4 w-full"
          disabled={!correct || running}
          onClick={() => {
            setLines([]);
            setRunning(true);
          }}
        >
          {running ? "Attacco in corso…" : correct ? "Esegui" : "Ordina prima i frammenti"}
        </Button>

        {!correct && order.length > 0 && (
          <WarnNote>Ordine tipico: hydra → -l utente → -P wordlist → -t thread → protocollo://ip.</WarnNote>
        )}

        {lines.length > 0 && (
          <div className="mt-4 min-w-0 overflow-hidden rounded-md border border-border bg-black p-3 font-mono text-[12px] leading-relaxed">
            {lines.map((l, i) => (
              <div
                key={i}
                className={cn(
                  "min-w-0 whitespace-pre-wrap break-all [overflow-wrap:anywhere]",
                  l.kind === "info" && "text-ivory/70",
                  l.kind === "err" && "text-destructive/80",
                  l.kind === "ok" && "text-success",
                )}
              >
                {l.text}
              </div>
            ))}
          </div>
        )}
      </div>

      {!isComplete && <InfoNote>Nel mondo reale, un servizio ben protetto blocca dopo 5-10 tentativi: hydra si ferma quasi subito.</InfoNote>}
      {isComplete && (
        <SuccessNote>
          Perfetto: hydra ha trovato la coppia admin:Estate2024!. In produzione, difenditi con MFA, blocco tentativi e fail2ban.
        </SuccessNote>
      )}
    </div>
  );
}
