import { useState } from "react";
import { InteractiveTerminal } from "@/components/lab/InteractiveTerminal";
import { InfoNote, SuccessNote } from "@/components/lab/Feedback";
import type { TaskContext } from "../../types";

const VALID_COMMANDS = ["pwd", "whoami", "clear", "history"];

export default function Task03Terminal({ markComplete, isComplete }: TaskContext) {
  const [done, setDone] = useState<Set<string>>(new Set());

  const handleCommand = (cmd: string) => {
    const base = cmd.split(" ")[0] ?? "";
    if (base === "clear") {
      return { text: "Schermo pulito.", kind: "info" as const };
    }
    if (!VALID_COMMANDS.includes(base)) {
      return { text: `Comando non riconosciuto: ${base}`, kind: "err" as const };
    }

    const next = new Set(done);
    next.add(base);
    setDone(next);

    if (next.size >= 3 && !isComplete) {
      markComplete();
    }

    switch (base) {
      case "pwd":
        return { text: "/home/kali", kind: "out" as const };
      case "whoami":
        return { text: "kali", kind: "out" as const };
      case "history":
        return { text: "1  pwd\n2  whoami\n3  history", kind: "out" as const };
      default:
        return undefined;
    }
  };

  return (
    <div>
      <InteractiveTerminal
        title="kali@lab: ~"
        prompt="kali@lab:~$ "
        onCommand={handleCommand}
        heightClass="min-h-[240px]"
      />

      {!isComplete ? (
        <InfoNote>
          Prova i comandi base della shell: <code className="text-accent">pwd</code>,{" "}
          <code className="text-accent">whoami</code>, <code className="text-accent">clear</code>,{" "}
          <code className="text-accent">history</code>. Eseguine almeno 3 diversi per completare il task.
        </InfoNote>
      ) : (
        <SuccessNote>
          La shell è il tuo punto di controllo. <code>pwd</code> ti dice dove sei, <code>whoami</code> chi sei,{" "}
          <code>history</code> i comandi passati.
        </SuccessNote>
      )}
    </div>
  );
}
