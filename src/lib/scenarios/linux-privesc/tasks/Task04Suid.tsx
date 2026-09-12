import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { InteractiveTerminal, type TermResponse } from "@/components/lab/InteractiveTerminal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const SUID_LIST = [
  "/usr/bin/passwd",
  "/usr/bin/sudo",
  "/usr/bin/su",
  "/usr/bin/chsh",
  "/usr/bin/mount",
  "/usr/bin/umount",
  "/usr/bin/pkexec",
  "/bin/ping",
  "/usr/local/bin/reader",
];

const STEPS = [
  { id: "find", label: "Lanciare il find giusto" },
  { id: "spot", label: "Cliccare il binario anomalo" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export default function Task04Suid({ markComplete, isComplete }: TaskContext) {
  const [done, setDone] = useState<StepId[]>([]);
  const [listShown, setListShown] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const mark = (s: StepId) =>
    setDone((d) => {
      if (d.includes(s)) return d;
      const next = [...d, s];
      if (next.length === STEPS.length) markComplete();
      return next;
    });

  const onCommand = (raw: string): TermResponse | TermResponse[] => {
    const cmd = raw.trim();
    if (cmd === "find / -perm -4000 -type f 2>/dev/null" || cmd === "find / -perm -4000 2>/dev/null") {
      mark("find");
      setListShown(true);
      return [
        ...SUID_LIST.map<TermResponse>((l) => ({ text: l })),
        { text: "→ ora osserva la lista: uno di questi non appartiene ai binari di sistema.", kind: "info" },
      ];
    }
    if (cmd === "ls" || cmd === "whoami" || cmd === "id") {
      return { text: cmd === "whoami" ? "alex" : cmd === "id" ? "uid=1001(alex) gid=1001(alex) groups=1001(alex)" : "index.html backup.sh notes.txt" };
    }
    return { text: `bash: ${raw}: command not found`, kind: "err" };
  };

  return (
    <div>
      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
        <InteractiveTerminal title="caccia ai SUID su web01" prompt="alex@web01:~$ " onCommand={onCommand} heightClass="min-h-[260px]" />
        <aside className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-accent">Passi</p>
          <ul className="space-y-2.5">
            {STEPS.map((s) => {
              const ok = done.includes(s.id);
              return (
                <li key={s.id} className="flex min-w-0 items-start gap-2 text-xs">
                  {ok ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  ) : (
                    <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className={cn("min-w-0 break-words", ok ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      {listShown && (
        <div className="mt-4 min-w-0 rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 break-words text-xs text-muted-foreground">
            Clicca il binario che non dovrebbe essere SUID di root:
          </p>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {SUID_LIST.map((b) => {
              const selected = picked === b;
              const right = checked && selected && b === "/usr/local/bin/reader";
              const wrong = checked && selected && b !== "/usr/local/bin/reader";
              return (
                <button
                  key={b}
                  onClick={() => {
                    setChecked(false);
                    setPicked(b);
                  }}
                  className={cn(
                    "min-w-0 break-all rounded-md border px-3 py-2 text-left font-mono text-[11px] transition active:scale-95",
                    selected && !checked && "border-accent bg-accent/15 text-foreground",
                    right && "border-success bg-success/10 text-success",
                    wrong && "border-destructive bg-destructive/10 text-destructive",
                    !selected && "border-border bg-background text-muted-foreground hover:border-accent/50",
                  )}
                >
                  {b}
                </button>
              );
            })}
          </div>
          <Button
            className="mt-3 w-full"
            disabled={!picked}
            onClick={() => {
              setChecked(true);
              if (picked === "/usr/local/bin/reader") mark("spot");
            }}
          >
            Verifica la scelta
          </Button>
        </div>
      )}

      {!isComplete && !checked && (
        <InfoNote>
          Il comando è: <code className="font-mono">find / -perm -4000 -type f 2&gt;/dev/null</code>.
          Poi confronta i risultati con l'elenco dei SUID standard su una distribuzione Linux normale.
        </InfoNote>
      )}
      {checked && picked && picked !== "/usr/local/bin/reader" && (
        <WarnNote>Quello è un SUID di sistema legittimo. Cerca il binario che non trovi mai su una Linux appena installata.</WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          /usr/local/bin/reader non è un binario standard: è custom, è SUID di root e nessuno lo
          controlla. Nella vita reale è lì che si guarda per prima cosa.
        </SuccessNote>
      )}
    </div>
  );
}
