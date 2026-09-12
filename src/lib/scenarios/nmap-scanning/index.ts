import type { Scenario } from "../types";
import Task01Intent from "./tasks/Task01Intent";
import Task02Command from "./tasks/Task02Command";
import Task03States from "./tasks/Task03States";
import Task04Discovery from "./tasks/Task04Discovery";
import Task05SynConnect from "./tasks/Task05SynConnect";
import Task06Timing from "./tasks/Task06Timing";
import Task07Versions from "./tasks/Task07Versions";
import Task08Nse from "./tasks/Task08Nse";
import Task09Output from "./tasks/Task09Output";
import Task10Triage from "./tasks/Task10Triage";

export const nmapScanningScenario: Scenario = {
  id: "nmap-scanning",
  slug: "nmap-scanning",
  title: "Scansione con Nmap",
  subtitle: "Verificare cosa è raggiungibile, con quale rumore e con quale livello di certezza",
  intro:
    "Dopo la raccolta di informazioni arriva il momento in cui si smette di osservare da lontano e si comincia a bussare. La scansione è la fase in cui un pacchetto parte davvero verso i sistemi del cliente: per questo va calibrata, motivata e documentata. In questo scenario lavorerai su una rete simulata con Nmap, lo strumento che quasi tutti i professionisti usano per capire quali host sono attivi e quali servizi rispondono. Costruirai comandi pezzo per pezzo, imparerai a leggere gli stati delle porte senza forzarne il significato, sceglierai velocità e script in base alla fragilità del bersaglio e chiuderai con un triage ordinato. Nessun pacchetto lascia il tuo browser: tutti gli output sono ricostruzioni realistiche.",
  highlights: [
    "Comandi Nmap costruiti e commentati opzione per opzione.",
    "Stati delle porte, scoperta degli host, SYN e connect scan, timing e script NSE.",
    "Output salvato nel formato giusto e triage finale con priorità motivate.",
  ],
  category: "Metodologia Pentest",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-intento",
      title: "Prima di lanciare: intento e rumore",
      goal: "Ordinare le azioni di scansione in base al disturbo che provocano",
      brief:
        "Una scansione non è un'osservazione neutra: genera pacchetti che arrivano sui sistemi di qualcun altro, compaiono nei log e possono attivare allarmi. Prima ancora di scegliere le opzioni, conviene sapere quanto pesa ciò che stai per fare.",
      details: `Il rumore dipende da due fattori: quanti pacchetti invii e quanto sono insoliti. Risolvere un nome presso un resolver pubblico non tocca il bersaglio; provare migliaia di porte su un'intera sottorete lo tocca eccome, e lo racconta a chiunque guardi i log.

Non esiste una soglia universale di accettabilità: esiste il mandato. Azioni rumorose possono essere perfettamente legittime se concordate, e azioni minime possono essere problematiche se fuori perimetro. Qui disporrai cinque attività tipiche su una scala di rumore, imparando a stimare l'impatto prima di digitare il comando.`,
      hint: "Chiediti dove arrivano i pacchetti e quanti sono: una fonte esterna, poche porte o un'intera rete?",
      explanation: "Sai stimare il peso di un'azione di scansione prima di eseguirla.",
      Simulation: Task01Intent,
    },
    {
      id: "02-comando",
      title: "Anatomia di un comando nmap",
      goal: "Costruire un comando completo e saperlo spiegare pezzo per pezzo",
      brief:
        "Un comando Nmap sembra una formula magica, ma ogni parte ha un ruolo preciso: il tipo di scansione, la velocità, l'elenco delle porte, il file di output e infine il bersaglio.",
      details: `Chi copia comandi trovati online spesso non sa cosa sta inviando: è il modo più rapido per causare un disservizio o per uscire dal perimetro. Saper giustificare ogni opzione, invece, ti permette di difendere il tuo operato se qualcosa va storto.

Nella scorta troverai anche tre pezzi che una prima scansione prudente non dovrebbe contenere: scansionare tutte le porte, correre alla massima velocità o provare credenziali. Riconoscerli è parte dell'esercizio quanto comporre il comando corretto.`,
      hint: "Programma, tipo di scansione, timing, porte, output e infine l'indirizzo autorizzato.",
      explanation: "Hai composto un comando difendibile, con una motivazione per ogni opzione.",
      Simulation: Task02Command,
    },
    {
      id: "03-stati",
      title: "Stati delle porte",
      goal: "Dedurre lo stato corretto dalla risposta ricevuta",
      brief:
        "Nmap non vede le porte: invia un pacchetto, osserva cosa torna indietro e da quella reazione deduce uno stato. Le parole open, closed e filtered sono conclusioni, non fotografie.",
      details: `Una risposta SYN/ACK indica un servizio che accetta connessioni. Un RST dice che l'host è vivo ma su quella porta non ascolta nessuno. Il silenzio ripetuto, invece, suggerisce un filtro che scarta i pacchetti senza rispondere, e un messaggio ICMP di divieto lo conferma esplicitamente.

Il caso più insidioso è UDP: molti servizi non rispondono nemmeno quando funzionano, e Nmap è costretto a scrivere open|filtered, cioè «non posso distinguere». Riconoscere questa ambiguità evita conclusioni imbarazzanti nel rapporto finale.`,
      hint: "Una risposta esplicita porta a una conclusione netta; il silenzio quasi mai.",
      explanation: "Distingui ciò che il bersaglio ha risposto da ciò che lo strumento ha dedotto.",
      Simulation: Task03States,
    },
    {
      id: "04-scoperta",
      title: "Chi è acceso? Host discovery",
      goal: "Scegliere la tecnica di scoperta adatta al contesto di rete",
      brief:
        "Prima di analizzare le porte conviene capire quali indirizzi rispondono. Scansionare una rete intera senza filtrare gli host spenti significa sprecare ore e generare rumore inutile.",
      details: `Nella stessa rete locale la scoperta più affidabile è ARP: nessun firewall software può ignorarla, perché è il meccanismo con cui i dispositivi si trovano tra loro. Su Internet, invece, ARP non serve a nulla e il classico ping ICMP viene spesso scartato dai provider: si bussa allora sulle porte dove qualcuno probabilmente ascolta, tipicamente 80 e 443.

Esiste infine il caso in cui il cliente ti conferma per iscritto che certi host esistono ma nessuna sonda riceve risposta. Lì si usa l'opzione che salta del tutto la fase di scoperta e tratta gli indirizzi come attivi. Affronterai le tre situazioni una dopo l'altra.`,
      hint: "Dipende da dove ti trovi: stessa rete, Internet aperto o filtro che blocca tutto.",
      explanation: "Sai scoprire gli host vivi senza dichiarare spento chi era solo silenzioso.",
      Simulation: Task04Discovery,
    },
    {
      id: "05-sys-st",
      title: "SYN scan o connect scan?",
      goal: "Capire la differenza fra le due scansioni TCP fondamentali",
      brief:
        "Le due scansioni TCP più usate arrivano allo stesso risultato per strade diverse: una completa la stretta di mano con il servizio, l'altra la interrompe a metà.",
      details: `Il connect scan usa la normale funzione di connessione del sistema operativo: funziona sempre, non richiede privilegi particolari e attraversa anche i proxy. In cambio, il servizio registra una sessione completa e quindi lascia una riga nei log applicativi.

Il SYN scan costruisce i pacchetti a mano e chiude la conversazione appena ottenuta la risposta. È più rapido e spesso invisibile ai log del singolo servizio, ma richiede privilegi elevati sulla macchina di attacco e resta perfettamente visibile a un firewall o a un sistema di rilevamento. Osserverai entrambe le sequenze animate e poi sceglierai quella adatta a tre situazioni concrete.`,
      hint: "Guarda l'ultimo pacchetto della sequenza e chiediti quali permessi servono per costruirlo.",
      explanation: "Scegli la scansione TCP giusta in base a privilegi disponibili e tracce lasciate.",
      Simulation: Task05SynConnect,
    },
    {
      id: "06-timing",
      title: "Timing e prudenza",
      goal: "Calibrare la velocità sulla fragilità del bersaglio",
      brief:
        "I profili di timing regolano pause fra i pacchetti e numero di richieste in parallelo. Non sono una manopola del volume da tenere sempre al massimo.",
      details: `Un apparato di rete datato o un gestionale in produzione possono soffrire un carico improvviso di connessioni: il rischio non è teorico, ed è il tipo di incidente che chiude anticipatamente un incarico. All'estremo opposto, un laboratorio isolato non ha ragione di essere trattato con delicatezza.

Esiste poi il vincolo più comune di tutti: la finestra temporale concordata. Se hai mezz'ora autorizzata, un profilo troppo lento non finirà mai la scansione e ti costringerà a chiedere una proroga. Regolerai lo slider su tre bersagli osservando come cambiano durata stimata e livello di disturbo.`,
      hint: "Sistema fragile: rallenta. Laboratorio isolato: accelera. Finestra breve: cerca l'equilibrio.",
      explanation: "Hai adattato la velocità al contesto invece che all'abitudine.",
      Simulation: Task06Timing,
    },
    {
      id: "07-versioni",
      title: "Versioni e impronta del sistema",
      goal: "Interrogare i servizi distinguendo dati osservati e ipotesi",
      brief:
        "Sapere che la porta 22 è aperta è poco. Sapere quale software risponde, e con quale versione dichiarata, orienta tutte le fasi successive del test.",
      details: `Il rilevamento di versione apre connessioni reali e confronta le risposte con un ampio archivio di firme. Il rilevamento del sistema operativo va oltre: invia pacchetti con combinazioni insolite di flag e interpreta le piccole differenze di comportamento dello stack di rete, restituendo una stima con percentuale di confidenza.

Entrambi producono materiale prezioso e entrambi vanno letti con misura. Un banner può essere stato modificato dall'amministratore, oppure può indicare una versione mai aggiornata nel testo pur essendo stata corretta con una patch. Userai un terminale simulato e poi classificherai quattro affermazioni tratte dall'output.`,
      hint: "Prova sia il rilevamento delle versioni sia quello del sistema operativo, poi rileggi l'output con occhio critico.",
      explanation: "Raccogli versioni e impronte senza confondere una risposta con una certezza.",
      Simulation: Task07Versions,
    },
    {
      id: "08-nse",
      title: "NSE, scegliere lo strumentario giusto",
      goal: "Selezionare script utili e proporzionati a una ricognizione",
      brief:
        "Il motore di scripting trasforma Nmap in una piccola cassetta degli attrezzi: centinaia di controlli automatici organizzati per categoria, dai più innocui ai più aggressivi.",
      details: `Le categorie sono la prima difesa contro gli errori. Gli script marcati come sicuri si limitano a leggere informazioni che il servizio offre spontaneamente: il titolo di una pagina, un certificato, un messaggio di benvenuto. Quelli intrusivi, invece, tentano credenziali, modificano stati o verificano condizioni di sovraccarico.

Anche una categoria dal nome rassicurante può nascondere sorprese: nel gruppo dedicato alle vulnerabilità convivono controlli passivi e test che possono interrompere un servizio. Comporrai un set adatto a una prima ricognizione autorizzata, escludendo ciò che richiede un mandato separato.`,
      hint: "Includi solo ciò che legge informazioni già offerte dai servizi; lascia fuori credenziali e test di resistenza.",
      explanation: "Hai costruito un set di script informativo e proporzionato al mandato.",
      Simulation: Task08Nse,
    },
    {
      id: "09-output",
      title: "Dal comando al report",
      goal: "Salvare i risultati nel formato adatto a chi li userà",
      brief:
        "Una scansione non salvata è un lavoro da rifare. Nmap offre più formati di output perché i destinatari sono diversi: una persona che legge, un programma che importa, un filtro da riga di comando.",
      details: `Il formato normale ricalca ciò che vedi a schermo ed è quello che incollerai in un rapporto. L'XML è verboso ma strutturato: ogni host, porta e servizio diventa un campo che un altro strumento può leggere senza interpretazioni. Il formato grepable comprime tutto in una riga per host, ideale per estrarre al volo gli host con una certa porta aperta.

Esiste anche l'opzione che produce tutti e tre i file con lo stesso nome base: costa nulla e ti evita di rilanciare la scansione perché avevi scelto il formato sbagliato. Confronterai le anteprime e assegnerai il formato corretto a tre esigenze reali.`,
      hint: "Chiediti chi leggerà il file: una persona, un programma o un comando di filtro.",
      explanation: "Sai conservare i risultati in modo riutilizzabile e verificabile.",
      Simulation: Task09Output,
    },
    {
      id: "10-triage",
      title: "Triage finale della scansione",
      goal: "Ordinare i risultati per rischio e proporre un passo autorizzato",
      brief:
        "Alla fine della scansione hai un elenco di porte aperte. Il valore del tuo lavoro sta nel trasformarlo in poche righe che dicono al cliente da dove cominciare e perché.",
      details: `Una priorità alta si giustifica con due elementi insieme: il servizio offre un accesso diretto o custodisce dati, e l'evidenza raccolta è solida. Un banner che suggerisce una versione antica è interessante, ma resta un banner: va segnalato come da verificare, non come vulnerabilità confermata.

Allo stesso modo, un sito pubblico che rimanda alla versione cifrata è semplicemente un sistema configurato bene. Riempire il rapporto di segnalazioni irrilevanti fa perdere credibilità tanto quanto tralasciarne una importante. Chiuderai assegnando le priorità e scegliendo il prossimo passo da proporre al referente.`,
      hint: "Alza la priorità per accessi remoti e database esposti; resta prudente dove hai solo un banner.",
      explanation: "Hai completato la fase di scansione con un triage chiaro, motivato e dentro il perimetro.",
      Simulation: Task10Triage,
    },
  ],
};
