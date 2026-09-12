import { useState } from "react";
import { CheckCircle2, UserCheck } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { InteractiveTerminal, type TermResponse } from "@/components/lab/InteractiveTerminal";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const USERS: Record<string, boolean> = {
  "mario.rossi": true,
  "l.bianchi": true,
  "admin": true,
  "nessuno": false,
  "test123": false,
};

const FOUND_LABEL: Record<string, string> = {
  "mario.rossi": "mario.rossi",
  "l.bianchi": "l.bianchi",
  "admin": "admin",
};

export default function Task07Smtp({ markComplete, isComplete }: TaskContext) {
  const [connected, setConnected] = useState(false);
  const [found, setFound] = useState<string[]>([]);
  const [tested, setTested] = useState(0);

  const onCommand = (raw: string): TermResponse | TermResponse[] => {
    const cmd = raw.trim().toLowerCase();

    if (!connected) {
      if (cmd === "nc 10.10.10.12 25") {
        setConnected(true);
        return [
          { text: "220 mail.acme-lab.it ESMTP Postfix — pronto." },
          { text: "→ prova a verificare un utente: VRFY mario.rossi", kind: "info" },
        ];
      }
      return { text: "Connettiti prima: nc 10.10.10.12 25", kind: "err" };
    }

    if (cmd.startsWith("vrfy ")) {
      const user = cmd.slice(5).trim();
      setTested((t) => t + 1);
      if (user in USERS) {
        if (USERS[user]) {
          setFound((f) => {
            if (f.includes(user)) return f;
            const next = [...f, user];
            if (next.length === 3) markComplete();
            return next;
          });
          return { text: `250 2.1.5 <${user}@acme-lab.it> — l'utente esiste.` };
        }
        return { text: `550 5.1.1 <${user}>: destinatario rifiutato: utente sconosciuto.`, kind: "err" };
      }
      return { text: `550 5.1.1 <${user}>: destinatario rifiutato: utente sconosciuto.`, kind: "err" };
    }

    if (cmd === "help" || cmd === "?") {
      return { text: "Comandi: VRFY <nome> — verifica se un utente esiste. Prova: mario.rossi, l.bianchi, admin, nessuno, test123", kind: "info" };
    }
    return { text: `502 comando non implementato. Usa: VRFY <nomeutente>`, kind: "err" };
  };

  return (
    <div>
      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
        <InteractiveTerminal
          title="kali — smtp"
          prompt="kali@lab:~$ "
          onCommand={onCommand}
          heightClass="min-h-[260px]"
        />
        <aside className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent">
            <UserCheck className="h-4 w-4" /> Utenti confermati
          </p>
          <ul className="space-y-2.5">
            {["mario.rossi", "l.bianchi", "admin"].map((u) => {
              const ok = found.includes(u);
              return (
                <li key={u} className="flex min-w-0 items-center gap-2 text-xs">
                  <CheckCircle2 className={cn("h-4 w-4 shrink-0", ok ? "text-success" : "text-muted-foreground/30")} />
                  <span className={cn("min-w-0 break-words font-mono", ok ? "text-foreground" : "text-muted-foreground/50")}>
                    {FOUND_LABEL[u] ?? u}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            {found.length}/3 confermati · {tested} verifiche fatte
          </p>
        </aside>
      </div>

      {!isComplete ? (
        <InfoNote>
          VRFY chiede al server di posta se un indirizzo esiste: 250 significa «sì», 550 «no». Con
          una lista di nomi comuni si ricostruisce l'organico aziendale.
        </InfoNote>
      ) : (
        <SuccessNote>
          Tre utenti validi senza inviare una sola email: bastano per costruire attacchi mirati di
          phishing. Ecco perché i server moderni disattivano VRFY.
        </SuccessNote>
      )}
    </div>
  );
}
