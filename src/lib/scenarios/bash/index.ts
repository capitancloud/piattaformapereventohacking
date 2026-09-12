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
      brief: "Bash è una shell: un programma che interpreta i tuoi comandi e li passa al sistema.",
      details:
        "Quando scrivi ls e premi Invio, non è il kernel a leggere quella parola: è la shell. Bash (Bourne Again SHell) è la shell più diffusa. Legge il tuo testo, capisce cosa vuoi, chiede al kernel di eseguirlo e ti mostra il risultato.\n\nTerminale, shell e kernel sono tre cose diverse: il terminale è la finestra, la shell è l'interprete, il kernel è il cuore che parla con l'hardware.",
      hint: "Il terminale disegna, la shell interpreta, il kernel esegue.",
      explanation:
        "Bash è solo una delle shell (esistono zsh, fish, sh...), ma è la più portabile: quello che impari qui funziona su quasi ogni server Linux del mondo.",
      Simulation: Task01WhatIs,
    },
    {
      id: "02-anatomia",
      title: "Anatomia di un comando",
      goal: "Comporre un comando da comando + opzioni + argomenti",
      brief: "Ogni comando Bash ha la stessa forma: nome, opzioni, argomenti.",
      details:
        "Prendi ls -la /home: ls è il comando, -la sono due opzioni (l = lista lunga, a = mostra anche i nascosti), /home è l'argomento su cui agire.\n\nRiconoscere le tre parti ti permette di leggere qualsiasi comando, anche uno che non hai mai visto.",
      hint: "Trascina o clicca i pezzi nell'ordine giusto: prima il comando, poi le opzioni, infine l'argomento.",
      explanation:
        "Comando, opzioni, argomenti. Questa struttura vale per tutti gli strumenti da terminale, non solo per Bash.",
      Simulation: Task02Anatomy,
    },
    {
      id: "03-echo-variabili",
      title: "Echo e variabili",
      goal: "Stampare testo e memorizzare valori in variabili",
      brief: "echo stampa. NOME=valore salva. $NOME rilegge.",
      details:
        "echo scrive sullo schermo quello che gli passi. Le variabili si creano con NOME=valore (senza spazi attorno all'uguale) e si richiamano con $NOME.\n\nÈ il primo mattone di ogni script: memorizzare un valore e riusarlo più tardi.",
      hint: "Prova: NAME=Ada, poi echo \"Ciao $NAME\".",
      explanation:
        "In Bash le variabili sono stringhe: nessun tipo, nessuna dichiarazione. Solo attenzione agli spazi attorno all'uguale.",
      Simulation: Task03EchoVars,
    },
    {
      id: "04-primo-script",
      title: "Il tuo primo script",
      goal: "Creare, rendere eseguibile e lanciare uno script",
      brief: "Uno script è un file di testo con comandi. Con il permesso giusto, lo esegui.",
      details:
        "La prima riga speciale è lo shebang: #!/bin/bash. Dice al sistema quale interprete usare. Poi aggiungi i tuoi comandi, salvi il file, dai il permesso di esecuzione con chmod +x e lo lanci con ./nomefile.sh.\n\nQui costruisci uno script pezzo per pezzo, come una checklist.",
      hint: "Rispetta l'ordine: shebang → comandi → salva → chmod → esegui.",
      explanation:
        "Uno script Bash è solo un file di testo eseguibile. Automatizzare inizia da qui.",
      Simulation: Task04Script,
    },
    {
      id: "05-argomenti",
      title: "Argomenti $1, $2, $@",
      goal: "Passare parametri a uno script",
      brief: "Uno script può ricevere argomenti come qualsiasi comando.",
      details:
        "Dentro lo script, $1 è il primo argomento, $2 il secondo, e così via. $@ li rappresenta tutti insieme, $# è il loro numero.\n\nProva a lanciare lo script con nomi e cognomi diversi e osserva come cambia l'output.",
      hint: "Digita ./saluta.sh Ada Lovelace e guarda cosa succede.",
      explanation:
        "Gli argomenti trasformano uno script in uno strumento riutilizzabile con input diversi.",
      Simulation: Task05Args,
    },
    {
      id: "06-if-else",
      title: "Condizioni con if / else",
      goal: "Prendere decisioni in uno script",
      brief: "Se una condizione è vera fai una cosa, altrimenti un'altra.",
      details:
        "La sintassi Bash è particolare: if [ \"$eta\" -ge 18 ]; then ... else ... fi. Le parentesi quadre sono un vero comando (test), non solo un simbolo.\n\nQui componi la condizione a blocchi visivi: scegli variabile, operatore, valore e osserva quale ramo viene eseguito.",
      hint: "-ge = maggiore o uguale, -eq = uguale, -lt = minore. Le stringhe si confrontano con = e !=.",
      explanation:
        "Le condizioni rendono uno script intelligente: reagisce a input e stato del sistema.",
      Simulation: Task06IfElse,
    },
    {
      id: "07-loop-for",
      title: "Ripetere con for",
      goal: "Iterare su una lista di elementi",
      brief: "for elemento in lista; do ... done ripete il blocco per ogni elemento.",
      details:
        "for host in web1 web2 web3; do ping -c1 $host; done esegue un ping su ognuno. Il ciclo è ovunque quando devi ripetere qualcosa: file, utenti, IP, righe di un file.\n\nQui scegli quanti elementi vuoi e vedi il ciclo animarsi passo per passo.",
      hint: "Aumenta lo slider e premi Esegui: ogni giro stampa una riga.",
      explanation:
        "Il for è la forma più semplice di automazione: una cosa, tante volte.",
      Simulation: Task07ForLoop,
    },
    {
      id: "08-pipe-redirezione",
      title: "Pipe e redirezione",
      goal: "Collegare comandi e salvare l'output",
      brief: "| passa l'output di un comando come input al successivo. > lo scrive su file.",
      details:
        "ls | grep .txt filtra solo i file .txt. ls > elenco.txt scrive l'elenco su file. >> aggiunge in coda invece di sovrascrivere.\n\nQui costruisci una pipeline collegando pezzi: sorgente → filtro → destinazione.",
      hint: "Prova: sorgente ls, filtro grep .conf, destinazione risultati.txt.",
      explanation:
        "Piccoli comandi combinati con pipe e redirezione fanno il lavoro di software complessi.",
      Simulation: Task08Pipes,
    },
    {
      id: "09-alias-funzioni",
      title: "Alias e funzioni",
      goal: "Creare scorciatoie personali",
      brief: "Un alias è un nome corto per un comando lungo.",
      details:
        "alias ll='ls -la' crea la scorciatoia ll. Da quel momento in poi puoi digitare ll al posto del comando lungo. Le funzioni fanno lo stesso ma possono contenere più righe e ricevere argomenti.\n\nGli alias vivono nella sessione, per renderli permanenti si mettono nel file ~/.bashrc.",
      hint: "Definisci l'alias, poi lancialo nel terminale accanto.",
      explanation:
        "Alias e funzioni sono il modo di Bash per adattarsi al tuo modo di lavorare.",
      Simulation: Task09Alias,
    },
    {
      id: "10-quiz",
      title: "Quiz finale — 10 domande",
      goal: "Consolidare le basi di Bash",
      brief: "Dieci domande veloci su shell, comandi, variabili, script e pipe.",
      details:
        "Domande semplici e concrete. Se sbagli qualcosa non è grave: rileggi il task corrispondente e riprova.",
      hint: "Pensa alle differenze tra shell, terminale e kernel; e alla struttura comando-opzioni-argomenti.",
      explanation:
        "Con le basi di Bash puoi leggere gli script degli altri, scriverne di tuoi e automatizzare qualsiasi cosa ripetitiva.",
      Simulation: Task10Quiz,
    },
  ],
};
