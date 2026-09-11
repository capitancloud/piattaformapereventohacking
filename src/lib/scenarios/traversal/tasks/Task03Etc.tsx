import { useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { FileViewer } from "@/components/lab/FileViewer";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { resolvePath, lookup } from "../fs";
import type { TaskContext } from "../../types";

const BASE = "/var/www/html/pages";
const TARGET = "/etc/passwd";

export default function Task03Etc({ markComplete, isComplete }: TaskContext) {
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
          Su un server Linux, <code className="text-gold">/etc/passwd</code> è il classico bersaglio
          per dimostrare un path traversal: è leggibile da tutti gli utenti di sistema. Servono
          abbastanza <code className="text-gold">../</code> per risalire dalla webroot fino alla
          radice. Prova <code className="text-gold">?file=../../../../etc/passwd</code>.
        </InfoNote>
      )}

      {isComplete && (
        <SuccessNote>
          <code>/etc/passwd</code> non contiene le password (quelle sono in{" "}
          <code>/etc/shadow</code>), ma rivela nomi utente, uid, home directory e shell. Per un
          attaccante è la conferma che può leggere file arbitrari sul sistema.
        </SuccessNote>
      )}
    </div>
  );
}
