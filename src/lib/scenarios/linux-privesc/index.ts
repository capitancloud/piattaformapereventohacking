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
      details: `Su Linux si distingue tra escalation «orizzontale» (da un utente ad un altro utente con gli stessi privilegi, per esempio da www-data a mario) ed «escalation verticale» (da un utente qualunque a root, la vera scalata). La seconda è ciò che quasi sempre si intende con «privesc».

Il criterio per riconoscerla è semplice: c'è già un accesso sulla macchina, e stai cercando di aumentare i tuoi diritti su quella stessa macchina. Se invece stai cercando di entrare, è exploitation; se stai saltando verso un altro host, è movimento laterale.`,
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
      details: `L'idea di linpeas è banale ma efficace: eseguire tutti i controlli manuali che faresti a mano (sudo -l, find SUID, capabilities, cron, kernel version, credenziali nei file) e mostrare in un colpo solo cosa spicca. I risultati più «caldi» sono evidenziati: rosso significa quasi sempre una via di escalation, giallo un sospetto da verificare.

In questo task vedi un output realistico di linpeas su web01. Clicca le tre righe che rappresentano vere opportunità di privilege escalation e ignora il rumore.`,
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
      details: `Il comando classico per trovarli è «find / -perm -4000 -type f 2>/dev/null». La lista che ricevi contiene sempre binari di sistema attesi: passwd, sudo, su, mount, umount, chsh, pkexec, ping. Il tuo compito è notare ciò che non dovrebbe esserci.

In questo task hai un terminale simulato: lancia il find, ispeziona la lista e identifica il binario custom fuori posto.`,
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
      details: `Il PATH è una lista di cartelle. Quando lanci «ls», la shell prova la prima cartella, poi la seconda, e così via. Se il PATH è «/tmp:/usr/local/bin:/bin», Linux cerca prima in /tmp: se ci metti un file eseguibile chiamato «ls», sarà lui a essere eseguito, non /bin/ls.

Immagina uno script SUID di root che al suo interno chiama «ls». Se riesci a piazzare in /tmp un fake «ls» che apre una shell, quello script (che gira come root) eseguirà la tua shell come root. Componi il piano nell'ordine giusto.`,
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
