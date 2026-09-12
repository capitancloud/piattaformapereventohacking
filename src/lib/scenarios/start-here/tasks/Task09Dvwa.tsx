import { useEffect, useState } from "react";
import { Globe, Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const STEPS: { cmd: string; output: string[]; desc: string }[] = [
  { cmd: "docker pull vulnerables/web-dvwa", desc: "Scarica l'immagine di DVWA da Docker Hub.", output: [
    "Using default tag: latest",
    "latest: Pulling from vulnerables/web-dvwa",
    "b23cbf1c7c76: Pull complete",
    "Status: Downloaded newer image for vulnerables/web-dvwa:latest",
  ] },
  { cmd: "docker run -d -p 80:80 --name dvwa vulnerables/web-dvwa", desc: "Avvia DVWA in background e mappa la porta 80 del container su quella del PC.", output: [
    "9f2c1a9b7d4e...",
    "container 'dvwa' avviato in background",
  ] },
  { cmd: "docker ps", desc: "Elenca i container in esecuzione: DVWA deve comparire.", output: [
    "CONTAINER ID  IMAGE                   PORTS                NAMES",
    "9f2c1a...     vulnerables/web-dvwa    0.0.0.0:80->80/tcp   dvwa",
  ] },
  { cmd: "curl -I http://localhost", desc: "Chiede solo l'header HTTP: se vedi 302 verso login.php, DVWA risponde.", output: [
    "HTTP/1.1 302 Found",
    "Location: login.php",
    "Server: Apache/2.4.25 (Debian)",
  ] },
];

export default function Task09Dvwa({ markComplete, isComplete }: TaskContext) {
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState(false);
  const done = step >= STEPS.length;

  useEffect(() => {
    if (done && visited) markComplete();
  }, [done, visited, markComplete]);

  return (
    <div className="space-y-4">
      <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-black shadow-2xl shadow-black/60">
          <div className="flex items-center gap-2 border-b border-border/60 bg-surface-2 px-3 py-2 text-xs">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-gold/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
            </div>
            <span className="ml-2 font-mono text-[11px] text-muted-foreground">kali@lab: ~</span>
          </div>
          <div className="max-h-80 min-w-0 space-y-1 overflow-y-auto overflow-x-hidden p-4 font-mono text-xs text-ivory">
            {STEPS.slice(0, step).map((s, i) => (
              <div key={i} className="space-y-0.5">
                <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-2">
                  <span className="whitespace-nowrap text-gold-soft">kali@lab:~$</span>
                  <span className="min-w-0 break-all">{s.cmd}</span>
                </div>
                {s.output.map((o, oi) => (
                  <div key={oi} className="whitespace-pre-wrap break-words pl-2 text-ivory/80 [overflow-wrap:anywhere]">{o}</div>
                ))}
              </div>
            ))}
            {!done && (
              <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-2 pt-1">
                <span className="whitespace-nowrap text-gold-soft">kali@lab:~$</span>
                <span className="min-w-0 break-all text-ivory/60">{STEPS[step]!.cmd}<span className="ml-1 animate-pulse">▍</span></span>
              </div>
            )}
          </div>
          {!done && (
            <div className="border-t border-border/60 bg-surface-2/60 p-3">
              <p className="mb-2 text-xs text-muted-foreground">{STEPS[step]!.desc}</p>
              <Button size="sm" className="w-full" onClick={() => setStep((s) => s + 1)}>
                <Play className="mr-2 h-3 w-3" /> Esegui il comando
              </Button>
            </div>
          )}
        </div>

        <aside className="min-w-0 space-y-3 rounded-xl border border-border bg-surface p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Progresso</p>
          <ol className="space-y-1.5 text-xs">
            {STEPS.map((s, i) => (
              <li key={i} className={cn(
                "flex min-w-0 items-start gap-2",
                i < step ? "text-success" : i === step ? "text-foreground" : "text-muted-foreground",
              )}>
                <span className="mt-0.5 font-mono">{i + 1}.</span>
                <span className="min-w-0 break-all font-mono">{s.cmd.split(" ").slice(0, 3).join(" ")}…</span>
              </li>
            ))}
          </ol>
          {done && (
            <button
              onClick={() => setVisited(true)}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs transition",
                visited ? "border-success/60 bg-success/10 text-success" : "border-accent bg-accent/10 text-accent hover:bg-accent/20",
              )}
            >
              {visited ? <Check className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
              {visited ? "http://localhost aperto" : "Apri http://localhost nel browser"}
            </button>
          )}
        </aside>
      </div>

      {!isComplete && !done && <InfoNote>Ogni comando fa una cosa precisa. Leggi la descrizione, poi esegui.</InfoNote>}
      {!isComplete && done && !visited && <WarnNote>Manca solo la verifica visiva: apri http://localhost per vedere la pagina di login di DVWA.</WarnNote>}
      {isComplete && <SuccessNote>DVWA è online. Hai il tuo primo bersaglio deliberatamente vulnerabile, pronto per esercitarti.</SuccessNote>}
    </div>
  );
}
