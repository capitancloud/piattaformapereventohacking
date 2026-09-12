import { useState } from "react";
import { Terminal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Piece = { id: string; token: string; slot: number; explain: string };

const PIECES: Piece[] = [
  { id: "bin", token: "nmap", slot: 0, explain: "Il programma: da solo non fa nulla finché non riceve un bersaglio." },
  { id: "scan", token: "-sS", slot: 1, explain: "Tipo di scansione: SYN scan, non completa la connessione." },
  { id: "timing", token: "-T2", slot: 2, explain: "Timing prudente: pacchetti distanziati, meno disturbo." },
  { id: "ports", token: "-p 22,80,443", slot: 3, explain: "Porte scelte: un elenco breve invece di tutte e 65.535." },
  { id: "out", token: "-oN scan.txt", slot: 4, explain: "Salva l'output leggibile su file: serve per il rapporto." },
  { id: "target", token: "10.10.5.20", slot: 5, explain: "Il bersaglio autorizzato: sempre l'ultimo argomento." },
];

const DISTRACTORS = ["-p-", "-T5", "--script brute"];

export default function Task02Command({ markComplete, isComplete }: TaskContext) {
  const [built, setBuilt] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const pool = [...PIECES.map((p) => p.token), ...DISTRACTORS];
  const expected = PIECES.map((p) => p.token);
  const correct = built.length === expected.length && built.every((t, i) => t === expected[i]);

  return (
    <div>
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-black shadow-2xl shadow-black/60">
        <div className="flex items-center gap-2 border-b border-border/60 bg-surface-2 px-3 py-2">
          <Terminal className="h-3.5 w-3.5 text-accent" />
          <span className="font-mono text-[11px] text-muted-foreground">costruttore di comandi</span>
        </div>
        <div className="min-w-0 p-4">
          <div className="flex min-w-0 flex-wrap items-center gap-2 font-mono text-[13px]">
            <span className="text-gold-soft">kali@lab:~$</span>
            {built.length === 0 ? (
              <span className="text-muted-foreground/60">scegli i pezzi qui sotto…</span>
            ) : (
              built.map((t, i) => (
                <button
                  key={`${t}-${i}`}
                  onClick={() => {
                    setChecked(false);
                    setBuilt((b) => b.filter((_, k) => k !== i));
                  }}
                  className={cn(
                    "animate-in fade-in zoom-in-95 rounded border px-2 py-0.5 break-all transition",
                    checked && t === expected[i]
                      ? "border-success/50 bg-success/10 text-success"
                      : checked
                        ? "border-destructive/50 bg-destructive/10 text-destructive"
                        : "border-accent/40 bg-accent/10 text-ivory",
                  )}
                >
                  {t}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {pool.map((t) => (
          <Button
            key={t}
            size="sm"
            variant="outline"
            disabled={built.includes(t)}
            onClick={() => {
              setChecked(false);
              setBuilt((b) => [...b, t]);
            }}
            className="font-mono text-xs"
          >
            {t}
          </Button>
        ))}
        {built.length > 0 && (
          <Button size="sm" variant="ghost" onClick={() => { setBuilt([]); setChecked(false); }}>
            <Trash2 /> Svuota
          </Button>
        )}
      </div>

      <Button
        className="mt-4 w-full"
        disabled={built.length === 0}
        onClick={() => {
          setChecked(true);
          if (correct) markComplete();
        }}
      >
        Controlla il comando
      </Button>

      {checked && correct && (
        <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface p-4">
          {PIECES.map((p) => (
            <div key={p.id} className="grid gap-1 border-b border-border/60 pb-2 last:border-0 last:pb-0 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-3">
              <code className="font-mono text-xs text-accent break-all">{p.token}</code>
              <span className="text-xs leading-relaxed text-muted-foreground">{p.explain}</span>
            </div>
          ))}
        </div>
      )}

      {!checked && (
        <InfoNote>
          L'ordine conta per la leggibilità: prima il programma, poi le opzioni e per ultimo il
          bersaglio. Tre pezzi nella scorta non servono a una prima scansione prudente.
        </InfoNote>
      )}
      {checked && !correct && (
        <WarnNote>
          Il comando non corrisponde ancora. Evita le opzioni che scansionano tutte le porte, che
          corrono al massimo o che tentano credenziali, e chiudi con l'indirizzo autorizzato.
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai composto un comando completo e difendibile: sai spiegare perché c'è ogni singola
          opzione, cosa che in un rapporto vale quanto il risultato.
        </SuccessNote>
      )}
    </div>
  );
}
