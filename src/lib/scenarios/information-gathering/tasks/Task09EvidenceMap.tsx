import { useState } from "react";
import { Building2, Check, Cloud, Link2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const EDGES=[
 {id:"mx",from:"aurora.example",to:"mail.aurora.example",proof:"Record MX",confidence:"Alta"},
 {id:"api",from:"Certificato TLS",to:"api.aurora.example",proof:"Nome SAN",confidence:"Alta"},
 {id:"cloud",from:"Offerta di lavoro",to:"Possibile uso cloud",proof:"Testo pubblico",confidence:"Media"},
];
export default function Task09EvidenceMap({markComplete,isComplete}:TaskContext){const [linked,setLinked]=useState<string[]>([]);const [claim,setClaim]=useState<""|"careful"|"certain">("");const ready=linked.length===EDGES.length&&claim==="careful";return <div>
 <section className="rounded-lg border border-border bg-surface p-5"><div className="mb-5 flex items-center gap-2"><Link2 className="text-accent"/><p className="font-display text-xl">Lavagna degli indizi</p></div><div className="grid gap-3">{EDGES.map((e,i)=><Button key={e.id} variant="outline" onClick={()=>setLinked(a=>a.includes(e.id)?a:[...a,e.id])} className={cn("grid h-auto min-h-20 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] whitespace-normal p-3 text-left",linked.includes(e.id)&&"border-accent bg-accent/5")}><span className="min-w-0 break-words text-sm">{i===0?<Building2 className="mb-1 text-accent"/>:i===1?<Mail className="mb-1 text-accent"/>:<Cloud className="mb-1 text-accent"/>}{e.from}</span><span className="flex flex-col items-center text-accent"><Link2/><small>{linked.includes(e.id)?e.confidence:"collega"}</small></span><span className="min-w-0 break-words text-right text-sm">{e.to}<small className="block font-normal text-muted-foreground">{linked.includes(e.id)&&e.proof}</small></span></Button>)}</div>
 <div className="mt-5 grid gap-2 sm:grid-cols-2"><Button variant={claim==="careful"?"default":"outline"} className="h-auto whitespace-normal py-3" onClick={()=>setClaim("careful")}>L'organizzazione potrebbe usare un servizio cloud</Button><Button variant={claim==="certain"?"destructive":"outline"} className="h-auto whitespace-normal py-3" onClick={()=>setClaim("certain")}>L'intera infrastruttura è certamente nel cloud</Button></div><Button className="mt-4 w-full" disabled={!ready} onClick={markComplete}><Check/>Consolida la mappa</Button></section>
 {claim==="certain"&&<WarnNote>Un annuncio di lavoro è un indizio, non prova l'architettura completa. Riduci il livello di certezza.</WarnNote>}{isComplete&&<SuccessNote>La mappa separa fatti, fonti e ipotesi. Chi leggerà il rapporto potrà capire quanto è solida ogni relazione.</SuccessNote>}
 </div>}