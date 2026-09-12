import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const TOOLS = [
  { id: "nc", label: "nc 10.10.10.12 22", right: true, note: "Netcat apre una connessione grezza e stampa il saluto del servizio." },
  { id: "ssh", label: "ssh root@10.10.10.12", right: false, note: "ssh prova ad autenticarti: non stai enumerando, stai tentando un accesso." },
  { id: "ping", label: "ping 10.10.10.12", right: false, note: "ping dice solo se l'host risponde: niente banner, niente versione." },
];

const QUESTIONS = [
  {
    q: "Il banner dice «SSH-2.0-OpenSSH_7.4». Cosa hai imparato?",
    options: [
      "Che il server accetta la nostra password",
      "Il software esatto e la sua versione",
      "Che la porta 22 è filtrata",
    ],
    answer: 1,
    reason: "Il banner rivela prodotto e versione: con «OpenSSH 7.4» puoi cercare vulnerabilità note di quella release.",
  },
  {
    q: "Qual è il prossimo passo corretto dopo aver letto la versione?",
    options: [
      "Cercare «OpenSSH 7.4 exploit» nei database pubblici",
      "Provare subito password a caso",
      "Cancellare i log del server",
    ],
    answer: 0,
    reason: "L'enumerazione serve a orientare la ricerca: prima si raccolgono versioni, poi si consultano CVE ed exploit-db.",
  },
];

export default function Task03SshBanner({ markComplete, isComplete }: TaskContext) {
  const [tool, setTool] = useState<string | null>(null);
  const [banner, setBanner] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([null, null]);
  const [checked, setChecked] = useState(false);

  const grab = (id: string) => {
    setTool(id);
    if (id === "nc") setBanner(true);
  };

  const score = QUESTIONS.filter((q, i) => answers[i] === q.answer).length;

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        Scegli lo strumento giusto per leggere il saluto del servizio SSH:
      </p>
      <div className="flex flex-wrap gap-2">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => grab(t.id)}
            className={cn(
              "rounded-md border px-3 py-1.5 font-mono text-[11px] transition active:scale-95",
              tool === t.id
                ? t.right
                  ? "border-success bg-success/10 text-success"
                  : "border-destructive bg-destructive/10 text-destructive"
                : "border-border bg-background text-muted-foreground hover:border-accent/50",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tool && (
        <p className={cn("mt-3 text-xs leading-relaxed", tool === "nc" ? "text-muted-foreground" : "text-destructive")}>
          {TOOLS.find((t) => t.id === tool)?.note}
        </p>
      )}

      {banner && (
        <div className="mt-4 min-w-0 overflow-hidden rounded-xl border border-border bg-black p-4 font-mono text-xs shadow-2xl shadow-black/60">
          <p className="break-words text-muted-foreground">$ nc 10.10.10.12 22</p>
          <p className="mt-1 break-words text-gold">SSH-2.0-OpenSSH_7.4</p>
          <p className="mt-1 break-words text-muted-foreground/70">(il server si è presentato prima ancora che chiedessimo nulla)</p>
        </div>
      )}

      {banner && (
        <div className="mt-4 space-y-3">
          {QUESTIONS.map((q, i) => (
            <div key={q.q} className="min-w-0 rounded-lg border border-border bg-surface p-4">
              <p className="mb-3 break-words text-sm text-foreground">{q.q}</p>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[i] === oi;
                  const correct = checked && oi === q.answer;
                  const wrong = checked && selected && oi !== q.answer;
                  return (
                    <button
                      key={opt}
                      onClick={() => {
                        setChecked(false);
                        setAnswers((a) => a.map((v, idx) => (idx === i ? oi : v)));
                      }}
                      className={cn(
                        "min-w-0 rounded-md border px-3 py-1.5 text-left text-xs transition active:scale-95",
                        selected && !checked && "border-accent bg-accent/15 text-foreground",
                        correct && "border-success bg-success/10 text-success",
                        wrong && "border-destructive bg-destructive/10 text-destructive",
                        !selected && !correct && "border-border bg-background text-muted-foreground hover:border-accent/50",
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
              {checked && <p className="mt-3 break-words text-xs leading-relaxed text-muted-foreground">{q.reason}</p>}
            </div>
          ))}
          <Button
            className="w-full"
            disabled={answers.some((a) => a === null)}
            onClick={() => {
              setChecked(true);
              if (score === QUESTIONS.length) markComplete();
            }}
          >
            Verifica le risposte
          </Button>
        </div>
      )}

      {!banner && (
        <InfoNote>
          Il «banner grabbing» è la forma più gentile di enumerazione: ti colleghi e ascolti il
          saluto che il servizio fa da solo.
        </InfoNote>
      )}
      {banner && checked && score < QUESTIONS.length && (
        <WarnNote>
          Attenzione: enumerare non è attaccare. Leggere una versione serve a orientare la ricerca,
          non a saltare dentro.
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Da una sola riga di testo hai ricavato prodotto, versione e pista di ricerca: il banner
          grabbing è piccolo, ma vale oro.
        </SuccessNote>
      )}
    </div>
  );
}
