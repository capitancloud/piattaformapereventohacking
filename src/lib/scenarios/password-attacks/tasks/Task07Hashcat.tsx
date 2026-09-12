import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Job = {
  id: string;
  algo: "MD5" | "NTLM" | "bcrypt";
  hash: string;
  correctMode: number;
  cracked: string;
};

const JOBS: Job[] = [
  { id: "j1", algo: "MD5", hash: "e10adc3949ba59abbe56e057f20f883e", correctMode: 0, cracked: "123456" },
  { id: "j2", algo: "NTLM", hash: "8846f7eaee8fb117ad06bdd830b7586c", correctMode: 1000, cracked: "password" },
  { id: "j3", algo: "bcrypt", hash: "$2y$10$abcdefghijklmnopqrstuv1234567890abcd", correctMode: 3200, cracked: "iloveyou" },
];

const MODES = [
  { m: 0, label: "0 · MD5" },
  { m: 100, label: "100 · SHA1" },
  { m: 1000, label: "1000 · NTLM" },
  { m: 1400, label: "1400 · SHA256" },
  { m: 3200, label: "3200 · bcrypt" },
];

export default function Task07Hashcat({ markComplete, isComplete }: TaskContext) {
  const [selected, setSelected] = useState<Record<string, number | undefined>>({});
  const [results, setResults] = useState<Record<string, "ok" | "ko" | undefined>>({});

  const run = (job: Job) => {
    const m = selected[job.id];
    setResults((r) => ({ ...r, [job.id]: m === job.correctMode ? "ok" : "ko" }));
    const okCount =
      Object.entries({ ...results, [job.id]: m === job.correctMode ? "ok" : "ko" }).filter(([, v]) => v === "ok").length;
    if (okCount >= JOBS.length) markComplete();
  };

  return (
    <div>
      <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
        Ogni hash richiede la modalità (-m) giusta. Scegli il numero corretto per ogni riga e lancia hashcat. Sbagliare la modalità significa non trovare mai la password.
      </p>

      <div className="space-y-4">
        {JOBS.map((job) => {
          const m = selected[job.id];
          const r = results[job.id];
          return (
            <div key={job.id} className="min-w-0 rounded-xl border border-border bg-surface p-4">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md border border-border bg-background px-2 py-0.5 font-mono text-gold">{job.algo}</span>
                <span className="text-muted-foreground">hash bersaglio</span>
              </div>
              <div className="min-w-0 overflow-hidden rounded-md border border-border bg-black p-2">
                <code className="block min-w-0 whitespace-pre-wrap break-all font-mono text-[12px] text-gold">{job.hash}</code>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {MODES.map((opt) => (
                  <button
                    key={opt.m}
                    onClick={() => {
                      setSelected((s) => ({ ...s, [job.id]: opt.m }));
                      setResults((rr) => ({ ...rr, [job.id]: undefined }));
                    }}
                    className={cn(
                      "rounded-md border px-2.5 py-1 font-mono text-[11px] transition active:scale-95",
                      m === opt.m
                        ? "border-accent bg-accent/15 text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-accent/50",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="mt-3 min-w-0 overflow-hidden rounded-md border border-border bg-black/60 p-2">
                <code className="block min-w-0 break-all font-mono text-[11px] text-ivory/80">
                  hashcat -m {m ?? "?"} -a 0 hash.txt rockyou.txt
                </code>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <Button size="sm" disabled={m === undefined} onClick={() => run(job)}>
                  Esegui hashcat
                </Button>
                {r === "ok" && (
                  <span className="flex items-center gap-1.5 text-xs text-success">
                    <CheckCircle2 className="h-4 w-4" /> cracked → <code className="font-mono">{job.cracked}</code>
                  </span>
                )}
                {r === "ko" && (
                  <span className="flex items-center gap-1.5 text-xs text-destructive">
                    <XCircle className="h-4 w-4" /> Exhausted. Modalità sbagliata: hashcat calcola con l'algoritmo che gli hai detto.
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isComplete && <InfoNote>Riferimenti rapidi: MD5=0, SHA1=100, NTLM=1000, SHA256=1400, bcrypt=3200.</InfoNote>}
      {isComplete && (
        <SuccessNote>
          Perfetto. Riconoscere il tipo di hash e scegliere la modalità corretta è l'80% del lavoro di un cracker offline.
        </SuccessNote>
      )}
    </div>
  );
}
