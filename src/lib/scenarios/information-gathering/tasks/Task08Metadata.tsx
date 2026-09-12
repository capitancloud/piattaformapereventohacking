import { useState } from "react";
import { FileSearch, Fingerprint, MapPin, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const CARDS=[
 {id:"author",label:"Autore",value:"Elena R.",kind:"useful",icon:UserRound,note:"Utile: possibile convenzione dei nomi account"},
 {id:"software",label:"Software",value:"Office Suite 2024",kind:"normal",icon:FileSearch,note:"Contesto: non implica una falla"},
 {id:"path",label:"Percorso originale",value:"C:\\Users\\erossi\\Clienti\\",kind:"sensitive",icon:Fingerprint,note:"Cautela: espone username e struttura interna"},
 {id:"gps",label:"Posizione GPS",value:"Non presente",kind:"normal",icon:MapPin,note:"Dato assente: nessuna conclusione possibile"},
];
export default function Task08Metadata({markComplete,isComplete}:TaskContext){const [inspected,setInspected]=useState<string[]>([]);const inspect=(id:string)=>{const n=inspected.includes(id)?inspected:[...inspected,id];setInspected(n);if(n.length===CARDS.length)markComplete()};return <div>
 <section className="rounded-lg border border-border bg-surface p-5"><div className="mb-5 flex items-center gap-3"><div className="grid h-14 w-12 place-items-center rounded-md bg-primary/20"><FileSearch className="text-accent"/></div><div><p className="font-semibold">Presentazione-Aurora.pdf</p><p className="text-xs text-muted-foreground">Scrivania di analisi · copia simulata</p></div></div>
 <div className="grid gap-3 sm:grid-cols-2">{CARDS.map(c=>{const Icon=c.icon;const on=inspected.includes(c.id);return <Button key={c.id} variant="outline" onClick={()=>inspect(c.id)} className={cn("h-auto min-h-32 flex-col items-start whitespace-normal p-4 text-left",on&&"border-accent bg-accent/5")}><Icon className="text-accent"/><small className="uppercase tracking-widest text-muted-foreground">{c.label}</small><strong className="break-all">{on?c.value:"Apri il cassetto"}</strong>{on&&<span className={cn("text-xs font-normal leading-relaxed",c.kind==="sensitive"?"text-destructive":"text-muted-foreground")}>{c.note}</span>}</Button>})}</div></section>
 {isComplete&&<SuccessNote>Hai letto i metadati con prudenza: alcuni creano piste utili, altri sono normali e quelli sensibili vanno protetti nel rapporto.</SuccessNote>}
 </div>}