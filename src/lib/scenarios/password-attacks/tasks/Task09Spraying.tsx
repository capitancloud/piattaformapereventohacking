import { useState } from "react";
import { ArrowRight, KeyRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Kind = "stuffing" | "spraying";

const SCENARIOS: { id: string; text: string; kind: Kind; why: string }[] = [
  {
    id: "s1",
    text: "10 milioni di coppie email:password del breach di LinkedIn 2012 vengono provate contro Amazon.",
    kind: "stuffing",
    why: "Nessuna nuova password: riuso di coppie già trapelate = credential stuffing.",
  },
  {
    id: "s2",
    text: "Contro 5.000 account @azienda.it viene provata una sola password: Autunno2024!",
    kind: "spraying",
    why: "Una password, tanti account: password spraying (evita i blocchi per tentativi ripetuti).",
  },
  {
    id: "s3",
    text: "L'attaccante scarica un combo list e la lancia contro Netflix, Spotify e Disney+.",
    kind: "stuffing",
    why: "Combo list = coppie utente:password riusate su nuovi servizi.",
  },
  {
    id: "s4",
    text: "Un giorno prova Company@2024 su tutta l'azienda, il giorno dopo Company@2025, il seguente Estate2025!",
    kind: "spraying",
    why: "Una password comune per volta contro tutti gli account: spraying nel tempo (low-and-slow).",
  },
  {
    id: "s5",
    text: "Un tool prova migliaia di password contro un solo account admin@azienda.it.",
    kind: "stuffing",
    why: "Trabocchetto: NON è né spraying né stuffing puro, è brute force online classico (ma il blocco lo ferma subito).",
  },
  {
    id: "s6",
    text: "L'attaccante scarica 3 miliardi di email trapelate e le riusa contro Instagram.",
    kind: "stuffing",
    why: "Riuso di credenziali già ottenute = stuffing.",
  },
];

// s5 is intentional trick: allow either answer as "wrong-but-explained"; we'll accept both.
const ACCEPTED: Record<string, Kind[]> = {
  s1: ["stuffing"],
  s2: ["spraying"],
  s3: ["stuffing"],
  s4: ["spraying"],
  s5: ["stuffing", "spraying"], // trick: both wrong; we count either as "seen"
  s6: ["stuffing"],
};

export default function Task09Spraying({ markComplete, isComplete }: TaskContext) {
  const [picks, setPicks] = useState<Record<string, Kind | undefined>>({});
  const [checked, setChecked] = useState(false);

  const all = SCENARIOS.every((s) => picks[s.id]);
  const score = SCENARIOS.filter((s) => {
    const v = picks[s.id];
    return v && (ACCEPTED[s.id] ?? []).includes(v);
  }).length;

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        Osserva le due animazioni sotto e poi classifica i sei scenari. Attenzione: uno di essi è una trappola.
      </p>

      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
            <KeyRound className="h-3.5 w-3.5" /> credential stuffing
          </div>
          <div className="min-w-0 rounded-md border border-border bg-black p-3 font-mono text-[11px]">
            <div className="mb-2 text-ivory/70">breach_2015.txt (3 miliardi righe)</div>
            <div className="space-y-0.5">
              <div className="text-gold">mario@x.com:iloveyou <ArrowRight className="inline h-3 w-3" /> netflix.com ✓</div>
              <div className="text-destructive/80">laura@y.com:pass1 → netflix.com ✗</div>
              <div className="text-gold">luca@z.com:qwerty <ArrowRight className="inline h-3 w-3" /> netflix.com ✓</div>
              <div className="text-destructive/80">anna@k.com:hello → netflix.com ✗</div>
              <div className="mt-2 text-muted-foreground">≈ 1% delle coppie riusa la password → migliaia di account presi</div>
            </div>
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-accent">
            <Users className="h-3.5 w-3.5" /> password spraying
          </div>
          <div className="min-w-0 rounded-md border border-border bg-black p-3 font-mono text-[11px]">
            <div className="mb-2 text-ivory/70">password: <span className="text-gold">Autunno2024!</span></div>
            <div className="space-y-0.5">
              <div className="text-destructive/80">mario@azienda.it → 1 tentativo ✗</div>
              <div className="text-destructive/80">laura@azienda.it → 1 tentativo ✗</div>
              <div className="text-gold">giulio@azienda.it → 1 tentativo ✓ MATCH</div>
              <div className="text-destructive/80">carla@azienda.it → 1 tentativo ✗</div>
              <div className="mt-2 text-muted-foreground">1 tentativo per account = i blocchi non scattano</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {SCENARIOS.map((s) => {
          const value = picks[s.id];
          const right = checked && value && ACCEPTED[s.id]!.includes(value);
          const wrong = checked && value && !ACCEPTED[s.id]!.includes(value);
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
                {(["stuffing", "spraying"] as const).map((k) => (
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
                    {k === "stuffing" ? "Credential stuffing" : "Password spraying"}
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
      </div>

      <Button
        className="mt-4 w-full"
        disabled={!all}
        onClick={() => {
          setChecked(true);
          if (score >= 5) markComplete();
        }}
      >
        Verifica
      </Button>

      {!checked && (
        <InfoNote>
          Regola: tante coppie riusate → stuffing. Una sola password su tanti account → spraying.
        </InfoNote>
      )}
      {checked && score < 5 && (
        <WarnNote>Devi indovinare almeno 5 su 6. Ricorda la trappola: brute force classico non è nessuno dei due.</WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Perfetto. Difesa vera: password diverse per ogni servizio, MFA ovunque, blocco proattivo sulle password comuni della stagione.
        </SuccessNote>
      )}
    </div>
  );
}
