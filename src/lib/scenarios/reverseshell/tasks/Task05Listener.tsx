import { useState } from "react";
import { Terminal, type TermLine } from "@/components/lab/Terminal";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { setListener } from "../state";
import type { TaskContext } from "../../types";

const GOOD_PORTS = new Set([443, 8443, 4444, 9001, 53]);

export default function Task05Listener({ markComplete, isComplete }: TaskContext) {
  const [port, setPort] = useState("");
  const [lines, setLines] = useState<TermLine[]>([]);

  const start = () => {
    const p = Number(port);
    if (!Number.isInteger(p) || p < 1 || p > 65535) {
      setLines([{ kind: "err", text: "Porta non valida (1-65535)." }]);
      return;
    }
    if (p < 1024) {
      setLines([
        { kind: "prompt", text: `nc -lvnp ${p}` },
        { kind: "err", text: `nc: bind: Permission denied (porta < 1024 richiede root).` },
      ]);
      return;
    }
    setListener(p);
    setLines([
      { kind: "prompt", text: `nc -lvnp ${p}` },
      { kind: "info", text: `listening on [any] ${p} ...` },
    ]);
    if (GOOD_PORTS.has(p)) markComplete();
  };

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <input
          value={port}
          onChange={(e) => setPort(e.target.value)}
          placeholder="Porta di ascolto (es. 4444)"
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
        />
        <button
          onClick={start}
          className="rounded-md bg-gold px-4 py-2 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
        >
          Avvia listener
        </button>
      </div>
      <Terminal title="kali@attacker: ~ (listener)" prompt="kali@attacker:~$ " lines={lines} />

      {!isComplete && (
        <InfoNote>
          In una reverse shell è la vittima a <em>connettersi</em> verso di te. Devi quindi
          avere qualcosa che ascolta sulla tua macchina. Il classico è{" "}
          <code>nc -lvnp &lt;porta&gt;</code>. Scegli una porta plausibile: 443, 8443, 53
          (spesso non filtrate in uscita dai firewall aziendali) oppure 4444, 9001.
        </InfoNote>
      )}

      {lines.some((l) => l.kind === "err") && !isComplete && (
        <WarnNote>
          Ricorda: solo root può bindare porte &lt; 1024. Nei CTF si usa spesso{" "}
          <code>4444</code>; nel mondo reale è meglio 443 o 8443, che si mimetizzano nel
          traffico HTTPS in uscita.
        </WarnNote>
      )}

      {isComplete && (
        <SuccessNote>
          Il listener è pronto. La porta è memorizzata per i task successivi: quando
          costruirai il payload, useremo esattamente questa porta come destinazione.
        </SuccessNote>
      )}
    </div>
  );
}
