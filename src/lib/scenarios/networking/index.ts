import type { Scenario } from "../types";
import Task01Ip from "./tasks/Task01Ip";
import Task02Subnet from "./tasks/Task02Subnet";
import Task03Mac from "./tasks/Task03Mac";
import Task04Arp from "./tasks/Task04Arp";
import Task05Switch from "./tasks/Task05Switch";
import Task06Router from "./tasks/Task06Router";
import Task07Nat from "./tasks/Task07Nat";
import Task08Dns from "./tasks/Task08Dns";
import Task09Ports from "./tasks/Task09Ports";
import Task10Quiz from "./tasks/Task10Quiz";

export const networkingScenario: Scenario = {
  id: "networking",
  slug: "networking",
  title: "Networking",
  subtitle: "I mattoncini di ogni rete: IP, MAC, ARP, switch, router, NAT, DNS, porte",
  intro:
    "Prima di attaccare o difendere una rete, devi capirla. In questo scenario esplori — in modo interattivo — i concetti fondamentali su cui poggia ogni comunicazione: indirizzo IP e MAC, subnet, il modo in cui uno switch e un router smistano i pacchetti, come il NAT permette a un intero ufficio di uscire su Internet con un solo IP pubblico, come il DNS traduce i nomi e cosa significa davvero fare un port scan.",
  highlights: [
    "I mattoncini di ogni rete, spiegati con simulazioni.",
    "Classifichi IP, mandi ARP, esplori NAT, DNS, port scan.",
    "Le basi tecniche indispensabili per ogni attacco successivo.",
  ],
  category: "Fondamentali",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-ip",
      title: "Indirizzo IP",
      goal: "Capire cos'è un IP e riconoscerlo",
      brief:
        "Ogni dispositivo in rete ha un indirizzo IP. È il numero con cui il resto della rete lo trova.",
      details:
        "Un indirizzo IPv4 è composto da quattro numeri (0–255) separati da punti: 192.168.1.10. Ne esistono di pubblici (raggiungibili su Internet) e privati (usati dentro reti locali: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16).\n\nEsiste anche IPv6, con un formato molto più lungo (fd00::1). Serve perché gli IPv4 sono finiti.\n\nIn questo task devi classificare alcuni indirizzi: pubblico, privato, loopback (127.0.0.1) o non valido. Impari a leggerli a colpo d'occhio.",
      hint: "Privati: iniziano con 10., 172.16–31., o 192.168.  Loopback: 127.0.0.1.",
      explanation:
        "L'IP identifica un dispositivo a livello di rete. Gli IP privati vivono dentro reti locali e non sono raggiungibili direttamente da Internet: escono grazie al NAT (lo vedrai nel task 7).",
      Simulation: Task01Ip,
    },
    {
      id: "02-subnet",
      title: "Subnet e CIDR",
      goal: "Capire cosa significa /24, /16, /8",
      brief:
        "La subnet mask decide quanti dispositivi stanno nella stessa rete. La notazione /24 è la forma corta.",
      details:
        "Un indirizzo IP da solo non basta: bisogna sapere quale porzione identifica la rete e quale il singolo dispositivo. Lo dice la subnet mask.\n\nEsempio: 192.168.1.10/24 significa che i primi 24 bit (192.168.1) identificano la rete, e restano 8 bit per gli host — cioè 254 dispositivi utili (2 sono riservati: network e broadcast).\n\nSposta lo slider e osserva come cambia il numero di host disponibili. È lo strumento base per progettare qualunque rete.",
      hint: "Più il numero dopo / è basso, più grande è la rete. /24 = 254 host, /16 = 65534, /8 = milioni.",
      explanation:
        "CIDR è solo un modo compatto di scrivere la subnet mask. /24 corrisponde a 255.255.255.0. Sapere di quanti host hai bisogno ti dice quale prefisso usare.",
      Simulation: Task02Subnet,
    },
    {
      id: "03-mac",
      title: "Indirizzo MAC",
      goal: "L'identità fisica di ogni scheda di rete",
      brief:
        "Ogni scheda di rete ha un MAC address univoco al mondo, stampato in fabbrica.",
      details:
        "Il MAC è composto da 6 byte in esadecimale (es. 3C:22:FB:AA:11:22). I primi 3 byte (OUI) identificano il produttore della scheda: Apple, Intel, Cisco, Samsung… è pubblico, esiste un registro IEEE.\n\nMentre l'IP può cambiare (quando ti sposti da una rete a un'altra), il MAC è legato all'hardware. Su reti Wi-Fi moderne viene spesso randomizzato per privacy, ma nella LAN cablata resta stabile.\n\nAnalizza i MAC di questo task e prova a scoprire chi li ha prodotti.",
      hint: "L'OUI sono i primi 3 byte. Confrontali con la mini-tabella dei vendor.",
      explanation:
        "Il MAC agisce nel livello 2 (Ethernet/Wi-Fi), l'IP nel livello 3. Il primo serve DENTRO la rete locale, il secondo serve per raggiungere reti remote.",
      Simulation: Task03Mac,
    },
    {
      id: "04-arp",
      title: "ARP — da IP a MAC",
      goal: "Vedere come un IP diventa un MAC nella LAN",
      brief:
        "Nella tua LAN i pacchetti viaggiano usando il MAC, non l'IP. ARP è il traduttore.",
      details:
        "Quando il tuo PC vuole parlare con 192.168.1.20, deve prima sapere QUALE scheda di rete risponde a quell'IP. Manda un ARP request in broadcast: «chi ha 192.168.1.20?». Il dispositivo giusto risponde: «io, il mio MAC è 3C:22:FB:...». La coppia viene salvata in una tabella ARP locale.\n\nÈ un protocollo che si fida: non c'è autenticazione. È da qui che nascono attacchi come l'ARP spoofing (di cui parleremo in scenari futuri).\n\nClicca «Invia richiesta ARP» e guarda la risposta popolare la tua tabella.",
      hint: "Il broadcast MAC è FF:FF:FF:FF:FF:FF. Solo l'host corretto risponde.",
      explanation:
        "Senza ARP, dentro la LAN, niente pacchetto raggiungerebbe la giusta scheda di rete. Chi controlla le risposte ARP può dirottare il traffico.",
      Simulation: Task04Arp,
    },
    {
      id: "05-switch",
      title: "Switch — livello 2",
      goal: "Come uno switch impara chi sta dietro ogni porta",
      brief:
        "Lo switch smista pacchetti guardando il MAC di destinazione. Impara osservando il traffico.",
      details:
        "All'accensione uno switch ha la MAC-address-table vuota. Quando riceve un frame da una porta, memorizza «MAC X è raggiungibile dalla porta N». Se non sa dov'è la destinazione, invia in flooding a tutte le porte (tranne quella d'origine).\n\nCon il tempo la tabella si popola e il traffico diventa mirato. Uno switch NON guarda gli IP: lavora solo sui MAC.\n\nClicca sui vari host per farli parlare tra loro e vedi la tabella riempirsi.",
      hint: "All'inizio ogni frame è flooding. Dopo il primo scambio, lo switch impara.",
      explanation:
        "Lo switch riduce drasticamente il traffico rispetto a un vecchio hub: parla solo con la porta corretta. È il cuore di ogni LAN aziendale.",
      Simulation: Task05Switch,
    },
    {
      id: "06-router",
      title: "Router — livello 3",
      goal: "Vedere un pacchetto attraversare più reti",
      brief:
        "Se la destinazione è fuori dalla tua LAN, il pacchetto passa al router, che decide il prossimo hop.",
      details:
        "Il router ha una routing table che dice, per ogni rete di destinazione, verso quale interfaccia (o router successivo) inoltrare il pacchetto. Quando riesci a raggiungere un sito web dall'altra parte del mondo, il pacchetto ha probabilmente attraversato 10–20 router.\n\nOgni router legge l'IP di destinazione, consulta la tabella, decrementa il TTL (time-to-live) e inoltra. Se il TTL arriva a zero, il pacchetto viene scartato: è il meccanismo su cui si basa il comando traceroute.\n\nClicca «Invia pacchetto» e osserva gli hop.",
      hint: "Il TTL scende di 1 a ogni router. Se arriva a 0, il pacchetto è perso.",
      explanation:
        "Router = interconnessione di reti diverse. Ogni interfaccia sta su una rete diversa, con IP diversi. La routing table decide dove andare.",
      Simulation: Task06Router,
    },
    {
      id: "07-nat",
      title: "NAT — un IP pubblico per tutti",
      goal: "Capire come 100 dispositivi condividono un IP pubblico",
      brief:
        "Il router di casa/ufficio ha un solo IP pubblico ma decine di dispositivi dietro. Il NAT rende possibile tutto ciò.",
      details:
        "Il NAT (Network Address Translation), nella variante PAT/masquerading, riscrive gli IP e le porte sorgente delle connessioni uscenti: sostituisce l'IP privato interno con l'IP pubblico del router e sceglie una porta libera. Quando arriva la risposta, guarda la porta e la restituisce al giusto dispositivo interno.\n\nÈ la ragione per cui IPv4 è sopravvissuto: senza NAT non basterebbero gli indirizzi per tutti.\n\nSimula qualche connessione uscente e osserva la tabella NAT del router riempirsi.",
      hint: "La chiave della traduzione è la coppia (IP:porta). Ogni connessione ha una porta esterna diversa.",
      explanation:
        "Il NAT rompe il modello «ogni dispositivo ha un IP raggiungibile». Ha effetti collaterali (peer-to-peer, VoIP…) risolti con tecniche come STUN/TURN.",
      Simulation: Task07Nat,
    },
    {
      id: "08-dns",
      title: "DNS — dal nome all'IP",
      goal: "Vedere come www.example.com diventa 93.184.216.34",
      brief:
        "Nessuno ricorda gli IP. Il DNS traduce nomi umani in indirizzi di rete.",
      details:
        "Quando digiti un dominio, il tuo PC chiede al resolver (spesso il router o 8.8.8.8). Il resolver, se non ha la risposta in cache, la cerca partendo dai root server → server TLD (.com) → server autoritativo del dominio.\n\nOgni risposta viene messa in cache per il TTL indicato. È il motivo per cui un cambio DNS non è mai istantaneo per tutti.\n\nAvvia la risoluzione e osserva la catena di domande e risposte.",
      hint: "L'ordine è: root → TLD → autoritativo. Ogni step scopre chi contattare al passo successivo.",
      explanation:
        "Il DNS è distribuito, gerarchico, con cache multiple. Chi controlla il DNS controlla dove finiscono le tue connessioni: è un bersaglio classico degli attacchi.",
      Simulation: Task08Dns,
    },
    {
      id: "09-ports",
      title: "Porte e servizi",
      goal: "Cosa succede quando fai un port scan",
      brief:
        "Un servizio ascolta su una porta. Un port scan chiede a ogni porta: «sei aperta?».",
      details:
        "Un IP identifica un host, una porta identifica il servizio dentro quell'host. Web = 80/443, SSH = 22, RDP = 3389, DNS = 53. Le porte 0–1023 sono well-known, 1024–49151 registrate, il resto effimere.\n\nUn port scan invia pacchetti TCP (o UDP) a ogni porta e classifica la risposta: aperta (servizio attivo), chiusa (nessun servizio), filtrata (firewall in mezzo). È di solito il primo passo di qualunque analisi.\n\nEsegui la scansione sui tre host di esempio e identifica i servizi.",
      hint: "SYN → SYN/ACK = aperta. SYN → RST = chiusa. Nessuna risposta = filtrata.",
      explanation:
        "Un servizio esposto = una superficie d'attacco. Chiudi ciò che non serve, esponi solo ciò che è indispensabile, metti un firewall davanti al resto.",
      Simulation: Task09Ports,
    },
    {
      id: "10-quiz",
      title: "Quiz finale — 10 domande",
      goal: "Consolidare i fondamentali di rete",
      brief:
        "Dieci domande per fissare i concetti dello scenario. Rispondi correttamente a tutte per completare il modulo.",
      details:
        "Le domande coprono IP, subnet, MAC, ARP, switch, router, NAT, DNS e porte. Se sbagli, rileggi la spiegazione del task corrispondente — non c'è penalità nel riprovare.",
      hint: "Pensa: chi lavora a livello 2? Chi a livello 3? Dov'è la traduzione nome→IP? Dov'è la traduzione IP privato→pubblico?",
      explanation:
        "Con questi fondamentali in mano, puoi seguire gli scenari successivi — dove attaccheremo davvero i protocolli visti qui.",
      Simulation: Task10Quiz,
    },
  ],
};
