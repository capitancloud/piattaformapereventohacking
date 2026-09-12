import { useState } from "react";
import { FileText, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const TOKENS=["site:aurora.example","filetype:pdf","report","password"];
const SAFE=["site:aurora.example","filetype:pdf","report"];
export default function Task07Search({markComplete,isComplete}:TaskContext){const [query,setQuery]=useState<string[]>([]);const [searched,setSearched]=useState(false);const add=(t:string)=>{setSearched(false);setQuery(q=>q.includes(t)?q:[...q,t])};const good=SAFE.every(x=>query.includes(x))&&!query.includes("password");return <div>
 <section className="rounded-lg border border-border bg-surface p-5"><div className="flex min-w-0 items-center gap-2 rounded-full border border-accent/40 bg-background px-4 py-3"><Search className="shrink-0 text-accent"/><div className="flex min-w-0 flex-1 flex-wrap gap-1">{query.length?query.map(t=><Button key={t} size="sm" variant="secondary" onClick={()=>setQuery(q=>q.filter(x=>x!==t))} className="h-7 max-w-full"><span className="truncate">{t}</span><X/></Button>):<span className="text-sm text-muted-foreground">Costruisci una ricerca mirata…</span>}</div></div>
 <div className="mt-4 flex flex-wrap gap-2">{TOKENS.map(t=><Button key={t} size="sm" variant={query.includes(t)?"default":"outline"} onClick={()=>add(t)}>{t}</Button>)}</div>
 <Button className="mt-5 w-full" disabled={query.length===0} onClick={()=>{setSearched(true);if(good)markComplete();}}>Esegui la ricerca simulata</Button>
 {searched&&good&&<div className="mt-4 animate-in fade-in rounded-lg border border-border bg-background p-4"><div className="flex gap-3"><FileText className="text-accent"/><div><p className="text-sm font-semibold">Rapporto annuale 2025.pdf</p><p className="mt-1 text-xs text-muted-foreground">Documento pubblico sul dominio autorizzato · risultato pertinente</p></div></div></div>}</section>
 {searched&&!good&&<WarnNote>Limita la ricerca al dominio, a un tipo di file e a un argomento legittimo. Cercare credenziali non è necessario per questo obiettivo.</WarnNote>}{isComplete&&<SuccessNote>Hai creato una query precisa che riduce il rumore e resta coerente con una ricerca documentale autorizzata.</SuccessNote>}
 </div>}