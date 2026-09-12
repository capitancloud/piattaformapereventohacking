import { useState } from "react";
import { FileSignature, Target, Users, Bell, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const RULES = [
  { id: "auth", icon: FileSignature, name: "Autorizzazione scritta", desc: "Un documento firmato dal cliente che ti dà il permesso esplicito di testare i suoi sistemi." },
  { id: "scope", icon: Target, name: "Scope", desc: "L'elenco preciso di cosa puoi toccare: IP, domini, applicazioni, orari, tecniche vietate." },
  { id: "roe", icon: Users, name: "Rules of Engagement", desc: "Le regole del gioco: chi contattare in emergenza, cosa fare se trovi dati sensibili, cosa non fare mai." },
  { id: "resp", icon: Bell, name: "Divulgazione responsabile", desc: "Comunichi le vulnerabilità solo al legittimo proprietario e gli dai il tempo di correggerle prima di parlarne in pubblico." },
  { id: "trace", icon: Eye, name: "Tracciabilità", desc: "Documenti tutto ciò che fai: comandi, orari, risultati. Serve per il report e per proteggerti legalmente." },
];

const QUESTIONS = [
  { text: "Il cliente ha firmato un contratto ma non ti ha detto quali server puoi toccare: cosa manca?", answer: "scope" },
  { text: "Trovi per caso dei documenti sanitari durante il test. Cosa dovrebbe dirti come comportarti?", answer: "roe" },
  { text: "Hai scoperto una falla grave. Come devi comunicarla?", answer: "resp" },
  { text: "Un domani ti accusano di aver fatto danni. Cosa ti salva?", answer: "trace" },
  { text: "Senza cosa nemmeno accendi la macchina virtuale di attacco?", answer: "auth" },
];

export default function Task02Rules({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const all = Object.keys(picked).length === QUESTIONS.length;
  const score = QUESTIONS.filter((q, i) => picked[i] === q.answer).length;

  return (
    <div className="space-y-4">
      <div className="grid min-w-0 gap-2 sm:grid-cols-5">
        {RULES.map((r) => (
          <div key={r.id} className="flex min-w-0 flex-col items-center gap-2 rounded-xl border border-border bg-surface p-3 text-center">
            <r.icon className="h-5 w-5 text-accent" />
            <p className="text-xs font-semibold text-foreground">{r.name}</p>
            <p className="text-[11px] leading-snug text-muted-foreground">{r.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {QUESTIONS.map((q, i) => {
          const value = picked[i];
          const right = checked && value === q.answer;
          const wrong = checked && value && value !== q.answer;
          return (
            <div key={i} className={cn("rounded-xl border border-border bg-surface p-4", right && "border-success/60", wrong && "border-destructive/60")}>
              <p className="mb-3 text-sm text-foreground">{q.text}</p>
              <div className="flex flex-wrap gap-2">
                {RULES.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => { setChecked(false); setPicked((p) => ({ ...p, [i]: r.id })); }}
                    className={cn(
                      "rounded-md border px-3 py-1.5 text-xs transition active:scale-95",
                      value === r.id ? "border-accent bg-accent/15 text-foreground" : "border-border bg-background text-muted-foreground hover:border-accent/50",
                    )}
                  >
                    {r.name}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Button className="w-full" disabled={!all} onClick={() => { setChecked(true); if (score === QUESTIONS.length) markComplete(); }}>
        Verifica gli abbinamenti
      </Button>

      {!checked && <InfoNote>Le cinque regole non sono burocrazia: sono lo scudo che rende il tuo lavoro legale e ripetibile.</InfoNote>}
      {checked && score < QUESTIONS.length && <WarnNote>{score} su {QUESTIONS.length}. Rileggi le regole in alto e riprova.</WarnNote>}
      {isComplete && <SuccessNote>Le regole sono chiare. Ora puoi passare a costruirti il laboratorio dove metterle in pratica.</SuccessNote>}
    </div>
  );
}
