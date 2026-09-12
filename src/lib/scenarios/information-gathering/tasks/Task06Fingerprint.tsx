import { useState } from "react";
import { Braces, Layers3, Server, ShieldQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const LAYERS=[
 {id:"header",label:"Intestazione HTTP",clue:"server: nginx",meaning:"Indizio sul server web",icon:Server},
 {id:"html",label:"Codice della pagina",clue:"data-reactroot",meaning:"Possibile interfaccia React",icon:Braces},
 {id:"cookie",label:"Cookie tecnico",clue:"session_route=app-02",meaning:"Possibile bilanciamento tra nodi",icon:Layers3},
];
export default function Task06Fingerprint({markComplete,isComplete}:TaskContext){const [open,setOpen]=useState<string[]>([]);const inspect=(id:string)=>{const next=open.includes(id)?open:[...open,id];setOpen(next);if(next.length===LAYERS.length)markComplete()};return <div>
 <section className="overflow-hidden rounded-lg border border-border bg-surface"><div className="border-b border-border bg-background px-4 py-3"><div className="mx-auto h-2 w-20 rounded-full bg-border"/><p className="mt-3 text-center font-mono text-xs text-muted-foreground">https://www.aurora.example</p></div>
 <div className="space-y-3 p-5">{LAYERS.map((l,i)=>{const Icon=l.icon;const on=open.includes(l.id);return <Button key={l.id} variant="outline" onClick={()=>inspect(l.id)} className={cn("h-auto w-full justify-start whitespace-normal p-4 text-left transition-all",on&&"translate-x-2 border-accent bg-accent/5")}><span className="font-mono text-xs text-muted-foreground">0{i+1}</span><Icon className="text-accent"/><span className="min-w-0"><strong className="block">{l.label}</strong>{on&&<><code className="mt-2 block break-all text-xs text-accent">{l.clue}</code><small className="mt-1 block font-normal text-muted-foreground">{l.meaning}</small></>}</span></Button>})}</div>
 </section>{isComplete?<SuccessNote>Hai composto un'impronta tecnologica usando più indizi. Le versioni e i prodotti rilevati vanno sempre confermati.</SuccessNote>:<InfoNote><ShieldQuestion className="mr-1 inline h-4 w-4"/>Un'intestazione può essere nascosta o modificata: registra “possibile”, non “certo”, finché le prove non concordano.</InfoNote>}
 </div>}