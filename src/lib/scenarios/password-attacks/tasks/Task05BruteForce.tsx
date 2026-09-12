import { useEffect, useMemo, useState } from "react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const ALPHABETS = [
  { size: 10, label: "solo cifre (0–9)" },
  { size: 26, label: "solo lettere minuscole" },
  { size: 52, label: "lettere maiuscole + minuscole" },
  { size: 72, label: "lettere + cifre + simboli comuni" },
  { size: 95, label: "tutti i caratteri stampabili" },
];

// GPU molto potente su hash veloce (es. NTLM): ~100 miliardi/s
const RATE = 100_000_000_000;

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return "praticamente infinito";
  if (seconds < 1) return "meno di un secondo";
  if (seconds < 60) return `${Math.round(seconds)} secondi`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minuti`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} ore`;
  if (seconds < 86400 * 365) return `${Math.round(seconds / 86400)} giorni`;
  const years = seconds / (86400 * 365);
  if (years < 1000) return `${Math.round(years).toLocaleString("it-IT")} anni`;
  if (years < 1_000_000) return `${Math.round(years / 1000).toLocaleString("it-IT")} millenni`;
  if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(1)} milioni di anni`;
  return `più dell'età dell'universo`;
}

export default function Task05BruteForce({ markComplete, isComplete }: TaskContext) {
  const [length, setLength] = useState(8);
  const [aIdx, setAIdx] = useState(1);
  const [explored, setExplored] = useState<Set<string>>(new Set());

  const alpha = ALPHABETS[aIdx]!;

  const { combos, seconds } = useMemo(() => {
    const c = Math.pow(alpha.size, length);
    return { combos: c, seconds: c / RATE };
  }, [length, alpha.size]);

  useEffect(() => {
    setExplored((s) => {
      const key = `${aIdx}-${length}`;
      if (s.has(key)) return s;
      const next = new Set(s);
      next.add(key);
      return next;
    });
  }, [aIdx, length]);

  useEffect(() => {
    // must try at least 4 configurations AND one that would take > 100 years
    if (explored.size >= 4) {
      const anyStrong = [...explored].some((k) => {
        const [ai, l] = k.split("-").map(Number);
        const c = Math.pow(ALPHABETS[ai!]!.size, l!);
        return c / RATE > 100 * 365 * 86400;
      });
      if (anyStrong) markComplete();
    }
  }, [explored]); // eslint-disable-line

  const bar = Math.max(3, Math.min(100, (Math.log10(Math.max(1, seconds)) + 2) * 12));
  const color =
    seconds < 3600 ? "bg-destructive" : seconds < 86400 * 365 ? "bg-gold" : seconds < 86400 * 365 * 1000 ? "bg-accent" : "bg-success";

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        Prova diverse combinazioni di lunghezza e alfabeto. Osserva come cambia il tempo stimato di brute force su un hash veloce (100 miliardi di tentativi al secondo). Per completare, esplora almeno quattro configurazioni, una delle quali «impossibile».
      </p>

      <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Lunghezza password</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range"
              min={4}
              max={20}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="min-w-0 w-full accent-accent"
            />
            <span className="w-10 shrink-0 text-right font-mono text-sm text-gold">{length}</span>
          </div>

          <label className="mt-4 block text-xs uppercase tracking-widest text-muted-foreground">Alfabeto</label>
          <div className="mt-2 space-y-1.5">
            {ALPHABETS.map((a, idx) => (
              <button
                key={a.size}
                onClick={() => setAIdx(idx)}
                className={cn(
                  "flex w-full min-w-0 items-center justify-between rounded-md border px-3 py-1.5 text-left text-xs transition",
                  aIdx === idx
                    ? "border-accent bg-accent/15 text-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-accent/50",
                )}
              >
                <span className="min-w-0 break-words">{a.label}</span>
                <span className="ml-2 shrink-0 font-mono text-gold">{a.size}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="min-w-0 space-y-3">
          <div className="rounded-xl border border-border bg-surface p-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Combinazioni</div>
            <div className="mt-1 min-w-0 break-all font-mono text-sm text-foreground">
              {alpha.size}^{length} ≈ {combos.toExponential(2)}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Tempo stimato</div>
            <div className="mt-1 min-w-0 break-words font-mono text-lg text-gold">{formatTime(seconds)}</div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background">
              <div className={cn("h-full transition-all duration-300", color)} style={{ width: `${bar}%` }} />
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface p-3 text-[11px] text-muted-foreground">
            Configurazioni provate: <span className="text-foreground">{explored.size}</span> / 4
          </div>
        </aside>
      </div>

      {!isComplete && (
        <InfoNote>
          Prova prima 6 cifre. Poi 8 lettere. Poi 16 con tutti i caratteri. Vedi l'esplosione della lunghezza.
        </InfoNote>
      )}
      {isComplete && (
        <SuccessNote>
          Perfetto. La regola d'oro: ogni carattere in più moltiplica il tempo, non lo somma. La lunghezza vince.
        </SuccessNote>
      )}
    </div>
  );
}
