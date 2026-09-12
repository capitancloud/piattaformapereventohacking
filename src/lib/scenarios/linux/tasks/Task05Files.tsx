import { useState } from "react";
import { InteractiveTerminal } from "@/components/lab/InteractiveTerminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

const STEPS = [
  { cmd: "mkdir report", desc: "Crea la cartella 'report' dentro /home/kali" },
  { cmd: "touch dati.txt", desc: "Crea il file 'dati.txt' dentro /home/kali/report" },
  { cmd: "cp dati.txt backup.txt", desc: "Copia dati.txt in backup.txt" },
  { cmd: "mv backup.txt archivio.txt", desc: "Rinomina backup.txt in archivio.txt" },
  { cmd: "rm dati.txt", desc: "Rimuovi dati.txt" },
];

const INITIAL_PATHS = ["/home/kali/progetti", "/home/kali/readme.txt"];

export default function Task05Files({ markComplete, isComplete }: TaskContext) {
  const [paths, setPaths] = useState<string[]>(INITIAL_PATHS);
  const [step, setStep] = useState(0);

  const listDir = (path: string): string => {
    const prefix = path === "/home/kali" ? "/home/kali/" : `${path}/`;
    const children = paths
      .filter((p) => p.startsWith(prefix) && p !== path)
      .map((p) => p.slice(prefix.length))
      .filter((name) => !name.includes("/"));
    return children.join("  ") || "(empty)";
  };

  const exists = (path: string) => paths.includes(path);

  const handleCommand = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const base = parts[0];

    if (base === "ls") {
      const target = parts[1] ?? "/home/kali";
      if (!exists(target) && target !== "/home/kali") {
        return { text: `ls: cannot access '${target}': No such file or directory`, kind: "err" as const };
      }
      return { text: listDir(target), kind: "out" as const };
    }

    if (base === "mkdir") {
      const name = parts[1];
      if (!name) return { text: "mkdir: missing operand", kind: "err" as const };
      const path = `/home/kali/${name}`;
      if (exists(path)) return { text: `mkdir: cannot create directory '${name}': File exists`, kind: "err" as const };
      setPaths((p) => [...p, path]);
      return { text: `Directory '${name}' creata.`, kind: "info" as const };
    }

    if (base === "touch") {
      const name = parts[1];
      if (!name) return { text: "touch: missing file operand", kind: "err" as const };
      const path = `/home/kali/report/${name}`;
      if (!exists("/home/kali/report")) return { text: "touch: cannot touch: directory report non esiste", kind: "err" as const };
      if (exists(path)) return { text: `File '${name}' già esiste.`, kind: "info" as const };
      setPaths((p) => [...p, path]);
      return { text: `File '${name}' creato.`, kind: "info" as const };
    }

    if (base === "cp") {
      const [src, dst] = [parts[1], parts[2]];
      if (!src || !dst) return { text: "cp: missing file operand", kind: "err" as const };
      const srcPath = `/home/kali/report/${src}`;
      const dstPath = `/home/kali/report/${dst}`;
      if (!exists(srcPath)) return { text: `cp: cannot stat '${src}': No such file`, kind: "err" as const };
      if (exists(dstPath)) return { text: `cp: '${dst}' already exists`, kind: "err" as const };
      setPaths((p) => [...p, dstPath]);
      return { text: `Copiato ${src} in ${dst}.`, kind: "info" as const };
    }

    if (base === "mv") {
      const [src, dst] = [parts[1], parts[2]];
      if (!src || !dst) return { text: "mv: missing file operand", kind: "err" as const };
      const srcPath = `/home/kali/report/${src}`;
      const dstPath = `/home/kali/report/${dst}`;
      if (!exists(srcPath)) return { text: `mv: cannot stat '${src}': No such file`, kind: "err" as const };
      setPaths((p) => p.map((path) => (path === srcPath ? dstPath : path)));
      return { text: `Rinominato ${src} in ${dst}.`, kind: "info" as const };
    }

    if (base === "rm") {
      const name = parts[1];
      if (!name) return { text: "rm: missing operand", kind: "err" as const };
      const path = `/home/kali/report/${name}`;
      if (!exists(path)) return { text: `rm: cannot remove '${name}': No such file`, kind: "err" as const };
      setPaths((p) => p.filter((p) => p !== path));
      return { text: `Rimosso ${name}.`, kind: "info" as const };
    }

    return { text: `Comando non supportato in questa simulazione: ${base}`, kind: "err" as const };
  };

  const checkProgress = (cmd: string) => {
    const expected = STEPS[step];
    if (!expected) return;
    if (cmd.trim() === expected.cmd) {
      const nextStep = step + 1;
      setStep(nextStep);
      if (nextStep >= STEPS.length && !isComplete) {
        markComplete();
      }
    }
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
          {STEPS.map((s, i) => (
            <li key={s.cmd} className={cn(i < step && "text-success line-through")}>
              {s.desc}
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
