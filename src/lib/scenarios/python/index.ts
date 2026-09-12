import type { Scenario } from "../types";
import Task01WhatIs from "./tasks/Task01WhatIs";
import Task02Types from "./tasks/Task02Types";
import Task03PrintInput from "./tasks/Task03PrintInput";
import Task04Strings from "./tasks/Task04Strings";
import Task05Lists from "./tasks/Task05Lists";
import Task06Dicts from "./tasks/Task06Dicts";
import Task07IfElse from "./tasks/Task07IfElse";
import Task08Loops from "./tasks/Task08Loops";
import Task09Functions from "./tasks/Task09Functions";
import Task10Quiz from "./tasks/Task10Quiz";

export const pythonScenario: Scenario = {
  id: "python",
  slug: "python",
  title: "Python",
  subtitle: "Il linguaggio più usato al mondo: dalle basi ai primi script utili",
  intro:
    "Python è il coltellino svizzero del programmatore: leggibile, potente e usato ovunque, dall'automazione al pentesting, dalla data science al web. In questo scenario partiamo da zero: vediamo cos'è Python, come si scrivono variabili, stringhe, liste, condizioni e cicli, fino a costruire la tua prima funzione. Tutto interattivo, tutto nel browser.",
  highlights: [
    "Cos'è Python e perché è così diffuso.",
    "Variabili, stringhe, liste, dizionari, condizioni e cicli.",
    "Come si scrive e si organizza una prima funzione.",
  ],
  category: "Fondamentali",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-cos-e-python",
      title: "Cos'è Python?",
      goal: "Capire cos'è un linguaggio interpretato",
      brief:
        "Python è un linguaggio di programmazione amatissimo perché è semplice da leggere e scrivere. È un linguaggio interpretato, il che significa che il computer esegue le tue istruzioni riga per riga senza bisogno di passaggi intermedi complessi.",
      details:
        "Quando scrivi in Python, crei dei file di testo chiamati script che contengono comandi. A differenza di linguaggi più complessi che richiedono una 'compilazione' lunga, Python usa un interprete che legge e dà vita al tuo codice immediatamente.\n\nQuesta caratteristica lo rende perfetto per chi inizia, perché puoi testare piccoli pezzi di codice in tempo reale e vedere subito cosa succede. È un linguaggio estremamente flessibile che viene usato tanto dai principianti quanto dai professionisti della sicurezza informatica per automatizzare compiti ripetitivi.\n\nNella simulazione di oggi, vedrai in azione il legame tra il codice che scrivi e l'interprete. Dovrai ordinare le fasi del processo di esecuzione per capire bene come il tuo computer comunica con il linguaggio Python.\n\nL’interprete è il programma che legge il codice Python e ne realizza le istruzioni. Mettere in ordine le fasi mostra che il file non agisce direttamente sul computer: viene prima compreso dall’interprete e poi trasformato in operazioni eseguibili.",
      hint: "Ricorda: prima scrivi le istruzioni, poi l'interprete le legge e infine il computer le esegue.",
      explanation:
        "Ora sai come Python prende vita sul tuo computer. Comprendere questo meccanismo di esecuzione è il primo passo fondamentale per diventare un programmatore consapevole.",
      Simulation: Task01WhatIs,
    },
    {
      id: "02-variabili-tipi",
      title: "Variabili e tipi",
      goal: "Riconoscere int, float, str, bool",
      brief: "Le variabili sono come delle piccole scatole con un'etichetta dove conservi le tue informazioni. Python è intelligente e capisce da solo che tipo di dato stai inserendo nella scatola.",
      details:
        "Immagina di voler memorizzare l'età di una persona, il prezzo di un prodotto o un semplice saluto. In Python, assegni un nome a un valore e il linguaggio capisce se si tratta di un numero intero (int), un numero con la virgola (float), una parola (str) o un valore di verità (bool).\n\nNon c'è bisogno di scrivere codice complicato per definire il tipo, basta scrivere il nome, il segno uguale e il valore. Questa semplicità ti permette di concentrarti sulla logica del tuo script invece che sulla sintassi rigida di altri linguaggi.\n\nNella simulazione, dovrai associare correttamente i diversi tipi di dati ai valori corrispondenti. Questo esercizio ti aiuterà a memorizzare come Python classifica le informazioni che gestirai quotidianamente nei tuoi programmi.\n\nIl tipo descrive quali operazioni hanno senso per un valore: puoi sommare numeri, unire testi e usare i booleani nelle decisioni. Osserva virgolette, punto decimale e parole True o False, perché sono indizi semplici ma decisivi per la classificazione.",
      hint: "Trascina ogni valore nella categoria che pensi sia la più adatta.",
      explanation:
        "Hai imparato a distinguere i quattro tipi di dati fondamentali. Questi sono i mattoni con cui costruirai ogni futuro programma, dalla più piccola funzione al più complesso script di attacco.",
      Simulation: Task02Types,
    },
    {
      id: "03-print-input",
      title: "print e input",
      goal: "Stampare a schermo e leggere dall'utente",
      brief: "Per comunicare con il tuo programma, userai due comandi magici: print per inviare messaggi a chi lo usa e input per ricevere risposte da lui.",
      details:
        "Il comando print() prende ciò che metti tra le parentesi e lo mostra sullo schermo, rendendolo leggibile per l'utente. D'altra parte, input() ferma l'esecuzione dello script, pone una domanda all'utente e attende che lui scriva qualcosa sulla tastiera.\n\nRicorda sempre che tutto ciò che viene inserito tramite input viene trattato come una parola (stringa). Se ti serve un numero, dovrai convertirlo manualmente, altrimenti Python lo leggerà come semplice testo e non potrai farci dei calcoli.\n\nNel compito di oggi, creerai un piccolo programma interattivo. Dovrai combinare print e input per costruire un dialogo che interagisce davvero con chi sta davanti allo schermo.\n\nInput raccoglie una risposta e la conserva come testo; print rende visibile un messaggio o un risultato. Insieme creano un piccolo dialogo: prima il programma domanda, poi usa la risposta ricevuta per produrre un output personalizzato.",
      hint: "Prova a creare un piccolo dialogo: chiedi all'utente il suo nome e poi usa print per rispondergli.",
      explanation:
        "Adesso sai come rendere i tuoi script bidirezionali. La capacità di ricevere input e inviare output è essenziale per qualsiasi strumento utile, inclusi quelli di hacking che dovrai analizzare.",
      Simulation: Task03PrintInput,
    },
    {
      id: "04-stringhe-fstring",
      title: "Stringhe e f-string",
      goal: "Comporre stringhe con variabili",
      brief: "Le f-string sono un modo moderno e potentissimo per creare messaggi che includono informazioni dinamiche salvate nelle tue variabili.",
      details:
        "Invece di unire pezzi di testo con segni complicati, metti una lettera f davanti alle virgolette. Poi, puoi inserire le tue variabili direttamente dentro il testo usando le parentesi graffe.\n\nQuesto approccio rende il tuo codice incredibilmente leggibile e pulito. Puoi inserire non solo variabili, ma anche semplici calcoli o risultati di altre funzioni, rendendo i tuoi messaggi dinamici e pronti per qualsiasi situazione.\n\nNella sfida, dovrai comporre una frase complessa inserendo correttamente i dati presi dalle variabili. Vedrai come questo metodo semplifichi drasticamente la gestione del testo nei tuoi script.\n\nUna f-string mantiene testo e variabili nella stessa frase, rendendo immediato capire quale valore comparirà in ogni punto. Le parentesi graffe indicano ciò che Python deve calcolare o sostituire, mentre tutto il resto rimane testo normale.",
      hint: "Non dimenticare la f davanti alle virgolette e usa le parentesi graffe per racchiudere le variabili.",
      explanation:
        "Hai imparato il modo più moderno ed efficace per gestire il testo in Python. Le f-string sono uno strumento indispensabile per rendere i tuoi output chiari e professionali.",
      Simulation: Task04Strings,
    },
    {
      id: "05-liste",
      title: "Liste",
      goal: "Creare, aggiungere, rimuovere elementi",
      brief: "Una lista è un contenitore ordinato che ti permette di salvare molti elementi insieme, come se fosse una lista della spesa digitale.",
      details:
        "Invece di creare una variabile per ogni cosa, usi una lista tra parentesi quadre. Puoi aggiungere nuovi elementi, rimuovere quelli che non ti servono più o contare quanti ce ne sono in totale con pochissime righe di codice.\n\nUna regola importante: in informatica si conta spesso partendo da zero. Quindi, il primo elemento della tua lista si trova all'indice 0, il secondo all'indice 1 e così via.\n\nIn questa esercitazione, manipolerai una lista di elementi. Dovrai aggiungere oggetti, eliminarne altri e capire come accedere esattamente a quello che ti serve in base alla sua posizione.\n\nLa lista conserva l’ordine degli elementi e assegna a ciascuno una posizione numerica. Aggiungere o rimuovere un valore può cambiare gli indici successivi: osserva la lista dopo ogni operazione per capire come si aggiorna la struttura.",
      hint: "Ricorda che il primo elemento è all'indice 0. Prova ad aggiungere un elemento e poi a rimuoverne uno.",
      explanation:
        "Le liste sono fondamentali per gestire grandi quantità di dati. Grazie a loro, il tuo codice diventa capace di gestire collezioni di informazioni in modo ordinato ed efficiente.",
      Simulation: Task05Lists,
    },
    {
      id: "06-dizionari",
      title: "Dizionari",
      goal: "Associare chiavi a valori",
      brief: "I dizionari servono quando vuoi associare informazioni a etichette specifiche, come una rubrica dove il nome è la chiave e il numero di telefono è il valore.",
      details:
        "Mentre la lista è perfetta per una serie di dati, il dizionario brilla quando vuoi descrivere un oggetto complesso con diverse caratteristiche. Ogni elemento è composto da una chiave (l'etichetta) e da un valore (l'informazione vera).\n\nPuoi facilmente leggere il valore associato a una chiave, aggiungere nuove caratteristiche all'oggetto o rimuovere quelle inutili. È un metodo molto potente per organizzare dati che devono essere cercati rapidamente.\n\nNella simulazione, dovrai costruire un dizionario descrivendo un oggetto. Assicurati di accoppiare correttamente ogni etichetta con il dato giusto per completare il quadro.\n\nNel dizionario non cerchi un dato per posizione, ma attraverso una chiave descrittiva. Questo rende naturale rappresentare una persona, un dispositivo o un evento con più proprietà, purché ogni chiave sia collegata al valore corretto.",
      hint: "Usa le parentesi graffe e ricorda che ogni dato ha la sua etichetta, chiamata chiave.",
      explanation:
        "Ora sai come strutturare dati complessi usando i dizionari. Questa competenza ti permette di organizzare le informazioni proprio come farebbe un vero database in miniatura.",
      Simulation: Task06Dicts,
    },
    {
      id: "07-if-else",
      title: "if / elif / else",
      goal: "Prendere decisioni nel codice",
      brief: "Le strutture di controllo permettono al tuo programma di prendere decisioni autonome: se succede una cosa, fai questo; altrimenti, fai quello.",
      details:
        "Con if (se), elif (altrimenti se) ed else (altrimenti), crei dei bivi logici. Il programma controlla una condizione: se è vera, esegue un blocco di codice, altrimenti passa al prossimo controllo.\n\nIn Python, l'indentazione (gli spazi vuoti prima del codice) è sacra. È quella che dice al programma quali istruzioni appartengono a quale blocco decisionale, quindi fai molta attenzione agli spazi!\n\nNella sfida, simulerai un processo decisionale. Muovi lo slider e osserva come il tuo codice cambia comportamento in base al valore dell'età, imparando a gestire diversi scenari con un'unica struttura.\n\nPython controlla le condizioni dall’alto verso il basso e si ferma al primo ramo valido. Muovendo lo slider, individua i confini tra if, elif ed else e nota come l’indentazione raggruppa le istruzioni appartenenti a ciascun caso.",
      hint: "Attenzione agli spazi: in Python l'indentazione corretta è obbligatoria per far funzionare i blocchi.",
      explanation:
        "Hai imparato a dare intelligenza al codice. Grazie alle condizioni, i tuoi script non sono più sequenze fisse, ma veri e propri programmi capaci di adattarsi alla situazione.",
      Simulation: Task07IfElse,
    },
    {
      id: "08-cicli",
      title: "Cicli for e while",
      goal: "Ripetere blocchi di codice",
      brief: "I cicli ti salvano dalla noia di scrivere lo stesso codice più volte, permettendoti di ripetere azioni automaticamente finché non hai finito.",
      details:
        "Il ciclo for è perfetto quando sai già quante volte devi ripetere un'azione, ad esempio scorrere tutti gli elementi di una lista. Il ciclo while, invece, continua a ripetere finché una condizione rimane vera, ideale quando non conosci la durata a priori.\n\nBisogna fare molta attenzione a non creare cicli infiniti che non finiscono mai e bloccano il computer! Assicurati sempre che la condizione di uscita sia raggiungibile.\n\nNella simulazione, sperimenterai entrambi i cicli. Dovrai impostare il numero di ripetizioni o la condizione di stop per far completare il compito al programma senza errori.\n\nFor attraversa una sequenza già definita, mentre while continua finché una condizione rimane vera. Confronta i due comportamenti nella simulazione e verifica sempre che il valore controllato da while cambi, altrimenti il ciclo non avrebbe modo di terminare.",
      hint: "Scegli bene il tipo di ciclo: for se conosci il limite, while se devi controllare una condizione.",
      explanation:
        "I cicli sono il motore dell'automazione. Saperli usare significa passare dal fare le cose a mano al lasciare che sia il computer a lavorare per te.",
      Simulation: Task08Loops,
    },
    {
      id: "09-funzioni",
      title: "Funzioni con def",
      goal: "Definire e chiamare una funzione",
      brief: "Le funzioni sono blocchi di codice riutilizzabili che ti permettono di dare un nome a un compito complesso e chiamarlo ogni volta che ti serve.",
      details:
        "Invece di copiare e incollare lo stesso codice in posti diversi, lo racchiudi in una funzione definita con la parola chiave def. Puoi passare alla funzione degli input (argomenti) e farti restituire un risultato tramite il comando return.\n\nQuesto rende il tuo programma molto più pulito, facile da leggere e semplice da riparare in caso di bug. È il primo passo fondamentale verso la scrittura di software professionale.\n\nNel compito di oggi, definirai la tua prima funzione per eseguire un calcolo. Una volta definita, la richiamerai più volte per vedere come semplifica la gestione del lavoro.\n\nDef assegna un nome a un blocco di istruzioni, i parametri ricevono i dati e return consegna il risultato al punto della chiamata. Eseguire la stessa funzione con valori diversi mostra perché questo modello evita duplicazioni e rende il codice più facile da controllare.",
      hint: "Usa def per creare la funzione e return per restituire il risultato del tuo calcolo.",
      explanation:
        "Le funzioni sono il segreto per scrivere programmi puliti e modulari. Ora che sai come crearle, sei pronto a costruire script molto più ambiziosi.",
      Simulation: Task09Functions,
    },
    {
      id: "10-quiz",
      title: "Quiz finale — 10 domande",
      goal: "Consolidare le basi di Python",
      brief: "È arrivato il momento di mettere alla prova quello che hai imparato. Dieci domande veloci per vedere se hai interiorizzato i concetti fondamentali.",
      details:
        "Non preoccuparti del punteggio perfetto, l'importante è capire dove sono le tue incertezze. Se sbagli una risposta, prendila come un segnale per rileggere la spiegazione di quel task specifico.\n\nIl quiz copre tutto ciò che abbiamo visto: dalle variabili alle funzioni, passando per liste e cicli. È un modo ottimo per fissare i concetti prima di passare a sfide più avanzate.\n\nConcentrati, leggi bene le domande e usa tutto quello che hai imparato finora. Buona fortuna con il test finale!\n\nLe domande collegano sintassi e comportamento: non basta riconoscere una parola, bisogna capire che cosa produrrà il codice. Quando hai un dubbio, simula mentalmente i valori delle variabili una riga alla volta fino al risultato finale.",
      hint: "Fai un bel respiro e ricorda: indentazione, tipi di dati e la differenza tra lista e dizionario sono la chiave.",
      explanation:
        "Congratulazioni! Con questo quiz hai completato il primo scenario. Hai le fondamenta giuste per approfondire Python e iniziare il tuo viaggio nell'ethical hacking.",
      Simulation: Task10Quiz,
    },
  ],
};
