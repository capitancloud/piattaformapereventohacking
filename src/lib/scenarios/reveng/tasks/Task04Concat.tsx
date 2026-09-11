import { useState } from "react";
import { CodeBlock } from "@/components/lab/Terminal";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { CONCAT_SCRIPT } from "../payloads";
import type { TaskContext } from "../../types";

export default function Task04Concat({ markComplete, isComplete }: TaskContext) {
  const [ans, setAns] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const check = () => {
    const norm = ans.trim().toLowerCase();
    if (norm === "invoke-expression" || norm === "iex") {
      setErr(null);
      markComplete();
    } else {
      setErr("Non ancora. Concatena mentalmente 'In' + 'vo' + 'ke-Ex' + 'pre' + 'ssion'.");
    }
  };

  return (
    <div className="space-y-4">
      <CodeBlock language="variante 1 — concatenazione">{CONCAT_SCRIPT}</CodeBlock>

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 text-sm text-ivory">
          Qual è il nome del cmdlet ricostruito nella variabile <code>$a</code>?
        </div>
        <div className="flex gap-2">
          <input
            value={ans}
            onChange={(e) => setAns(e.target.value)}
            placeholder="es. Get-Something"
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
          />
          <button
            onClick={check}
            className="rounded-md bg-gold px-4 py-2 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
          >
            Verifica
          </button>
        </div>
      </div>

      {err && <WarnNote>{err}</WarnNote>}

      {!isComplete && (
        <InfoNote>
          Spezzare una stringa in tanti pezzi è la forma più elementare di offuscamento:
          il codice si compila lo stesso, ma un antivirus che cerca la stringa esatta
          non la trova. La contromisura è banale per un umano: unisci i pezzi.
        </InfoNote>
      )}

      {isComplete && (
        <SuccessNote>
          <strong>Invoke-Expression</strong> (alias <code>iex</code>) esegue una
          stringa come codice PowerShell — è il coltellino svizzero degli
          script malevoli: scarica una stringa da Internet e la esegue al volo,
          senza mai toccare il disco.
        </SuccessNote>
      )}
    </div>
  );
}
