import { useState } from "react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { ME } from "../data";

export default function Task06PostBody({ markComplete, isComplete }: TaskContext) {
  const [userId, setUserId] = useState(String(ME.id));
  const [email, setEmail] = useState("nuova.email@demo.it");
  const [result, setResult] = useState<string | null>(null);

  const submit = () => {
    const uid = Number(userId);
    if (uid && uid !== ME.id) {
      setResult(`✓ Email dell'utente ${uid} aggiornata a "${email}"`);
      markComplete();
    } else {
      setResult(`Email del tuo account aggiornata.`);
    }
  };

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/50">
        <div className="border-b border-border bg-surface-2 px-4 py-2 font-mono text-xs text-muted-foreground">
          POST /api/profile/update
        </div>
        <div className="p-5">
          <label className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">
            Nuova email
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/25"
          />

          <div className="rounded-md border border-dashed border-border bg-background p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Campo nascosto nel form
              </span>
              <span className="rounded bg-gold/20 px-2 py-0.5 font-mono text-[10px] text-gold">
                type="hidden"
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">userId =</span>
              <input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-32 rounded border border-border bg-surface-2 px-2 py-1 font-mono text-xs text-gold outline-none focus:border-gold"
              />
            </div>
          </div>

          <button
            onClick={submit}
            className="mt-4 rounded-md bg-gold px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
          >
            Salva modifiche
          </button>

          {result && (
            <div className="animate-in fade-in mt-4 rounded border border-border bg-surface-2 p-3 font-mono text-xs text-ivory/90">
              {result}
            </div>
          )}
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          I dati non passano solo dall'URL. Anche <em>form</em> e <em>API</em> possono includere un
          <code className="text-gold"> userId</code>. Cambialo (prova 1 o 7) e salva.
        </InfoNote>
      ) : (
        <>
          <WarnNote>
            Hai modificato l'email di un altro account. Un endpoint deve <em>ignorare</em> lo userId
            del client e usare quello della sessione.
          </WarnNote>
          <SuccessNote>Regola d'oro: mai fidarsi dei dati inviati dal client.</SuccessNote>
        </>
      )}
    </div>
  );
}
