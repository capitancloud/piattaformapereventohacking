import { useState } from "react";
import { Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";
const LINES=[
 {n:1,code:"import boto3",secret:false},
 {n:2,code:"AWS_ACCESS_KEY_ID = 'AKIA...EXAMPLE'",secret:true},
 {n:3,code:"AWS_SECRET_ACCESS_KEY = 'wJalr...EXAMPLE'",secret:true},
 {n:4,code:"bucket = 'report-azienda'",secret:false},
 {n:5,code:"print('Connessione avviata')",secret:false},
];
export default function Task07Secrets({markComplete,isComplete}:TaskContext){const [selected,setSelected]=useState<number[]>([]);const [moved,setMoved]=useState(false);const exact=LINES.every(l=>selected.includes(l.n)===l.secret);const transfer=()=>{if(exact){setMoved(true);markComplete();}};return <div><div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_240px]"><div className="min-w-0 overflow-hidden rounded-lg border border-border bg-background"><div className="border-b border-border bg-surface px-4 py-2 font-mono text-xs text-muted-foreground">deploy.py</div>{LINES.map(l=><Button key={l.n} variant="ghost" onClick={()=>setSelected(s=>s.includes(l.n)?s.filter(n=>n!==l.n):[...s,l.n])} className={cn("grid h-auto w-full grid-cols-[32px_minmax(0,1fr)] justify-start rounded-none border-b border-border px-3 py-2 text-left font-mono text-xs last:border-0",selected.includes(l.n)&&"bg-destructive/10 text-destructive")}><span className="text-muted-foreground">{l.n}</span><span className="min-w-0 whitespace-normal break-all">{moved&&l.secret?"•••• letto da Secrets Manager":l.code}</span></Button>)}</div><aside className="rounded-lg border border-border bg-surface p-4"><KeyRound className="mb-3 text-accent"/><p className="text-sm font-semibold">Secrets Manager</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">Seleziona nel codice le credenziali che non devono essere salvate nel repository.</p><Button className="mt-4 w-full" disabled={selected.length===0||moved} onClick={transfer}>{moved?<ShieldCheck/>:<Eye/>}{moved?"Segreto protetto":"Sposta segreti"}</Button>{selected.length>0&&!exact&&!moved&&<p className="mt-3 text-xs text-destructive"><EyeOff className="mr-1 inline h-3 w-3"/>La selezione contiene dati normali o lascia una chiave nel codice.</p>}</aside></div>{isComplete?<SuccessNote>Le credenziali non sono più nel codice. L'applicazione le recupera al momento dell'uso e può ricevere accesso tramite un ruolo AWS.</SuccessNote>:<InfoNote>Una chiave pubblicata nella cronologia del repository resta recuperabile anche dopo aver cancellato la riga: va revocata e sostituita.</InfoNote>}</div>}
