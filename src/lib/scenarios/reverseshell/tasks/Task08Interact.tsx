import { useEffect, useRef, useState } from "react";
import { InfoNote, SuccessNote, WarnNote } from "@/components/lab/Feedback";
import { isShellOpen } from "../state";
import type { TaskContext } from "../../types";
import { cn } from "@/lib/utils";

interface Row {
  cmd: string;
  out: string;
}

const RESP: Record<string, string> = {
  whoami: "iis apppool\\defaultapppool",
  hostname: "WEB01",
  "$psversiontable.psversion":
    "Major  Minor  Build  Revision\n-----  -----  -----  --------\n5      1      17763  3406",
  "get-childitem c:\\users":
    "    Directory: C:\\Users\n\nMode  LastWriteTime         Length Name\n----  -------------         ------ ----\nd---- 07/09/2026     08:11        Administrator\nd---- 07/09/2026     08:11        Public\nd---- 07/09/2026     08:11        svc_web",
  "get-childitem c:\\inetpub\\wwwroot":
    "Mode  LastWriteTime         Length Name\n----  -------------         ------ ----\nd---- 07/09/2026     09:12        uploads\n-a--- 07/09/2026     08:44   4321 web.config\n-a--- 07/09/2026     08:44   1832 default.aspx",
  "get-content c:\\inetpub\\wwwroot\\web.config":
    "<configuration>\n  <connectionStrings>\n    <add name=\"AcmeDB\"\n         connectionString=\"Server=db01;Database=acme;User Id=sa;Password=S3rver!Adm1n;\" />\n  </connectionStrings>\n</configuration>",
  "systeminfo | findstr /b /c:\"os name\" /c:\"os version\"":
    "OS Name:                   Microsoft Windows Server 2019 Standard\nOS Version:                10.0.17763 N/A Build 17763",
  "net user":
    "\nUser accounts for \\\\WEB01\n\n-------------------------------------------------------------------------------\nAdministrator            DefaultAccount           Guest\nsvc_web\nThe command completed successfully.",
};

const REQUIRED = ["whoami", "hostname", "get-content c:\\inetpub\\wwwroot\\web.config"];

export default function Task08Interact({ markComplete, isComplete }: TaskContext) {
  const shellReady = isShellOpen();
  const [rows, setRows] = useState<Row[]>([]);
  const [cmd, setCmd] = useState("");
  const [ranSet, setRanSet] = useState<Set<string>>(new Set());
  const scroller = useRef<HTMLDivElement>(null);

  const run = () => {
    if (!shellReady || !cmd.trim()) return;
    const key = cmd.trim().toLowerCase();
    let out = RESP[key];
    if (!out) {
      if (key.startsWith("cd ")) out = "";
      else out = `${cmd.split(" ")[0]} : The term is not recognized as the name of a cmdlet...`;
    }
    const newRows = [...rows, { cmd, out }];
    setRows(newRows);
    setCmd("");
    const nextRan = new Set(ranSet);
    if (REQUIRED.includes(key)) nextRan.add(key);
    setRanSet(nextRan);
    if (REQUIRED.every((r) => nextRan.has(r))) markComplete();
  };

  useEffect(() => {
    if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight;
  }, [rows]);

  const suggestions = [
    "whoami",
    "hostname",
    "$PSVersionTable.PSVersion",
    "Get-ChildItem C:\\Users",
    "Get-ChildItem C:\\inetpub\\wwwroot",
    "Get-Content C:\\inetpub\\wwwroot\\web.config",
    "systeminfo | findstr /B /C:\"OS Name\" /C:\"OS Version\"",
    "net user",
  ];

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-border bg-black shadow-2xl shadow-black/60">
        <div className="border-b border-border/60 bg-surface-2 px-3 py-2 text-xs font-mono text-muted-foreground">
          PS C:\Windows\system32\inetsrv&gt; · reverse shell attiva su WEB01 (10.10.24.17)
        </div>
        <div
          ref={scroller}
          className="max-h-80 min-h-[240px] overflow-auto p-4 font-mono text-[12px] leading-relaxed"
        >
          {!shellReady && (
            <div className="text-destructive/80">
              Nessuna shell aperta. Completa prima il task 7.
            </div>
          )}
          {rows.map((r, i) => (
            <div key={i} className="mb-2">
              <div className="text-ivory">
                <span className="text-gold-soft">PS C:\Windows\system32\inetsrv&gt; </span>
                {r.cmd}
              </div>
              {r.out && (
                <pre className="whitespace-pre-wrap text-ivory/90">{r.out}</pre>
              )}
            </div>
          ))}
          {shellReady && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run();
              }}
              className="flex items-center"
            >
              <span className="text-gold-soft">PS C:\Windows\system32\inetsrv&gt;&nbsp;</span>
              <input
                value={cmd}
                onChange={(e) => setCmd(e.target.value)}
                autoFocus
                spellCheck={false}
                className="flex-1 bg-transparent font-mono text-[12px] text-ivory outline-none"
              />
            </form>
          )}
        </div>
      </div>

      {shellReady && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setCmd(s)}
              className={cn(
                "rounded border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-muted-foreground transition hover:border-gold/50 hover:text-ivory",
                ranSet.has(s.toLowerCase()) && "border-success/50 text-success",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {!isComplete && shellReady && (
        <InfoNote>
          Esegui almeno <code>whoami</code>, <code>hostname</code> e{" "}
          <code>Get-Content C:\inetpub\wwwroot\web.config</code>. L'ultimo è ciò che
          davvero fa male: dentro il <code>web.config</code> ci sono spesso stringhe di
          connessione al database in chiaro.
        </InfoNote>
      )}

      {ranSet.has("get-content c:\\inetpub\\wwwroot\\web.config") && !isComplete && (
        <WarnNote>
          Hai appena letto la password <code>sa</code> del database di produzione. Da
          qui l'attaccante si collega direttamente al DB, bypassando l'applicazione.
        </WarnNote>
      )}

      {isComplete && (
        <SuccessNote>
          Sei dentro. In un incidente reale a questo punto l'attaccante scaricherebbe
          strumenti (SharpHound, mimikatz), enumererebbe il dominio Active Directory,
          e tenterebbe il privilege escalation. Vediamo le contromisure nel task 9.
        </SuccessNote>
      )}
    </div>
  );
}
