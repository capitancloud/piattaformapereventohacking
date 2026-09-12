import { useState } from "react";
import { Monitor, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const MODES = [
  { id: "nat", name: "NAT", desc: "Ogni VM ha una sua rete privata e naviga su Internet, ma non vede le altre VM." },
  { id: "hostonly", name: "Host-only", desc: "Le VM parlano solo tra loro e con il PC ospite. Nessun accesso a Internet." },
  { id: "internal", name: "NAT Network / Internal", desc: "Le VM condividono la stessa rete privata: si vedono tra loro e possono uscire su Internet." },
  { id: "bridge", name: "Bridge", desc: "La VM entra nella rete di casa come se fosse un computer fisico." },
];

const CASES = [
  { text: "Voglio che Kali e Windows si vedano tra loro E abbiano Internet per aggiornarsi", answer: "internal" },
  { text: "Voglio isolare completamente le due VM da Internet e farle parlare solo tra loro", answer: "hostonly" },
  { text: "Ho una sola VM e mi basta che navighi su Internet, senza vedere niente della LAN", answer: "nat" },
  { text: "Voglio che la VM prenda un IP dal router di casa come se fosse un vero PC", answer: "bridge" },
];

export default function Task07Windows({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const all = CASES.every((_, i) => picked[i]);
  const score = CASES.filter((c, i) => picked[i] === c.answer).length;

  return (
    <div className="space-y-4">
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <Monitor className="h-5 w-5 text-accent" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Windows 10/11 Evaluation</p>
            <p className="text-xs text-muted-foreground">Scaricabile gratis dal sito Microsoft, dura 90 giorni ed è perfetto come bersaglio.</p>
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-border bg-surface p-4">
          <Network className="h-5 w-5 text-accent" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">Il ponte tra le VM</p>
            <p className="text-xs text-muted-foreground">Scegli la modalità di rete giusta e le due macchine potranno pingarsi.</p>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-2 sm:grid-cols-2">
        {MODES.map((m) => (
          <div key={m.id} className="rounded-xl border border-border bg-surface/60 p-3">
            <p className="text-sm font-semibold text-foreground">{m.name}</p>
            <p className="text-xs leading-snug text-muted-foreground">{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {CASES.map((c, i) => {
          const value = picked[i];
          const right = checked && value === c.answer;
          const wrong = checked && value && value !== c.answer;
          return (
            <div key={i} className={cn("rounded-xl border border-border bg-surface p-4", right && "border-success/60", wrong && "border-destructive/60")}>
              <p className="mb-3 text-sm text-foreground">{c.text}</p>
              <div className="flex flex-wrap gap-2">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setChecked(false); setPicked((p) => ({ ...p, [i]: m.id })); }}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs transition active:scale-95",
                      value === m.id ? "border-accent bg-accent/15 text-foreground" : "border-border bg-background text-muted-foreground hover:border-accent/50",
                    )}
                  >
                    {m.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Button className="w-full" disabled={!all} onClick={() => { setChecked(true); if (score === CASES.length) markComplete(); }}>
        Verifica le scelte di rete
      </Button>

      {!checked && <InfoNote>La modalità di rete della VM decide cosa può vedere e cosa no. Sbagliarla è il motivo più comune per cui «non si pingano».</InfoNote>}
      {checked && score < CASES.length && <WarnNote>{score} su {CASES.length}. Le combinazioni giuste dipendono da cosa vuoi che sia visibile.</WarnNote>}
      {isComplete && <SuccessNote>Kali e Windows possono parlarsi. Il tuo primo mini-laboratorio di attacco/difesa è pronto.</SuccessNote>}
    </div>
  );
}
