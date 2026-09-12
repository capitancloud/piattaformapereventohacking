import { useState } from "react";
import { Skull, Power } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type ProcStatus = "running" | "stopped";

type Process = {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  status: ProcStatus;
};

const INITIAL_PROCS: Process[] = [
  { pid: 1024, name: "sshd", user: "root", cpu: 1.2, status: "running" },
  { pid: 2048, name: "apache2", user: "www-data", cpu: 4.5, status: "running" },
  { pid: 4096, name: "miner-xmr", user: "nobody", cpu: 89.0, status: "running" },
  { pid: 8192, name: "cron", user: "root", cpu: 0.1, status: "running" },
];

export default function Task08Processes({ markComplete, isComplete }: TaskContext) {
  const [procs, setProcs] = useState(INITIAL_PROCS);
  const [serviceStopped, setServiceStopped] = useState(false);

  const kill = (pid: number) => {
    setProcs((p) => {
      const next = p.map((proc) => (proc.pid === pid ? { ...proc, status: "stopped", cpu: 0 } : proc));
      const suspiciousKilled = next.find((proc) => proc.name === "miner-xmr")?.status === "stopped";
      const apacheStoppedByProc = next.find((proc) => proc.name === "apache2")?.status === "stopped";
      if (suspiciousKilled && (apacheStoppedByProc || serviceStopped) && !isComplete) {
        markComplete();
      }
      return next;
    });
  };

  const stopService = () => {
    setServiceStopped(true);
    setProcs((p) => {
      const next = p.map((proc) => (proc.name === "apache2" ? { ...proc, status: "stopped", cpu: 0 } : proc));
      const suspiciousKilled = next.find((proc) => proc.name === "miner-xmr")?.status === "stopped";
      if (suspiciousKilled && !isComplete) {
        markComplete();
      }
      return next;
    });
  };

  const apacheStopped = procs.find((p) => p.name === "apache2")?.status === "stopped" || serviceStopped;

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Processi attivi
        </div>
        <div className="space-y-2">
          {procs.map((p) => (
            <div
              key={p.pid}
              className={cn(
                "flex flex-wrap items-center justify-between gap-3 rounded-md border bg-background px-3 py-2",
                p.status === "stopped" ? "border-success/40 opacity-60" : "border-border",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{p.pid}</span>
                <span className="font-mono text-sm text-foreground">{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.user}</span>
                <span className={cn("text-xs", p.cpu > 50 ? "text-destructive" : "text-muted-foreground")}>
                  CPU {p.cpu.toFixed(1)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-[10px] uppercase",
                    p.status === "running" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground",
                  )}
                >
                  {p.status}
                </span>
                {p.status === "running" && (
                  <button
                    onClick={() => kill(p.pid)}
                    className="flex items-center gap-1 rounded-md bg-destructive/10 px-2 py-1 text-xs text-destructive transition hover:bg-destructive/20"
                  >
                    <Skull className="h-3 w-3" />
                    kill {p.pid}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-md border border-border bg-background p-3">
          <div>
            <div className="text-sm text-foreground">Servizio apache2</div>
            <div className="text-xs text-muted-foreground">systemctl stop apache2</div>
          </div>
          <button
            onClick={stopService}
            disabled={apacheStopped}
            className="flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            <Power className="h-3 w-3" />
            {apacheStopped ? "Fermato" : "Ferma servizio"}
          </button>
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          Individua il processo sospeso che consuma CPU (89%) e terminalo con <code className="text-accent">kill</code>.
          Poi ferma il servizio apache2 come se usassi <code className="text-accent">systemctl stop</code>.
        </InfoNote>
      ) : (
        <SuccessNote>
          <code>ps</code> e <code>top</code> ti mostrano i processi. <code>kill</code> li termina. <code>systemctl</code>{" "}
          gestisce i servizi. Un processo con CPU anomala può essere malware.
        </SuccessNote>
      )}
    </div>
  );
}
