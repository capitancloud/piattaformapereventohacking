import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

interface Control {
  id: string;
  label: string;
  desc: string;
  correct: boolean;
  why: string;
}

const CONTROLS: Control[] = [
  {
    id: "ext",
    label: "Whitelist di estensioni negli upload (.pdf, .docx, .png)",
    correct: true,
    desc: "Rifiuta lato server ogni file non presente nell'elenco consentito.",
    why: "Blocca alla radice il caricamento di .aspx / .ashx / .config.",
  },
  {
    id: "handler",
    label: "Disabilitare l'esecuzione di script nella cartella /uploads",
    correct: true,
    desc: "In web.config della cartella: <handlers accessPolicy=\"Read\"/>.",
    why: "Anche se qualcuno riesce a caricare uno .aspx, IIS lo serve come testo, non lo compila.",
  },
  {
    id: "randomname",
    label: "Rinominare i file caricati con un nome casuale + estensione originale",
    correct: false,
    desc: "Es. 8f3a-shell.aspx.",
    why: "Non serve: l'estensione .aspx resta e viene comunque eseguita da IIS.",
  },
  {
    id: "clientjs",
    label: "Validare il tipo di file solo lato client (JavaScript)",
    correct: false,
    desc: "Filtro nel <input type=\"file\">.",
    why: "Un attaccante ignora il browser: manda la richiesta con curl o Burp e bypassa tutto.",
  },
  {
    id: "egress",
    label: "Filtrare il traffico in uscita dal server (egress filtering)",
    correct: true,
    desc: "Il server web non deve poter aprire connessioni TCP arbitrarie verso Internet.",
    why: "Anche se il payload viene eseguito, la connessione verso il listener dell'attaccante fallisce.",
  },
  {
    id: "apppool",
    label: "Application pool con identità dedicata e minimi privilegi",
    correct: true,
    desc: "Nessun accesso in scrittura alla webroot; nessun accesso al DB con account admin.",
    why: "Limita il danno: la reverse shell parte con un utente che quasi non può fare nulla.",
  },
  {
    id: "amsi",
    label: "AMSI + antivirus attivi con blocco script offuscati",
    correct: true,
    desc: "PowerShell chiama AMSI: script noti/offuscati vengono bloccati prima dell'esecuzione.",
    why: "Non è infallibile ma alza molto il costo per l'attaccante.",
  },
  {
    id: "hidepool",
    label: "Nascondere il banner \"X-Powered-By: ASP.NET\"",
    correct: false,
    desc: "Rimuovere l'header dalla risposta HTTP.",
    why: "Cosmetico. L'attaccante lo capisce comunque in tre richieste; non impedisce l'attacco.",
  },
];

export default function Task09Defense({ markComplete, isComplete }: TaskContext) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);

  const toggle = (id: string) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id);
    else s.add(id);
    setSelected(s);
    setChecked(false);
  };

  const verify = () => {
    setChecked(true);
    const allRightPicked = CONTROLS.filter((c) => c.correct).every((c) => selected.has(c.id));
    const noWrongPicked = CONTROLS.filter((c) => !c.correct).every((c) => !selected.has(c.id));
    if (allRightPicked && noWrongPicked) markComplete();
  };

  return (
    <div>
      <div className="grid gap-2">
        {CONTROLS.map((c) => {
          const isSel = selected.has(c.id);
          const isRight = checked && c.correct && isSel;
          const isWrongPick = checked && !c.correct && isSel;
          const isMissed = checked && c.correct && !isSel;
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 text-left transition",
                isSel
                  ? "border-gold bg-gold/5"
                  : "border-border bg-surface hover:border-gold/40",
                isRight && "border-success bg-success/10",
                isWrongPick && "border-destructive bg-destructive/10",
                isMissed && "border-destructive/50",
              )}
            >
              <div className="mt-0.5">
                {checked ? (
                  c.correct ? (
                    <CheckCircle2 className={cn("h-5 w-5", isSel ? "text-success" : "text-destructive/70")} />
                  ) : (
                    <XCircle className={cn("h-5 w-5", isSel ? "text-destructive" : "text-muted-foreground")} />
                  )
                ) : (
                  <span
                    className={cn(
                      "block h-4 w-4 rounded border",
                      isSel ? "border-gold bg-gold" : "border-border",
                    )}
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="font-serif text-sm text-ivory">{c.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{c.desc}</div>
                {checked && (
                  <div
                    className={cn(
                      "mt-2 text-xs",
                      c.correct ? "text-success" : "text-destructive",
                    )}
                  >
                    {c.why}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={verify}
        className="mt-5 rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
      >
        Verifica selezione
      </button>

      {!isComplete && !checked && (
        <InfoNote>
          Seleziona <strong>tutte e solo</strong> le contromisure realmente efficaci
          contro la catena di attacco che hai appena eseguito.
        </InfoNote>
      )}

      {checked && !isComplete && (
        <WarnNote>
          Alcune scelte non sono corrette. Le difese cosmetiche o solo lato client non
          fermano un attaccante: rileggi la spiegazione sotto ogni voce e riprova.
        </WarnNote>
      )}

      {isComplete && (
        <SuccessNote>
          La difesa efficace agisce su tre livelli:{" "}
          <strong>prevenzione</strong> (whitelist + niente esecuzione in /uploads),{" "}
          <strong>contenimento</strong> (app pool con privilegi minimi, egress
          filtering) e <strong>rilevamento</strong> (AMSI, EDR, log delle connessioni in
          uscita anomale).
        </SuccessNote>
      )}
    </div>
  );
}
