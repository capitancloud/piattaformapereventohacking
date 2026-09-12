import re

file_path = 'src/lib/scenarios/networking/index.ts'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

tasks_data = [
    {
        "id": "01-ip",
        "brief": "In questo task imparerai a riconoscere i diversi tipi di indirizzi IP che popolano il mondo digitale. Capire come sono strutturati è il primo passo fondamentale per orientarsi in qualsiasi rete informatica.",
        "details": "Immagina l'indirizzo IP come il numero civico di una casa in una città globale: senza di esso, i pacchetti di dati non saprebbero dove andare. Un indirizzo IPv4 è formato da quattro numeri separati da punti, come 192.168.1.1, e serve a identificare in modo univoco ogni dispositivo collegato.\n\nEsistono indirizzi \"pubblici\", visibili da tutto il mondo, e indirizzi \"privati\", usati solo all'interno di casa tua o del tuo ufficio per risparmiare spazio. C'è anche l'indirizzo di loopback (127.0.0.1), che il tuo computer usa per parlare con se stesso quando fa dei test interni.\n\nIl tuo obiettivo in questa simulazione è analizzare una lista di indirizzi e classificarli correttamente. Imparerai a distinguere a colpo d'occhio cosa appartiene alla tua rete locale e cosa invece fa parte della rete globale Internet.",
        "hint": "Ricorda che gli IP privati iniziano quasi sempre con 10, 172 o 192.168. Se vedi 127.0.0.1, stai guardando il \"riflesso\" del computer stesso!",
        "explanation": "L'indirizzo IP è l'elemento base del livello di rete. Saper distinguere tra IP pubblici e privati è cruciale per capire come proteggere i dispositivi interni dagli attacchi provenienti dall'esterno."
    },
    {
        "id": "02-subnet",
        "brief": "Esploreremo come vengono create le \"stanze\" digitali all'interno di una rete più grande. Scoprirai come la subnet mask definisce quanti dispositivi possono comunicare direttamente tra loro.",
        "details": "Se l'IP è il numero civico, la subnet mask è il confine del quartiere. Decide quali case fanno parte della stessa zona e possono parlarsi senza passare da un ufficio postale centrale (il router). La notazione CIDR, come /24, è solo un modo veloce per scrivere quanto è grande questo confine.\n\nPer esempio, una rete /24 è come un piccolo condominio con circa 250 inquilini, mentre una /8 è come una metropoli con milioni di abitanti. Se configuri male questo valore, i computer non riusciranno a trovarsi anche se sono collegati allo stesso cavo.\n\nIn questa attività, dovrai usare uno slider per modificare la maschera di sottorete e osservare come cambia il numero di host disponibili. Questo ti aiuterà a visualizzare concretamente come si progetta lo spazio per i dispositivi in una rete professionale.",
        "hint": "Più il numero dopo la barra è piccolo, più la rete diventa spaziosa e accogliente per tanti dispositivi.",
        "explanation": "La subnetting permette di organizzare il traffico e migliorare la sicurezza separando i gruppi di computer. È una competenza fondamentale per chiunque voglia amministrare o testare la sicurezza di un'infrastruttura."
    },
    {
        "id": "03-mac",
        "brief": "Vedremo come identificare fisicamente una scheda di rete tramite il suo \"nome di battesimo\" immutabile. Il MAC address è l'impronta digitale dell'hardware che non cambia mai, ovunque tu vada.",
        "details": "Mentre l'indirizzo IP è come un numero di telefono che può cambiare se cambi operatore, il MAC address è come il numero di telaio stampato sul motore di un'auto. Ogni dispositivo al mondo ha un codice unico a 48 bit, scritto in esadecimale, che lo identifica in modo assoluto a livello fisico.\n\nUna curiosità utile è che i primi tre gruppi di lettere e numeri ci dicono chi ha costruito il pezzo di hardware, che sia Apple, Intel o Cisco. In un'indagine forense, il MAC è spesso la prova definitiva per risalire a un dispositivo specifico presente in un luogo.\n\nIn questo task, analizzerai diversi indirizzi MAC per scoprirne il produttore. Confronta i primi tre byte con il database fornito per identificare correttamente le macchine presenti nella rete simulata.",
        "hint": "Concentrati sui primi tre blocchi di caratteri (OUI) per capire chi ha fabbricato la scheda di rete.",
        "explanation": "Il MAC address opera al livello di collegamento ed è essenziale per la consegna dei dati nella rete locale. Conoscere il produttore di un dispositivo è spesso il primo indizio per un hacker che cerca vulnerabilità specifiche."
    },
    {
        "id": "04-arp",
        "brief": "Scoprirai il protocollo \"chiacchierone\" che permette ai computer di associarsi tra loro nella rete locale. Senza ARP, il tuo PC saprebbe a chi scrivere ma non saprebbe dove consegnare fisicamente la busta.",
        "details": "Immagina di essere in una stanza affollata e di gridare: «Chi di voi è Mario Rossi?». Quando Mario risponde «Sono io!», tu memorizzi la sua faccia per non doverlo urlare di nuovo. L'ARP (Address Resolution Protocol) fa esattamente questo: manda un grido in broadcast a tutti per trovare il MAC address corrispondente a un IP.\n\nIl problema è che l'ARP è un protocollo molto ingenuo: crede a chiunque risponda. Se un malintenzionato risponde «Sono io Mario!» prima del vero Mario, può intercettare tutti i messaggi destinati a lui senza che nessuno se ne accorga.\n\nProva a inviare una richiesta ARP nella simulazione e osserva come la tabella locale del computer si popola con le nuove informazioni. È il meccanismo che tiene unita la comunicazione all'interno di ogni ufficio o casa.",
        "hint": "Il computer invia la domanda a tutti (broadcast) usando l'indirizzo speciale FF:FF:FF:FF:FF:FF.",
        "explanation": "L'ARP è il ponte tra il mondo logico (IP) e quello fisico (MAC). Capire come funziona è indispensabile per comprendere attacchi classici come l'ARP Spoofing e il Man-in-the-Middle."
    },
    {
        "id": "05-switch",
        "brief": "Esamineremo il comportamento dello switch, il vigile urbano intelligente che smista il traffico nella LAN. Imparerai come impara le strade e come evita di intasare la rete inutilmente.",
        "details": "Lo switch è come un centralino intelligente: all'inizio non sa nulla, ma ascolta ogni conversazione per capire chi è collegato a quale porta. Quando un pacchetto arriva, lo switch guarda il MAC di destinazione e lo manda solo alla porta giusta, invece di trasmetterlo a tutti come facevano i vecchi Hub.\n\nSe lo switch non conosce ancora un indirizzo, invia il dato a tutti (flooding) finché non riceve una risposta che gli permette di aggiornare la sua tabella interna. Questo rende le reti moderne molto più veloci e difficili da \"origliare\" passivamente.\n\nIn questo esercizio, osserverai la creazione della tabella MAC all'interno dello switch. Fai comunicare i diversi computer tra loro e guarda come il dispositivo diventa sempre più efficiente nel distribuire il traffico.",
        "hint": "Guarda come lo switch riempie la sua tabella man mano che i dati passano attraverso le sue porte.",
        "explanation": "Lo switch opera a livello 2 ed è fondamentale per l'efficienza della rete locale. Saper \"avvelenare\" o saturare la sua memoria è una tecnica avanzata per costringerlo a comportarsi come un vecchio Hub meno sicuro."
    },
    {
        "id": "06-router",
        "brief": "Imparerai come i pacchetti riescono a viaggiare tra reti diverse per raggiungere la loro destinazione finale. Il router è il navigatore satellitare che decide il percorso migliore attraverso Internet.",
        "details": "Quando vuoi visitare un sito web, i tuoi dati devono uscire dalla tua rete locale e attraversare decine di altre reti in tutto il mondo. Il router analizza l'indirizzo IP di destinazione e, consultando la sua tabella di routing, decide verso quale \"prossimo salto\" (hop) spedire il pacchetto.\n\nOgni volta che il pacchetto passa per un router, il suo valore di \"tempo di vita\" (TTL) diminuisce di uno. Se il TTL arriva a zero, il pacchetto viene eliminato per evitare che giri all'infinito in rete in caso di errori di configurazione.\n\nAvvia l'invio di un pacchetto verso una rete remota e osserva come attraversa i diversi router. Nota come il TTL scende a ogni passaggio e come ogni router sappia esattamente dove mandare il traffico.",
        "hint": "Ogni router è una porta verso un mondo nuovo. Osserva il TTL calare a ogni salto per evitare loop infiniti.",
        "explanation": "Il router è il cuore del livello 3 e permette l'interconnessione globale. La comprensione del routing è vitale per analizzare i percorsi dei dati e identificare eventuali punti di intercettazione."
    },
    {
        "id": "07-nat",
        "brief": "Vedremo come una intera azienda può navigare su Internet usando un solo indirizzo IP pubblico. Il NAT è il trucco magico che ha salvato Internet quando gli indirizzi IPv4 stavano per finire.",
        "details": "Il NAT (Network Address Translation) funziona come il portiere di un condominio che riceve la posta per tutti gli inquilini. Tutti fuori vedono solo l'indirizzo del palazzo, ma il portiere sa esattamente a quale interno consegnare ogni lettera basandosi sul numero di porta o sul nome scritto sulla busta.\n\nQuesto sistema permette a migliaia di dispositivi privati di comunicare con l'esterno in modo trasparente. Senza il NAT, avremmo esaurito gli indirizzi IP disponibili decenni fa e ogni singolo gadget di casa tua avrebbe bisogno di una configurazione complessa e costosa.\n\nUsa la simulazione per connettere vari dispositivi interni a server esterni. Osserva come il router riscrive i mittenti per farli sembrare tutti provenienti dal suo unico IP pubblico, mantenendo però traccia di chi ha chiesto cosa.",
        "hint": "Il router usa la tabella NAT per ricordarsi quale computer interno ha iniziato una specifica conversazione verso l'esterno.",
        "explanation": "Il NAT fornisce un primo livello di difesa \"nascondendo\" i dispositivi interni, ma rende anche difficile ospitare servizi accessibili dall'esterno senza una configurazione specifica come il Port Forwarding."
    },
    {
        "id": "08-dns",
        "brief": "Scoprirai come il sistema dei nomi di dominio trasforma parole facili da ricordare in indirizzi numerici complicati. È la \"rubrica telefonica\" senza la quale Internet sarebbe impossibile da usare.",
        "details": "I computer parlano solo con i numeri, ma gli esseri umani preferiscono i nomi. Quando scrivi google.it, il DNS (Domain Name System) interroga una gerarchia di server per scoprire a quale IP corrisponde quel nome, passando dai server \"radice\" fino a quelli specifici del sito richiesto.\n\nPoiché queste domande richiedono tempo, i risultati vengono salvati per un po' di tempo in una memoria veloce chiamata \"cache\". Ecco perché se un sito cambia server, a volte continui a vedere la vecchia versione finché la cache non scade.\n\nAvvia una richiesta DNS in questa simulazione e segui il percorso della domanda attraverso i vari server autoritativi. Vedrai come ogni passaggio ti avvicina sempre di più alla risposta finale necessaria per navigare.",
        "hint": "Segui la catena di comando: dal punto radice fino al server che possiede effettivamente la chiave del dominio.",
        "explanation": "Il DNS è uno dei protocolli più critici e vulnerabili della rete. Manipolare le risposte DNS è uno dei modi più efficaci per reindirizzare gli utenti su siti falsi per rubare password o dati."
    },
    {
        "id": "09-ports",
        "brief": "Imparerai a identificare quali programmi sono in ascolto su un computer remoto analizzando le sue porte. Il port scanning è l'equivalente digitale del controllare se porte e finestre di una casa sono chiuse a chiave.",
        "details": "Ogni computer può offrire molti servizi diversi contemporaneamente: un sito web, la posta elettronica, il controllo remoto. Per non confonderli, ognuno usa una \"porta\" numerica specifica: la 80 per il web non criptato, la 443 per quello sicuro, la 22 per l'accesso tecnico.\n\nUn hacker, o un amministratore di sistema, esegue un \"port scan\" per vedere quali di questi ingressi sono aperti. Se una porta risponde, significa che c'è un programma pronto a ricevere dati, il che rappresenta una potenziale opportunità o un rischio.\n\nEsegui una scansione sugli host della rete simulata e prova a capire quali servizi stanno offrendo. Riuscirai a distinguere tra un server web, un database e un computer che ha tutte le porte sbarrate da un firewall?",
        "hint": "Una porta aperta risponde con un invito (SYN/ACK), una chiusa ti respinge (RST) e una filtrata ti ignora completamente.",
        "explanation": "La mappatura delle porte è la prima fase dell'enumerazione in un attacco informatico. Ridurre al minimo le porte aperte è la regola numero uno della sicurezza per limitare la superficie d'attacco."
    },
    {
        "id": "10-quiz",
        "brief": "Mettiti alla prova con una serie di domande per confermare di aver compreso i pilastri del networking. Superare questo quiz dimostra che sei pronto per affrontare le sfide di cybersecurity più avanzate.",
        "details": "Hai esplorato come i dati vengono indirizzati, smistati, tradotti e protetti attraverso l'intera infrastruttura di rete. Questo quiz riassume tutti i concetti chiave, dal livello fisico dei MAC address fino alla risoluzione dei nomi tramite DNS.\n\nNon aver paura di sbagliare: l'errore è parte del processo di apprendimento. Se una domanda ti sembra difficile, torna indietro e ripassa la simulazione corrispondente per rinfrescare la memoria sui dettagli tecnici.\n\nRispondi alle dieci domande a scelta multipla per completare ufficialmente il modulo. Ogni risposta corretta ti avvicina alla padronanza delle reti, competenza indispensabile per ogni professionista della sicurezza informatica.",
        "hint": "Pensa al percorso di un dato: parte come IP, diventa MAC, attraversa switch e router, viene tradotto dal NAT e risolto dal DNS.",
        "explanation": "I fondamentali di rete sono le fondamenta su cui si costruisce tutta la sicurezza informatica. Senza una comprensione solida di come i pacchetti si muovono, è impossibile capire come difenderli o come attaccarli."
    }
]

def escape_ts(text):
    return text.replace('"', '\\"').replace('\n', '\\n')

for task in tasks_data:
    # Find the task block
    pattern = rf'id: "{task["id"]}",.*?Simulation:'
    
    # We need to replace brief, details, hint, explanation within this block
    # However, to be safer and not mess with nested structures, we'll search for the fields specifically within the task block
    
    task_id = task['id']
    brief = escape_ts(task['brief'])
    details = escape_ts(task['details'])
    hint = escape_ts(task['hint'])
    explanation = escape_ts(task['explanation'])
    
    # Regex to find the task starting with the id
    task_regex = re.compile(rf'(id: "{task_id}",\s*title: ".*?",\s*goal: ".*?",\s*)brief: ".*?",\s*details: ".*?",\s*hint: ".*?",\s*explanation: ".*?",', re.DOTALL)
    
    replacement = rf'\1brief: "{brief}",\n      details: "{details}",\n      hint: "{hint}",\n      explanation: "{explanation}",'
    
    content = task_regex.sub(replacement, content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
