import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

// Precomputed table (unsalted MD5)
const TABLE: Record<string, string> = {
  "e10adc3949ba59abbe56e057f20f883e": "123456",
  "5f4dcc3b5aa765d61d8327deb882cf99": "password",
  "5ebe2294ecd0e0f08eab7690d2a6ee69": "secret",
  "d8578edf8458ce06fbc5bb76a58c5ca4": "qwerty",
};

const UNSALTED_HASHES = [
  { user: "mario", hash: "5f4dcc3b5aa765d61d8327deb882cf99" },
  { user: "laura", hash: "e10adc3949ba59abbe56e057f20f883e" },
];

const SALTED_HASHES = [
  { user: "mario", salt: "a71f", hash: "b83f1c8fa1e9a67b3ce7f4a1e2c5d9a2" },
  { user: "laura", salt: "9c2e", hash: "e10adc3949ba59abbe56e057f20f883e_9c2e" },
];

type Scen = { id: string; text: string; kind: "usable" | "useless"; why: string };

const SCENARIOS: Scen[] = [
  { id: "s1", text: "MD5 senza sale di password comuni", kind: "usable", why: "Rainbow table classiche: match immediato." },
  { id: "s2", text: "MD5 con sale casuale di 16 byte per utente", kind: "useless", why: "Ogni utente ha un sale diverso: la tabella non è precomputabile." },
  { id: "s3", text: "Bcrypt con costo 10 (include sale automatico)", kind: "useless", why: "Bcrypt aggiunge sempre un sale unico: rainbow inutile." },
  { id: "s4", text: "SHA1 senza sale di stringhe corte", kind: "usable", why: "SHA1 senza sale è precomputabile come MD5." },
];

export default function Task08RainbowSalt({ markComplete, isComplete }: TaskContext) {
  const [phase, setPhase] = useState<"lookup" | "classify">("lookup");
  const [lookedUp, setLookedUp] = useState<Set<string>>(new Set());
  const [picks, setPicks] = useState<Record<string, Scen["kind"] | undefined>>({});
  const [checked, setChecked] = useState(false);

  const lookup = (id: string, hash: string) => {
    setLookedUp((s) => new Set(s).add(id));
    // just triggers UI update
    void hash;
  };

  const all = SCENARIOS.every((s) => picks[s.id]);
  const score = SCENARIOS.filter((s) => picks[s.id] === s.kind).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={() => setPhase("lookup")}
          className={cn(
            "rounded-md border px-3 py-1.5 text-xs transition",
            phase === "lookup" ? "border-accent bg-accent/15 text-foreground" : "border-border bg-surface text-muted-foreground",
          )}
        >
          1 · prova la rainbow
        </button>
        <button
          onClick={() => setPhase("classify")}
          className={cn(
            "rounded-md border px-3 py-1.5 text-xs transition",
            phase === "classify" ? "border-accent bg-accent/15 text-foreground" : "border-border bg-surface text-muted-foreground",
          )}
        >
          2 · classifica gli scenari
        </button>
      </div>

      {phase === "lookup" && (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Hai un mini-motore rainbow con 4 hash MD5 precalcolati. Prova a cercare gli hash sotto: quelli senza sale li trovi, quelli col sale no.
          </p>

          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            <div className="min-w-0 rounded-xl border border-border bg-surface p-3">
              <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Hash SENZA sale</div>
              {UNSALTED_HASHES.map((h) => {
                const found = lookedUp.has(h.hash) ? TABLE[h.hash] : undefined;
                return (
                  <div key={h.user} className="mb-2 min-w-0 rounded-md border border-border bg-background p-2">
                    <div className="mb-1 text-[11px] text-muted-foreground">{h.user}</div>
                    <code className="block min-w-0 break-all font-mono text-[11px] text-gold">{h.hash}</code>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => lookup(h.hash, h.hash)}>
                        <Search className="h-3.5 w-3.5" /> lookup
                      </Button>
                      {found && <span className="text-xs text-success">→ {found}</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="min-w-0 rounded-xl border border-border bg-surface p-3">
              <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Hash CON sale</div>
              {SALTED_HASHES.map((h) => {
                const looked = lookedUp.has(h.hash);
                return (
                  <div key={h.user} className="mb-2 min-w-0 rounded-md border border-border bg-background p-2">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{h.user}</span>
                      <span>salt: <code className="text-gold">{h.salt}</code></span>
                    </div>
                    <code className="block min-w-0 break-all font-mono text-[11px] text-gold">{h.hash}</code>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => lookup(h.hash, h.hash)}>
                        <Search className="h-3.5 w-3.5" /> lookup
                      </Button>
                      {looked && <span className="text-xs text-destructive">not found</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <InfoNote>
            Nota bene: laura ha la stessa password di mario nel gruppo unsalted, ma con il sale l'hash cambia completamente e la rainbow non lo riconosce.
          </InfoNote>
        </div>
      )}

      {phase === "classify" && (
        <div className="space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Per ognuno di questi scenari, dì se una rainbow table è ancora utile («usabile») oppure è resa inutile dal sale.
          </p>
          {SCENARIOS.map((s) => {
            const value = picks[s.id];
            const right = checked && value === s.kind;
            const wrong = checked && value && value !== s.kind;
            return (
              <div
                key={s.id}
                className={cn(
                  "min-w-0 rounded-xl border border-border bg-surface p-3 transition",
                  right && "border-success/60",
                  wrong && "border-destructive/60",
                )}
              >
                <p className="min-w-0 break-words text-sm text-foreground">{s.text}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["usable", "useless"] as const).map((k) => (
                    <button
                      key={k}
                      onClick={() => {
                        setChecked(false);
                        setPicks((p) => ({ ...p, [s.id]: k }));
                      }}
                      className={cn(
                        "rounded-md border px-3 py-1.5 text-xs transition",
                        value === k
                          ? "border-accent bg-accent/15 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-accent/50",
                      )}
                    >
                      {k === "usable" ? "Rainbow usabile" : "Rainbow inutile"}
                    </button>
                  ))}
                </div>
                {checked && value && (
                  <p className={cn("mt-2 text-xs leading-relaxed", right ? "text-muted-foreground" : "text-destructive")}>
                    {s.why}
                  </p>
                )}
              </div>
            );
          })}
          <Button
            className="w-full"
            disabled={!all}
            onClick={() => {
              setChecked(true);
              if (score === SCENARIOS.length) markComplete();
            }}
          >
            Verifica le classificazioni
          </Button>
          {checked && score < SCENARIOS.length && (
            <WarnNote>{score}/{SCENARIOS.length}. Ricorda: il sale è il vero killer delle rainbow.</WarnNote>
          )}
        </div>
      )}

      {isComplete && (
        <SuccessNote>
          Perfetto. Da oggi, se qualcuno ti dice «salviamo le password con MD5», sai già cosa rispondere.
        </SuccessNote>
      )}
    </div>
  );
}
