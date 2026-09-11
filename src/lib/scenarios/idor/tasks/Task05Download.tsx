import { useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { InfoNote, Record, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { DOCS } from "../data";
import type { TaskContext } from "../../types";

export default function Task05Download({ markComplete, isComplete }: TaskContext) {
  const [url, setUrl] = useState("https://drive.demo.it/download?doc=88");
  const [id, setId] = useState<number | null>(88);

  const go = () => {
    const m = url.match(/doc=(\d+)/);
    const n = m ? Number(m[1]) : null;
    setId(n);
    if (n && DOCS[n]?.classification === "Riservato") markComplete();
  };

  const d = id ? DOCS[id] : null;

  return (
    <div>
      <BrowserFrame url={url} onUrlChange={setUrl} onGo={go} label="Scarica">
        {d ? (
          <div>
            <h3 className="mb-3 font-serif text-xl text-ivory">Download</h3>
            <Record label="Nome file" value={d.name} highlight={d.classification === "Riservato"} />
            <Record label="Proprietario" value={d.owner} />
            <Record
              label="Classificazione"
              value={d.classification}
              highlight={d.classification === "Riservato"}
            />
            <button className="mt-4 rounded-md border border-gold/40 bg-gold/10 px-4 py-2 text-sm text-gold transition hover:bg-gold/20">
              ↓ Scarica file
            </button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Documento non trovato.</p>
        )}
      </BrowserFrame>

      {!isComplete ? (
        <InfoNote>
          Il tuo file è <code className="text-gold">doc=88</code>. Prova a modificare il parametro
          (86, 87, 89) e scarica un documento <strong>Riservato</strong> che non ti appartiene.
        </InfoNote>
      ) : (
        <>
          <WarnNote>
            Il server ha restituito un file riservato senza verificare il tuo ruolo.
          </WarnNote>
          <SuccessNote>
            Ogni endpoint che serve file deve verificare autenticazione E autorizzazione, sempre.
          </SuccessNote>
        </>
      )}
    </div>
  );
}
