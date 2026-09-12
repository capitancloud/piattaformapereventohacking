import { useState } from "react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Status = "open" | "closed" | "filtered";
type Port = { port: number; svc: string; status: Status };

const HOSTS: { name: string; ip: string; ports: Port[] }[] = [
  {
    name: "Web server pubblico",
    ip: "10.0.0.10",
    ports: [
      { port: 22, svc: "SSH", status: "filtered" },
      { port: 80, svc: "HTTP", status: "open" },
      { port: 443, svc: "HTTPS", status: "open" },
      { port: 3306, svc: "MySQL", status: "closed" },
      { port: 3389, svc: "RDP", status: "closed" },
    ],
  },
  {
    name: "Domain controller",
    ip: "10.0.0.20",
    ports: [
      { port: 53, svc: "DNS", status: "open" },
      { port: 88, svc: "Kerberos", status: "open" },
      { port: 389, svc: "LDAP", status: "open" },
      { port: 445, svc: "SMB", status: "open" },
      { port: 3389, svc: "RDP", status: "filtered" },
    ],
  },
  {
    name: "Stampante di rete",
    ip: "10.0.0.30",
    ports: [
      { port: 21, svc: "FTP", status: "open" },
      { port: 80, svc: "HTTP (admin)", status: "open" },
      { port: 515, svc: "LPD", status: "open" },
      { port: 631, svc: "IPP", status: "open" },
      { port: 9100, svc: "RAW print", status: "open" },
    ],
  },
];

export default function Task09Ports({ markComplete, isComplete }: TaskContext) {
  const [scanned, setScanned] = useState<Record<number, boolean>>({});
  const [progress, setProgress] = useState<Record<number, number>>({});

  const scan = (i: number) => {
    setProgress((p) => ({ ...p, [i]: 0 }));
    const total = HOSTS[i]!.ports.length;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setProgress((p) => ({ ...p, [i]: step }));
      if (step >= total) {
        clearInterval(timer);
        setScanned((s) => {
          const next = { ...s, [i]: true };
          if (Object.keys(next).length >= 2) markComplete();
          return next;
        });
      }
    }, 250);
  };

  return (
    <div>
      <div className="space-y-3">
        {HOSTS.map((h, i) => {
          const done = scanned[i];
          const prog = progress[i] ?? 0;
          const shown = h.ports.slice(0, prog);
          return (
            <div key={h.ip} className="rounded-xl border border-border bg-surface p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-sm text-foreground">{h.name}</div>
                  <div className="font-mono text-[11px] text-muted-foreground">{h.ip}</div>
                </div>
                <button
                  onClick={() => scan(i)}
                  disabled={done || prog > 0}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:opacity-50"
                >
                  {done ? "Scansione completata" : prog > 0 ? "In corso…" : "Avvia port scan"}
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-5">
                {h.ports.map((p, k) => {
                  const visible = k < shown.length;
                  return (
                    <div
                      key={p.port}
                      className={cn(
                        "rounded-md border p-2 text-center font-mono text-[11px] transition",
                        !visible && "opacity-20",
                        visible && p.status === "open" && "border-success/60 bg-success/10 text-success",
                        visible && p.status === "closed" && "border-border bg-background text-muted-foreground",
                        visible && p.status === "filtered" && "border-destructive/40 bg-destructive/10 text-destructive",
                      )}
                    >
                      <div className="text-foreground">{p.port}</div>
                      <div className="text-[10px] opacity-80">{p.svc}</div>
                      <div className="mt-1 text-[9px] uppercase">
                        {visible ? p.status : "?"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!isComplete ? (
        <InfoNote>
          Esegui la scansione di almeno 2 host. Verde = porta aperta (servizio attivo), grigio =
          chiusa, rosso = filtrata da un firewall.
        </InfoNote>
      ) : (
        <SuccessNote>
          Ogni porta aperta è un potenziale ingresso. Difesa: chiudi ciò che non serve, aggiorna ciò
          che resta esposto, filtra tutto il resto.
        </SuccessNote>
      )}
    </div>
  );
}
