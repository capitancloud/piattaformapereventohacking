import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";
const SERVICES = [
 { port: 22, name: "SSH", purpose: "Amministrazione remota richiesta", keep: true },
 { port: 80, name: "HTTP", purpose: "Sito pubblico richiesto", keep: true },
 { port: 21, name: "FTP", purpose: "Vecchio servizio non più usato", keep: false },
 { port: 23, name: "Telnet", purpose: "Accesso remoto non cifrato", keep: false },
 { port: 631, name: "CUPS", purpose: "Stampa non usata sul server", keep: false },
];
export default function Task04Services({ markComplete, isComplete }: TaskContext) { const [choices, setChoices] = useState<Record<number, boolean>>({}); const [checked, setChecked] = useState(false); const choose=(port:number,value:boolean)=>{setChecked(false);setChoices((p)=>({...p,[port]:value}));}; const good = SERVICES.every((s) => choices[s.port] === s.keep); return <div><div className="overflow-hidden rounded-lg border border-border bg-surface">{SERVICES.map((s) => <div key={s.port} className="grid gap-3 border-b border-border p-4 last:border-0 sm:grid-cols-[70px_1fr_auto] sm:items-center"><span className="font-mono text-accent">:{s.port}</span><div><div className="text-sm text-foreground">{s.name}</div><div className="text-xs text-muted-foreground">{s.purpose}</div></div><div className="flex gap-2"><Button type="button" size="sm" variant="outline" onClick={() => choose(s.port,true)} className={cn(choices[s.port] === true && "border-success bg-success/10")}>Mantieni</Button><Button type="button" size="sm" variant="outline" onClick={() => choose(s.port,false)} className={cn(choices[s.port] === false && "border-destructive bg-destructive/10")}>Disattiva</Button></div></div>)}</div><Button type="button" className="mt-4" disabled={Object.keys(choices).length < SERVICES.length} onClick={() => {setChecked(true); if(good) markComplete();}}>Applica decisioni</Button>{checked && !good && <p className="mt-3 text-sm text-destructive">Rivedi lo scopo del server: devono restare soltanto i servizi realmente necessari.</p>}{isComplete ? <SuccessNote>Hai ridotto la superficie di attacco: ogni servizio disattivato elimina una possibile porta d'ingresso e semplifica il controllo del sistema.</SuccessNote> : <InfoNote>Una porta aperta non è automaticamente pericolosa, ma ogni servizio deve avere uno scopo preciso, essere aggiornato e configurato correttamente.</InfoNote>}</div>; }
