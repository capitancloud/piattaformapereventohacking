import { useState } from "react";
import { Cloud, Network, ShieldOff } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Scene = {
  id: string;
  title: string;
  map: string;
  situation: string;
  icon: typeof Network;
  options: { flag: string; label: string; ok: boolean; why: string }[];
};

const SCENES: Scene[] = [
  {
    id: "lan",
    title: "Segmento locale dell'ufficio",
    map: "192.168.10.0/24 · stessa rete fisica",
    situation:
      "Sei collegato allo stesso switch dei computer da censire e hai i privilegi di amministratore sulla tua macchina.",
    icon: Network,
    options: [
      { flag: "-PR (ARP ping)", label: "Scoperta ARP", ok: true, why: "Nella stessa rete ARP è rapidissimo e nessun firewall host può ignorarlo: è la scelta naturale." },
      { flag: "-PE (ICMP echo)", label: "Ping ICMP", ok: false, why: "Funziona, ma molti host Windows bloccano l'echo e finirebbero fuori dall'inventario." },
      { flag: "-Pn", label: "Salta la scoperta", ok: false, why: "Scansioneresti 254 indirizzi anche se vuoti: tempo sprecato e rumore inutile." },
    ],
  },
  {
    id: "internet",
    title: "Server esposti su Internet",
    map: "aurora.example · tre indirizzi pubblici",
    situation:
      "I sistemi sono dietro un provider che scarta gli echo ICMP, ma il sito web pubblico risponde regolarmente.",
    icon: Cloud,
    options: [
      { flag: "-PR (ARP ping)", label: "Scoperta ARP", ok: false, why: "ARP non attraversa i router: fuori dalla rete locale non produce alcun risultato." },
      { flag: "-PS443,80", label: "Ping TCP sulle porte web", ok: true, why: "Bussi dove sai che qualcuno risponde: la scoperta riesce anche senza ICMP." },
      { flag: "-PE (ICMP echo)", label: "Ping ICMP", ok: false, why: "Con l'echo filtrato gli host sembrerebbero tutti spenti e li escluderesti per errore." },
    ],
  },
  {
    id: "dmz",
    title: "DMZ con filtro aggressivo",
    map: "10.40.0.0/28 · host noti dal cliente",
    situation:
      "Il cliente ti conferma per iscritto che quattro host sono attivi, ma ogni tentativo di scoperta viene scartato dal firewall.",
    icon: ShieldOff,
    options: [
      { flag: "-PS443,80", label: "Ping TCP sulle porte web", ok: false, why: "Il filtro scarta anche questi probe: continueresti a considerare spenti host che sai essere accesi." },
      { flag: "-Pn", label: "Tratta gli host come attivi", ok: true, why: "Sapendo già che gli host esistono, salti la scoperta e passi direttamente alla scansione delle porte." },
      { flag: "-sn", label: "Solo scoperta, niente porte", ok: false, why: "Restituirebbe una lista vuota: non ottieni alcuna informazione utile." },
    ],
  },
];

export default function Task04Discovery({ markComplete, isComplete }: TaskContext) {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState<{ flag: string; ok: boolean; why: string } | null>(null);
  const scene = SCENES[Math.min(step, SCENES.length - 1)]!;
  const done = step >= SCENES.length;
  const Icon = scene.icon;

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex items-center gap-2">
          {SCENES.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                i < step ? "bg-accent" : "bg-border",
              )}
            />
          ))}
        </div>

        {done ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Tre reti, tre modi diversi di scoprire chi è vivo.
          </p>
        ) : (
          <>
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/20">
                <Icon className="h-5 w-5 text-accent" />
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">{scene.title}</p>
                <p className="font-mono text-[11px] text-muted-foreground break-all">{scene.map}</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{scene.situation}</p>

            <div className="mt-4 grid gap-2">
              {scene.options.map((o) => (
                <button
                  key={o.flag}
                  onClick={() => {
                    setFeedback(o);
                    if (o.ok) {
                      const next = step + 1;
                      setStep(next);
                      if (next >= SCENES.length) markComplete();
                    }
                  }}
                  className="rounded-lg border border-border bg-background p-3 text-left transition hover:border-accent/60 active:scale-[0.99]"
                >
                  <code className="font-mono text-xs text-accent">{o.flag}</code>
                  <span className="ml-2 text-sm text-foreground">{o.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {feedback && (
          <p
            className={cn(
              "mt-4 rounded-lg border p-3 text-xs leading-relaxed",
              feedback.ok
                ? "border-success/40 bg-success/10 text-ivory/90"
                : "border-destructive/40 bg-destructive/10 text-ivory/90",
            )}
          >
            {feedback.why}
          </p>
        )}
      </div>

      {!isComplete && (
        <InfoNote>
          Prima di scansionare le porte conviene sapere chi è acceso. Il metodo giusto dipende da
          dove ti trovi rispetto al bersaglio e da cosa il firewall lascia passare.
        </InfoNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai scelto la scoperta adatta a ogni contesto: così eviti di scansionare indirizzi vuoti e,
          soprattutto, di dichiarare spento un host che era soltanto silenzioso.
        </SuccessNote>
      )}
    </div>
  );
}
