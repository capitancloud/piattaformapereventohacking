import { useState } from "react";
import { X, CheckCircle2, XCircle } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type ChipKind = "cmd" | "opt" | "arg";
interface Chip {
  id: string;
  label: string;
  kind: ChipKind;
}

const POOL: Chip[] = [
  { id: "ls", label: "ls", kind: "cmd" },
  { id: "-la", label: "-la", kind: "opt" },
  { id: "/etc", label: "/etc", kind: "arg" },
  { id: "grep", label: "grep", kind: "cmd" },
  { id: "-i", label: "-i", kind: "opt" },
  { id: "error", label: "\"error\"", kind: "arg" },
];

const SOLUTION = ["ls", "-la", "/etc"];

const KIND_STYLES: Record<ChipKind, string> = {
  cmd: "border-accent bg-accent/15 text-foreground",
  opt: "border-primary bg-primary/15 text-foreground",
  arg: "border-emerald-500/60 bg-emerald-500/10 text-foreground",
};

const KIND_LABEL: Record<ChipKind, string> = {
  cmd: "Comando",
  opt: "Opzione",
  arg: "Argomento",
};

export default function Task02Anatomy({ markComplete, isComplete }: TaskContext) {
  const [line, setLine] = useState<Chip[]>([]);
  const [checked, setChecked] = useState<null | boolean>(null);

  const add = (c: Chip) => {
    if (line.find((x) => x.id === c.id)) return;
    setLine([...line, c]);
    setChecked(null);
  };
  const remove = (id: string) => {
    setLine(line.filter((c) => c.id !== id));
    setChecked(null);
  };

  const verify = () => {
    const ok = line.length === 3 && line.every((c, i) => c.id === SOLUTION[i]);
    setChecked(ok);
    if (ok) markComplete();
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Componi: elenco dettagliato di /etc, mostrando anche i file nascosti
        </div>

        <div className="mb-4 min-w-0 break-words [overflow-wrap:anywhere] rounded-lg border border-border bg-black/60 p-4 font-mono text-sm">
          <span className="whitespace-nowrap text-gold-soft">kali@lab:~$ </span>
          {line.length === 0 && <span className="text-muted-foreground/60">clicca i pezzi sotto</span>}
          {line.map((c) => (
            <span key={c.id} className="mr-2 inline-flex items-center gap-1">
              <span className={cn("rounded-md border px-2 py-0.5 text-xs", KIND_STYLES[c.kind])}>{c.label}</span>
              <button onClick={() => remove(c.id)} className="text-muted-foreground hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {POOL.map((c) => {
            const used = line.find((x) => x.id === c.id);
            return (
              <button
                key={c.id}
                disabled={!!used}
                onClick={() => add(c)}
                className={cn(
                  "group flex flex-col items-start gap-0.5 rounded-md border px-3 py-2 text-left transition",
                  used ? "border-border/40 opacity-40" : cn(KIND_STYLES[c.kind], "hover:-translate-y-0.5"),
                )}
              >
                <span className="font-mono text-sm">{c.label}</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{KIND_LABEL[c.kind]}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={verify}
          disabled={line.length === 0}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
        >
          Verifica
        </button>

        {checked !== null && (
          <div className={cn("mt-3 flex items-center gap-2 text-sm", checked ? "text-success" : "text-destructive")}>
            {checked ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
            {checked ? "Comando ben formato: ls -la /etc" : "Non ancora: comando → opzioni → argomento."}
          </div>
        )}
      </div>

      {!isComplete ? (
        <InfoNote>
          Colori diversi = ruoli diversi. Viola = comando, blu = opzione, verde = argomento su cui agire.
        </InfoNote>
      ) : (
        <SuccessNote>
          Sapere leggere la struttura ti permette di capire comandi che non hai mai visto: cerca sempre le tre parti.
        </SuccessNote>
      )}
    </div>
  );
}
