import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Algo = "MD5" | "SHA1" | "SHA256" | "NTLM" | "bcrypt" | "argon2";

const HASHES: { id: string; hash: string; algo: Algo; why: string }[] = [
  { id: "h1", hash: "5f4dcc3b5aa765d61d8327deb882cf99", algo: "MD5", why: "32 caratteri esadecimali senza prefisso: MD5 (password → 5f4d…)." },
  { id: "h2", hash: "b1b3773a05c0ed0176787a4f1574ff0075f7521e", algo: "SHA1", why: "40 caratteri esadecimali senza prefisso: SHA1." },
  { id: "h3", hash: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8", algo: "SHA256", why: "64 caratteri esadecimali senza prefisso: SHA256." },
  { id: "h4", hash: "8846f7eaee8fb117ad06bdd830b7586c", algo: "NTLM", why: "32 caratteri esadecimali estratti da SAM/hashdump: NTLM (indistinguibile da MD5 senza contesto)." },
  { id: "h5", hash: "$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", algo: "bcrypt", why: "Prefisso $2y$: bcrypt, con costo 10." },
  { id: "h6", hash: "$argon2id$v=19$m=65536,t=3,p=4$c2FsdHNhbHRzYWx0$rQ...", algo: "argon2", why: "Prefisso $argon2id: argon2." },
];

const OPTIONS: Algo[] = ["MD5", "SHA1", "SHA256", "NTLM", "bcrypt", "argon2"];

export default function Task03Hashes({ markComplete, isComplete }: TaskContext) {
  const [picks, setPicks] = useState<Record<string, Algo | undefined>>({});
  const [checked, setChecked] = useState(false);

  const all = HASHES.every((h) => picks[h.id]);
  const score = HASHES.filter((h) => picks[h.id] === h.algo).length;

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        Ogni riga è un hash reale. Non devi craccarlo: devi solo riconoscere l'algoritmo che lo ha prodotto. Guarda lunghezza e prefisso.
      </p>

      <div className="space-y-3">
        {HASHES.map((h) => {
          const value = picks[h.id];
          const right = checked && value === h.algo;
          const wrong = checked && value && value !== h.algo;
          return (
            <div
              key={h.id}
              className={cn(
                "min-w-0 rounded-xl border border-border bg-surface p-3 transition",
                right && "border-success/60",
                wrong && "border-destructive/60",
              )}
            >
              <div className="min-w-0 overflow-hidden rounded-md border border-border bg-black p-3">
                <code className="block min-w-0 whitespace-pre-wrap break-all font-mono text-[12px] leading-relaxed text-gold">
                  {h.hash}
                </code>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {OPTIONS.map((o) => (
                  <button
                    key={o}
                    onClick={() => {
                      setChecked(false);
                      setPicks((p) => ({ ...p, [h.id]: o }));
                    }}
                    className={cn(
                      "rounded-md border px-2.5 py-1 font-mono text-[11px] transition active:scale-95",
                      value === o
                        ? "border-accent bg-accent/15 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-accent/50",
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {checked && value && (
                <p className={cn("mt-2 text-xs leading-relaxed", right ? "text-muted-foreground" : "text-destructive")}>
                  {h.why}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Button
        className="mt-4 w-full"
        disabled={!all}
        onClick={() => {
          setChecked(true);
          if (score === HASHES.length) markComplete();
        }}
      >
        Verifica gli algoritmi
      </Button>

      {!checked && <InfoNote>Regole rapide: 32 hex = MD5/NTLM · 40 = SHA1 · 64 = SHA256 · $2y$ = bcrypt · $argon2 = argon2.</InfoNote>}
      {checked && score < HASHES.length && (
        <WarnNote>{score}/{HASHES.length}. Rileggi i prefissi e le lunghezze e riprova.</WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Bene. Nei prossimi task useremo il tipo di hash per scegliere lo strumento e la modalità giusta.
        </SuccessNote>
      )}
    </div>
  );
}
