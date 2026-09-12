import { useState } from "react";
import { Plus, X } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";

const INITIAL = ["mela", "pera", "banana"];

export default function Task05Lists({ markComplete, isComplete }: TaskContext) {
  const [items, setItems] = useState<string[]>(INITIAL);
  const [draft, setDraft] = useState("");
  const [ops, setOps] = useState({ appended: 0, removed: 0 });

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    setItems((it) => [...it, v]);
    setOps((o) => ({ ...o, appended: o.appended + 1 }));
    setDraft("");
    checkDone(ops.appended + 1, ops.removed);
  };

  const remove = (i: number) => {
    setItems((it) => it.filter((_, idx) => idx !== i));
    setOps((o) => ({ ...o, removed: o.removed + 1 }));
    checkDone(ops.appended, ops.removed + 1);
  };

  const checkDone = (a: number, r: number) => {
    if (a >= 1 && r >= 1) markComplete();
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          Aggiungi almeno un elemento e rimuovine almeno uno
        </div>

        <div className="mb-4 rounded-lg border border-border bg-background p-3 font-mono text-sm text-foreground">
          <span className="text-muted-foreground">frutta = </span>[
          {items.map((v, i) => (
            <span key={i}>
              <span className="text-accent">"{v}"</span>
              {i < items.length - 1 && ", "}
            </span>
          ))}
          ]
          <div className="mt-2 text-xs text-muted-foreground">len(frutta) = {items.length}</div>
        </div>

        <div className="mb-4 grid gap-2">
          {items.map((v, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border border-border bg-background p-2">
              <span className="font-mono text-sm">
                <span className="text-muted-foreground">frutta[{i}] = </span>
                <span className="text-foreground">"{v}"</span>
              </span>
              <button
                onClick={() => remove(i)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground hover:border-destructive hover:text-destructive"
              >
                <X className="h-3 w-3" /> .remove
              </button>
            </div>
          ))}
          {items.length === 0 && (
            <div className="rounded-md border border-dashed border-border p-3 text-xs text-muted-foreground">
              Lista vuota.
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="nuovo elemento"
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-accent"
          />
          <button
            onClick={add}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:brightness-110"
          >
            <Plus className="h-3.5 w-3.5" /> .append
          </button>
        </div>

        <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
          <span>append eseguiti: <span className="text-accent">{ops.appended}</span></span>
          <span>remove eseguiti: <span className="text-accent">{ops.removed}</span></span>
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          Le liste sono modificabili: append aggiunge in coda, remove toglie il primo elemento uguale al valore.
        </InfoNote>
      ) : (
        <SuccessNote>
          Ottimo. Sai leggere per indice, aggiungere in coda, rimuovere e contare gli elementi di una lista.
        </SuccessNote>
      )}
    </div>
  );
}
