import type { Scenario } from "../types";
import Task01WhatIs from "./tasks/Task01WhatIs";
import Task02Linpeas from "./tasks/Task02Linpeas";
import Task03Sudo from "./tasks/Task03Sudo";
import Task04Suid from "./tasks/Task04Suid";
import Task05PathHijack from "./tasks/Task05PathHijack";
import Task06Cron from "./tasks/Task06Cron";
import Task07Capabilities from "./tasks/Task07Capabilities";
import Task08Kernel from "./tasks/Task08Kernel";
import Task09Lab from "./tasks/Task09Lab";
import Task10Quiz from "./tasks/Task10Quiz";

export const linuxPrivescScenario: Scenario = {
  id: "linux-privesc",
  slug: "linux-privesc",
  title: "Privilege Escalation su Linux",
  subtitle: "Da utente qualunque a root, senza magia",
  intro:
    "Entrare in un sistema Linux come utente normale è solo metà del lavoro: la parte interessante è capire come diventare root. In questo scenario impari le sei vie classiche della privilege escalation su Linux — sudo mal configurato, binari SUID, PATH manipolabile, cron job scrivibili, capabilities pericolose ed exploit del kernel — con una simulazione visuale per ognuna. Non serve saper già hackerare: ogni tecnica è raccontata dal basso, con esempi concreti e un piccolo laboratorio interattivo.",
  highlights: [
    "Sei tecniche di escalation, ognuna con una simulazione visuale diversa: terminali, drag & drop, orologi, matching.",
    "Un finto linpeas colorato che evidenzia i risultati sospetti, come nella vita reale.",
    "Un laboratorio finale a bivi in cui scegli tu la strada per arrivare a root.",
  ],
  category: "Metodologia Pentest",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-cose",
      title: "Cos'è la privilege escalation",
      goal: "Distinguere quando un'azione è escalation e quando è qualcos'altro",
      brief:
        "La privilege escalation è passare da un livello di privilegio basso a uno più alto sulla stessa macchina. Non è entrare da fuori, non è spostarsi verso altre macchine: è salire dentro.",
      details:"Immagina di essere entrato in un palazzo come ospite: hai una tessera che ti apre solo la hall. La **privilege escalation** è il momento in cui, restando dentro lo stesso palazzo, trovi un modo di far diventare la tua tessera una chiave maestra. Su **Linux** la chiave maestra si chiama **root**: l'utente che può leggere, scrivere ed eseguire qualsiasi cosa.\\n\\nSi distingue tra escalation «orizzontale» e «verticale». L'orizzontale passa da un utente normale a un altro utente normale, magari per raggiungere file o processi che l'altro possiede. La verticale è quella che conta di più: da un utente qualsiasi fino a **root**. Entrambe avvengono sullo stesso computer, non da fuori.\\n\\nPer riconoscere la **privesc** fai due domande: sono già dentro il sistema? Sto cercando di salire di livello, non di spostarmi? Se la risposta è sì, sei nel campo della **privilege escalation**. Se stai ancora cercando di entrare dall'esterno, è **exploitation**. Se stai saltando da una macchina all'altra, è **movimento laterale**.",
      hint: "Chiediti: sono già dentro? Sto salendo di privilegi sullo stesso sistema?",
      explanation: "Sai riconoscere quando un'azione è privilege escalation e quando appartiene a un'altra fase.",
      Simulation: Task01WhatIs,
    },
    {
      id: "02-linpeas",
      title: "Enumerare con linpeas",
      goal: "Leggere un output di enumerazione locale e individuare le anomalie",
      brief:
        "Prima di tentare qualsiasi scalata si enumera. linpeas è lo script più famoso: raccoglie centinaia di informazioni sul sistema e colora in rosso/giallo ciò che merita attenzione.",
      details:"Prima di salire, devi sapere dove mettere i piedi. L'**enumerazione** locale è la fase in cui raccogli tutte le informazioni utili sul sistema: chi sei, cosa puoi eseguire, quali binari hanno privilegi speciali, quali processi girano, quali file sono scrivibili, qual è la versione del **kernel**. A mano richiederebbe ore. **linpeas** fa questo lavoro in automatico.\\n\\nIl suo output usa i colori come un semaforo. Il rosso indica una via di **privilege escalation** molto probabile: un **sudo** senza password su un binario pericoloso, un **SUID** custom, un **kernel** vecchio, uno script di **root** scrivibile. Il giallo è un sospetto che va approfondito. Il grigio è solo contesto, utile per capire la macchina ma non direttamente sfruttabile.\\n\\nLa vera abilità non è lanciare lo script, ma imparare a filtrare il rumore. Nella simulazione vedrai un output tipico. Il tuo compito è cliccare solo le tre righe che rappresentano vere opportunità di scalata, ignorando tutto il resto.",
      hint: "Guarda ciò che è colorato in rosso o giallo: sudo NOPASSWD anomalo, SUID non standard, kernel vecchio.",
      explanation: "Sai leggere l'output di uno script di enumerazione e individuare i tre-quattro punti su cui investigare.",
      Simulation: Task02Linpeas,
    },
    {
      id: "03-sudo",
      title: "Sudo mal configurato",
      goal: "Riconoscere quali comandi sudo permettono davvero di diventare root",
      brief:
        "«sudo -l» dice cosa puoi lanciare come root senza password. Alcuni comandi innocui in apparenza (find, vim, less, awk) ti danno una shell root in una riga. Altri no.",
      details:"Quando un amministratore configura male **sudo**, può trasformare un **comando** innocuo in una porta diretta per **root**. Il comando «sudo -l» elenca tutto ciò che l'utente corrente può eseguire come root, spesso senza nemmeno digitare password. La maggior parte di questi comandi è pensata per compiti limitati: leggere un log, cercare un file, modificare un messaggio del giorno. Ma alcuni nascondono funzioni molto più potenti.\\n\\n**GTFOBins** è un sito di riferimento che raccoglie queste scorciatoie. Per esempio, find ha l'**opzione** -exec che esegue un altro **comando**. Se puoi lanciare **sudo** find, puoi anche lanciare sudo find . -exec `/bin/sh` \\\\; -quit: find girerà come **root** e ti aprirà una shell come root. Lo stesso vale per vim, less, awk e molti altri: hanno tutti un modo per lanciare comandi esterni.\n\nIn questo task vedrai sei comandi autorizzati via **sudo**. Devi decidere, per ciascuno, se permette davvero di diventare **root** oppure no. La differenza sta sempre nella stessa domanda: questo comando può eseguire altri comandi o aprire una shell?",
      hint: "I comandi con «esci in shell» (find -exec, vim :!sh, less !sh, awk 'BEGIN{system(...)}') sono sempre pericolosi.",
      explanation: "Sai quali binari, se autorizzati via sudo, diventano una scorciatoia verso root.",
      Simulation: Task03Sudo,
    },
    {
      id: "04-suid",
      title: "Caccia ai binari SUID",
      goal: "Cercare i SUID sul sistema e distinguere i normali dai sospetti",
      brief:
        "Un binario con il bit SUID di root gira come root anche se lanciato da te. È una feature legittima (passwd, sudo, su la usano), ma diventa un problema quando è impostata su un programma sbagliato.",
      details:"Il bit **SUID** è un permesso speciale che dice al sistema: quando qualcuno esegue questo file, fallo girare con i privilegi del proprietario, non di chi lo lancia. I binari di sistema come passwd, **sudo** e su lo usano legittimamente: passwd deve poter scrivere in `/etc/shadow`, che gli utenti normali non possono toccare, quindi gira momentaneamente come **root**. È un meccanismo normale e necessario.\n\nIl problema nasce quando il bit **SUID** viene applicato a programmi creati dagli amministratori, magari per automatizzare qualche compito, senza una sicurezza adeguata. Un binario SUID di **root** che legge file, esegue comandi o apre shell è una scalata pronta all'uso.\n\nPer trovarli si usa il comando find / -perm -4000 -type f 2>/dev/null. L'output include sempre i soliti noti di sistema. La chiave è riconoscere l'intruso: un percorso in `/usr/local/bin`, /opt, /home o altre cartelle non standard che non troveresti mai su una **Linux** appena installata. Nella simulazione dovrai lanciare il comando e cliccare il binario anomalo.",
      hint: "Digita esattamente: find / -perm -4000 -type f 2>/dev/null",
      explanation: "Sai enumerare i SUID e riconoscere il binario anomalo in mezzo a quelli legittimi.",
      Simulation: Task04Suid,
    },
    {
      id: "05-path",
      title: "PATH hijacking",
      goal: "Sfruttare una directory scrivibile nel PATH per farsi eseguire da un binario privilegiato",
      brief:
        "Se un programma che gira come root chiama un altro comando senza specificarne il percorso completo (per esempio «ls» invece di «/bin/ls»), Linux lo cerca nelle cartelle del PATH nell'ordine. Se ce n'è una scrivibile prima di /bin, puoi mettere lì un «ls» fatto da te.",
      details:"Il **PATH** è l'elenco delle cartelle in cui la **shell** cerca i comandi quando non gli dai il percorso completo. Se scrivi ls, la shell non sa automaticamente che intendi `/bin/ls`: legge il PATH da sinistra a destra e usa il primo eseguibile con quel nome che trova. Questo comportamento è comodissimo, ma diventa pericoloso quando una cartella scrivibile compare prima delle cartelle di sistema.\n\nPensa a uno script che gira come **root** e contiene la riga ls -la senza specificare `/bin/ls.` Se il **PATH** inizia con /tmp e tu hai creato `/tmp/ls`, lo script eseguirà il tuo file con i privilegi di root. Se il tuo file contiene #!`/bin/bash`, hai appena ottenuto una shell root.\n\nL'attacco si chiama **PATH** hijacking: dirotti il percorso di ricerca dei comandi. Funziona solo se tre condizioni si uniscono: una cartella scrivibile nel PATH, un programma privilegiato che chiama comandi senza path assoluto, e la possibilità di creare un file falso con il nome giusto. Nella simulazione dovrai comporre i quattro passi nell'ordine corretto.",
      hint: "Ordine: crea il fake ls in /tmp → rendilo eseguibile → aggiungi /tmp in cima al PATH → lancia lo script SUID.",
      explanation: "Hai capito come una singola cartella scrivibile nel PATH possa ribaltare i privilegi.",
      Simulation: Task05PathHijack,
    },
    {
      id: "06-cron",
      title: "Cron job scrivibile",
      goal: "Iniettare un payload in uno script schedulato che gira come root",
      brief:
        "Cron è lo scheduler di Linux. Se un job di root richiama uno script che tu puoi modificare, ti basta aggiungere una riga: al prossimo giro, quella riga verrà eseguita come root.",
      details:"**Cron** è lo schedulatore di **Linux**: un demone che legge una tabella di comandi e li esegue a intervalli regolari. Gli amministratori lo usano per backup, pulizia log, aggiornamenti automatici. Il problema nasce quando uno script eseguito da **root** può essere modificato da utenti comuni.\\n\\nImmagina questa riga in `/etc/crontab`: */1 * * * * **root** `/opt/`backup.sh`.` Dice a **cron** di eseguire `/opt/`backup.sh`` ogni minuto come root. Se i permessi di quel file sono -rwxrwxrwx, chiunque può scriverci. Tu, come utente alex, puoi aprirlo con un editor, aggiungere una riga malevola e salvare. Al prossimo minuto cron eseguirà il file come root, eseguendo anche la tua riga con privilegi massimi.\n\nIl **payload** più classico è chmod +s `/bin/bash.` Questo comando aggiunge il bit **SUID** a `/bin/bash`, che è già un binario di sistema. Dopo il tick del **cron**, basterà lanciare `/bin/bash` -p per avere una shell **root**. Nella simulazione vedrai un orologio animato e dovrai scegliere la riga giusta da aggiungere allo script.",
      hint: "Il payload classico apre una reverse shell o crea un binario SUID. Qui basta: chmod +s /bin/bash",
      explanation: "Sai come uno script schedulato scrivibile diventi una privesc automatica.",
      Simulation: Task06Cron,
    },
    {
      id: "07-caps",
      title: "Capabilities pericolose",
      goal: "Riconoscere le capabilities Linux che permettono di diventare root",
      brief:
        "Le capabilities sono privilegi granulari: invece di dare tutto (SUID) danno pezzi. Alcune, però, sono equivalenti a dare tutto: cap_setuid, cap_sys_admin, cap_dac_read_search.",
      details:"Le **capabilities** sono un modo moderno di assegnare privilegi parziali a un programma, senza dargli tutto come fa il bit **SUID**. Invece di dire «gira come **root**», si dice «gira come utente normale, ma ha il permesso di fare questa cosa specifica». È un meccanismo più sicuro in teoria, ma alcune capabilities sono così potenti da essere praticamente equivalenti a root.\\n\\nLa più famosa è **cap_setuid**: permette al programma di cambiare il proprio user ID a qualsiasi valore, compreso 0. Se trovi `/usr/bin/python3` con cap_setuid+ep, puoi eseguire python3 -c 'import os; os.setuid(0); os.**system**(\"`/bin/sh`\")' e ottenere una shell **root**. Lo stesso vale per perl, ruby, node o qualsiasi interprete. Altre **capabilities** pericolose sono **cap_sys_admin**, **cap_dac_read_search** e **cap_dac_override**.\n\nIl comando per trovarle è getcap -r / 2>/dev/null. L'opzione -r cerca ricorsivamente; 2>/dev/null nasconde i messaggi di errore per cartelle non accessibili. Nella lista che ottieni, la maggior parte delle voci è legittima: ping ha **cap_net_raw** per inviare pacchetti ICMP, **tcpdump** ha **cap_net_admin**. Il tuo compito è individuare le voci anomale su interpreti o editor.",
      hint: "Cerca cap_setuid su interpreti (python, perl, ruby, node) o editor (vim, nano). Quelle sono le vere miniere.",
      explanation: "Sai leggere l'output di getcap e riconoscere le capabilities equivalenti a root.",
      Simulation: Task07Capabilities,
    },
    {
      id: "08-kernel",
      title: "Exploit del kernel",
      goal: "Abbinare la versione del kernel al giusto exploit locale",
      brief:
        "Se nulla dell'ambiente è sfruttabile, resta il kernel stesso. Un kernel vecchio ha vulnerabilità note (Dirty COW, DirtyPipe, Overlayfs) con exploit pubblici che elevano l'utente a root.",
      details:"Quando tutte le vie «pulite» falliscono — **sudo**, **SUID**, **PATH**, **cron**, **capabilities** — resta ancora una possibilità: il **kernel** stesso. Il kernel è il cuore del sistema operativo e, se ha una **vulnerabilità** nota, esistono **exploit** pubblici che permettono a un utente normale di diventare **root**. Questa strada si chiama kernel exploit o local **privilege escalation** via kernel bug.\\n\\nIl primo passo è sempre controllare la versione con uname -r. Poi si confronta la versione con le **vulnerabilità** note. Dirty COW (`CVE-2016-5195`) colpisce **kernel** dalla 2.6.22 alla 4.8 circa. OverlayFS (`CVE-2015-1328`) colpisce Ubuntu 14.04 con kernel 3.13. DirtyPipe (`CVE-2022-0847`) colpisce kernel dalla 5.8 alla 5.16. Ogni **exploit** ha una finestra di versione precisa.\n\nÈ importante capire che il **kernel** **exploit** è l'ultima carta, non la prima. Può essere instabile, può mandare in crash la macchina, può lasciare tracce evidenti. Un buon **pentester** lo prova solo dopo aver esaurito le altre strade. Nella simulazione dovrai abbinare ogni versione del kernel all'exploit corretto.",
      hint: "Dirty COW → kernel 2.6.x/3.x/4.4. DirtyPipe → 5.8+. Overlayfs → 3.13. PwnKit → non è kernel, è pkexec.",
      explanation: "Sai che l'exploit del kernel è l'ultima carta, non la prima, e che va scelto in base a uname -r.",
      Simulation: Task08Kernel,
    },
    {
      id: "09-lab",
      title: "Laboratorio: la tua scalata",
      goal: "Portare un utente qualunque fino a root scegliendo tu la strada",
      brief:
        "Sei su una nuova macchina come utente «alex». Enumeri, trovi tre indizi diversi e scegli quale sfruttare. Ogni strada porta a root, ma con costi diversi.",
      details:"Sei entrato come utente alex sulla macchina lab01. Hai fatto un'**enumerazione** veloce e hai trovato tre indizi diversi, tutti promettenti. Ora devi scegliere quale strada percorrere. Questa è una situazione tipica del lavoro reale: non c'è una sola risposta giusta, ma ci sono scelte più o meno rapide, più o meno silenziose, più o meno stabili.\\n\\nLa prima strada passa da **sudo**: puoi lanciare sudo less `/etc/hosts.` less ha un comando interno !sh che apre una shell. Poiché less gira come **root**, anche la shell sarà root. La seconda strada passa da un **SUID** custom: `/usr/local/bin/reader` ha un'opzione --exec che esegue un comando a scelta, e gira come root. La terza strada passa dalle **capabilities**: python3 ha **cap_setuid** e può cambiare il proprio uid a 0.\n\nOgni via porta allo stesso risultato, ma con differenze pratiche. **sudo** lascia una traccia in `/var/log/`auth.log`.` Il **SUID** custom potrebbe non essere monitorato. python3 con **cap_setuid** è spesso la più silenziosa. Nella simulazione puoi aprire ogni scheda e vedere i comandi passo dopo passo.",
      hint: "Non c'è una risposta unica: ogni scelta è didatticamente valida. Prova ad aprirle tutte per confrontarle.",
      explanation: "Hai portato a termine una scalata completa scegliendo la tecnica più adatta agli indizi.",
      Simulation: Task09Lab,
    },
    {
      id: "10-quiz",
      title: "Verifica finale",
      goal: "Consolidare tutte le tecniche di privilege escalation su Linux",
      brief:
        "Dieci domande sui concetti chiave: sudo, SUID, PATH, cron, capabilities, kernel. Bastano sette risposte corrette.",
      details:"Il quiz finale serve a consolidare ciò che hai imparato attraverso le simulazioni. Non si tratta di memorizzare definizioni a memoria, ma di riconoscere i meccanismi: quando un **comando** **sudo** è pericoloso, quando un binario **SUID** è sospetto, quando un **cron** job è sfruttabile, quando una capability equivale a **root**.\\n\\nNella vita reale, un buon **pentester** non ricita formule: guarda l'output di uname -r, **sudo** -l, find **SUID**, getcap e **crontab**, e in pochi minuti sa dire quali sono le vie più probabili. Se una domanda ti sembra difficile, torna indietro al task corrispondente e rileggi la spiegazione. Bastano sette risposte corrette su dieci per completare lo scenario.",
      hint: "Le risposte più prudenti e metodologicamente corrette sono di solito quelle giuste.",
      explanation: "Hai completato lo scenario Privilege Escalation su Linux.",
      Simulation: Task10Quiz,
    },
  ],
};
