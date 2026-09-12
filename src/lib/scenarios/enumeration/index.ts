import type { Scenario } from "../types";
import Task01WhatIs from "./tasks/Task01WhatIs";
import Task02Ftp from "./tasks/Task02Ftp";
import Task03SshBanner from "./tasks/Task03SshBanner";
import Task04Smb from "./tasks/Task04Smb";
import Task05Dns from "./tasks/Task05Dns";
import Task06Http from "./tasks/Task06Http";
import Task07Smtp from "./tasks/Task07Smtp";
import Task08Snmp from "./tasks/Task08Snmp";
import Task09Report from "./tasks/Task09Report";
import Task10Quiz from "./tasks/Task10Quiz";

export const enumerationScenario: Scenario = {
  id: "enumeration",
  slug: "enumeration",
  title: "Enumerazione dei Servizi",
  subtitle: "Far parlare i servizi per raccogliere utenti, condivisioni e versioni",
  intro:
    "Dopo la scansione sai quali porte sono aperte; con l'enumerazione scopri cosa c'è davvero dietro. In questo scenario dialogherai con i protocolli più comuni — FTP, SSH, SMB, DNS, HTTP, SMTP e SNMP — e imparerai quante informazioni un servizio gentile regala a chi sa fare le domande giuste. Ogni attività è un piccolo laboratorio interattivo: terminali simulati che rispondono come i server veri, comandi da comporre pezzo per pezzo e un rapporto finale da classificare. Nessun pacchetto lascia il tuo browser: tutte le risposte sono ricostruzioni realistiche di ciò che vedresti sul campo.",
  highlights: [
    "Terminali simulati con FTP, SMTP e SNMP che rispondono davvero ai tuoi comandi.",
    "Banner grabbing, condivisioni SMB, record DNS e directory web nascoste.",
    "Un rapporto finale in cui classifichi tu la gravità di ogni scoperta.",
  ],
  category: "Metodologia Pentest",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-cose",
      title: "Che cos'è l'enumerazione",
      goal: "Distinguere l'enumerazione dalle altre fasi di un pentest",
      brief:
        "Scoprire che una porta è aperta non basta: l'enumerazione è la fase in cui inizi a farci domande. Ma non tutto ciò che tocca il bersaglio è enumerazione, e saperlo distinguere conta anche nel rapporto finale.",
      details: `La scansione chiede «chi c'è e cosa è aperto»; l'****enumerazione**** chiede «cosa offri e chi sei». È una conversazione vera con i servizi: ti presenti, fai una domanda precisa e raccogli la risposta. Più il servizio è loquace, più impari.\n\nPrima di enumerare, però, devi riconoscere il confine con le altre fasi: leggere documenti pubblici su Google è raccolta passiva, lanciare un ping sweep è scoperta degli host, provare una password è già sfruttamento. Qui classificherai sei azioni tipiche, imparando a collocare ognuna nella fase giusta.`,
      hint: "Chiediti: sto parlando direttamente con un servizio del bersaglio per farmi dare elenchi o nomi?",
      explanation: "Sai collocare l'enumerazione dentro la metodologia, senza confonderla con OSINT o exploitation.",
      Simulation: Task01WhatIs,
    },
    {
      id: "02-ftp",
      title: "FTP: l'ingresso anonimo",
      goal: "Enumerare un server FTP con accesso anonimo",
      brief:
        "Alcuni server FTP accettano l'utente «anonymous» con password vuota: una porta d'ingresso dimenticata che regala file e indizi. Qui ne esplorerai uno con un terminale simulato.",
      details: `****FTP**** è un protocollo antico, nato quando la rete era un luogo fidato. Molti server sono ancora configurati per la condivisione pubblica e rispondono volentieri a chi si presenta come anonymous. Una volta dentro, comandi semplici come ls e get bastano per leggere tutto ciò che è esposto.\n\nIl **terminale** qui sotto si comporta come un vero server vsFTPd: ti guida con i suoi codici di risposta (220, 230, 331...) e ti suggerisce il passo successivo. Segui la procedura nella colonna a destra e porta a casa il file che conta.`,
      hint: "Segui i suggerimenti che compaiono nel terminale: il server stesso ti dice cosa fare dopo.",
      explanation: "Hai enumerato un FTP anonimo e capito perché una cartella dimenticata può rivelare l'intera organizzazione.",
      Simulation: Task02Ftp,
    },
    {
      id: "03-banner",
      title: "SSH: leggere il banner",
      goal: "Ricavare versione e piste di ricerca dal saluto di un servizio",
      brief:
        "Molti servizi si presentano prima ancora che tu chieda nulla: si chiama banner, e contiene prodotto e versione. Impariamo a leggerlo con lo strumento giusto.",
      details: `Il ****banner grabbing**** è la forma più delicata di ****enumerazione****: apri una connessione e ascolti. ****Netcat**** è perfetto per questo, perché non aggiunge nulla di suo: stampa esattamente ciò che il server dice appena risponde.\n\nUna riga come «****SSH****-2.0-OpenSSH_7.4» sembra poca cosa, ma contiene tutto ciò che serve: il protocollo, il software e la versione esatta. Con quel nome puoi consultare i database pubblici delle ****vulnerabilità**** e capire se quella release ha punti deboli noti. Prima il raccolto, poi la ricerca: mai il contrario.`,
      hint: "Vuoi solo ascoltare il saluto, non autenticarti: scegli lo strumento più semplice.",
      explanation: "Hai trasformato una riga di testo in una pista concreta di ricerca sulle vulnerabilità.",
      Simulation: Task03SshBanner,
    },
    {
      id: "04-smb",
      title: "SMB: le condivisioni di rete",
      goal: "Elencare le condivisioni e riconoscere quelle apribili in anonimo",
      brief:
        "SMB è il protocollo con cui Windows condivide file e stampanti. Un elenco delle condivisioni racconta come è organizzata l'azienda — e quali porte sono rimaste socchiuse.",
      details: `Con ****smbclient**** puoi chiedere a un server l'elenco delle sue condivisioni, a volte perfino senza password. I nomi che tornano sono già un'informazione: PUBLIC, BACKUP, ADMIN$ raccontano cosa fa quella macchina e chi la usa.\n\nAttenzione alle condivisioni che finiscono con il dollaro: sono amministrative e nascoste, e SMB le elenca ma non le apre senza privilegi. Quelle senza dollaro, invece, potrebbero rispondere all'accesso anonimo. Qui dovrai riconoscere quali cartelle si aprono davvero — e capire perché una condivisione di backup leggibile da tutti è una scoperta da segnalare subito.`,
      hint: "Il simbolo del dollaro è un cartello: «riservato agli amministratori».",
      explanation: "Sai leggere l'elenco delle condivisioni SMB e valutare quali rappresentano un rischio reale.",
      Simulation: Task04Smb,
    },
    {
      id: "05-dns",
      title: "DNS: l'annuario della rete",
      goal: "Scegliere il record DNS giusto per ogni obiettivo",
      brief:
        "Il DNS traduce nomi in indirizzi, ma fa molto di più: dice chi gestisce la posta, quali servizi cloud usa l'azienda e quali server sono autoritativi. Basta sapere quale record chiedere.",
      details: `Ogni tipo di record è una finestra diversa. Il record A lega un nome al suo indirizzo IP: è la mappa della rete. MX indica i server di posta: da lì capisci se l'azienda usa Google, Microsoft o un provider locale. NS elenca i server ****DNS**** autoritativi, e TXT contiene note di testo che spesso tradiscono servizi esterni e configurazioni.\n\nEsiste perfino un modo per chiedere l'intera zona in un colpo solo, il trasferimento AXFR: sui server mal configurati consegna la lista completa dei nomi aziendali. Qui ti allenerai ad abbinare ogni obiettivo al record che lo soddisfa.`,
      hint: "Nome del record e obiettivo devono raccontare la stessa cosa: posta, indirizzi, server o note.",
      explanation: "Sai interrogare il DNS con uno scopo preciso invece di raccogliere dati a caso.",
      Simulation: Task05Dns,
    },
    {
      id: "06-http",
      title: "HTTP: le porte nascoste del sito",
      goal: "Costruire una scansione con gobuster e fare triage dei risultati",
      brief:
        "Dietro un sito web ci sono percorsi che non compaiono in nessun menu: pannelli di amministrazione, backup dimenticati, repository esposti. gobuster li cerca provando migliaia di nomi.",
      details: `****gobuster**** in modalità dir prende una wordlist — un elenco di nomi plausibili come admin, backup, test — e li prova uno per uno contro il sito. Ciò che risponde con uno stato 200 o 301 esiste davvero, che il proprietario lo ricordi o no.\n\nMa il lavoro vero comincia dopo la scansione: leggere l'elenco e capire cosa conta. Una home che risponde è normale; una cartella .git o un file `backup.zip` sono campanelli d'allarme. Qui costruirai il comando pezzo per pezzo e poi farai il triage dei risultati, separando il rumore dai tesori.`,
      hint: "Strumento, modalità, obiettivo e wordlist: in quest'ordine.",
      explanation: "Hai condotto una enumerazione web completa, dal comando alla selezione dei risultati utili.",
      Simulation: Task06Http,
    },
    {
      id: "07-smtp",
      title: "SMTP: verificare gli utenti",
      goal: "Usare il comando VRFY per confermare nomi utente validi",
      brief:
        "I server di posta più vecchi rispondono volentieri alla domanda «questo utente esiste?». Con pazienza e una lista di nomi si ricostruisce l'organico aziendale, senza inviare una sola email.",
      details: `Il **comando** VRFY nacque per aiutare gli amministratori a correggere gli indirizzi sbagliati: gli dai un nome, lui risponde 250 se l'utente esiste o 550 se non esiste. Comodo per chi scrive — e per chi attacca, che può verificare migliaia di nomi in silenzio.\n\nIn questo **terminale** simulato ti collegherai alla porta 25 con ****netcat**** e verificherai alcuni nomi. Il tuo obiettivo è confermare tre utenti validi: ogni conferma è un indirizzo reale che domani potrebbe ricevere un'email di phishing molto convincente.`,
      hint: "Collegati prima con nc alla porta 25, poi usa VRFY seguito dal nome da verificare.",
      explanation: "Hai capito perché VRFY è disattivato sui server moderni: regala elenchi di utenti a chiunque bussi.",
      Simulation: Task07Smtp,
    },
    {
      id: "08-snmp",
      title: "SNMP: il rubinetto delle informazioni",
      goal: "Valutare cosa rivela un SNMP con community string predefinita",
      brief:
        "SNMP serve a monitorare apparati di rete, ma troppi dispositivi usano ancora la parola d'ordine predefinita «public». Con quella, il dispositivo racconta tutto di sé.",
      details: `****SNMP**** organizza le informazioni in un albero: descrizione del sistema, tempo di attività, processi in esecuzione, utenti collegati, interfacce di rete. Con ****snmpwalk**** e la community giusta percorri l'albero intero e leggi ogni foglia.\n\nIl danno non è solo ciò che vedi: è ciò che permette. Conoscere la versione esatta del sistema, i processi attivi e gli indirizzi della rete interna significa poter pianificare l'attacco successivo con precisione chirurgica. Qui analizzerai un output reale e dovrai riconoscere quali informazioni sono davvero trapelate — e quali no.`,
      hint: "SNMP sa tutto del sistema, ma non custodisce password né chiavi private.",
      explanation: "Sai valutare il valore di un output SNMP e immaginare come un attaccante lo userebbe.",
      Simulation: Task08Snmp,
    },
    {
      id: "09-rapporto",
      title: "Dal raccolto al rapporto",
      goal: "Classificare la gravità delle scoperte fatte durante l'enumerazione",
      brief:
        "Enumerare non basta: un pentest vale quanto il suo rapporto. Ogni scoperta va tradotta in una gravità chiara, altrimenti il cliente non saprà cosa sistemare per primo.",
      details: `La gravità nasce da due domande: quanto male può fare questa scoperta, e quanto è facile sfruttarla? Credenziali leggibili da chiunque sono un disastro immediato; un banner informativo è un fastidio da annotare. In mezzo c'è tutto ciò che prepara attacchi futuri: elenchi di utenti, mappe di rete, versioni datate.\n\nQui trovi quattro scoperte raccolte durante questo scenario. Per ciascuna dovrai assegnare una gravità — alta, media o bassa — come faresti in un rapporto vero. Non esistono risposte di pancia: ogni scelta va motivata pensando a cosa potrebbe farci un attaccante domani mattina.`,
      hint: "Impatto e facilità di sfruttamento: la gravità vera sta nel loro incrocio.",
      explanation: "Hai trasformato l'enumerazione in un rapporto utile, con priorità motivate e difendibili.",
      Simulation: Task09Report,
    },
    {
      id: "10-quiz",
      title: "Verifica finale",
      goal: "Consolidare tutti i protocolli e i concetti dello scenario",
      brief:
        "Dieci domande per chiudere il cerchio: banner, condivisioni, record DNS, VRFY, SNMP e la logica del rapporto. Bastano sette risposte giuste.",
      details: `Ogni domanda riprende un'attività che hai appena svolto: se qualcosa ti sfugge, torna al micro-task corrispondente e riprova. L'obiettivo non è il punteggio, ma fissare le idee.\n\nRicorda il filo che lega tutto lo scenario: ogni protocollo parla la sua lingua, ma la tecnica è sempre la stessa — fare la domanda giusta al servizio giusto e saper leggere la risposta.`,
      hint: "Se una domanda ti blocca, rileggi il brief del task corrispondente prima di rispondere.",
      explanation: "Hai completato lo scenario: sai far parlare i servizi e valutare ciò che rivelano.",
      Simulation: Task10Quiz,
    },
  ],
};
