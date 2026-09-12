import { Gauge, Power } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";
const APPS=[
 {id:"security",name:"Windows Security notification",publisher:"Microsoft Corporation",impact:"Basso",disable:false},
 {id:"vpn",name:"Contoso VPN",publisher:"Contoso S.p.A.",impact:"Medio",disable:false},
 {id:"coupon",name:"SuperCoupon Helper",publisher:"Sconosciuto",impact:"Alto",disable:true},
 {id:"teams",name:"Teams",publisher:"Microsoft Corporation",impact:"Alto",disable:true},
];
export default function Task07Startup({markComplete,isComplete}:TaskContext){const [disabled,setDisabled]=useState<string[]>([]);const [checked,setChecked]=useState(false);const correct=APPS.every((app)=>disabled.includes(app.id)===app.disable);return <div><div className="overflow-x-auto rounded-lg border border-border"><div className="min-w-[620px]"><div className="grid grid-cols-[1.4fr_1fr_80px_110px] gap-3 border-b border-border bg-surface px-4 py-3 font-mono text-xs text-muted-foreground"><span>Nome</span><span>Editore</span><span>Impatto</span><span>Stato</span></div>{APPS.map((app)=><div key={app.id} className="grid grid-cols-[1.4fr_1fr_80px_110px] items-center gap-3 border-b border-border px-4 py-3 text-sm last:border-0"><span className="font-medium">{app.name}</span><span className="text-xs text-muted-foreground">{app.publisher}</span><span className={cn("text-xs",app.impact==="Alto"&&"text-accent")}>{app.impact}</span><Button size="sm" variant="outline" onClick={()=>{setChecked(false);setDisabled((previous)=>previous.includes(app.id)?previous.filter((id)=>id!==app.id):[...previous,app.id]);}}>{disabled.includes(app.id)?<><Power/>Disattivato</>:<><Gauge/>Attivo</>}</Button></div>)}</div></div><Button className="mt-4" onClick={()=>{setChecked(true);if(correct)markComplete();}}>Valuta avvio</Button>{checked&&!correct&&<p className="mt-3 text-sm text-destructive">Mantieni le protezioni e il collegamento necessario. Disattiva ciò che è sconosciuto o non deve partire automaticamente.</p>}{isComplete?<SuccessNote>Hai rimosso un elemento sconosciuto e un'app non essenziale dall'avvio, lasciando attive sicurezza e VPN. Disattivare dall'avvio non disinstalla il programma.</SuccessNote>:<InfoNote>Un impatto alto rallenta l'accesso, ma non dimostra che un'app sia pericolosa. Considera insieme necessità, editore, provenienza e comportamento.</InfoNote>}</div>}
