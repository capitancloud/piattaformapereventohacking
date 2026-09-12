import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const PATH = "C:\\Program Files\\Vulnerable App\\service.exe";

const CANDIDATES = [
  { name: "Program.exe", dir: "C:\\", ok: true, why: "Windows prova prima «C:\\Program.exe» — è la prima interruzione allo spazio." },
  { name: "Vulnerable.exe", dir: "C:\\Program Files\\", ok: false, why: "Cartella «Program Files» in genere non è scrivibile da utenti normali." },
  { name: "service.exe", dir: "C:\\Program Files\\Vulnerable App\\", ok: false, why: "Sovrascriveresti il binario originale: serve permesso di scrittura lì dentro." },
  { name: "App.exe", dir: "C:\\Program Files\\Vulnerable\\", ok: false, why: "Il pezzo giusto sarebbe «Vulnerable», ma la cartella non esiste così." },
];

export default function Task05UnquotedPath({ markComplete, isComplete }: TaskContext) {
  const [pick, setPick] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const correct = pick !== null && CANDIDATES[pick]?.ok === true;
  useEffect(() => { if (checked && correct) markComplete(); }, [checked, correct, markComplete]);

  return (
    <div>
      <div className="min-w-0 rounded-xl border border-border bg-black p-4 font-mono text-[12px] text-ivory">
        <div className="text-gold-soft">C:\&gt; sc qc VulnApp</div>
        <div className="mt-1">BINARY_PATH_NAME : <span className="text-destructive">{PATH}</span></div>
        <div className="text-muted-foreground">↑ senza virgolette, Windows lo spezza agli spazi</div>
        <div className="mt-3 text-gold-soft">Ordine di ricerca:</div>
        <div>1. C:\Program.exe</div>
        <div>2. C:\Program Files\Vulnerable.exe</div>
        <div>3. C:\Program Files\Vulnerable App\service.exe (vero)</div>
      </div>

      <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-2">
        {CANDIDATES.map((c, i) => (
          <button key={i} onClick={() => { setPick(i); setChecked(false); }} className={cn("min-w-0 rounded-md border p-3 text-left transition", pick === i ? "border-accent bg-accent/10" : "border-border bg-surface hover:border-accent/50")}>
            <div className="font-mono text-sm text-foreground">{c.name}</div>
            <div className="mt-1 break-all font-mono text-[11px] text-muted-foreground">in {c.dir}</div>
            {checked && pick === i && <div className={cn("mt-2 text-xs", c.ok ? "text-success" : "text-destructive")}>{c.why}</div>}
          </button>
        ))}
      </div>

      <Button className="mt-4 w-full" disabled={pick === null} onClick={() => setChecked(true)}>Piazza il file e riavvia il servizio</Button>

      {!checked && <InfoNote>Devi far vincere Windows alla prima tappa: crea l'eseguibile che intercetta la prima ricerca.</InfoNote>}
      {checked && !correct && <WarnNote>Non ancora. Il file deve chiamarsi come il primo pezzo con spazio, e stare dove puoi scrivere.</WarnNote>}
      {isComplete && <SuccessNote>C:\Program.exe piazzato: al prossimo start del servizio, Windows lo lancia come SYSTEM.</SuccessNote>}
    </div>
  );
}
