import { useState } from "react";
import { InteractiveTerminal } from "@/components/lab/InteractiveTerminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";

type FsNode = { type: "dir" | "file"; name: string; children?: FsNode[] };

const initialTree: FsNode = {
  type: "dir",
  name: "home",
  children: [
    {
      type: "dir",
      name: "kali",
      children: [
        { type: "dir", name: "progetti" },
        { type: "file", name: "readme.txt" },
      ],
    },
  ],
};

export default function Task05Files({ markComplete, isComplete }: TaskContext) {
  const [tree, setTree] = useState<FsNode>(initialTree);
  const [step, setStep] = useState(0);

  const steps = [
    "Crea la cartella 'report' dentro /home/kali",
    "Crea il file 'dati.txt' dentro /home/kali/report",
    "Copia dati.txt in /home/kali/report/backup.txt",
    "Rinomina backup.txt in archivio.txt",
    "Rimuovi dati.txt",
  ];

  const getPath = (path: string, node: FsNode = tree): FsNode | null => {
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0) return node;
    let current: FsNode | undefined = node;
    for (const part of parts) {
      current = current?.children?.find((c) => c.name === part);
      if (!current) return null;
    }
    return current;
  };

  const addNode = (path: string, newNode: FsNode): boolean => {
    const parent = getPath(path);
    if (!parent || parent.type !== "dir") return false;
    if (parent.children?.some((c) => c.name === newNode.name)) return false;
    const updated = { ...parent, children: [...(parent.children ?? []), newNode] };
    setTree(replaceNode(tree, path, updated));
    return true;
  };

  const removeNode = (path: string, name: string): boolean => {
    const parent = getPath(path);
    if (!parent || parent.type !== "dir") return false;
    const updated = { ...parent, children: parent.children?.filter((c) => c.name !== name) ?? [] };
    setTree(replaceNode(tree, path, updated));
    return true;
  };

  const replaceNode = (node: FsNode, path: string, replacement: FsNode): FsNode => {
    if (path === "" || path === "/") return replacement;
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0) return replacement;
    const [head, ...tail] = parts;
    if (node.name !== head) return node;
    if (tail.length === 0) return replacement;
    return {
      ...node,
      children: node.children?.map((c) => (c.name === tail[0] ? replaceNode(c, tail.join("/"), replacement) : c)),
    };
  };

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const base = parts[0];

    if (base === "ls") {
      const target = parts[1] ?? "/home/kali";
      const node = getPath(target);
      if (!node) return { text: `ls: cannot access '${target}': No such file or directory`, kind: "err" as const };
      if (node.type !== "dir") return { text: node.name, kind: "out" as const };
      const names = node.children?.map((c) => c.name).join("  ") ?? "";
      return { text: names || "(empty)", kind: "out" as const };
    }

    if (base === "mkdir") {
      const name = parts[1];
      if (!name) return { text: "mkdir: missing operand", kind: "err" as const };
      const ok = addNode("/home/kali", { type: "dir", name });
      if (!ok) return { text: `mkdir: cannot create directory '${name}'`, kind: "err" as const };
      return { text: `Directory '${name}' creata.`, kind: "info" as const };
    }

    if (base === "touch") {
      const name = parts[1];
      if (!name) return { text: "touch: missing file operand", kind: "err" as const };
      const ok = addNode("/home/kali/report", { type: "file", name });
      if (!ok) return { text: `touch: cannot touch '${name}': No such directory`, kind: "err" as const };
      return { text: `File '${name}' creato.`, kind: "info" as const };
    }

    if (base === "cp") {
      const [src, dst] = [parts[1], parts[2]];
      if (!src || !dst) return { text: "cp: missing file operand", kind: "err" as const };
      const ok = addNode("/home/kali/report", { type: "file", name: dst });
      if (!ok) return { text: `cp: cannot create '${dst}'`, kind: "err" as const };
      return { text: `Copiato ${src} in ${dst}.`, kind: "info" as const };
    }

    if (base === "mv") {
      const [src, dst] = [parts[1], parts[2]];
      if (!src || !dst) return { text: "mv: missing file operand", kind: "err" as const };
      removeNode("/home/kali/report", src);
      addNode("/home/kali/report", { type: "file", name: dst });
      return { text: `Rinominato ${src} in ${dst}.`, kind: "info" as const };
    }

    if (base === "rm") {
      const name = parts[1];
      if (!name) return { text: "rm: missing operand", kind: "err" as const };
      removeNode("/home/kali/report", name);
      return { text: `Rimosso ${name}.`, kind: "info" as const };
    }

    return { text: `Comando non supportato in questa simulazione: ${base}`, kind: "err" as const };
  };

  const checkProgress = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const base = parts[0];
    const arg = parts[1];

    const expected = [
      () => base === "mkdir" && arg === "report",
      () => base === "touch" && arg === "dati.txt",
      () => base === "cp" && arg === "dati.txt" && parts[2] === "backup.txt",
      () => base === "mv" && arg === "backup.txt" && parts[2] === "archivio.txt",
      () => base === "rm" && arg === "dati.txt",
    ];

    let nextStep = step;
    for (let i = step; i < expected.length; i++) {
      if (expected[i]!()) {
        nextStep = i + 1;
      } else {
        break;
      }
    }
    if (nextStep !== step) setStep(nextStep);
    if (nextStep >= expected.length && !isComplete) markComplete();
  };

  const wrapped = (cmd: string) => {
    const res = handleCommand(cmd);
    checkProgress(cmd);
    return res;
  };

  return (
    <div>
      <div className="mb-4 rounded-xl border border-border bg-surface p-4">
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">Obiettivo passo dopo passo</div>
        <ol className="list-inside list-decimal space-y-1 text-sm text-foreground">
          {steps.map((s, i) => (
            <li key={i} className={i < step ? "text-success line-through" : ""}>
              {s}
            </li>
          ))}
        </ol>
      </div>

      <InteractiveTerminal title="kali@lab: ~" prompt="kali@lab:~$ " onCommand={wrapped} heightClass="min-h-[260px]" />

      {!isComplete ? (
        <InfoNote>
          I comandi supportati sono: <code className="text-accent">ls</code>,{" "}
          <code className="text-accent">mkdir</code>, <code className="text-accent">touch</code>,{" "}
          <code className="text-accent">cp</code>, <code className="text-accent">mv</code>,{" "}
          <code className="text-accent">rm</code>. Segui la sequenza indicata.
        </InfoNote>
      ) : (
        <SuccessNote>
          Creare, copiare, spostare e rimuovere file è il giorno a giorno di ogni sessione Linux. Attenzione con{" "}
          <code>rm</code>: non c'è cestino nella shell.
        </SuccessNote>
      )}
    </div>
  );
}
