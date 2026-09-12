import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import { InteractiveTerminal, type TermResponse } from "@/components/lab/InteractiveTerminal";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const STEPS = [
  { id: "connect", label: "Connettiti con ftp 10.10.10.12" },
  { id: "login", label: "Entra come anonymous" },
  { id: "list", label: "Elenca i file con ls" },
  { id: "get", label: "Scarica note.txt con get" },
  { id: "bye", label: "Chiudi con bye" },
] as const;

type StepId = (typeof STEPS)[number]["id"];

export default function Task02Ftp({ markComplete, isComplete }: TaskContext) {
  const [done, setDone] = useState<StepId[]>([]);
  const [connected, setConnected] = useState(false);
  const [logged, setLogged] = useState(false);

  const mark = (id: StepId) =>
    setDone((d) => {
      if (d.includes(id)) return d;
      const next = [...d, id];
      if (next.length === STEPS.length) markComplete();
      return next;
    });

  const onCommand = (raw: string): TermResponse | TermResponse[] => {
    const cmd = raw.trim().toLowerCase();

    if (!connected) {
      if (cmd === "ftp 10.10.10.12") {
        setConnected(true);
        mark("connect");
        return [
          { text: "Connected to 10.10.10.12." },
          { text: "220 (vsFTPd 3.0.3) — Benvenuto, indica il tuo nome utente.", kind: "info" },
          { text: "Name (10.10.10.12:kali): " },
          { text: "→ digita: anonymous", kind: "info" },
        ];
      }
      return { text: "Devi prima connetterti: ftp 10.10.10.12", kind: "err" };
    }

    if (!logged) {
      if (cmd === "anonymous") {
        setLogged(true);
        mark("login");
        return [
          { text: "331 Please specify the password." },
          { text: "Password: (premi Invio su una password vuota)" },
          { text: "→ digita: invio", kind: "info" },
        ];
      }
      if (cmd === "invio") {
        return [{ text: "230 Login successful." }, { text: "Remote system type is UNIX." }, { text: "→ ora prova: ls", kind: "info" }];
      }
      return { text: "530 Login incorrect. Prova con: anonymous", kind: "err" };
    }

    if (cmd === "ls") {
      mark("list");
      return [
        { text: "200 PORT command successful." },
        { text: "-rw-r--r--  1 ftp  ftp   220  pub/" },
        { text: "-rw-r--r--  1 ftp  ftp   148  note.txt" },
        { text: "→ c'è un file interessante: get note.txt", kind: "info" },
      ];
    }
    if (cmd === "get note.txt") {
      mark("get");
      return [
        { text: "local: note.txt remote: note.txt" },
        { text: "226 Transfer complete. 148 bytes received." },
        { text: "Contenuto: «Promemoria: il backup notturno finisce in /pub/backups»", kind: "info" },
        { text: "→ chiudi la sessione: bye", kind: "info" },
      ];
    }
    if (cmd === "bye" || cmd === "quit" || cmd === "exit") {
      mark("bye");
      return [{ text: "221 Goodbye." }];
    }
    return { text: `?Comando non riconosciuto: ${raw}. Comandi utili: ls, get note.txt, bye`, kind: "err" };
  };

  return (
    <div>
      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_250px]">
        <InteractiveTerminal
          title="kali — ftp"
          prompt="kali@lab:~$ "
          onCommand={onCommand}
          heightClass="min-h-[280px]"
        />
        <aside className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-accent">Procedura</p>
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
                  <span className={cn("min-w-0 break-words", ok ? "text-foreground" : "text-muted-foreground")}>
                    {s.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>

      {!isComplete ? (
        <InfoNote>
          Segui i suggerimenti che compaiono nel terminale: il server ti guida, esattamente come un
          FTP reale risponde passo dopo passo.
        </InfoNote>
      ) : (
        <SuccessNote>
          Hai enumerato un FTP con accesso anonimo: un solo file di appunti ti ha già rivelato dove
          dormono i backup. È il motivo per cui l'accesso anonimo andrebbe sempre disattivato.
        </SuccessNote>
      )}
    </div>
  );
}
