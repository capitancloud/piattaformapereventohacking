import type { Scenario } from "../types";
import Task01WhatIs from "./tasks/Task01WhatIs";
import Task02Strength from "./tasks/Task02Strength";
import Task03Hashes from "./tasks/Task03Hashes";
import Task04Dictionary from "./tasks/Task04Dictionary";
import Task05BruteForce from "./tasks/Task05BruteForce";
import Task06Hydra from "./tasks/Task06Hydra";
import Task07Hashcat from "./tasks/Task07Hashcat";
import Task08RainbowSalt from "./tasks/Task08RainbowSalt";
import Task09Spraying from "./tasks/Task09Spraying";
import Task10Quiz from "./tasks/Task10Quiz";

export const passwordAttacksScenario: Scenario = {
  id: "password-attacks",
  slug: "password-attacks",
  title: "Attacchi alle Password",
  subtitle: "Come vengono indovinate, decifrate e riusate le password nel mondo reale",
  intro:
    "Le password sono ancora il gradino più basso e più fragile della sicurezza. In questo scenario impari le famiglie di attacchi che le riguardano: dagli attacchi online, che bussano al servizio, a quelli offline, che lavorano sugli hash rubati; dai dizionari mirati al credential stuffing di massa. Ogni micro-task è visuale, senza formule matematiche complicate, e ti fa capire perché una password lunga e unica batte una password «furba» ma corta.",
  highlights: [
    "Dieci laboratori interattivi, ognuno con una meccanica visiva diversa.",
    "Simulazioni di hydra, hashcat, calcolo tempi di brute force, password spraying.",
    "Riconoscimento degli hash, dei sali e delle contromisure moderne.",
  ],
  category: "Metodologia Pentest",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-cose",
      title: "Cos'è un attacco alle password",
      goal: "Distinguere le grandi famiglie di attacchi (online, offline, riuso)",
      brief:
        "Non tutti gli attacchi alle password sono uguali. Alcuni parlano direttamente con il servizio (online), altri lavorano su un file rubato di hash (offline), altri sfruttano password già trapelate da altri siti (riuso).",
      details: `Quando si parla di «attacco alle password» molte persone immaginano un unico scenario: qualcuno che prova migliaia di parole finché una funziona. In realtà esistono famiglie molto diverse tra loro, e capire a quale famiglia appartiene un attacco è il primo passo per difendersi bene.\n\nLa prima famiglia è l'attacco online. L'attaccante prova le password direttamente contro il servizio, per esempio un login ****SSH****, un pannello web o un endpoint di API. È lento, perché ogni tentativo passa per la rete e il servizio può rallentarlo con blocchi, captcha o limiti di tentativi. In compenso non serve rubare nulla: basta che il servizio sia esposto.\n\nLa seconda famiglia è l'attacco offline. Qui l'attaccante ha già in mano un file di ****hash****: per esempio un dump del database di un sito o del file `/etc/shadow.` Non deve più parlare con il servizio: può provare miliardi di password al secondo sulla propria GPU, senza che nessuno se ne accorga. È molto più pericoloso, ma richiede un furto iniziale.

La terza famiglia è il riuso di credenziali. L'attaccante non «indovina» nulla: usa password che sono già trapelate da altri siti (grazie a data breach passati) e le prova contro nuovi servizi. Funziona solo perché la maggior parte delle persone usa la stessa password in più posti. Nella simulazione dovrai etichettare correttamente sei scenari.`,
      hint: "Chiediti: chi parla con chi? Se l'attaccante bussa al servizio è online. Se lavora su un file già rubato è offline. Se riusa password trapelate è credenziali riusate.",
      explanation: "Sai distinguere le tre grandi famiglie di attacchi alle password.",
      Simulation: Task01WhatIs,
    },
    {
      id: "02-forza",
      title: "Perché una password è debole",
      goal: "Riconoscere gli elementi che rendono una password fragile",
      brief:
        "Una password non è debole solo se è «123456». È debole ogni volta che contiene informazioni prevedibili, parole di dizionario o schemi comuni. Prova diverse password e osserva cosa cambia.",
      details: `La forza di una password non dipende solo dalla lunghezza o dai «caratteri speciali». Dipende soprattutto da quanto è prevedibile per chi la deve indovinare. Una password come Estate2024! sembra complessa: ha maiuscole, numeri e simboli. Ma un attaccante che sa che sei italiano proverà mesi, anni e il punto esclamativo tra le prime combinazioni. In pratica è quasi come scrivere «12345».\n\nGli elementi che rendono una password debole sono sempre gli stessi: parole di ****dizionario**** in qualunque lingua, nomi propri, date di nascita, nomi di città o di squadre, schemi di tastiera come qwerty o asdf, sostituzioni prevedibili come «a → @» oppure «o → 0», ripetizioni come «aaaa» o «1111», e la lunghezza inferiore a 12 caratteri.\n\nAl contrario, una password diventa forte quando è lunga (almeno 15-20 caratteri) e non contiene sequenze prevedibili. Le passphrase composte da tre o quattro parole scelte a caso (per esempio «gatto viola scarpa tuono») sono facili da ricordare e molto difficili da indovinare. Meglio ancora se generate da un password manager.\n\nNella simulazione hai un campo dove digitare password diverse. La barra ti dice il livello di forza e ti spiega quali elementi la stanno abbassando o alzando. Prova a inserirne cinque e osserva come cambiano i motivi.`,
      hint: "Scrivi «Password123!», «Estate2024!», poi «gatto viola scarpa tuono» e leggi i motivi.",
      explanation: "Sai riconoscere gli elementi che rendono una password prevedibile.",
      Simulation: Task02Strength,
    },
    {
      id: "03-hash",
      title: "Riconoscere gli hash",
      goal: "Distinguere i formati di hash più comuni",
      brief:
        "I sistemi non salvano le password in chiaro (o non dovrebbero): salvano hash. Ogni algoritmo produce hash con lunghezza e forma diverse. Riconoscerli è il primo passo per craccarli.",
      details: `Un ****hash**** è una trasformazione a senso unico: partendo da una password produce una stringa apparentemente casuale, e da quella stringa non si può tornare indietro alla password originale. I servizi salvano l'hash: quando ti colleghi, calcolano l'hash della password che scrivi e lo confrontano con quello memorizzato.\n\nEsistono molti algoritmi di ****hash****, e riconoscerli è fondamentale per capire come attaccarli. MD5 è vecchio e considerato rotto: produce hash di 32 caratteri esadecimali, per esempio 5f4dcc3b5aa765d61d8327deb882cf99. SHA1 è ancora peggio ed è stato dismesso: 40 caratteri. SHA256 è ancora usato per firme e certificati, 64 caratteri.\n\nNel mondo ****Windows**** si trova spesso NTLM, che è essenzialmente MD4 di UTF-16 della password: 32 caratteri esadecimali, indistinguibile a occhio da MD5, ma con un contesto d'uso preciso (dump di SAM, ****hashdump**** di ****Meterpreter****).\n\nPer proteggere le password, i sistemi moderni usano ****hash**** lenti pensati apposta: bcrypt (inizia con $2a$, $2b$ o $2y$), scrypt e argon2 (iniziano con $argon2). Sono lenti di proposito: aggiungono un ****salt**** casuale e ripetono il calcolo migliaia di volte, così anche una GPU può provare solo poche migliaia di password al secondo invece di miliardi.\n\nNella simulazione vedrai sei ****hash**** reali. Il tuo compito è associare ciascuno al nome corretto dell'algoritmo.`,
      hint: "Guarda la lunghezza e il prefisso: 32 hex = MD5/NTLM, 40 = SHA1, 64 = SHA256, $2y$ = bcrypt, $argon2 = argon2.",
      explanation: "Sai riconoscere a colpo d'occhio la famiglia dell'hash.",
      Simulation: Task03Hashes,
    },
    {
      id: "04-dizionario",
      title: "Attacco a dizionario",
      goal: "Vedere come una wordlist ordinata batte il brute force cieco",
      brief:
        "Un attacco a dizionario prova password prese da una lista, tipicamente ordinata per popolarità. La lista rockyou.txt contiene 14 milioni di password vere trapelate: la stragrande maggioranza degli account cade con le prime centomila.",
      details: `Il ****brute force**** «cieco» prova ogni combinazione di caratteri possibile: aaaa, aaab, aaac, e così via. Sembra invincibile ma è lentissimo, perché il numero di combinazioni cresce in modo esponenziale con la lunghezza.\n\nIl ****dizionario**** è molto più intelligente: usa una lista di password reali, ordinata per frequenza. La lista più famosa si chiama `rockyou.txt` e contiene 14 milioni di password prese da un data breach del 2009. In cima ci sono le password che tutti usano davvero: 123456, password, iloveyou, 111111, qwerty. Provandole in ordine, buona parte degli account cade prima ancora di arrivare alla decima riga.

Un attacco a **dizionario** diventa ancora più efficace con le regole di mutazione: prendi ogni parola della lista e applichi trasformazioni (aggiungi un anno, un punto esclamativo, cambia le lettere in numeri). Strumenti come **hashcat** e **john** hanno linguaggi di regole per farlo in automatico. Con una GPU moderna e una wordlist di 14 milioni di parole si possono provare miliardi di varianti in pochi minuti.

Nella simulazione vedrai una wordlist ordinata scorrere in tempo reale contro un **hash** bersaglio. Puoi cambiare l'ordine e vedere quando la password viene trovata. Poi puoi provare a scegliere una password migliore per lo stesso account e vedere quanti tentativi servono.`,
      hint: "L'ordine conta: se metti la password comune in fondo, ci mette di più.",
      explanation: "Hai capito perché il dizionario è più efficiente del brute force cieco.",
      Simulation: Task04Dictionary,
    },
    {
      id: "05-bruteforce",
      title: "Quanto ci mette il brute force",
      goal: "Stimare visivamente il tempo di crack in base a lunghezza e alfabeto",
      brief:
        "Il tempo di brute force dipende da tre cose: numero di caratteri diversi nell'alfabeto, lunghezza della password e velocità del cracker. Muovi gli slider e osserva l'esplosione.",
      details: `Il tempo di un ****brute force**** cieco dipende da tre fattori. Il primo è la dimensione dell'alfabeto: se usi solo cifre l'alfabeto è 10, solo lettere minuscole 26, minuscole+maiuscole 52, tutto 95. Il secondo è la lunghezza della password. Il terzo è la velocità del cracker, che sui moderni sistemi con GPU può andare da pochi milioni a molti miliardi di tentativi al secondo, a seconda dell'algoritmo di ****hash****.\n\nIl numero di combinazioni è alfabeto elevato alla lunghezza. Sembra un dettaglio matematico, ma è la cosa più importante: aggiungere un solo carattere a una password non raddoppia il tempo, lo moltiplica per la dimensione dell'alfabeto. Una password di 8 caratteri minuscoli ha circa 200 miliardi di combinazioni, che una GPU potente prova in pochi minuti. Portala a 12 caratteri e diventano più di 90 milioni di miliardi: anche una GPU potente ci mette anni.\n\nEcco perché la lunghezza batte la complessità: aggiungere un carattere in fondo è più efficace che sostituire una lettera con un simbolo. Nella simulazione puoi muovere due slider (lunghezza e alfabeto) e vedere il tempo stimato passare da secondi a millenni. Dopo aver esplorato, dovrai scegliere la password che il ****brute force**** impiega più tempo a violare.`,
      hint: "Prova prima con lunghezza 6 e alfabeto 10. Poi porta la lunghezza a 16 e guarda cosa succede.",
      explanation: "Vedi con i tuoi occhi perché lunghezza > complessità.",
      Simulation: Task05BruteForce,
    },
    {
      id: "06-hydra",
      title: "Attacco online con hydra",
      goal: "Comporre e leggere un attacco online contro un servizio",
      brief:
        "hydra è lo strumento classico per attacchi online: dà una lista di utenti e una lista di password, e prova ogni combinazione contro il servizio scelto (SSH, FTP, HTTP, RDP, tanti altri).",
      details: `****hydra**** è uno strumento a riga di **comando** che automatizza gli attacchi online: prova rapidamente coppie utente/password contro un servizio autenticato. Supporta decine di protocolli: ****SSH****, ****FTP****, ****HTTP**** form, RDP, SMB, MySQL, PostgreSQL e altri. È il cavallo di battaglia dei test di autenticazione.\n\nLa struttura del **comando** è quasi sempre la stessa. Si indica l'utente (-l per uno singolo, -L per una lista), la password (-p per una singola, -P per una wordlist), il numero di thread paralleli con -t, poi il protocollo e l'IP del bersaglio. Un esempio tipico: ****hydra**** -l admin -P `rockyou.txt` **ssh**://`10.10.10.5` -t 4. Il -t basso serve a non stressare il servizio e a evitare blocchi.

**hydra** è utile solo se il servizio non ha protezioni contro il **brute force**. I sistemi moderni bloccano dopo pochi tentativi falliti, aggiungono captcha o rate limit, chiedono un secondo fattore. Contro un servizio ben difeso hydra si ferma quasi subito. Contro un vecchio **SSH** aperto su internet senza fail2ban, invece, è ancora efficacissimo.

Nella simulazione dovrai costruire il comando **hydra** scegliendo i frammenti nell'ordine giusto e poi lanciarlo contro un finto **SSH**: vedrai i tentativi scorrere in tempo reale, con qualche errore di connessione e infine il match.`,
      hint: "Ordine tipico: hydra, -l utente, -P wordlist, -t thread, protocollo://ip.",
      explanation: "Sai comporre e leggere un attacco online reale.",
      Simulation: Task06Hydra,
    },
    {
      id: "07-hashcat",
      title: "Attacco offline con hashcat",
      goal: "Craccare un hash con la modalità e la wordlist giuste",
      brief:
        "hashcat è il cracker offline più veloce al mondo, pensato per lavorare su GPU. Ogni algoritmo ha un numero di modalità (-m): sbagliare il numero significa non craccare nulla.",
      details: `****hashcat**** è il cracker offline più famoso e più veloce al mondo. Lavora su GPU e riesce a provare miliardi di password al secondo sugli algoritmi rapidi come MD5 o NTLM, e ancora decine di migliaia al secondo su quelli lenti come bcrypt. È lo strumento che i ****pentester**** lanciano non appena riescono a esfiltrare un file di ****hash****.\n\nIl **comando** base è ****hashcat**** -m modalità -a attacco file_hash wordlist. Il parametro -m dice a hashcat che algoritmo hai davanti: 0 è MD5, 100 è SHA1, 1000 è NTLM, 1400 è SHA256, 1800 è sha512crypt, 3200 è bcrypt. Sbagliare la modalità è l'errore più comune dei principianti: hashcat non protesta, prova soltanto e non trova nulla, perché sta calcolando l'****hash**** con l'algoritmo sbagliato.\n\nIl parametro -a sceglie il tipo di attacco: 0 è ****dizionario**** semplice (una wordlist contro gli ****hash****), 1 combina due wordlist, 3 è ****brute force**** con maschera, 6 è wordlist + maschera. Per iniziare si usa quasi sempre -a 0 con `rockyou.txt`.

Nella simulazione vedrai tre **hash** da craccare. Per ognuno devi scegliere la modalità corretta e cliccare «Esegui»: solo la combinazione giusta di modalità e wordlist restituirà la password in chiaro.`,
      hint: "MD5 = 0, NTLM = 1000, bcrypt = 3200. Sbagliare -m significa non trovare mai.",
      explanation: "Hai fatto girare hashcat con la modalità corretta e ottenuto la password.",
      Simulation: Task07Hashcat,
    },
    {
      id: "08-sale",
      title: "Rainbow table e il ruolo del sale",
      goal: "Capire perché il sale rende inutili le tabelle precomputate",
      brief:
        "Una rainbow table è un dizionario gigantesco di hash precalcolati: cerchi l'hash e trovi la password. Il sale, un valore casuale aggiunto alla password prima dell'hash, la rende inutile.",
      details: `Una ****rainbow table**** è un enorme ****dizionario**** di ****hash**** precalcolati: qualcuno, una volta sola, ha calcolato l'hash di miliardi di password e ha salvato le coppie password → hash. Da quel momento, chiunque abbia un hash può cercarlo nella tabella e leggere la password originale in un attimo, senza dover ricalcolare nulla. Contro MD5 e SHA1 delle password comuni, le rainbow table trovano risposta in millisecondi.\n\nIl ****sale**** (in inglese ****salt****) è il rimedio semplice ed efficace. Prima di calcolare l'****hash**** della password, il sistema genera un valore casuale unico per quell'utente (per esempio 16 byte casuali) e lo aggiunge alla password. L'hash che salva è di password+sale, non di password sola. Il sale non è segreto: viene salvato insieme all'hash.\n\nL'effetto è enorme. Anche se due utenti scelgono la stessa password, i loro ****hash**** saranno completamente diversi, perché il ****sale**** è diverso. Le ****rainbow table**** diventano inutili: l'attaccante non può precalcolare, perché non conosce in anticipo il sale. Deve craccare ogni hash da zero, uno per uno, e ricalcolare tutto per ogni sale.\n\nBcrypt, scrypt e argon2 aggiungono il ****sale**** automaticamente e usano funzioni lente. Sistemi vecchi come MD5 senza sale, invece, sono ancora vulnerabili. Nella simulazione userai un mini-motore di rainbow lookup: prima su ****hash**** senza sale (trovi subito), poi su hash con sale (non trovi nulla). Poi dovrai etichettare tre scenari come «rainbow ok» o «rainbow inutile».`,
      hint: "Senza sale la rainbow trova. Con sale non trova. Se due utenti hanno la stessa password ma sale diverso, gli hash sono diversi.",
      explanation: "Hai capito perché ogni sistema serio aggiunge un sale.",
      Simulation: Task08RainbowSalt,
    },
    {
      id: "09-spraying",
      title: "Credential stuffing e password spraying",
      goal: "Distinguere due attacchi di massa che sfruttano il riuso e la prevedibilità",
      brief:
        "Il credential stuffing riusa credenziali trapelate su nuovi siti. Il password spraying prova una sola password comune contro tantissimi account: così non fa scattare i blocchi per tentativi ripetuti.",
      details: `Il ****credential stuffing**** e il ****password spraying**** sono i due attacchi di massa più efficaci contro le grandi organizzazioni. Sfruttano abitudini umane note: il riuso delle password e la prevedibilità delle scelte.\n\nIl ****credential stuffing**** parte da un enorme elenco di coppie email/password già trapelate da vecchi data breach (ce ne sono miliardi in circolazione). L'attaccante non «indovina» nulla: prova quelle coppie contro siti nuovi. Se anche solo l'1% delle persone riusa la stessa password di quando si era iscritta a un forum del 2015, l'attaccante entra in migliaia di account. La difesa principale è avere una password diversa per ogni servizio e attivare l'MFA.\n\nIl ****password spraying**** è l'opposto simmetrico: invece di provare tante password su un solo account (cosa che fa scattare i blocchi), l'attaccante prova una singola password comune contro tanti account diversi. Per esempio: prende l'elenco di 5.000 utenti aziendali e prova a tutti la password Autunno2024! (poi Inverno2024!, poi Marzo2025). Ogni singolo account riceve un solo tentativo, quindi i blocchi non scattano. Basta che un utente su 5.000 abbia scelto quella password (e ne trovi sempre) per avere il primo accesso.\n\nNella simulazione vedrai due animazioni affiancate: il ****credential stuffing**** con la freccia che parte dai vecchi dump, e il ****password spraying**** con una singola password che colpisce molti account. Poi dovrai etichettare correttamente sei scenari.`,
      hint: "Tanti utenti + una password = spraying. Tante coppie riusate = stuffing.",
      explanation: "Sai distinguere e riconoscere i due attacchi di massa più diffusi oggi.",
      Simulation: Task09Spraying,
    },
    {
      id: "10-quiz",
      title: "Verifica finale",
      goal: "Consolidare i concetti chiave sugli attacchi alle password",
      brief:
        "Dieci domande semplici su online/offline, hash, dizionari, sale, spraying. Bastano sette risposte corrette.",
      details: `Il quiz conclusivo ti aiuta a fissare le idee principali dello scenario: la differenza tra attacco online e offline, il ruolo del ****sale****, perché la lunghezza batte la complessità, come si riconosce un ****hash****, cos'è il ****credential stuffing**** e cos'è il ****password spraying****, quando ha senso ****hydra**** e quando invece serve ****hashcat****.\n\nSe una domanda ti sembra difficile, torna al task corrispondente e rileggi le spiegazioni: sono state pensate per non lasciarti solo davanti alla parte tecnica. Bastano sette risposte corrette su dieci per completare lo scenario.`,
      hint: "Le risposte che valorizzano lunghezza, unicità e MFA sono quasi sempre quelle giuste.",
      explanation: "Hai completato lo scenario Attacchi alle Password.",
      Simulation: Task10Quiz,
    },
  ],
};
