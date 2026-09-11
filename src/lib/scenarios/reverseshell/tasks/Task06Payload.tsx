import { useMemo, useState } from "react";
import { CodeBlock } from "@/components/lab/Terminal";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { getListener } from "../state";
import { REVERSE_SHELL_ASPX } from "../payloads";
import type { TaskContext } from "../../types";

export default function Task06Payload({ markComplete, isComplete }: TaskContext) {
  const listener = getListener();
  const [host, setHost] = useState("10.10.24.99");
  const [port, setPort] = useState(String(listener.port ?? 4444));

  const payload = useMemo(() => {
    const p = Number(port);
    return REVERSE_SHELL_ASPX(host, Number.isFinite(p) ? p : 4444);
  }, [host, port]);

  const matches = listener.port !== null && Number(port) === listener.port;

  const generate = () => {
    if (matches) markComplete();
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
            LHOST (IP attaccante)
          </span>
          <input
            value={host}
            onChange={(e) => setHost(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] uppercase tracking-widest text-muted-foreground">
            LPORT (porta del listener)
          </span>
          <input
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
          />
        </label>
      </div>

      <button
        onClick={generate}
        className="rounded-md bg-gold px-4 py-2 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
      >
        Genera shell.aspx
      </button>

      <CodeBlock language={`shell.aspx — reverse shell (LHOST=${host}, LPORT=${port})`}>
        {payload}
      </CodeBlock>

      {!isComplete && listener.port === null && (
        <WarnNote>
          Non risulta un listener attivo dal task precedente. Torna al task 5 e avvia{" "}
          <code>nc -lvnp</code> prima di generare il payload.
        </WarnNote>
      )}
      {!isComplete && listener.port !== null && !matches && (
        <WarnNote>
          LPORT ({port}) non coincide con la porta del tuo listener ({listener.port}). La
          vittima si connetterebbe nel vuoto.
        </WarnNote>
      )}

      {!isComplete && (
        <InfoNote>
          Il cuore del payload è una one-liner PowerShell: apre un{" "}
          <code>TCPClient</code> verso <code>LHOST:LPORT</code> e collega input/output di{" "}
          <code>powershell.exe</code> al socket. La versione qui è passata a{" "}
          <code>-EncodedCommand</code> perché così non contiene apici, virgolette o newline
          che complicherebbero la scrittura come stringa C#.
        </InfoNote>
      )}

      {isComplete && (
        <SuccessNote>
          Payload allineato al listener. Prossimo passo: caricarlo su IIS e{" "}
          <em>innescarlo</em> chiamando l'URL — nel task 7.
        </SuccessNote>
      )}
    </div>
  );
}
