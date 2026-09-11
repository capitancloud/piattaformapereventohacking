import { useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { InfoNote, Record, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { PROFILES } from "../data";
import type { TaskContext } from "../../types";

export default function Task04Admin({ markComplete, isComplete }: TaskContext) {
  const [url, setUrl] = useState("https://app.demo.it/profile/42");
  const [id, setId] = useState<number | null>(42);

  const go = () => {
    const m = url.match(/profile\/(\d+)/);
    const n = m ? Number(m[1]) : null;
    setId(n);
    if (n === 1) markComplete();
  };

  const p = id ? PROFILES[id] : null;

  return (
    <div>
      <BrowserFrame url={url} onUrlChange={setUrl} onGo={go} label="Apri">
        {p ? (
          <div>
            <h3 className="mb-3 font-serif text-xl text-ivory">Profilo utente</h3>
            <Record label="Nome" value={p.name} highlight={p.id === 1} />
            <Record label="Ruolo" value={p.role} highlight={p.id === 1} />
            <Record label="Email" value={p.email} />
            <Record label="Dato riservato" value={p.secret} highlight={p.id === 1} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Profilo non trovato.</p>
        )}
      </BrowserFrame>

      {!isComplete && (
        <InfoNote>
          Nei sistemi tradizionali l'utente <code className="text-gold">id=1</code> è spesso
          l'amministratore. Prova a caricarlo.
        </InfoNote>
      )}

      {isComplete && (
        <>
          <WarnNote>
            Hai ottenuto una API key dell'amministratore. Con essa un attaccante può controllare
            l'intera applicazione.
          </WarnNote>
          <SuccessNote>
            Gli ID prevedibili sono un moltiplicatore di rischio: preferisci UUID casuali.
          </SuccessNote>
        </>
      )}
    </div>
  );
}
