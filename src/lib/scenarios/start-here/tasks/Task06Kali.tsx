import { useState } from "react";
import { Download, HardDrive, Cpu, Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const STEPS = [
  { id: "dl", icon: Download, name: "Scarica Kali", correct: "vm-image", options: [
    { id: "vm-image", label: "L'immagine VirtualBox già pronta da kali.org (Virtual Machines)" },
    { id: "torrent-mirror", label: "Un torrent trovato su un forum" },
    { id: "old-iso", label: "Una ISO del 2016 perché «tanto Kali è Kali»" },
  ], why: "Il sito ufficiale offre un'immagine .ova preconfigurata: la importi con un doppio clic." },
  { id: "cpu", icon: Cpu, name: "Assegna le risorse", correct: "2cpu-4gb", options: [
    { id: "2cpu-4gb", label: "2 CPU, 4 GB di RAM, 40 GB di disco" },
    { id: "all-cpu", label: "Tutte le CPU e tutta la RAM del PC" },
    { id: "1cpu-1gb", label: "1 CPU e 1 GB di RAM" },
  ], why: "Un compromesso ragionevole: Kali va fluida senza affamare il PC ospite." },
  { id: "net", icon: HardDrive, name: "Rete della VM", correct: "nat", options: [
    { id: "bridge", label: "Bridged: la VM prende un IP dalla rete di casa" },
    { id: "nat", label: "NAT: la VM esce su Internet ma resta invisibile alla LAN" },
    { id: "host-only-solo", label: "Host-only: la VM non ha alcun accesso a Internet, ideale per aggiornare Kali" },
  ], why: "Per aggiornare Kali serve Internet, ma non vogliamo esporla alla LAN: NAT è il default sicuro." },
  { id: "boot", icon: Play, name: "Primo avvio", correct: "kali-kali", options: [
    { id: "kali-kali", label: "Login predefinito: kali / kali (da cambiare subito)" },
    { id: "root-toor", label: "Login: root / toor (default storico ancora attivo)" },
    { id: "admin-admin", label: "Login: admin / admin" },
  ], why: "Dalla versione 2020.1 Kali usa un utente non-root. La prima cosa da fare è cambiare la password." },
];

export default function Task06Kali({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const all = STEPS.every((s) => picked[s.id]);
  const score = STEPS.filter((s) => picked[s.id] === s.correct).length;

  return (
    <div className="space-y-3">
      {STEPS.map((s) => {
        const value = picked[s.id];
        return (
          <div key={s.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="mb-2 flex items-center gap-2">
              <s.icon className="h-4 w-4 text-accent" />
              <p className="text-sm font-semibold text-foreground">{s.name}</p>
            </div>
            <div className="space-y-2">
              {s.options.map((o) => {
                const active = value === o.id;
                const right = checked && active && o.id === s.correct;
                const wrong = checked && active && o.id !== s.correct;
                return (
                  <button
                    key={o.id}
                    onClick={() => { setChecked(false); setPicked((p) => ({ ...p, [s.id]: o.id })); }}
                    className={cn(
                      "flex w-full min-w-0 items-start gap-2 rounded-md border p-2 text-left text-xs transition",
                      active ? "border-accent bg-accent/10" : "border-border bg-background hover:border-accent/40",
                      right && "border-success/60",
                      wrong && "border-destructive/60",
                    )}
                  >
                    <span className={cn("mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border", active ? "border-accent bg-accent text-primary-foreground" : "border-border")}>
                      {active && <Check className="h-2.5 w-2.5" />}
                    </span>
                    <span className="min-w-0 flex-1 text-foreground/90">{o.label}</span>
                  </button>
                );
              })}
            </div>
            {checked && value === s.correct && (
              <p className="mt-2 text-xs leading-snug text-muted-foreground">{s.why}</p>
            )}
          </div>
        );
      })}

      <Button className="w-full" disabled={!all} onClick={() => { setChecked(true); if (score === STEPS.length) markComplete(); }}>
        Avvia la macchina
      </Button>

      {!checked && <InfoNote>Kali è una distribuzione Linux già piena di strumenti di sicurezza. Non serve installare nulla per iniziare.</InfoNote>}
      {checked && score < STEPS.length && <WarnNote>{score} su {STEPS.length}. Correggi le scelte segnate in rosso.</WarnNote>}
      {isComplete && <SuccessNote>Kali è viva. Ora ci serve una vittima Windows con cui farla dialogare.</SuccessNote>}
    </div>
  );
}
