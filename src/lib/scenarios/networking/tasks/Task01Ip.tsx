import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type Kind = "public" | "private" | "loopback" | "invalid";

const ITEMS: { ip: string; kind: Kind }[] = [
  { ip: "192.168.1.10", kind: "private" },
  { ip: "8.8.8.8", kind: "public" },
  { ip: "127.0.0.1", kind: "loopback" },
  { ip: "10.0.5.42", kind: "private" },
  { ip: "300.1.1.1", kind: "invalid" },
  { ip: "172.16.24.7", kind: "private" },
  { ip: "93.184.216.34", kind: "public" },
  { ip: "192.168.1.256", kind: "invalid" },
];

const LABELS: Record<Kind, string> = {
  public: "Pubblico",
  private: "Privato",
  loopback: "Loopback",
  invalid: "Non valido",
};

export default function Task01Ip({ markComplete, isComplete }: TaskContext) {
  const [picks, setPicks] = useState<Record<number, Kind | undefined>>({});
  const [checked, setChecked] = useState(false);

  const allRight =
    ITEMS.every((it, i) => picks[i] === it.kind) &&
    Object.keys(picks).length === ITEMS.length;

  const verify = () => {
    setChecked(true);
    if (allRight) markComplete();
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 font-mono text-xs uppercase tracking-widest text-accent">
          Classifica ogni indirizzo IP
        </div>
        <div className="space-y-2">
          {ITEMS.map((it, i) => {
            const picked = picks[i];
            const correct = checked && picked === it.kind;
            const wrong = checked && picked && picked !== it.kind;
            return (
              <div
                key={i}
                className={cn(
                  "flex flex-wrap items-center justify-between gap-2 rounded-md border bg-background px-3 py-2",
                  correct && "border-success/60",
                  wrong && "border-destructive/60",
                  !correct && !wrong && "border-border",
                )}
              >
                <span className="font-mono text-sm text-foreground">{it.ip}</span>
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(LABELS) as Kind[]).map((k) => (
                    <button
                      key={k}
                      onClick={() => {
                        setPicks({ ...picks, [i]: k });
                        setChecked(false);
                      }}
                      className={cn(
                        "rounded-md border px-2.5 py-1 text-xs transition",
                        picked === k
                          ? "border-accent bg-accent/15 text-foreground"
                          : "border-border text-muted-foreground hover:border-accent/60 hover:text-foreground",
                      )}
                    >
                      {LABELS[k]}
                    </button>
                  ))}
                  {correct && <CheckCircle2 className="h-4 w-4 text-success" />}
                  {wrong && <XCircle className="h-4 w-4 text-destructive" />}
                </div>
              </div>
            );
          })}
        </div>
        <button
          onClick={verify}
          disabled={Object.keys(picks).length !== ITEMS.length}
          className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Verifica
        </button>
      </div>

      {!isComplete ? (
        <InfoNote>
          Privati: <code className="text-accent">10.x</code>,{" "}
          <code className="text-accent">172.16–31.x</code>,{" "}
          <code className="text-accent">192.168.x</code>. Loopback:{" "}
          <code className="text-accent">127.0.0.1</code>. Tutto il resto (valido) è pubblico. Ogni
          ottetto deve stare tra 0 e 255.
        </InfoNote>
      ) : (
        <SuccessNote>
          Occhio allenato. Gli IP privati non escono su Internet come sono: passano dal NAT (task 7).
        </SuccessNote>
      )}
    </div>
  );
}
