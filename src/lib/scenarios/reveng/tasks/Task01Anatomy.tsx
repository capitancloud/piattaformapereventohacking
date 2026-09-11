import { CodeBlock } from "@/components/lab/Terminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { HELLO_PS } from "../payloads";
import type { TaskContext } from "../../types";

export default function Task01Anatomy({ markComplete, isComplete }: TaskContext) {
  return (
    <div>
      <CodeBlock language="hello.ps1">{HELLO_PS}</CodeBlock>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Card
          n="1"
          title="Commento"
          text="Le righe che iniziano con # sono commenti: servono per gli umani, PowerShell le ignora."
        />
        <Card
          n="2"
          title="Variabile"
          text="$nome è una variabile. Il simbolo $ introduce sempre un nome di variabile in PowerShell."
        />
        <Card
          n="3"
          title="Cmdlet"
          text="Write-Host e Get-Date sono cmdlet: comandi predefiniti con la forma Verbo-Nome."
        />
      </div>

      <button
        onClick={markComplete}
        disabled={isComplete}
        className="mt-5 rounded-md bg-gold px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isComplete ? "Concetto acquisito" : "Ho capito l'anatomia"}
      </button>

      {!isComplete && (
        <InfoNote>
          PowerShell è il linguaggio di scripting di Windows. Prima di smontare uno
          script cattivo devi saperne riconoscere i pezzi: <strong>variabili</strong>,{" "}
          <strong>cmdlet</strong>, <strong>stringhe</strong>, <strong>pipeline</strong>.
        </InfoNote>
      )}

      {isComplete && (
        <SuccessNote>
          Fissa in mente la forma: <code>Verbo-Nome -Parametro Valore</code>. Ogni
          cmdlet segue questa regola. Nel prossimo task useremo questa conoscenza per
          leggere un file trovato sul PC di un utente.
        </SuccessNote>
      )}
    </div>
  );
}

function Card({ n, title, text }: { n: string; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 font-mono text-xs text-gold">
          {n}
        </span>
        <span className="font-serif text-sm text-ivory">{title}</span>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}
