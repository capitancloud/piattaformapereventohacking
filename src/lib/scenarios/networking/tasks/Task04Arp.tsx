import { useState } from "react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const HOSTS = [
  { ip: "192.168.1.10", mac: "3C:22:FB:AA:11:22", name: "Il tuo PC", self: true },
  { ip: "192.168.1.20", mac: "F4:0F:24:9E:2D:01", name: "Stampante" },
  { ip: "192.168.1.30", mac: "B8:27:EB:12:34:56", name: "Server NAS" },
  { ip: "192.168.1.40", mac: "AC:DE:48:00:11:22", name: "Notebook collega" },
];

type Entry = { ip: string; mac: string };

export default function Task04Arp({ markComplete, isComplete }: TaskContext) {
  const [target, setTarget] = useState(HOSTS[1]!.ip);
  const [table, setTable] = useState<Entry[]>([]);
  const [phase, setPhase] = useState<"idle" | "request" | "reply" | "done">("idle");

  const send = () => {
    setPhase("request");
    setTimeout(() => setPhase("reply"), 700);
    setTimeout(() => {
      const host = HOSTS.find((h) => h.ip === target);
      if (host && !table.find((e) => e.ip === host.ip)) {
        const next = [...table, { ip: host.ip, mac: host.mac }];
        setTable(next);
        if (next.length >= 2) markComplete();
      }
      setPhase("done");
    }, 1500);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            LAN 192.168.1.0/24
          </span>
          <span className="text-xs text-muted-foreground">Tu: 192.168.1.10</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {HOSTS.map((h) => {
            const active = target === h.ip && !h.self;
            const isTarget = phase !== "idle" && target === h.ip;
            return (
              <button
                key={h.ip}
                disabled={h.self}
                onClick={() => setTarget(h.ip)}
                className={cn(
                  "relative rounded-lg border p-3 text-left transition",
                  h.self
                    ? "border-accent/40 bg-accent/5"
                    : active
                      ? "border-accent bg-accent/10"
                      : "border-border bg-background hover:border-accent/50",
                )}
              >
                <div className="text-[11px] text-muted-foreground">{h.name}</div>
                <div className="mt-0.5 font-mono text-xs text-foreground">{h.ip}</div>
                {isTarget && phase === "reply" && (
                  <div className="mt-1 font-mono text-[10px] text-accent">← {h.mac}</div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 min-h-[52px] rounded-md border border-border bg-background p-3 text-xs">
          {phase === "idle" && (
            <span className="text-muted-foreground">
              Seleziona un host e invia la richiesta ARP.
            </span>
          )}
          {phase === "request" && (
            <span className="font-mono text-accent">
              → broadcast FF:FF:FF:FF:FF:FF · «Chi ha {target}?»
            </span>
          )}
          {phase === "reply" && (
            <span className="font-mono text-success">
              ← risposta unicast da {target}
            </span>
          )}
          {phase === "done" && (
            <span className="text-muted-foreground">
              Voce salvata nella tabella ARP locale.
            </span>
          )}
        </div>

        <button
          onClick={send}
          disabled={phase === "request" || phase === "reply"}
          className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:opacity-50"
        >
          Invia richiesta ARP
        </button>

        <div className="mt-5">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Tabella ARP locale
          </div>
          {table.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
              (vuota)
            </div>
          ) : (
            <div className="divide-y divide-border rounded-md border border-border bg-background">
              {table.map((e) => (
                <div key={e.ip} className="flex justify-between px-3 py-2 font-mono text-xs">
                  <span className="text-foreground">{e.ip}</span>
                  <span className="text-accent">{e.mac}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          Fai almeno 2 richieste ARP verso host diversi per popolare la tabella.
        </InfoNote>
      ) : (
        <SuccessNote>
          ARP funziona senza autenticazione. Chi risponde per primo vince: da qui nascono gli attacchi
          MITM (ARP spoofing).
        </SuccessNote>
      )}
    </div>
  );
}
