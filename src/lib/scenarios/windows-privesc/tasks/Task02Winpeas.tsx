import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Row = { id: string; text: string; color: "red" | "yellow" | "gray"; hot: boolean; why: string };

const ROWS: Row[] = [
  { id: "r1", text: "[+] OS Version: Windows 10 Pro 22H2 (Build 19045.3803)", color: "gray", hot: false, why: "Info di contesto, non è una privesc." },
  { id: "r2", text: "[!] AlwaysInstallElevated: HKLM=1  HKCU=1", color: "red", hot: true, why: "Entrambe a 1: puoi installare .msi come SYSTEM." },
  { id: "r3", text: "[+] Antivirus: Windows Defender (attivo)", color: "gray", hot: false, why: "Non è una via di escalation." },
  { id: "r4", text: '[!] Service "VulnSvc" path: C:\\Program Files\\Vulnerable App\\svc.exe  (UNQUOTED)', color: "red", hot: true, why: "Unquoted service path sfruttabile se puoi scrivere in C:\\." },
  { id: "r5", text: "[+] Hostname: WIN10-DEV     Domain: WORKGROUP", color: "gray", hot: false, why: "Info di ricognizione." },
  { id: "r6", text: '[!] Credenziali salvate in HKLM\\...\\Winlogon: AutoAdminLogon=1  DefaultPassword="Estate2024!"', color: "red", hot: true, why: "Password in chiaro nel registro: privesc immediata." },
  { id: "r7", text: "[+] .NET Framework: 4.8", color: "gray", hot: false, why: "Info software, non sfruttabile in sé." },
  { id: "r8", text: "[~] Patch installate: 47 (ultima 15 giorni fa)", color: "yellow", hot: false, why: "Non entusiasmante ma non è un buco diretto." },
];

const NEEDED = 3;

export default function Task02Winpeas({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);

  const hot = ROWS.filter((r) => r.hot).map((r) => r.id);
  const correct = hot.every((id) => picked.has(id)) && [...picked].every((id) => hot.includes(id));

  useEffect(() => { if (checked && correct) markComplete(); }, [checked, correct, markComplete]);

  const toggle = (id: string) => {
    setChecked(false);
    setPicked((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  return (
    <div>
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-black p-4 font-mono text-[12px] leading-relaxed">
        <div className="mb-2 text-xs uppercase tracking-widest text-gold-soft">winPEAS.exe — output (clicca le righe davvero sospette)</div>
        <div className="space-y-1">
          {ROWS.map((r) => {
            const sel = picked.has(r.id);
            const color = r.color === "red" ? "text-destructive" : r.color === "yellow" ? "text-gold-soft" : "text-ivory/70";
            return (
              <button key={r.id} onClick={() => toggle(r.id)} className={cn("block w-full min-w-0 rounded border border-transparent px-2 py-1 text-left break-words [overflow-wrap:anywhere] transition", color, sel && "border-accent bg-accent/10")}>
                {r.text}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>Selezionate: {picked.size} / {NEEDED}</span>
        <Button size="sm" onClick={() => setChecked(true)}>Verifica selezione</Button>
      </div>

      {!checked && <InfoNote>Le righe con «[!]» in rosso sono quelle da guardare per prime. Il resto è contesto.</InfoNote>}
      {checked && !correct && <WarnNote>Non ancora: cerca le tre righe rosse con «[!]».</WarnNote>}
      {isComplete && <SuccessNote>Perfetto: hai isolato AlwaysInstallElevated, l'unquoted path e le credenziali salvate. Da qui parte la scalata.</SuccessNote>}
    </div>
  );
}
