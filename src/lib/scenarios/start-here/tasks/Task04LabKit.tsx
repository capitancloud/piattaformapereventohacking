import { useState } from "react";
import { Check, X, Cpu, HardDrive, MemoryStick, Wifi, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const ITEMS = [
  { id: "cpu", icon: Cpu, name: "CPU con virtualizzazione (VT-x / AMD-V)", need: true, why: "Serve per far girare macchine virtuali in modo veloce. Si attiva dal BIOS/UEFI." },
  { id: "ram", icon: MemoryStick, name: "Almeno 8 GB di RAM (16 consigliati)", need: true, why: "Ogni VM ne consuma 2-4 GB. Con meno di 8 GB il laboratorio va lento." },
  { id: "disk", icon: HardDrive, name: "40-80 GB liberi su disco", need: true, why: "Kali, Windows, Docker e i target occupano parecchio spazio." },
  { id: "iso", icon: HardDrive, name: "Le ISO ufficiali (Kali, Windows Eval)", need: true, why: "Scarica sempre dai siti ufficiali e verifica gli hash." },
  { id: "vm", icon: ShieldCheck, name: "Un virtualizzatore (VirtualBox o VMware)", need: true, why: "È il «palazzo» dove vivono le tue macchine virtuali isolate dal PC vero." },
  { id: "root", icon: X, name: "Il permesso di root sul PC di lavoro dell'azienda cliente", need: false, why: "Non serve a nulla per il lab. E toccare il PC del cliente senza contratto è illegale." },
  { id: "0day", icon: X, name: "Un exploit 0-day comprato online", need: false, why: "Per imparare bastano CVE note e macchine volutamente vulnerabili." },
  { id: "wifi", icon: Wifi, name: "La password Wi-Fi del vicino", need: false, why: "Non c'entra nulla con il tuo laboratorio e comunque non puoi usarla." },
];

export default function Task04LabKit({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState(false);

  const toggle = (id: string) => { setChecked(false); setPicked((p) => ({ ...p, [id]: !p[id] })); };
  const correct = ITEMS.every((it) => !!picked[it.id] === it.need);
  const score = ITEMS.filter((it) => !!picked[it.id] === it.need).length;

  return (
    <div>
      <p className="mb-3 text-sm text-muted-foreground">Attiva solo ciò che serve davvero al tuo laboratorio.</p>
      <div className="grid min-w-0 gap-2 sm:grid-cols-2">
        {ITEMS.map((it) => {
          const active = !!picked[it.id];
          const right = checked && active === it.need;
          const wrong = checked && active !== it.need;
          return (
            <button
              key={it.id}
              onClick={() => toggle(it.id)}
              className={cn(
                "flex min-w-0 items-start gap-3 rounded-xl border p-3 text-left transition",
                active ? "border-accent bg-accent/10" : "border-border bg-surface hover:border-accent/40",
                right && "border-success/60",
                wrong && "border-destructive/60",
              )}
            >
              <it.icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">{it.name}</p>
                {checked && <p className={cn("mt-1 text-xs leading-snug", right ? "text-muted-foreground" : "text-destructive")}>{it.why}</p>}
              </div>
              <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border", active ? "border-accent bg-accent text-primary-foreground" : "border-border")}>
                {active && <Check className="h-3 w-3" />}
              </span>
            </button>
          );
        })}
      </div>

      <Button className="mt-4 w-full" onClick={() => { setChecked(true); if (correct) markComplete(); }}>
        Verifica la lista
      </Button>

      {!checked && <InfoNote>Un buon laboratorio è isolato dal resto del mondo: sbagliare deve costare zero.</InfoNote>}
      {checked && !correct && <WarnNote>{score} su {ITEMS.length}. Le voci sbagliate ti dicono perché non servono.</WarnNote>}
      {isComplete && <SuccessNote>Ottimo. Ora installiamo il primo pezzo: il virtualizzatore.</SuccessNote>}
    </div>
  );
}
