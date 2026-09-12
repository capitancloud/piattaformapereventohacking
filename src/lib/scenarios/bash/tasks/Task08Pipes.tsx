import { useState } from "react";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const SOURCES = [
  { id: "ls", label: "ls", desc: "elenco file" },
  { id: "cat", label: "cat access.log", desc: "contenuto file" },
  { id: "ps", label: "ps aux", desc: "elenco processi" },
];
const FILTERS = [
  { id: "grep .conf", label: "grep .conf", desc: "solo righe con .conf" },
  { id: "grep error", label: "grep error", desc: "solo righe con \"error\"" },
  { id: "wc -l", label: "wc -l", desc: "conta le righe" },
  { id: "sort", label: "sort", desc: "ordina alfabeticamente" },
];
const DESTS = [
  { id: "stdout", label: "(nessuno)", desc: "stampa a schermo" },
  { id: "> out.txt", label: "> out.txt", desc: "scrivi su file" },
  { id: ">> log.txt", label: ">> log.txt", desc: "aggiungi in coda a log.txt" },
];

const FILES = ["nginx.conf", "hosts", "resolv.conf", "passwd", "shadow", "profile"];

export default function Task08Pipes({ markComplete, isComplete }: TaskContext) {
  const [src, setSrc] = useState<string | null>(null);
  const [flt, setFlt] = useState<string | null>(null);
  const [dst, setDst] = useState<string | null>(null);
  const [ran, setRan] = useState(false);

  const runIt = () => {
    setRan(true);
    if (src === "ls" && flt === "grep .conf" && dst === "> out.txt") markComplete();
  };

  const preview = (() => {
    if (src === "ls") {
      let items = [...FILES];
      if (flt === "grep .conf") items = items.filter((f) => f.includes(".conf"));
      if (flt === "grep error") items = [];
      if (flt === "wc -l") return [`${items.length}`];
      if (flt === "sort") items = items.sort();
      return items;
    }
    if (src === "cat") {
      let lines = ["INFO server start", "ERROR db timeout", "INFO login ok", "ERROR auth failed", "WARN slow query"];
      if (flt === "grep error") lines = lines.filter((l) => l.toLowerCase().includes("error"));
      if (flt === "grep .conf") lines = [];
      if (flt === "wc -l") return [`${lines.length}`];
      if (flt === "sort") lines = lines.sort();
      return lines;
    }
    if (src === "ps") {
      let procs = ["root  1  systemd", "kali 812 bash", "kali 940 firefox", "kali 950 nginx: worker"];
      if (flt === "grep .conf") procs = [];
      if (flt === "grep error") procs = [];
      if (flt === "wc -l") return [`${procs.length}`];
      if (flt === "sort") procs = procs.sort();
      return procs;
    }
    return [];
  })();

  const cmd = [src && SOURCES.find((s) => s.id === src)?.label, flt && `| ${flt}`, dst && dst !== "stdout" ? dst : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Obiettivo: elenca i file, filtra solo .conf, salva in out.txt
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: "Sorgente", items: SOURCES, val: src, set: setSrc, color: "accent" as const },
            { title: "Filtro (|)", items: FILTERS, val: flt, set: setFlt, color: "primary" as const },
            { title: "Destinazione", items: DESTS, val: dst, set: setDst, color: "emerald" as const },
          ].map((col) => (
            <div key={col.title} className="rounded-lg border border-border bg-background p-3">
              <div className="mb-2 text-[10px] uppercase tracking-widest text-muted-foreground">{col.title}</div>
              <div className="space-y-2">
                {col.items.map((it) => (
                  <button
                    key={it.id}
                    onClick={() => col.set(it.id)}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-md border p-2 text-left transition",
                      col.val === it.id
                        ? "border-accent bg-accent/15"
                        : "border-border hover:border-accent/60",
                    )}
                  >
                    {col.val === it.id && <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />}
                    <div>
                      <div className="font-mono text-xs text-foreground">{it.label}</div>
                      <div className="text-[11px] text-muted-foreground">{it.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex min-w-0 flex-wrap items-center gap-2 rounded-md border border-border bg-black/60 p-3 font-mono text-sm [&>span]:break-all">
          <span className="text-gold-soft">kali@lab:~$</span>
          {src ? <span className="text-accent">{SOURCES.find((s) => s.id === src)!.label}</span> : <span className="text-muted-foreground/60">sorgente</span>}
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          {flt ? <span className="text-primary">| {flt}</span> : <span className="text-muted-foreground/60">| filtro</span>}
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          {dst && dst !== "stdout" ? <span className="text-emerald-400">{dst}</span> : <span className="text-muted-foreground/60">destinazione</span>}
        </div>

        <button
          onClick={runIt}
          disabled={!src || !flt || !dst}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 disabled:opacity-40"
        >
          <Play className="h-3.5 w-3.5" /> Esegui pipeline
        </button>

        {ran && (
          <div className="mt-4 rounded-md border border-border bg-black/70 p-3 font-mono text-xs">
            <div className="mb-1 break-all text-muted-foreground">$ {cmd}</div>
            {dst === "stdout" ? (
              preview.length ? preview.map((l, i) => <div key={i} className="text-ivory">{l}</div>) : <div className="text-muted-foreground">(nessun risultato)</div>
            ) : (
              <div className="text-success">scritto {preview.length} righe in {dst?.replace(/^>+ /, "")}</div>
            )}
          </div>
        )}
      </div>

      {!isComplete ? (
        <InfoNote>La combinazione richiesta è: ls | grep .conf &gt; out.txt. Puoi provare tutte le altre per capirne l'effetto.</InfoNote>
      ) : (
        <SuccessNote>Pipe e redirezione trasformano piccoli comandi in flussi di lavoro completi. È la filosofia Unix.</SuccessNote>
      )}
    </div>
  );
}
