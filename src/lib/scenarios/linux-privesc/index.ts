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
      details: `Immagina di essere entrato in un palazzo come ospite: hai una tessera che ti apre solo la hall. La privilege escalation è il momento in cui, restando dentro lo stesso palazzo, trovi un modo di far diventare la tua tessera una chiave maestra. Su Linux la chiave maestra si chiama root: l'utente che può leggere, scrivere ed eseguire qualsiasi cosa.

Si distingue tra escalation «orizzontale» e «verticale». L'orizzontale passa da un utente normale a un altro utente normale, magari per raggiungere file o processi che l'altro possiede. La verticale è quella che conta di più: da un utente qualsiasi fino a root. Entrambe avvengono sullo stesso computer, non da fuori.

Per riconoscere la privesc fai due domande: sono già dentro il sistema? Sto cercando di salire di livello, non di spostarmi? Se la risposta è sì, sei nel campo della privilege escalation. Se stai ancora cercando di entrare dall'esterno, è exploitation. Se stai saltando da una macchina all'altra, è movimento laterale.`,
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
      details: `Prima di salire, devi sapere dove mettere i piedi. L'enumerazione locale è la fase in cui raccogli tutte le informazioni utili sul sistema: chi sei, cosa puoi eseguire, quali binari hanno privilegi speciali, quali processi girano, quali file sono scrivibili, qual è la versione del kernel. A mano richiederebbe ore. linpeas fa questo lavoro in automatico.

Il suo output usa i colori come un semaforo. Il rosso indica una via di privilege escalation molto probabile: un sudo senza password su un binario pericoloso, un SUID custom, un kernel vecchio, uno script di root scrivibile. Il giallo è un sospetto che va approfondito. Il grigio è solo contesto, utile per capire la macchina ma non direttamente sfruttabile.

La vera abilità non è lanciare lo script, ma imparare a filtrare il rumore. Nella simulazione vedrai un output tipico. Il tuo compito è cliccare solo le tre righe che rappresentano vere opportunità di scalata, ignorando tutto il resto.`,
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
      details: `Il progetto GTFOBins raccoglie decine di binari «normali» che, se autorizzati via sudo, permettono di eseguire codice arbitrario come root. Il motivo è che quei comandi hanno funzioni interne (aprire una shell, eseguire un comando esterno, invocare un editor) che sudo non filtra: se puoi lanciare «sudo find», puoi anche fare «sudo find . -exec /bin/sh \\;».

Qui hai sei comandi che sudo ti permette di eseguire senza password. Per ciascuno scegli se ti porta a root oppure no.`,
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
      details: `Il bit SUID è un permesso speciale che dice al sistema: quando qualcuno esegue questo file, fallo girare con i privilegi del proprietario, non di chi lo lancia. I binari di sistema come passwd, sudo e su lo usano legittimamente: passwd deve poter scrivere in /etc/shadow, che gli utenti normali non possono toccare, quindi gira momentaneamente come root. È un meccanismo normale e necessario.

Il problema nasce quando il bit SUID viene applicato a programmi creati dagli amministratori, magari per automatizzare qualche compito, senza una sicurezza adeguata. Un binario SUID di root che legge file, esegue comandi o apre shell è una scalata pronta all'uso.

Per trovarli si usa il comando find / -perm -4000 -type f 2>/dev/null. L'output include sempre i soliti noti di sistema. La chiave è riconoscere l'intruso: un percorso in /usr/local/bin, /opt, /home o altre cartelle non standard che non troveresti mai su una Linux appena installata. Nella simulazione dovrai lanciare il comando e cliccare il binario anomalo.`,
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
      details: `Il PATH è l'elenco delle cartelle in cui la shell cerca i comandi quando non gli dai il percorso completo. Se scrivi ls, la shell non sa automaticamente che intendi /bin/ls: legge il PATH da sinistra a destra e usa il primo eseguibile con quel nome che trova. Questo comportamento è comodissimo, ma diventa pericoloso quando una cartella scrivibile compare prima delle cartelle di sistema.

Pensa a uno script che gira come root e contiene la riga ls -la senza specificare /bin/ls. Se il PATH inizia con /tmp e tu hai creato /tmp/ls, lo script eseguirà il tuo file con i privilegi di root. Se il tuo file contiene #!/bin/bash, hai appena ottenuto una shell root.

L'attacco si chiama PATH hijacking: dirotti il percorso di ricerca dei comandi. Funziona solo se tre condizioni si uniscono: una cartella scrivibile nel PATH, un programma privilegiato che chiama comandi senza path assoluto, e la possibilità di creare un file falso con il nome giusto. Nella simulazione dovrai comporre i quattro passi nell'ordine corretto.`,
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
      details: `L'errore tipico è mettere in /etc/crontab una riga come «*/5 * * * * root /opt/scripts/backup.sh» e poi lasciare che /opt/scripts/backup.sh sia scrivibile da tutti. Chiunque possa modificare quel file può iniettare comandi che partiranno come root ogni cinque minuti.

Nel task vedi l'orologio del sistema: aggiungi la riga giusta allo script backup.sh e osserva cosa succede al prossimo tick del cron.`,
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
      details: `Il comando «getcap -r / 2>/dev/null» elenca i binari con capabilities assegnate. Molti sono legittimi (ping ha cap_net_raw, per esempio) ma se trovi un interprete (python, perl) o un editor (vim) con cap_setuid, hai vinto: quel programma può cambiare il proprio uid a 0 senza essere SUID e senza chiedere permesso.

Analizza la lista di capabilities trovate su web01 e clicca quelle davvero sfruttabili per diventare root.`,
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
      details: `Prima di lanciare un kernel exploit si controlla sempre la versione con «uname -r». Poi si cerca l'exploit che corrisponde alla fascia di versione. Non è un'operazione da fare a cuor leggero: un exploit sbagliato può mandare in kernel panic la macchina, con danni al cliente.

Abbina ogni versione del kernel al suo exploit famoso più adatto.`,
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
      details: `L'enumerazione rivela tre opportunità: un sudo NOPASSWD su «less», un SUID inaspettato su «/usr/local/bin/reader» e la capability cap_setuid su python3. Tutte funzionano. Scegli quella che ritieni più semplice e diretta, e vedi la simulazione della tua scalata a root passo passo.`,
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
      details: `Se una domanda ti mette in difficoltà, torna al micro-task corrispondente. L'obiettivo non è il punteggio ma la capacità di guardare una macchina e riconoscere, in cinque minuti di enumerazione, quali sono le tre-quattro vie più promettenti per diventare root.`,
      hint: "Le risposte più prudenti e metodologicamente corrette sono di solito quelle giuste.",
      explanation: "Hai completato lo scenario Privilege Escalation su Linux.",
      Simulation: Task10Quiz,
    },
  ],
};
