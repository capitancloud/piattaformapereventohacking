import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const CORRECT = [
  { id: "s1", text: "Verifica che nel BIOS/UEFI sia abilitata la virtualizzazione (VT-x o AMD-V)" },
  { id: "s2", text: "Scarica VirtualBox dal sito ufficiale virtualbox.org" },
  { id: "s3", text: "Avvia l'installer e lascia le impostazioni predefinite" },
  { id: "s4", text: "Installa anche l'Extension Pack per USB e schede di rete avanzate" },
  { id: "s5", text: "Riavvia il PC e apri VirtualBox: dovresti vedere una finestra vuota, pronta ad ospitare le VM" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i] as T; a[i] = a[j] as T; a[j] = tmp;
  }
  return a;
}

export default function Task05Virt({ markComplete, isComplete }: TaskContext) {
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
      <p className="mb-3 text-sm text-muted-foreground">Rimetti in ordine i passi per installare VirtualBox.</p>
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
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/20 font-mono text-xs text-accent">{i + 1}</span>
              <p className="min-w-0 flex-1 text-sm text-foreground">{s.text}</p>
              <div className="flex flex-col gap-1">
                <button onClick={() => move(i, -1)} className="rounded-md border border-border p-1 text-muted-foreground hover:border-accent/60"><ArrowDown className="h-3 w-3 rotate-180" /></button>
                <button onClick={() => move(i, 1)} className="rounded-md border border-border p-1 text-muted-foreground hover:border-accent/60"><ArrowDown className="h-3 w-3" /></button>
              </div>
            </div>
          );
        })}
      </div>

      <Button className="mt-4 w-full" onClick={() => { setChecked(true); if (correct) markComplete(); }}>
        Verifica l'ordine
      </Button>

      {!checked && <InfoNote>Se VT-x non è abilitato nel BIOS, VirtualBox parte lo stesso ma le VM 64 bit non si avviano.</InfoNote>}
      {checked && !correct && <WarnNote>Ordine sbagliato. Ricorda: si parte dal BIOS, poi si scarica, poi si installa, poi si riavvia.</WarnNote>}
      {isComplete && <SuccessNote>Virtualizzatore pronto. Ora ci mettiamo dentro la prima macchina: Kali Linux.</SuccessNote>}
    </div>
  );
}
