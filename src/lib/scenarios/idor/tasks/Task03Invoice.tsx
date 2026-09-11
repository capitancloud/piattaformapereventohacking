import { useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { InfoNote, Record, SuccessNote } from "@/components/lab/Feedback";
import { INVOICES } from "../data";
import type { TaskContext } from "../../types";

export default function Task03Invoice({ markComplete, isComplete }: TaskContext) {
  const [url, setUrl] = useState("https://billing.demo.it/invoice/9040");
  const [id, setId] = useState<number | null>(9040);

  const go = () => {
    const m = url.match(/invoice\/(\d+)/);
    const n = m ? Number(m[1]) : null;
    setId(n);
    if (n && INVOICES[n]?.owner === "Marco Bianchi") markComplete();
  };

  const inv = id ? INVOICES[id] : null;

  return (
    <div>
      <BrowserFrame url={url} onUrlChange={setUrl} onGo={go} label="Apri">
        {inv ? (
          <div>
            <h3 className="mb-3 font-serif text-xl text-ivory">Fattura {inv.id}</h3>
            <Record label="Intestatario" value={inv.owner} highlight={inv.owner === "Marco Bianchi"} />
            <Record label="Importo" value={inv.amount} />
            <Record label="IBAN" value={inv.iban} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Fattura non trovata.</p>
        )}
      </BrowserFrame>

      {!isComplete ? (
        <InfoNote>
          Obiettivo: trovare la fattura intestata a <strong>Marco Bianchi</strong>. Prova a
          modificare il numero dopo <code className="text-gold">/invoice/</code> (i numeri sono
          vicini a 9040).
        </InfoNote>
      ) : (
        <SuccessNote>
          Trovata. Nessun controllo di proprietà: chiunque conosca il numero può leggere la fattura.
        </SuccessNote>
      )}
    </div>
  );
}
