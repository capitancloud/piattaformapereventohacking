import { useState } from "react";
import { CalendarDays, ScanSearch, ServerCog, UserRoundX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const FIELDS = [
  { id:"registrar", label:"Registrar", value:"Example Registrar Ltd.", detail:"Società che gestisce la registrazione", icon:ScanSearch },
  { id:"privacy", label:"Contatto", value:"Privacy service enabled", detail:"Il proprietario reale non è esposto", icon:UserRoundX },
  { id:"dates", label:"Date", value:"Creato 2022 · Scade 2027", detail:"Le date aiutano a capire la storia del dominio", icon:CalendarDays },
  { id:"ns", label:"Nameserver", value:"ns1.dns-provider.example", detail:"Indizio sul fornitore DNS utilizzato", icon:ServerCog },
];
export default function Task04Whois({markComplete,isComplete}:TaskContext){const [found,setFound]=useState<string[]>([]);const reveal=(id:string)=>{setFound(o=>o.includes(id)?o:[...o,id]);if(!found.includes(id)&&found.length===FIELDS.length-1)markComplete()};return <div>
  <section className="overflow-hidden rounded-lg border border-border bg-surface">
    <header className="flex items-center gap-3 border-b border-border p-4"><ScanSearch className="animate-pulse text-accent"/><div><p className="font-mono text-xs text-accent">WHOIS · aurora.example</p><p className="text-xs text-muted-foreground">Seleziona i campi evidenziabili</p></div></header>
    <div className="relative grid gap-3 p-5 sm:grid-cols-2">{FIELDS.map(f=>{const Icon=f.icon;const on=found.includes(f.id);return <Button key={f.id} variant="ghost" onClick={()=>reveal(f.id)} className={cn("h-auto min-h-28 justify-start whitespace-normal border border-dashed border-border p-4 text-left",on&&"border-solid border-accent bg-accent/10")}><Icon className="text-accent"/><span><small className="block uppercase tracking-widest text-muted-foreground">{f.label}</small><strong className={cn("mt-1 block break-words",!on&&"blur-sm")}>{on?f.value:"Dato da mettere a fuoco"}</strong>{on&&<small className="mt-2 block font-normal text-muted-foreground">{f.detail}</small>}</span></Button>})}</div>
    <div className="border-t border-border px-5 py-3 text-xs text-muted-foreground">Dettagli messi a fuoco: <span className="font-mono text-accent">{found.length}/4</span></div>
  </section>{isComplete&&<SuccessNote>Hai estratto dati amministrativi utili senza confondere la privacy del registrante con un'anomalia.</SuccessNote>}
  </div>}