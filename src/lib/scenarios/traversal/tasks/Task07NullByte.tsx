import { useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { FileViewer } from "@/components/lab/FileViewer";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { resolvePath, lookup } from "../fs";
import type { TaskContext } from "../../types";

const BASE = "/var/www/html/pages";
const TARGET = "/etc/passwd";

// Server: appende ".txt" se il path non finisce con .txt, ma legge il file con una libreria vecchia che tronca al \0
export default function Task07NullByte({ markComplete, isComplete }: TaskContext) {
  const [url, setUrl] = useState("https://acme.example/read?file=note.txt");
  const parsed = url.match(/file=([^&]+)/)?.[1] ?? "";
  const resolved = parsed
    ? resolvePath(parsed, {
        base: BASE,
        decodeLevels: 1,
        acceptNullByte: true,
        extensionWhitelist: [".txt"],
      })
    : "";
  const file = resolved ? lookup(resolved) : undefined;

  const go = () => {
    if (resolved === TARGET) markComplete();
  };

  const missingNullByte = parsed.includes("passwd") && !parsed.includes("%00");

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
          Il server ora appende <code className="text-gold">.txt</code> se il file richiesto non
          termina già così: pensa di essere al sicuro. Ma la libreria che legge il file è scritta in
          C e tronca al primo <em>null byte</em> (<code className="text-gold">%00</code>). Prova{" "}
          <code className="text-gold">?file=../../../../etc/passwd%00</code>.
        </InfoNote>
      )}

      {missingNullByte && !file && (
        <WarnNote>Il server ha appeso <code>.txt</code>: aggiungi <code>%00</code> per fargli ignorare il resto.</WarnNote>
      )}

      {isComplete && (
        <SuccessNote>
          Il null byte era il classico bypass della whitelist di estensioni nei tempi di PHP 5.
          Chiuso da anni nei linguaggi moderni, ma l'idea sopravvive ogni volta che due layer
          interpretano diversamente la stessa stringa.
        </SuccessNote>
      )}
    </div>
  );
}
