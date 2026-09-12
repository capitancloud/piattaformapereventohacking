import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const CARDS = [
  {
    id: "c1",
    text: "Lo scanner segnala «Apache 2.4.49 vulnerabile», ma il server in realtà è Nginx con un banner modificato",
    fp: true,
    why: "Lo scanner ha creduto al banner: il software vulnerabile non c'è. Falso positivo.",
  },
  {
    id: "c2",
    text: "Segnalata SQL injection: hai provato la prova di concetto e il database risponde davvero",
    fp: false,
    why: "Confermata con un test manuale: è un vero positivo.",
  },
  {
    id: "c3",
    text: "«TLS 1.0 abilitato»: ti colleghi con openssl e il server accetta davvero la connessione",
    fp: false,
    why: "Il test diretto conferma il protocollo vecchio: vero positivo.",
  },
  {
    id: "c4",
    text: "«WordPress 4.9 obsoleto», ma la patch di sicurezza è stata applicata con il backport dal vendor",
    fp: true,
    why: "La versione sembra vecchia ma la falla è chiusa: classico falso positivo da backport.",
  },
  {
    id: "c5",
    text: "«SNMP public»: lanci snmpwalk e leggi davvero l'elenco dei processi",
    fp: false,
    why: "La prova funziona: vero positivo.",
  },
  {
    id: "c6",
    text: "«Porta 21 aperta con FTP anonimo», ma al momento del test il servizio risponde solo dalla rete interna",
    fp: true,
    why: "Da internet non è raggiungibile: il rischio segnalato non esiste in quel contesto.",
  },
];

export default function Task05FalsePositives({ markComplete, isComplete }: TaskContext) {
  const [sorted, setSorted] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState(false);

  const score = CARDS.filter((c) => sorted[c.id] === c.fp).length;
  const all = CARDS.every((c) => sorted[c.id] !== undefined);

  const check = () => {
    setChecked(true);
    if (score === CARDS.length) markComplete();
  };

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        Gli scanner sbagliano più spesso di quanto pensi. Per ogni segnalazione decidi: vero positivo (il problema esiste) o falso positivo (lo scanner ha visto male)?
      </p>
      <div className="grid min-w-0 gap-3">
        {CARDS.map((c) => {
          const choice = sorted[c.id];
          const good = checked && choice === c.fp;
          const bad = checked && choice !== undefined && choice !== c.fp;
          return (
            <div
              key={c.id}
              className={cn(
                "min-w-0 rounded-xl border p-4 transition",
                good && "border-success bg-success/10",
                bad && "border-destructive bg-destructive/10",
                !good && !bad && "border-border bg-surface",
              )}
            >
              <p className="mb-3 break-words text-sm text-foreground">{c.text}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSorted((s) => ({ ...s, [c.id]: false }))}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs transition",
                    choice === false
                      ? "border-destructive bg-destructive/15 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-accent/50",
                  )}
                >
                  Vero positivo
                </button>
                <button
                  onClick={() => setSorted((s) => ({ ...s, [c.id]: true }))}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs transition",
                    choice === true
                      ? "border-gold bg-gold/15 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-accent/50",
                  )}
                >
                  Falso positivo
                </button>
              </div>
              {checked && choice !== undefined && (
                <p className="mt-2 break-words text-xs text-muted-foreground">{c.why}</p>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3">
        {!checked ? (
          <button onClick={check} disabled={!all} className="rounded-md border border-accent bg-accent/15 px-4 py-2 text-sm text-foreground transition hover:bg-accent/25 disabled:opacity-40">
            Verifica il triage
          </button>
        ) : (
          score < CARDS.length && (
            <button onClick={() => setChecked(false)} className="flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition hover:border-accent/50">
              <RotateCcw className="h-3.5 w-3.5" /> Correggi
            </button>
          )
        )}
      </div>
      {!checked && <InfoNote>Il trucco è sempre lo stesso: non fidarti dello scanner, riprova la segnalazione con un test manuale. Se il test fallisce, è un falso positivo.</InfoNote>}
      {checked && score < CARDS.length && <WarnNote>Rileggi le motivazioni sotto ogni carta: il confine è «ho verificato che il problema esiste davvero?».</WarnNote>}
      {isComplete && (
        <SuccessNote>
          Perfetto: un report pieno di falsi positivi fa perdere tempo e credibilità. Verificare ogni segnalazione
          è ciò che distingue un assessment serio da una stampa dello scanner.
        </SuccessNote>
      )}
    </div>
  );
}
