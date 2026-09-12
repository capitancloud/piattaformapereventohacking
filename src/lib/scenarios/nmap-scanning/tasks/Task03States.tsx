import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type State = "open" | "closed" | "filtered" | "open|filtered";

const STATES: { id: State; label: string; color: string }[] = [
  { id: "open", label: "open", color: "border-success/60 bg-success/10 text-success" },
  { id: "closed", label: "closed", color: "border-border bg-background text-muted-foreground" },
  { id: "filtered", label: "filtered", color: "border-destructive/50 bg-destructive/10 text-destructive" },
  { id: "open|filtered", label: "open|filtered", color: "border-gold/50 bg-gold/10 text-gold" },
];

const CASES: { id: string; port: string; sent: string; reply: string; answer: State; why: string }[] = [
  {
    id: "c1",
    port: "443/tcp",
    sent: "SYN",
    reply: "SYN/ACK",
    answer: "open",
    why: "Il servizio risponde accettando la connessione: qualcosa è davvero in ascolto.",
  },
  {
    id: "c2",
    port: "3306/tcp",
    sent: "SYN",
    reply: "RST",
    answer: "closed",
    why: "L'host è raggiungibile ma rifiuta: nessun servizio su quella porta, e nessun firewall che nasconde.",
  },
  {
    id: "c3",
    port: "22/tcp",
    sent: "SYN",
    reply: "nessuna risposta (3 tentativi)",
    answer: "filtered",
    why: "Il silenzio ripetuto indica che un filtro scarta i pacchetti prima che arrivino al servizio.",
  },
  {
    id: "c4",
    port: "8080/tcp",
    sent: "SYN",
    reply: "ICMP destination unreachable (admin prohibited)",
    answer: "filtered",
    why: "Il firewall dichiara esplicitamente il blocco: la porta è filtrata, non chiusa.",
  },
  {
    id: "c5",
    port: "53/udp",
    sent: "pacchetto UDP",
    reply: "nessuna risposta",
    answer: "open|filtered",
    why: "In UDP il silenzio è ambiguo: il servizio potrebbe essere attivo ma silenzioso, oppure filtrato.",
  },
];

export default function Task03States({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Record<string, State>>({});
  const [checked, setChecked] = useState(false);

  const all = Object.keys(picked).length === CASES.length;
  const score = CASES.filter((c) => picked[c.id] === c.answer).length;

  return (
    <div>
      <div className="space-y-3">
        {CASES.map((c) => {
          const value = picked[c.id];
          const right = checked && value === c.answer;
          const wrong = checked && value && value !== c.answer;
          return (
            <div
              key={c.id}
              className={cn(
                "rounded-xl border border-border bg-surface p-4 transition",
                right && "border-success/60",
                wrong && "border-destructive/60",
              )}
            >
              <div className="flex min-w-0 flex-wrap items-center gap-2 font-mono text-xs">
                <span className="rounded bg-background px-2 py-1 text-accent">{c.port}</span>
                <span className="text-muted-foreground">{c.sent}</span>
                <ArrowRight className="h-3.5 w-3.5 text-accent" />
                <span className="min-w-0 break-words text-ivory/90">{c.reply}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {STATES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setChecked(false);
                      setPicked((p) => ({ ...p, [c.id]: s.id }));
                    }}
                    className={cn(
                      "rounded-md border px-3 py-1.5 font-mono text-[11px] transition active:scale-95",
                      value === s.id ? s.color : "border-border bg-background text-muted-foreground hover:border-accent/50",
                    )}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              {checked && value && (
                <p className={cn("mt-3 text-xs leading-relaxed", right ? "text-muted-foreground" : "text-destructive")}>
                  {c.why}
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
          if (CASES.every((c) => picked[c.id] === c.answer)) markComplete();
        }}
      >
        Verifica gli stati
      </Button>

      {!checked && (
        <InfoNote>
          Nmap non "vede" le porte: deduce uno stato dalla risposta ricevuta. Una risposta chiara
          porta a una conclusione chiara, il silenzio quasi mai.
        </InfoNote>
      )}
      {checked && score < CASES.length && (
        <WarnNote>
          {score} su {CASES.length}. Attenzione alla differenza fra un rifiuto esplicito e un
          pacchetto che sparisce nel nulla: raccontano storie molto diverse.
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Ora sai leggere l'output senza forzarlo: scrivere "filtrata" dove c'è stato solo silenzio
          è una conclusione, non un dato, e nel rapporto va distinta.
        </SuccessNote>
      )}
    </div>
  );
}
