import { useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { FileViewer } from "@/components/lab/FileViewer";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { resolvePath, lookup } from "../fs";
import type { TaskContext } from "../../types";

const BASE = "C:/inetpub/wwwroot/pages";
const TARGET = "C:/Windows/win.ini";

export default function Task04Windows({ markComplete, isComplete }: TaskContext) {
  const [url, setUrl] = useState("https://iis.acme.local/read.aspx?file=note.txt");
  const parsed = url.match(/file=([^&]+)/)?.[1] ?? "";
  const resolved = parsed ? resolvePath(parsed, { base: BASE }) : "";
  const file = resolved ? lookup(resolved) : undefined;

  const go = () => {
    if (resolved === TARGET) markComplete();
  };

  return (
    <div>
      <BrowserFrame url={url} onUrlChange={setUrl} onGo={go} label="Apri">
        {parsed ? (
          <FileViewer
            resolvedPath={resolved}
            content={file?.content}
            notFound={!file}
            secret={file?.secret}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Nessun file richiesto.</p>
        )}
      </BrowserFrame>

      {!isComplete && (
        <InfoNote>
          Su Windows/IIS la webroot tipica è <span className="font-mono">C:\inetpub\wwwroot</span> e
          i separatori sono <code className="text-gold">\</code>. Il target classico è{" "}
          <code className="text-gold">C:\Windows\win.ini</code>. Prova{" "}
          <code className="text-gold">?file=..\..\..\Windows\win.ini</code> (o con gli slash
          normali: <code className="text-gold">?file=../../../Windows/win.ini</code>).
        </InfoNote>
      )}

      {isComplete && (
        <SuccessNote>
          Il motore ha accettato sia <code>\</code> che <code>/</code>. Ogni SO ha i suoi file
          "canonici" da esfiltrare: <code>win.ini</code>, <code>boot.ini</code>,{" "}
          <code>hosts</code>. Il principio è lo stesso: nessuna validazione del percorso.
        </SuccessNote>
      )}
    </div>
  );
}
