import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const VENDORS: Record<string, string> = {
  "3C:22:FB": "Apple",
  "00:1A:11": "Google",
  "F4:0F:24": "Intel",
  "B8:27:EB": "Raspberry Pi",
  "00:1B:63": "Cisco",
  "AC:DE:48": "Samsung",
};

const ITEMS = [
  { mac: "3C:22:FB:AA:11:22", vendor: "Apple" },
  { mac: "F4:0F:24:9E:2D:01", vendor: "Intel" },
  { mac: "B8:27:EB:12:34:56", vendor: "Raspberry Pi" },
  { mac: "00:1B:63:CC:DD:EE", vendor: "Cisco" },
  { mac: "AC:DE:48:00:11:22", vendor: "Samsung" },
];

const OPTIONS = ["Apple", "Intel", "Raspberry Pi", "Cisco", "Samsung", "Google"];

export default function Task03Mac({ markComplete, isComplete }: TaskContext) {
  const [picks, setPicks] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const allRight =
    Object.keys(picks).length === ITEMS.length && ITEMS.every((it, i) => picks[i] === it.vendor);

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
          Tabella OUI (primi 3 byte)
        </div>
        <div className="mb-4 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
          {Object.entries(VENDORS).map(([oui, name]) => (
            <div
              key={oui}
              className="flex items-center justify-between rounded-md border border-border bg-background px-2.5 py-1.5"
            >
              <span className="font-mono text-xs text-foreground">{oui}</span>
              <span className="text-xs text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {ITEMS.map((it, i) => {
            const picked = picks[i];
            const correct = checked && picked === it.vendor;
            const wrong = checked && picked && picked !== it.vendor;
            return (
              <div
                key={i}
                className={cn(
                  "flex flex-wrap items-center justify-between gap-2 rounded-md border bg-background px-3 py-2",
                  correct ? "border-success/60" : wrong ? "border-destructive/60" : "border-border",
                )}
              >
                <span className="font-mono text-sm text-foreground">
                  <span className="text-accent">{it.mac.slice(0, 8)}</span>
                  {it.mac.slice(8)}
                </span>
                <div className="flex items-center gap-1.5">
                  <select
                    value={picked ?? ""}
                    onChange={(e) => {
                      setPicks({ ...picks, [i]: e.target.value });
                      setChecked(false);
                    }}
                    className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:border-accent"
                  >
                    <option value="">Vendor…</option>
                    {OPTIONS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  {correct && <CheckCircle2 className="h-4 w-4 text-success" />}
                  {wrong && <XCircle className="h-4 w-4 text-destructive" />}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {
            setChecked(true);
            if (allRight) markComplete();
          }}
          disabled={Object.keys(picks).length !== ITEMS.length}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Verifica
        </button>
      </div>

      {!isComplete ? (
        <InfoNote>
          I primi 3 byte (OUI) identificano il produttore. Confrontali con la tabella e assegna il
          vendor corretto.
        </InfoNote>
      ) : (
        <SuccessNote>
          Ora sai leggere un MAC. Ricorda: MAC = livello 2 (dentro la LAN), IP = livello 3 (tra reti
          diverse).
        </SuccessNote>
      )}
    </div>
  );
}
