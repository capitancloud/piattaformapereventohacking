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
      brief: "In questa introduzione esploreremo le fondamenta di Linux, distinguendo il cuore del sistema operativo dai programmi che usiamo ogni giorno. Capire questa differenza è essenziale per comprendere come funziona l'intero ecosistema open source e perché sia così flessibile.",
      details:
        "Immagina Linux come il motore di un'auto: il kernel è ciò che fa muovere tutto, gestendo la comunicazione tra i componenti fisici e il software. Una distribuzione (o 'distro') è invece l'auto completa, con carrozzeria, sedili e accessori scelti per uno scopo specifico.\n\nIl kernel da solo non basterebbe a navigare sul web o scrivere documenti; per questo vengono aggiunti strumenti GNU, interfacce grafiche e applicazioni. Grazie alla natura open source, chiunque può vedere come è costruito il motore e modificarlo, garantendo una trasparenza che i sistemi chiusi non offrono.\n\nIn questa prima parte, imparerai a distinguere questi termini tecnici e a capire perché il mondo della sicurezza informatica ha scelto Linux come casa base. Dovrai identificare gli elementi chiave che compongono un sistema operativo completo.\n\nLinux non indica sempre un sistema completo: in senso preciso è il kernel che gestisce memoria, processi e periferiche. Le distribuzioni aggiungono strumenti, programmi e un metodo di installazione, creando ambienti diversi costruiti sopra lo stesso nucleo.",
      hint: "Ricorda che il kernel è il 'cuore' tecnico, mentre la distribuzione è il pacchetto 'pronto all'uso' che include programmi e utilità.",
      explanation:
        "Hai imparato che Linux è un kernel su cui poggiano le distribuzioni. Questa modularità è ciò che lo rende lo strumento preferito per server e strumenti di hacking.",
      Simulation: Task01Intro,
    },
    {
      id: "02-distros",
      title: "Distribuzioni e Kali Linux",
      goal: "Riconoscere le principali distro e collocare Kali",
      brief: "Non tutte le distribuzioni Linux sono uguali: alcune servono per l'ufficio, altre per i server e altre ancora per la sicurezza. Scopriremo perché Kali Linux è diventata lo standard del settore per chiunque voglia testare la sicurezza di una rete.",
      details:
        "Esistono centinaia di varianti di Linux, chiamate distribuzioni. Ubuntu è ottima per chi inizia a usare il computer, Debian è nota per la sua incredibile stabilità, mentre Fedora sperimenta sempre le ultime tecnologie.\n\nKali Linux è una distribuzione speciale basata su Debian, progettata specificamente per il penetration testing e l'analisi forense. Invece di installare manualmente centinaia di strumenti complessi, Kali te li fornisce già pronti e configurati per l'uso immediato.\n\nIn questa simulazione, esploreremo le caratteristiche che rendono Kali unica e vedremo come si posiziona rispetto alle altre distro famose. Identifica le differenze principali tra le versioni per scegliere quella giusta in base al tuo obiettivo.\n\nUna distribuzione va scelta in base allo scopo, non perché una sia migliore in assoluto. Kali raccoglie strumenti per test e indagini, mentre altre distribuzioni privilegiano semplicità, stabilità o tecnologie recenti: associa ogni nome alla sua funzione principale.",
      hint: "Kali è come una cassetta degli attrezzi completa per un meccanico: non è migliore di un'auto normale, è solo equipaggiata per ripararla.",
      explanation:
        "Saper scegliere la distribuzione giusta ti permette di lavorare meglio. Kali Linux ti risparmia ore di configurazione, offrendoti subito gli strumenti professionali necessari.",
      Simulation: Task02Distros,
    },
    {
      id: "03-terminal",
      title: "Il terminale e la shell",
      goal: "Familiarizzare con prompt, utente e comandi base",
      brief: "Il terminale è la porta d'accesso al vero potere di Linux, permettendoti di comunicare direttamente con il sistema senza passare per icone o menu. Impareremo a leggere il prompt dei comandi e a eseguire le prime istruzioni fondamentali.",
      details:
        "La shell è un programma che riceve i tuoi comandi da tastiera e li passa al sistema operativo affinché vengano eseguiti. Anche se all'inizio può sembrare intimidatorio, usare il testo è molto più veloce e preciso che cliccare ovunque con il mouse.\n\nQuando apri la shell, trovi un prompt che ti dà informazioni preziose: chi sei, su quale computer ti trovi e in quale cartella stai lavorando. È come avere una bussola sempre attiva che ti guida nel labirinto dei file.\n\nPer iniziare, useremo comandi semplici per orientarci: chiederemo al sistema il nostro nome, la nostra posizione attuale e puliremo lo schermo per fare ordine. Digita i comandi richiesti per vedere come Linux risponde prontamente ai tuoi input.\n\nIl prompt contiene informazioni utili prima ancora che tu digiti: mostra l’utente, il computer e spesso la cartella corrente. Eseguendo i comandi proposti, osserva come ogni risposta chiarisce uno di questi elementi e ti aiuta a sapere sempre dove stai lavorando.",
      hint: "Digita il nome del comando esattamente come indicato e premi Invio. Se sbagli, non preoccuparti: usa 'clear' per ricominciare da una schermata pulita.",
      explanation:
        "Hai preso confidenza con l'interfaccia testuale. Saper leggere il prompt e conoscere i comandi base è la fondamenta su cui costruirai ogni tua futura operazione di hacking.",
      Simulation: Task03Terminal,
    },
    {
      id: "04-filesystem",
      title: "Navigare nel filesystem",
      goal: "Usare percorsi assoluti, relativi, ., .. e ~",
      brief: "Imparare a muoversi tra le cartelle di Linux è come imparare a leggere una mappa stradale. Scopriremo come spostarci velocemente tra file di sistema e cartelle personali usando percorsi brevi ed efficaci.",
      details:
        "In Linux, tutto è organizzato come un grande albero che parte da una radice comune chiamata /. A differenza di Windows, non ci sono unità C: o D:, ma un unico percorso coerente che contiene ogni cosa, dai tuoi documenti ai file che fanno funzionare il kernel.\n\nEsistono due modi per descrivere dove si trova un file: il percorso assoluto, che parte sempre dall'inizio (/), e il percorso relativo, che parte da dove ti trovi ora. Imparare a usare simboli come il punto (.) o i due punti (..) ti renderà velocissimo nella navigazione.\n\nIn questa esercitazione, viaggeremo attraverso le cartelle principali come /etc o la tua cartella personale (~). Dovrai usare il comando 'cd' per spostarti e capire esattamente in quale punto dell'albero ti trovi in ogni momento.\n\nUn percorso assoluto parte dalla radice e identifica sempre lo stesso punto; uno relativo dipende invece dalla cartella corrente. Prova a immaginare ogni comando cd come uno spostamento sull’albero: questa immagine rende più chiari anche simboli brevi come punto, doppio punto e tilde.",
      hint: "Usa 'cd ..' per salire di una cartella e 'cd ~' per tornare subito alla tua cartella personale. I percorsi che iniziano con '/' funzionano sempre, ovunque tu sia.",
      explanation:
        "La navigazione rapida è essenziale durante un'analisi. Ora sai come muoverti nel filesystem senza perderti, distinguendo tra percorsi assoluti e relativi.",
      Simulation: Task04Filesystem,
    },
    {
      id: "05-files",
      title: "File e directory",
      goal: "Creare, copiare, spostare e rimuovere file",
      brief: "Creare, spostare e cancellare file sono le operazioni più comuni che farai nel terminale. Vedremo come gestire i dati in modo efficiente, imparando comandi potenti che ti permetteranno di organizzare il tuo lavoro con pochi tasti.",
      details:
        "La gestione dei file via terminale non ha una rete di salvataggio: quando cancelli qualcosa con 'rm', scompare davvero, senza passare per un cestino. Questa potenza richiede attenzione, ma offre una velocità d'azione senza paragoni rispetto all'interfaccia grafica.\n\nUseremo 'mkdir' per creare nuovi contenitori per i nostri progetti e 'touch' per creare file al volo. Impareremo anche a duplicare informazioni importanti con 'cp' e a riorganizzarle o rinominarle usando il comando 'mv', che serve a entrambi gli scopi.\n\nIn questo scenario, dovrai completare una serie di compiti organizzativi: crea cartelle, sposta file e ripulisci lo spazio di lavoro. Segui attentamente i nomi richiesti per assicurarti che il sistema riconosca le tue azioni.\n\nI comandi per i file seguono quasi sempre lo schema sorgente-destinazione. Prima di confermare, controlla il percorso corrente e il nome finale: cp lascia l’originale, mv lo sposta o lo rinomina, mentre rm elimina senza passare dal cestino.",
      hint: "Ricorda che 'mv' serve sia per spostare un file in un'altra cartella, sia per cambiargli nome. Scrivi sempre prima la sorgente e poi la destinazione.",
      explanation:
        "Gestire i file da terminale è la base dell'automazione. Hai imparato a manipolare la struttura dei dati, un'abilità fondamentale per gestire report e log durante un attacco.",
      Simulation: Task05Files,
    },
    {
      id: "06-permissions",
      title: "Permessi e proprietà",
      goal: "Leggere e modificare i permessi con chmod",
      brief: "La sicurezza di Linux si basa tutta su chi può leggere, scrivere o eseguire un file. Capire come funzionano questi permessi è fondamentale per proteggere i propri dati ed evitare che un attaccante prenda il controllo del sistema.",
      details:
        "Ogni file in Linux ha un'etichetta invisibile che dice cosa possono fare il proprietario, il suo gruppo e tutti gli altri utenti. Questi permessi sono indicati dalle lettere r (lettura), w (scrittura) e x (esecuzione).\n\nImmagina un file contenente password: vorrai che solo tu possa leggerlo (r) e scriverlo (w), ma nessuno debba poterlo eseguire come programma. Al contrario, un tool di hacking deve avere il permesso di esecuzione (x) per poter funzionare correttamente.\n\nIn questo task interattivo, dovrai regolare le 'levette' dei permessi per diversi tipi di file. Rendi sicuri i documenti privati e abilita i programmi necessari, imparando come la giusta configurazione possa prevenire accessi non autorizzati.\n\nI nove simboli dei permessi sono divisi in tre gruppi: proprietario, gruppo e altri utenti. Valuta separatamente chi deve leggere, modificare o avviare il file; concedere soltanto ciò che serve riduce gli errori e limita i danni di un eventuale account compromesso.",
      hint: "Osserva le tre colonne: la prima è per te, la seconda per i tuoi colleghi e la terza per gli sconosciuti. Assicurati di dare la 'x' solo a chi deve avviare il file.",
      explanation:
        "Un sistema sicuro parte da permessi restrittivi. Ora sai come limitare l'accesso ai file sensibili, una delle difese più efficaci contro le intrusioni.",
      Simulation: Task06Permissions,
    },
    {
      id: "07-users",
      title: "Utenti, gruppi e sudo",
      goal: "Capire quando serve essere root",
      brief: "In Linux esiste un utente speciale, il 'root', che ha il potere assoluto sul sistema. Impareremo a usare il comando 'sudo' per agire come amministratori solo quando è strettamente necessario, mantenendo il sistema al sicuro.",
      details:
        "La separazione dei compiti è una regola d'oro: un utente normale non dovrebbe mai avere il permesso di cancellare file vitali del sistema operativo. Per questo motivo, le operazioni delicate richiedono un'autorizzazione speciale che otteniamo tramite 'sudo'.\n\nUsare 'sudo' è come chiedere una chiave temporanea per una porta blindata: dopo aver eseguito il compito, la chiave viene restituita. Questo previene danni accidentali e rende molto più difficile per un virus fare danni gravi se infetta un utente standard.\n\nIn questa simulazione, proverai a eseguire comandi che richiedono poteri superiori. Scopri quali azioni sono riservate all'amministratore e come Linux protegge le sue impostazioni più profonde dai cambiamenti non autorizzati.\n\nL’utente root può modificare qualsiasi parte del sistema, perciò lavorare sempre con quei privilegi aumenta il rischio di danni accidentali. Sudo concede l’autorizzazione per una singola operazione: usalo solo quando il comando modifica risorse protette e leggi sempre ciò che stai autorizzando.",
      hint: "Se ricevi un errore di 'Permesso negato', probabilmente devi aggiungere 'sudo' davanti al tuo comando. Usalo con cautela: da grandi poteri derivano grandi responsabilità.",
      explanation:
        "Hai capito la differenza tra utenti comuni e amministratore. Usare 'sudo' correttamente è il primo passo per una gestione responsabile e sicura di qualsiasi macchina Linux.",
      Simulation: Task07Users,
    },
    {
      id: "08-processes",
      title: "Processi e servizi",
      goal: "Vedere, terminare e gestire processi",
      brief: "Ogni programma che gira sul tuo computer è un 'processo' con una sua identità. Impareremo a monitorare cosa sta succedendo in memoria, come individuare programmi bloccati e come fermare servizi inutili per liberare risorse.",
      details:
        "A volte un computer rallenta perché un programma sta consumando troppa energia o perché un servizio sospetto è partito a tua insaputa. Linux ti permette di vedere ogni singola attività in corso attraverso una lista di processi, ognuno identificato da un numero chiamato PID.\n\nSapere come leggere questa lista ti permette di individuare comportamenti anomali, come un processo nascosto che invia dati all'esterno. Usando il comando 'kill', puoi forzare la chiusura di qualsiasi attività che non dovrebbe essere lì o che non risponde più ai comandi.\n\nDurante il task, dovrai trovare un processo che sta rallentando il sistema e terminarlo. Inoltre, imparerai a gestire i 'servizi', programmi che girano in background per offrire funzionalità come il web o i database.\n\nUn processo è un programma in esecuzione e il PID è il numero che lo distingue dagli altri. Prima di terminarlo, confronta nome, consumo e stato: chiudere il processo sbagliato può interrompere un servizio importante tanto quanto lasciare attivo quello sospetto.",
      hint: "Usa il PID (il numero identificativo) per dire a Linux quale specifico processo deve essere chiuso. Cerca quello che sta usando più risorse!",
      explanation:
        "Il controllo dei processi è vitale sia per le prestazioni che per la sicurezza. Ora sei in grado di vedere cosa 'gira' sotto il cofano e di intervenire se qualcosa non va.",
      Simulation: Task08Processes,
    },
    {
      id: "09-apt",
      title: "Gestione pacchetti con apt",
      goal: "Installare, aggiornare e rimuovere software",
      brief: "Installare nuovi strumenti su Linux è semplice e sicuro grazie ai gestori di pacchetti. Vedremo come usare 'apt' per cercare, installare e aggiornare il software, mantenendo la tua cassetta degli attrezzi sempre pronta e al passo con i tempi.",
      details:
        "Invece di scaricare file da siti web sconosciuti, su Linux si usano dei 'magazzini' ufficiali chiamati repository. Il comando 'apt' parla con questi magazzini per scaricare e installare tutto ciò di cui hai bisogno in modo automatico e verificato.\n\nMantenere il software aggiornato è il modo più semplice per chiudere falle di sicurezza prima che qualcuno le sfrutti. Con pochi comandi puoi aggiornare l'intero sistema operativo e tutte le applicazioni installate, garantendoti stabilità e protezione contro le ultime minacce.\n\nIn questa esercitazione, simuleremo l'intero ciclo di vita di un programma: dall'aggiornamento della lista dei pacchetti all'installazione, fino alla rimozione. È una competenza che userai ogni singolo giorno nel tuo lavoro.\n\nApt separa l’aggiornamento dell’elenco disponibile dall’installazione vera e propria. Prima scarica le informazioni più recenti dai repository, poi usa quelle informazioni per installare o aggiornare i pacchetti corretti e le loro dipendenze.",
      hint: "L'ordine corretto è fondamentale: prima 'update' per conoscere le novità, poi 'install' o 'upgrade' per applicarle. Non dimenticare di usare 'sudo'!",
      explanation:
        "Gestire i pacchetti correttamente ti assicura di avere sempre gli strumenti più recenti e sicuri. La velocità di 'apt' è uno dei motivi per cui Linux è così amato dagli sviluppatori e hacker.",
      Simulation: Task09Apt,
    },
    {
      id: "10-quiz",
      title: "Quiz finale — 10 domande",
      goal: "Ripassare i concetti del modulo Linux",
      brief: "È il momento di mettere alla prova tutto ciò che hai imparato in questo modulo. Questo quiz finale copre tutti gli aspetti fondamentali di Linux, dalla navigazione nel terminale alla gestione della sicurezza del sistema.",
      details:
        "Hai affrontato il kernel, le distribuzioni, la shell, i permessi e molto altro. Questo quiz è progettato per sfidare la tua memoria e la tua comprensione pratica dei comandi che abbiamo usato finora.\n\nNon si tratta solo di ricordare i nomi dei comandi, ma di capire in quale situazione usarli. Un vero ethical hacker deve conoscere il proprio sistema operativo come le proprie tasche per poterne scovare i punti deboli o difenderlo efficacemente.\n\nRispondi alle domande basandoti sulla tua esperienza nelle simulazioni precedenti. Se hai dei dubbi, ripensa a come hai risolto i problemi nei task passati e scegli la risposta che ti sembra più logica e sicura.\n\nIl quiz verifica soprattutto se sai scegliere lo strumento adatto a una situazione concreta. Per ogni domanda, identifica prima l’azione richiesta — navigare, copiare, autorizzare, fermare o installare — e solo dopo confronta i comandi disponibili.",
      hint: "Leggi attentamente le opzioni: spesso la differenza tra un comando corretto e uno sbagliato sta in un singolo carattere o in un parametro mancante.",
      explanation:
        "Congratulazioni, hai gettato le basi per diventare un esperto di Linux. La padronanza della riga di comando è il superpotere che ti permetterà di eccellere nell'ethical hacking.",
      Simulation: Task10Quiz,
    },
  ],
};
