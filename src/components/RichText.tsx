import { Fragment, type ReactNode } from "react";

// Inline: **bold**, __underline__, `code`
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`)/g;
  let last = 0;
  let i = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const tok = match[0];
    const key = `${keyPrefix}-${i++}`;
    if (tok.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-foreground">
          {tok.slice(2, -2)}
        </strong>,
      );
    } else if (tok.startsWith("__")) {
      nodes.push(
        <span key={key} className="underline decoration-accent/70 decoration-2 underline-offset-4">
          {tok.slice(2, -2)}
        </span>,
      );
    } else {
      nodes.push(
        <code
          key={key}
          className="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[0.85em] text-accent [overflow-wrap:anywhere]"
        >
          {tok.slice(1, -1)}
        </code>,
      );
    }
    last = match.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function RichText({ text, className }: { text: string; className?: string }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className={className ?? "space-y-3 text-[0.95rem] leading-relaxed text-muted-foreground"}>
      {blocks.map((block, bi) => {
        const lines = block.split("\n");
        // Bullet list
        if (lines.every((l) => /^[-•]\s+/.test(l.trim()))) {
          return (
            <ul key={bi} className="ml-1 space-y-1.5">
              {lines.map((l, li) => (
                <li key={li} className="flex gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="min-w-0 flex-1">
                    {renderInline(l.trim().replace(/^[-•]\s+/, ""), `${bi}-${li}`)}
                  </span>
                </li>
              ))}
            </ul>
          );
        }
        // Sub-heading
        if (block.startsWith("## ")) {
          return (
            <h4
              key={bi}
              className="pt-1 font-display text-base font-semibold text-foreground"
            >
              {renderInline(block.slice(3), `h-${bi}`)}
            </h4>
          );
        }
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <Fragment key={li}>
                {li > 0 && <br />}
                {renderInline(l, `${bi}-${li}`)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
