import { useState } from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const CORRECT = [
  { id: "update", cmd: "sudo apt update", desc: "Aggiorna l'elenco dei pacchetti disponibili" },
  { id: "install", cmd: "sudo apt install -y docker.io", desc: "Installa Docker Engine dai repository" },
  { id: "enable", cmd: "sudo systemctl enable --now docker", desc: "Avvia il servizio e lo fa partire ad ogni boot" },
  { id: "group", cmd: "sudo usermod -aG docker $USER", desc: "Ti aggiunge al gruppo docker per non usare più sudo" },
  { id: "verify", cmd: "docker run hello-world", desc: "Scarica una piccola immagine di test e la esegue" },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i] as T; a[i] = a[j] as T; a[j] = tmp;
  }
  return a;
}

export default function Task08Docker({ markComplete, isComplete }: TaskContext) {
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
      <p className="mb-3 text-sm text-muted-foreground">Rimetti in ordine i comandi per installare Docker su Kali.</p>
      <div className="space-y-2">
        {order.map((s, i) => {
          const right = checked && s.id === CORRECT[i]!.id;
          const wrong = checked && s.id !== CORRECT[i]!.id;
          return (
            <div key={s.id} className={cn(
              "grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-surface p-3",
              right && "border-success/60",
              wrong && "border-destructive/60",
            )}>
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary/20 font-mono text-xs text-accent">{i + 1}</span>
              <div className="min-w-0">
                <code className="block min-w-0 break-all font-mono text-xs text-gold-soft">{s.cmd}</code>
                <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{s.desc}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={() => move(i, -1)} className="rounded-md border border-border p-1 text-muted-foreground hover:border-accent/60"><ArrowDown className="h-3 w-3 rotate-180" /></button>
                <button onClick={() => move(i, 1)} className="rounded-md border border-border p-1 text-muted-foreground hover:border-accent/60"><ArrowDown className="h-3 w-3" /></button>
              </div>
            </div>
          );
        })}
      </div>

      <Button className="mt-4 w-full" onClick={() => { setChecked(true); if (correct) markComplete(); }}>
        Verifica la procedura
      </Button>

      {!checked && <InfoNote>Docker è come un mini-virtualizzatore leggero: ogni «container» è un'app pronta all'uso, isolata dal sistema.</InfoNote>}
      {checked && !correct && <WarnNote>L'ordine non torna. Ricorda: prima si aggiorna, poi si installa, poi si avvia il servizio, poi si prova.</WarnNote>}
      {isComplete && <SuccessNote>Docker è pronto. Usiamolo per installare la prima app volutamente vulnerabile: DVWA.</SuccessNote>}
    </div>
  );
}
