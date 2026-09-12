import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";
const EVENTS=[
 {id:1,time:"09:12:01",text:"Accepted publickey for marco from 192.168.1.24",suspicious:false},
 {id:2,time:"09:14:10",text:"Failed password for anna from 203.0.113.44",suspicious:false},
 {id:3,time:"09:14:11",text:"Failed password for root from 203.0.113.44",suspicious:true},
 {id:4,time:"09:14:12",text:"Failed password for admin from 203.0.113.44",suspicious:true},
 {id:5,time:"09:14:13",text:"Failed password for test from 203.0.113.44",suspicious:true},
 {id:6,time:"09:18:32",text:"session closed for user marco",suspicious:false},
];
export default function Task07AuthLogs({markComplete,isComplete}:TaskContext){const [selected,setSelected]=useState<number[]>([]);const [checked,setChecked]=useState(false);const correct=EVENTS.every((e)=>selected.includes(e.id)===e.suspicious);return <div><div className="overflow-hidden rounded-lg border border-border bg-background font-mono text-xs">{EVENTS.map((event)=><button key={event.id} type="button" disabled={checked} onClick={()=>setSelected((p)=>p.includes(event.id)?p.filter((id)=>id!==event.id):[...p,event.id])} className={cn("flex w-full gap-3 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-surface",selected.includes(event.id)&&"bg-accent/10 text-foreground",checked&&event.suspicious&&"bg-destructive/10 text-destructive")}><span className="shrink-0 text-muted-foreground">{event.time}</span><span className="min-w-0 break-words">{event.text}</span></button>)}</div><Button type="button" className="mt-4" disabled={selected.length===0} onClick={()=>{setChecked(true);if(correct)markComplete();}}>Analizza selezione</Button>{checked&&!correct&&<p className="mt-3 text-sm text-destructive">Cerca più tentativi ravvicinati dallo stesso indirizzo e con nomi utente diversi.</p>}{isComplete?<SuccessNote>Hai riconosciuto una piccola sequenza di brute force. Un singolo errore può essere umano; molti tentativi rapidi e sistematici meritano attenzione.</SuccessNote>:<InfoNote>Seleziona soltanto le righe che, considerate insieme, formano il comportamento sospetto. L'orario e l'indirizzo sorgente sono indizi importanti.</InfoNote>}</div>}
