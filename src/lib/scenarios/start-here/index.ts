import type { Scenario } from "../types";
import Task01WhatIs from "./tasks/Task01WhatIs";
import Task02Rules from "./tasks/Task02Rules";
import Task03Phases from "./tasks/Task03Phases";
import Task04LabKit from "./tasks/Task04LabKit";
import Task05Virt from "./tasks/Task05Virt";
import Task06Kali from "./tasks/Task06Kali";
import Task07Windows from "./tasks/Task07Windows";
import Task08Docker from "./tasks/Task08Docker";
import Task09Dvwa from "./tasks/Task09Dvwa";
import Task10Quiz from "./tasks/Task10Quiz";

export const startHereScenario: Scenario = {
  id: "start-here",
  slug: "start-here",
  title: "Inizia qui, aspirante hacker!",
  subtitle: "Dalle regole d'oro dell'ethical hacking al tuo primo laboratorio con Kali, Windows, Docker e DVWA",
  intro:
    "Questo è lo scenario di partenza. Prima di lanciarti su reti, exploit e privilege escalation, chiariamo cos'è davvero un ethical hacker, quali sono le regole che rendono legale ciò che fai e come si costruisce, passo per passo, un laboratorio sicuro dove sperimentare senza fare danni. Al termine avrai un ambiente Kali + Windows + Docker + DVWA pronto per tutti gli altri scenari.",
  highlights: [
    "Cos'è (e cosa non è) un ethical hacker, con esempi concreti.",
    "Il tuo primo laboratorio: virtualizzatore, Kali, Windows, rete tra VM.",
    "Docker e DVWA: il primo bersaglio deliberatamente vulnerabile.",
  ],
  category: "Punto di partenza",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-cose",
      title: "Cos'è un ethical hacker",
      goal: "Distinguere un test etico da un accesso abusivo",
      brief:
        "Un ethical hacker attacca sistemi per conto di chi li possiede, con lo scopo di trovare i problemi prima che li usino i cattivi. Il confine con l'illegalità non è tecnico ma di permesso: senza autorizzazione scritta, ogni test è un reato.",
      details:
        "Il termine «hacker» in origine non aveva alcuna sfumatura negativa: indicava semplicemente chi capiva un sistema abbastanza a fondo da farlo funzionare in modo non previsto. L'aggettivo «ethical» aggiunge la cornice legale ed etica: chi lavora per il proprietario del sistema, sotto un contratto, con obiettivi condivisi.\n\nIn questa attività ti mostro sei situazioni concrete: alcune sono chiaramente ethical hacking, altre sono accessi abusivi mascherati da curiosità. Il tuo compito è classificarle correttamente. Il criterio guida è sempre lo stesso: c'è un permesso scritto? Il bersaglio è tuo o è stato messo a disposizione per il test?\n\nDurante lo scenario userai spesso questa domanda mentale: se dovessi giustificare quello che sto per fare davanti a un giudice, avrei una carta da mostrare? Se la risposta è no, allora quello che stai per fare non è ethical hacking, è un reato — anche se lo fai «solo per imparare».",
      hint: "Se manca la firma di chi possiede il sistema, non è ethical hacking. Punto.",
      explanation:
        "L'ethical hacking vive nello spazio delimitato da un contratto: quello che è concesso è tutto, quello che non è concesso è vietato. Interiorizzare questa cornice è il primo passo per lavorare in sicurezza legale.",
      Simulation: Task01WhatIs,
    },
    {
      id: "02-regole",
      title: "Le regole d'oro",
      goal: "Riconoscere autorizzazione, scope, RoE, disclosure, tracciabilità",
      brief:
        "Prima ancora di aprire un terminale, un pentester lavora sui documenti. Cinque concetti ti proteggono legalmente e proteggono il cliente da danni collaterali.",
      details:
        "L'autorizzazione scritta è il permesso formale a testare. Lo scope elenca cosa puoi toccare (IP, domini, applicazioni) e cosa no. Le Rules of Engagement descrivono i comportamenti: orari consentiti, tecniche vietate (per esempio DoS), chi contattare in caso di problemi. La divulgazione responsabile ti obbliga a comunicare le vulnerabilità prima al proprietario, non al pubblico. La tracciabilità ti spinge a documentare tutto — comandi, orari, output — perché il tuo lavoro sia ripetibile e difendibile.\n\nIn questa attività abbini cinque situazioni pratiche alla regola che le governa. Non è un esercizio da avvocato: sono i cinque concetti che ricorrono in ogni ingaggio, dal bug bounty al red team di un'azienda.",
      hint: "Quando dubiti su cosa fare, chiediti quale delle cinque regole ti sta parlando in quel momento.",
      explanation:
        "Autorizzazione, scope, RoE, disclosure e tracciabilità sono lo scheletro etico e legale del tuo lavoro. Insieme fanno la differenza tra un consulente professionista e un dilettante che rischia una denuncia.",
      Simulation: Task02Rules,
    },
    {
      id: "03-fasi",
      title: "Le fasi di un pentest",
      goal: "Ordinare le sei fasi classiche",
      brief:
        "Un pentest non è un attacco casuale. È un percorso ordinato di sei fasi che si ripete in modo simile su ogni bersaglio: ricognizione, scansione, enumerazione, exploitation, post-exploitation, report.",
      details:
        "Ogni fase ha uno scopo preciso e prepara la successiva. Nella ricognizione raccogli informazioni pubbliche senza mai toccare il bersaglio. Nella scansione scopri host attivi, porte aperte e servizi. Nell'enumerazione interroghi ogni servizio per estrarre utenti, versioni, condivisioni. Nell'exploitation trasformi una debolezza in accesso o esecuzione di codice. Nella post-exploitation esplori dentro il bersaglio: privilegi, credenziali, movimenti verso altre macchine. Nel report riordini tutto e consegni al cliente i problemi e le raccomandazioni.\n\nRimetti in ordine i sei blocchi. Quando gli scenari successivi della piattaforma ti parleranno di «Enumerazione», «Vulnerability Assessment» o «Exploitation», saprai già dove si collocano dentro questo schema.",
      hint: "Prima si osserva da lontano, poi ci si avvicina, poi si entra. E alla fine si racconta.",
      explanation:
        "Le sei fasi sono la spina dorsale metodologica di qualunque pentest. Ogni scenario che troverai qui dentro riempie di dettaglio una di queste caselle.",
      Simulation: Task03Phases,
    },
    {
      id: "04-kit",
      title: "Il tuo kit da laboratorio",
      goal: "Riconoscere cosa serve davvero (e cosa no)",
      brief:
        "Un buon laboratorio è isolato, replicabile e non costa nulla. Servono poche cose reali; molte altre sono miti da sfatare.",
      details:
        "Per allestire il lab ti bastano un PC recente con virtualizzazione attiva nel BIOS, almeno 8 GB di RAM (16 sono meglio), qualche decina di gigabyte di disco liberi, un virtualizzatore gratuito e le immagini ufficiali dei sistemi operativi che vuoi usare. Non ti serve nulla di illegale, nessun exploit comprato, nessuna password del vicino.\n\nAttiva nella checklist solo le voci che servono davvero. Le voci sbagliate ti diranno perché sono inutili — o pericolose. È un modo per allineare le aspettative: il pentesting non è una serie TV, è un lavoro fatto di macchine virtuali che partono e riavvii che non finiscono mai.",
      hint: "Nel lab devi poter sbagliare gratis. Se qualcosa lo mette a rischio, non ci va.",
      explanation:
        "Un laboratorio ben pensato è la tua palestra: sbagli, rompi, ripristini in due minuti. È il posto dove impari senza fare danni ad altri e senza rischiare guai a te stesso.",
      Simulation: Task04LabKit,
    },
    {
      id: "05-virtualizzatore",
      title: "Installa il virtualizzatore",
      goal: "Mettere in ordine i passi per installare VirtualBox",
      brief:
        "Il virtualizzatore è il palazzo dove vivranno le tue macchine virtuali. VirtualBox è gratuito, multipiattaforma e più che sufficiente per tutto il percorso.",
      details:
        "Prima di installare VirtualBox devi assicurarti che nel BIOS/UEFI del tuo PC sia attivata la virtualizzazione hardware (VT-x su Intel, AMD-V su AMD). Senza questa opzione, VirtualBox parte ma le VM 64 bit non si avviano — è il problema numero uno dei principianti.\n\nRimetti in ordine i cinque passi: verifica BIOS, download dal sito ufficiale, installer con impostazioni predefinite, Extension Pack (per USB e schede di rete avanzate) e riavvio finale. Al termine, aprendo VirtualBox, dovresti vedere una finestra vuota: il palazzo è pronto, mancano gli inquilini.",
      hint: "Il primo passo non è scaricare: è controllare il BIOS. Salti quello e nessuna VM 64 bit partirà.",
      explanation:
        "VirtualBox è il livello più basso del tuo lab: fornisce hardware virtuale (CPU, RAM, dischi, rete) ai sistemi operativi ospiti. Installarlo correttamente evita ore di frustrazione con VM che non partono.",
      Simulation: Task05Virt,
    },
    {
      id: "06-kali",
      title: "Scarica e avvia Kali Linux",
      goal: "Configurare la prima VM di attacco",
      brief:
        "Kali Linux è la distribuzione più famosa per la sicurezza offensiva: è già piena degli strumenti che userai. Non serve installare quasi nulla, basta scaricare l'immagine giusta.",
      details:
        "Sul sito kali.org, alla sezione «Virtual Machines», trovi immagini .ova già preconfigurate per VirtualBox: le importi con un doppio clic e sei operativo in dieci minuti. Evita ISO di anni fa o mirror non ufficiali: sono la strada più veloce per farti installare qualcosa che non hai chiesto.\n\nIn questa attività prendi quattro decisioni: quale immagine scaricare, quanta CPU e RAM assegnare, in quale modalità di rete far girare la VM al primo avvio e con quali credenziali entrare. Ricorda: dalla versione 2020.1 Kali non usa più root/toor come login predefinito, ma un utente normale (kali/kali) che va cambiato subito.",
      hint: "Scegli l'immagine .ova ufficiale, dai risorse ragionevoli e usa NAT come rete di partenza.",
      explanation:
        "Kali è il coltellino svizzero del pentester: nmap, Metasploit, Wireshark, Burp, hashcat e centinaia di altri tool sono già installati. Averla pronta in una VM è il passo che sblocca tutti gli scenari offensivi.",
      Simulation: Task06Kali,
    },
    {
      id: "07-windows",
      title: "Windows e comunicazione tra VM",
      goal: "Far dialogare Kali e una vittima Windows",
      brief:
        "Molti attacchi reali si fanno su Windows. Microsoft distribuisce gratis edizioni Evaluation di Windows 10/11 che durano 90 giorni: perfette come bersaglio. Ma perché due VM si vedano, devi scegliere bene la modalità di rete.",
      details:
        "In VirtualBox ogni VM ha una scheda di rete virtuale che puoi configurare in quattro modi principali: NAT (la VM esce su Internet ma è invisibile alle altre), Host-only (le VM parlano solo tra loro e con il PC ospite, niente Internet), NAT Network o rete Internal (le VM sono sulla stessa rete privata e possono uscire su Internet), Bridge (la VM entra nella rete di casa come un vero PC).\n\nIn questa attività abbini quattro esigenze concrete alla modalità di rete corretta. Il caso più comune per un lab è proprio quello di due VM che devono vedersi tra loro e insieme aggiornarsi da Internet: la risposta giusta cambia molte cose nei prossimi scenari.",
      hint: "«Si vedono tra loro» e «hanno Internet» insieme? Serve una rete condivisa, non NAT semplice.",
      explanation:
        "La modalità di rete decide cosa è visibile a cosa. Sbagliarla è la causa numero uno di scenari che «non funzionano»: le due VM sono accese ma non si pingano perché sono in due mondi diversi.",
      Simulation: Task07Windows,
    },
    {
      id: "08-docker",
      title: "Installa Docker",
      goal: "Preparare il lancio di applicazioni in container",
      brief:
        "Docker è come un mini-virtualizzatore leggero. Ogni «container» è un'applicazione già pronta, isolata dal resto del sistema, che parte in un secondo. Nel lab lo useremo per far girare le app vulnerabili.",
      details:
        "A differenza di una VM, un container condivide il kernel del sistema ospite e occupa pochissime risorse. Per te, principiante, il vantaggio pratico è enorme: invece di installare a mano un web server, PHP, MySQL e un'app vulnerabile, scrivi un solo comando e in un minuto hai tutto in piedi.\n\nIn questa attività rimetti in ordine i cinque comandi che, su Kali, ti installano Docker e lo rendono utilizzabile senza sudo. Attenzione all'ultimo passo: dopo esserti aggiunto al gruppo docker, devi rifare login perché la modifica abbia effetto — altrimenti continuerai a ricevere errori di permesso.",
      hint: "Prima aggiorna, poi installa, poi avvia il servizio, poi aggiungi il tuo utente, poi prova.",
      explanation:
        "Docker semplifica radicalmente la vita nel lab: le app vulnerabili si scaricano e si buttano via in pochi comandi, senza sporcare Kali. È lo strumento che rende sostenibile studiare venti scenari diversi.",
      Simulation: Task08Docker,
    },
    {
      id: "09-dvwa",
      title: "DVWA con Docker",
      goal: "Avviare la prima app vulnerabile e verificarla dal browser",
      brief:
        "DVWA (Damn Vulnerable Web Application) è un'applicazione web PHP/MySQL fatta apposta per essere piena di bug: SQL injection, XSS, upload di file, command injection e altro. È il bersaglio didattico più famoso al mondo.",
      details:
        "In questa attività fai partire DVWA dentro un container Docker sulla tua Kali, controlli che stia effettivamente rispondendo sulla porta 80 e apri il browser per vedere la pagina di login. Sono quattro comandi in tutto, ma ognuno ha un ruolo preciso: scaricare l'immagine, avviarla in background con la porta mappata, verificare che sia in esecuzione, controllare la risposta HTTP.\n\nUna volta terminati i comandi, l'ultimo passo è visivo: aprire il browser su http://localhost e confermare che DVWA risponde. Da qui in poi, per tutti gli scenari web che troverai, potrai usare questo container come palestra reale.",
      hint: "Premi «Esegui il comando» in sequenza. L'ultima verifica la fai col browser.",
      explanation:
        "DVWA è la palestra dove tradurrai in pratica gli scenari di web exploitation. Averla installata via Docker significa poterla resettare in venti secondi ogni volta che vuoi ripartire pulito.",
      Simulation: Task09Dvwa,
    },
    {
      id: "10-quiz",
      title: "Ripasso finale",
      goal: "Consolidare i fondamentali prima di partire",
      brief:
        "Dieci domande per fissare i concetti chiave: etica, fasi, virtualizzazione, Kali, rete tra VM, Docker, DVWA. Se ne prendi almeno sette, sei pronto per gli altri scenari.",
      details:
        "Non è un esame, è una checklist mentale. Se qualche risposta ti fa dubitare, torna sui task corrispondenti: sono lì apposta. Le domande alternano etica, metodologia e strumenti: sono le tre gambe su cui poggia tutto il resto del percorso.",
      hint: "Rileggi con calma ogni domanda. Le opzioni sbagliate spesso «suonano» giuste ma non lo sono.",
      explanation:
        "Chiudere questo scenario significa avere un laboratorio funzionante e una mappa mentale chiara. Da adesso in poi ogni nuovo scenario riempie di dettaglio uno spazio che già conosci.",
      Simulation: Task10Quiz,
    },
  ],
};
