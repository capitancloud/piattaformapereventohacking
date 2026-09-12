import { useState } from "react";
import { GripVertical, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const CORRECT = [
  { id: "recon", name: "Ricognizione", desc: "Raccogli informazioni pubbliche sul bersaglio senza toccarlo." },
  { id: "scan", name: "Scansione", desc: "Individui host attivi, porte aperte, servizi in ascolto." },
  { id: "enum", name: "Enumerazione", desc: "Interroghi i servizi per estrarre utenti, versioni, condivisioni." },
  { id: "exploit", name: "Exploitation", desc: "Sfrutti una debolezza per ottenere accesso o esecuzione di codice." },
  { id: "post", name: "Post-exploitation", desc: "Esplori dentro il bersaglio: privilegi, credenziali, movimenti." },
  { id: "report", name: "Report", desc: "Documenti tutto e consegni le raccomandazioni al cliente." },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i] as T; a[i] = a[j] as T; a[j] = tmp;
  }
  return a;
}

export default function Task03Phases({ markComplete, isComplete }: TaskContext) {
  const [order, setOrder] = useState(() => shuffle(CORRECT));
  const [checked, setChecked] = useState(false);

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    const a = [...order];
    const tmp = a[i]!; a[i] = a[j]!; a[j] = tmp;
    setOrder(a);
    setChecked(false);
  };

  const correct = order.every((s, i) => s.id === CORRECT[i]!.id);

  return (
    <div>
      <div className="space-y-2">
        {order.map((s, i) => {
          const right = checked && s.id === CORRECT[i]!.id;
          const wrong = checked && s.id !== CORRECT[i]!.id;
          return (
            <div key={s.id} className={cn(
              "flex min-w-0 items-center gap-3 rounded-xl border border-border bg-surface p-3",
              right && "border-success/60",
              wrong && "border-destructive/60",
            )}>
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-primary/20 font-mono text-sm text-accent">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <p className="text-xs leading-snug text-muted-foreground">{s.desc}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => move(i, -1)} className="rounded-md border border-border p-1 text-muted-foreground hover:border-accent/60"><ArrowDown className="h-3 w-3 rotate-180" /></button>
                <button onClick={() => move(i, 1)} className="rounded-md border border-border p-1 text-muted-foreground hover:border-accent/60"><ArrowDown className="h-3 w-3" /></button>
              </div>
              <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" />
            </div>
          );
        })}
      </div>

      <Button className="mt-4 w-full" onClick={() => { setChecked(true); if (correct) markComplete(); }}>
        Verifica l'ordine
      </Button>

      {!checked && <InfoNote>Le fasi sono una scaletta: ognuna prepara la successiva. Salterele significa lavorare al buio.</InfoNote>}
      {checked && !correct && <WarnNote>Non è l'ordine giusto. Ricorda: prima si osserva da lontano, poi ci si avvicina, poi si entra.</WarnNote>}
      {isComplete && <SuccessNote>Sequenza corretta. Ogni scenario di questa piattaforma cade dentro una di queste fasi.</SuccessNote>}
    </div>
  );
}
