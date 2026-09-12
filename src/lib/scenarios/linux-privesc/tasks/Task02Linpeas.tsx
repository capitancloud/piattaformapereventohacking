import { useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Row = { id: string; text: string; color: "red" | "yellow" | "grey"; hot: boolean; why: string };

const ROWS: Row[] = [
  { id: "r1", text: "[+] Operative system  ......  Linux 4.4.0-116-generic", color: "grey", hot: false, why: "Solo informativo." },
  { id: "r2", text: "[+] Kernel version  4.4.0-116-generic  (Ubuntu 16.04)  — check exploits!", color: "red", hot: true, why: "Kernel 4.4.0 = area Dirty COW: un exploit pubblico esiste." },
  { id: "r3", text: "[+] Current user  alex  uid=1001  groups=1001", color: "grey", hot: false, why: "Solo il tuo contesto: nessuna anomalia." },
  { id: "r4", text: "[+] sudo -l  ->  (ALL) NOPASSWD: /usr/bin/find", color: "red", hot: true, why: "find via sudo NOPASSWD = shell root in una riga (GTFOBins)." },
  { id: "r5", text: "[+] SUID files  ->  /usr/bin/passwd, /usr/bin/su, /usr/bin/sudo", color: "grey", hot: false, why: "SUID di sistema, del tutto normali." },
  { id: "r6", text: "[+] SUID files  ->  /usr/local/bin/reader  (custom, non standard)", color: "red", hot: true, why: "SUID custom = quasi sempre una via di privesc." },
  { id: "r7", text: "[+] Writable folders in $PATH  ->  /home/alex/bin", color: "yellow", hot: false, why: "Sospetto ma da solo non basta: serve uno script privilegiato che chiami un comando senza path." },
  { id: "r8", text: "[+] Interesting files in /var/log/  ->  auth.log (readable)", color: "grey", hot: false, why: "Interessante ma non è escalation." },
];

export default function Task02Linpeas({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const target = ROWS.filter((r) => r.hot).map((r) => r.id);
  const correct =
    picked.length === target.length && target.every((id) => picked.includes(id));

  const toggle = (id: string) => {
    setChecked(false);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        linpeas è uno strumento di enumerazione automatica. Il suo output è lungo e colorato: il rosso indica una via di privilege escalation molto probabile, il giallo un sospetto, il grigio solo contesto. Clicca le tre righe rosse che rappresentano vere opportunità di scalata.
      </p>
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-black shadow-2xl shadow-black/60">
        <div className="flex items-center gap-2 border-b border-border/60 bg-surface-2 px-3 py-2 text-xs">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-muted-foreground">linpeas.sh — output</span>
        </div>
        <div className="min-w-0 space-y-1 p-3 font-mono text-[12px] leading-relaxed">
          {ROWS.map((r) => {
            const on = picked.includes(r.id);
            const color =
              r.color === "red"
                ? "text-destructive"
                : r.color === "yellow"
                  ? "text-gold"
                  : "text-ivory/60";
            const right = checked && on && r.hot;
            const wrong = checked && on && !r.hot;
            const missed = checked && !on && r.hot;
            return (
              <button
                key={r.id}
                onClick={() => toggle(r.id)}
                className={cn(
                  "flex w-full min-w-0 items-start gap-2 rounded-md border border-transparent px-2 py-1 text-left transition",
                  on && "border-accent/50 bg-accent/10",
                  right && "border-success/60 bg-success/10",
                  wrong && "border-destructive/60 bg-destructive/10",
                  missed && "border-gold/50 bg-gold/10",
                )}
              >
                <span className="mt-0.5 h-3 w-3 shrink-0 rounded-sm border border-ivory/40" />
                <span className={cn("min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere]", color)}>
                  {r.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Button
        className="mt-4 w-full"
        disabled={picked.length === 0}
        onClick={() => {
          setChecked(true);
          if (correct) markComplete();
        }}
      >
        Verifica i risultati sospetti
      </Button>

      {!checked && (
        <InfoNote>
          Clicca le righe che rappresentano vere opportunità di privilege escalation. Ignora quelle
          informative o solo «giallo tenue»: nel tempo imparerai a filtrarle in automatico.
        </InfoNote>
      )}
      {checked && !correct && (
        <div className="mt-3 space-y-2">
          {ROWS.filter((r) => r.hot || picked.includes(r.id)).map((r) => (
            <div key={r.id} className="rounded-md border border-border bg-surface p-3 text-xs">
              <span className="font-mono text-accent">{r.text.split("  ")[0]}</span>
              <span className="ml-2 text-muted-foreground">{r.why}</span>
            </div>
          ))}
          <WarnNote>Rileggi i colori: rosso = quasi sempre una via; giallo = sospetto da confermare.</WarnNote>
        </div>
      )}
      {isComplete && (
        <SuccessNote>
          Hai identificato le tre righe che contano: kernel vulnerabile, sudo NOPASSWD e SUID
          custom. Ognuna sarà approfondita nei prossimi task.
        </SuccessNote>
      )}
    </div>
  );
}
