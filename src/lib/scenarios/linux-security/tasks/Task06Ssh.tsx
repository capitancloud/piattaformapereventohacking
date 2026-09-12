import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";
const SETTINGS = [
 { key: "root", label: "PermitRootLogin", safe: "no", values: ["yes", "no"] },
 { key: "password", label: "PasswordAuthentication", safe: "no", values: ["yes", "no"] },
 { key: "keys", label: "PubkeyAuthentication", safe: "yes", values: ["yes", "no"] },
 { key: "tries", label: "MaxAuthTries", safe: "3", values: ["3", "20"] },
];
export default function Task06Ssh({ markComplete, isComplete }: TaskContext) {
 const [config,setConfig]=useState<Record<string,string>>({}); const [checked,setChecked]=useState(false); const safe=SETTINGS.every((s)=>config[s.key]===s.safe);
 return <div><div className="overflow-hidden rounded-lg border border-border bg-background"><div className="flex items-center gap-2 border-b border-border bg-surface px-4 py-3 text-xs text-muted-foreground"><LockKeyhole className="h-4 w-4 text-accent"/><span className="font-mono">/etc/ssh/sshd_config</span></div><div className="space-y-4 p-4">{SETTINGS.map((setting)=><div key={setting.key} className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center"><span className="break-all font-mono text-sm text-foreground">{setting.label}</span><div className="flex gap-2">{setting.values.map((value)=><Button key={value} type="button" size="sm" variant="outline" disabled={checked} onClick={()=>setConfig((p)=>({...p,[setting.key]:value}))} className={cn(config[setting.key]===value&&"border-accent bg-accent/15",checked&&value===setting.safe&&"border-success bg-success/10 text-success")}>{value}</Button>)}</div></div>)}</div></div><Button type="button" className="mt-4" disabled={Object.keys(config).length<SETTINGS.length} onClick={()=>{setChecked(true);if(safe)markComplete();}}>Verifica configurazione</Button>{checked&&!safe&&<p className="mt-3 text-sm text-destructive">La configurazione lascia ancora un metodo di accesso troppo permissivo.</p>}{isComplete?<SuccessNote>SSH ora preferisce le chiavi, impedisce l'accesso diretto come root e limita i tentativi. Ricorda di testare una seconda sessione prima di chiudere quella attiva.</SuccessNote>:<InfoNote>Le chiavi sono più resistenti agli attacchi a tentativi rispetto alle password. Prima di disabilitare le password, bisogna verificare che la propria chiave funzioni.</InfoNote>}</div>;
}
