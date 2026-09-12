import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const NOME = "Ada";
const ETA = 30;

const TEMPLATE = ["Ciao ", null, ", hai ", null, " anni"] as const;
const CHOICES = [
  { id: "nome_var", label: "{nome}", ok: true, slot: 0 },
  { id: "eta_var", label: "{eta}", ok: true, slot: 1 },
  { id: "nome_str", label: 'nome', ok: false, slot: 0 },
  { id: "eta_str", label: 'eta', ok: false, slot: 1 },
];

export default function Task04Strings({ markComplete, isComplete }: TaskContext) {
  const [slot0, setSlot0] = useState<string | null>(null);
  const [slot1, setSlot1] = useState<string | null>(null);
  const [tried, setTried] = useState(false);

  const output = () => {
    const ok0 = slot0 === "nome_var";
    const ok1 = slot1 === "eta_var";
    const p0 = slot0 === "nome_var" ? NOME : slot0 === "nome_str" ? "nome" : "{?}";
    const p1 = slot1 === "eta_var" ? String(ETA) : slot1 === "eta_str" ? "eta" : "{?}";
    return { text: `Ciao ${p0}, hai ${p1} anni`, ok: ok0 && ok1 };
  };

  const check = () => {
    setTried(true);
    if (output().ok) markComplete();
  };

  const reset = () => {
    setSlot0(null);
    setSlot1(null);
    setTried(false);
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Costruisci l'f-string. Le variabili disponibili sono nome = "Ada" e eta = 30.
        </div>

        <div className="mb-4 rounded-lg border border-border bg-background p-3 font-mono text-sm text-foreground">
          <span className="text-fuchsia-300">f</span>"Ciao{" "}
          <Slot value={slot0} onClear={() => setSlot0(null)} />, hai{" "}
          <Slot value={slot1} onClear={() => setSlot1(null)} /> anni"
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {CHOICES.map((c) => {
            const used = (c.slot === 0 && slot0 === c.id) || (c.slot === 1 && slot1 === c.id);
            return (
              <button
                key={c.id}
                onClick={() => {
                  if (c.slot === 0) setSlot0(c.id);
                  else setSlot1(c.id);
                  setTried(false);
                }}
                disabled={used}
                className={cn(
                  "rounded-md border px-3 py-1.5 font-mono text-sm transition",
                  used ? "border-accent/30 bg-accent/5 text-muted-foreground opacity-50"
                       : "border-border bg-background text-foreground hover:border-accent",
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="rounded-lg border border-border bg-black/40 p-3 font-mono text-sm text-emerald-200">
          <div className="mb-1 text-xs uppercase tracking-widest text-accent">Output</div>
          {output().text}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={check}
            disabled={slot0 === null || slot1 === null}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-40"
          >
            Verifica
          </button>
          <button onClick={reset} className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground hover:border-accent">
            <RotateCcw className="h-3.5 w-3.5" /> Ricomincia
          </button>
          {tried && output().ok && (
            <span className="inline-flex items-center gap-1 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" /> Perfetto.
            </span>
          )}
          {tried && !output().ok && (
            <span className="text-sm text-destructive">Ricorda: dentro le graffe va il nome della variabile.</span>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          Senza la f iniziale, {'{nome}'} verrebbe stampato letteralmente. La f dice a Python di valutare le graffe.
        </InfoNote>
      ) : (
        <SuccessNote>
          Ora sai comporre stringhe con f-string: leggibili, veloci, il modo moderno di formattare testo in Python.
        </SuccessNote>
      )}
    </div>
  );
}

function Slot({ value, onClear }: { value: string | null; onClear: () => void }) {
  const label =
    value === "nome_var" ? "{nome}" :
    value === "eta_var" ? "{eta}" :
    value === "nome_str" ? "nome" :
    value === "eta_str" ? "eta" : "___";
  return (
    <button
      onClick={value ? onClear : undefined}
      className={cn(
        "mx-0.5 inline-flex rounded border px-2 py-0.5 align-baseline font-mono text-xs",
        value ? "border-accent/60 bg-accent/10 text-accent hover:border-destructive" : "border-dashed border-border text-muted-foreground",
      )}
    >
      {label}
    </button>
  );
}
