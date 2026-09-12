import { useState } from "react";
import { FileText, RotateCcw } from "lucide-react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Section = "titolo" | "descrizione" | "cvss" | "prova" | "impatto" | "remediation";

const CORRECT: Record<Section, string> = {
  titolo: "b",
  descrizione: "c",
  cvss: "a",
  prova: "d",
  impatto: "e",
  remediation: "f",
};

const CARDS: { id: string; text: string }[] = [
  { id: "a", text: "CVSS 9.8 — Critica (AV:N/AC:L/PR:N/UI:N)" },
  { id: "b", text: "SQL injection sul modulo di login clienti (portale.example.it)" },
  { id: "c", text: "Il parametro «email» del form /login accetta payload SQL: il server esegue la query senza sanificarla." },
  { id: "d", text: "POST /login  email=' OR 1=1 --  →  login effettuato come primo utente in tabella" },
  { id: "e", text: "Un attaccante può leggere l'intera tabella clienti, incluse email e hash password." },
  { id: "f", text: "Usare query parametrizzate (prepared statement) o un ORM; aggiornare la libreria di accesso al DB." },
];

const SLOTS: { id: Section; label: string; hint: string }[] = [
  { id: "titolo", label: "1. Titolo", hint: "Cosa e dove, in una riga" },
  { id: "descrizione", label: "2. Descrizione", hint: "Cosa succede tecnicamente" },
  { id: "cvss", label: "3. Punteggio CVSS", hint: "Termometro della gravità" },
  { id: "prova", label: "4. Prova (PoC)", hint: "Il test che dimostra il problema" },
  { id: "impatto", label: "5. Impatto", hint: "Cosa perde il cliente" },
  { id: "remediation", label: "6. Remediation", hint: "Come si risolve" },
];

export default function Task09Report({ markComplete, isComplete }: TaskContext) {
  const [placed, setPlaced] = useState<Record<Section, string | null>>({
    titolo: null, descrizione: null, cvss: null, prova: null, impatto: null, remediation: null,
  });
  const [checked, setChecked] = useState(false);

  const usedIds = Object.values(placed).filter(Boolean) as string[];
  const remaining = CARDS.filter((c) => !usedIds.includes(c.id));
  const complete = SLOTS.every((s) => placed[s.id] !== null);
  const ok = SLOTS.every((s) => placed[s.id] === CORRECT[s.id]);

  const drop = (section: Section, cardId: string) => {
    if (checked) return;
    setPlaced((p) => ({ ...p, [section]: cardId }));
  };
  const clear = (section: Section) => {
    if (checked) return;
    setPlaced((p) => ({ ...p, [section]: null }));
  };
  const reset = () => {
    setPlaced({ titolo: null, descrizione: null, cvss: null, prova: null, impatto: null, remediation: null });
    setChecked(false);
  };
  const verify = () => {
    setChecked(true);
    if (ok) markComplete();
  };

  const [dragged, setDragged] = useState<string | null>(null);

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        Componi la scheda di una vulnerabilità trascinando (o cliccando) ogni frammento nella sezione giusta.
      </p>

      <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-accent">
            <FileText className="h-4 w-4" /> Scheda vulnerabilità
          </div>
          <div className="space-y-2">
            {SLOTS.map((s) => {
              const cardId = placed[s.id];
              const card = CARDS.find((c) => c.id === cardId);
              const good = checked && cardId === CORRECT[s.id];
              const bad = checked && cardId && cardId !== CORRECT[s.id];
              return (
                <div
                  key={s.id}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => dragged && drop(s.id, dragged)}
                  className={cn(
                    "min-w-0 rounded-md border p-3 transition",
                    good && "border-success bg-success/10",
                    bad && "border-destructive bg-destructive/10",
                    !good && !bad && cardId && "border-accent bg-accent/5",
                    !cardId && "border-dashed border-border bg-background/60",
                  )}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{s.label}</span>
                    <span className="text-[10px] text-muted-foreground">{s.hint}</span>
                  </div>
                  {card ? (
                    <button onClick={() => clear(s.id)} className="w-full break-words text-left text-xs text-foreground">
                      {card.text}
                    </button>
                  ) : (
                    <p className="text-xs text-muted-foreground">Trascina o clicca un frammento a destra…</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <aside className="min-w-0 rounded-xl border border-border bg-background p-4">
          <div className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">Frammenti disponibili</div>
          {remaining.length === 0 && <p className="text-xs text-muted-foreground">Tutti i frammenti sono nella scheda.</p>}
          <div className="space-y-2">
            {remaining.map((c) => (
              <div
                key={c.id}
                draggable
                onDragStart={() => setDragged(c.id)}
                onDragEnd={() => setDragged(null)}
                className="cursor-grab min-w-0 rounded-md border border-border bg-surface p-2 text-xs text-foreground transition hover:border-accent/60 active:cursor-grabbing"
              >
                <div className="break-words">{c.text}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {SLOTS.filter((s) => placed[s.id] === null).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => drop(s.id, c.id)}
                      className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:border-accent/60"
                    >
                      → {s.label.split(". ")[1]}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {complete && !checked && (
          <button onClick={verify} className="rounded-md border border-accent bg-accent/15 px-4 py-2 text-sm text-foreground transition hover:bg-accent/25">
            Verifica la scheda
          </button>
        )}
        {(usedIds.length > 0 || checked) && (
          <button onClick={reset} className="flex items-center gap-1 rounded-md border border-border px-3 py-2 text-xs text-muted-foreground transition hover:border-accent/50">
            <RotateCcw className="h-3.5 w-3.5" /> Ricomincia
          </button>
        )}
      </div>

      {!checked && <InfoNote>Una buona scheda risponde in ordine: cosa, dove, quanto grave, come lo provo, cosa succede se lo ignoro, come lo sistemo.</InfoNote>}
      {checked && !ok && <WarnNote>Qualche pezzo è al posto sbagliato: guarda le sezioni rosse e riprova.</WarnNote>}
      {isComplete && (
        <SuccessNote>
          Perfetto: hai scritto una scheda di vulnerabilità completa. Un report fatto così è utile davvero,
          perché lo sviluppatore capisce il problema e sa cosa fare.
        </SuccessNote>
      )}
    </div>
  );
}
