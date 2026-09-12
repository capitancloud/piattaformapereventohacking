import type { Scenario } from "../types";
import Task01WhatIs from "./tasks/Task01WhatIs";
import Task02Anatomy from "./tasks/Task02Anatomy";
import Task03EchoVars from "./tasks/Task03EchoVars";
import Task04Script from "./tasks/Task04Script";
import Task05Args from "./tasks/Task05Args";
import Task06IfElse from "./tasks/Task06IfElse";
import Task07ForLoop from "./tasks/Task07ForLoop";
import Task08Pipes from "./tasks/Task08Pipes";
import Task09Alias from "./tasks/Task09Alias";
import Task10Quiz from "./tasks/Task10Quiz";

export const bashScenario: Scenario = {
  id: "bash",
  slug: "bash",
  title: "Bash",
  subtitle: "La shell più diffusa al mondo: dai comandi ai primi script",
  intro:
    "Bash è l'interprete di comandi di quasi tutti i sistemi Linux e macOS. Sapere Bash significa poter automatizzare compiti, comporre pipeline di strumenti e scrivere piccoli script che risparmiano ore. In questo scenario partiamo dall'idea di shell e arriviamo a scrivere script con variabili, condizioni e cicli. Tutto interattivo, tutto nel browser.",
  highlights: [
    "Cos'è una shell e come si compone un comando.",
    "Variabili, script, condizioni, cicli e pipeline.",
    "Le basi per automatizzare qualsiasi compito ripetitivo.",
  ],
  category: "Fondamentali",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-cos-e-bash",
      title: "Cos'è Bash?",
      goal: "Distinguere shell, terminale e kernel",
      brief: "In questa lezione scopriremo cos'è Bash e perché è così importante per chiunque usi un computer. Capirai come la shell faccia da ponte tra te e il sistema operativo.",
      details:
        "Immagina il computer come un castello. Al centro c'è il re, il Kernel, che controlla tutto ma parla una lingua difficile. Per comunicare con lui, hai bisogno di un interprete: questa è la Shell. Bash è la shell più famosa al mondo e ti permette di dare ordini al computer scrivendo semplici parole invece di usare il mouse.\n\nSpesso facciamo confusione tra terminale e shell. Il terminale è solo la finestra grafica che apri sul monitor, mentre Bash è il programma invisibile che gira dentro quella finestra e legge i tuoi comandi. Senza una shell, il terminale sarebbe solo una scatola vuota senza vita.\n\nImparare Bash è fondamentale per l'ethical hacking perché quasi tutti i server e i dispositivi di sicurezza si gestiscono tramite riga di comando. In questa simulazione, imparerai a distinguere i ruoli di questi tre componenti fondamentali per muoverti con sicurezza nel sistema.\n\nPrima di completare l’attività, fermati un momento su questo obiettivo: distinguere shell, terminale e kernel. Prova a leggere ogni istruzione come una frase: individua l’azione, i dati usati e il risultato che dovrebbe comparire. Se qualcosa non funziona, cambia un solo elemento alla volta e osserva la differenza nell’output. Questo metodo semplice rende più facile capire gli script e ti prepara a correggere errori senza procedere per tentativi casuali.",
      hint: "Ricorda che il terminale è solo la cornice, mentre la shell è il vero motore che interpreta i tuoi desideri.",
      explanation:
        "Bash è lo standard universale per comunicare con i sistemi Linux. Conoscere la differenza tra shell e kernel ti aiuta a capire come funziona davvero la tecnologia che usi ogni giorno.",
      Simulation: Task01WhatIs,
    },
    {
      id: "02-anatomia",
      title: "Anatomia di un comando",
      goal: "Comporre un comando da comando + opzioni + argomenti",
      brief: "Ogni comando che scrivi segue una struttura precisa e prevedibile. Imparare a scomporre un comando ti permetterà di usare qualsiasi strumento, anche quelli più avanzati.",
      details:
        "Scrivere un comando è un po' come comporre una frase in italiano. C'è un verbo (il comando), un avverbio che spiega come farlo (l'opzione) e un complemento oggetto su cui agire (l'argomento). Se impari questa grammatica, non dovrai mai più imparare a memoria migliaia di comandi diversi.\n\nAd esempio, se vuoi vedere i file in una cartella in modo dettagliato, scriverai ls -l /Documenti. Qui ls è l'ordine di elencare, -l è l'opzione che chiede il formato lungo, e /Documenti è il posto dove guardare. Molte opzioni possono essere unite insieme, come usare -la per vedere anche i file nascosti.\n\nIn questa esercitazione, dovrai mettere in ordine i pezzi di un comando. Questo ti aiuterà a familiarizzare con la struttura logica che Bash si aspetta di ricevere ogni volta che premi Invio sulla tastiera.\n\nPrima di completare l’attività, fermati un momento su questo obiettivo: comporre un comando da comando + opzioni + argomenti. Prova a leggere ogni istruzione come una frase: individua l’azione, i dati usati e il risultato che dovrebbe comparire. Se qualcosa non funziona, cambia un solo elemento alla volta e osserva la differenza nell’output. Questo metodo semplice rende più facile capire gli script e ti prepara a correggere errori senza procedere per tentativi casuali.",
      hint: "Parti sempre dal nome del comando, aggiungi le opzioni che iniziano con il trattino e finisci con l'oggetto su cui vuoi lavorare.",
      explanation:
        "La struttura comando-opzione-argomento è la chiave per leggere e scrivere istruzioni efficaci. Una volta capita questa logica, sarai in grado di usare qualsiasi programma da terminale senza paura.",
      Simulation: Task02Anatomy,
    },
    {
      id: "03-echo-variabili",
      title: "Echo e variabili",
      goal: "Stampare testo e memorizzare valori in variabili",
      brief: "Le variabili sono come scatole dove puoi conservare informazioni da riutilizzare in seguito. Inizieremo a usare il comando echo per stampare messaggi e gestire i nostri primi dati.",
      details:
        "In Bash, puoi salvare delle informazioni assegnando un valore a un nome, come creare un'etichetta su un cassetto. Ad esempio, scrivendo UTENTE=Mario, stai dicendo a Bash di ricordarsi che la parola UTENTE ora contiene Mario. È importante non mettere spazi intorno al simbolo uguale, altrimenti il sistema si confonderà.\n\nPer recuperare quello che hai salvato, devi usare il simbolo del dollaro prima del nome, scrivendo ad esempio $UTENTE. Il comando echo serve proprio a questo: fa l'eco di quello che scrivi, mostrandolo sul terminale. Se scrivi echo Ciao $UTENTE, il terminale ti risponderà con Ciao Mario.\n\nIn questo esercizio, farai pratica creando le tue prime variabili e visualizzandole. Questo è il primo passo per creare programmi che si adattano a situazioni diverse e ricordano dati importanti per te.\n\nPrima di completare l’attività, fermati un momento su questo obiettivo: stampare testo e memorizzare valori in variabili. Prova a leggere ogni istruzione come una frase: individua l’azione, i dati usati e il risultato che dovrebbe comparire. Se qualcosa non funziona, cambia un solo elemento alla volta e osserva la differenza nell’output. Questo metodo semplice rende più facile capire gli script e ti prepara a correggere errori senza procedere per tentativi casuali.",
      hint: "Usa il simbolo uguale senza spazi per salvare un valore e il simbolo $ per richiamarlo quando vuoi usarlo.",
      explanation:
        "Le variabili sono il cuore della programmazione e dell'automazione. Saperle usare ti permette di scrivere script flessibili che possono gestire nomi, percorsi di file e indirizzi IP in modo dinamico.",
      Simulation: Task03EchoVars,
    },
    {
      id: "04-primo-script",
      title: "Il tuo primo script",
      goal: "Creare, rendere eseguibile e lanciare uno script",
      brief: "Uno script è semplicemente un elenco di comandi salvati in un file che il computer può eseguire tutti insieme. Imparerai come trasformare un semplice file di testo in un potente strumento automatico.",
      details:
        "Scrivere comandi uno alla volta è utile, ma per compiti complessi è meglio automatizzare tutto in uno script. Immagina di voler eseguire dieci operazioni ogni mattina: invece di digitarle a mano, puoi creare un file che le contenga tutte e lanciarlo con un solo clic.\n\nOgni script Bash inizia con una riga speciale chiamata shebang, che appare come #!/bin/bash. Questa riga dice al sistema: Ehi, usa Bash per leggere questo file! Dopo aver scritto i tuoi comandi, dovrai dare al file il permesso di esecuzione usando il comando chmod +x, rendendolo un vero e proprio programma.\n\nIn questa simulazione, seguirai passo dopo passo la creazione di uno script. Dalla scrittura dell'intestazione fino al lancio finale, vedrai come i singoli comandi si uniscono per formare una procedura completa ed eseguibile.\n\nPrima di completare l’attività, fermati un momento su questo obiettivo: creare, rendere eseguibile e lanciare uno script. Prova a leggere ogni istruzione come una frase: individua l’azione, i dati usati e il risultato che dovrebbe comparire. Se qualcosa non funziona, cambia un solo elemento alla volta e osserva la differenza nell’output. Questo metodo semplice rende più facile capire gli script e ti prepara a correggere errori senza procedere per tentativi casuali.",
      hint: "Segui l'ordine logico: inizia con lo shebang, scrivi i comandi, salva il file e infine rendilo eseguibile con il comando chmod.",
      explanation:
        "Creare script è la vera essenza dell'ethical hacking e dell'amministrazione di sistema. Trasformare azioni ripetitive in file eseguibili ti farà risparmiare tempo prezioso e ridurrà il rischio di errori umani.",
      Simulation: Task04Script,
    },
    {
      id: "05-argomenti",
      title: "Argomenti $1, $2, $@",
      goal: "Passare parametri a uno script",
      brief: "Gli script possono diventare ancora più utili se possono ricevere informazioni dall'esterno mentre vengono lanciati. Scopriremo come passare dei parametri ai nostri programmi per renderli interattivi.",
      details:
        "A volte vuoi che uno script faccia la stessa operazione ma su file o utenti diversi ogni volta. Invece di modificare il file ogni volta, puoi usare gli argomenti. Quando lanci uno script seguito da una parola, Bash assegna quella parola a una variabile speciale chiamata $1.\n\nSe scrivi due parole dopo il nome dello script, la seconda finirà in $2, e così via. Se vuoi riferirti a tutti gli argomenti insieme, puoi usare il simbolo $@. È un modo fantastico per creare strumenti che si adattano a quello che scrivi sulla riga di comando al momento del lancio.\n\nOggi proverai a lanciare uno script passando diversi nomi come input. Osserverai come lo script cambia il suo comportamento in base a ciò che scrivi dopo il comando, rendendolo molto più versatile.\n\nPrima di completare l’attività, fermati un momento su questo obiettivo: passare parametri a uno script. Prova a leggere ogni istruzione come una frase: individua l’azione, i dati usati e il risultato che dovrebbe comparire. Se qualcosa non funziona, cambia un solo elemento alla volta e osserva la differenza nell’output. Questo metodo semplice rende più facile capire gli script e ti prepara a correggere errori senza procedere per tentativi casuali.",
      hint: "Ricorda che $1 rappresenta il primo pezzetto di testo che scrivi dopo il comando, $2 il secondo, e così via.",
      explanation:
        "Gli argomenti rendono i tuoi script riutilizzabili e professionali. Invece di scrivere dieci script diversi, ne scriverai uno solo capace di gestire input differenti grazie a queste variabili speciali.",
      Simulation: Task05Args,
    },
    {
      id: "06-if-else",
      title: "Condizioni con if / else",
      goal: "Prendere decisioni in uno script",
      brief: "Un programma utile deve saper prendere decisioni in base alla situazione. Impareremo a usare i blocchi if ed else per far scegliere al nostro script quale strada seguire.",
      details:
        "La logica condizionale permette allo script di dire: Se succede questo, allora fai quello. Ad esempio, potresti voler controllare se un file esiste prima di provare a cancellarlo, oppure verificare se un utente ha inserito la password corretta. In Bash, usiamo il comando if seguito da un test tra parentesi quadre.\n\nLa sintassi può sembrare strana all'inizio perché gli spazi sono fondamentali. Un tipico controllo numerico usa sigle come -ge per maggiore o uguale o -eq per uguale. Se la condizione è vera, viene eseguito il codice dopo then; se è falsa, quello dopo else. Si chiude sempre il blocco scrivendo if al contrario, ovvero fi.\n\nIn questa attività, costruirai un blocco decisionale usando dei componenti visivi. Sceglierai la variabile da controllare e l'operatore di confronto per vedere come il computer decide quale messaggio stampare.\n\nPrima di completare l’attività, fermati un momento su questo obiettivo: prendere decisioni in uno script. Prova a leggere ogni istruzione come una frase: individua l’azione, i dati usati e il risultato che dovrebbe comparire. Se qualcosa non funziona, cambia un solo elemento alla volta e osserva la differenza nell’output. Questo metodo semplice rende più facile capire gli script e ti prepara a correggere errori senza procedere per tentativi casuali.",
      hint: "Fai attenzione agli spazi dentro le parentesi quadre e ricorda che fi chiude sempre il blocco iniziato con if.",
      explanation:
        "Il controllo del flusso con if ed else è ciò che trasforma una lista di comandi in un software intelligente. È la base per gestire errori e situazioni impreviste nei tuoi strumenti di hacking.",
      Simulation: Task06IfElse,
    },
    {
      id: "07-loop-for",
      title: "Ripetere con for",
      goal: "Iterare su una lista di elementi",
      brief: "Il ciclo for è il miglior amico di chi vuole automatizzare: permette di ripetere la stessa azione su molti elementi in pochi secondi. Vedremo come gestire liste di dati senza fatica.",
      details:
        "Immagina di dover scansionare cento indirizzi IP o rinominare mille fotografie. Farlo a mano richiederebbe ore, ma con un ciclo for bastano tre righe di codice. Il ciclo prende una lista di elementi e, uno per uno, li assegna a una variabile temporanea per poi eseguire un comando.\n\nLa struttura tipica è: per ogni elemento in questa lista, fai questa azione, fine. Bash continuerà a girare finché non avrà finito tutti gli elementi dell'elenco. È una potenza incredibile racchiusa in una sintassi molto semplice da leggere una volta capito il meccanismo.\n\nIn questa simulazione, potrai decidere quanti elementi far processare al tuo ciclo. Vedrai come lo script ripete ordinatamente le istruzioni per ogni voce, mostrandoti l'output in tempo reale per ogni singolo giro.\n\nPrima di completare l’attività, fermati un momento su questo obiettivo: iterare su una lista di elementi. Prova a leggere ogni istruzione come una frase: individua l’azione, i dati usati e il risultato che dovrebbe comparire. Se qualcosa non funziona, cambia un solo elemento alla volta e osserva la differenza nell’output. Questo metodo semplice rende più facile capire gli script e ti prepara a correggere errori senza procedere per tentativi casuali.",
      hint: "Pensa al ciclo for come a una catena di montaggio che prende un pezzo alla volta e gli applica lo stesso trattamento finché non finiscono i pezzi.",
      explanation:
        "Saper usare i cicli ti permette di scalare il tuo lavoro. Quello che prima richiedeva ore di noiose operazioni manuali ora può essere fatto in un istante con un semplice loop.",
      Simulation: Task07ForLoop,
    },
    {
      id: "08-pipe-redirezione",
      title: "Pipe e redirezione",
      goal: "Collegare comandi e salvare l'output",
      brief: "Bash ti permette di collegare più comandi tra loro come se fossero pezzi di un tubo idraulico. Impareremo a far scorrere i dati da un programma all'altro e a salvarli in file permanenti.",
      details:
        "La filosofia di Linux è creare piccoli strumenti che fanno bene una sola cosa. La magia avviene quando li colleghi con la pipe, il simbolo della barra verticale |. Con la pipe, l'uscita di un comando diventa l'ingresso del successivo, permettendoti di filtrare e trasformare i dati in modi complessi.\n\nOltre a collegare i comandi, puoi anche decidere dove mandare il risultato finale. Usando il simbolo di maggiore >, puoi dire a Bash di non stampare il testo sullo schermo, ma di scriverlo dentro un file. Se invece usi due simboli >>, aggiungerai il testo alla fine del file senza cancellare quello che c'era prima.\n\nOggi costruirai una vera e propria catena di montaggio dati. Partirai da un elenco grezzo, userai un filtro per cercare solo quello che ti serve e infine salverai il risultato pulito in un file di testo.\n\nPrima di completare l’attività, fermati un momento su questo obiettivo: collegare comandi e salvare l'output. Prova a leggere ogni istruzione come una frase: individua l’azione, i dati usati e il risultato che dovrebbe comparire. Se qualcosa non funziona, cambia un solo elemento alla volta e osserva la differenza nell’output. Questo metodo semplice rende più facile capire gli script e ti prepara a correggere errori senza procedere per tentativi casuali.",
      hint: "Usa la barra verticale per passare i dati da un comando all'altro e il simbolo maggiore per salvare il risultato finale in un file.",
      explanation:
        "Pipe e redirezione sono gli strumenti più potenti di Bash. Ti permettono di combinare utility semplici per risolvere problemi complessi, rendendoti un utente del terminale estremamente efficiente.",
      Simulation: Task08Pipes,
    },
    {
      id: "09-alias-funzioni",
      title: "Alias e funzioni",
      goal: "Creare scorciatoie personali",
      brief: "Perché scrivere comandi lunghi e difficili ogni volta quando puoi inventare le tue scorciatoie? Scopriremo come personalizzare Bash con alias e funzioni per lavorare più velocemente.",
      details:
        "Se ti accorgi di scrivere sempre lo stesso comando complicato, puoi dargli un soprannome più corto usando un alias. Ad esempio, invece di scrivere ogni volta un comando lungo per aggiornare il sistema, potresti creare un alias chiamato aggiorna. È un modo fantastico per rendere il terminale più vicino alle tue esigenze.\n\nLe funzioni sono come alias ma molto più potenti: possono contenere molte righe di codice e accettare argomenti, proprio come dei piccoli script interni alla tua sessione. Spesso gli utenti esperti salvano i propri alias e funzioni in un file speciale chiamato .bashrc, così da averli pronti ogni volta che aprono il terminale.\n\nIn questo task, proverai a definire una tua scorciatoia personalizzata. Creerai un alias, lo userai nel terminale e vedrai come Bash riconosce il tuo nuovo comando 'inventato' eseguendo al suo posto l'istruzione originale.\n\nPrima di completare l’attività, fermati un momento su questo obiettivo: creare scorciatoie personali. Prova a leggere ogni istruzione come una frase: individua l’azione, i dati usati e il risultato che dovrebbe comparire. Se qualcosa non funziona, cambia un solo elemento alla volta e osserva la differenza nell’output. Questo metodo semplice rende più facile capire gli script e ti prepara a correggere errori senza procedere per tentativi casuali.",
      hint: "L'alias è come un soprannome: scrivi il nome corto e Bash capisce che intendi il comando lungo associato.",
      explanation:
        "Personalizzare il proprio ambiente di lavoro è un segno di professionalità. Alias e funzioni ti permettono di costruire un kit di attrezzi su misura, ottimizzando ogni secondo passato al terminale.",
      Simulation: Task09Alias,
    },
    {
      id: "10-quiz",
      title: "Quiz finale — 10 domande",
      goal: "Consolidare le basi di Bash",
      brief: "È il momento di mettere alla prova quello che hai imparato! Dieci domande per confermare la tua padronanza delle basi di Bash e dei suoi segreti.",
      details:
        "Abbiamo percorso un lungo cammino: dalla scoperta della shell alla creazione di script con cicli e condizioni. Questo quiz non serve a darti un voto, ma a farti capire se c'è qualche concetto che ha bisogno di una ripassata veloce prima di proseguire il tuo viaggio.\n\nLe domande coprono tutto quello che abbiamo visto: la struttura dei comandi, l'uso del dollaro per le variabili, il funzionamento delle pipe e la logica degli script. Non avere fretta e rifletti su ogni risposta basandoti sulle simulazioni che hai appena completato.\n\nAffronta il quiz con serenità. Se una risposta non ti convince, prova a ricordare gli esempi pratici che abbiamo fatto insieme. Una volta finito, avrai una solida base su cui costruire le tue future competenze di ethical hacker.\n\nPrima di completare l’attività, fermati un momento su questo obiettivo: consolidare le basi di Bash. Prova a leggere ogni istruzione come una frase: individua l’azione, i dati usati e il risultato che dovrebbe comparire. Se qualcosa non funziona, cambia un solo elemento alla volta e osserva la differenza nell’output. Questo metodo semplice rende più facile capire gli script e ti prepara a correggere errori senza procedere per tentativi casuali.",
      hint: "Leggi bene le domande e ripensa alle esercitazioni pratiche: le risposte sono nascoste in quello che hai appena fatto con le tue mani.",
      explanation:
        "Congratulazioni! Superare questo quiz significa che hai le basi necessarie per muoverti nel terminale con consapevolezza. Ora sei pronto per affrontare sfide più avanzate nel mondo Linux.",
      Simulation: Task10Quiz,
    },
  ],
};
