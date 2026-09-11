import { type ReactNode } from "react";
import { FileText, FolderTree, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export function FileViewer({
  resolvedPath,
  content,
  notFound,
  secret,
  header,
}: {
  resolvedPath: string;
  content?: string | undefined;
  notFound?: boolean | undefined;
  secret?: boolean | undefined;
  header?: ReactNode;
}) {
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border bg-surface-2 px-3 py-2 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <FolderTree className="h-3.5 w-3.5" />
          <span className="font-mono">{resolvedPath}</span>
        </div>
        {secret && (
          <span className="inline-flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-destructive">
            <ShieldAlert className="h-3 w-3" /> Riservato
          </span>
        )}
      </div>
      {header}
      {notFound ? (
        <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" /> File non trovato.
        </div>
      ) : (
        <pre
          className={cn(
            "max-h-72 overflow-auto whitespace-pre-wrap break-words p-4 font-mono text-xs leading-relaxed",
            secret ? "text-gold" : "text-ivory/90",
          )}
        >
          {content}
        </pre>
      )}
    </div>
  );
}
