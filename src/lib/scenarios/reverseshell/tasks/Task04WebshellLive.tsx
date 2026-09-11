import { useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { uploadFile, findUpload } from "../state";
import type { TaskContext } from "../../types";

const RESPONSES: Record<string, string> = {
  whoami: "iis apppool\\defaultapppool",
  hostname: "WEB01",
  "systeminfo | findstr /b /c:\"os name\"": "OS Name:                   Microsoft Windows Server 2019 Standard",
  "dir c:\\inetpub\\wwwroot\\uploads":
    " Volume in drive C has no label.\n Directory of c:\\inetpub\\wwwroot\\uploads\n\n" +
    "07/09/2026  09:12    <DIR>          .\n07/09/2026  09:12    <DIR>          ..\n" +
    "07/09/2026  09:12               412 cmd.aspx\n07/09/2026  09:03           183.204 report-q1.pdf\n" +
    "               2 File(s)        183.616 bytes",
  "ipconfig":
    "Windows IP Configuration\n\nEthernet adapter Ethernet0:\n" +
    "   IPv4 Address. . . . . . . . . . . : 10.10.24.17\n" +
    "   Subnet Mask . . . . . . . . . . . : 255.255.255.0\n" +
    "   Default Gateway . . . . . . . . . : 10.10.24.1",
};

function runFake(cmd: string): string {
  const key = cmd.trim().toLowerCase();
  if (RESPONSES[key]) return RESPONSES[key]!;
  if (key.startsWith("dir ")) return "File Not Found";
  return `'${cmd.split(" ")[0]}' is not recognized as an internal or external command,\noperable program or batch file.`;
}

export default function Task04WebshellLive({ markComplete, isComplete }: TaskContext) {
  const [uploaded, setUploaded] = useState(!!findUpload("cmd.aspx"));
  const [url, setUrl] = useState("http://10.10.24.17/uploads/cmd.aspx");
  const [cmd, setCmd] = useState("whoami");
  const [output, setOutput] = useState<string | null>(null);
  const [ranWhoami, setRanWhoami] = useState(false);

  const doUpload = () => {
    uploadFile({
      name: "cmd.aspx",
      content: "webshell",
      uploadedAt: Date.now(),
    });
    setUploaded(true);
  };

  const run = () => {
    if (!uploaded) {
      setOutput("404 — file non trovato. Devi prima caricarlo.");
      return;
    }
    const out = runFake(cmd);
    setOutput(out);
    if (cmd.trim().toLowerCase() === "whoami") {
      setRanWhoami(true);
      markComplete();
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          Step 1 — Upload
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={doUpload}
            disabled={uploaded}
            className="rounded-md bg-gold px-4 py-2 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {uploaded ? "cmd.aspx caricato" : "Carica cmd.aspx nell'upload IIS"}
          </button>
          {uploaded && (
            <span className="font-mono text-[11px] text-success">
              POST /upload → 200 OK · salvato in C:\inetpub\wwwroot\uploads\cmd.aspx
            </span>
          )}
        </div>
      </div>

      <BrowserFrame url={url} onUrlChange={setUrl} editable={false}>
        <div className="space-y-3">
          <div className="text-xs text-muted-foreground">
            La webshell è servita da IIS. Digita un comando e premi{" "}
            <em>Esegui</em> — verrà eseguito come l'utente dell'application pool.
          </div>
          <div className="flex gap-2">
            <input
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              placeholder="whoami"
              className="flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
            <button
              onClick={run}
              className="rounded-md bg-gold px-4 py-2 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
            >
              Esegui
            </button>
          </div>
          {output !== null && (
            <pre className="whitespace-pre-wrap rounded border border-border bg-black/60 p-3 font-mono text-[11px] leading-relaxed text-ivory/90">
              {output}
            </pre>
          )}
        </div>
      </BrowserFrame>

      {!isComplete && (
        <InfoNote>
          Prima carica il file, poi apri la webshell e prova{" "}
          <code className="text-gold">whoami</code>. Puoi anche esplorare con{" "}
          <code>hostname</code>, <code>ipconfig</code>,{" "}
          <code>dir c:\inetpub\wwwroot\uploads</code>.
        </InfoNote>
      )}

      {ranWhoami && !isComplete && (
        <WarnNote>
          Stai eseguendo comandi sul server, ma via HTTP: ogni richiesta è visibile nei log
          di IIS. Nel task 5 passeremo a una <em>reverse shell</em>, molto più pulita da
          usare (e da rilevare).
        </WarnNote>
      )}

      {isComplete && (
        <SuccessNote>
          Il server ha risposto <code>iis apppool\defaultapppool</code>. Questa è l'identità
          con cui IIS esegue il tuo codice: limitata, ma con accesso in scrittura alla
          webroot e al filesystem locale. Ora facciamo il salto: da webshell one-shot a{" "}
          <strong>shell interattiva persistente</strong>.
        </SuccessNote>
      )}
    </div>
  );
}
