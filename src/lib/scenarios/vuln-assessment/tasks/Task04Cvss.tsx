import { useState } from "react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Band = "bassa" | "media" | "alta" | "critica";

const BANDS: { id: Band; label: string; range: string; color: string }[] = [
  { id: "bassa", label: "Bassa", range: "0.1 – 3.9", color: "border-success bg-success/15 text-foreground" },
  { id: "media", label: "Media", range: "4.0 – 6.9", color: "border-gold bg-gold/15 text-foreground" },
  { id: "alta", label: "Alta", range: "7.0 – 8.9", color: "border-destructive/70 bg-destructive/10 text-foreground" },
  { id: "critica", label: "Critica", range: "9.0 – 10.0", color: "border-destructive bg-destructive/20 text-foreground" },
];

const FINDINGS: { id: string; title: string; desc: string; band: Band; why: string }[] = [
  {
    id: "f1",
    title: "EternalBlue su un server esposto a internet",
    desc: "Esecuzione di codice da remoto, senza autenticazione, con exploit pubblico usato dai ransomware.",
    band: "critica",
    why: "Sfruttabile da chiunque, danno totale: CVSS 9.8.",
  },
  {
    id: "f2",
    title: "Banner del server web che rivela la versione di Apache",
    desc: "Un'informazione utile a chi attacca, ma da sola non permette nessun accesso.",
    band: "bassa",
    why: "Solo divulgazione di informazioni: CVSS 3.1.",
  },
  {
    id: "f3",
    title: "XSS in una pagina di ricerca interna",
    desc: "Richiede che una vittima clicchi un link preparato; impatto limitato alla sessione.",
    band: "media",
    why: "Serve interazione della vittima e l'impatto è circoscritto: CVSS 5.4.",
  },
  {
    id: "f4",
    title: "SQL injection sulla pagina di login dei clienti",
    desc: "Permette di leggere e modificare l'intero database, senza credenziali.",
    band: "alta",
    why: "Danno grave ma richiede qualche condizione in più del caso critico: CVSS 8.2.",
  },
];

export default function Task04Cvss({ markComplete, isComplete }: TaskContext) {
  const [choices, setChoices] = useState<Record<string, Band>>({});
  const [checked, setChecked] = useState(false);

  const score = FINDINGS.filter((f) => choices[f.id] === f.band).length;
  const all = FINDINGS.every((f) => choices[f.id] !== undefined);

  const check = () => {
    setChecked(true);
    if (score === FINDINGS.length) markComplete();
  };

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        CVSS è il termometro delle vulnerabilità: un punteggio da 0 a 10. Per ogni scoperta scegli la fascia giusta.
      </p>

      <div className="mb-4 grid min-w-0 grid-cols-2 gap-1 overflow-hidden rounded-lg sm:grid-cols-4">
        {BANDS.map((b) => (
          <div key={b.id} className={cn("min-w-0 border p-2 text-center text-xs", b.color)}>
            <div className="font-semibold">{b.label}</div>
            <div className="font-mono text-[10px] opacity-80">{b.range}</div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {FINDINGS.map((f) => {
          const choice = choices[f.id];
          const good = checked && choice === f.band;
          const bad = checked && choice !== undefined && choice !== f.band;
          return (
            <div
              key={f.id}
              className={cn(
                "min-w-0 rounded-xl border p-4 transition",
                good && "border-success bg-success/10",
                bad && "border-destructive bg-destructive/10",
                !good && !bad && "border-border bg-surface",
              )}
            >
              <div className="mb-1 break-words text-sm font-medium text-foreground">{f.title}</div>
              <p className="mb-3 break-words text-xs text-muted-foreground">{f.desc}</p>
              <div className="flex flex-wrap gap-2">
                {BANDS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setChoices((c) => ({ ...c, [f.id]: b.id }))}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs transition",
                      choice === b.id ? b.color : "border-border bg-background text-muted-foreground hover:border-accent/50",
                    )}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              {checked && choice !== undefined && (
                <p className="mt-2 break-words text-xs text-muted-foreground">{f.why}</p>
              )}
            </div>
          );
        })}
      </div>

      {!checked && (
        <button onClick={check} disabled={!all} className="mt-4 rounded-md border border-accent bg-accent/15 px-4 py-2 text-sm text-foreground transition hover:bg-accent/25 disabled:opacity-40">
          Verifica le fasce
        </button>
      )}
      {checked && score < FINDINGS.length && (
        <WarnNote>
          {score}/{FINDINGS.length} giuste. Chiediti: quanto danno fa? serve una credenziale? serve che qualcuno clicchi?
          <button onClick={() => setChecked(false)} className="ml-2 underline">Correggi</button>
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Ora sai leggere il termometro: il CVSS incrocia facilità di sfruttamento e impatto. Un 9.8 esposto a
          internet si sistema oggi; un 3.1 informativo si annota e si pianifica.
        </SuccessNote>
      )}
      {!checked && <InfoNote>Regola rapida: codice eseguibile da remoto senza password → critico; solo informazioni rivelate → basso.</InfoNote>}
    </div>
  );
}
