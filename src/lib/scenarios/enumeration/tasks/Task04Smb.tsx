import { useState } from "react";
import { Folder, FolderLock, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { cn } from "@/lib/utils";
import type { TaskContext } from "../../types";

const SHARES = [
  { id: "public", name: "PUBLIC", comment: "Documenti condivisi", open: true, why: "Nessuna password richiesta: chiunque in rete può leggerne il contenuto." },
  { id: "admin", name: "ADMIN$", comment: "Condivisione amministrativa", open: false, why: "Le condivisioni col dollaro sono nascoste e protette: accesso negato senza credenziali." },
  { id: "backup", name: "BACKUP", comment: "Copie notturne", open: true, why: "Risponde all'accesso anonimo: una condivisione di backup leggibile è un regalo per un attaccante." },
  { id: "ipc", name: "IPC$", comment: "Comunicazione fra processi", open: false, why: "IPC$ serve ai servizi Windows: elencabile, ma non ci trovi file da leggere." },
];

export default function Task04Smb({ markComplete, isComplete }: TaskContext) {
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const toggle = (id: string) => {
    setChecked(false);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const openIds = SHARES.filter((s) => s.open).map((s) => s.id);
  const right = picked.filter((id) => openIds.includes(id)).length;
  const wrong = picked.filter((id) => !openIds.includes(id)).length;
  const solved = right === openIds.length && wrong === 0;

  return (
    <div>
      <div className="min-w-0 overflow-hidden rounded-xl border border-border bg-black font-mono text-xs shadow-2xl shadow-black/60">
        <div className="border-b border-border/60 bg-surface-2 px-3 py-2 text-[11px] text-muted-foreground">
          smbclient -L //10.10.10.12 -N
        </div>
        <div className="space-y-1 p-4">
          <p className="break-words text-muted-foreground">Anonymous login successful</p>
          <p className="mt-2 break-words text-muted-foreground">
            {"        Sharename       Type      Comment"}
          </p>
          <p className="break-words text-muted-foreground">
            {"        ---------       ----      -------"}
          </p>
          {SHARES.map((s) => (
            <p key={s.id} className="break-words text-ivory/90">
              {`        ${s.name.padEnd(16)}Disk      ${s.comment}`}
            </p>
          ))}
        </div>
      </div>

      <p className="mt-4 mb-3 text-sm text-muted-foreground">
        Tocca le condivisioni che un accesso anonimo può davvero aprire:
      </p>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        {SHARES.map((s) => {
          const selected = picked.includes(s.id);
          const goodPick = checked && selected && s.open;
          const badPick = checked && selected && !s.open;
          const missed = checked && !selected && s.open;
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={cn(
                "flex min-w-0 items-start gap-3 rounded-xl border p-4 text-left transition active:scale-[0.98]",
                !checked && selected
                  ? "border-accent bg-accent/10"
                  : "border-border bg-surface hover:border-accent/50",
                goodPick && "border-success/60 bg-success/5",
                badPick && "border-destructive/60 bg-destructive/5",
                missed && "border-gold/60",
              )}
            >
              {s.open ? (
                <Folder className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              ) : (
                <FolderLock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              )}
              <span className="min-w-0">
                <span className="block break-words font-mono text-sm text-foreground">{s.name}</span>
                <span className="block break-words text-xs text-muted-foreground">{s.comment}</span>
                {checked && (selected || s.open) && (
                  <span className="mt-2 block break-words text-xs leading-relaxed text-muted-foreground">{s.why}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      <Button
        className="mt-4 w-full"
        disabled={picked.length === 0}
        onClick={() => {
          setChecked(true);
          if (solved) markComplete();
        }}
      >
        <HardDrive className="h-4 w-4" /> Verifica gli accessi
      </Button>

      {!checked && (
        <InfoNote>
          Le condivisioni che finiscono con il dollaro sono amministrative e nascoste: SMB le
          elenca, ma non le apre senza privilegi.
        </InfoNote>
      )}
      {checked && !solved && (
        <WarnNote>
          Hai selezionato {picked.length} condivisioni, ma solo alcune sono davvero apribili in
          anonimo. Osserva nomi e commenti: quale promette documenti, quale è di sistema?
        </WarnNote>
      )}
      {isComplete && (
        <SuccessNote>
          PUBLIC e BACKUP si aprono senza password: in un assessment reale questo basterebbe per
          segnalare un rischio alto. Enumerare SMB è spesso il colpo più redditizio di tutta la fase.
        </SuccessNote>
      )}
    </div>
  );
}
