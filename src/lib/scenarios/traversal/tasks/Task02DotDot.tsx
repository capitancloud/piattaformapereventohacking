import { useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { FileViewer } from "@/components/lab/FileViewer";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { resolvePath, lookup } from "../fs";
import type { TaskContext } from "../../types";

const BASE = "/var/www/html/pages";
const TARGET = "/var/www/html/index.html";

export default function Task02DotDot({ markComplete, isComplete }: TaskContext) {
  const [url, setUrl] = useState("https://acme.example/read?file=note.txt");
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
          Il server risolve i file dentro <span className="font-mono">{BASE}</span>. Aggiungi{" "}
          <code className="text-gold">../</code> davanti al nome per uscire e raggiungere{" "}
          <code className="text-gold">index.html</code> nella cartella superiore. Esempio:{" "}
          <code className="text-gold">?file=../index.html</code>.
        </InfoNote>
      )}

      {file && !file.secret && resolved !== TARGET && parsed.includes("..") && (
        <WarnNote>Hai risalito la struttura. Ora punta a index.html della web root.</WarnNote>
      )}

      {isComplete && (
        <SuccessNote>
          Sei uscito dalla cartella prevista senza che il server te lo impedisse. Questo è{" "}
          <strong>path traversal</strong>: bastano due caratteri, <code>../</code>, per navigare
          all'indietro nel filesystem.
        </SuccessNote>
      )}
    </div>
  );
}
