import { useState } from "react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const DOMAINS = [
  { name: "www.example.com", ip: "93.184.216.34" },
  { name: "wikipedia.org", ip: "208.80.154.224" },
  { name: "github.com", ip: "140.82.121.3" },
];

type Step = { label: string; server: string; answer: string };

export default function Task08Dns({ markComplete, isComplete }: TaskContext) {
  const [domainIdx, setDomainIdx] = useState(0);
  const [steps, setSteps] = useState<Step[]>([]);
  const [running, setRunning] = useState(false);
  const [resolved, setResolved] = useState<Set<string>>(new Set());

  const resolve = () => {
    const d = DOMAINS[domainIdx]!;
    setRunning(true);
    setSteps([]);
    const tld = d.name.split(".").pop()!;
    const chain: Step[] = [
      { label: "Resolver locale (cache miss)", server: "192.168.1.1", answer: "chiedo ai root" },
      { label: "Root server", server: "a.root-servers.net", answer: `so chi gestisce .${tld}` },
      { label: `TLD .${tld}`, server: `a.gtld-servers.net`, answer: `so chi è autoritativo per ${d.name.split(".").slice(-2).join(".")}` },
      { label: "Server autoritativo", server: `ns1.${d.name.split(".").slice(-2).join(".")}`, answer: `${d.name} → ${d.ip}` },
      { label: "Risposta al client", server: "192.168.1.1", answer: `${d.name} = ${d.ip}` },
    ];
    let i = 0;
    const timer = setInterval(() => {
      setSteps((s) => [...s, chain[i]!]);
      i++;
      if (i >= chain.length) {
        clearInterval(timer);
        setRunning(false);
        setResolved((r) => {
          const n = new Set(r).add(d.name);
          if (n.size >= 2) markComplete();
          return n;
        });
      }
    }, 500);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-widest text-accent">Query DNS:</span>
          <select
            value={domainIdx}
            onChange={(e) => {
              setDomainIdx(parseInt(e.target.value));
              setSteps([]);
            }}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-accent"
          >
            {DOMAINS.map((d, i) => (
              <option key={d.name} value={i}>
                {d.name}
              </option>
            ))}
          </select>
          <button
            onClick={resolve}
            disabled={running}
            className="ml-auto rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            {running ? "Risoluzione…" : "Risolvi"}
          </button>
        </div>

        <div className="min-h-[220px] space-y-1.5">
          {steps.length === 0 && (
            <div className="grid h-[220px] place-items-center text-xs text-muted-foreground">
              Premi «Risolvi» per avviare la catena.
            </div>
          )}
          {steps.map((s, i) => (
            <div
              key={i}
              className={cn(
                "animate-in fade-in slide-in-from-left-2 flex items-start gap-3 rounded-md border border-border bg-background p-2.5 duration-300",
              )}
            >
              <span className="grid h-6 w-6 place-items-center rounded border border-accent/40 bg-accent/10 font-mono text-[10px] text-accent">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-foreground">{s.label}</div>
                <div className="font-mono text-[11px] text-muted-foreground">
                  {s.server} → <span className="text-accent">{s.answer}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          Risolvi almeno 2 domini diversi. Osserva come la catena parte sempre dai root e scende
          fino al server autoritativo.
        </InfoNote>
      ) : (
        <SuccessNote>
          In realtà il resolver mette tutto in cache: la prima query è lenta, le successive
          istantanee — fino allo scadere del TTL.
        </SuccessNote>
      )}
    </div>
  );
}
