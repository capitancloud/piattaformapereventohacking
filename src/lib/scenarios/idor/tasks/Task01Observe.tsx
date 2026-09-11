import { useState } from "react";
import { BrowserFrame } from "@/components/lab/BrowserFrame";
import { InfoNote, Record, SuccessNote } from "@/components/lab/Feedback";
import { ORDERS, MY_ORDERS } from "../data";
import type { TaskContext } from "../../types";

export default function Task01Observe({ markComplete, isComplete }: TaskContext) {
  const [idx, setIdx] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(new Set([MY_ORDERS[0]]));
  const orderId = MY_ORDERS[idx];
  const order = ORDERS[orderId];

  return (
    <div>
      <BrowserFrame url={`https://shop.demo.it/orders?id=${orderId}`} editable={false}>
        <div className="space-y-1">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="font-serif text-xl text-ivory">Il mio ordine</h3>
            <span className="text-xs text-muted-foreground">ID {order.id}</span>
          </div>
          <Record label="Prodotto" value={order.item} />
          <Record label="Totale" value={order.total} />
          <Record label="Indirizzo" value={order.address} />
        </div>
      </BrowserFrame>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => {
            const next = (idx + 1) % MY_ORDERS.length;
            setIdx(next);
            const s = new Set(seen);
            s.add(MY_ORDERS[next]);
            setSeen(s);
            if (s.size >= 2) markComplete();
          }}
          className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
        >
          Ordine successivo →
        </button>
        <span className="text-xs text-muted-foreground">
          Osserva come cambia il numero nell'URL
        </span>
      </div>

      {!isComplete ? (
        <InfoNote>
          Nota il parametro <code className="text-gold">?id=</code> nell'URL. È un numero che
          identifica una risorsa sul server. Clicca il pulsante per vedere il tuo secondo ordine.
        </InfoNote>
      ) : (
        <SuccessNote>
          Perfetto. Ogni risorsa (ordine, fattura, profilo) ha un identificatore. Nel prossimo task
          proveremo a manipolarlo.
        </SuccessNote>
      )}
    </div>
  );
}
