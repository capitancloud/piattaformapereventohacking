import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import InteractiveTerminal from "@/components/lab/InteractiveTerminal";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const STEPS = [
  { cmd: "docker pull vulnerables/web-dvwa", output: [
    "Using default tag: latest",
    "latest: Pulling from vulnerables/web-dvwa",
    "b23cbf1c7c76: Pull complete",
    "Status: Downloaded newer image for vulnerables/web-dvwa:latest",
  ] },
  { cmd: "docker run -d -p 80:80 --name dvwa vulnerables/web-dvwa", output: [
    "9f2c1a...",
    "container 'dvwa' avviato in background",
  ] },
  { cmd: "docker ps", output: [
    "CONTAINER ID  IMAGE                   PORTS                NAMES",
    "9f2c1a...     vulnerables/web-dvwa    0.0.0.0:80->80/tcp   dvwa",
  ] },
  { cmd: "curl -I http://localhost", output: [
    "HTTP/1.1 302 Found",
    "Location: login.php",
    "Server: Apache/2.4.25 (Debian)",
  ] },
];

export default function Task09Dvwa({ markComplete, isComplete }: TaskContext) {
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    if (step >= STEPS.length && visited) markComplete();
  }, [step, visited, markComplete]);

  const current = STEPS[step];

  return (
    <div className="space-y-4">
      <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
          <InteractiveTerminal
            prompt="kali@lab:~$"
            commands={current ? [current.cmd] : []}
            output={current ? current.output : ["Tutti i comandi eseguiti. Ora apri il browser."]}
            onComplete={() => setStep((s) => s + 1)}
          />
        </div>
        <aside className="min-w-0 space-y-3 rounded-xl border border-border bg-surface p-4">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Progresso</p>
          <ol className="space-y-1.5 text-xs">
            {STEPS.map((s, i) => (
              <li key={i} className={cn("flex min-w-0 items-start gap-2", i < step ? "text-success" : i === step ? "text-foreground" : "text-muted-foreground")}>
                <span className="mt-0.5 font-mono">{i + 1}.</span>
                <span className="min-w-0 break-all font-mono">{s.cmd.split(" ").slice(0, 2).join(" ")}…</span>
              </li>
            ))}
          </ol>
          {step >= STEPS.length && (
            <button
              onClick={() => setVisited(true)}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs transition",
                visited ? "border-success/60 bg-success/10 text-success" : "border-accent bg-accent/10 text-accent hover:bg-accent/20",
              )}
            >
              <Globe className="h-3.5 w-3.5" />
              {visited ? "http://localhost aperto" : "Apri http://localhost nel browser"}
            </button>
          )}
        </aside>
      </div>

      {!isComplete && step < STEPS.length && <InfoNote>Premi Invio per eseguire ciascun comando in ordine. Ognuno ha un ruolo preciso nel far salire DVWA.</InfoNote>}
      {!isComplete && step >= STEPS.length && !visited && <WarnNote>Manca solo la verifica: apri il browser sulla pagina di DVWA per confermare che risponde.</WarnNote>}
      {isComplete && <SuccessNote>DVWA è online. Hai il tuo primo bersaglio deliberatamente vulnerabile, pronto per esercitarti.</SuccessNote>}
    </div>
  );
}
