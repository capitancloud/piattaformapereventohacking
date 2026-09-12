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
        "Python è un linguaggio di programmazione interpretato: scrivi codice in un file .py e l'interprete lo esegue riga per riga.",
      details:
        "A differenza di linguaggi compilati come C, non serve un passaggio di compilazione: l'interprete Python legge il tuo file e lo esegue direttamente. Questo lo rende veloce da scrivere e testare.\n\nÈ un linguaggio a tipizzazione dinamica: non devi dichiarare che una variabile è un numero o una stringa, lo capisce da solo. Ed è famoso per la sintassi pulita: niente parentesi graffe, l'indentazione è parte della grammatica.",
      hint: "Ordina il flusso: prima scrivi il codice, poi l'interprete lo legge, infine il computer esegue.",
      explanation:
        "Con Python il ciclo scrivi → esegui → correggi è velocissimo: è il motivo per cui è così popolare tra chi impara e tra chi automatizza.",
      Simulation: Task01WhatIs,
    },
    {
      id: "02-variabili-tipi",
      title: "Variabili e tipi",
      goal: "Riconoscere int, float, str, bool",
      brief: "Una variabile è un nome a cui assegni un valore. Python capisce il tipo da solo.",
      details:
        "eta = 30 crea una variabile intera. prezzo = 9.90 è un float (numero con virgola). nome = \"Ada\" è una stringa. attivo = True è un booleano.\n\nNon devi dichiarare il tipo: Python lo deduce dal valore. Puoi anche cambiarlo strada facendo, ma di solito non è una buona idea.",
      hint: "Trascina ogni valore nella casella del tipo giusto.",
      explanation:
        "int, float, str, bool sono i tipi primitivi più usati. Tutto il resto (liste, dizionari, oggetti) è costruito sopra di loro.",
      Simulation: Task02Types,
    },
    {
      id: "03-print-input",
      title: "print e input",
      goal: "Stampare a schermo e leggere dall'utente",
      brief: "print scrive. input legge una risposta dall'utente.",
      details:
        "print(\"Ciao\") stampa Ciao a schermo. nome = input(\"Come ti chiami? \") mostra la domanda e aspetta la risposta, poi la salva nella variabile nome.\n\nAttenzione: input restituisce sempre una stringa. Se vuoi un numero devi convertirlo con int() o float().",
      hint: "Prova a scrivere un piccolo dialogo: chiedi un nome e poi salutalo con print.",
      explanation:
        "print e input sono i mattoni base di ogni script interattivo. Semplici ma potentissimi.",
      Simulation: Task03PrintInput,
    },
    {
      id: "04-stringhe-fstring",
      title: "Stringhe e f-string",
      goal: "Comporre stringhe con variabili",
      brief:
        "Le f-string sono il modo moderno per unire testo e variabili in Python.",
      details:
        "Una f-string comincia con la lettera f prima delle virgolette: f\"Ciao {nome}, hai {eta} anni\". Dentro le graffe puoi mettere qualsiasi espressione: variabili, calcoli, chiamate a funzione.\n\nÈ più leggibile e veloce della vecchia concatenazione con il +.",
      hint: "Componi la frase inserendo {nome} e {eta} nei punti giusti.",
      explanation:
        "Le f-string (introdotte in Python 3.6) sono lo standard moderno per formattare stringhe: leggibili, veloci, sicure.",
      Simulation: Task04Strings,
    },
    {
      id: "05-liste",
      title: "Liste",
      goal: "Creare, aggiungere, rimuovere elementi",
      brief: "Una lista contiene più valori in ordine, tra parentesi quadre.",
      details:
        "frutta = [\"mela\", \"pera\", \"banana\"] è una lista di tre stringhe. Puoi leggere l'elemento con frutta[0] (il primo), aggiungere con frutta.append(\"kiwi\"), rimuovere con frutta.remove(\"pera\") e contare con len(frutta).\n\nGli indici partono da 0: è una convenzione che vale in quasi tutti i linguaggi.",
      hint: "Aggiungi qualche frutto, poi provane a rimuovere uno.",
      explanation:
        "Le liste sono la struttura dati più usata in Python: sequenze ordinate, modificabili, di qualunque tipo.",
      Simulation: Task05Lists,
    },
    {
      id: "06-dizionari",
      title: "Dizionari",
      goal: "Associare chiavi a valori",
      brief:
        "Un dizionario è un insieme di coppie chiave → valore, tra parentesi graffe.",
      details:
        "persona = {\"nome\": \"Ada\", \"eta\": 30} contiene due coppie. Leggi con persona[\"nome\"], aggiungi con persona[\"citta\"] = \"Roma\", elimini con del persona[\"eta\"].\n\nUsi i dizionari ogni volta che hai bisogno di descrivere un oggetto con più attributi.",
      hint: "Aggiungi le coppie chiave-valore mancanti per completare la scheda.",
      explanation:
        "Dizionari e liste sono i due pilastri dei dati in Python: liste per sequenze ordinate, dizionari per associazioni chiave-valore.",
      Simulation: Task06Dicts,
    },
    {
      id: "07-if-else",
      title: "if / elif / else",
      goal: "Prendere decisioni nel codice",
      brief:
        "Se una condizione è vera fai una cosa, altrimenti un'altra. elif aggiunge un ramo intermedio.",
      details:
        "if eta >= 18: print(\"maggiorenne\")\\nelif eta >= 14: print(\"adolescente\")\\nelse: print(\"minore\")\n\nOcchio all'indentazione: in Python i blocchi non sono racchiusi da graffe, ma definiti dagli spazi (di solito 4).",
      hint: "Muovi lo slider dell'età e osserva quale ramo si accende.",
      explanation:
        "if/elif/else è la struttura di controllo base di ogni linguaggio. Con Python l'indentazione è parte della grammatica.",
      Simulation: Task07IfElse,
    },
    {
      id: "08-cicli",
      title: "Cicli for e while",
      goal: "Ripetere blocchi di codice",
      brief:
        "for scorre una sequenza. while ripete finché una condizione è vera.",
      details:
        "for nome in nomi: print(nome) stampa ogni elemento della lista.\n\nfor i in range(5): print(i) stampa i numeri da 0 a 4.\n\nwhile x < 10: x += 1 continua finché x è minore di 10. Attenzione ai loop infiniti: la condizione deve prima o poi diventare falsa.",
      hint: "Scegli quanti giri fare e osserva il ciclo animarsi passo per passo.",
      explanation:
        "for e while sono le due forme di iterazione: for quando sai su cosa iterare, while quando la fine dipende da una condizione.",
      Simulation: Task08Loops,
    },
    {
      id: "09-funzioni",
      title: "Funzioni con def",
      goal: "Definire e chiamare una funzione",
      brief:
        "Una funzione è un blocco di codice riutilizzabile che riceve input e restituisce un risultato.",
      details:
        "def saluta(nome):\\n    return f\"Ciao {nome}\"\n\nDopo la definizione puoi chiamarla quante volte vuoi: saluta(\"Ada\"), saluta(\"Marco\"). Il return è il valore che la funzione restituisce a chi l'ha chiamata.\n\nLe funzioni evitano di ripetere codice e rendono il programma più leggibile.",
      hint: "Definisci una funzione somma(a, b) che restituisce a + b, poi chiamala con due numeri.",
      explanation:
        "Le funzioni sono il primo passo verso il codice organizzato: ogni cosa che fai più di una volta merita di diventare una funzione.",
      Simulation: Task09Functions,
    },
    {
      id: "10-quiz",
      title: "Quiz finale — 10 domande",
      goal: "Consolidare le basi di Python",
      brief:
        "Dieci domande veloci su variabili, tipi, stringhe, liste, dizionari, condizioni, cicli e funzioni.",
      details:
        "Domande semplici e concrete. Se sbagli qualcosa non è grave: torna al task corrispondente e riprova.",
      hint: "Ricorda: indentazione, tipi primitivi, differenza fra lista e dizionario.",
      explanation:
        "Con queste basi puoi già leggere codice Python di altri e scriverne di tuo. Il resto viene con la pratica.",
      Simulation: Task10Quiz,
    },
  ],
};
