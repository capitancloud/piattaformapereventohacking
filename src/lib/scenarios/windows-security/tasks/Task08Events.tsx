import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";
const EVENTS=[
 {id:1,time:"10:21:03",event:"4624",text:"Accesso riuscito — MARTA — console locale",suspicious:false},
 {id:2,time:"10:25:10",event:"4625",text:"Accesso non riuscito — ADMIN — 203.0.113.50",suspicious:true},
 {id:3,time:"10:25:11",event:"4625",text:"Accesso non riuscito — GUEST — 203.0.113.50",suspicious:true},
 {id:4,time:"10:25:12",event:"4625",text:"Accesso non riuscito — BACKUP — 203.0.113.50",suspicious:true},
 {id:5,time:"10:31:44",event:"4634",text:"Disconnessione — MARTA",suspicious:false},
];
export default function Task08Events({markComplete,isComplete}:TaskContext){const [selected,setSelected]=useState<number[]>([]);const [checked,setChecked]=useState(false);const correct=EVENTS.every((event)=>selected.includes(event.id)===event.suspicious);return <div><div className="overflow-hidden rounded-lg border border-border bg-background">{EVENTS.map((event)=><Button key={event.id} type="button" variant="ghost" disabled={checked} onClick={()=>setSelected((previous)=>previous.includes(event.id)?previous.filter((id)=>id!==event.id):[...previous,event.id])} className={cn("grid h-auto w-full grid-cols-[74px_48px_1fr] justify-start gap-3 rounded-none border-b border-border px-4 py-3 text-left font-mono text-xs last:border-0",selected.includes(event.id)&&"bg-accent/10",checked&&event.suspicious&&"bg-destructive/10 text-destructive")}><span className="text-muted-foreground">{event.time}</span><span className="text-accent">{event.event}</span><span className="min-w-0 whitespace-normal break-words">{event.text}</span></Button>)}</div><Button className="mt-4" disabled={selected.length===0} onClick={()=>{setChecked(true);if(correct)markComplete();}}>Analizza eventi</Button>{checked&&!correct&&<p className="mt-3 text-sm text-destructive">Cerca eventi 4625 molto ravvicinati, dallo stesso indirizzo e contro account diversi.</p>}{isComplete?<SuccessNote>Hai riconosciuto una sequenza compatibile con tentativi automatizzati. L'evento 4625 indica un accesso fallito; frequenza e contesto gli danno significato.</SuccessNote>:<InfoNote>Seleziona soltanto gli eventi che insieme costruiscono il comportamento anomalo. Un singolo errore di password può essere normale.</InfoNote>}</div>}
