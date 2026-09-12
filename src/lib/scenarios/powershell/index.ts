import type { Scenario } from "../types";
import Task01Intro from "./tasks/Task01Intro";
import Task02VerbNoun from "./tasks/Task02VerbNoun";
import Task03GetHelp from "./tasks/Task03GetHelp";
import Task04Pipeline from "./tasks/Task04Pipeline";
import Task05Variables from "./tasks/Task05Variables";
import Task06Providers from "./tasks/Task06Providers";
import Task07ForEach from "./tasks/Task07ForEach";
import Task08ExecPolicy from "./tasks/Task08ExecPolicy";
import Task09Script from "./tasks/Task09Script";
import Task10Quiz from "./tasks/Task10Quiz";

export const powershellScenario: Scenario = {
  id: "powershell",
  slug: "powershell",
  title: "PowerShell",
  subtitle: "La shell a oggetti di Windows: cmdlet, pipeline e primi script",
  intro:
    "PowerShell è la shell moderna di Windows (e ora anche multipiattaforma). A differenza di Bash, non lavora con semplice testo ma con oggetti veri e propri: ogni comando produce dati strutturati che puoi filtrare, ordinare e trasformare senza mai scrivere una riga di parsing. In questo scenario scoprirai la logica Verbo-Sostantivo dei cmdlet, la pipeline a oggetti, le policy di esecuzione e come si scrive il tuo primo script .ps1.",
  highlights: [
    "Perché PowerShell è diversa da Bash: la pipeline a oggetti.",
    "Cmdlet, pipeline, variabili, provider ed ExecutionPolicy.",
    "Come si scrive ed esegue il tuo primo script .ps1.",
  ],
  category: "Fondamentali",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-intro",
      title: "Cos'è PowerShell?",
      goal: "Distinguere PowerShell da Bash",
      brief:
        "PowerShell è la shell nativa di Windows, ma la trovi anche su Linux e macOS. La differenza chiave con Bash è che PowerShell non passa testo, ma oggetti: quando chiedi la lista dei processi, ricevi vere e proprie strutture dati che puoi interrogare direttamente.",
      details:
        "In Bash, quando fai ps aux, il comando ti sputa fuori del testo che poi devi tagliare a mano con awk o cut per estrarre quello che ti serve. In PowerShell, invece, Get-Process ti restituisce oggetti processo con proprietà come Name, Id, CPU: basta scrivere .CPU e hai il valore senza parsing.\n\nQuesto approccio a oggetti rende gli script più corti, più leggibili e meno soggetti a errori quando cambia il formato dell'output. È il motivo per cui gli amministratori Windows preferiscono PowerShell per l'automazione.\n\nIn questo primo esercizio, ti mostreremo alcune affermazioni sulle due shell: dovrai classificarle come tipiche di Bash, di PowerShell o comuni a entrambe.\n\nPrima di completare l’attività, collega ogni comando a questo obiettivo: distinguere PowerShell da Bash. Osserva il nome del cmdlet, i dati che riceve e l’oggetto che restituisce, senza cercare di ricordare subito ogni parametro. Quando il risultato non è chiaro, leggine le proprietà e prova a descrivere cosa è cambiato. Questo modo di ragionare ti permetterà di affrontare anche comandi nuovi usando la logica di PowerShell.",
      hint: "Ricorda: Bash lavora con testo, PowerShell con oggetti. Entrambe hanno pipe, variabili e cicli.",
      explanation:
        "Ora hai chiara la differenza di filosofia. Tenerla a mente ti aiuterà a capire perché in PowerShell si scrive molto meno codice per ottenere lo stesso risultato.",
      Simulation: Task01Intro,
    },
    {
      id: "02-verb-noun",
      title: "Cmdlet: Verbo-Sostantivo",
      goal: "Comporre il cmdlet giusto",
      brief:
        "In PowerShell ogni comando (chiamato cmdlet) ha un nome standard formato da un Verbo e un Sostantivo separati da un trattino: Get-Process, New-Item, Stop-Service. Una volta capita la logica, indovini il nome dei comandi anche senza leggere la documentazione.",
      details:
        "I verbi ammessi sono un elenco fisso e ben definito: Get (leggi), Set (modifica), New (crea), Remove (elimina), Start, Stop, e pochi altri. I sostantivi descrivono l'oggetto: Process, Service, Item (file/cartella), ChildItem (contenuto di una cartella).\n\nQuesta uniformità è una delle grandi forze di PowerShell: chi impara pochi verbi e pochi sostantivi riesce già a lavorare con moltissimi comandi. Non c'è più bisogno di ricordare nomi arbitrari come ls, rm, kill, mkdir.\n\nNella simulazione, per ogni obiettivo dovrai comporre il cmdlet corretto scegliendo il Verbo e il Sostantivo giusti.\n\nPrima di completare l’attività, collega ogni comando a questo obiettivo: comporre il cmdlet giusto. Osserva il nome del cmdlet, i dati che riceve e l’oggetto che restituisce, senza cercare di ricordare subito ogni parametro. Quando il risultato non è chiaro, leggine le proprietà e prova a descrivere cosa è cambiato. Questo modo di ragionare ti permetterà di affrontare anche comandi nuovi usando la logica di PowerShell.",
      hint: "Get legge, New crea, Remove elimina, Stop ferma. Item è un file, ChildItem è il contenuto di una cartella.",
      explanation:
        "Ora sai leggere e comporre i cmdlet. Con questo schema puoi navigare la libreria di PowerShell anche senza cercare su internet.",
      Simulation: Task02VerbNoun,
    },
    {
      id: "03-get-help",
      title: "Scoprire i comandi",
      goal: "Usare Get-Command e Get-Help",
      brief:
        "PowerShell ha due comandi che ti salvano la vita: Get-Command per elencare i cmdlet disponibili e Get-Help per leggere la documentazione ufficiale di ognuno, direttamente nella shell.",
      details:
        "Quando non ricordi il nome esatto di un cmdlet, Get-Command -Verb Get ti mostra tutto quello che inizia per Get. Quando invece vuoi capire cosa fa un cmdlet e quali parametri accetta, Get-Help Get-Process ti dà una descrizione sintetica; con -Examples ottieni anche gli esempi pratici.\n\nQuesta capacità di auto-documentarsi è uno dei motivi per cui PowerShell è considerata beginner-friendly: non devi memorizzare tutto, ti basta sapere come chiedere.\n\nNella simulazione hai un mini-terminale PowerShell: prova a esplorare l'elenco dei comandi e a leggere l'aiuto di almeno un cmdlet.\n\nPrima di completare l’attività, collega ogni comando a questo obiettivo: usare Get-Command e Get-Help. Osserva il nome del cmdlet, i dati che riceve e l’oggetto che restituisce, senza cercare di ricordare subito ogni parametro. Quando il risultato non è chiaro, leggine le proprietà e prova a descrivere cosa è cambiato. Questo modo di ragionare ti permetterà di affrontare anche comandi nuovi usando la logica di PowerShell.",
      hint: "Prova Get-Command -Verb Get, poi Get-Help Get-Process. Puoi aggiungere -Examples per vedere esempi.",
      explanation:
        "Hai imparato ad auto-documentarti dentro PowerShell. Da qui puoi scoprire migliaia di cmdlet senza mai lasciare il terminale.",
      Simulation: Task03GetHelp,
    },
    {
      id: "04-pipeline",
      title: "La pipeline a oggetti",
      goal: "Comporre una pipeline di 4 stadi",
      brief:
        "La pipeline (|) in PowerShell passa oggetti da un cmdlet all'altro. Puoi filtrarli, ordinarli, selezionare colonne e limitare i risultati incastrando cmdlet come mattoncini Lego.",
      details:
        "Immagina di voler vedere i tre processi che consumano più CPU: prendi tutti i processi con Get-Process, tieni solo quelli con CPU maggiore di 10 usando Where-Object, li ordini per CPU decrescente con Sort-Object e infine prendi i primi 3 con Select-Object -First 3.\n\nOgni stadio riceve oggetti dal precedente e passa oggetti al successivo. Non c'è mai bisogno di parsare testo: la variabile speciale $_ rappresenta l'oggetto corrente dentro Where-Object e ForEach-Object.\n\nNella simulazione devi rimettere in ordine i quattro stadi della pipeline per raggiungere l'obiettivo.\n\nPrima di completare l’attività, collega ogni comando a questo obiettivo: comporre una pipeline di 4 stadi. Osserva il nome del cmdlet, i dati che riceve e l’oggetto che restituisce, senza cercare di ricordare subito ogni parametro. Quando il risultato non è chiaro, leggine le proprietà e prova a descrivere cosa è cambiato. Questo modo di ragionare ti permetterà di affrontare anche comandi nuovi usando la logica di PowerShell.",
      hint: "L'ordine logico è: prendi tutto → filtra → ordina → limita. Se ordinassi prima di filtrare sprecheresti lavoro.",
      explanation:
        "Hai composto la tua prima pipeline a oggetti. Con questo schema puoi ispezionare processi, servizi, file di log e chiavi di registro con poche righe.",
      Simulation: Task04Pipeline,
    },
    {
      id: "05-variables",
      title: "Variabili e oggetti",
      goal: "Creare variabili e ispezionare il loro tipo",
      brief:
        "In PowerShell le variabili iniziano con il simbolo del dollaro: $nome = \"Ada\". Ogni variabile è un oggetto vero, con proprietà e metodi che puoi interrogare al volo.",
      details:
        "Assegni un valore con l'uguale, richiami la variabile scrivendo $nome. La cosa interessante è che puoi chiamare il metodo .GetType() su qualsiasi variabile per scoprire di che tipo è: Int32, String, DateTime, ecc.\n\nQuesto è diverso da Bash, dove tutte le variabili sono di fatto stringhe. In PowerShell l'informazione sul tipo è sempre disponibile, e questo abilita autocompletamento, controllo errori e conversioni automatiche.\n\nNel mini-terminale prova ad assegnare qualche variabile e a ispezionare il tipo con .GetType().\n\nPrima di completare l’attività, collega ogni comando a questo obiettivo: creare variabili e ispezionare il loro tipo. Osserva il nome del cmdlet, i dati che riceve e l’oggetto che restituisce, senza cercare di ricordare subito ogni parametro. Quando il risultato non è chiaro, leggine le proprietà e prova a descrivere cosa è cambiato. Questo modo di ragionare ti permetterà di affrontare anche comandi nuovi usando la logica di PowerShell.",
      hint: "Prova: $n = 5, poi $n.GetType(). Prova anche $s = \"ciao\" e $s.Length.",
      explanation:
        "Ora sai che in PowerShell le variabili non sono semplici stringhe: sono oggetti con proprietà e metodi che puoi esplorare in tempo reale.",
      Simulation: Task05Variables,
    },
    {
      id: "06-providers",
      title: "I provider di PowerShell",
      goal: "Navigare filesystem, variabili e ambiente",
      brief:
        "PowerShell tratta molte cose come se fossero un filesystem: le variabili, l'ambiente, il registro di Windows, i certificati. Ognuna è raggiungibile con lo stesso cmdlet Get-ChildItem, cambiando solo il percorso.",
      details:
        "Get-ChildItem C:\\ ti mostra i file, Get-ChildItem Env: ti mostra le variabili d'ambiente, Get-ChildItem Variable: ti mostra le variabili PowerShell attive, Get-ChildItem HKLM:\\Software elenca chiavi di registro.\n\nQuesta astrazione unica (chiamata provider) è potentissima: impari un solo comando e lo usi ovunque. È anche perfetta per scripting di ricognizione, dove devi ispezionare rapidamente parti diverse del sistema.\n\nNella simulazione ti chiediamo di elencare due provider diversi.\n\nPrima di completare l’attività, collega ogni comando a questo obiettivo: navigare filesystem, variabili e ambiente. Osserva il nome del cmdlet, i dati che riceve e l’oggetto che restituisce, senza cercare di ricordare subito ogni parametro. Quando il risultato non è chiaro, leggine le proprietà e prova a descrivere cosa è cambiato. Questo modo di ragionare ti permetterà di affrontare anche comandi nuovi usando la logica di PowerShell.",
      hint: "Prova Get-ChildItem C:\\ e poi Get-ChildItem Env: — vedrai due mondi molto diversi con lo stesso comando.",
      explanation:
        "Hai visto come lo stesso cmdlet cambi mondo a seconda del provider. È una delle idee più eleganti di PowerShell.",
      Simulation: Task06Providers,
    },
    {
      id: "07-foreach",
      title: "ForEach-Object",
      goal: "Ripetere un'azione su una collezione",
      brief:
        "ForEach-Object applica un blocco di codice a ogni elemento della pipeline. È l'equivalente PowerShell del ciclo for di Bash o Python, ma pensato per gli oggetti.",
      details:
        "L'espressione 1..5 crea una sequenza da 1 a 5. Se la mandi in pipeline a ForEach-Object { \"server-$_\" }, dentro il blocco la variabile speciale $_ rappresenta l'elemento corrente. Il risultato è una lista di stringhe: server-1, server-2, ...\n\nQuesto pattern è usato ovunque: generare nomi, iterare su file, chiamare un cmdlet su ogni riga di un CSV. Padroneggiarlo significa poter scrivere script di automazione in due righe.\n\nNella simulazione sposta lo slider per scegliere quanti elementi generare, poi esegui e osserva l'output arrivare uno alla volta.\n\nPrima di completare l’attività, collega ogni comando a questo obiettivo: ripetere un'azione su una collezione. Osserva il nome del cmdlet, i dati che riceve e l’oggetto che restituisce, senza cercare di ricordare subito ogni parametro. Quando il risultato non è chiaro, leggine le proprietà e prova a descrivere cosa è cambiato. Questo modo di ragionare ti permetterà di affrontare anche comandi nuovi usando la logica di PowerShell.",
      hint: "Sintassi: 1..N | ForEach-Object { \"server-$_\" }. La variabile $_ è l'elemento corrente.",
      explanation:
        "Hai capito come ripetere un'operazione su una collezione. È la base di ogni script di automazione in PowerShell.",
      Simulation: Task07ForEach,
    },
    {
      id: "08-execution-policy",
      title: "Execution Policy",
      goal: "Capire i livelli di sicurezza degli script",
      brief:
        "Windows non lascia eseguire script PowerShell a caso: c'è una ExecutionPolicy che decide quali .ps1 possono girare. Non è una barriera anti-hacker, ma un'assicurazione contro l'esecuzione accidentale.",
      details:
        "I livelli principali sono quattro: Restricted (nessuno script), AllSigned (solo script firmati digitalmente), RemoteSigned (locali liberi, remoti solo firmati), Bypass (tutto permesso, nessun controllo).\n\nLa scelta giusta dipende dal contesto: una workstation aziendale userà RemoteSigned, un server bloccato userà AllSigned, una VM di laboratorio può stare in Bypass. Restricted è il default su molti sistemi client.\n\nNella simulazione ti presentiamo quattro scenari: assegna a ciascuno la policy più appropriata.\n\nPrima di completare l’attività, collega ogni comando a questo obiettivo: capire i livelli di sicurezza degli script. Osserva il nome del cmdlet, i dati che riceve e l’oggetto che restituisce, senza cercare di ricordare subito ogni parametro. Quando il risultato non è chiaro, leggine le proprietà e prova a descrivere cosa è cambiato. Questo modo di ragionare ti permetterà di affrontare anche comandi nuovi usando la logica di PowerShell.",
      hint: "Il criterio: quanto rischio permetti? Meno fiducia = policy più restrittiva.",
      explanation:
        "Ora sai scegliere la ExecutionPolicy giusta per ogni contesto. È il primo controllo che un attaccante prova ad aggirare, quindi conoscerlo è fondamentale anche in difesa.",
      Simulation: Task08ExecPolicy,
    },
    {
      id: "09-primo-script",
      title: "Il tuo primo script .ps1",
      goal: "Scrivere ed eseguire uno script parametrico",
      brief:
        "Uno script PowerShell è un file di testo con estensione .ps1. Può ricevere parametri con param(), stampare messaggi con Write-Host e lo esegui scrivendo .\\nome.ps1 nel terminale.",
      details:
        "La prima riga tipica è param($nome) che dichiara un parametro chiamato $nome. Dentro lo script puoi usarlo come una qualsiasi variabile: Write-Host \"Ciao $nome\".\n\nAttenzione: PowerShell richiede il prefisso .\\ per eseguire uno script nella cartella corrente. Questo evita che tu esegua per sbaglio uno script malevolo con lo stesso nome di un cmdlet.\n\nNella simulazione hai un editor: scrivi lo script, salvalo come saluta.ps1 ed eseguilo passando il tuo nome come parametro.\n\nPrima di completare l’attività, collega ogni comando a questo obiettivo: scrivere ed eseguire uno script parametrico. Osserva il nome del cmdlet, i dati che riceve e l’oggetto che restituisce, senza cercare di ricordare subito ogni parametro. Quando il risultato non è chiaro, leggine le proprietà e prova a descrivere cosa è cambiato. Questo modo di ragionare ti permetterà di affrontare anche comandi nuovi usando la logica di PowerShell.",
      hint: "Serve: param($nome) sulla prima riga, poi Write-Host con $nome dentro le virgolette. Esegui con .\\saluta.ps1 -nome Ada.",
      explanation:
        "Hai scritto il tuo primo script PowerShell parametrico. Da qui puoi automatizzare pulizie, backup, deploy e analisi di sistema.",
      Simulation: Task09Script,
    },
    {
      id: "10-quiz",
      title: "Quiz finale — 10 domande",
      goal: "Consolidare le basi di PowerShell",
      brief:
        "Dieci domande veloci per fissare i concetti chiave: cmdlet, pipeline a oggetti, variabili, provider, execution policy e script.",
      details:
        "Non serve un punteggio perfetto: se sbagli qualcosa torna al task corrispondente e rileggi la spiegazione. È un modo utile per capire dove sei sicuro e dove no.\n\nIl quiz copre tutto quello che abbiamo visto: dalla filosofia degli oggetti fino allo script parametrico. Rispondi con calma, senza fretta.\n\nBuon lavoro!\n\nPrima di completare l’attività, collega ogni comando a questo obiettivo: consolidare le basi di PowerShell. Osserva il nome del cmdlet, i dati che riceve e l’oggetto che restituisce, senza cercare di ricordare subito ogni parametro. Quando il risultato non è chiaro, leggine le proprietà e prova a descrivere cosa è cambiato. Questo modo di ragionare ti permetterà di affrontare anche comandi nuovi usando la logica di PowerShell.",
      hint: "Ricorda: Verbo-Sostantivo, $_ nella pipeline, provider come Env: e Variable:, RemoteSigned come default sensato.",
      explanation:
        "Complimenti, hai completato PowerShell! Ora sai leggere script, comporre pipeline e scrivere piccoli tool di automazione su Windows.",
      Simulation: Task10Quiz,
    },
  ],
};
