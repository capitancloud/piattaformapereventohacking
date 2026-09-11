import type { Scenario } from "../types";
import Task01Recon from "./tasks/Task01Recon";
import Task02Fingerprint from "./tasks/Task02Fingerprint";
import Task03Webshell from "./tasks/Task03Webshell";
import Task04WebshellLive from "./tasks/Task04WebshellLive";
import Task05Listener from "./tasks/Task05Listener";
import Task06Payload from "./tasks/Task06Payload";
import Task07Trigger from "./tasks/Task07Trigger";
import Task08Interact from "./tasks/Task08Interact";
import Task09Defense from "./tasks/Task09Defense";
import Task10Quiz from "./tasks/Task10Quiz";

export const reverseShellScenario: Scenario = {
  id: "reverse-shell",
  slug: "reverse-shell",
  title: "Reverse Shell su IIS",
  subtitle: "Da un upload dimenticato a una shell interattiva su Windows Server",
  intro:
    "Un web server Microsoft IIS con un endpoint di upload mal configurato è uno dei percorsi più classici verso una compromissione totale. In questo modulo si ripercorre l'intera catena: ricognizione, scoperta dell'upload, webshell ASPX, allestimento del listener, generazione del payload PowerShell, trigger e shell interattiva. Ogni passaggio è simulato dentro il browser — nessun vero server, nessun vero attacco — ma i flussi, i comandi e gli errori sono quelli reali.",
  difficulty: "Intermedio",
  status: "available",
  tasks: [
    {
      id: "01-recon",
      title: "Ricognizione: cosa espone il target",
      goal: "Identificare che il target è un IIS Windows",
      brief:
        "Prima di attaccare bisogna sapere con cosa si ha a che fare. Un nmap sul target restituisce porte, servizi e versioni.",
      details:
        "In un pentest la ricognizione è sempre il primo passo. Serve a evitare rumore inutile (attaccare un servizio che non c'è) e a scegliere il vettore giusto. Qui useremo nmap in modalità -sV (service version detection) per capire se il target è Windows + IIS: sono le due condizioni che rendono possibile la catena ASPX + PowerShell che vedremo.",
      hint: "L'IP del target in palestra è 10.10.24.17.",
      explanation:
        "Riconoscere il web server (Microsoft-IIS/10.0) e il sistema operativo (Windows Server 2019) determina tutto il resto: la scelta del payload (ASPX/PowerShell), le porte plausibili per il listener, i comandi di post-exploitation.",
      Simulation: Task01Recon,
    },
    {
      id: "02-fingerprint",
      title: "Mappatura dell'app web",
      goal: "Scoprire l'endpoint di upload e la cartella pubblica",
      brief:
        "Naviga il sito e leggi gli header HTTP. Cerchi due cose: dove si carica un file, e dove i file caricati vengono serviti pubblicamente.",
      details:
        "Un web server IIS diventa vulnerabile a webshell/reverse shell quando esiste contemporaneamente: (1) un endpoint che accetta caricamento di file dall'utente, (2) una cartella dove quei file sono raggiungibili via URL, (3) l'esecuzione degli script nella stessa cartella. Le prime due si scoprono navigando; la terza si testa nel task 4.",
      hint: "Prova /upload e /uploads/.",
      explanation:
        "Il triangolo upload-serve-esegue è alla base della classe di attacchi \"unrestricted file upload\" (OWASP A04). Basta rompere uno dei tre lati per neutralizzare l'intero vettore.",
      Simulation: Task02Fingerprint,
    },
    {
      id: "03-webshell",
      title: "Anatomia di una webshell ASPX",
      goal: "Capire come 10 righe di C# diventano un canale di comando",
      brief:
        "Prima di scrivere un payload, guarda com'è fatta la webshell più semplice possibile in ASPX.",
      details:
        "Una webshell è una pagina eseguibile lato server che accetta un comando dall'attaccante, lo passa al sistema operativo e restituisce l'output. Sembra banale — e infatti lo è: è la minima quantità di codice necessaria per trasformare un upload in esecuzione remota. È il punto di partenza; nei task successivi la sostituiremo con qualcosa di più discreto (una reverse shell).",
      hint: "Concentrati su tre elementi: la direttiva di pagina, la lettura di ?cmd, la scrittura dell'output.",
      explanation:
        "In ASP.NET la sola presenza di <%@ Page Language=\"C#\" %> in un file .aspx è sufficiente perché IIS lo compili al volo ed esegua il codice: è il motivo per cui bastano poche righe per avere esecuzione arbitraria.",
      Simulation: Task03Webshell,
    },
    {
      id: "04-webshell-live",
      title: "Webshell in azione",
      goal: "Carica cmd.aspx e esegui comandi via HTTP",
      brief:
        "Metti in pratica: carica la webshell, aprila nel browser e usa il form per eseguire whoami, ipconfig, dir. Osserva come ogni comando è una singola richiesta HTTP.",
      details:
        "In questa simulazione l'endpoint /upload accetta qualsiasi estensione — inclusi .aspx — e li salva in /uploads/, cartella dove IIS esegue gli script. È la vulnerabilità più elementare, ma ancora oggi comunissima. La webshell risponde con l'output di ogni comando; puoi esplorare filesystem, rete, utenti. È rumorosa (ogni comando è nei log di access.log), ma efficace.",
      hint: "Comandi utili: whoami, hostname, ipconfig, dir c:\\inetpub\\wwwroot\\uploads.",
      explanation:
        "L'output di whoami — iis apppool\\defaultapppool — rivela chi sei sul server: né Administrator né SYSTEM. Puoi già fare parecchio (leggere web.config, esplorare la webroot), ma il vero salto di qualità è ottenere una shell interattiva.",
      Simulation: Task04WebshellLive,
    },
    {
      id: "05-listener",
      title: "Allestisci il listener",
      goal: "Aprire nc in ascolto su una porta plausibile",
      brief:
        "Una reverse shell funziona così: la vittima si connette a te. Ti serve un listener che accetti la connessione in arrivo.",
      details:
        "netcat (nc) è l'attrezzo standard: -l = listen, -v = verbose, -n = no DNS, -p = port. Scegli con criterio la porta: sotto 1024 servono privilegi di root; le porte più \"invisibili\" sono quelle che il firewall aziendale della vittima probabilmente lascia aperte in uscita (443, 8443, 53). Nei CTF si usa spesso 4444 o 9001 per convenzione.",
      hint: "Prova 443, 8443, 4444, 9001 o 53. Sotto 1024 in questa palestra serve root.",
      explanation:
        "Il listener è la parte \"attaccante\": senza di lui, il payload che gira sulla vittima si connetterebbe nel vuoto. La porta scelta viene condivisa automaticamente con i task successivi per generare un payload coerente.",
      Simulation: Task05Listener,
    },
    {
      id: "06-payload",
      title: "Genera il payload shell.aspx",
      goal: "Costruire uno .aspx che invochi una reverse shell PowerShell",
      brief:
        "Ora componi il payload: un file .aspx che, quando IIS lo esegue, avvia PowerShell con un one-liner che apre una TCPClient verso il tuo listener.",
      details:
        "Il payload è la combinazione di due tecniche: (1) un file .aspx che sfrutta l'esecuzione lato IIS per lanciare un processo, (2) una one-liner PowerShell — la classica \"PowerShell reverse shell\" (originariamente di Nishang) — che crea un socket TCP verso LHOST:LPORT e collega input/output di powershell.exe al socket. La one-liner è passata come -EncodedCommand (base64) per evitare problemi di quoting.",
      hint: "LPORT deve coincidere con la porta del listener aperto nel task 5.",
      explanation:
        "Il pattern LHOST/LPORT è universale in questo tipo di payload: LHOST è il tuo IP raggiungibile dalla vittima, LPORT la porta su cui stai ascoltando. Sbagliare uno dei due significa nessuna connessione.",
      Simulation: Task06Payload,
    },
    {
      id: "07-trigger",
      title: "Carica e trigga il payload",
      goal: "Vedere la shell aprirsi sul listener",
      brief:
        "Carica shell.aspx nella cartella /uploads/, poi chiama il suo URL dal browser. IIS lo compila, PowerShell parte, si connette al listener: shell aperta.",
      details:
        "È il momento chiave. La sequenza esatta è: (1) POST /upload con shell.aspx come contenuto, (2) IIS lo salva in /uploads/shell.aspx, (3) tu apri http://target/uploads/shell.aspx, (4) IIS compila la pagina, esegue System.Diagnostics.Process.Start(\"powershell.exe\", …), (5) powershell apre TCPClient(LHOST, LPORT), (6) il tuo nc mostra \"connect from …\" e ti trovi davanti al prompt PS della vittima.",
      hint: "Prima Carica, poi Trigger. Guarda il terminale a destra: la connessione entra da sola.",
      explanation:
        "Questa è, meccanicamente, un'intera compromissione. La difesa più economica è impedire che uno .aspx caricato venga eseguito — non serve rilevarlo, basta non fargli fare male (accessPolicy=\"Read\" sulla cartella uploads).",
      Simulation: Task07Trigger,
    },
    {
      id: "08-interact",
      title: "Post-exploitation: dentro il server",
      goal: "Enumerare il sistema dalla shell interattiva",
      brief:
        "Ora hai un prompt PowerShell sul server. Comincia a guardarti intorno: chi sei, dov'è la webroot, quali utenti esistono, cosa c'è in web.config.",
      details:
        "La post-exploitation è la fase in cui l'attaccante trasforma \"esecuzione remota di comandi\" in \"controllo utile\": cerca credenziali (web.config, appsettings.json, chiavi API), enumera Active Directory (se il server è in dominio), scarica strumenti aggiuntivi, cerca vie di escalation da IIS APPPOOL a SYSTEM (SeImpersonatePrivilege → Juicy/RoguePotato, servizi vulnerabili, ecc.).",
      hint: "Almeno: whoami, hostname, Get-Content C:\\inetpub\\wwwroot\\web.config.",
      explanation:
        "Il vero danno raramente sta nel web server in sé: sta nelle credenziali che quel web server conosce (DB, servizi cloud, altri sistemi). Ecco perché non tenere segreti in file leggibili dal processo web è una difesa più profonda di qualunque WAF.",
      Simulation: Task08Interact,
    },
    {
      id: "09-defense",
      title: "Contromisure: cosa funziona davvero",
      goal: "Distinguere difese reali da difese cosmetiche",
      brief:
        "Selezione multipla: individua tutte e sole le contromisure che, applicate al caso di questo modulo, avrebbero effettivamente fermato l'attacco (o ridotto il suo impatto).",
      details:
        "Il modo migliore per fissare i concetti è ragionare al contrario: dato l'attacco che abbiamo appena eseguito, quali controlli avrebbero rotto la catena? Alcune voci sembrano ragionevoli ma non lo sono (rinominare i file, nascondere gli header, validare solo lato client). Altre sono meno visibili ma efficaci (egress filtering, application pool con privilegi minimi, disabilitare gli handler nella cartella di upload).",
      hint: "Chiediti per ogni voce: \"un attaccante con un terminale può aggirarla?\".",
      explanation:
        "La sicurezza si misura sulla catena, non sui singoli anelli: bastano una prevenzione robusta all'upload, un handler disabilitato in /uploads, un app pool a bassi privilegi e un egress filter, per rendere la catena descritta praticamente impossibile.",
      Simulation: Task09Defense,
    },
    {
      id: "10-quiz",
      title: "Quiz finale — 10 domande",
      goal: "Consolidare la catena e le difese",
      brief:
        "Dieci domande dalla A alla Z: dalla definizione di reverse shell alla scelta della porta, dall'identità dell'app pool alle contromisure. Rispondi correttamente a tutte per completare il modulo.",
      details:
        "Se qualcosa non torna, torna al task corrispondente: la ripetizione con contesto vale molto più di leggere una spiegazione due volte.",
      hint: "Ragiona su: chi parla per primo? con quali privilegi? cosa vede il difensore nei log?",
      explanation:
        "Reverse shell su IIS è un caso da manuale di come una serie di piccole trascuratezze (upload permissivo, cartella eseguibile, app pool troppo privilegiato, nessun egress filter) si combinano in una compromissione grave.",
      Simulation: Task10Quiz,
    },
  ],
};
