import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const REQ = `POST /login HTTP/1.1
Host: shop.example.com
Content-Type: application/x-www-form-urlencoded
User-Agent: Mozilla/5.0
Accept: */*
Content-Length: 43

username=alessia.moretti&password=Estate2024!`;

const CORRECT = { user: "alessia.moretti", pass: "Estate2024!" };

export default function Task07HttpCreds({ markComplete, isComplete }: TaskContext) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [feedback, setFeedback] = useState<"ok" | "no" | null>(null);

  const submit = () => {
    if (user.trim() === CORRECT.user && pass.trim() === CORRECT.pass) {
      setFeedback("ok");
      markComplete();
    } else {
      setFeedback("no");
    }
  };

  return (
    <div>
      <div className="grid min-w-0 gap-4 md:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-surface">
          <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-2 font-mono text-[11px] text-muted-foreground">
            <span className="rounded bg-destructive/20 px-2 py-0.5 text-[10px] text-destructive">HTTP (in chiaro)</span>
            packet 42 · POST /login
          </div>
          <pre className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] bg-black/60 p-4 font-mono text-[12px] leading-relaxed text-ivory">{REQ}</pre>
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Cattura le credenziali</div>
          <label className="mb-1 block text-[11px] text-muted-foreground">Username</label>
          <input
            value={user}
            onChange={(e) => {
              setUser(e.target.value);
              setFeedback(null);
            }}
            className="mb-3 w-full rounded border border-border bg-background px-2 py-1 font-mono text-xs text-ivory outline-none focus:border-accent"
          />
          <label className="mb-1 block text-[11px] text-muted-foreground">Password</label>
          <input
            value={pass}
            onChange={(e) => {
              setPass(e.target.value);
              setFeedback(null);
            }}
            className="mb-3 w-full rounded border border-border bg-background px-2 py-1 font-mono text-xs text-ivory outline-none focus:border-accent"
          />
          <button onClick={submit} className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110">
            Verifica
          </button>
          {feedback === "ok" && (
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-success">
              <CheckCircle2 className="h-3.5 w-3.5" /> credenziali corrette
            </div>
          )}
          {feedback === "no" && (
            <div className="mt-3 inline-flex items-center gap-1 text-xs text-destructive">
              <XCircle className="h-3.5 w-3.5" /> non trovate: guarda il body della POST
            </div>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Il body della richiesta arriva dopo l'header vuoto. Sintassi: <span className={cn("font-mono")}>chiave=valore&altra=valore</span>.</InfoNote>
      ) : (
        <WarnNote>Basta una rete WiFi condivisa per intercettare tutto questo. HTTPS non è un lusso, è il minimo sindacale.</WarnNote>
      )}

      {isComplete && (
        <SuccessNote>Hai estratto le credenziali dal traffico. Ora sai perché tutti i siti seri usano HTTPS.</SuccessNote>
      )}
    </div>
  );
}
