import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const RECORDS = [
  { id: "a", label: "A", desc: "nome → indirizzo IP", example: "www.acme-lab.it → 93.184.10.15" },
  { id: "mx", label: "MX", desc: "chi riceve la posta", example: "acme-lab.it → mail.acme-lab.it" },
  { id: "ns", label: "NS", desc: "i server che gestiscono la zona", example: "acme-lab.it → ns1.provider.net" },
  { id: "txt", label: "TXT", desc: "note di testo (SPF, verifiche)", example: "«v=spf1 include:_spf.google.com ~all»" },
];

const SLOTS = [
  { id: "s1", prompt: "Vuoi sapere l'indirizzo IP del sito web", answer: "a" },
  { id: "s2", prompt: "Vuoi scoprire dove passa la posta aziendale", answer: "mx" },
  { id: "s3", prompt: "Vuoi elencare i server DNS autoritativi", answer: "ns" },
  { id: "s4", prompt: "Vuoi capire se usano Google Workspace", answer: "txt" },
];

export default function Task05Dns({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const all = Object.keys(picked).length === SLOTS.length;
  const score = SLOTS.filter((s) => picked[s.id] === s.answer).length;

  return (
    <div>
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-black p-4 font-mono text-xs shadow-2xl shadow-black/60">
        <p className="break-words text-muted-foreground">$ dig acme-lab.it ANY</p>
        <div className="mt-2 space-y-1">
          {RECORDS.map((r) => (
            <p key={r.id} className="break-words">
              <span className="text-accent">{r.label.padEnd(4)}</span>
              <span className="text-ivory/90">{r.example}</span>
            </p>
          ))}
        </div>
      </div>

      <p className="mt-4 mb-3 text-sm text-muted-foreground">
        Per ogni obiettivo, scegli il tipo di record da interrogare:
      </p>
      <div className="space-y-3">
        {SLOTS.map((s) => {
          const value = picked[s.id];
          const right = checked && value === s.answer;
          const wrong = checked && value && value !== s.answer;
          return (
            <div
              key={s.id}
              className={cn(
                "min-w-0 rounded-xl border border-border bg-surface p-4 transition",
                right && "border-success/60",
                wrong && "border-destructive/60",
              )}
            >
              <p className="break-words text-sm text-foreground">{s.prompt}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {RECORDS.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      setChecked(false);
                      setPicked((p) => ({ ...p, [s.id]: r.id }));
                    }}
                    className={cn(
                      "rounded-md border px-3 py-1.5 font-mono text-[11px] transition active:scale-95",
                      value === r.id
                        ? "border-accent bg-accent/15 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-accent/50",
                    )}
                  >
                    {r.label} · {r.desc}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Button
        className="mt-4 w-full"
        disabled={!all}
        onClick={() => {
          setChecked(true);
          if (SLOTS.every((s) => picked[s.id] === s.answer)) markComplete();
        }}
      >
        Verifica le scelte
      </Button>

      {!checked && (
        <InfoNote>
          Ogni record DNS è un indizio diverso: gli A mappano la rete, gli MX rivelano il provider
          di posta, i TXT spesso tradiscono quali servizi cloud usa l'azienda.
        </InfoNote>
      )}
      {checked && score < SLOTS.length && (
        <WarnNote>
          {score} su {SLOTS.length}. Ripensa a cosa contiene ogni record: nome del record e
          obiettivo devono raccontare la stessa cosa.
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Con quattro tipi di record hai mappato sito, posta, provider DNS e servizi cloud: il DNS è
          un annuario pubblico che quasi nessuno pensa a proteggere.
        </SuccessNote>
      )}
    </div>
  );
}
