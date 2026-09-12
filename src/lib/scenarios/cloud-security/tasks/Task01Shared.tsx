import { useState } from "react";
import { Building2, UserRoundCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const ITEMS=[
 {id:"dc",label:"Edifici e hardware dei data center",owner:"aws"},
 {id:"patch",label:"Patch del sistema operativo su una istanza EC2",owner:"customer"},
 {id:"iam",label:"Permessi degli utenti IAM",owner:"customer"},
 {id:"network",label:"Infrastruttura fisica della rete AWS",owner:"aws"},
 {id:"data",label:"Classificazione e protezione dei dati caricati",owner:"customer"},
 {id:"hypervisor",label:"Hypervisor gestito dal cloud",owner:"aws"},
] as const;
export default function Task01Shared({markComplete,isComplete}:TaskContext){
 const [answers,setAnswers]=useState<Record<string,string>>({}); const [checked,setChecked]=useState(false);
 const correct=ITEMS.every(i=>answers[i.id]===i.owner);
 return <div><div className="grid gap-3 md:grid-cols-2">{ITEMS.map((item)=><div key={item.id} className="rounded-lg border border-border bg-surface p-4"><p className="min-h-12 text-sm leading-relaxed text-foreground">{item.label}</p><div className="mt-3 grid grid-cols-2 gap-2"><Button size="sm" variant={answers[item.id]==="aws"?"default":"outline"} onClick={()=>{setChecked(false);setAnswers(a=>({...a,[item.id]:"aws"}));}}><Building2/>AWS</Button><Button size="sm" variant={answers[item.id]==="customer"?"default":"outline"} onClick={()=>{setChecked(false);setAnswers(a=>({...a,[item.id]:"customer"}));}}><UserRoundCog/>Cliente</Button></div>{checked&&<div className={cn("mt-2 text-xs",answers[item.id]===item.owner?"text-success":"text-destructive")}>{answers[item.id]===item.owner?"Confine corretto":"Rivedi chi controlla direttamente questo elemento"}</div>}</div>)}</div><Button className="mt-4" disabled={Object.keys(answers).length<ITEMS.length} onClick={()=>{setChecked(true);if(correct)markComplete();}}>Verifica il confine</Button>{isComplete?<SuccessNote>AWS protegge l'infrastruttura del cloud; tu proteggi identità, configurazioni, sistemi e dati che metti nel cloud.</SuccessNote>:<InfoNote>Il modello è condiviso, non trasferito: usare AWS non significa delegare ogni decisione di sicurezza.</InfoNote>}</div>;
}
