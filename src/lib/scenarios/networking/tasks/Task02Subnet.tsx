import { useEffect, useState } from "react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";

function maskFromPrefix(p: number) {
  const bits = 0xffffffff << (32 - p);
  return [24, 16, 8, 0].map((s) => (bits >>> s) & 0xff).join(".");
}

export default function Task02Subnet({ markComplete, isComplete }: TaskContext) {
  const [prefix, setPrefix] = useState(24);
  const [touched, setTouched] = useState<Set<number>>(new Set([24]));

  const hostBits = 32 - prefix;
  const totalAddresses = 2 ** hostBits;
  const usable = Math.max(0, totalAddresses - 2);

  useEffect(() => {
    // Complete when user has explored at least 3 different prefixes including one below 24
    if (touched.size >= 3 && [...touched].some((p) => p < 24)) markComplete();
  }, [touched, markComplete]);

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-2 flex items-baseline justify-between">
          <div className="font-mono text-xs uppercase tracking-widest text-accent">
            192.168.1.0 / {prefix}
          </div>
          <div className="text-xs text-muted-foreground">
            Maschera: <span className="font-mono text-foreground">{maskFromPrefix(prefix)}</span>
          </div>
        </div>

        <input
          type="range"
          min={8}
          max={30}
          value={prefix}
          onChange={(e) => {
            const p = parseInt(e.target.value);
            setPrefix(p);
            setTouched((s) => new Set(s).add(p));
          }}
          className="mt-3 w-full accent-[oklch(0.78_0.14_295)]"
        />
        <div className="mt-1 flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>/8</span>
          <span>/16</span>
          <span>/24</span>
          <span>/30</span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <Stat label="Bit host" value={hostBits.toString()} />
          <Stat label="Indirizzi totali" value={totalAddresses.toLocaleString("it-IT")} />
          <Stat label="Host utilizzabili" value={usable.toLocaleString("it-IT")} />
        </div>

        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-background">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all"
            style={{ width: `${((30 - prefix) / (30 - 8)) * 100}%` }}
          />
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          Sposta lo slider e prova almeno 3 valori diversi (uno più basso di /24). Osserva: al
          diminuire del prefisso, la rete diventa esponenzialmente più grande.
        </InfoNote>
      ) : (
        <SuccessNote>
          Regola pratica: ogni bit tolto al prefisso RADDOPPIA gli host. /24 → 254, /23 → 510, /22 →
          1022…
        </SuccessNote>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="mt-1 font-mono text-lg text-accent">{value}</div>
    </div>
  );
}
