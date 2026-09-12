import { useState } from "react";
import { CheckCircle2, Circle, FileCode2, Play } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const CHECKS = [
  { id: "shebang", label: "Prima riga #!/bin/bash", test: (s: string) => s.split("\n")[0]?.trim() === "#!/bin/bash" },
  { id: "echo", label: "Almeno una riga con echo", test: (s: string) => /(^|\n)\s*echo\s+.+/.test(s) },
];

const DEFAULT = `#!/bin/bash\necho "Ciao dal mio primo script"\n`;

export default function Task04Script({ markComplete, isComplete }: TaskContext) {
  const [content, setContent] = useState(DEFAULT);
  const [saved, setSaved] = useState(false);
  const [executable, setExecutable] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const contentOk = CHECKS.every((c) => c.test(content));

  const run = () => {
    if (!saved) {
      setOutput("bash: hello.sh: file non salvato");
      return;
    }
    if (!executable) {
      setOutput("bash: ./hello.sh: Permesso negato");
      return;
    }
    if (!contentOk) {
      setOutput("errore: manca lo shebang o un comando echo");
      return;
    }
    const lines = content.split("\n").filter((l) => l.trim().startsWith("echo"));
    const out = lines
      .map((l) => l.replace(/^\s*echo\s+/, "").replace(/^["']|["']$/g, ""))
      .join("\n");
    setOutput(out);
    markComplete();
  };

  const steps = [
    { id: "content", label: "Contenuto valido (shebang + echo)", done: contentOk },
    { id: "save", label: "Salvato come hello.sh", done: saved },
    { id: "exec", label: "chmod +x hello.sh", done: executable },
    { id: "run", label: "Eseguito con ./hello.sh", done: isComplete },
  ];

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-[1fr_260px]">
        <div className="rounded-xl border border-border bg-surface overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-3 py-2">
            <FileCode2 className="h-4 w-4 text-accent" />
            <span className="font-mono text-xs text-muted-foreground">hello.sh</span>
            {!saved && <span className="ml-auto rounded-full bg-destructive/20 px-2 py-0.5 text-[10px] text-destructive">non salvato</span>}
          </div>
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setSaved(false);
            }}
            rows={7}
            spellCheck={false}
            className="w-full resize-none bg-black/60 p-4 font-mono text-sm text-ivory outline-none"
          />
          <div className="flex flex-wrap gap-2 border-t border-border p-3">
            <button
              onClick={() => setSaved(true)}
              disabled={saved}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground transition hover:border-accent disabled:opacity-40"
            >
              Salva
            </button>
            <button
              onClick={() => setExecutable(true)}
              disabled={!saved || executable}
              className="rounded-md border border-border bg-background px-3 py-1.5 font-mono text-sm text-foreground transition hover:border-accent disabled:opacity-40"
            >
              chmod +x hello.sh
            </button>
            <button
              onClick={run}
              className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-primary to-accent px-4 py-1.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
            >
              <Play className="h-3.5 w-3.5" /> ./hello.sh
            </button>
          </div>
          {output !== null && (
            <div className="border-t border-border bg-black p-3 font-mono text-sm">
              <div className="text-gold-soft">kali@lab:~$ ./hello.sh</div>
              <div className={cn("whitespace-pre-wrap", output.startsWith("bash:") || output.startsWith("errore") ? "text-destructive" : "text-ivory")}>{output}</div>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-surface p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">Checklist</div>
          <ul className="space-y-2">
            {steps.map((s) => (
              <li key={s.id} className="flex items-start gap-2 text-sm">
                {s.done ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                ) : (
                  <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                )}
                <span className={cn(s.done ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>Modifica il file, salva, dai il permesso di esecuzione e lancialo. Se salti un passaggio, Bash te lo dice.</InfoNote>
      ) : (
        <SuccessNote>Hai scritto ed eseguito il tuo primo script. Da qui puoi automatizzare qualsiasi cosa.</SuccessNote>
      )}
    </div>
  );
}
