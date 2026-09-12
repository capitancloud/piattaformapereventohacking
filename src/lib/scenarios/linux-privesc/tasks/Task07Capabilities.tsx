import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const CAPS = [
  { id: "c1", bin: "/usr/bin/ping", cap: "cap_net_raw+ep", ok: false, why: "Legittimo: ping ha bisogno di raw socket. Nessuna via a root." },
  { id: "c2", bin: "/usr/bin/python3.8", cap: "cap_setuid+ep", ok: true, why: "Interprete + cap_setuid = os.setuid(0); os.system('/bin/sh')  →  shell root." },
  { id: "c3", bin: "/usr/bin/tar", cap: "cap_dac_read_search+ep", ok: true, why: "Permette di leggere qualunque file: puoi copiare /etc/shadow e crackare gli hash." },
  { id: "c4", bin: "/usr/bin/mtr", cap: "cap_net_raw+ep", ok: false, why: "Come ping: raw socket, nessuna via a root." },
  { id: "c5", bin: "/usr/bin/perl", cap: "cap_setuid+ep", ok: true, why: "Interprete + cap_setuid: perl -e 'use POSIX; setuid 0; exec \"/bin/sh\"'  →  root." },
  { id: "c6", bin: "/usr/sbin/arping", cap: "cap_net_raw+ep", ok: false, why: "Ancora raw socket: legittimo." },
];

export default function Task07Capabilities({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const target = CAPS.filter((c) => c.ok).map((c) => c.id);
  const correct =
    picked.length === target.length && target.every((id) => picked.includes(id));

  const toggle = (id: string) => {
    setChecked(false);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  return (
    <div>
      <div className="min-w-0 rounded-xl border border-border bg-surface p-3">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-accent">getcap -r / 2&gt;/dev/null</p>
        <p className="break-words text-xs text-muted-foreground">
          Clicca i binari le cui capabilities aprono davvero una via a root. Gli altri sono legittimi.
        </p>
      </div>

      <div className="mt-3 space-y-2">
        {CAPS.map((c) => {
          const on = picked.includes(c.id);
          const right = checked && on && c.ok;
          const wrong = checked && on && !c.ok;
          const missed = checked && !on && c.ok;
          return (
            <button
              key={c.id}
              onClick={() => toggle(c.id)}
              className={cn(
                "flex w-full min-w-0 flex-col rounded-lg border border-border bg-black/70 p-3 text-left font-mono text-[11px] transition active:scale-95",
                on && !checked && "border-accent bg-accent/10",
                right && "border-success/70 bg-success/10",
                wrong && "border-destructive/70 bg-destructive/10",
                missed && "border-gold/60 bg-gold/10",
              )}
            >
              <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-2">
                <span className="min-w-0 break-all text-ivory/90">{c.bin}</span>
                <span
                  className={cn(
                    "rounded-sm px-2 py-0.5 text-[10px]",
                    c.cap.startsWith("cap_setuid") || c.cap.startsWith("cap_dac")
                      ? "bg-destructive/30 text-destructive"
                      : "bg-ivory/10 text-ivory/70",
                  )}
                >
                  {c.cap}
                </span>
              </div>
              {checked && (right || wrong || missed) && (
                <p className={cn("mt-2 whitespace-normal text-xs", right ? "text-success" : wrong ? "text-destructive" : "text-gold")}>
                  {c.why}
                </p>
              )}
            </button>
          );
        })}
      </div>

      <Button
        className="mt-4 w-full"
        disabled={picked.length === 0}
        onClick={() => {
          setChecked(true);
          if (correct) markComplete();
        }}
      >
        Verifica le capabilities
      </Button>

      {!checked && (
        <InfoNote>
          Le capabilities «cattive» classiche: cap_setuid (cambio uid), cap_dac_read_search (lettura
          totale), cap_sys_admin (quasi come root). Su un interprete equivalgono a una shell root.
        </InfoNote>
      )}
      {checked && !correct && (
        <WarnNote>Rileggi le capabilities in rosso: sono quelle che aprono davvero la porta a root.</WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai identificato le tre voci sfruttabili: python3 e perl con cap_setuid, tar con
          cap_dac_read_search. Sono i «SUID nascosti» dell'era moderna.
        </SuccessNote>
      )}
    </div>
  );
}
