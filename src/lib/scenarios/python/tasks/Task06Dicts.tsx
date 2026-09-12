import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const TARGET: Record<string, string> = {
  nome: "Ada",
  eta: "30",
  citta: "Roma",
};

const CANDIDATE_KEYS = ["nome", "eta", "citta", "lavoro"];
const CANDIDATE_VALUES = ["Ada", "30", "Roma", "Marco"];

export default function Task06Dicts({ markComplete, isComplete }: TaskContext) {
  const [dict, setDict] = useState<Record<string, string>>({});
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");

  const add = () => {
    if (!key || !value) return;
    const next = { ...dict, [key]: value };
    setDict(next);
    setKey("");
    setValue("");
    if (Object.keys(TARGET).every((k) => next[k] === TARGET[k])) markComplete();
  };

  const remove = (k: string) => {
    const { [k]: _, ...rest } = dict;
    setDict(rest);
  };

  const done = (k: string) => dict[k] === TARGET[k];

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          Completa il dizionario con nome="Ada", eta="30", citta="Roma"
        </div>

        <div className="mb-4 rounded-lg border border-border bg-background p-3 font-mono text-sm text-foreground">
          <span className="text-muted-foreground">persona = </span>{"{"}
          <div className="ml-4">
            {Object.entries(dict).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <span>
                  <span className="text-fuchsia-300">"{k}"</span>: <span className="text-accent">"{v}"</span>,
                </span>
                <button
                  onClick={() => remove(k)}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  del
                </button>
              </div>
            ))}
            {Object.keys(dict).length === 0 && (
              <span className="text-muted-foreground text-xs">(vuoto — aggiungi le coppie qui sotto)</span>
            )}
          </div>
          {"}"}
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          {Object.keys(TARGET).map((k) => (
            <div
              key={k}
              className={cn(
                "flex items-center gap-2 rounded-md border p-2 text-xs",
                done(k) ? "border-success/40 bg-success/10 text-success" : "border-border bg-surface text-muted-foreground",
              )}
            >
              {done(k) && <CheckCircle2 className="h-3.5 w-3.5" />}
              <span className="font-mono">{k}</span>
              <span>→</span>
              <span className="font-mono">"{TARGET[k]}"</span>
            </div>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <select
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-accent"
          >
            <option value="">chiave…</option>
            {CANDIDATE_KEYS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground focus:border-accent"
          >
            <option value="">valore…</option>
            {CANDIDATE_VALUES.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
          <button
            onClick={add}
            disabled={!key || !value}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-40"
          >
            persona[chiave] = valore
          </button>
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          I dizionari legano una chiave (unica) a un valore. Ideali per descrivere oggetti con più attributi.
        </InfoNote>
      ) : (
        <SuccessNote>
          Fatto! Il dizionario contiene le tre coppie chiave-valore richieste.
        </SuccessNote>
      )}
    </div>
  );
}
