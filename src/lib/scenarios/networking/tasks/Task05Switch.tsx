import { useState } from "react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const PORTS = [
  { id: 1, mac: "3C:22:FB:AA:11:22", name: "PC-A" },
  { id: 2, mac: "F4:0F:24:9E:2D:01", name: "PC-B" },
  { id: 3, mac: "B8:27:EB:12:34:56", name: "Server" },
  { id: 4, mac: "AC:DE:48:00:11:22", name: "Stampante" },
];

type MacTable = Record<string, number>;
type LogEntry = { text: string; kind: "flood" | "unicast" | "learn" };

export default function Task05Switch({ markComplete, isComplete }: TaskContext) {
  const [table, setTable] = useState<MacTable>({});
  const [log, setLog] = useState<LogEntry[]>([]);
  const [src, setSrc] = useState(1);
  const [dst, setDst] = useState(2);

  const send = () => {
    const srcPort = PORTS.find((p) => p.id === src)!;
    const dstPort = PORTS.find((p) => p.id === dst)!;
    if (srcPort.id === dstPort.id) return;

    const entries: LogEntry[] = [];
    const nextTable = { ...table };
    if (nextTable[srcPort.mac] !== srcPort.id) {
      nextTable[srcPort.mac] = srcPort.id;
      entries.push({
        text: `Switch impara: ${srcPort.mac} → porta ${srcPort.id}`,
        kind: "learn",
      });
    }
    if (nextTable[dstPort.mac]) {
      entries.push({
        text: `Destinazione conosciuta: unicast solo su porta ${nextTable[dstPort.mac]}`,
        kind: "unicast",
      });
    } else {
      entries.push({
        text: `Destinazione sconosciuta: flooding su tutte le porte tranne ${srcPort.id}`,
        kind: "flood",
      });
    }

    setTable(nextTable);
    setLog((l) => [...entries, ...l].slice(0, 8));
    if (Object.keys(nextTable).length >= 3) markComplete();
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          Switch a 4 porte
        </div>

        <div className="grid grid-cols-4 gap-2">
          {PORTS.map((p) => {
            const known = table[p.mac];
            return (
              <div
                key={p.id}
                className={cn(
                  "rounded-lg border p-2 text-center",
                  known ? "border-accent/60 bg-accent/10" : "border-border bg-background",
                )}
              >
                <div className="text-[10px] text-muted-foreground">Porta {p.id}</div>
                <div className="mt-0.5 text-xs text-foreground">{p.name}</div>
                <div className="mt-0.5 font-mono text-[9px] text-muted-foreground">{p.mac.slice(0, 8)}…</div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-xs text-muted-foreground">
            Sorgente
            <select
              value={src}
              onChange={(e) => setSrc(parseInt(e.target.value))}
              className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-accent"
            >
              {PORTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-muted-foreground">
            Destinazione
            <select
              value={dst}
              onChange={(e) => setDst(parseInt(e.target.value))}
              className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-accent"
            >
              {PORTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={send}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
          >
            Invia frame
          </button>
          <button
            onClick={() => {
              setTable({});
              setLog([]);
            }}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition hover:border-accent/60 hover:text-foreground"
          >
            Reset switch
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              MAC address table
            </div>
            {Object.keys(table).length === 0 ? (
              <div className="rounded-md border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                (vuota — ogni frame sarà flooding)
              </div>
            ) : (
              <div className="divide-y divide-border rounded-md border border-border bg-background">
                {Object.entries(table).map(([mac, port]) => (
                  <div key={mac} className="flex justify-between px-3 py-1.5 font-mono text-[11px]">
                    <span className="text-foreground">{mac}</span>
                    <span className="text-accent">porta {port}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Log
            </div>
            <div className="min-h-[80px] space-y-1 rounded-md border border-border bg-background p-2">
              {log.length === 0 ? (
                <div className="p-1 text-xs text-muted-foreground">(nessuna attività)</div>
              ) : (
                log.map((l, i) => (
                  <div
                    key={i}
                    className={cn(
                      "font-mono text-[11px]",
                      l.kind === "flood"
                        ? "text-destructive"
                        : l.kind === "unicast"
                          ? "text-success"
                          : "text-accent",
                    )}
                  >
                    · {l.text}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          Invia frame tra host diversi finché lo switch non ha imparato almeno 3 MAC.
        </InfoNote>
      ) : (
        <SuccessNote>
          Uno switch «istruito» smista in unicast. Un attaccante che riempie la MAC-table (MAC
          flooding) forza lo switch a comportarsi come un hub — tutti sniffano tutto.
        </SuccessNote>
      )}
    </div>
  );
}
