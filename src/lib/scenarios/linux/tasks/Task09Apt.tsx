import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { InteractiveTerminal } from "@/components/lab/InteractiveTerminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const STEPS = [
  { cmd: "sudo apt update", desc: "Aggiorna l'elenco dei pacchetti" },
  { cmd: "sudo apt install nmap", desc: "Installa nmap" },
  { cmd: "sudo apt remove nmap", desc: "Rimuove nmap" },
  { cmd: "sudo apt upgrade", desc: "Aggiorna i pacchetti installati" },
];

export default function Task09Apt({ markComplete, isComplete }: TaskContext) {
  const [done, setDone] = useState(0);

  const handleCommand = (cmd: string) => {
    const expected = STEPS[done];
    if (!expected) {
      return { text: "Sequenza completata. Nessun altro comando richiesto.", kind: "info" as const };
    }

    if (cmd.trim() !== expected.cmd) {
      return {
        text: `Atteso: ${expected.cmd}\n${expected.desc}`,
        kind: "err" as const,
      };
    }

    setDone((d) => d + 1);

    if (done + 1 >= STEPS.length && !isComplete) {
      markComplete();
    }

    const messages: Record<string, string> = {
      "sudo apt update": "Hit:1 http://http.kali.org/kali kali-rolling InRelease\nLettura elenco pacchetti... Fatto",
      "sudo apt install nmap": "Lettura informazioni sullo stato... Fatto\nInstallazione di nmap...",
      "sudo apt remove nmap": "Rimozione di nmap...",
      "sudo apt upgrade": "Calcolo dell'aggiornamento... Fatto\n0 aggiornati, 0 nuovi installati.",
    };

    return { text: messages[cmd.trim()] ?? "Comando eseguito.", kind: "info" as const };
  };

  return (
    <div>
      <div className="mb-4 rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">Sequenza apt da eseguire</div>
        <ol className="list-inside list-decimal space-y-1 text-sm text-foreground">
          {STEPS.map((s, i) => (
            <li key={s.cmd} className={cn(i < done && "text-success line-through")}>
              <code className="text-accent">{s.cmd}</code> — {s.desc}
            </li>
          ))}
        </ol>
      </div>

      <InteractiveTerminal title="kali@lab: ~" prompt="kali@lab:~$ " onCommand={handleCommand} heightClass="min-h-[260px]" />

      {!isComplete ? (
        <InfoNote>
          <code className="text-accent">apt</code> gestisce i pacchetti su Debian e Kali. Segui i 4 passaggi nell'ordine
          corretto.
        </InfoNote>
      ) : (
        <SuccessNote>
          update = aggiorna l'indice. install/remove = installa o rimuove. upgrade = aggiorna ciò che è già presente. Non
          dimenticare <code>sudo</code>.
        </SuccessNote>
      )}
    </div>
  );
}
