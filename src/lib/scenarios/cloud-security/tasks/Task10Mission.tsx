import { useState } from "react";
import { Cloud, Database, KeyRound, Network, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";
const CONTROLS=[
 {id:"mfa",label:"Attiva MFA per l'amministratore",icon:KeyRound},
 {id:"s3",label:"Blocca l'accesso pubblico al bucket",icon:Database},
 {id:"sg",label:"Limita il database al Security Group dell'app",icon:Network},
 {id:"trail",label:"Proteggi e mantieni attivo CloudTrail",icon:Cloud},
 {id:"keys",label:"Revoca la vecchia chiave non utilizzata",icon:ShieldCheck},
];
export default function Task10Mission({markComplete,isComplete}:TaskContext){const [active,setActive]=useState<string[]>([]);const [attempted,setAttempted]=useState(false);const ready=active.length===CONTROLS.length;const toggle=(id:string)=>{setAttempted(false);setActive(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id])};return <div><div className="overflow-hidden rounded-lg border border-border bg-surface"><div className="border-b border-border p-4"><p className="font-semibold">Account AWS: progetto Aurora</p><p className="mt-1 text-xs text-muted-foreground">Stato iniziale: cinque controlli essenziali richiedono attenzione</p></div><div className="grid gap-3 p-4 sm:grid-cols-2">{CONTROLS.map((c,i)=>{const Icon=c.icon;const on=active.includes(c.id);return <Button key={c.id} variant="outline" onClick={()=>toggle(c.id)} className={cn("h-auto min-h-28 flex-col whitespace-normal p-4 text-center transition",on&&"border-success bg-success/10 text-success")}><Icon className={cn("mb-2 h-6 w-6",on&&"animate-pulse")}/><span>{c.label}</span><span className="mt-2 font-mono text-[10px]">{on?"PROTETTO":"DA SISTEMARE"}</span></Button>})}</div><div className="border-t border-border p-4"><div className="mb-3 flex items-center justify-between text-xs"><span className="text-muted-foreground">Copertura controlli</span><span className="font-mono text-accent">{active.length}/5</span></div><div className="grid grid-cols-5 gap-1">{CONTROLS.map(c=><span key={c.id} className={cn("h-2 rounded-full bg-border transition-colors",active.includes(c.id)&&"bg-success")}/>)}</div><Button className="mt-4 w-full" onClick={()=>{setAttempted(true);if(ready)markComplete();}}>Avvia verifica finale</Button></div></div>{attempted&&!ready&&<WarnNote>La verifica trova ancora {CONTROLS.length-active.length} controlli mancanti. Completa la protezione prima di aprire il servizio.</WarnNote>}{isComplete&&<SuccessNote>Missione completata. Hai protetto identità, dati, rete, tracciamento e credenziali: cinque livelli diversi che lavorano insieme.</SuccessNote>}</div>}
