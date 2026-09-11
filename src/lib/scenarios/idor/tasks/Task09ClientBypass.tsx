import { useState } from "react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";

export default function Task09ClientBypass({ markComplete, isComplete }: TaskContext) {
  const [bypass, setBypass] = useState(false);
  const [targetUser, setTargetUser] = useState("giulia.ferrari");
  const [msg, setMsg] = useState<string | null>(null);

  const isMe = targetUser === "giulia.ferrari";
  const disabled = !bypass && !isMe;

  const del = () => {
    if (disabled) return;
    setMsg(`✓ Account "${targetUser}" eliminato dal server.`);
    if (!isMe) markComplete();
  };

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/50">
        <div className="border-b border-border bg-surface-2 px-4 py-2 font-mono text-xs text-muted-foreground">
          Pannello utente · Elimina account
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
              Username target
            </label>
            <input
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              className="w-full rounded border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
          </div>

          <button
            onClick={del}
            disabled={disabled}
            className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Elimina account
          </button>

          <div className="rounded border border-dashed border-border bg-background p-3">
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={bypass}
                onChange={(e) => setBypass(e.target.checked)}
                className="mt-0.5 accent-[color:var(--gold)]"
              />
              <span>
                <span className="font-mono text-gold">DevTools</span> · Rimuovi l'attributo{" "}
                <code>disabled</code> dal bottone (bypass controllo lato client)
              </span>
            </label>
          </div>

          {msg && (
            <div className="animate-in fade-in rounded border border-border bg-surface-2 p-3 font-mono text-xs text-ivory/90">
              {msg}
            </div>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          Il bottone "Elimina" è disabilitato quando il target non sei tu — ma solo lato browser.
          Attiva il bypass DevTools, cambia lo username in <code className="text-gold">anna.rossi</code>{" "}
          e prova.
        </InfoNote>
      ) : (
        <>
          <WarnNote>
            Un attaccante può sempre modificare l'HTML/JS del browser. I controlli devono vivere sul
            server.
          </WarnNote>
          <SuccessNote>
            Il client è cosmetica. La sicurezza è server-side.
          </SuccessNote>
        </>
      )}
    </div>
  );
}
