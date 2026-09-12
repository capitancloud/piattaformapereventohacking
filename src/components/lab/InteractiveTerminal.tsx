import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type TermResponse = {
  text: string;
  kind?: "out" | "err" | "info";
};

export function InteractiveTerminal({
  title = "terminal",
  prompt = "kali@lab:~$ ",
  onCommand,
  heightClass = "min-h-[220px]",
  className,
}: {
  title?: string;
  prompt?: string;
  onCommand: (cmd: string) => TermResponse | TermResponse[] | undefined;
  heightClass?: string;
  className?: string;
}) {
  const [history, setHistory] = useState<{ text: string; kind: "out" | "err" | "info" | "prompt" }[]>([]);
  const [input, setInput] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;
    setHistory((h) => [...h, { text: `${prompt}${cmd}`, kind: "prompt" }]);
    setInput("");

    const res = onCommand(cmd);
    if (!res) {
      setHistory((h) => [...h, { text: "", kind: "out" }]);
      return;
    }
    const items = Array.isArray(res) ? res : [res];
    setHistory((h) => [...h, ...items.map((r) => ({ text: r.text, kind: r.kind ?? "out" }))]);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-black shadow-2xl shadow-black/60",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/60 bg-surface-2 px-3 py-2 text-xs">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-gold/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        </div>
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">{title}</span>
      </div>
      <div
        className={cn(
          "max-h-80 overflow-auto p-4 font-mono text-[12px] leading-relaxed",
          heightClass,
        )}
      >
        {history.map((l, i) => (
          <TermRow key={i} line={l} prompt={prompt} />
        ))}
        <form onSubmit={submit} className="mt-2 flex items-center gap-2 text-ivory">
          <span className="text-gold-soft">{prompt}</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent font-mono text-[12px] text-ivory outline-none placeholder:text-muted-foreground/50"
            placeholder="scrivi un comando e premi Invio"
          />
        </form>
        <div ref={bottom} />
      </div>
    </div>
  );
}

function TermRow({ line, prompt }: { line: { text: string; kind: "out" | "err" | "info" | "prompt" }; prompt: string }) {
  if (line.kind === "prompt")
    return (
      <div className="text-ivory">
        <span className="text-gold-soft">{prompt}</span>
        {line.text.startsWith(prompt) ? line.text.slice(prompt.length) : line.text}
      </div>
    );
  if (line.kind === "err")
    return <div className="whitespace-pre-wrap text-destructive/90">{line.text}</div>;
  if (line.kind === "info")
    return <div className="whitespace-pre-wrap text-gold-soft/90">{line.text}</div>;
  return <div className="whitespace-pre-wrap text-ivory/90">{line.text}</div>;
}
