import type { Scenario } from "../types";
import Task01WhatIs from "./tasks/Task01WhatIs";
import Task02Winpeas from "./tasks/Task02Winpeas";
import Task03Uac from "./tasks/Task03Uac";
import Task04Services from "./tasks/Task04Services";
import Task05UnquotedPath from "./tasks/Task05UnquotedPath";
import Task06AlwaysInstall from "./tasks/Task06AlwaysInstall";
import Task07Tokens from "./tasks/Task07Tokens";
import Task08Registry from "./tasks/Task08Registry";
import Task09Lab from "./tasks/Task09Lab";
import Task10Quiz from "./tasks/Task10Quiz";

export const windowsPrivescScenario: Scenario = {
  id: "windows-privesc",
  slug: "windows-privesc",
  title: "Privilege Escalation su Windows",
  subtitle: "Da utente normale a SYSTEM, con calma e con metodo",
  intro:
    "Su Windows non si diventa amministratori per magia: si osservano le stesse cinque o sei debolezze classiche — UAC aggirabile, servizi mal configurati, percorsi non tra virgolette, chiavi di registro sensibili, token privilegiati. In questo scenario impari a riconoscerle una per una con simulazioni semplici e visuali. Nessun prerequisito: ogni tecnica parte da zero, con esempi concreti e un piccolo laboratorio finale.",
  highlights: [
    "Sei tecniche classiche di privesc su Windows, ognuna con una simulazione diversa.",
    "Un finto winPEAS colorato che evidenzia le voci sospette, come nella realtà.",
    "Un laboratorio finale in cui scegli tu la strada per arrivare a SYSTEM.",
  ],
  category: "Metodologia Pentest",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-cose",
      title: "Cos'è la privilege escalation su Windows",
      goal: "Distinguere quando un'azione è escalation e quando è qualcos'altro",
      brief:
        "La privilege escalation su Windows è passare da un account limitato (utente, service account) ad Administrator o a SYSTEM sulla stessa macchina. Non è entrare da fuori né spostarsi verso altri PC.",
      details: `Su Windows il livello massimo non è «Administrator» ma «NT AUTHORITY\\SYSTEM»: è l'account con cui gira il kernel e i servizi più critici. Passare da utente normale ad Administrator, o da Administrator a SYSTEM, sono entrambi casi di privesc.

Se invece stai entrando da fuori (per esempio con un exploit RDP) è exploitation; se stai saltando verso un altro host del dominio è movimento laterale.`,
      hint: "Chiediti: sono già sulla macchina? Sto salendo di privilegi lì dentro?",
      explanation: "Sai riconoscere quando un'azione è privilege escalation e quando appartiene a un'altra fase.",
      Simulation: Task01WhatIs,
    },
    {
      id: "02-winpeas",
      title: "Enumerare con winPEAS",
      goal: "Leggere l'output di enumerazione e individuare le anomalie",
      brief:
        "winPEAS è la versione Windows di linpeas: raccoglie decine di controlli locali e colora in rosso ciò che merita attenzione. È il primo passo di ogni privesc.",
      details: `winPEAS interroga i servizi, i percorsi, le patch mancanti, i privilegi del token, le chiavi di registro sensibili e le credenziali salvate. Nella finestra vedi un output realistico: le righe importanti sono colorate.

Clicca le tre righe che rappresentano vere opportunità di privilege escalation e ignora il rumore.`,
      hint: "Guarda ciò che è rosso: AlwaysInstallElevated a 1, servizio con percorso non tra virgolette, credenziali salvate.",
      explanation: "Sai leggere l'output di winPEAS e individuare le voci su cui investigare.",
      Simulation: Task02Winpeas,
    },
    {
      id: "03-uac",
      title: "UAC bypass — capire il salto",
      goal: "Riconoscere quando UAC è un ostacolo aggirabile",
      brief:
        "UAC (User Account Control) chiede conferma prima di eseguire azioni amministrative. Se sei già in un gruppo di amministratori ma con token filtrato, alcuni programmi «auto-elevanti» permettono di saltare la richiesta.",
      details: `Il caso classico è fodhelper.exe: è firmato Microsoft, si auto-eleva senza mostrare il popup e prima di partire legge una chiave di registro sotto HKCU. Se ci scrivi il comando da eseguire, fodhelper lo lancia con privilegi elevati.

Ordina i passaggi del bypass di fodhelper e osserva l'effetto.`,
      hint: "Prima scrivi la chiave HKCU, poi lanci fodhelper.exe, che legge la chiave e ti dà la shell elevata.",
      explanation: "Hai capito la logica di un UAC bypass: sfruttare programmi firmati che si auto-elevano.",
      Simulation: Task03Uac,
    },
    {
      id: "04-servizi",
      title: "Servizio con permessi deboli",
      goal: "Sfruttare un servizio Windows che l'utente può modificare",
      brief:
        "Un servizio Windows gira spesso come SYSTEM. Se un utente normale può cambiarne il binario di avvio (BINARY_PATH_NAME), al prossimo riavvio del servizio Windows eseguirà come SYSTEM il comando scelto dall'utente.",
      details: `Il comando «sc qc <servizio>» mostra come è configurato un servizio; «sc config» lo modifica. Se i permessi sono scritti male e l'utente ha SERVICE_CHANGE_CONFIG, si punta il binario a un payload proprio e si riavvia il servizio.

Nel task hai una lista di servizi: scegli quello davvero sfruttabile e componi i tre comandi giusti.`,
      hint: "Cerca il servizio con «BUILTIN\\Users: FullControl». Poi: sc config → sc stop → sc start.",
      explanation: "Sai che un servizio scrivibile dall'utente è una privesc quasi automatica.",
      Simulation: Task04Services,
    },
    {
      id: "05-percorso",
      title: "Percorso non tra virgolette",
      goal: "Riconoscere e sfruttare un unquoted service path",
      brief:
        "Se il percorso di un servizio contiene spazi e NON è tra virgolette, Windows lo interpreta a pezzi. Chi può scrivere in una cartella intermedia può piazzare lì un eseguibile che verrà lanciato al posto del servizio.",
      details: `Esempio: «C:\\Program Files\\Vulnerable App\\service.exe». Senza virgolette, Windows prova nell'ordine:

  C:\\Program.exe
  C:\\Program Files\\Vulnerable.exe
  C:\\Program Files\\Vulnerable App\\service.exe

Se puoi scrivere in C:\\, basta lasciare lì «Program.exe» per farlo eseguire come SYSTEM al riavvio del servizio.

Scegli il file da creare e dove metterlo.`,
      hint: "L'eseguibile falso deve chiamarsi come il primo pezzo con spazio nel percorso.",
      explanation: "Sai riconoscere un unquoted path e trasformarlo in una privesc.",
      Simulation: Task05UnquotedPath,
    },
    {
      id: "06-msi",
      title: "AlwaysInstallElevated",
      goal: "Sfruttare due chiavi di registro che elevano i pacchetti MSI",
      brief:
        "Se sia HKLM che HKCU hanno «AlwaysInstallElevated = 1», qualsiasi pacchetto .msi installato da un utente normale gira come SYSTEM. È la privesc più semplice esistente su Windows.",
      details: `Il controllo si fa con «reg query»: entrambe le chiavi devono valere 1. A quel punto basta costruire un MSI malevolo (per esempio con msfvenom) e installarlo con «msiexec /quiet /qn /i shell.msi».

Compila il piano nell'ordine giusto.`,
      hint: "Prima verifica le due chiavi, poi crea l'MSI, poi lancia msiexec.",
      explanation: "Hai capito perché AlwaysInstallElevated è considerata la privesc più «regalata» di Windows.",
      Simulation: Task06AlwaysInstall,
    },
    {
      id: "07-token",
      title: "Token privilegiati",
      goal: "Riconoscere i privilegi di token che equivalgono a SYSTEM",
      brief:
        "«whoami /priv» elenca i privilegi del tuo token. Alcuni sono innocui (SeShutdownPrivilege), altri sono la strada regia per SYSTEM: SeImpersonatePrivilege, SeAssignPrimaryTokenPrivilege, SeBackupPrivilege, SeRestorePrivilege.",
      details: `Il caso più celebre è SeImpersonatePrivilege: gli account di servizio (IIS, MSSQL) lo hanno per default, e con exploit come JuicyPotato/PrintSpoofer si passa a SYSTEM in pochi secondi.

Guarda la lista di privilegi trovati sul token e clicca quelli che rappresentano una via verso SYSTEM.`,
      hint: "Impersonate, AssignPrimaryToken, Backup, Restore, Debug: tutti «rossi». Shutdown e ChangeNotify sono normali.",
      explanation: "Sai leggere whoami /priv e vedere subito se il token è già «regalato».",
      Simulation: Task07Tokens,
    },
    {
      id: "08-registro",
      title: "Password nel registro e nei file",
      goal: "Trovare credenziali salvate in chiaro sul sistema",
      brief:
        "Windows conserva credenziali un po' ovunque: chiavi di autologon, file di risposta di installazione (Unattend.xml), preferenze di Group Policy. Se non vengono ripulite, sono un tesoro.",
      details: `Le zone classiche da controllare sono:

  reg query HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon
  C:\\Windows\\Panther\\Unattend.xml
  \\\\dominio\\SYSVOL\\...\\Groups.xml   (GPP cpassword, ormai storico)

Nel task hai tre finestre: clicca solo dove ci sono davvero credenziali sfruttabili.`,
      hint: "AutoAdminLogon = 1 con DefaultPassword, Unattend con <Password>, Groups.xml con cpassword.",
      explanation: "Sai dove Windows lascia credenziali dimenticate e come riconoscerle a colpo d'occhio.",
      Simulation: Task08Registry,
    },
    {
      id: "09-lab",
      title: "Laboratorio: la tua scalata a SYSTEM",
      goal: "Portare un utente qualunque fino a SYSTEM scegliendo tu la strada",
      brief:
        "Sei l'utente «alex» su win10-dev. L'enumerazione con winPEAS ha rivelato tre indizi diversi: un servizio scrivibile, AlwaysInstallElevated attivo e SeImpersonatePrivilege sul token del web server. Scegli la strada.",
      details: `Ogni scelta porta a SYSTEM, ma con rumore e complessità diversi. Prova a immaginare quale useresti in un pentest reale e osserva la simulazione della scalata passo per passo.`,
      hint: "Non c'è una risposta unica: apri tutte le strade per confrontarle.",
      explanation: "Hai completato una scalata a SYSTEM scegliendo la tecnica più adatta agli indizi.",
      Simulation: Task09Lab,
    },
    {
      id: "10-quiz",
      title: "Verifica finale",
      goal: "Consolidare le tecniche di privilege escalation su Windows",
      brief:
        "Dieci domande semplici sui concetti chiave: UAC, servizi, unquoted path, MSI, token, credenziali. Bastano sette risposte corrette.",
      details: `Se una domanda ti mette in difficoltà, torna al micro-task corrispondente. L'obiettivo è saper guardare una macchina Windows e riconoscere in cinque minuti quali sono le tre-quattro vie più promettenti verso SYSTEM.`,
      hint: "Le risposte più prudenti e metodologicamente corrette sono di solito quelle giuste.",
      explanation: "Hai completato lo scenario Privilege Escalation su Windows.",
      Simulation: Task10Quiz,
    },
  ],
};
