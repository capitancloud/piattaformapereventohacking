import type { Scenario } from "../types";
import Task01Intro from "./tasks/Task01Intro";
import Task02Distros from "./tasks/Task02Distros";
import Task03Terminal from "./tasks/Task03Terminal";
import Task04Filesystem from "./tasks/Task04Filesystem";
import Task05Files from "./tasks/Task05Files";
import Task06Permissions from "./tasks/Task06Permissions";
import Task07Users from "./tasks/Task07Users";
import Task08Processes from "./tasks/Task08Processes";
import Task09Apt from "./tasks/Task09Apt";
import Task10Quiz from "./tasks/Task10Quiz";

export const linuxScenario: Scenario = {
  id: "linux",
  slug: "linux",
  title: "Linux",
  subtitle: "Dal kernel alla shell: impara a muoverti nel sistema operativo degli hacker",
  intro:
    "Linux è il sistema operativo su cui poggia gran parte dell'ethical hacking. In questo scenario scopriamo cos'è il kernel, a cosa servono le distribuzioni e perché Kali Linux è così popolare tra i penetration tester. Poi passiamo alla pratica: shell, navigazione nel filesystem, gestione di file e directory, permessi, utenti, processi e pacchetti. Ogni task è un'esercitazione interattiva nel terminale.",
  highlights: [
    "Il kernel, le distribuzioni e il terminale di Kali.",
    "Comandi per file, permessi, utenti, processi e pacchetti.",
    "La sicurezza parte da saper muovere il sistema operativo.",
  ],
  category: "Fondamentali",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-intro",
      title: "Cos'è Linux?",
      goal: "Distinguere kernel, distribuzione e open source",
      brief: "Linux non è un programma: è un kernel. Tutto il resto si chiama distribuzione.",
      details:
        "Nel 1991 Linus Torvalds rilasciò il kernel Linux come progetto personale. Intorno a quel kernel si sono aggiunti programmi, librerie e strumenti GNU per formare le distribuzioni: Ubuntu, Debian, Fedora, CentOS, Kali e molte altre.\n\nLa differenza fondamentale rispetto a Windows o macOS è che il codice sorgente di Linux è pubblico: chiunque può leggerlo, modificarlo e redistribuirlo. Questo ha creato un ecosistema enorme, usato su server, smartphone (Android), embedded device e, naturalmente, laboratori di sicurezza.",
      hint: "Il kernel è il cuore che parla con l'hardware. La distribuzione è il sistema operativo completo pronto all'uso.",
      explanation:
        "Linux = kernel open source. Distribuzione = kernel + programmi. Kali Linux è una distribuzione specializzata per la sicurezza informatica.",
      Simulation: Task01Intro,
    },
    {
      id: "02-distros",
      title: "Distribuzioni e Kali Linux",
      goal: "Riconoscere le principali distro e collocare Kali",
      brief: "Ogni distribuzione ha un pubblico e uno scopo. Kali è quella dedicata alla sicurezza.",
      details:
        "Ubuntu è famosa per il desktop e i server, Debian è la sua base stabile, Fedora porta novità dal mondo Red Hat, CentOS/Rocky sono orientate all'impresa.\n\nKali Linux nasce da Debian ed è pensata per penetration testing, reverse engineering e forensics. Contiene migliaia di tool preinstallati (nmap, metasploit, wireshark, aircrack-ng...) e un ambiente già configurato per lavorare in sicurezza.",
      hint: "Kali non è un sistema operativo 'migliore' in assoluto: è semplicemente specializzato per chi fa sicurezza.",
      explanation:
        "Scegliere la distribuzione giusta dipende dall'uso. Kali è la cassetta degli attrezzi del security analyst.",
      Simulation: Task02Distros,
    },
    {
      id: "03-terminal",
      title: "Il terminale e la shell",
      goal: "Familiarizzare con prompt, utente e comandi base",
      brief: "La shell è l'interprete dei comandi. Il terminale è la finestra in cui la usi.",
      details:
        "Quando apri un terminale vedi qualcosa come kali@lab:~$. Quella stringa ti dice chi sei (kali), su quale macchina sei (lab) e in quale cartella ti trovi (~, la home).\n\nI comandi più semplici sono anche i più usati: pwd stampa la cartella corrente, whoami dice l'utente, clear pulisce lo schermo, history mostra i comandi passati. Non servono privilegi speciali: sono comandi dell'utente.",
      hint: "Prova pwd, whoami, clear e history. Basta scrivere il nome e premere Invio.",
      explanation:
        "La shell è il modo più diretto per parlare con Linux. Imparare a leggerla è il primo passo per usarla con sicurezza.",
      Simulation: Task03Terminal,
    },
    {
      id: "04-filesystem",
      title: "Navigare nel filesystem",
      goal: "Usare percorsi assoluti, relativi, ., .. e ~",
      brief: "In Linux tutto parte dalla radice /. Da lì si diramano file e cartelle.",
      details:
        "Il filesystem è un albero. / è la radice, /home contiene le home degli utenti, /etc i file di configurazione, /var i dati variabili.\n\nPuoi muoverti con percorsi assoluti (partono da /) o relativi (partono dalla cartella dove sei). . indica la cartella corrente, .. la cartella superiore, ~ è la home dell'utente.",
      hint: "cd documenti entra nella sottocartella. cd /etc va direttamente in etc. cd .. sale di un livello.",
      explanation:
        "Percorsi assoluti sono precisi e funzionano ovunque. Percorsi relativi sono comodi quando sei già vicino alla destinazione.",
      Simulation: Task04Filesystem,
    },
    {
      id: "05-files",
      title: "File e directory",
      goal: "Creare, copiare, spostare e rimuovere file",
      brief: "touch, mkdir, cp, mv, rm sono i comandi del giorno a giorno.",
      details:
        "mkdir crea una cartella, touch crea un file vuoto, cp copia, mv sposta o rinomina, rm cancella. Sono comandi potenti e immediati: non c'è cestino di recupero.\n\nIn questo task segui una sequenza guidata: crea una cartella report, dentro ci metti dati.txt, lo copi in backup.txt, rinomini backup in archivio.txt e infine rimuovi dati.txt.",
      hint: "Attenzione alla sintassi: cp sorgente destinazione. mv sorgente destinazione. rm nomefile.",
      explanation:
        "Gestire file dalla shell è veloce e scriptabile. È anche pericoloso: rm cancella definitivamente, senza richiedere conferma.",
      Simulation: Task05Files,
    },
    {
      id: "06-permissions",
      title: "Permessi e proprietà",
      goal: "Leggere e modificare i permessi con chmod",
      brief: "Ogni file ha tre gruppi di permessi: proprietario, gruppo e altri.",
      details:
        "La notazione rwx significa: r = leggere, w = scrivere, x = eseguire. I tre gruppi sono owner (proprietario), group (gruppo) e others (tutti gli altri).\n\nUno script eseguibile deve avere la x. Un file con password non deve essere leggibile da tutti. Impostare i permessi giusti è una delle difese più semplici e più trascurate.",
      hint: "Clicca su r, w, x per attivare o disattivare ogni permesso. Raggiungi la combinazione richiesta per ogni file.",
      explanation:
        "Permessi troppo ampi espongono dati sensibili. Permessi troppo stretti bloccano programmi legittimi. Il giusto equilibrio è la sicurezza.",
      Simulation: Task06Permissions,
    },
    {
      id: "07-users",
      title: "Utenti, gruppi e sudo",
      goal: "Capire quando serve essere root",
      brief: "root può tutto. Gli utenti normali no. sudo alza temporaneamente i privilegi.",
      details:
        "Linux separa gli utenti. root è l'amministratore e può modificare qualsiasi parte del sistema. Gli utenti normali lavorano nella propria home e possono solo leggere gran parte del resto.\n\nsudo (superuser do) permette a un utente autorizzato di eseguire un comando come root, previa autenticazione. Serve per installare pacchetti, modificare file di sistema, gestire utenti e servizi.",
      hint: "Se il comando tocca file di sistema o installa software, serve sudo. Se lavori nella tua home, no.",
      explanation:
        "Usare il minimo privilegio possibile riduce i danni di un errore o di un account compromesso.",
      Simulation: Task07Users,
    },
    {
      id: "08-processes",
      title: "Processi e servizi",
      goal: "Vedere, terminare e gestire processi",
      brief: "Ogni programma in esecuzione è un processo con un PID.",
      details:
        "ps elenca i processi, top li mostra in tempo reale, kill termina un processo dato il PID, systemctl gestisce i servizi.\n\nUn processo che consuma CPU anomala può essere malware, un miner o semplicemente un programma impazzito. Saperlo individuare e fermare è essenziale sia in difesa che in analisi forense.",
      hint: "Cerca il processo con CPU più alta. Terminalo con kill PID. Poi ferma il servizio apache2.",
      explanation:
        "Gestire processi e servizi ti permette di controllare cosa gira sulla macchina e reagire a comportamenti sospetti.",
      Simulation: Task08Processes,
    },
    {
      id: "09-apt",
      title: "Gestione pacchetti con apt",
      goal: "Installare, aggiornare e rimuovere software",
      brief: "apt è il gestore pacchetti di Debian e Kali.",
      details:
        "apt update aggiorna l'elenco dei pacchetti disponibili. apt install nome installa un pacchetto. apt remove nome lo rimuove. apt upgrade aggiorna i pacchetti già installati.\n\nÈ buona norma eseguire apt update prima di installare o aggiornare, così il sistema sa quali versioni sono disponibili.",
      hint: "Segui l'ordine: update → install → remove → upgrade.",
      explanation:
        "Tenere il sistema aggiornato è una delle prime regole di sicurezza. apt rende semplice installare tool e applicare patch.",
      Simulation: Task09Apt,
    },
    {
      id: "10-quiz",
      title: "Quiz finale — 10 domande",
      goal: "Ripassare i concetti del modulo Linux",
      brief: "Dieci domande per fissare ciò che hai imparato sulla shell, file, permessi, utenti e pacchetti.",
      details:
        "Le domande coprono kernel, distribuzioni, comandi base, filesystem, permessi, sudo, processi e apt. Se non raggiungi il punteggio minimo, rivedi i task precedenti e riprova.",
      hint: "Pensa ai comandi fondamentali: pwd, cd, ls, mkdir, chmod, sudo, kill, apt.",
      explanation:
        "Con la shell padroneggiata, puoi muoverti con sicurezza in qualsiasi ambiente Linux, inclusi i laboratori di penetration testing.",
      Simulation: Task10Quiz,
    },
  ],
};
