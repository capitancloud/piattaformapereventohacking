import { useState } from "react";
import { InteractiveTerminal, type TermResponse } from "@/components/lab/InteractiveTerminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

interface Row {
  n: number;
  t: string;
  src: string;
  dst: string;
  proto: string;
  info: string;
  host?: string;
}

const PACKETS: Row[] = [
  { n: 1, t: "0.000", src: "10.0.0.10", dst: "8.8.8.8", proto: "DNS", info: "A example.com" },
  { n: 2, t: "0.021", src: "8.8.8.8", dst: "10.0.0.10", proto: "DNS", info: "Response 93.184.216.34" },
  { n: 3, t: "0.045", src: "10.0.0.10", dst: "93.184.216.34", proto: "TCP", info: "50122 → 80 [SYN]" },
  { n: 4, t: "0.089", src: "93.184.216.34", dst: "10.0.0.10", proto: "TCP", info: "80 → 50122 [SYN, ACK]" },
  { n: 5, t: "0.091", src: "10.0.0.10", dst: "93.184.216.34", proto: "HTTP", info: "GET / HTTP/1.1", host: "example.com" },
  { n: 6, t: "0.230", src: "10.0.0.10", dst: "1.1.1.1", proto: "DNS", info: "A shop.example" },
  { n: 7, t: "0.240", src: "10.0.0.10", dst: "203.0.113.5", proto: "HTTP", info: "POST /login", host: "shop.example" },
  { n: 8, t: "0.400", src: "10.0.0.10", dst: "203.0.113.5", proto: "HTTPS", info: "TLSv1.3 Client Hello" },
];

export default function Task09Tshark({ markComplete, isComplete }: TaskContext) {
  const [readPcap, setReadPcap] = useState(false);
  const [usedFilter, setUsedFilter] = useState(false);
  const [usedFields, setUsedFields] = useState(false);

  const done = readPcap && usedFilter && usedFields;

  const handle = (raw: string): TermResponse | TermResponse[] => {
    const cmd = raw.trim();
    const low = cmd.toLowerCase();

    if (low === "help" || low === "?") {
      return [
        { text: "Esempi:", kind: "info" },
        { text: "  tshark -r capture.pcap", kind: "info" },
        { text: "  tshark -r capture.pcap -Y \"http\"", kind: "info" },
        { text: "  tshark -r capture.pcap -Y \"http.request\" -T fields -e ip.src -e http.host", kind: "info" },
      ];
    }
    if (low === "clear" || low === "cls") return { text: "", kind: "out" };

    if (!/^tshark\s+/i.test(cmd)) {
      return { text: `'${cmd}': non riconosciuto. Prova con 'tshark -r capture.pcap' o 'help'.`, kind: "err" };
    }

    const readMatch = cmd.match(/-r\s+(\S+)/);
    if (!readMatch) return { text: "tshark: manca -r <file>. Usa: tshark -r capture.pcap", kind: "err" };
    if (!/capture\.pcap/i.test(readMatch[1]!)) return { text: `tshark: file ${readMatch[1]} non trovato.`, kind: "err" };
    setReadPcap(true);

    let rows = [...PACKETS];
    const filterMatch = cmd.match(/-Y\s+"([^"]+)"|-Y\s+(\S+)/);
    if (filterMatch) {
      setUsedFilter(true);
      const f = (filterMatch[1] || filterMatch[2] || "").toLowerCase();
      if (f === "http") rows = rows.filter((r) => r.proto === "HTTP");
      else if (f === "http.request") rows = rows.filter((r) => r.proto === "HTTP" && r.info.startsWith("GET") || r.proto === "HTTP" && r.info.startsWith("POST"));
      else if (f === "dns") rows = rows.filter((r) => r.proto === "DNS");
      else if (/^tcp\.port\s*==\s*80$/.test(f)) rows = rows.filter((r) => /→ 80|80 →/.test(r.info));
      else if (/^ip\.addr\s*==\s*(\S+)$/.test(f)) {
        const ip = f.match(/^ip\.addr\s*==\s*(\S+)$/)![1]!;
        rows = rows.filter((r) => r.src === ip || r.dst === ip);
      } else {
        rows = [];
      }
    }

    const limitMatch = cmd.match(/-c\s+(\d+)/);
    if (limitMatch) rows = rows.slice(0, parseInt(limitMatch[1]!, 10));

    const fieldMatches = [...cmd.matchAll(/-e\s+(\S+)/g)].map((m) => m[1]!);
    if (/-T\s+fields/i.test(cmd) && fieldMatches.length > 0) {
      setUsedFields(true);
      const lines = rows.map((r) => fieldMatches.map((f) => {
        if (f === "ip.src") return r.src;
        if (f === "ip.dst") return r.dst;
        if (f === "http.host") return r.host ?? "";
        if (f === "frame.number") return String(r.n);
        if (f === "_ws.col.Protocol") return r.proto;
        return "";
      }).join("\t"));
      if (done || (readPcap && usedFilter)) markComplete();
      return lines.length ? lines.map((l) => ({ text: l, kind: "out" as const })) : [{ text: "(nessun risultato)", kind: "info" }];
    }

    if (readPcap && usedFilter && usedFields) markComplete();
    return rows.map((r) => ({
      text: `${String(r.n).padEnd(3)} ${r.t.padEnd(6)} ${r.src.padEnd(15)} → ${r.dst.padEnd(15)} ${r.proto.padEnd(5)} ${r.info}`,
      kind: "out" as const,
    }));
  };

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <InteractiveTerminal title="tshark" prompt="kali@lab:~$ " heightClass="min-h-[280px]" onCommand={handle} />

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Checklist</div>
          <ul className="space-y-2 text-sm">
            {[
              { done: readPcap, label: "Leggi capture.pcap con -r" },
              { done: usedFilter, label: "Applica un filtro con -Y" },
              { done: usedFields, label: "Estrai campi con -T fields -e" },
            ].map((s, i) => (
              <li key={i} className={cn("flex items-start gap-2", s.done ? "text-foreground" : "text-muted-foreground")}>
                <span className={cn("mt-1 h-2 w-2 rounded-full", s.done ? "bg-success" : "bg-border")} />
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 text-[10px] text-muted-foreground">Digita <span className="font-mono">help</span> per esempi rapidi.</div>
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Prova questa sequenza: <span className="font-mono">tshark -r capture.pcap</span>, poi <span className="font-mono">tshark -r capture.pcap -Y "http"</span>, poi <span className="font-mono">tshark -r capture.pcap -Y "http.request" -T fields -e ip.src -e http.host</span>.</InfoNote>
      ) : (
        <SuccessNote>tshark ti dà l'80% di Wireshark in una riga. Perfetto per script e server senza interfaccia.</SuccessNote>
      )}
    </div>
  );
}
