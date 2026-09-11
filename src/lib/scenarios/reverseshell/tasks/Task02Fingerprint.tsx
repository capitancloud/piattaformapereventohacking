import { useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";

const PAGES: Record<string, { headers: Record<string, string>; body: string; status: number }> = {
  "/": {
    status: 200,
    headers: {
      Server: "Microsoft-IIS/10.0",
      "X-Powered-By": "ASP.NET",
      "X-AspNet-Version": "4.0.30319",
    },
    body: "<h1>ACME Corp — Intranet portal</h1>\n<a href='/upload'>Documenti condivisi</a>",
  },
  "/upload": {
    status: 200,
    headers: {
      Server: "Microsoft-IIS/10.0",
      "X-Powered-By": "ASP.NET",
    },
    body: "<h1>Carica un documento</h1>\n<form method='post' enctype='multipart/form-data' action='/upload'>\n  <input type='file' name='file' />\n  <button>Invia</button>\n</form>",
  },
  "/uploads/": {
    status: 200,
    headers: { Server: "Microsoft-IIS/10.0" },
    body: "Directory listing:\n  report-q1.pdf\n  logo.png\n  handbook.docx",
  },
};

export default function Task02Fingerprint({ markComplete, isComplete }: TaskContext) {
  const [url, setUrl] = useState("http://10.10.24.17/");
  const [shown, setShown] = useState<string | null>("/");
  const [seenUpload, setSeenUpload] = useState(false);
  const [seenListing, setSeenListing] = useState(false);

  const go = () => {
    const path = url.replace(/^https?:\/\/[^/]+/, "") || "/";
    if (PAGES[path]) {
      setShown(path);
      if (path === "/upload") setSeenUpload(true);
      if (path === "/uploads/") setSeenListing(true);
      if ((seenUpload || path === "/upload") && (seenListing || path === "/uploads/")) {
        markComplete();
      }
    } else setShown(null);
  };

  const page = shown ? PAGES[shown] : null;

  return (
    <div>
      <BrowserFrame url={url} onUrlChange={setUrl} onGo={go} label="Apri">
        {page ? (
          <div className="space-y-3">
            <div className="rounded border border-border bg-surface-2 p-3">
              <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                Risposta HTTP {page.status}
              </div>
              <pre className="font-mono text-[11px] leading-relaxed text-ivory/80">
                {Object.entries(page.headers)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join("\n")}
              </pre>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-ivory/90">
              {page.body}
            </pre>
          </div>
        ) : (
          <p className="text-sm text-destructive">404 Not Found</p>
        )}
      </BrowserFrame>

      {!isComplete && (
        <InfoNote>
          Visita almeno <code className="text-gold">/upload</code> (la pagina che accetta
          file) e <code className="text-gold">/uploads/</code> (la cartella dove i file
          caricati vengono serviti). Gli header confermano IIS 10 e ASP.NET.
        </InfoNote>
      )}

      {seenUpload && !seenListing && (
        <WarnNote>
          C'è un modulo di upload. Ora scopri se la cartella di destinazione è pubblica:
          prova <code>/uploads/</code>.
        </WarnNote>
      )}

      {isComplete && (
        <SuccessNote>
          Combinazione fatale: un endpoint che accetta upload <strong>+</strong> una
          cartella dove i file caricati sono raggiungibili via web{" "}
          <strong>+</strong> ASP.NET attivo (quindi <code>.aspx</code> viene{" "}
          <em>eseguito</em>, non solo servito come testo). È l'esatta condizione per una
          webshell.
        </SuccessNote>
      )}
    </div>
  );
}
