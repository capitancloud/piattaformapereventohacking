import { useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { InfoNote, Record, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { ORDERS, ME } from "../data";
import type { TaskContext } from "../../types";

export default function Task02ChangeId({ markComplete, isComplete }: TaskContext) {
  const [url, setUrl] = useState("https://shop.demo.it/orders?id=1042");
  const [loadedId, setLoadedId] = useState<number | null>(1042);

  const parseId = (u: string) => {
    const m = u.match(/id=(\d+)/);
    return m ? Number(m[1]) : null;
  };

  const go = () => {
    const id = parseId(url);
    setLoadedId(id);
    if (id && id !== 1042 && ORDERS[id] && ORDERS[id].owner !== ME.name) {
      markComplete();
    }
  };

  const order = loadedId ? ORDERS[loadedId] : null;

  return (
    <div>
      <BrowserFrame url={url} onUrlChange={setUrl} onGo={go} label="Carica">
        {order ? (
          <div className="space-y-1">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-serif text-xl text-ivory">Ordine #{order.id}</h3>
              <span className="text-xs text-muted-foreground">Cliente: {order.owner}</span>
            </div>
            <Record label="Prodotto" value={order.item} />
            <Record label="Totale" value={order.total} />
            <Record label="Indirizzo" value={order.address} highlight={order.owner !== ME.name} />
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Ordine non trovato per questo id.</p>
        )}
      </BrowserFrame>

      {!isComplete && (
        <InfoNote>
          Modifica il numero dopo <code className="text-gold">?id=</code> nella barra dell'URL (prova
          1043, 1044, 1045) e clicca <em>Carica</em>. Il tuo id è 1042.
        </InfoNote>
      )}

      {order && order.owner !== ME.name && (
        <WarnNote>
          Hai appena letto l'ordine di <strong>{order.owner}</strong> senza averne il diritto. Il
          server non ha verificato che tu fossi il proprietario.
        </WarnNote>
      )}

      {isComplete && (
        <SuccessNote>
          Questo è un <strong>IDOR</strong>: Insecure Direct Object Reference. Il server ti mostra
          qualsiasi ordine se conosci l'id.
        </SuccessNote>
      )}
    </div>
  );
}
