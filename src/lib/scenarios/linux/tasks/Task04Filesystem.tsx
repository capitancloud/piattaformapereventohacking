import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

type TreeNodeType = { name: string; children?: TreeNodeType[] };

const TARGETS = [
  { path: "/home/kali/documenti", label: "documenti" },
  { path: "/home/kali/immagini/vacanze", label: "vacanze" },
  { path: "/etc", label: "etc" },
];

const TREE: TreeNodeType = {
  name: "/",
  children: [
    {
      name: "home",
      children: [
        {
          name: "kali",
          children: [
            { name: "documenti", children: [{ name: "appunti.txt" }] },
            {
              name: "immagini",
              children: [{ name: "vacanze", children: [{ name: "foto.jpg" }] }],
            },
            { name: "scaricati", children: [] },
          ],
        },
      ],
    },
    {
      name: "etc",
      children: [{ name: "passwd" }, { name: "hosts" }],
    },
    { name: "var", children: [] },
  ],
};

export default function Task04Filesystem({ markComplete, isComplete }: TaskContext) {
  const [cwd, setCwd] = useState("/home/kali");
  const [reached, setReached] = useState<Set<string>>(new Set());
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const resolve = (target: string, current: string): string | null => {
    if (target.startsWith("/")) {
      return normalize(target);
    }
    if (target === "~") return "/home/kali";
    return normalize(`${current}/${target}`);
  };

  const normalize = (path: string): string | null => {
    const parts = path.split("/").filter(Boolean);
    const stack: string[] = [];
    for (const p of parts) {
      if (p === "..") {
        stack.pop();
      } else if (p !== ".") {
        stack.push(p);
      }
    }
    const resolved = "/" + stack.join("/");
    if (exists(resolved, TREE)) return resolved;
    return null;
  };

  const exists = (path: string, node: typeof TREE): boolean => {
    if (path === "/") return true;
    const parts = path.split("/").filter(Boolean);
    let current: typeof TREE | undefined = node;
    for (const part of parts) {
      current = current?.children?.find((c) => c.name === part);
      if (!current) return false;
    }
    return true;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    setInput("");
    setMessage(null);

    if (!cmd.startsWith("cd ")) {
      setMessage("Usa solo il comando cd <percorso> in questo task.");
      return;
    }

    const target = cmd.slice(3).trim();
    if (!target) {
      setCwd("/home/kali");
      setMessage("Tornato a /home/kali");
      return;
    }

    const resolved = resolve(target, cwd);
    if (!resolved) {
      setMessage(`Percorso non trovato: ${target}`);
      return;
    }

    setCwd(resolved);
    const hit = TARGETS.find((t) => t.path === resolved);
    if (hit) {
      const next = new Set(reached);
      next.add(hit.path);
      setReached(next);
      setMessage(`Sei arrivato in ${hit.label}!`);
      if (next.size >= 3 && !isComplete) markComplete();
    } else {
      setMessage(`Ora sei in ${resolved}`);
    }
  };

  return (
    <div>
      <div className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="font-mono text-xs uppercase tracking-widest text-accent">
            Raggiungi 3 cartelle usando cd
          </div>
          <div className="font-mono text-xs text-muted-foreground">cwd: {cwd}</div>
        </div>

        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          {TARGETS.map((t) => (
            <div
              key={t.path}
              className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
                reached.has(t.path)
                  ? "border-success/60 bg-success/10 text-success"
                  : "border-border bg-background text-muted-foreground",
              )}
            >
              {reached.has(t.path) && <CheckCircle2 className="h-4 w-4" />}
              <span>{t.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={submit} className="flex gap-2">
          <span className="shrink-0 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-gold-soft">
            kali@lab:~$
          </span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            className="flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm text-foreground outline-none focus:border-accent"
            placeholder="cd documenti"
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:brightness-110 active:scale-95"
          >
            Esegui
          </button>
        </form>

        {message && (
          <div
            className={cn(
              "mt-3 rounded-md px-3 py-2 text-sm",
              message.includes("non trovato")
                ? "bg-destructive/10 text-destructive"
                : "bg-info/10 text-info-foreground",
            )}
          >
            {message}
          </div>
        )}

        <div className="mt-4 rounded-md border border-border bg-black/60 p-3 font-mono text-xs leading-relaxed text-ivory/80">
          <TreeNode node={TREE} depth={0} />
        </div>
      </div>

      {!isComplete ? (
        <InfoNote>
          Prova percorsi assoluti (<code className="text-accent">/etc</code>), relativi ({" "}
          <code className="text-accent">documenti</code>), con <code className="text-accent">..</code> per salire e{" "}
          <code className="text-accent">~</code> per tornare a casa.
        </InfoNote>
      ) : (
        <SuccessNote>
          Navigare il filesystem è la base di tutto: i percorsi assoluti partono da <code>/</code>, quelli relativi dalla
          cartella in cui ti trovi.
        </SuccessNote>
      )}
    </div>
  );
}

function TreeNode({ node, depth }: { node: { name: string; children?: { name: string; children?: unknown[] }[] }; depth: number }) {
  const indent = depth * 1.5;
  return (
    <div style={{ marginLeft: `${indent}rem` }}>
      <span className={node.children ? "text-gold-soft" : "text-ivory/70"}>{node.name}</span>
      {node.children?.map((child) => <TreeNode key={child.name} node={child} depth={depth + 1} />)}
    </div>
  );
}
