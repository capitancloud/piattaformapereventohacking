import { useState } from "react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";

const CLIENTS = [
  { name: "Laptop", ip: "192.168.1.10" },
  { name: "Smartphone", ip: "192.168.1.11" },
  { name: "Smart TV", ip: "192.168.1.12" },
];

const DESTS = [
  { name: "google.com", ip: "142.250.180.14", port: 443 },
  { name: "netflix.com", ip: "52.32.44.10", port: 443 },
  { name: "github.com", ip: "140.82.121.3", port: 443 },
];

const PUBLIC_IP = "82.13.44.9";

type Row = {
  intIp: string;
  intPort: number;
  extPort: number;
  dstIp: string;
  dstPort: number;
  dstName: string;
  clientName: string;
};

export default function Task07Nat({ markComplete, isComplete }: TaskContext) {
  const [rows, setRows] = useState<Row[]>([]);
  const [client, setClient] = useState(0);
  const [dest, setDest] = useState(0);

  const open = () => {
    const c = CLIENTS[client]!;
    const d = DESTS[dest]!;
    const row: Row = {
      intIp: c.ip,
      intPort: 40000 + Math.floor(Math.random() * 20000),
      extPort: 50000 + rows.length,
      dstIp: d.ip,
      dstPort: d.port,
      dstName: d.name,
      clientName: c.name,
    };
    const next = [row, ...rows].slice(0, 8);
    setRows(next);
    if (next.length >= 3) markComplete();
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">
            Rete interna 192.168.1.0/24
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            IP pubblico: <span className="text-foreground">{PUBLIC_IP}</span>
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-muted-foreground">
            Client interno
            <select
              value={client}
              onChange={(e) => setClient(parseInt(e.target.value))}
              className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-accent"
            >
              {CLIENTS.map((c, i) => (
                <option key={c.ip} value={i}>
                  {c.name} · {c.ip}
                </option>
              ))}
            </select>
          </label>
          <label className="text-xs text-muted-foreground">
            Destinazione
            <select
              value={dest}
              onChange={(e) => setDest(parseInt(e.target.value))}
              className="mt-1 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none focus:border-accent"
            >
              {DESTS.map((d, i) => (
                <option key={d.name} value={i}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          onClick={open}
          className="mt-3 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
        >
          Apri connessione uscente
        </button>

        <div className="mt-5">
          <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Tabella NAT del router
          </div>
          {rows.length === 0 ? (
            <div className="rounded-md border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
              (nessuna connessione ancora aperta)
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-border bg-background">
              <table className="min-w-full font-mono text-[11px]">
                <thead className="bg-surface-2 text-muted-foreground">
                  <tr>
                    <th className="px-2 py-1.5 text-left">Interno</th>
                    <th className="px-2 py-1.5 text-left">→ NAT →</th>
                    <th className="px-2 py-1.5 text-left">Esterno</th>
                    <th className="px-2 py-1.5 text-left">Destinazione</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((r, i) => (
                    <tr key={i} className="text-foreground">
                      <td className="px-2 py-1.5">
                        {r.intIp}:{r.intPort}
                      </td>
                      <td className="px-2 py-1.5 text-accent">→</td>
                      <td className="px-2 py-1.5 text-accent">
                        {PUBLIC_IP}:{r.extPort}
                      </td>
                      <td className="px-2 py-1.5 text-muted-foreground">
                        {r.dstName} ({r.dstIp}:{r.dstPort})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          Apri almeno 3 connessioni. Nota che tutte escono con lo stesso IP pubblico ma porte
          diverse: la porta è la chiave per riconsegnare le risposte al client giusto.
        </InfoNote>
      ) : (
        <SuccessNote>
          NAT/PAT: N dispositivi condividono 1 IP pubblico. Rompe però il modello «ogni dispositivo è
          raggiungibile», rendendo più complessi peer-to-peer, VoIP, giochi online.
        </SuccessNote>
      )}
    </div>
  );
}
