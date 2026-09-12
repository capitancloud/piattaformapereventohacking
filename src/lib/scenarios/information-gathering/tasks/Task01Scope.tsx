import { useState } from "react";
import { CalendarClock, FileCheck2, Globe2, ShieldBan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { id: "domain", label: "*.aurora-lab.example", note: "Dominio autorizzato", icon: Globe2, valid: true },
  { id: "time", label: "Lun–Ven · 09:00–18:00", note: "Finestra concordata", icon: CalendarClock, valid: true },
  { id: "mail", label: "Caselle personali dei dipendenti", note: "Escluse dal test", icon: ShieldBan, valid: false },
  { id: "contact", label: "Referente: security@aurora.example", note: "Contatto per incidenti", icon: FileCheck2, valid: true },
];

export default function Task01Scope({ markComplete, isComplete }: TaskContext) {
  const [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const correct = OPTIONS.every((item) => selected.includes(item.id) === item.valid);
  const toggle = (id: string) => { setChecked(false); setSelected((old) => old.includes(id) ? old.filter((x) => x !== id) : [...old, id]); };
  return <div>
    <section className="overflow-hidden rounded-lg border border-border bg-surface">
      <header className="border-b border-border bg-primary/10 p-5">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Scheda di ingaggio · IG-001</p>
        <h3 className="mt-2 font-display text-xl">Costruisci il perimetro autorizzato</h3>
      </header>
      <div className="grid gap-3 p-4 sm:grid-cols-2">
        {OPTIONS.map((item) => { const Icon = item.icon; const on = selected.includes(item.id); return <Button key={item.id} variant="outline" onClick={() => toggle(item.id)} className={cn("h-auto min-h-28 flex-col items-start whitespace-normal p-4 text-left", on && "border-accent bg-accent/10") }>
          <Icon className="mb-3 text-accent"/><strong className="text-sm">{item.label}</strong><span className="mt-1 text-xs font-normal text-muted-foreground">{item.note}</span>
        </Button>; })}
      </div>
      <div className="border-t border-border p-4"><Button className="w-full" onClick={() => { setChecked(true); if (correct) markComplete(); }}>Firma il perimetro</Button></div>
    </section>
    {checked && !correct && <WarnNote>La scheda include ancora un'area vietata oppure manca un elemento necessario per lavorare in sicurezza.</WarnNote>}
    {isComplete && <SuccessNote>Il test ha ora confini, orari e un referente chiari. La raccolta può iniziare senza oltrepassare l'autorizzazione.</SuccessNote>}
  </div>;
}