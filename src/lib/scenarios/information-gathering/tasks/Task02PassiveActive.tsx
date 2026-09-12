import { useState } from "react";
import { Eye, RadioTower, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const STEPS = [
  { text: "Leggere il sito pubblico dell'organizzazione", answer: "passive" },
  { text: "Interrogare direttamente il DNS del dominio", answer: "active" },
  { text: "Consultare un archivio pubblico di certificati", answer: "passive" },
  { text: "Controllare la risposta del server web", answer: "active" },
  { text: "Esaminare annunci di lavoro già pubblicati", answer: "passive" },
] as const;

export default function Task02PassiveActive({ markComplete, isComplete }: TaskContext) {
  const [index, setIndex] = useState(0); const [mistake, setMistake] = useState(false); const current = STEPS[index];
  const choose = (kind: string) => { if (!current || current.answer !== kind) { setMistake(true); return; } setMistake(false); const next = index + 1; setIndex(next); if (next === STEPS.length) markComplete(); };
  return <div>
    <section className="relative overflow-hidden rounded-lg border border-border bg-surface p-5">
      <div className="absolute left-1/2 top-20 hidden h-px w-1/3 -translate-x-1/2 bg-accent/40 sm:block" />
      <div className="mb-5 flex items-center justify-between"><span className="font-mono text-xs text-accent">BIVIO {Math.min(index + 1, STEPS.length)}/{STEPS.length}</span><Shuffle className="text-muted-foreground"/></div>
      {current ? <>
        <div className="mx-auto max-w-md rounded-lg border border-accent/30 bg-background p-5 text-center shadow-lg shadow-primary/10"><p className="text-base leading-relaxed">{current.text}</p></div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-24 flex-col whitespace-normal" onClick={() => choose("passive")}><Eye/><span>Raccolta passiva</span><small className="font-normal text-muted-foreground">Osservo fonti esistenti</small></Button>
          <Button variant="outline" className="h-24 flex-col whitespace-normal" onClick={() => choose("active")}><RadioTower/><span>Raccolta attiva</span><small className="font-normal text-muted-foreground">Contatto il bersaglio</small></Button>
        </div>
      </> : <div className="grid min-h-52 place-items-center text-center"><div><Eye className="mx-auto h-10 w-10 animate-pulse text-success"/><p className="mt-3 font-display text-xl">Percorso completato</p></div></div>}
      <div className="mt-5 grid grid-cols-5 gap-2">{STEPS.map((_, i) => <span key={i} className={cn("h-1.5 rounded-full bg-border", i < index && "bg-success", i === index && "bg-accent")} />)}</div>
    </section>
    {mistake && <WarnNote>Questa azione usa una fonte diversa da quella scelta. Nota se genera una richiesta diretta verso l'infrastruttura.</WarnNote>}
    {isComplete && <SuccessNote>Sai distinguere osservazione passiva e contatto attivo: una differenza importante per rischio, tracciabilità e autorizzazione.</SuccessNote>}
  </div>;
}