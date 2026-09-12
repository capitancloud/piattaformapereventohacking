import { useState } from "react";
import { BookOpenCheck, CheckCircle2, Circle, Flag, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const PAGES=[
 {id:"scope",title:"Perimetro",choice:"Solo asset autorizzati",bad:"Qualunque dominio collegato"},
 {id:"proof",title:"Evidenze",choice:"Fonte, data e confidenza",bad:"Conclusioni senza fonte"},
 {id:"priority",title:"Priorità",choice:"Portale pubblico da verificare",bad:"Attaccare subito ogni host"},
 {id:"next",title:"Prossimo passo",choice:"Conferma controllata e concordata",bad:"Scansione aggressiva non approvata"},
];
export default function Task10Briefing({markComplete,isComplete}:TaskContext){const [answers,setAnswers]=useState<Record<string,string>>({});const [closed,setClosed]=useState(false);const ready=PAGES.every(p=>answers[p.id]===p.choice);return <div>
 <section className="overflow-hidden rounded-lg border border-border bg-surface"><header className="flex items-center justify-between border-b border-border bg-primary/10 p-5"><div><p className="font-mono text-xs text-accent">DOSSIER · INFORMATION GATHERING</p><h3 className="mt-1 font-display text-xl">Briefing al team di test</h3></div><BookOpenCheck className="h-8 w-8 text-accent"/></header>
 <div className="grid gap-4 p-5 sm:grid-cols-2">{PAGES.map((p,i)=><article key={p.id} className="rounded-lg border border-border bg-background p-4"><div className="mb-3 flex items-center justify-between"><span className="font-mono text-xs text-accent">0{i+1}</span><Flag className="text-muted-foreground"/></div><h4 className="font-semibold">{p.title}</h4><div className="mt-3 space-y-2">{[p.choice,p.bad].map(v=><Button key={v} variant="ghost" onClick={()=>{setClosed(false);setAnswers(a=>({...a,[p.id]:v}))}} className={cn("h-auto w-full justify-start whitespace-normal border border-border p-3 text-left text-xs",answers[p.id]===v&&"border-accent bg-accent/10")} >{answers[p.id]===v?<CheckCircle2/>:<Circle/>}{v}</Button>)}</div></article>)}</div>
 <div className="border-t border-border p-5"><Button className="w-full" disabled={Object.keys(answers).length<PAGES.length} onClick={()=>{setClosed(true);if(ready)markComplete();}}><ShieldCheck/>Consegna il briefing</Button></div></section>
 {closed&&!ready&&<WarnNote>Il dossier propone ancora un'azione non autorizzata o una conclusione priva di prove. Correggi il briefing.</WarnNote>}{isComplete&&<SuccessNote>Scenario completato. Hai trasformato dati pubblici in un inventario verificabile, rispettando perimetro, prudenza e qualità delle prove.</SuccessNote>}
 </div>}