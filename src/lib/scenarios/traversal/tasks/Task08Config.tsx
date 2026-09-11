import { useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { FileViewer } from "@/components/lab/FileViewer";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { resolvePath, lookup } from "../fs";
import type { TaskContext } from "../../types";

const BASE = "/var/www/html/pages";
const TARGET = "/var/www/config/app.conf";

export default function Task08Config({ markComplete, isComplete }: TaskContext) {
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
          Fin qui abbiamo letto file di sistema. Il vero jackpot per l'attaccante sono le
          configurazioni dell'applicazione. Nella struttura tipica di questo server c'è{" "}
          <span className="font-mono">/var/www/config/</span>. Prova{" "}
          <code className="text-gold">?file=../../config/app.conf</code>.
        </InfoNote>
      )}

      {isComplete && (
        <SuccessNote>
          Hai appena letto host del database, utente e password in chiaro, oltre a una chiave
          Stripe. Con questi dati un attaccante si collega direttamente al DB e bypassa l'intera
          applicazione. Regola: <strong>i segreti non vivono in file leggibili dal processo web</strong>{" "}
          — usa variabili d'ambiente o un secret manager, e monta i segreti con permessi restrittivi.
        </SuccessNote>
      )}
    </div>
  );
}
