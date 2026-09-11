import { useState } from "react";
import { Terminal, type TermLine } from "@/components/lab/Terminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";

const TARGET = "10.10.24.17";

export default function Task01Recon({ markComplete, isComplete }: TaskContext) {
  const [ip, setIp] = useState("");
  const [lines, setLines] = useState<TermLine[]>([]);

  const scan = () => {
    if (!ip) return;
    const found = ip.trim() === TARGET;
    const base: TermLine[] = [
      { kind: "prompt", text: `nmap -sV -Pn ${ip}` },
      { kind: "info", text: "Starting Nmap 7.94 ( https://nmap.org )" },
      { kind: "out", text: `Nmap scan report for ${ip}` },
      { kind: "out", text: "Host is up (0.014s latency)." },
    ];
    if (found) {
      setLines([
        ...base,
        { kind: "out", text: "PORT     STATE SERVICE   VERSION" },
        { kind: "out", text: "80/tcp   open  http      Microsoft IIS httpd 10.0" },
        { kind: "out", text: "135/tcp  open  msrpc     Microsoft Windows RPC" },
        { kind: "out", text: "445/tcp  open  microsoft-ds Windows Server 2019" },
        { kind: "out", text: "3389/tcp open  ms-wbt-server Microsoft Terminal Services" },
        { kind: "info", text: "Service Info: OS: Windows; CPE: cpe:/o:microsoft:windows" },
      ]);
      markComplete();
    } else {
      setLines([
        ...base,
        { kind: "err", text: "All 1000 scanned ports on host are filtered" },
        { kind: "err", text: "No exposed services found." },
      ]);
    }
  };

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <input
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="IP del target..."
          className="flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-ivory outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
        />
        <button
          onClick={scan}
          className="rounded-md bg-gold px-4 py-2 text-xs font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
        >
          Avvia scan
        </button>
      </div>
      <Terminal
        title="kali@attacker: ~"
        prompt="kali@attacker:~$ "
        lines={lines}
      />

      {!isComplete && (
        <InfoNote>
          Prima di ogni attacco c'è la ricognizione. Un <code>nmap</code> mostra quali
          porte sono aperte e quale software le espone. In questa palestra il target è{" "}
          <code className="text-gold">{TARGET}</code>. Inseriscilo qui sopra e lancia lo
          scan.
        </InfoNote>
      )}

      {isComplete && (
        <SuccessNote>
          Il banner conferma <strong>Microsoft IIS 10.0 su Windows Server 2019</strong>.
          Sappiamo cosa c'è dall'altra parte: un web server che sa eseguire pagine{" "}
          <code>.aspx</code>. È esattamente il tipo di server su cui una reverse shell
          basata su ASPX/PowerShell è efficace.
        </SuccessNote>
      )}
    </div>
  );
}
