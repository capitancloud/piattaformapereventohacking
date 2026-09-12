import { useState } from "react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const PROBLEMS = [
  {
    id: "p1",
    title: "Apache 2.4.49 con path traversal (CVE-2021-41773)",
    options: [
      { id: "a", text: "Aggiornare Apache alla versione 2.4.51 o superiore", ok: true, why: "La patch chiude la falla alla radice." },
      { id: "b", text: "Cambiare la password dell'amministratore", ok: false, why: "La falla non dipende dalle credenziali." },
      { id: "c", text: "Nascondere il banner del server", ok: false, why: "Nasconde il sintomo, non risolve il problema." },
    ],
  },
  {
    id: "p2",
    title: "Pannello phpMyAdmin esposto a internet senza autenticazione",
    options: [
      { id: "a", text: "Limitare l'accesso al pannello alla sola VPN aziendale", ok: true, why: "Riduce drasticamente la superficie esposta." },
      { id: "b", text: "Aggiungere una CAPTCHA nella home del sito", ok: false, why: "Non protegge il pannello vero." },
      { id: "c", text: "Chiedere agli utenti di non condividere il link", ok: false, why: "La sicurezza non può basarsi sull'onestà." },
    ],
  },
  {
    id: "p3",
    title: "TLS 1.0 ancora abilitato sul server di posta",
    options: [
      { id: "a", text: "Disabilitare TLS 1.0 e 1.1, lasciare solo TLS 1.2 e 1.3", ok: true, why: "Elimina i protocolli deprecati e le famiglie di attacchi legate." },
      { id: "b", text: "Installare un antivirus sul server", ok: false, why: "Non c'entra con la configurazione TLS." },
      { id: "c", text: "Cambiare il certificato ogni mese", ok: false, why: "Il problema è il protocollo, non il certificato." },
    ],
  },
];

export default function Task08Remediation({ markComplete, isComplete }: TaskContext) {
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const score = PROBLEMS.filter((p) => p.options.find((o) => o.id === choices[p.id])?.ok).length;
  const all = PROBLEMS.every((p) => choices[p.id] !== undefined);

  const check = () => {
    setChecked(true);
    if (score === PROBLEMS.length) markComplete();
  };

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">
        Per ogni problema scegli la remediation davvero efficace. Attenzione: alcune risposte sembrano ragionevoli ma non risolvono nulla.
      </p>
      <div className="space-y-4">
        {PROBLEMS.map((p) => {
          const sel = choices[p.id];
          const selOpt = p.options.find((o) => o.id === sel);
          const good = checked && selOpt?.ok;
          const bad = checked && selOpt && !selOpt.ok;
          return (
            <div key={p.id} className={cn("min-w-0 rounded-xl border p-4", good && "border-success bg-success/10", bad && "border-destructive bg-destructive/10", !good && !bad && "border-border bg-surface")}>
              <div className="mb-3 break-words text-sm font-medium text-foreground">{p.title}</div>
              <div className="space-y-2">
                {p.options.map((o) => {
                  const chosen = sel === o.id;
                  const showOk = checked && o.ok;
                  const showKo = checked && chosen && !o.ok;
                  return (
                    <button
                      key={o.id}
                      onClick={() => setChoices((c) => ({ ...c, [p.id]: o.id }))}
                      className={cn(
                        "w-full min-w-0 rounded-md border p-3 text-left text-xs transition",
                        chosen && !checked && "border-accent bg-accent/15 text-foreground",
                        showOk && "border-success bg-success/15 text-foreground",
                        showKo && "border-destructive bg-destructive/15 text-foreground",
                        !chosen && !showOk && !showKo && "border-border bg-background text-muted-foreground hover:border-accent/50",
                      )}
                    >
                      <div className="break-words">{o.text}</div>
                      {checked && (chosen || o.ok) && (
                        <div className="mt-1 break-words text-[11px] opacity-80">{o.why}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {!checked && (
        <button onClick={check} disabled={!all} className="mt-4 rounded-md border border-accent bg-accent/15 px-4 py-2 text-sm text-foreground transition hover:bg-accent/25 disabled:opacity-40">
          Verifica le remediation
        </button>
      )}
      {checked && score < PROBLEMS.length && (
        <WarnNote>
          {score}/{PROBLEMS.length} giuste. La regola è: agire sulla causa, non sul sintomo.
          <button onClick={() => setChecked(false)} className="ml-2 underline">Riprova</button>
        </WarnNote>
      )}
      {!checked && <InfoNote>Le buone remediation ricadono in tre famiglie: patch, riconfigurazione, riduzione dell'esposizione.</InfoNote>}
      {isComplete && (
        <SuccessNote>
          Perfetto: patch per il codice vulnerabile, riconfigurazione per le impostazioni deboli, restrizione di
          rete per ciò che non dovrebbe essere pubblico. Tre gesti che risolvono l'80% del lavoro.
        </SuccessNote>
      )}
    </div>
  );
}
