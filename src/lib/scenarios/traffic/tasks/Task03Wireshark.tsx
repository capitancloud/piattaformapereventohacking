import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Area = "list" | "details" | "bytes";

const PACKETS = [
  { n: 1, t: "0.000", src: "192.168.1.10", dst: "192.168.1.1", proto: "DNS", info: "Standard query A example.com" },
  { n: 2, t: "0.021", src: "192.168.1.1", dst: "192.168.1.10", proto: "DNS", info: "Response A 93.184.216.34" },
  { n: 3, t: "0.045", src: "192.168.1.10", dst: "93.184.216.34", proto: "TCP", info: "50122 → 80 [SYN]" },
  { n: 4, t: "0.089", src: "93.184.216.34", dst: "192.168.1.10", proto: "TCP", info: "80 → 50122 [SYN, ACK]" },
  { n: 5, t: "0.090", src: "192.168.1.10", dst: "93.184.216.34", proto: "HTTP", info: "GET /index.html" },
];

const HEX = "45 00 00 3c 1c 46 40 00 40 06 b1 e6 c0 a8 01 0a 5d b8 d8 22 c3 aa 00 50 00 00 00 00 00 00 00 00";

const PROMPTS: { id: Area; question: string }[] = [
  { id: "list", question: "Clicca l'area che elenca tutti i pacchetti" },
  { id: "details", question: "Clicca l'area che mostra i dettagli livello per livello" },
  { id: "bytes", question: "Clicca l'area con i byte grezzi in esadecimale" },
];

export default function Task03Wireshark({ markComplete, isComplete }: TaskContext) {
  const [step, setStep] = useState(0);
  const [wrong, setWrong] = useState<Area | null>(null);
  const [done, setDone] = useState<Set<Area>>(new Set());

  const target = PROMPTS[step];

  const click = (a: Area) => {
    if (!target) return;
    if (a === target.id) {
      const nd = new Set(done);
      nd.add(a);
      setDone(nd);
      setWrong(null);
      if (step + 1 >= PROMPTS.length) markComplete();
      else setStep(step + 1);
    } else {
      setWrong(a);
      setTimeout(() => setWrong(null), 600);
    }
  };

  const ringFor = (a: Area) => cn(
    "cursor-pointer transition ring-2 ring-transparent",
    done.has(a) && "ring-success/70",
    wrong === a && "ring-destructive animate-pulse",
    target?.id === a && !done.has(a) && "ring-accent/50",
    "hover:ring-accent",
  );

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="font-mono text-xs uppercase tracking-widest text-accent">
            {isComplete ? "Tour completato" : `Passo ${step + 1}/${PROMPTS.length}: ${target?.question}`}
          </div>
          <div className="flex gap-1">
            {(["list", "details", "bytes"] as Area[]).map((a) => (
              <span key={a} className={cn("h-2 w-6 rounded-full", done.has(a) ? "bg-success" : "bg-border")} />
            ))}
          </div>
        </div>

        <div className="min-w-0 overflow-hidden rounded-lg border border-border bg-black">
          <div className="border-b border-border bg-surface-2 px-3 py-1.5 font-mono text-[10px] text-muted-foreground">
            Wireshark · capture.pcap
          </div>

          <div onClick={() => click("list")} className={cn("min-w-0 overflow-x-auto", ringFor("list"))}>
            <div className="border-b border-border/60 px-3 py-1 text-[10px] uppercase tracking-widest text-gold-soft">Packet list</div>
            <table className="min-w-[640px] w-full text-[11px]">
              <tbody>
                {PACKETS.map((p) => (
                  <tr key={p.n} className="border-b border-border/40">
                    <td className="w-8 px-2 py-1 font-mono text-muted-foreground">{p.n}</td>
                    <td className="w-14 px-2 py-1 font-mono text-muted-foreground">{p.t}</td>
                    <td className="px-2 py-1 font-mono text-ivory">{p.src}</td>
                    <td className="px-2 py-1 font-mono text-ivory">{p.dst}</td>
                    <td className="w-14 px-2 py-1 font-mono text-accent">{p.proto}</td>
                    <td className="px-2 py-1 text-ivory/80">{p.info}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div onClick={() => click("details")} className={ringFor("details")}>
            <div className="border-y border-border/60 px-3 py-1 text-[10px] uppercase tracking-widest text-gold-soft">Packet details</div>
            <div className="space-y-0.5 px-3 py-2 font-mono text-[11px] text-ivory/85 [&>div]:break-words [&>div]:[overflow-wrap:anywhere]">
              <div>▶ Frame 5: 78 bytes on wire</div>
              <div>▶ Ethernet II, Src: aa:bb:cc:11:22:33, Dst: 11:22:33:aa:bb:cc</div>
              <div>▼ Internet Protocol Version 4</div>
              <div className="pl-4 text-muted-foreground">Source: 192.168.1.10</div>
              <div className="pl-4 text-muted-foreground">Destination: 93.184.216.34</div>
              <div>▶ Transmission Control Protocol, Src Port: 50122, Dst Port: 80</div>
              <div>▶ Hypertext Transfer Protocol</div>
            </div>
          </div>

          <div onClick={() => click("bytes")} className={ringFor("bytes")}>
            <div className="border-y border-border/60 px-3 py-1 text-[10px] uppercase tracking-widest text-gold-soft">Packet bytes</div>
            <div className="break-all px-3 py-2 font-mono text-[11px] leading-relaxed text-ivory/80">
              0000  {HEX}
            </div>
          </div>
        </div>
      </div>

      {done.size === 3 && (
        <div className="mt-3 inline-flex items-center gap-1 text-xs text-success">
          <CheckCircle2 className="h-3.5 w-3.5" /> hai identificato tutte le aree
        </div>
      )}

      {!isComplete ? (
        <InfoNote>Le tre aree lavorano insieme: clicchi un pacchetto in alto, lo espandi al centro e vedi i byte in basso.</InfoNote>
      ) : (
        <SuccessNote>Perfetto. Ora conosci la mappa di Wireshark come le tue tasche.</SuccessNote>
      )}
    </div>
  );
}
