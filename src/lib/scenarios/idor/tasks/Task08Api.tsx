import { useState } from "react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { PROFILES } from "../data";
import type { TaskContext } from "../../types";

export default function Task08Api({ markComplete, isComplete }: TaskContext) {
  const [endpoint, setEndpoint] = useState("/api/users/42");
  const [resp, setResp] = useState<string | null>(null);

  const send = () => {
    const m = endpoint.match(/\/api\/users\/(\d+)/);
    const id = m ? Number(m[1]) : null;
    if (!id || !PROFILES[id]) {
      setResp(JSON.stringify({ status: 404, error: "Not found" }, null, 2));
      return;
    }
    const p = PROFILES[id];
    setResp(
      JSON.stringify(
        { status: 200, data: { id: p.id, name: p.name, email: p.email, role: p.role } },
        null,
        2,
      ),
    );
    if (id !== 42) markComplete();
  };

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/50">
        <div className="border-b border-border bg-surface-2 px-4 py-2 font-mono text-xs text-muted-foreground">
          Console API · REST client
        </div>
        <div className="space-y-3 p-5">
          <div className="flex items-center gap-2">
            <span className="rounded bg-gold/20 px-2 py-1 font-mono text-xs text-gold">GET</span>
            <input
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="flex-1 rounded border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
            />
            <button
              onClick={send}
              className="rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
            >
              Send
            </button>
          </div>
          <pre className="animate-in fade-in min-h-[160px] overflow-auto rounded border border-border bg-background p-3 font-mono text-xs text-ivory/90">
            {resp ?? "// La risposta apparirà qui"}
          </pre>
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          Molte app moderne parlano con API REST. L'id nell'URL espone lo stesso rischio. Prova
          <code className="text-gold"> /api/users/1</code> o <code className="text-gold">/api/users/7</code>.
        </InfoNote>
      ) : (
        <>
          <WarnNote>
            L'API ha risposto senza verificare che tu fossi autorizzato a leggere quell'utente.
          </WarnNote>
          <SuccessNote>Le API non hanno UI: ma le regole di autorizzazione sono le stesse.</SuccessNote>
        </>
      )}
    </div>
  );
}
