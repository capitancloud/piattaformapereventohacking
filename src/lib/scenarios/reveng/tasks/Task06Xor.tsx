import { useState } from "react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { XOR_BYTES, XOR_KEY, XOR_PLAIN } from "../payloads";
import type { TaskContext } from "../../types";

export default function Task06Xor({ markComplete, isComplete }: TaskContext) {
  const [key, setKey] = useState(1);
  const [tried, setTried] = useState(false);

  const decoded = XOR_BYTES.map((b) => String.fromCharCode(b ^ key)).join("");
  const solved = key === XOR_KEY;

  const submit = () => {
    setTried(true);
    if (solved) markComplete();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          Byte cifrati (dallo stage 2)
        </div>
        <div className="mb-4 flex flex-wrap gap-1 font-mono text-[11px] text-ivory/80">
          {XOR_BYTES.map((b, i) => (
            <span key={i} className="rounded bg-black/40 px-1.5 py-0.5">
              {b}
            </span>
          ))}
        </div>

        <label className="mb-1 block text-xs text-muted-foreground">
          Chiave XOR (0–127): <span className="ml-2 font-mono text-gold">{key}</span>
        </label>
        <input
          type="range"
          min={0}
          max={127}
          value={key}
          onChange={(e) => setKey(parseInt(e.target.value, 10))}
          className="w-full accent-[hsl(var(--gold))]"
        />

        <div className="mt-3 rounded border border-border bg-black/60 p-3 font-mono text-[12px] leading-relaxed text-ivory/90">
          {decoded || " "}
        </div>

        <div className="mt-3 flex items-center gap-3">
          <button
            onClick={submit}
            className="rounded-md bg-gold px-4 py-2 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
          >
            Ho trovato la chiave
          </button>
          <span className="font-mono text-[11px] text-muted-foreground">
            Suggerimento: cerca la chiave che produce un URL leggibile.
          </span>
        </div>
      </div>

      {tried && !solved && (
        <WarnNote>
          Non è ancora la chiave giusta: l'output deve iniziare con <code>http://</code>.
        </WarnNote>
      )}

      {!isComplete && (
        <InfoNote>
          XOR con chiave singola è il cifrario più semplice: applicato due volte con la
          stessa chiave restituisce il testo originale. Bastano poche prove per trovarla
          — o un attacco a dizionario sui caratteri iniziali attesi (es. "http").
        </InfoNote>
      )}

      {isComplete && (
        <SuccessNote>
          Chiave trovata: <code>{XOR_KEY}</code>. Il payload rivela l'URL{" "}
          <code>{XOR_PLAIN}</code> — lo stesso host già visto nel Base64. È un altro
          indicatore forte: comparire di uno stesso IP in più stadi diversi conferma
          l'attribuzione a una singola campagna.
        </SuccessNote>
      )}
    </div>
  );
}
