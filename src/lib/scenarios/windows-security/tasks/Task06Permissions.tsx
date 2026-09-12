import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";
const ROWS=[
 {folder:"C:\\Condivisa\\Manuali",group:"Dipendenti",options:["Lettura","Modifica","Controllo completo"],answer:0},
 {folder:"C:\\Reparto\\Progetti",group:"Team progetto",options:["Nessun accesso","Modifica","Controllo completo"],answer:1},
 {folder:"C:\\Riservata\\Paghe",group:"Tutti",options:["Lettura","Modifica","Nessun accesso"],answer:2},
 {folder:"C:\\Riservata\\Paghe",group:"Ufficio HR",options:["Lettura","Modifica","Nessun accesso"],answer:1},
];
export default function Task06Permissions({markComplete,isComplete}:TaskContext){const [answers,setAnswers]=useState<(number|null)[]>(Array(ROWS.length).fill(null));const [checked,setChecked]=useState(false);const safe=ROWS.every((row,index)=>answers[index]===row.answer);return <div><div className="space-y-3">{ROWS.map((row,index)=><div key={`${row.folder}-${row.group}`} className="rounded-lg border border-border bg-surface p-4"><p className="break-all font-mono text-xs text-accent">{row.folder}</p><p className="mb-3 mt-1 text-sm text-foreground">Gruppo: {row.group}</p><div className="flex flex-wrap gap-2">{row.options.map((option,optionIndex)=><Button key={option} variant="outline" size="sm" onClick={()=>{setChecked(false);setAnswers((previous)=>previous.map((value,i)=>i===index?optionIndex:value));}} className={cn(answers[index]===optionIndex&&"border-accent bg-accent/15",checked&&optionIndex===row.answer&&"border-success bg-success/10 text-success")}>{option}</Button>)}</div></div>)}</div><Button className="mt-4" disabled={answers.some((answer)=>answer===null)} onClick={()=>{setChecked(true);if(safe)markComplete();}}>Applica permessi</Button>{checked&&!safe&&<p className="mt-3 text-sm text-destructive">Almeno un gruppo possiede più accesso del necessario o non può svolgere il proprio lavoro.</p>}{isComplete?<SuccessNote>Hai separato documenti comuni e dati riservati. “Controllo completo” non è la scelta predefinita: permette anche di cambiare i permessi.</SuccessNote>:<InfoNote>I permessi NTFS seguono il minimo privilegio. Lettura serve a consultare, Modifica anche a lavorare sui file, Controllo completo include la gestione dei permessi.</InfoNote>}</div>}
