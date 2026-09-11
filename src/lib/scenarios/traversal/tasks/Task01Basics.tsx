import { useEffect, useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { FileViewer } from "@/components/lab/FileViewer";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { resolvePath, lookup } from "../fs";
import type { TaskContext } from "../../types";

const BASE = "/var/www/html/pages";

export default function Task01Basics({ markComplete, isComplete }: TaskContext) {
  const [url, setUrl] = useState("https://acme.example/read?file=note.txt");
  const [visited, setVisited] = useState<Set<string>>(new Set());

  const parsed = url.match(/file=([^&]+)/)?.[1] ?? "";
  const resolved = parsed ? resolvePath(parsed, { base: BASE }) : "";
  const file = resolved ? lookup(resolved) : undefined;

  useEffect(() => {
    if (file && !file.secret) {
      const next = new Set(visited);
      next.add(file.path);
      if (next.size !== visited.size) setVisited(next);
      if (next.size >= 2) markComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file?.path]);

  return (
    <div>
      <BrowserFrame url={url} onUrlChange={setUrl} onGo={() => void 0} label="Apri">
        {parsed ? (
          <FileViewer
            resolvedPath={resolved}
            content={file?.content}
            notFound={!file}
            secret={file?.secret}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Passa il nome di un file nel parametro <code className="text-gold">?file=</code>.
          </p>
        )}
      </BrowserFrame>

      {!isComplete && (
        <InfoNote>
          Prova a leggere i file <code className="text-gold">note.txt</code>,{" "}
          <code className="text-gold">faq.txt</code>, <code className="text-gold">press.txt</code>.
          Il server li legge dentro <span className="font-mono">{BASE}</span> e te li restituisce.
        </InfoNote>
      )}

      {isComplete && (
        <SuccessNote>
          Ottimo. Ogni richiesta arriva con un <em>nome di file</em> che il server compone con la sua
          cartella di base per costruire un percorso assoluto. Nei prossimi task vedremo cosa succede
          se manipoli tu quel nome.
        </SuccessNote>
      )}
    </div>
  );
}
