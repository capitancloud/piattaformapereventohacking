import { useState } from "react";
import { Check, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Script = {
  id: string;
  name: string;
  cat: string;
  what: string;
  safe: boolean;
  why: string;
};

const SCRIPTS: Script[] = [
  {
    id: "banner",
    name: "banner",
    cat: "discovery · safe",
    what: "Legge il messaggio di benvenuto che il servizio invia all'apertura della connessione.",
    safe: true,
    why: "Si limita a leggere ciò che il servizio offre spontaneamente: nessuna modifica, nessun rischio.",
  },
  {
    id: "httptitle",
    name: "http-title",
    cat: "default · safe",
    what: "Recupera il titolo della pagina web servita sulla porta HTTP.",
    safe: true,
    why: "Una normale richiesta web, identica a quella di un browser: adatta a una prima ricognizione.",
  },
  {
    id: "sslcert",
    name: "ssl-cert",
    cat: "default · safe",
    what: "Mostra emittente, date di validità e nomi alternativi del certificato TLS.",
    safe: true,
    why: "Il certificato è pubblico per definizione ed è utile per collegare nuovi nomi al perimetro.",
  },
  {
    id: "smbenum",
    name: "smb-os-discovery",
    cat: "default · safe",
    what: "Chiede al servizio di condivisione file quale sistema e dominio dichiara.",
    safe: true,
    why: "Usa una funzione prevista dal protocollo e non tenta autenticazioni ripetute.",
  },
  {
    id: "brute",
    name: "ssh-brute",
    cat: "brute · intrusive",
    what: "Tenta in sequenza molte coppie di credenziali sul servizio SSH.",
    safe: false,
    why: "Può bloccare account reali e generare centinaia di allarmi: richiede un mandato scritto specifico.",
  },
  {
    id: "dos",
    name: "http-slowloris-check",
    cat: "dos · intrusive",
    what: "Verifica la resistenza del server tenendo aperte molte connessioni incomplete.",
    safe: false,
    why: "Verifica una condizione di negazione del servizio: può rendere il sito irraggiungibile agli utenti.",
  },
  {
    id: "vulnall",
    name: "--script vuln",
    cat: "vuln · misto",
    what: "Esegue in blocco decine di controlli di vulnerabilità, alcuni invasivi.",
    safe: false,
    why: "Nella categoria convivono controlli innocui e test aggressivi: lanciarla alla cieca è imprudente.",
  },
];

export default function Task08Nse({ markComplete, isComplete }: TaskContext) {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  const ok =
    SCRIPTS.filter((s) => s.safe).every((s) => selected.includes(s.id)) &&
    SCRIPTS.filter((s) => !s.safe).every((s) => !selected.includes(s.id));

  const command = selected.length
    ? `nmap -sV --script ${SCRIPTS.filter((s) => selected.includes(s.id)).map((s) => s.name.replace("--script ", "")).join(",")} 10.10.5.20`
    : "nmap -sV 10.10.5.20";

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
          <Puzzle className="h-3.5 w-3.5 text-accent" /> Catalogo NSE · prima ricognizione autorizzata
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {SCRIPTS.map((s) => {
            const on = selected.includes(s.id);
            const wrong = checked && on !== s.safe;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setChecked(false);
                  setOpen(s.id);
                  setSelected((sel) => (sel.includes(s.id) ? sel.filter((x) => x !== s.id) : [...sel, s.id]));
                }}
                className={cn(
                  "min-w-0 rounded-lg border p-3 text-left transition active:scale-[0.99]",
                  on ? "border-accent bg-accent/10" : "border-border bg-background hover:border-accent/40",
                  wrong && "border-destructive/70",
                )}
              >
                <div className="flex min-w-0 items-center justify-between gap-2">
                  <code className="min-w-0 break-all font-mono text-xs text-accent">{s.name}</code>
                  {on && <Check className="h-3.5 w-3.5 shrink-0 text-accent" />}
                </div>
                <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{s.cat}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.what}</p>
                {(checked || open === s.id) && (
                  <p className={cn("mt-2 text-[11px] leading-relaxed", s.safe ? "text-success" : "text-destructive")}>
                    {s.why}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 min-w-0 rounded-lg border border-border bg-black p-3">
          <p className="font-mono text-[12px] break-all text-ivory/90">
            <span className="text-gold-soft">kali@lab:~$ </span>
            {command}
          </p>
        </div>

        <Button
          className="mt-4 w-full"
          onClick={() => {
            setChecked(true);
            if (ok) markComplete();
          }}
        >
          Conferma la selezione
        </Button>
      </div>

      {!checked && (
        <InfoNote>
          Gli script NSE estendono Nmap ben oltre l'elenco delle porte. La categoria scritta
          nell'etichetta è il primo indizio: «safe» osserva, «intrusive» interviene.
        </InfoNote>
      )}
      {checked && !ok && (
        <WarnNote>
          Restano scelte da correggere. In una prima ricognizione si includono solo gli script che
          leggono informazioni già offerte dai servizi, mai quelli che provano credenziali o
          stressano il sistema.
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai composto un set di script proporzionato: raccogli molto contesto in più senza
          trasformare una ricognizione in un test di resistenza non concordato.
        </SuccessNote>
      )}
    </div>
  );
}
