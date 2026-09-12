import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

type Card = { id: string; title: string; body: string[]; hot: boolean; why: string };

const CARDS: Card[] = [
  {
    id: "c1",
    title: "HKLM\\...\\Winlogon",
    body: ['AutoAdminLogon    REG_SZ    1', 'DefaultUserName   REG_SZ    Administrator', 'DefaultPassword   REG_SZ    "Estate2024!"'],
    hot: true,
    why: "Password amministratore in chiaro nel registro: privesc immediata.",
  },
  {
    id: "c2",
    title: "C:\\Windows\\Panther\\Unattend.xml",
    body: ["<AutoLogon>", "  <Password>", "    <Value>W1nd0ws2024#</Value>", "  </Password>", "</AutoLogon>"],
    hot: true,
    why: "File di risposta d'installazione dimenticato: contiene la password d'amministratore.",
  },
  {
    id: "c3",
    title: "HKLM\\...\\Uninstall",
    body: ["DisplayName    Notepad++", "Publisher      Notepad++ Team", "UninstallString ..."],
    hot: false,
    why: "Solo elenco software installato: nessuna credenziale.",
  },
  {
    id: "c4",
    title: "\\\\dominio\\SYSVOL\\...\\Groups.xml",
    body: ['<User name="admin"', '  cpassword="j1Uyj3Vx8Tu9wUB..." />'],
    hot: true,
    why: "Group Policy Preferences: cpassword decifrabile con chiave nota da Microsoft.",
  },
  {
    id: "c5",
    title: "C:\\Users\\Public\\readme.txt",
    body: ["Benvenuti sul PC del reparto.", "Contatti IT: helpdesk@azienda.it"],
    hot: false,
    why: "Nessuna credenziale, solo testo di benvenuto.",
  },
];

export default function Task08Registry({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [checked, setChecked] = useState(false);
  const hot = CARDS.filter((c) => c.hot).map((c) => c.id);
  const correct = hot.every((id) => picked.has(id)) && [...picked].every((id) => hot.includes(id));
  useEffect(() => { if (checked && correct) markComplete(); }, [checked, correct, markComplete]);

  return (
    <div>
      <div className="grid min-w-0 gap-3 md:grid-cols-2">
        {CARDS.map((c) => {
          const sel = picked.has(c.id);
          return (
            <button key={c.id} onClick={() => { setChecked(false); setPicked((p) => { const n = new Set(p); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n; }); }} className={cn("min-w-0 rounded-xl border p-4 text-left transition", sel ? "border-accent bg-accent/10" : "border-border bg-surface hover:border-accent/50", checked && c.hot && sel && "border-success/60", checked && !c.hot && sel && "border-destructive/60")}>
              <div className="font-mono text-xs text-gold-soft break-all">{c.title}</div>
              <pre className="mt-2 min-w-0 whitespace-pre-wrap break-words [overflow-wrap:anywhere] font-mono text-[11px] text-ivory/80">{c.body.join("\n")}</pre>
              {checked && sel && <div className={cn("mt-2 text-xs", c.hot ? "text-success" : "text-destructive")}>{c.why}</div>}
            </button>
          );
        })}
      </div>

      <Button className="mt-4 w-full" onClick={() => setChecked(true)}>Verifica selezione</Button>

      {!checked && <InfoNote>Clicca solo le finestre che contengono davvero credenziali sfruttabili.</InfoNote>}
      {checked && !correct && <WarnNote>Non ancora. Cerca Winlogon, Unattend e Groups.xml.</WarnNote>}
      {isComplete && <SuccessNote>Ottimo: tre giacimenti classici di credenziali dimenticate identificati correttamente.</SuccessNote>}
    </div>
  );
}
