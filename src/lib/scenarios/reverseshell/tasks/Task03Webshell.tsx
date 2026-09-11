import { CodeBlock } from "@/components/lab/Terminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { SIMPLE_WEBSHELL_ASPX } from "../payloads";
import type { TaskContext } from "../../types";

export default function Task03Webshell({ markComplete, isComplete }: TaskContext) {
  return (
    <div>
      <CodeBlock language="cmd.aspx — mini webshell">{SIMPLE_WEBSHELL_ASPX}</CodeBlock>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Legend
          label="1"
          title="Direttiva di pagina"
          text={'<%@ Page Language="C#" %> dice a IIS che questo file va compilato ed eseguito come C#.'}
        />
        <Legend
          label="2"
          title="Input dell'attaccante"
          text="Il parametro ?cmd=... arriva dal browser e viene passato tale e quale a cmd.exe /c."
        />
        <Legend
          label="3"
          title="Output al browser"
          text="Response.Write rimanda al browser lo standard output del processo lanciato sul server."
        />
      </div>

      <button
        onClick={markComplete}
        disabled={isComplete}
        className="mt-5 rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isComplete ? "Concetto acquisito" : "Ho capito la struttura"}
      </button>

      {!isComplete && (
        <InfoNote>
          Una <strong>webshell</strong> è la forma più semplice di controllo remoto: una
          pagina che accetta un comando, lo esegue lato server e restituisce l'output.
          Non è ancora una <em>reverse shell</em>, ma è il mattone su cui costruiremo la
          reverse shell.
        </InfoNote>
      )}

      {isComplete && (
        <SuccessNote>
          Punto chiave: qualunque cosa arrivi in <code>?cmd=</code> finisce eseguita come
          l'identità dell'application pool di IIS (di default{" "}
          <code>IIS APPPOOL\DefaultAppPool</code>). Questo è già un problema; nel task 4 lo
          vediamo davvero in azione.
        </SuccessNote>
      )}
    </div>
  );
}

function Legend({ label, title, text }: { label: string; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 font-mono text-xs text-gold">
          {label}
        </span>
        <span className="font-serif text-sm text-ivory">{title}</span>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
