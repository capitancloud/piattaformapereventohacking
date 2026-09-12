import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Mode = "-sT" | "-sS";

const FLOWS: Record<Mode, { from: "us" | "them"; text: string; note: string }[]> = {
  "-sT": [
    { from: "us", text: "SYN", note: "Chiedi di aprire la connessione." },
    { from: "them", text: "SYN/ACK", note: "Il servizio accetta: la porta è aperta." },
    { from: "us", text: "ACK", note: "Completi la stretta di mano: la connessione esiste davvero." },
    { from: "us", text: "RST", note: "Chiudi subito dopo, ma il servizio ha già registrato la sessione." },
  ],
  "-sS": [
    { from: "us", text: "SYN", note: "Chiedi di aprire la connessione." },
    { from: "them", text: "SYN/ACK", note: "Il servizio accetta: la porta è aperta." },
    { from: "us", text: "RST", note: "Interrompi prima di completare: spesso il servizio non registra nulla." },
  ],
};

const CASES: { id: string; text: string; answer: Mode; why: string }[] = [
  {
    id: "noroot",
    text: "Lavori da un account senza privilegi di amministratore sulla macchina di attacco.",
    answer: "-sT",
    why: "Il SYN scan costruisce pacchetti grezzi e richiede privilegi elevati: senza, resta il connect scan.",
  },
  {
    id: "ids",
    text: "Hai i privilegi di root e vuoi limitare le tracce nei log applicativi del bersaglio.",
    answer: "-sS",
    why: "Senza connessione completata molti servizi non scrivono nulla nei propri log, anche se il firewall può comunque vedere i pacchetti.",
  },
  {
    id: "proxy",
    text: "Devi passare attraverso un proxy che gestisce solo connessioni TCP complete.",
    answer: "-sT",
    why: "Il proxy parla TCP normale: i pacchetti grezzi del SYN scan non lo attraverserebbero.",
  },
];

export default function Task05SynConnect({ markComplete, isComplete }: TaskContext) {
  const [mode, setMode] = useState<Mode>("-sT");
  const [frame, setFrame] = useState(0);
  const [running, setRunning] = useState(false);
  const [seen, setSeen] = useState<Mode[]>([]);
  const [picked, setPicked] = useState<Record<string, Mode>>({});
  const [checked, setChecked] = useState(false);

  const flow = FLOWS[mode];

  useEffect(() => {
    if (!running) return;
    if (frame >= flow.length) {
      setRunning(false);
      setSeen((s) => (s.includes(mode) ? s : [...s, mode]));
      return;
    }
    const t = setTimeout(() => setFrame((f) => f + 1), 700);
    return () => clearTimeout(t);
  }, [running, frame, flow.length, mode]);

  const quizReady = seen.length === 2 && Object.keys(picked).length === CASES.length;
  const quizOk = CASES.every((c) => picked[c.id] === c.answer);

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center gap-2">
          {(["-sT", "-sS"] as Mode[]).map((m) => (
            <Button
              key={m}
              size="sm"
              variant={mode === m ? "default" : "outline"}
              onClick={() => {
                setMode(m);
                setFrame(0);
                setRunning(false);
              }}
              className="font-mono"
            >
              {m} {m === "-sT" ? "connect" : "SYN"}
            </Button>
          ))}
          <Button
            size="sm"
            variant="secondary"
            disabled={running}
            onClick={() => {
              setFrame(0);
              setRunning(true);
            }}
          >
            <Play /> Esegui
          </Button>
        </div>

        <div className="mt-5 grid grid-cols-[70px_minmax(0,1fr)_70px] items-center gap-2 text-center text-[11px] uppercase tracking-widest text-muted-foreground">
          <span>Tu</span>
          <span />
          <span>Host</span>
        </div>

        <div className="mt-2 space-y-2">
          {flow.map((p, i) => {
            const visible = i < frame;
            return (
              <div key={i} className={cn("transition-opacity duration-500", visible ? "opacity-100" : "opacity-20")}>
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs",
                    p.from === "us"
                      ? "border-accent/40 bg-accent/10 text-ivory"
                      : "ml-auto border-success/40 bg-success/10 text-success",
                    p.from === "us" ? "mr-auto" : "",
                  )}
                  style={{ maxWidth: "88%" }}
                >
                  <span>{p.from === "us" ? "→" : "←"}</span>
                  <span>{p.text}</span>
                </div>
                {visible && (
                  <p className="mt-1 px-1 text-[11px] leading-relaxed text-muted-foreground">{p.note}</p>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Sequenze osservate: <span className="font-mono text-accent">{seen.join(" ") || "nessuna"}</span>
        </p>
      </div>

      {seen.length === 2 && (
        <div className="mt-4 space-y-3">
          {CASES.map((c) => {
            const value = picked[c.id];
            const right = checked && value === c.answer;
            return (
              <div
                key={c.id}
                className={cn(
                  "rounded-xl border border-border bg-surface p-4",
                  right && "border-success/60",
                  checked && value && !right && "border-destructive/60",
                )}
              >
                <p className="text-sm leading-relaxed text-foreground">{c.text}</p>
                <div className="mt-3 flex gap-2">
                  {(["-sT", "-sS"] as Mode[]).map((m) => (
                    <Button
                      key={m}
                      size="sm"
                      variant={value === m ? "default" : "outline"}
                      onClick={() => {
                        setChecked(false);
                        setPicked((p) => ({ ...p, [c.id]: m }));
                      }}
                      className="font-mono"
                    >
                      {m}
                    </Button>
                  ))}
                </div>
                {checked && value && (
                  <p className={cn("mt-3 text-xs leading-relaxed", right ? "text-muted-foreground" : "text-destructive")}>
                    {c.why}
                  </p>
                )}
              </div>
            );
          })}
          <Button
            className="w-full"
            disabled={!quizReady}
            onClick={() => {
              setChecked(true);
              if (quizOk) markComplete();
            }}
          >
            Verifica le scelte
          </Button>
        </div>
      )}

      {seen.length < 2 && (
        <InfoNote>
          Esegui entrambe le sequenze prima di rispondere: la differenza sta tutta nell'ultimo
          pacchetto, ma cambia sia i privilegi necessari sia le tracce lasciate.
        </InfoNote>
      )}
      {checked && !quizOk && (
        <WarnNote>
          Qualcosa non torna. Ricorda: il SYN scan chiede privilegi elevati e pacchetti costruiti a
          mano, il connect scan usa la normale funzione di sistema e passa ovunque.
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai capito perché esistono due scansioni TCP apparentemente identiche: non è una questione
          di potenza, ma di permessi disponibili e di tracce che sei disposto a lasciare.
        </SuccessNote>
      )}
    </div>
  );
}
