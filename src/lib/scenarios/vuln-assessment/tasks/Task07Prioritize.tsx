import { useMemo, useState } from "react";
import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Finding = {
  id: string;
  title: string;
  cvss: number;
  exposed: boolean;
  data: "critici" | "sensibili" | "pubblici";
  exploit: boolean;
};

const FINDINGS: Finding[] = [
  { id: "a", title: "SQL injection sul portale pagamenti", cvss: 8.6, exposed: true, data: "critici", exploit: true },
  { id: "b", title: "Apache 2.4.49 RCE su server web pubblico", cvss: 9.8, exposed: true, data: "sensibili", exploit: true },
  { id: "c", title: "SMBv1 EternalBlue su un pc di test in LAN", cvss: 8.1, exposed: false, data: "pubblici", exploit: true },
  { id: "d", title: "Banner del server rivela la versione", cvss: 3.1, exposed: true, data: "pubblici", exploit: false },
  { id: "e", title: "Certificato TLS scaduto sul sito interno HR", cvss: 5.3, exposed: false, data: "sensibili", exploit: false },
];

function score(f: Finding) {
  return f.cvss + (f.exposed ? 2 : 0) + (f.data === "critici" ? 2 : f.data === "sensibili" ? 1 : 0) + (f.exploit ? 1 : 0);
}

export default function Task07Prioritize({ markComplete, isComplete }: TaskContext) {
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const correct = useMemo(() => [...FINDINGS].sort((a, b) => score(b) - score(a)).map((f) => f.id), []);
  const ok = order.length === FINDINGS.length && order.every((id, i) => id === correct[i]);

  const pick = (id: string) => {
    if (order.includes(id) || checked) return;
    setOrder((o) => [...o, id]);
  };
  const reset = () => {
    setOrder([]);
    setChecked(false);
  };

  const verify = () => {
    setChecked(true);
    if (ok) markComplete();
  };

  const remaining = FINDINGS.filter((f) => !order.includes(f.id));

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        Le vulnerabilità non si sistemano tutte insieme: si mettono in fila. Ordina queste scoperte dalla più urgente alla meno urgente, considerando gravità, esposizione, dati coinvolti e presenza di exploit pubblico.
      </p>

      <div className="mb-4 min-w-0 rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">La tua fila di remediation</div>
        {order.length === 0 && <p className="text-sm text-muted-foreground">Clicca la scoperta più urgente qui sotto per iniziare…</p>}
        <ol className="space-y-2">
          {order.map((id, i) => {
            const f = FINDINGS.find((x) => x.id === id)!;
            const wrongHere = checked && id !== correct[i];
            const icon = i === 0 ? <ShieldAlert className="h-4 w-4 text-destructive" /> : i === order.length - 1 ? <ShieldCheck className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-gold" />;
            return (
              <li key={id} className={cn("flex min-w-0 items-center gap-3 rounded-md border p-3", wrongHere ? "border-destructive bg-destructive/10" : checked ? "border-success bg-success/10" : "border-border bg-background")}>
                <span className="font-mono text-xs text-accent">#{i + 1}</span>
                {icon}
                <div className="min-w-0">
                  <div className="break-words text-sm text-foreground">{f.title}</div>
                  <div className="text-[11px] text-muted-foreground">CVSS {f.cvss} · {f.exposed ? "esposto" : "solo LAN"} · dati {f.data} · exploit {f.exploit ? "pubblico" : "non pubblico"}</div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid min-w-0 gap-2 sm:grid-cols-2">
        {remaining.map((f) => (
          <button key={f.id} onClick={() => pick(f.id)} className="min-w-0 rounded-md border border-border bg-background p-3 text-left transition hover:border-accent/60">
            <div className="break-words text-sm font-medium text-foreground">{f.title}</div>
            <div className="text-[11px] text-muted-foreground">CVSS {f.cvss} · {f.exposed ? "esposto" : "solo LAN"} · dati {f.data} · exploit {f.exploit ? "pubblico" : "non pubblico"}</div>
          </button>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        {order.length === FINDINGS.length && !checked && (
          <button onClick={verify} className="rounded-md border border-accent bg-accent/15 px-4 py-2 text-sm text-foreground transition hover:bg-accent/25">Verifica l'ordine</button>
        )}
        {(order.length > 0 || checked) && (
          <button onClick={reset} className="rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition hover:border-accent/50">Ricomincia</button>
        )}
      </div>

      {!checked && <InfoNote>Formula pratica: CVSS + esposizione a internet + dati coinvolti + exploit già pubblico. Più alto il totale, più alta la priorità.</InfoNote>}
      {checked && !ok && <WarnNote>Non è ancora l'ordine giusto: quella esposta a internet con exploit pubblico e dati critici viene sempre prima di una vulnerabilità solo LAN.</WarnNote>}
      {isComplete && (
        <SuccessNote>
          Ottima priorità: hai messo in cima ciò che l'attaccante colpirebbe stanotte e in fondo ciò che
          può aspettare la prossima finestra di manutenzione.
        </SuccessNote>
      )}
    </div>
  );
}
