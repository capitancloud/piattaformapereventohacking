import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const FILES = [
  { name: "script.sh", owner: "rw-", group: "r--", others: "r--", target: { owner: "rwx", group: "r-x", others: "r-x" } },
  { name: "passwords.txt", owner: "rw-", group: "rw-", others: "rw-", target: { owner: "rw-", group: "---", others: "---" } },
  { name: "log.txt", owner: "rw-", group: "rw-", others: "r--", target: { owner: "rw-", group: "rw-", others: "rw-" } },
];

function permLabel(perm: string): string {
  const parts: string[] = [];
  if (perm[0] === "r") parts.push("lettura");
  if (perm[1] === "w") parts.push("scrittura");
  if (perm[2] === "x") parts.push("esecuzione");
  return parts.length ? parts.join(", ") : "nessuno";
}

export default function Task06Permissions({ markComplete, isComplete }: TaskContext) {
  const [perms, setPerms] = useState(
    FILES.map((f) => ({ owner: f.owner, group: f.group, others: f.others })),
  );

  const toggle = (fileIndex: number, who: "owner" | "group" | "others", bit: "r" | "w" | "x") => {
    const pos = bit === "r" ? 0 : bit === "w" ? 1 : 2;
    setPerms((prev) => {
      const next = [...prev];
      const current = next[fileIndex]![who];
      const chars = current.split("");
      chars[pos] = chars[pos] === bit ? "-" : bit;
      next[fileIndex] = { ...next[fileIndex]!, [who]: chars.join("") };
      return next;
    });
  };

  const allRight = FILES.every((f, i) => {
    const p = perms[i]!;
    return p.owner === f.target.owner && p.group === f.target.group && p.others === f.target.others;
  });

  const verify = () => {
    if (allRight) markComplete();
  };

  return (
    <div>
      <div className="space-y-4">
        {FILES.map((f, i) => (
          <div key={f.name} className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-sm text-foreground">{f.name}</span>
              <span className="text-xs text-muted-foreground">Obiettivo: {f.target.owner} {f.target.group} {f.target.others}</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {(["owner", "group", "others"] as const).map((who) => (
                <div key={who} className="rounded-md border border-border bg-background p-3">
                  <div className="mb-2 text-xs uppercase tracking-widest text-accent">{who}</div>
                  <div className="mb-2 font-mono text-sm text-foreground">
                    {perms[i]![who]} — {PERM_LABELS[perms[i]![who]]}
                  </div>
                  <div className="flex gap-2">
                    {(["r", "w", "x"] as const).map((bit) => (
                      <button
                        key={bit}
                        onClick={() => toggle(i, who, bit)}
                        className={cn(
                          "h-8 w-8 rounded-md border text-xs font-mono transition",
                          perms[i]![who].includes(bit)
                            ? "border-accent bg-accent/15 text-foreground"
                            : "border-border text-muted-foreground hover:border-accent/60",
                        )}
                      >
                        {bit}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={verify}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
      >
        Verifica permessi
      </button>

      {isComplete && (
        <SuccessNote>
          I permessi in Linux sono divisi in tre gruppi: proprietario, gruppo e altri. r = leggere, w = scrivere, x =
          eseguire.
        </SuccessNote>
      )}

      {!isComplete && (
        <InfoNote>
          Clicca su r, w, x per attivare o disattivare ogni permesso. Raggiungi la combinazione indicata per ogni file.
        </InfoNote>
      )}
    </div>
  );
}
