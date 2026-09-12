import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const STEPS = [
  { id: "s1", label: "echo '/bin/bash' > /tmp/ls", why: "Crei un finto «ls» che apre una bash." },
  { id: "s2", label: "chmod +x /tmp/ls", why: "Rendi il finto ls eseguibile." },
  { id: "s3", label: "export PATH=/tmp:$PATH", why: "Metti /tmp in cima al PATH: sarà cercato per primo." },
  { id: "s4", label: "/usr/local/bin/status  (script SUID che chiama «ls»)", why: "Lo script gira come root e chiama «ls»: trova /tmp/ls e lancia bash come root." },
];
const CORRECT_ORDER = ["s1", "s2", "s3", "s4"];
const NOISE = [
  { id: "n1", label: "rm -rf /", why: "Distrugge il sistema: mai." },
  { id: "n2", label: "sudo su -", why: "Chiede la password di root: se l'avessi, non serviresti la privesc." },
];
const ALL = [...STEPS, ...NOISE];

export default function Task05PathHijack({ markComplete, isComplete }: TaskContext) {
  const [order, setOrder] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const correct =
    order.length === CORRECT_ORDER.length && order.every((id, i) => id === CORRECT_ORDER[i]);

  return (
    <div>
      <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-accent">Situazione</p>
        <p className="break-words text-xs leading-relaxed text-muted-foreground">
          /usr/local/bin/status è SUID di root. Al suo interno chiama semplicemente «ls» (senza path
          assoluto). Il tuo utente può scrivere in /tmp. Componi il piano che ti dà una shell root.
        </p>
      </div>

      <div className="mt-3 grid min-w-0 gap-4 md:grid-cols-2">
        <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-accent">Frammenti</p>
          <div className="flex flex-col gap-2">
            {ALL.map((s) => {
              const used = order.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setChecked(false);
                    setOrder((o) => (o.includes(s.id) ? o.filter((x) => x !== s.id) : [...o, s.id]));
                  }}
                  className={cn(
                    "min-w-0 rounded-md border px-3 py-2 text-left font-mono text-[11px] transition active:scale-95",
                    used
                      ? "border-accent bg-accent/15 text-foreground"
                      : "border-border bg-background text-muted-foreground hover:border-accent/50",
                  )}
                >
                  <span className="break-all">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-accent">Il tuo piano</p>
          <ol className="min-h-[120px] space-y-2">
            {order.length === 0 && (
              <li className="text-xs text-muted-foreground">Tocca i frammenti a sinistra per aggiungerli qui.</li>
            )}
            {order.map((id, i) => {
              const s = ALL.find((x) => x.id === id);
              const shouldBe = CORRECT_ORDER[i];
              const right = checked && id === shouldBe;
              const wrong = checked && id !== shouldBe;
              return (
                <li
                  key={id}
                  className={cn(
                    "min-w-0 rounded-md border px-3 py-2 font-mono text-[11px]",
                    right && "border-success/60 bg-success/10 text-success",
                    wrong && "border-destructive/60 bg-destructive/10 text-destructive",
                    !checked && "border-border bg-background text-foreground",
                  )}
                >
                  <span className="mr-2 text-accent">{i + 1}.</span>
                  <span className="break-all">{s?.label}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <Button
        className="mt-4 w-full"
        disabled={order.length === 0}
        onClick={() => {
          setChecked(true);
          if (correct) markComplete();
        }}
      >
        Esegui il piano
      </Button>

      {!checked && (
        <InfoNote>
          Il trucco: la shell cerca i comandi nel PATH nell'ordine. Se /tmp viene prima di /bin, un
          «ls» in /tmp vince. Aggiungi solo i quattro passi utili, nel giusto ordine.
        </InfoNote>
      )}
      {checked && !correct && (
        <div className="mt-3 space-y-2">
          {order.map((id) => {
            const s = ALL.find((x) => x.id === id)!;
            return (
              <div key={id} className="rounded-md border border-border bg-surface p-2 text-xs">
                <code className="font-mono text-accent">{s.label}</code>
                <span className="ml-2 text-muted-foreground">{s.why}</span>
              </div>
            );
          })}
          <WarnNote>Ripensa all'ordine: crei il fake → lo rendi eseguibile → sposti il PATH → lanci il binario privilegiato.</WarnNote>
        </div>
      )}
      {isComplete && (
        <SuccessNote>
          Un binario SUID che chiama comandi senza path assoluto è una miniera: cambi il PATH e ti
          ritrovi con una shell come root. È la lezione: mai fidarsi del PATH ereditato.
        </SuccessNote>
      )}
    </div>
  );
}
