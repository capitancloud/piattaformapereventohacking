import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const LEAKS = [
  { id: "os", text: "Il sistema operativo esatto: Linux server01 5.10.0", real: true },
  { id: "uptime", text: "Da quanto è acceso: 214 giorni senza riavvio", real: true },
  { id: "users", text: "I nomi degli utenti connessi: admin, backup-svc", real: true },
  { id: "passwords", text: "Le password degli utenti in chiaro", real: false },
  { id: "if", text: "Le interfacce di rete e i loro indirizzi interni", real: true },
  { id: "keys", text: "Le chiavi private SSH del server", real: false },
];

export default function Task08Snmp({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const toggle = (id: string) => {
    setChecked(false);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const real = LEAKS.filter((l) => l.real).map((l) => l.id);
  const good = picked.filter((id) => real.includes(id)).length;
  const bad = picked.filter((id) => !real.includes(id)).length;
  const solved = good === real.length && bad === 0;

  return (
    <div>
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-black font-mono text-xs shadow-2xl shadow-black/60">
        <div className="border-b border-border/60 bg-surface-2 px-3 py-2 text-[11px] text-muted-foreground">
          snmpwalk -v2c -c public 10.10.10.12
        </div>
        <div className="space-y-1.5 p-4">
          <p className="break-words"><span className="text-accent">sysDescr.0</span> <span className="text-ivory/90">= Linux server01 5.10.0-21-amd64 x86_64</span></p>
          <p className="break-words"><span className="text-accent">sysUpTime.0</span> <span className="text-ivory/90">= 214 giorni, 6:12:44</span></p>
          <p className="break-words"><span className="text-accent">hrSWRunName</span> <span className="text-ivory/90">= sshd, cron, postgres, backup-agent</span></p>
          <p className="break-words"><span className="text-accent">hrSystemUsers</span> <span className="text-ivory/90">= admin, backup-svc</span></p>
          <p className="break-words"><span className="text-accent">ipAddrTable</span> <span className="text-ivory/90">= eth0: 10.10.10.12, eth1: 192.168.50.4</span></p>
        </div>
      </div>

      <p className="mt-4 mb-3 text-sm text-muted-foreground">
        La community string «public» ha aperto il rubinetto. Tocca tutto ciò che questo output ha davvero rivelato:
      </p>
      <div className="grid min-w-0 gap-2 sm:grid-cols-2">
        {LEAKS.map((l) => {
          const selected = picked.includes(l.id);
          const goodPick = checked && selected && l.real;
          const badPick = checked && selected && !l.real;
          const missed = checked && !selected && l.real;
          return (
            <button
              key={l.id}
              onClick={() => toggle(l.id)}
              className={cn(
                "min-w-0 rounded-lg border p-3 text-left text-xs leading-relaxed transition active:scale-[0.98]",
                !checked && selected ? "border-accent bg-accent/10 text-foreground" : "border-border bg-surface text-muted-foreground hover:border-accent/50",
                goodPick && "border-success/60 bg-success/5 text-foreground",
                badPick && "border-destructive/60 bg-destructive/5",
                missed && "border-gold/60",
              )}
            >
              {l.text}
            </button>
          );
        })}
      </div>

      <Button
        className="mt-4 w-full"
        disabled={picked.length === 0}
        onClick={() => {
          setChecked(true);
          if (solved) markComplete();
        }}
      >
        Verifica l'analisi
      </Button>

      {!checked && (
        <InfoNote>
          SNMP espone ciò che il sistema sa di sé: descrizione, tempi, processi, utenti e rete.
          Non consegna però segreti come password o chiavi private.
        </InfoNote>
      )}
      {checked && !solved && (
        <WarnNote>
          Distingui ciò che compare davvero nell'output da ciò che SNMP non può sapere. Password e
          chiavi private non viaggiano in queste risposte.
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Con la sola parola «public» hai mappato sistema, uptime, processi, utenti e rete interna.
          La difesa è banale: cambiare la community string e usare SNMPv3.
        </SuccessNote>
      )}
    </div>
  );
}
