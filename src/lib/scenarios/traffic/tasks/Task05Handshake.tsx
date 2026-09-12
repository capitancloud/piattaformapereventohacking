import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown, Play, CheckCircle2, RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

interface Packet {
  id: string;
  label: string;
  from: "client" | "server";
  desc: string;
}

const CORRECT: Packet[] = [
  { id: "syn", label: "SYN", from: "client", desc: "Client: 'voglio parlare, seq=1000'" },
  { id: "synack", label: "SYN, ACK", from: "server", desc: "Server: 'ok, seq=5000, ack=1001'" },
  { id: "ack", label: "ACK", from: "client", desc: "Client: 'ricevuto, ack=5001'. Connessione aperta." },
];

const SHUFFLED: Packet[] = [CORRECT[2]!, CORRECT[0]!, CORRECT[1]!];

export default function Task05Handshake({ markComplete, isComplete }: TaskContext) {
  const [order, setOrder] = useState<Packet[]>(SHUFFLED);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [ok, setOk] = useState(false);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    [next[i], next[j]] = [next[j]!, next[i]!];
    setOrder(next);
    setOk(false);
    setStep(-1);
  };

  const play = () => {
    setPlaying(true);
    setStep(-1);
  };

  useEffect(() => {
    if (!playing) return;
    if (step + 1 >= order.length) {
      const good = order.every((p, i) => p.id === CORRECT[i]!.id);
      setOk(good);
      if (good) markComplete();
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 700);
    return () => clearTimeout(t);
  }, [playing, step, order, markComplete]);

  const reset = () => {
    setOrder(SHUFFLED);
    setStep(-1);
    setOk(false);
    setPlaying(false);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Rimetti in ordine i 3 pacchetti del three-way handshake, poi premi Play
        </div>

        <ol className="mb-4 space-y-2">
          {order.map((p, i) => (
            <li key={p.id} className={cn(
              "flex items-center gap-3 rounded-md border p-3 transition",
              step >= i && playing ? "border-accent bg-accent/10" : "border-border bg-background",
              ok && "border-success bg-success/10",
            )}>
              <span className="w-6 font-mono text-xs text-accent">{i + 1}.</span>
              <span className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[10px]",
                p.from === "client" ? "bg-primary/25 text-primary-foreground" : "bg-gold-soft/25 text-gold",
              )}>
                {p.from}
              </span>
              <div className="flex-1">
                <div className="font-mono text-sm text-foreground">[{p.label}]</div>
                <div className="text-[11px] text-muted-foreground">{p.desc}</div>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => move(i, -1)} disabled={i === 0 || playing} className="rounded border border-border p-1 text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-30" aria-label="su">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => move(i, 1)} disabled={i === order.length - 1 || playing} className="rounded border border-border p-1 text-muted-foreground hover:border-accent hover:text-foreground disabled:opacity-30" aria-label="giù">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ol>

        <div className="relative min-h-[118px] overflow-x-auto rounded-md border border-border bg-black/50 p-3">
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>Client 10.0.0.10</span>
            <span>Server 10.0.0.20</span>
          </div>
          <div className="mt-2 space-y-1.5">
            {order.map((p, i) => {
              const visible = step >= i && playing || (ok && !playing);
              return (
                <div key={p.id} className={cn(
                  "flex items-center gap-2 font-mono text-[11px] transition-opacity",
                  visible ? "opacity-100" : "opacity-30",
                )}>
                  {p.from === "client" ? (
                    <>
                      <span className="w-24 text-primary-foreground">client</span>
                      <span className="flex-1 text-center text-accent">──[ {p.label} ]──▶</span>
                      <span className="w-24 text-right text-gold">server</span>
                    </>
                  ) : (
                    <>
                      <span className="w-24 text-primary-foreground">client</span>
                      <span className="flex-1 text-center text-accent">◀──[ {p.label} ]──</span>
                      <span className="w-24 text-right text-gold">server</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button onClick={play} disabled={playing} className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40">
            <Play className="h-3.5 w-3.5" /> Play handshake
          </button>
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-xs text-foreground hover:border-accent">
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          {ok && (
            <span className="ml-auto inline-flex items-center gap-1 text-xs text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> connessione aperta
            </span>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Se l'ordine è sbagliato l'animazione parte comunque, ma la connessione non risulta stabilita.</InfoNote>
      ) : (
        <SuccessNote>Hai visto il ritmo del TCP. Da qui riconoscerai anche gli handshake incompleti dei port scan.</SuccessNote>
      )}
    </div>
  );
}
