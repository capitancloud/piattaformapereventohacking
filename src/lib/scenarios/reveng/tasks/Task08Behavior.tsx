import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

interface Item {
  id: string;
  text: string;
  correct: boolean;
}

const ITEMS: Item[] = [
  { id: "a", text: "Crea persistenza scrivendo nella chiave Run di HKCU", correct: true },
  { id: "b", text: "Cifra i file dell'utente chiedendo un riscatto", correct: false },
  { id: "c", text: "Scarica un secondo stage da un IP esterno via HTTP", correct: true },
  { id: "d", text: "Esegue il secondo stage direttamente da %TEMP%", correct: true },
  { id: "e", text: "Disabilita Windows Defender modificando le policy", correct: false },
  { id: "f", text: "Nasconde la finestra di PowerShell durante l'esecuzione", correct: true },
  { id: "g", text: "Installa un driver kernel per rimanere invisibile", correct: false },
];

export default function Task08Behavior({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);

  const toggle = (id: string) => {
    if (checked) return;
    const next = new Set(picked);
    next.has(id) ? next.delete(id) : next.add(id);
    setPicked(next);
  };

  const submit = () => {
    setChecked(true);
    const correctIds = ITEMS.filter((i) => i.correct).map((i) => i.id);
    const wrongIds = ITEMS.filter((i) => !i.correct).map((i) => i.id);
    const allRight = correctIds.every((c) => picked.has(c));
    const noWrong = wrongIds.every((w) => !picked.has(w));
    if (allRight && noWrong) markComplete();
  };

  const reset = () => {
    setChecked(false);
    setPicked(new Set());
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 text-sm text-ivory">
          Seleziona <strong>tutti e soli</strong> i comportamenti effettivi di{" "}
          <code>update.ps1</code>.
        </div>
        <div className="grid gap-2">
          {ITEMS.map((i) => {
            const on = picked.has(i.id);
            const state = !checked
              ? on
                ? "sel"
                : "idle"
              : i.correct
                ? on
                  ? "ok"
                  : "miss"
                : on
                  ? "ko"
                  : "idle";
            return (
              <button
                key={i.id}
                onClick={() => toggle(i.id)}
                className={cn(
                  "flex items-start gap-3 rounded-md border border-border bg-background px-3 py-2.5 text-left text-sm text-ivory/90 transition hover:border-gold/60",
                  state === "sel" && "border-gold/60 bg-gold/5",
                  state === "ok" && "border-success/60 bg-success/10",
                  state === "miss" && "border-success/40 bg-success/5",
                  state === "ko" && "border-destructive/60 bg-destructive/10",
                )}
              >
                <span className="mt-0.5">
                  {state === "ok" || state === "sel" ? (
                    <CheckCircle2
                      className={cn(
                        "h-4 w-4",
                        state === "ok" ? "text-success" : "text-gold",
                      )}
                    />
                  ) : state === "ko" ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <span className="inline-block h-4 w-4 rounded border border-muted-foreground/50" />
                  )}
                </span>
                <span>{i.text}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex gap-2">
          {!checked ? (
            <button
              onClick={submit}
              className="rounded-md bg-gold px-4 py-2 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
            >
              Verifica
            </button>
          ) : (
            <button
              onClick={reset}
              className="rounded-md border border-border bg-background px-4 py-2 text-xs text-ivory hover:border-gold/60"
            >
              Riprova
            </button>
          )}
        </div>
      </div>

      {checked && !isComplete && (
        <WarnNote>
          Non tutte le selezioni combaciano. Torna al task 3 e rileggi il payload
          decodificato: fa esattamente le cose scritte lì dentro, niente di più.
        </WarnNote>
      )}

      {!checked && (
        <InfoNote>
          Il reverse engineering serve a capire, non a indovinare. Attieniti a ciò che
          il codice fa realmente: ogni comportamento non presente nel payload è una
          supposizione da scartare.
        </InfoNote>
      )}

      {isComplete && (
        <SuccessNote>
          Perfetto. Hai un modello mentale corretto del malware. Ora nel prossimo task
          scriviamo lo script che <strong>annulla</strong> ciò che ha fatto.
        </SuccessNote>
      )}
    </div>
  );
}
