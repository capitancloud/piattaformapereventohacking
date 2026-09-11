import { useState } from "react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";

const VOUCHERS = [
  { id: "a1b2-c3d4-e5f6-0001", value: "€ 10", owner: "tu" },
  { id: "a1b2-c3d4-e5f6-0002", value: "€ 15", owner: "utente #103" },
  { id: "a1b2-c3d4-e5f6-0003", value: "€ 25", owner: "utente #104" },
  { id: "a1b2-c3d4-e5f6-0004", value: "€ 50", owner: "utente #105" },
];

export default function Task07Uuid({ markComplete, isComplete }: TaskContext) {
  const [input, setInput] = useState("a1b2-c3d4-e5f6-0001");
  const [claimed, setClaimed] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const claim = () => {
    const v = VOUCHERS.find((x) => x.id === input.trim());
    if (!v) return setError("Voucher inesistente.");
    if (claimed.includes(v.id)) return setError("Voucher già riscattato.");
    setError(null);
    setClaimed([...claimed, v.id]);
    if (v.owner !== "tu") markComplete();
  };

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/50">
        <div className="border-b border-border bg-surface-2 px-4 py-2 font-mono text-xs text-muted-foreground">
          Cassa promozioni · POST /voucher/claim
        </div>
        <div className="space-y-4 p-5">
          <div>
            <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              Il tuo voucher
            </div>
            <div className="rounded border border-border bg-background p-3 font-mono text-sm text-ivory/90">
              a1b2-c3d4-e5f6-<span className="text-gold">0001</span> — € 10
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
              Codice da riscattare
            </label>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
              />
              <button
                onClick={claim}
                className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
              >
                Riscatta
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          </div>

          {claimed.length > 0 && (
            <div className="rounded border border-border bg-surface-2 p-3">
              <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">
                Riscattati
              </div>
              <ul className="space-y-1 font-mono text-xs text-ivory/90">
                {claimed.map((c) => (
                  <li key={c}>✓ {c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          L'id del tuo voucher termina con <code className="text-gold">0001</code>. Gli id
          successivi (0002, 0003…) esistono e appartengono ad altri utenti. Provane uno.
        </InfoNote>
      ) : (
        <>
          <WarnNote>
            Un "UUID" prevedibile non è più un UUID. Usa generatori crittograficamente sicuri.
          </WarnNote>
          <SuccessNote>Rendere gli id non indovinabili è metà del lavoro.</SuccessNote>
        </>
      )}
    </div>
  );
}
