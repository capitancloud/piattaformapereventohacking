import { useState } from "react";
import { FileCode2, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const FORMATS: Record<string, { label: string; sample: string }> = {
  "-oN": {
    label: "Normal · leggibile da una persona",
    sample: `Nmap scan report for 10.10.5.20
Host is up (0.0021s latency).
PORT    STATE SERVICE  VERSION
22/tcp  open  ssh      OpenSSH 8.9p1
80/tcp  open  http     nginx 1.18.0
443/tcp open  ssl/http nginx 1.18.0`,
  },
  "-oX": {
    label: "XML · pensato per altri programmi",
    sample: `<host>
  <address addr="10.10.5.20" addrtype="ipv4"/>
  <ports>
    <port protocol="tcp" portid="22">
      <state state="open"/>
      <service name="ssh" product="OpenSSH" version="8.9p1"/>
    </port>
  </ports>
</host>`,
  },
  "-oG": {
    label: "Grepable · una riga per host",
    sample: `Host: 10.10.5.20 ()  Ports: 22/open/tcp//ssh///, 80/open/tcp//http///, 443/open/tcp//ssl|http///`,
  },
  "-oA": {
    label: "Tutti e tre insieme, stesso nome base",
    sample: `scan-aurora.nmap
scan-aurora.xml
scan-aurora.gnmap`,
  },
};

const NEEDS: { id: string; icon: typeof FileText; text: string; answer: string; why: string }[] = [
  {
    id: "read",
    icon: FileText,
    text: "Vuoi rileggere la scansione stasera e incollarne un estratto nel rapporto per il cliente.",
    answer: "-oN",
    why: "Il formato normale è pensato per gli occhi: colonne allineate e nessun markup di mezzo.",
  },
  {
    id: "import",
    icon: FileCode2,
    text: "Devi importare i risultati in uno strumento di gestione delle vulnerabilità.",
    answer: "-oX",
    why: "L'XML è strutturato: ogni host, porta e servizio è un campo che un programma sa leggere senza ambiguità.",
  },
  {
    id: "grep",
    icon: Search,
    text: "Su venti host vuoi estrarre al volo solo quelli con la porta 445 aperta, da riga di comando.",
    answer: "-oG",
    why: "Il formato grepable mette tutto su una riga per host: perfetto per filtrare con grep o awk.",
  },
];

export default function Task09Output({ markComplete, isComplete }: TaskContext) {
  const [preview, setPreview] = useState<string>("-oN");
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const ok = NEEDS.every((n) => picked[n.id] === n.answer);

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="flex flex-wrap gap-2">
          {Object.keys(FORMATS).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={preview === f ? "default" : "outline"}
              onClick={() => setPreview(f)}
              className="font-mono"
            >
              {f}
            </Button>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{FORMATS[preview]!.label}</p>
        <div className="mt-3 min-w-0 overflow-hidden rounded-lg border border-border bg-black p-4">
          <pre className="min-w-0 overflow-x-auto whitespace-pre-wrap break-words [overflow-wrap:anywhere] font-mono text-[11px] leading-relaxed text-ivory/90">
{FORMATS[preview]!.sample}
          </pre>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {NEEDS.map((n) => {
          const v = picked[n.id];
          const right = checked && v === n.answer;
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className={cn(
                "rounded-xl border border-border bg-surface p-4",
                right && "border-success/60",
                checked && v && !right && "border-destructive/60",
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p className="text-sm leading-relaxed text-foreground">{n.text}</p>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.keys(FORMATS).map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={v === f ? "default" : "outline"}
                    onClick={() => {
                      setChecked(false);
                      setPreview(f);
                      setPicked((p) => ({ ...p, [n.id]: f }));
                    }}
                    className="font-mono"
                  >
                    {f}
                  </Button>
                ))}
              </div>
              {checked && v && (
                <p className={cn("mt-3 text-xs leading-relaxed", right ? "text-muted-foreground" : "text-destructive")}>
                  {n.why}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <Button
        className="mt-4 w-full"
        disabled={Object.keys(picked).length < NEEDS.length}
        onClick={() => {
          setChecked(true);
          if (ok) markComplete();
        }}
      >
        Verifica le scelte di formato
      </Button>

      {!checked && (
        <InfoNote>
          Una scansione senza output salvato è un lavoro che dovrai rifare. Prova le anteprime: lo
          stesso risultato cambia forma a seconda di chi deve leggerlo, una persona o un programma.
        </InfoNote>
      )}
      {isComplete && (
        <SuccessNote>
          Hai imparato a salvare i risultati nel formato giusto per chi li userà. Nel dubbio esiste
          <code className="mx-1 font-mono">-oA</code>, che li produce tutti con un nome base comune.
        </SuccessNote>
      )}
    </div>
  );
}
