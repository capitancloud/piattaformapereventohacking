import { useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const DB = [
  {
    cve: "CVE-2021-41773",
    product: "Apache HTTP Server 2.4.49",
    cvss: 9.8,
    kind: "Path traversal + RCE",
    exploit: "Pubblico",
    note: "Sfruttabile con una singola richiesta HTTP: patch immediata verso 2.4.51.",
  },
  {
    cve: "CVE-2017-0144",
    product: "Windows SMB v1",
    cvss: 8.1,
    kind: "Esecuzione remota (EternalBlue)",
    exploit: "Pubblico, usato da ransomware",
    note: "Applica MS17-010 o disattiva SMBv1.",
  },
  {
    cve: "CVE-2014-0160",
    product: "OpenSSL 1.0.1",
    cvss: 7.5,
    kind: "Divulgazione memoria (Heartbleed)",
    exploit: "Pubblico",
    note: "Aggiorna OpenSSL e ruota tutte le chiavi private.",
  },
];

const CASES = [
  {
    id: "case1",
    text: "Il tuo scanner ha rilevato «Apache 2.4.49» su un server. Quale CVE cerchi?",
    correct: "CVE-2021-41773",
  },
  {
    id: "case2",
    text: "Un vecchio Windows Server 2008 espone la porta 445 con SMBv1. A quale CVE guardi?",
    correct: "CVE-2017-0144",
  },
  {
    id: "case3",
    text: "Un sito usa ancora OpenSSL 1.0.1. Vuoi capire se rischia di far leggere la memoria del server. Quale CVE?",
    correct: "CVE-2014-0160",
  },
];

export default function Task06Cve({ markComplete, isComplete }: TaskContext) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const q = query.trim().toLowerCase();
  const results = q.length < 2 ? [] : DB.filter((d) => d.cve.toLowerCase().includes(q) || d.product.toLowerCase().includes(q) || d.kind.toLowerCase().includes(q));

  const score = CASES.filter((c) => selected[c.id] === c.correct).length;
  const all = CASES.every((c) => selected[c.id] !== undefined);

  const verify = () => {
    setChecked(true);
    if (score === CASES.length) markComplete();
  };

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        Ogni vulnerabilità nota ha un codice: <span className="font-mono text-accent">CVE-anno-numero</span>. Usa il database qui sotto per associare la CVE giusta a ciascun caso.
      </p>

      <div className="mb-4 min-w-0 rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex min-w-0 items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca prodotto, tipo o CVE (es. «apache», «smb», «openssl»)"
            className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
        </div>
        <div className="space-y-2">
          {results.length === 0 && <p className="text-xs text-muted-foreground">Digita almeno due caratteri per cercare nel database.</p>}
          {results.map((d) => (
            <div key={d.cve} className="min-w-0 rounded-md border border-border bg-background p-3 text-xs">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="font-mono text-accent">{d.cve}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                <span className={cn("rounded-full px-2 py-0.5 text-[10px]", d.cvss >= 9 ? "bg-destructive/20 text-destructive" : d.cvss >= 7 ? "bg-gold/20 text-gold" : "bg-success/20 text-success")}>
                  CVSS {d.cvss}
                </span>
              </div>
              <div className="break-words text-foreground">{d.product} — {d.kind}</div>
              <div className="break-words text-muted-foreground">Exploit: {d.exploit} · {d.note}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {CASES.map((c) => {
          const sel = selected[c.id];
          const good = checked && sel === c.correct;
          const bad = checked && sel !== undefined && sel !== c.correct;
          return (
            <div key={c.id} className={cn("min-w-0 rounded-xl border p-3", good && "border-success bg-success/10", bad && "border-destructive bg-destructive/10", !good && !bad && "border-border bg-surface")}>
              <p className="mb-2 break-words text-sm text-foreground">{c.text}</p>
              <div className="flex flex-wrap gap-2">
                {DB.map((d) => (
                  <button
                    key={d.cve}
                    onClick={() => setSelected((s) => ({ ...s, [c.id]: d.cve }))}
                    className={cn(
                      "rounded-md border px-3 py-1.5 font-mono text-xs transition",
                      sel === d.cve ? "border-accent bg-accent/15 text-foreground" : "border-border bg-background text-muted-foreground hover:border-accent/50",
                    )}
                  >
                    {d.cve}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {!checked && (
        <button onClick={verify} disabled={!all} className="mt-4 rounded-md border border-accent bg-accent/15 px-4 py-2 text-sm text-foreground transition hover:bg-accent/25 disabled:opacity-40">
          Verifica gli abbinamenti
        </button>
      )}
      {checked && score < CASES.length && (
        <WarnNote>
          {score}/{CASES.length} corrette. Cerca il prodotto nel database e leggi il campo «tipo».
          <button onClick={() => setChecked(false)} className="ml-2 underline">Riprova</button>
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Bravo: hai fatto quello che si fa ogni giorno, cercare il codice CVE che spiega la scoperta.
          I database pubblici (NVD, MITRE, ExploitDB) sono l'atlante del vulnerability assessment.
        </SuccessNote>
      )}
      {!checked && <InfoNote>Cerca per parola chiave: «apache», «smb», «openssl» ti mostreranno le CVE compatibili con ogni caso.</InfoNote>}
    </div>
  );
}
