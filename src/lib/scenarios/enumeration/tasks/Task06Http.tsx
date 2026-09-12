import { useState } from "react";
import { ArrowRight, FileText, Globe, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const PIECES = [
  { id: "gobuster", label: "gobuster", kind: "tool" },
  { id: "dir", label: "dir", kind: "mode" },
  { id: "url", label: "-u http://10.10.10.12", kind: "target" },
  { id: "wordlist", label: "-w /usr/share/wordlists/common.txt", kind: "wordlist" },
  { id: "nmap", label: "nmap -p 80", kind: "wrong" },
  { id: "delete", label: "--delete-all", kind: "wrong" },
] as const;

const ORDER = ["gobuster", "dir", "url", "wordlist"];

const RESULTS = [
  { path: "/index.html", code: "200", interesting: false, why: "La home è pubblica per definizione: non aggiunge nulla." },
  { path: "/admin", code: "301", interesting: true, why: "Un'area amministrativa nascosta: da visitare, magari espone un pannello di login." },
  { path: "/backup.zip", code: "200", interesting: true, why: "Un archivio di backup scaricabile da chiunque: può contenere codice e password." },
  { path: "/images", code: "301", interesting: false, why: "Una cartella di immagini è normale: risultato atteso, poco valore." },
  { path: "/.git", code: "301", interesting: true, why: "Il repository Git esposto online: da lì si può ricostruire l'intero codice sorgente." },
];

export default function Task06Http({ markComplete, isComplete }: TaskContext) {
  const [slots, setSlots] = useState<string[]>([]);
  const [built, setBuilt] = useState(false);
  const [marked, setMarked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const pool = PIECES.filter((p) => !slots.includes(p.id));
  const correct = ORDER.every((id, i) => slots[i] === id);

  const build = () => {
    if (correct) setBuilt(true);
  };

  const toggle = (path: string) => {
    setChecked(false);
    setMarked((m) => (m.includes(path) ? m.filter((x) => x !== path) : [...m, path]));
  };

  const interesting = RESULTS.filter((r) => r.interesting).map((r) => r.path);
  const good = marked.filter((p) => interesting.includes(p)).length;
  const bad = marked.filter((p) => !interesting.includes(p)).length;
  const solved = good === interesting.length && bad === 0;

  return (
    <div>
      {!built ? (
        <>
          <p className="mb-3 text-sm text-muted-foreground">
            Componi il comando gobuster toccando i pezzi nell'ordine giusto:
          </p>
          <div className="min-w-0 rounded-xl border border-border bg-black p-4 font-mono text-xs shadow-2xl shadow-black/60">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="text-gold-soft">$</span>
              {slots.map((id, i) => (
                <button
                  key={id}
                  onClick={() => setSlots((s) => s.filter((_, idx) => idx !== i))}
                  className="break-all rounded bg-surface-2 px-2 py-1 text-ivory transition hover:bg-surface"
                  title="Tocca per rimuovere"
                >
                  {PIECES.find((p) => p.id === id)?.label}
                </button>
              ))}
              {slots.length === 0 && <span className="text-muted-foreground">…</span>}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {pool.map((p) => (
              <button
                key={p.id}
                onClick={() => setSlots((s) => [...s, p.id])}
                className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition hover:border-accent/50 active:scale-95"
              >
                {p.label}
              </button>
            ))}
          </div>
          <Button className="mt-4 w-full" disabled={slots.length !== 4} onClick={build}>
            Esegui la scansione
          </Button>
          {slots.length === 4 && !correct && (
            <WarnNote>L'ordine non convince: strumento, modalità, obiettivo e infine la lista di parole.</WarnNote>
          )}
          {!built && (
            <InfoNote>
              gobuster prova migliaia di nomi di cartelle e file presi da una wordlist: è un elenco
              telefonico di percorsi possibili.
            </InfoNote>
          )}
        </>
      ) : (
        <>
          <div className="min-w-0 rounded-xl border border-border bg-black p-4 font-mono text-xs shadow-2xl shadow-black/60">
            <p className="break-all text-muted-foreground">$ gobuster dir -u http://10.10.10.12 -w common.txt</p>
            <p className="mt-1 text-muted-foreground/70">=====================================================</p>
            <p className="break-words text-ivory/90">/index.html (Status: 200)</p>
            <p className="break-words text-ivory/90">/admin (Status: 301)</p>
            <p className="break-words text-ivory/90">/backup.zip (Status: 200)</p>
            <p className="break-words text-ivory/90">/images (Status: 301)</p>
            <p className="break-words text-ivory/90">/.git (Status: 301)</p>
          </div>
          <p className="mt-4 mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <ListChecks className="h-4 w-4 text-accent" /> Tocca i percorsi che meritano un'analisi approfondita:
          </p>
          <div className="grid min-w-0 gap-2 sm:grid-cols-2">
            {RESULTS.map((r) => {
              const selected = marked.includes(r.path);
              const goodPick = checked && selected && r.interesting;
              const badPick = checked && selected && !r.interesting;
              const missed = checked && !selected && r.interesting;
              return (
                <button
                  key={r.path}
                  onClick={() => toggle(r.path)}
                  className={cn(
                    "flex min-w-0 items-center gap-3 rounded-lg border p-3 text-left transition active:scale-[0.98]",
                    !checked && selected ? "border-accent bg-accent/10" : "border-border bg-surface hover:border-accent/50",
                    goodPick && "border-success/60 bg-success/5",
                    badPick && "border-destructive/60 bg-destructive/5",
                    missed && "border-gold/60",
                  )}
                >
                  {r.interesting ? (
                    <FileText className="h-4 w-4 shrink-0 text-gold" />
                  ) : (
                    <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span className="min-w-0">
                    <span className="block break-all font-mono text-sm text-foreground">
                      {r.path} <span className="text-muted-foreground">({r.code})</span>
                    </span>
                    {checked && (selected || r.interesting) && (
                      <span className="mt-1 block break-words text-xs leading-relaxed text-muted-foreground">{r.why}</span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <Button
            className="mt-4 w-full"
            disabled={marked.length === 0}
            onClick={() => {
              setChecked(true);
              if (solved) markComplete();
            }}
          >
            Verifica il triage <ArrowRight className="h-4 w-4" />
          </Button>
          {checked && !solved && (
            <WarnNote>
              Non tutto ciò che risponde è interessante: cerca ciò che non doveva essere pubblico.
            </WarnNote>
          )}
          {isComplete && (
            <SuccessNote>
              /admin, /backup.zip e /.git sono i tre tesori: un pannello, un archivio e un
              repository dimenticato. La enumerazione web premia chi sa distinguere il rumore.
            </SuccessNote>
          )}
        </>
      )}
    </div>
  );
}
