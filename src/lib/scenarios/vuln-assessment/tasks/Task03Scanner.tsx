import { useState } from "react";
import { InteractiveTerminal, type TermResponse } from "@/components/lab/InteractiveTerminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const PROCEDURE = [
  { id: "nmap", label: "Lancia nmap con gli script «vuln» contro 10.10.10.44", match: /^nmap\s+--script\s+vuln\s+10\.10\.10\.44$/ },
  { id: "leggi", label: "Leggi l'output e trova la vulnerabilità critica", match: /^leggi$/ },
];

const NMAP_OUT = [
  { text: "Starting Nmap 7.94 ( https://nmap.org )", kind: "out" as const },
  { text: "Nmap scan report for 10.10.10.44", kind: "out" as const },
  { text: "PORT     STATE SERVICE", kind: "out" as const },
  { text: "80/tcp   open  http    Apache httpd 2.4.49", kind: "out" as const },
  { text: "| http-vuln-cve-2021-41773:", kind: "out" as const },
  { text: "|   VULNERABLE:", kind: "err" as const },
  { text: "|   Path traversal e esecuzione comandi in Apache 2.4.49", kind: "err" as const },
  { text: "|     IDs: CVE-2021-41773   Rischio: CRITICO", kind: "err" as const },
  { text: "445/tcp  open  microsoft-ds", kind: "out" as const },
  { text: "| smb-vuln-ms17-010:", kind: "out" as const },
  { text: "|   VULNERABLE: EternalBlue (CVE-2017-0144)  Rischio: CRITICO", kind: "err" as const },
  { text: "Nmap done: 1 host up, 2 vulnerabilità critiche trovate", kind: "info" as const },
  { text: "Ora scrivi «leggi» per analizzare i risultati.", kind: "info" as const },
];

export default function Task03Scanner({ markComplete, isComplete }: TaskContext) {
  const [step, setStep] = useState(0);
  const [found, setFound] = useState<string[]>([]);

  const VULNS = [
    { id: "41773", label: "Apache 2.4.49 — path traversal (CVE-2021-41773)" },
    { id: "ms17010", label: "SMB — EternalBlue (CVE-2017-0144)" },
  ];

  const onCommand = (raw: string): TermResponse | TermResponse[] | undefined => {
    const cmd = raw.trim().toLowerCase();
    const current = PROCEDURE[step];
    if (current && current.match.test(cmd)) {
      const next = step + 1;
      setStep(next);
      if (current.id === "nmap") return NMAP_OUT;
      return { text: "Due vulnerabilità critiche confermate. Selezionale entrambe nella colonna a destra.", kind: "info" };
    }
    if (/^nmap/.test(cmd))
      return { text: "Manca qualcosa: serve --script vuln e l'obiettivo 10.10.10.44.", kind: "err" };
    if (cmd === "help") return { text: "Prova: nmap --script vuln 10.10.10.44", kind: "info" };
    return { text: `comando non riconosciuto: ${raw} (scrivi «help»)`, kind: "err" };
  };

  const toggle = (id: string) => {
    if (step < 2) return;
    setFound((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  };

  const done = found.length === 2;
  if (done && !isComplete) markComplete();

  return (
    <div>
      <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <InteractiveTerminal title="kali — vulnerability scan" onCommand={onCommand} heightClass="min-h-[300px]" />
        </div>
        <aside className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">Procedura</div>
          <ol className="mb-4 space-y-2">
            {PROCEDURE.map((p, i) => (
              <li key={p.id} className="flex min-w-0 items-start gap-2 text-sm">
                <span className={cn("mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full", i < step ? "bg-success" : i === step ? "bg-accent" : "bg-border")} />
                <span className={cn("min-w-0 break-words", i < step ? "text-muted-foreground line-through" : "text-foreground")}>{p.label}</span>
              </li>
            ))}
          </ol>
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">Vulnerabilità trovate</div>
          {step < 2 ? (
            <p className="text-xs text-muted-foreground">Completa la scansione per vedere i risultati.</p>
          ) : (
            <div className="space-y-2">
              {VULNS.map((v) => (
                <button
                  key={v.id}
                  onClick={() => toggle(v.id)}
                  className={cn(
                    "w-full min-w-0 rounded-md border p-2 text-left text-xs transition",
                    found.includes(v.id)
                      ? "border-destructive bg-destructive/15 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-accent/50",
                  )}
                >
                  {v.label}
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>
      {!isComplete && <InfoNote>Gli scanner come nmap (con gli script «vuln»), Nessus e OpenVAS confrontano ciò che trovano con i database delle vulnerabilità note. Tu fai la scansione, loro fanno il confronto.</InfoNote>}
      {isComplete && (
        <SuccessNote>
          Ottimo lavoro: due vulnerabilità critiche confermate. Lo scanner le trova, ma sei tu a doverle
          leggere, capire e trasformare in un piano d'azione.
        </SuccessNote>
      )}
    </div>
  );
}
