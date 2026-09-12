import { useState } from "react";
import { InteractiveTerminal, type TermResponse } from "@/components/lab/InteractiveTerminal";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const CLAIMS: { id: string; text: string; answer: "fatto" | "indizio"; why: string }[] = [
  {
    id: "banner",
    text: "Il servizio sulla 22 ha risposto con la stringa «OpenSSH 8.9p1 Ubuntu».",
    answer: "fatto",
    why: "È esattamente ciò che il servizio ha inviato: puoi citarlo come risposta osservata.",
  },
  {
    id: "version",
    text: "Sul server gira davvero OpenSSH 8.9p1 e nient'altro.",
    answer: "indizio",
    why: "Il banner può essere modificato o mantenuto dopo una patch: la versione reale va confermata diversamente.",
  },
  {
    id: "os",
    text: "L'impronta dello stack dice Linux 5.x con confidenza 94%.",
    answer: "indizio",
    why: "L'OS fingerprint è una stima statistica; firewall e macchine virtuali la alterano facilmente.",
  },
  {
    id: "http",
    text: "La porta 80 risponde con intestazione «Server: nginx».",
    answer: "fatto",
    why: "L'intestazione è stata ricevuta: è un dato osservato, anche se può essere volutamente generica.",
  },
];

export default function Task07Versions({ markComplete, isComplete }: TaskContext) {
  const [ranSV, setRanSV] = useState(false);
  const [ranO, setRanO] = useState(false);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const handle = (cmd: string): TermResponse | TermResponse[] => {
    const c = cmd.toLowerCase();
    if (c.includes("--version-intensity")) {
      return [
        { text: "Intensità impostata: più sonde inviate, risposta più precisa ma più rumorosa.", kind: "info" },
        { text: "22/tcp  open  ssh  OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)" },
      ];
    }
    if (c.includes("-sv")) {
      setRanSV(true);
      return [
        { text: "Starting Nmap 7.94 ( https://nmap.org ) - scansione simulata", kind: "info" },
        { text: "PORT    STATE SERVICE  VERSION" },
        { text: "22/tcp  open  ssh      OpenSSH 8.9p1 Ubuntu 3ubuntu0.6" },
        { text: "80/tcp  open  http     nginx 1.18.0" },
        { text: "443/tcp open  ssl/http nginx 1.18.0" },
        { text: "Service detection performed. 3 servizi identificati su 3." },
      ];
    }
    if (c.includes("-o")) {
      setRanO(true);
      return [
        { text: "OS detection: invio di sonde con flag TCP insolite…", kind: "info" },
        { text: "Device type: general purpose" },
        { text: "Running: Linux 5.X" },
        { text: "OS CPE: cpe:/o:linux:linux_kernel:5" },
        { text: "Aggressive OS guesses: Linux 5.4 - 5.15 (94%)" },
        { text: "Nota: stima probabilistica, non una prova.", kind: "info" },
      ];
    }
    if (c.includes("help") || c === "?") {
      return [{ text: "Comandi disponibili: -sV, -O, --version-intensity 7", kind: "info" }];
    }
    return { text: `Comando non riconosciuto in questa simulazione: ${cmd}`, kind: "err" };
  };

  const bothRun = ranSV && ranO;
  const ok = CLAIMS.every((c) => picked[c.id] === c.answer);

  return (
    <div>
      <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_230px]">
        <InteractiveTerminal
          title="nmap 10.10.5.20 — laboratorio simulato"
          prompt="kali@lab:~$ "
          onCommand={handle}
        />
        <aside className="min-w-0 rounded-xl border border-border bg-surface p-4">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Da provare</p>
          <ul className="mt-3 space-y-2 text-xs">
            <li className={cn("flex min-w-0 gap-2", ranSV ? "text-success" : "text-muted-foreground")}>
              <span>{ranSV ? "✓" : "○"}</span>
              <span className="min-w-0 break-all font-mono">-sV</span>
            </li>
            <li className={cn("flex min-w-0 gap-2", ranO ? "text-success" : "text-muted-foreground")}>
              <span>{ranO ? "✓" : "○"}</span>
              <span className="min-w-0 break-all font-mono">-O</span>
            </li>
            <li className="flex min-w-0 gap-2 text-muted-foreground">
              <span>○</span>
              <span className="min-w-0 break-all font-mono">--version-intensity 7</span>
            </li>
          </ul>
          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground">
            Dopo aver letto l'output, classifica le quattro affermazioni qui sotto.
          </p>
        </aside>
      </div>

      {bothRun && (
        <div className="mt-4 space-y-3">
          {CLAIMS.map((c) => {
            const v = picked[c.id];
            const right = checked && v === c.answer;
            return (
              <div
                key={c.id}
                className={cn(
                  "rounded-xl border border-border bg-surface p-4",
                  right && "border-success/60",
                  checked && v && !right && "border-destructive/60",
                )}
              >
                <p className="text-sm leading-relaxed text-foreground">{c.text}</p>
                <div className="mt-3 flex gap-2">
                  {(["fatto", "indizio"] as const).map((k) => (
                    <Button
                      key={k}
                      size="sm"
                      variant={v === k ? "default" : "outline"}
                      onClick={() => {
                        setChecked(false);
                        setPicked((p) => ({ ...p, [c.id]: k }));
                      }}
                    >
                      {k === "fatto" ? "Dato osservato" : "Solo un indizio"}
                    </Button>
                  ))}
                </div>
                {checked && v && (
                  <p className={cn("mt-3 text-xs leading-relaxed", right ? "text-muted-foreground" : "text-destructive")}>
                    {c.why}
                  </p>
                )}
              </div>
            );
          })}
          <Button
            className="w-full"
            disabled={Object.keys(picked).length < CLAIMS.length}
            onClick={() => {
              setChecked(true);
              if (ok) markComplete();
            }}
          >
            Valuta le affermazioni
          </Button>
        </div>
      )}

      {!bothRun && (
        <InfoNote>
          Lancia almeno <code className="font-mono">-sV</code> e <code className="font-mono">-O</code>. Il primo
          interroga i servizi, il secondo prova a indovinare il sistema operativo dal comportamento
          dello stack di rete.
        </InfoNote>
      )}
      {checked && !ok && (
        <WarnNote>
          Distingui ciò che il bersaglio ha detto da ciò che tu hai concluso. Una stringa ricevuta è
          un dato; ciò che quella stringa implica è un'ipotesi da verificare.
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai raccolto versioni e impronta del sistema mantenendo la separazione più importante del
          mestiere: il banner è una risposta, non un certificato di verità.
        </SuccessNote>
      )}
    </div>
  );
}
