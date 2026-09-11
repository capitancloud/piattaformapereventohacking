import { useEffect, useRef, useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { Terminal, type TermLine } from "@/components/lab/Terminal";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { findUpload, getListener, openShell, uploadFile } from "../state";
import type { TaskContext } from "../../types";

export default function Task07Trigger({ markComplete, isComplete }: TaskContext) {
  const listener = getListener();
  const [uploaded, setUploaded] = useState(!!findUpload("shell.aspx"));
  const [url, setUrl] = useState("http://10.10.24.17/uploads/shell.aspx");
  const [triggered, setTriggered] = useState(false);
  const [lines, setLines] = useState<TermLine[]>(
    listener.port
      ? [
          { kind: "prompt", text: `nc -lvnp ${listener.port}` },
          { kind: "info", text: `listening on [any] ${listener.port} ...` },
        ]
      : [{ kind: "err", text: "nessun listener attivo — torna al task 5" }],
  );
  const done = useRef(false);

  const doUpload = () => {
    uploadFile({ name: "shell.aspx", content: "payload", uploadedAt: Date.now() });
    setUploaded(true);
  };

  const trigger = () => {
    if (!uploaded || !listener.port) return;
    setTriggered(true);
  };

  useEffect(() => {
    if (!triggered || !listener.port) return;
    const port = listener.port;
    const seq: TermLine[] = [
      { kind: "info", text: "connect to [10.10.24.99] from (UNKNOWN) [10.10.24.17] 51834" },
      { kind: "out", text: "Windows PowerShell" },
      { kind: "out", text: "Copyright (C) Microsoft Corporation. All rights reserved." },
      { kind: "out", text: "" },
      { kind: "out", text: "PS C:\\Windows\\system32\\inetsrv>" },
    ];
    let i = 0;
    const id = setInterval(() => {
      setLines((prev) => [...prev, seq[i]!]);
      i += 1;
      if (i >= seq.length) {
        clearInterval(id);
        openShell();
        if (!done.current) {
          done.current = true;
          markComplete();
        }
      }
    }, 500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggered, listener.port]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <BrowserFrame url={url} onUrlChange={setUrl} onGo={trigger} label="Trigger">
            <div className="space-y-3 text-xs">
              <button
                onClick={doUpload}
                disabled={uploaded}
                className="rounded-md bg-gold px-4 py-2 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {uploaded ? "shell.aspx caricato" : "Carica shell.aspx"}
              </button>
              {uploaded && !triggered && (
                <p className="text-muted-foreground">
                  File caricato. Ora premi <em>Trigger</em> in alto per richiedere l'URL
                  della pagina: IIS la compila e la esegue.
                </p>
              )}
              {triggered && (
                <pre className="rounded border border-border bg-black/60 p-3 font-mono text-[11px] text-ivory/90">
                  {"HTTP/1.1 200 OK\nContent-Type: text/html\nServer: Microsoft-IIS/10.0\n\nok"}
                </pre>
              )}
            </div>
          </BrowserFrame>
        </div>

        <Terminal
          title="kali@attacker: ~ (listener)"
          prompt="kali@attacker:~$ "
          lines={lines}
        />
      </div>

      {!listener.port && (
        <WarnNote>
          Nessun listener attivo. Torna al task 5 e avvialo prima di innescare il payload.
        </WarnNote>
      )}

      {!isComplete && listener.port && (
        <InfoNote>
          1) Carica <code>shell.aspx</code>. 2) Premi <em>Trigger</em>: il browser
          richiede l'URL, IIS esegue la pagina, PowerShell parte, apre una connessione
          verso il tuo IP:porta. 3) Sul listener vedrai apparire la shell.
        </InfoNote>
      )}

      {isComplete && (
        <SuccessNote>
          <strong>Shell aperta.</strong> La freccia della connessione va dalla vittima
          verso di te: per questo si chiama <em>reverse</em>. È il motivo per cui i
          firewall aziendali, che spesso bloccano le connessioni in ingresso ma non quelle
          in uscita, non se ne accorgono se usi porte comuni (443).
        </SuccessNote>
      )}
    </div>
  );
}
