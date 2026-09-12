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
      details: `Su Windows la gerarchia dei privilegi è diversa da Linux, ma il concetto è lo stesso: partire da un account con pochi diritti e arrivare a uno con molti più diritti sulla stessa macchina. L'utente amministratore locale ha poteri enormi: può installare software, modificare servizi, leggere quasi ogni file, creare altri utenti. Ma esiste un livello ancora più alto: NT AUTHORITY\\SYSTEM, l'account usato dal sistema operativo stesso e da molti servizi critici.

La privilege escalation su Windows può quindi significare due cose: salire da un utente normale a Administrator locale, oppure salire da Administrator a SYSTEM. Entrambe sono escalation verticale, perché aumenti i tuoi privilegi sulla stessa macchina.

Per distinguerla dalle altre fasi, usa la stessa domanda di sempre: sei già dentro il computer? Stai salendo di livello lì dentro? Se sì, è privesc. Se stai ancora cercando di entrare dall'esterno, per esempio con un exploit su RDP o SMB, è exploitation. Se stai usando le credenziali di una macchina per saltare su un'altra, è movimento laterale.`,
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
      details: `Prima di provare a salire, devi conoscere il terreno. winPEAS è uno degli strumenti più usati per l'enumerazione locale su Windows: raccoglie in un colpo solo decine di controlli che altrimenti faresti a mano con comandi come sc, reg query, whoami /priv, accesschk e wmic. È la controparte Windows di linpeas.

L'output di winPEAS colora le voci in base alla probabilità di essere sfruttabili. Il rosso indica quasi sempre una via di privilege escalation: un servizio con permessi deboli, un percorso non tra virgolette, AlwaysInstallElevato attivo, credenziali in chiaro nel registro, privilegi di token pericolosi. Il giallo è un sospetto da verificare. Il grigio è solo rumore di fondo: versioni di Windows, software installato, utenti locali, patch.

La competenza non sta nel lanciare lo strumento, ma nel saper leggere l'output. Nella simulazione vedrai un estratto realistico. Il tuo compito è cliccare le tre righe che rappresentano vere opportunità di scalata, lasciando stare tutto il resto.`,
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
      details: `UAC, o User Account Control, è il meccanismo che chiede conferma quando un programma tenta di fare qualcosa di amministrativo. Quando sei in un gruppo di amministratori, Windows ti dà un token filtrato: hai i diritti, ma devi esplicitamente confermare per usarli. In teoria dovrebbe fermare molti attacchi, ma in pratica esistono modi di aggirarlo.

Il trucco classico sfrutta programmi firmati Microsoft che si auto-elevano senza mostrare il popup. Un esempio famoso è fodhelper.exe, un eseguibile di sistema legittimo. Prima di avviarsi, fodhelper legge una chiave di registro sotto HKCU\\Software\\Classes\\ms-settings\\Shell\\Open\\command. Se tu, come utente normale, scrivi in quella chiave il comando che vuoi eseguire, fodhelper lo lancerà con privilegi elevati senza chiedere nulla.

Il procedimento è: scrivi il comando nella chiave di registro, imposta DelegateExecute a stringa vuota nella stessa chiave, avvia fodhelper.exe. L'eseguibile legge la chiave e esegue il tuo comando con il token elevato. Nella simulazione dovrai riordinare i quattro passi nella sequenza corretta.`,
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
      details: `I servizi Windows sono programmi che girano in background, spesso con l'account SYSTEM, che è il più potente della macchina. Quando un amministratore installa un servizio personalizzato, a volte dimentica di impostare correttamente i permessi. Se un utente normale ha il diritto di modificare la configurazione del servizio, può dire a Windows di eseguire qualsiasi comando al posto del binario originale.

Il comando sc qc NomeServizio mostra la configurazione attuale, incluso il BINARY_PATH_NAME, cioè il percorso dell'eseguibile che Windows lancia. Il comando sc config NomeServizio binPath= "cmd.exe /c ..." cambia quel percorso. Dopo aver modificato il binario, bisogna fermare e riavviare il servizio con sc stop e sc start. Al riavvio, Windows eseguirà il nuovo comando come SYSTEM.

Nella simulazione vedrai tre servizi. Due hanno permessi corretti: gli utenti normali possono solo leggere la configurazione. Il terzo ha un'ACL anomala, con BUILTIN\\Users: FullControl. Quello è il servizio sfruttabile. Dovrai selezionarlo e scegliere i tre comandi giusti tra quelli proposti.`,
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
      details: `Su Windows, quando un percorso contiene spazi e non è racchiuso tra virgolette, il sistema lo interpreta a pezzi. Immagina un servizio che ha questo BINARY_PATH_NAME: C:\\Program Files\\Vulnerable App\\service.exe. Senza virgolette, Windows non legge tutto d'un fiato: prova prima a eseguire C:\\Program.exe. Se non lo trova, prova C:\\Program Files\\Vulnerable.exe. Se non lo trova nemmeno quello, infine prova il percorso completo.

Questo comportamento si chiama unquoted service path. Se un utente può scrivere in una cartella intermedia del percorso, può piazzare lì un eseguibile falso con il nome giusto. Al prossimo avvio del servizio, Windows eseguirà il file falso con i privilegi del servizio, spesso SYSTEM.

Nel nostro esempio, la prima tappa è C:\\Program.exe. Se riesci a scrivere in C:\\, crei un file chiamato Program.exe che fa ciò che vuoi. Quando il servizio parte, Windows lo lancia al posto del binario vero. Nella simulazione dovrai scegliere quale file falso creare e in quale cartella metterlo, tenendo conto di dove hai i permessi di scrittura.`,
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
      details: `AlwaysInstallElevated è una configurazione del registro che dice a Windows: quando un utente installa un pacchetto MSI, eseguilo con privilegi elevati. Esistono due chiavi, una a livello macchina (HKLM) e una a livello utente (HKCU). Perché la privesc funzioni, entrambe devono essere impostate a 1. Se solo una delle due è a 1, il trucco non funziona.

Quando entrambe le chiavi sono attive, qualsiasi utente può installare un pacchetto MSI che eseguirà comandi come SYSTEM. Un MSI è semplicemente un pacchetto di installazione: puoi costruirne uno che, invece di installare un programma, apre una shell inversa o aggiunge un utente agli amministratori. Strumenti come msfvenom possono generare un MSI con un payload dentro.

La sequenza corretta è: verifica HKLM, verifica HKCU, crea l'MSI con il payload, installalo con msiexec /quiet /qn /i shell.msi. Le opzioni /quiet e /qn fanno sì che l'installazione avvenga in modo silenzioso, senza finestre. Nella simulazione dovrai riordinare questi quattro passi.`,
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
