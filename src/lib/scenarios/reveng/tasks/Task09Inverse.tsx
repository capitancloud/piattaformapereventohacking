import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { CodeBlock } from "@/components/lab/Terminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { REVERSE_SCRIPT_EXPECTED } from "../payloads";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

interface Check {
  id: string;
  label: string;
  test: (s: string) => boolean;
}

const CHECKS: Check[] = [
  {
    id: "reg-path",
    label: "Riferisce la chiave HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run",
    test: (s) =>
      /HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run/i.test(s),
  },
  {
    id: "remove-prop",
    label: "Usa Remove-ItemProperty per eliminare il valore",
    test: (s) => /Remove-ItemProperty/i.test(s),
  },
  {
    id: "name",
    label: "Punta al nome 'OneDriveSync'",
    test: (s) => /OneDriveSync/i.test(s),
  },
  {
    id: "temp-clean",
    label: "Rimuove il file scaricato in %TEMP% (a.ps1)",
    test: (s) => /Remove-Item/i.test(s) && /a\.ps1/i.test(s),
  },
];

export default function Task09Inverse({ markComplete, isComplete }: TaskContext) {
  const [code, setCode] = useState(
    `# clean.ps1 — scrivi qui il tuo script di ripristino
# Obiettivo: rimuovere la persistenza creata da update.ps1

`,
  );
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const results = CHECKS.map((c) => ({ ...c, ok: c.test(code) }));
  const allOk = results.every((r) => r.ok);

  const verify = () => {
    setChecked(true);
    if (allOk) markComplete();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div>
        <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          Il tuo script inverso
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={14}
          spellCheck={false}
          className="w-full rounded-md border border-border bg-black/80 p-3 font-mono text-[12px] leading-relaxed text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
        />
        <div className="mt-3 flex gap-2">
          <button
            onClick={verify}
            className="rounded-md bg-gold px-4 py-2 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
          >
            Verifica lo script
          </button>
          <button
            onClick={() => setShowSolution((s) => !s)}
            className="rounded-md border border-border bg-background px-4 py-2 text-xs text-ivory hover:border-gold/60"
          >
            {showSolution ? "Nascondi soluzione" : "Mostra soluzione"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
            Requisiti dello script
          </div>
          <ul className="space-y-2">
            {results.map((r) => (
              <li key={r.id} className="flex items-start gap-2 text-sm">
                {checked ? (
                  r.ok ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  )
                ) : (
                  <span
                    className={cn(
                      "mt-1 inline-block h-3 w-3 shrink-0 rounded-full border",
                      r.ok ? "border-gold bg-gold/50" : "border-muted-foreground/50",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "min-w-0 break-words",
                    checked && r.ok
                      ? "text-ivory"
                      : checked
                        ? "text-destructive/90"
                        : "text-ivory/80",
                  )}
                >
                  {r.label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {showSolution && (
          <CodeBlock language="clean.ps1 — soluzione di riferimento">
            {REVERSE_SCRIPT_EXPECTED}
          </CodeBlock>
        )}

        {!isComplete && (
          <InfoNote>
            "Inverso" non significa girare i caratteri: significa <em>annullare gli
              effetti</em>. Se il malware ha creato una chiave di registro, tu la
            elimini; se ha scritto un file, lo cancelli.
          </InfoNote>
        )}

        {isComplete && (
          <SuccessNote>
            Bravo. Questo è il primo mattone di uno <strong>script di remediation</strong>:
            in un incident reale distribuiresti questo .ps1 via GPO / MDM a tutti gli
            host colpiti per ripulirli in blocco.
          </SuccessNote>
        )}
      </div>
    </div>
  );
}
