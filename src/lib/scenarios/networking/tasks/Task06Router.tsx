import { useState } from "react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const HOPS = [
  { name: "PC (LAN)", ip: "192.168.1.10", note: "Origine" },
  { name: "Router casa", ip: "192.168.1.1", note: "Gateway" },
  { name: "Router ISP", ip: "10.20.30.1", note: "Backbone provider" },
  { name: "Router core", ip: "185.44.12.1", note: "Peering internazionale" },
  { name: "Router destinazione", ip: "93.184.216.1", note: "Rete del sito" },
  { name: "Server web", ip: "93.184.216.34", note: "Destinazione" },
];

export default function Task06Router({ markComplete, isComplete }: TaskContext) {
  const [active, setActive] = useState<number>(-1);
  const [ttl, setTtl] = useState(64);
  const [sent, setSent] = useState(0);

  const send = () => {
    setActive(0);
    setTtl(64);
    let i = 0;
    const timer = setInterval(() => {
      i++;
      if (i >= HOPS.length) {
        clearInterval(timer);
        setActive(HOPS.length - 1);
        setSent((s) => {
          const n = s + 1;
          if (n >= 2) markComplete();
          return n;
        });
        return;
      }
      setActive(i);
      setTtl((t) => t - 1);
    }, 500);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            Percorso di un pacchetto
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            TTL: <span className="text-foreground">{ttl}</span>
          </span>
        </div>

        <div className="space-y-2">
          {HOPS.map((h, i) => {
            const done = active > i;
            const current = active === i;
            return (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-3 rounded-md border px-3 py-2 transition",
                  current
                    ? "border-accent bg-accent/10 violet-glow"
                    : done
                      ? "border-success/50 bg-success/5"
                      : "border-border bg-background",
                )}
              >
                <span className="grid h-8 w-8 place-items-center rounded-md border border-border font-mono text-xs text-muted-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-foreground">{h.name}</div>
                  <div className="font-mono text-[11px] text-muted-foreground">{h.ip} · {h.note}</div>
                </div>
                {current && (
                  <span className="animate-pulse font-mono text-[10px] uppercase text-accent">
                    ← qui
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={send}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
        >
          Invia pacchetto verso 93.184.216.34
        </button>
        {sent > 0 && (
          <span className="ml-3 text-xs text-muted-foreground">
            Pacchetti inviati: <span className="text-accent">{sent}</span>
          </span>
        )}
      </div>

      {!isComplete ? (
        <InfoNote>
          Invia almeno 2 pacchetti. Ogni router decrementa il TTL prima di inoltrare — è così che
          traceroute mappa i router intermedi.
        </InfoNote>
      ) : (
        <SuccessNote>
          Ogni interfaccia di un router sta su una rete diversa. La routing table decide dove
          inoltrare guardando l'IP di destinazione.
        </SuccessNote>
      )}
    </div>
  );
}
