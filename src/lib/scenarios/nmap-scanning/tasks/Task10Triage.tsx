import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Prio = "alta" | "media" | "bassa";

const FINDINGS: { id: string; host: string; line: string; answer: Prio; why: string }[] = [
  {
    id: "rdp",
    host: "10.10.5.31",
    line: "3389/tcp open  ms-wbt-server  Microsoft Terminal Services",
    answer: "alta",
    why: "Un accesso remoto grafico raggiungibile è una porta d'ingresso classica: va verificato per primo con il cliente.",
  },
  {
    id: "mysql",
    host: "10.10.5.20",
    line: "3306/tcp open  mysql  MySQL 5.7.33 (in ascolto su tutte le interfacce)",
    answer: "alta",
    why: "Un database esposto oltre l'host locale, per giunta con versione datata, merita attenzione immediata.",
  },
  {
    id: "http",
    host: "10.10.5.20",
    line: "80/tcp  open  http  nginx 1.18.0 (redirect verso https)",
    answer: "bassa",
    why: "Un sito pubblico che rimanda alla versione cifrata è il comportamento atteso: si annota, non si allarma.",
  },
  {
    id: "ftp",
    host: "10.10.5.40",
    line: "21/tcp  open  ftp  vsftpd 2.3.4 (banner, login anonimo non testato)",
    answer: "media",
    why: "Il banner suggerisce una versione molto vecchia, ma è solo un banner: serve una verifica concordata prima di dichiararlo vulnerabile.",
  },
];

const STEPS: { id: string; text: string; ok: boolean; why: string }[] = [
  {
    id: "exploit",
    text: "Provo subito un exploit pubblico contro il server FTP per confermare la versione.",
    ok: false,
    why: "Lo sfruttamento non rientra in una fase di scansione e può danneggiare il servizio: serve un mandato distinto.",
  },
  {
    id: "confirm",
    text: "Condivido l'elenco con il referente, chiedo conferma che gli host siano in perimetro e propongo verifiche mirate sui due casi ad alta priorità.",
    ok: true,
    why: "Chiudi la fase con evidenze, priorità motivate e una proposta concordata: è esattamente ciò che ci si aspetta.",
  },
  {
    id: "all",
    text: "Rilancio la scansione completa su tutta la rete aziendale per non farmi sfuggire nulla.",
    ok: false,
    why: "Allargheresti il perimetro di tua iniziativa: raccogliere di più non giustifica uscire dall'autorizzazione.",
  },
];

export default function Task10Triage({ markComplete, isComplete }: TaskContext) {
  const [prio, setPrio] = useState<Record<string, Prio>>({});
  const [step, setStep] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const allPrio = Object.keys(prio).length === FINDINGS.length;
  const prioOk = FINDINGS.every((f) => prio[f.id] === f.answer);
  const stepOk = step === "confirm";

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <ClipboardList className="h-3.5 w-3.5 text-accent" /> Risultati della scansione autorizzata
        </div>

        <div className="space-y-3">
          {FINDINGS.map((f) => {
            const v = prio[f.id];
            const right = checked && v === f.answer;
            return (
              <div
                key={f.id}
                className={cn(
                  "min-w-0 rounded-lg border border-border bg-background p-4",
                  right && "border-success/60",
                  checked && v && !right && "border-destructive/60",
                )}
              >
                <p className="font-mono text-[11px] text-accent">{f.host}</p>
                <p className="mt-1 min-w-0 break-words font-mono text-xs text-ivory/90">{f.line}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["alta", "media", "bassa"] as Prio[]).map((p) => (
                    <Button
                      key={p}
                      size="sm"
                      variant={v === p ? "default" : "outline"}
                      onClick={() => {
                        setChecked(false);
                        setPrio((s) => ({ ...s, [f.id]: p }));
                      }}
                    >
                      Priorità {p}
                    </Button>
                  ))}
                </div>
                {checked && v && (
                  <p className={cn("mt-3 text-xs leading-relaxed", right ? "text-muted-foreground" : "text-destructive")}>
                    {f.why}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {allPrio && (
        <div className="mt-4 rounded-xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold text-foreground">Prossimo passo da proporre</p>
          <div className="mt-3 grid gap-2">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setChecked(false);
                  setStep(s.id);
                }}
                className={cn(
                  "rounded-lg border p-3 text-left text-sm leading-relaxed transition",
                  step === s.id ? "border-accent bg-accent/10 text-foreground" : "border-border bg-background text-muted-foreground hover:border-accent/40",
                )}
              >
                {s.text}
                {checked && step === s.id && (
                  <span className={cn("mt-2 block text-xs", s.ok ? "text-success" : "text-destructive")}>{s.why}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <Button
        className="mt-4 w-full"
        disabled={!allPrio || !step}
        onClick={() => {
          setChecked(true);
          if (prioOk && stepOk) markComplete();
        }}
      >
        Consegna il triage
      </Button>

      {!allPrio && (
        <InfoNote>
          Assegna una priorità a ogni riga guardando due cose: quanto quel servizio è appetibile per
          un attaccante e quanto è solida l'evidenza che hai raccolto.
        </InfoNote>
      )}
      {checked && (!prioOk || !stepOk) && (
        <WarnNote>
          Il triage non convince ancora. Metti in cima ciò che offre un accesso diretto, ridimensiona
          ciò che è normale e ricorda che la fase di scansione si chiude con una proposta, non con un
          attacco.
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai chiuso la scansione come si deve: risultati ordinati per rischio reale, evidenze citate
          e un passo successivo che resta dentro l'autorizzazione ricevuta.
        </SuccessNote>
      )}
    </div>
  );
}
