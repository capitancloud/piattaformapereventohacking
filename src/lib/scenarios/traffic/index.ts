import type { Scenario } from "../types";
import Task01WhyAnalyze from "./tasks/Task01WhyAnalyze";
import Task02Pcap from "./tasks/Task02Pcap";
import Task03Wireshark from "./tasks/Task03Wireshark";
import Task04Filters from "./tasks/Task04Filters";
import Task05Handshake from "./tasks/Task05Handshake";
import Task06FollowStream from "./tasks/Task06FollowStream";
import Task07HttpCreds from "./tasks/Task07HttpCreds";
import Task08Dns from "./tasks/Task08Dns";
import Task09Tshark from "./tasks/Task09Tshark";
import Task10Quiz from "./tasks/Task10Quiz";

export const trafficScenario: Scenario = {
  id: "traffic",
  slug: "traffic-analysis",
  title: "Analisi del traffico di rete",
  subtitle: "Dai pacchetti grezzi ai comportamenti: leggere una rete come un libro",
  intro:
    "Ogni conversazione digitale — un sito web che si apre, una mail che parte, un malware che chiama casa — lascia una traccia sotto forma di pacchetti di rete. Imparare a leggere questi pacchetti significa poter capire cosa succede davvero dietro le quinte: risolvere problemi, indagare incidenti, scoprire attacchi. In questo scenario partiamo dalle basi, apriamo un file .pcap con Wireshark, impariamo a filtrare, ricostruire conversazioni e usare tshark da riga di comando.",
  highlights: [
    "Cosa sono i pacchetti e a cosa serve analizzarli.",
    "Wireshark, filtri di visualizzazione e follow stream.",
    "tshark da CLI e analisi di HTTP, DNS e TCP handshake.",
  ],
  category: "Difesa & Analisi",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-perche-analizzare",
      title: "Perché analizzare il traffico?",
      goal: "Capire i tre usi principali",
      brief:
        "Analizzare il traffico di rete significa catturare i pacchetti che passano su un cavo o su una WiFi e leggerli uno per uno. Serve in tre grandi ambiti: risolvere problemi tecnici, indagare incidenti di sicurezza e fare analisi forense dopo un attacco.",
      details:
        "Un sistemista lo usa per capire perché un'applicazione è lenta: vede se ci sono ritrasmissioni, latenze anomale, connessioni che si chiudono male. Un analista di sicurezza lo usa per accorgersi di comportamenti sospetti: una macchina che parla con un dominio strano, traffico cifrato verso IP mai visti prima, esfiltrazioni di dati.\n\nUn investigatore forense lo usa dopo un incidente per ricostruire cosa è successo: quali file sono usciti, chi ha parlato con chi, quando è iniziato l'attacco.\n\nNella simulazione dovrai classificare alcuni scenari in una di queste tre categorie.",
      hint: "Chiediti: chi ha bisogno di questa informazione? Un tecnico, un analista di sicurezza o un forense?",
      explanation:
        "Ora sai perché l'analisi del traffico è una skill trasversale: la usano ruoli molto diversi con obiettivi molto diversi.",
      Simulation: Task01WhyAnalyze,
    },
    {
      id: "02-pcap",
      title: "Il file .pcap e i livelli",
      goal: "Riconoscere i livelli di un pacchetto",
      brief:
        "Un file .pcap (packet capture) contiene una registrazione grezza di pacchetti di rete. Ogni pacchetto è come una matrioska: dentro un livello ce n'è un altro, dal più basso (elettrico) al più alto (applicativo).",
      details:
        "Il modello di riferimento (TCP/IP) ha quattro livelli principali. Livello 2 Ethernet: contiene gli indirizzi MAC delle schede di rete. Livello 3 IP: contiene gli indirizzi IP sorgente e destinazione. Livello 4 TCP/UDP: contiene le porte e i numeri di sequenza. Livello 7 applicativo: HTTP, DNS, TLS, e tutto il resto.\n\nWireshark ti mostra i pacchetti già decodificati livello per livello, ma capire quale campo appartiene a quale livello è il primo passo per non perdersi.\n\nNella simulazione dovrai assegnare ogni campo al livello giusto.",
      hint: "MAC → Ethernet, IP → IP, Porta → TCP/UDP, dominio o URL → applicativo.",
      explanation:
        "Hai capito la struttura a livelli di un pacchetto. È la mappa che ti serve per orientarti dentro Wireshark.",
      Simulation: Task02Pcap,
    },
    {
      id: "03-wireshark",
      title: "Tour di Wireshark",
      goal: "Riconoscere le tre aree principali",
      brief:
        "Wireshark è lo standard mondiale per l'analisi del traffico. La sua interfaccia è divisa in tre riquadri: elenco pacchetti in alto, dettagli del pacchetto selezionato al centro, byte grezzi in basso.",
      details:
        "Il riquadro Packet List mostra una riga per pacchetto con numero, tempo, IP sorgente, IP destinazione, protocollo e una breve descrizione. Il riquadro Packet Details espande il pacchetto selezionato mostrando tutti i livelli in modo gerarchico. Il riquadro Packet Bytes mostra gli stessi dati in esadecimale e ASCII.\n\nCliccando su un campo dei dettagli, Wireshark evidenzia i byte corrispondenti nel terzo riquadro. È il modo migliore per capire dove finisce un livello e dove inizia il successivo.\n\nNella simulazione clicca sulle tre aree per identificarle.",
      hint: "L'elenco sta in alto, i dettagli espansi al centro, i byte grezzi in basso.",
      explanation:
        "Hai preso confidenza con la struttura di Wireshark. Ora saprai sempre dove guardare per rispondere a una domanda.",
      Simulation: Task03Wireshark,
    },
    {
      id: "04-filtri",
      title: "Filtri di visualizzazione",
      goal: "Costruire filtri Wireshark",
      brief:
        "Un file .pcap può contenere migliaia di pacchetti. I filtri di visualizzazione di Wireshark servono a mostrare solo quelli che ti interessano davvero: per IP, per porta, per protocollo.",
      details:
        "Sintassi essenziale: ip.addr == 10.0.0.5 filtra per un IP, tcp.port == 443 filtra per porta, http mostra solo pacchetti HTTP, dns solo query DNS. Puoi combinarli con and, or, not. Esempio: ip.addr == 10.0.0.5 and tcp.port == 443.\n\nAttenzione: eq usa il doppio uguale (==), non uno solo. Se sbagli sintassi, la barra dei filtri diventa rossa.\n\nNella simulazione componi il filtro giusto per raggiungere l'obiettivo di ogni scenario.",
      hint: "Ricorda: ip.addr, tcp.port, http, dns. Combina con and.",
      explanation:
        "I filtri sono la chiave per non perdersi in un pcap grosso. Ora sai isolare esattamente quello che ti serve.",
      Simulation: Task04Filters,
    },
    {
      id: "05-tcp-handshake",
      title: "Il three-way handshake TCP",
      goal: "Ricostruire l'apertura di una connessione TCP",
      brief:
        "Prima di scambiare qualsiasi dato, due macchine che parlano TCP eseguono un three-way handshake: tre pacchetti che sincronizzano client e server.",
      details:
        "Il client manda un pacchetto con il flag SYN al server. Il server risponde con SYN + ACK. Il client conferma con un ACK finale. Da quel momento la connessione è aperta e i dati possono scorrere.\n\nRiconoscere questo pattern è fondamentale: quando fai troubleshooting, un handshake che non si completa vuol dire firewall che blocca, server spento o timeout. Anche molti port scan (SYN scan) sfruttano solo il primo pacchetto.\n\nNella simulazione osserva l'animazione e rimetti in ordine i tre pacchetti.",
      hint: "Chi inizia? Il client. Chi risponde? Il server. Chi conferma? Il client di nuovo.",
      explanation:
        "Hai capito come TCP apre una connessione. Ora saprai riconoscere handshake completi, tentativi falliti e scansioni sospette.",
      Simulation: Task05Handshake,
    },
    {
      id: "06-follow-stream",
      title: "Follow TCP Stream",
      goal: "Ricostruire una conversazione HTTP",
      brief:
        "La funzione Follow Stream di Wireshark prende tutti i pacchetti di una singola connessione TCP e li rimette insieme mostrandoti la conversazione come se fosse un unico dialogo.",
      details:
        "È utilissima per HTTP non cifrato: vedi la richiesta del client (GET, POST, headers, body) e la risposta del server (status code, headers, HTML) come testo leggibile. Su traffico HTTPS, invece, vedi solo dati cifrati: serve la chiave di sessione per decifrarli.\n\nQuesta funzione è indispensabile in analisi forense: se un attaccante ha esfiltrato dati via HTTP, qui li vedi in chiaro.\n\nNella simulazione ordina i frammenti della conversazione per ricostruire lo scambio.",
      hint: "Il client parla per primo con GET o POST. Il server risponde con HTTP/1.1 e uno status code.",
      explanation:
        "Follow Stream trasforma decine di pacchetti in un dialogo leggibile. È lo strumento numero uno per capire cosa si sono detti due host.",
      Simulation: Task06FollowStream,
    },
    {
      id: "07-http-creds",
      title: "Credenziali HTTP in chiaro",
      goal: "Trovare username e password nel traffico",
      brief:
        "Quando un sito usa HTTP invece di HTTPS, tutto il traffico viaggia in chiaro. Chiunque intercetti può leggere username, password, cookie e dati sensibili senza sforzo.",
      details:
        "Nei form web, le credenziali di login vengono inviate al server nel body di una richiesta POST, in genere in formato username=xxx&password=yyy. Basta selezionare la richiesta in Wireshark e guardare il payload per trovarle.\n\nQuesto è uno dei motivi per cui oggi tutti i siti seri usano HTTPS: senza cifratura, sniffare le credenziali è banale, anche per un attaccante alle prime armi.\n\nNella simulazione analizza la richiesta POST e individua le credenziali corrette.",
      hint: "Cerca nel body della POST: le credenziali sono nella forma chiave=valore separate da &.",
      explanation:
        "Hai visto con i tuoi occhi perché HTTPS non è opzionale. Con HTTP puro, ogni password su rete pubblica è già persa.",
      Simulation: Task07HttpCreds,
    },
    {
      id: "08-dns",
      title: "Query DNS sospette",
      goal: "Identificare traffico DNS anomalo",
      brief:
        "Il DNS traduce nomi (esempio.com) in indirizzi IP. È un traffico apparentemente innocuo ma è usatissimo dai malware per comunicare con i loro server di comando (C2) e per esfiltrare dati.",
      details:
        "Due pattern classici da conoscere: i domini DGA (Domain Generation Algorithm) sono stringhe generate a caso da malware per contattare C2 e cambiano ogni giorno (esempio: xk7f2s9d1p.top). Il DNS tunneling nasconde dati dentro sottodomini molto lunghi (esempio: aGVsbG8gd29ybGQ.data.attacker.com) usando il DNS come canale nascosto.\n\nUn analista guarda soprattutto: lunghezza dei sottodomini, casualità delle stringhe, frequenza delle query, TLD insoliti.\n\nNella simulazione classifica ogni query DNS come legittima o sospetta.",
      hint: "I domini normali sono leggibili. Quelli sospetti sembrano generati a caso o hanno sottodomini enormi.",
      explanation:
        "Hai imparato a riconoscere due tecniche molto usate dai malware. Il DNS è spesso il primo posto dove vedere un compromesso.",
      Simulation: Task08Dns,
    },
    {
      id: "09-tshark",
      title: "tshark da riga di comando",
      goal: "Usare tshark per estrarre informazioni",
      brief:
        "tshark è la versione a riga di comando di Wireshark. Perfetta per analizzare pcap grossi via SSH, script automatici o pipeline con altri strumenti Unix.",
      details:
        "I comandi base: tshark -r file.pcap legge un file, -Y \"filtro\" applica un filtro Wireshark, -T fields -e ip.src -e ip.dst estrae solo alcuni campi, -c 10 limita il numero di pacchetti mostrati.\n\nUn esempio potente: tshark -r traffic.pcap -Y \"http.request\" -T fields -e ip.src -e http.host ti dà una lista di chi ha contattato quali domini via HTTP, pronta da passare a sort o uniq.\n\nNella simulazione hai un mini-terminale: prova alcuni comandi tshark su un pcap simulato.",
      hint: "Struttura: tshark -r <file> -Y \"<filtro>\" [-T fields -e <campo>].",
      explanation:
        "Ora sai analizzare pcap senza aprire Wireshark. tshark è la scelta obbligata per automazione e analisi su server.",
      Simulation: Task09Tshark,
    },
    {
      id: "10-quiz",
      title: "Quiz finale — 10 domande",
      goal: "Consolidare le basi di analisi del traffico",
      brief:
        "Dieci domande veloci per fissare i concetti chiave: pcap, livelli, filtri Wireshark, handshake, follow stream, tshark, HTTP, DNS.",
      details:
        "Non serve il punteggio perfetto: se sbagli, torna al task corrispondente e rileggi la spiegazione. Il quiz copre tutto quello che abbiamo visto: dagli strati di un pacchetto agli strumenti da riga di comando.\n\nBuon lavoro!",
      hint: "Ricorda: SYN → SYN/ACK → ACK, ip.addr, tcp.port, tshark -r, HTTPS cifra e HTTP no.",
      explanation:
        "Complimenti, hai completato l'analisi del traffico! Ora hai gli strumenti base per investigare qualsiasi cattura di rete.",
      Simulation: Task10Quiz,
    },
  ],
};
