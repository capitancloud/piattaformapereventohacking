import { useEffect, useMemo, useState } from "react";
import { Eye, EyeOff, ShieldAlert, ShieldCheck } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const COMMON = new Set([
  "password", "123456", "qwerty", "iloveyou", "admin", "welcome", "letmein",
  "monkey", "dragon", "estate", "inverno", "primavera", "autunno", "juventus",
  "milan", "roma", "napoli", "ferrari",
]);

type Signal = { text: string; kind: "bad" | "good" };

function analyze(pw: string): { score: number; signals: Signal[] } {
  const signals: Signal[] = [];
  let score = 0;

  if (!pw) return { score: 0, signals: [] };

  // length
  if (pw.length < 8) signals.push({ text: "Meno di 8 caratteri: cade in secondi", kind: "bad" });
  else if (pw.length < 12) signals.push({ text: "Fra 8 e 11 caratteri: cade in ore o giorni", kind: "bad" });
  else if (pw.length < 16) signals.push({ text: "Almeno 12 caratteri: già molto meglio", kind: "good" });
  else signals.push({ text: `${pw.length} caratteri: lunghezza ottima`, kind: "good" });

  score += Math.min(pw.length * 4, 50);

  // charset
  const lower = /[a-z]/.test(pw);
  const upper = /[A-Z]/.test(pw);
  const digit = /[0-9]/.test(pw);
  const sym = /[^a-zA-Z0-9]/.test(pw);
  const variety = [lower, upper, digit, sym].filter(Boolean).length;
  score += variety * 5;
  if (variety >= 3) signals.push({ text: "Buon mix di famiglie di caratteri", kind: "good" });

  // dictionary words
  const lc = pw.toLowerCase();
  for (const w of COMMON) {
    if (lc.includes(w)) {
      signals.push({ text: `Contiene la parola comune «${w}»`, kind: "bad" });
      score -= 20;
      break;
    }
  }

  // year
  if (/(19|20)\d{2}/.test(pw)) {
    signals.push({ text: "Contiene un anno (19xx / 20xx): tra i primi provati", kind: "bad" });
    score -= 10;
  }

  // simple substitutions like "a" -> "@"
  if (/@|0|1|!|\$/.test(pw) && /^[A-Z]?[a-z]+[0-9@!$]+$/.test(pw)) {
    signals.push({ text: "Sostituzioni prevedibili (a→@, o→0, !finale): non aggiungono difesa", kind: "bad" });
    score -= 8;
  }

  // repeated chars / sequences
  if (/(.)\1{2,}/.test(pw)) {
    signals.push({ text: "Caratteri ripetuti (aaa, 111…)", kind: "bad" });
    score -= 8;
  }
  if (/1234|abcd|qwer|asdf/i.test(pw)) {
    signals.push({ text: "Sequenza di tastiera o numerica", kind: "bad" });
    score -= 15;
  }

  // passphrase bonus
  if (pw.length >= 20 && /\s/.test(pw)) {
    signals.push({ text: "Passphrase lunga con spazi: eccellente", kind: "good" });
    score += 25;
  }

  return { score: Math.max(0, Math.min(100, score)), signals };
}

export default function Task02Strength({ markComplete, isComplete }: TaskContext) {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [tried, setTried] = useState<Set<string>>(new Set());

  const { score, signals } = useMemo(() => analyze(pw), [pw]);

  useEffect(() => {
    if (pw && !tried.has(pw)) {
      const next = new Set(tried);
      next.add(pw);
      setTried(next);
    }
  }, [pw]); // eslint-disable-line

  useEffect(() => {
    if (tried.size >= 3 && [...tried].some((p) => analyze(p).score >= 70)) {
      markComplete();
    }
  }, [tried]); // eslint-disable-line

  const color =
    score < 30 ? "bg-destructive" : score < 60 ? "bg-gold" : score < 80 ? "bg-accent" : "bg-success";

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        Digita almeno tre password diverse. La barra ti mostra il livello di forza e i motivi in tempo reale. Per completare, prova almeno una password davvero forte (verde).
      </p>

      <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Prova una password</label>
        <div className="mt-2 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
          <input
            type={show ? "text" : "password"}
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="es. Estate2024!  oppure  gatto viola scarpa tuono"
            className="min-w-0 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          <button
            onClick={() => setShow((s) => !s)}
            className="rounded-md border border-border p-1.5 text-muted-foreground hover:text-foreground"
            aria-label="mostra password"
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-background">
          <div className={cn("h-full transition-all duration-300", color)} style={{ width: `${score}%` }} />
        </div>
        <div className="mt-1 flex items-center justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
          <span>forza</span>
          <span className={cn(score < 30 && "text-destructive", score >= 80 && "text-success")}>{score}/100</span>
        </div>

        <ul className="mt-4 space-y-2">
          {signals.length === 0 && (
            <li className="text-xs text-muted-foreground">Scrivi qualcosa nel campo per iniziare l'analisi.</li>
          )}
          {signals.map((s, i) => (
            <li key={i} className="flex min-w-0 items-start gap-2 text-xs">
              {s.kind === "bad" ? (
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
              ) : (
                <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
              )}
              <span className={cn("min-w-0 break-words leading-relaxed", s.kind === "bad" ? "text-destructive" : "text-success")}>
                {s.text}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-4 rounded-md border border-border bg-background/60 p-3 text-[11px] text-muted-foreground">
          Password provate finora: <span className="text-foreground">{tried.size}</span> · almeno una verde:{" "}
          <span className={cn([...tried].some((p) => analyze(p).score >= 70) ? "text-success" : "text-muted-foreground")}>
            {[...tried].some((p) => analyze(p).score >= 70) ? "sì" : "non ancora"}
          </span>
        </div>
      </div>

      {!isComplete && <InfoNote>Suggerimento: prova tre parole a caso separate da spazi, per esempio «lampada nuvola pesce» e allunga.</InfoNote>}
      {isComplete && (
        <SuccessNote>
          Perfetto. Hai visto con i tuoi occhi come una passphrase lunga batta una password «furba» ma corta.
        </SuccessNote>
      )}
    </div>
  );
}
