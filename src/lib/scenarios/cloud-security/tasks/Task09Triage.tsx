import { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";
const FINDINGS=[
 {id:"root",title:"Chiavi di accesso dell'utente root attive",severity:"Critica",answer:"Subito",why:"L'utente root ha controllo completo e non dovrebbe usare chiavi permanenti."},
 {id:"s3",title:"Bucket con informazioni clienti pubblico",severity:"Alta",answer:"Subito",why:"I dati sono esposti: prima si blocca l'accesso, poi si indaga."},
 {id:"old",title:"Istanza di test spenta da 40 giorni",severity:"Bassa",answer:"Pianifica",why:"È un tema di inventario e costo, non un'emergenza attiva."},
 {id:"mfa",title:"MFA assente su amministratore",severity:"Alta",answer:"Subito",why:"Un account potente protetto da una sola password richiede intervento rapido."},
];
const OPTIONS=["Subito","Pianifica","Ignora"];
export default function Task09Triage({markComplete,isComplete}:TaskContext){const [answers,setAnswers]=useState<Record<string,string>>({});const [checked,setChecked]=useState(false);const good=FINDINGS.every(f=>answers[f.id]===f.answer);return <div><div className="grid gap-3">{FINDINGS.map(f=><article key={f.id} className="rounded-lg border border-border bg-surface p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0"><span className={cn("text-xs font-semibold uppercase tracking-widest",f.severity==="Critica"||f.severity==="Alta"?"text-destructive":"text-muted-foreground")}>{f.severity}</span><p className="mt-1 text-sm font-semibold">{f.title}</p></div><div className="flex flex-wrap gap-2">{OPTIONS.map(o=><Button key={o} size="sm" variant={answers[f.id]===o?"default":"outline"} onClick={()=>{setChecked(false);setAnswers(a=>({...a,[f.id]:o}));}}>{o==="Subito"?<AlertTriangle/>:o==="Pianifica"?<Clock3/>:<CheckCircle2/>}{o}</Button>)}</div></div>{checked&&<p className={cn("mt-3 text-xs leading-relaxed",answers[f.id]===f.answer?"text-success":"text-destructive")}>{f.why}</p>}</article>)}</div><Button className="mt-4" disabled={Object.keys(answers).length<FINDINGS.length} onClick={()=>{setChecked(true);if(good)markComplete();}}>Chiudi il triage</Button>{isComplete?<SuccessNote>Hai dato precedenza a identità potenti e dati esposti, lasciando una risorsa spenta nella coda pianificata.</SuccessNote>:<InfoNote>La gravità tecnica non basta: nel triage contano esposizione, valore dei dati, privilegi e possibilità che il problema sia già sfruttato.</InfoNote>}</div>}
