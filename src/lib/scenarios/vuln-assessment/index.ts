import type { Scenario } from "../types";
import Task01WhatIs from "./tasks/Task01WhatIs";
import Task02Process from "./tasks/Task02Process";
import Task03Scanner from "./tasks/Task03Scanner";
import Task04Cvss from "./tasks/Task04Cvss";
import Task05FalsePositives from "./tasks/Task05FalsePositives";
import Task06Cve from "./tasks/Task06Cve";
import Task07Prioritize from "./tasks/Task07Prioritize";
import Task08Remediation from "./tasks/Task08Remediation";
import Task09Report from "./tasks/Task09Report";
import Task10Quiz from "./tasks/Task10Quiz";

export const vulnAssessmentScenario: Scenario = {
  id: "vuln-assessment",
  slug: "vulnerability-assessment",
  title: "Vulnerability Assessment",
  subtitle: "Trovare, valutare e raccontare i punti deboli di un sistema",
  intro:
    "Il vulnerability assessment è la fotografia dei punti deboli di un'infrastruttura in un preciso momento. Non è un attacco: è una visita medica preventiva. In questo scenario userai scanner simulati, database di CVE, punteggi CVSS e schede di report reali per imparare l'intero ciclo — dall'inventario alla remediation — attraverso dieci laboratori pratici. Ogni attività è pensata per principianti e usa una grafica diversa: carte da classificare, terminali interattivi, catene di priorità, ricerca in un database, schede da comporre. Nessuna scansione reale lascia il tuo browser.",
  highlights: [
    "Scanner simulato che risponde come un vero Nmap con script vuln.",
    "Database di CVE consultabile per abbinare le vulnerabilità alle scoperte.",
    "Scheda di report da comporre trascinando i frammenti al posto giusto.",
  ],
  category: "Metodologia Pentest",
  difficulty: "Base",
  status: "available",
  tasks: [
    {
      id: "01-cose",
      title: "Cos'è una vulnerabilità",
      goal: "Distinguere le vere vulnerabilità dalle misure di difesa",
      brief:
        "Prima di cercarle bisogna riconoscerle. Una vulnerabilità è un punto debole sfruttabile: software vecchio, configurazioni sbagliate, credenziali deboli. Molte cose sembrano vulnerabilità ma non lo sono, e viceversa.",
      details: `Nel gergo di sicurezza, **vulnerabilità** significa una condizione che permette a un attaccante di ottenere qualcosa che non dovrebbe: leggere dati, cambiare configurazioni, prendere il controllo. Non è la minaccia (chi attacca) né il rischio (la combinazione di probabilità e danno), ma il buco nel muro.

Le famiglie tipiche sono tre: software non aggiornato (con **vulnerabilità** note nel codice), configurazioni deboli (impostazioni predefinite mai cambiate) e credenziali gestite male (password banali o riutilizzate). Riconoscerle è il primo mattone del mestiere.`,
      hint: "Chiediti: qui c'è un punto debole che qualcuno potrebbe sfruttare, o è una misura per proteggersi?",
      explanation: "Sai distinguere una vulnerabilità da una difesa e classificare le famiglie principali.",
      Simulation: Task01WhatIs,
    },
    {
      id: "02-processo",
      title: "Il ciclo del vulnerability assessment",
      goal: "Ricostruire le fasi di un assessment nell'ordine corretto",
      brief:
        "Un vulnerability assessment non è un colpo di scanner: è un ciclo. Inventari, scansioni, analisi, priorità e report si susseguono nell'ordine giusto, altrimenti il risultato è confuso o dannoso.",
      details: `Immagina di dover proteggere un condominio: prima devi sapere quanti appartamenti e portoni ci sono (inventario), poi controllarli uno a uno (scansione), capire davvero quali serrature sono rotte (analisi), decidere quali riparare per prime (priorità) e infine spiegarlo all'amministratore (report). Salta un passaggio e finirai per curare la casa sbagliata.

Il ciclo si ripete nel tempo: nuovi asset arrivano, nuove **vulnerabilità** vengono scoperte, le **patch** cambiano lo scenario. Chi fa questo mestiere non chiude mai la lista.`,
      hint: "Prima si mappa cosa c'è, poi si guarda dentro, poi si giudica, poi si racconta.",
      explanation: "Hai internalizzato il ciclo che rende ripetibile e utile un vulnerability assessment.",
      Simulation: Task02Process,
    },
    {
      id: "03-scanner",
      title: "Uno scanner all'opera",
      goal: "Usare uno scanner simulato per trovare vulnerabilità note",
      brief:
        "Gli scanner automatici sono i muscoli del vulnerability assessment: lanciano migliaia di controlli in pochi minuti. Qui ne piloti uno simulato che usa nmap con gli script «vuln».",
      details: `Uno scanner fa una cosa semplice ma laboriosa: interroga ogni servizio, legge cosa risponde e lo confronta con un enorme catalogo di **vulnerabilità** note. **Nmap** ha un motore di script apposta, Nessus e OpenVAS sono strumenti dedicati con database aggiornati ogni giorno.

Il tuo lavoro non è digitare il comando e stampare i risultati: è leggere l'output, capire cosa significa e distinguere ciò che merita attenzione dal rumore. Qui lo scanner troverà due **vulnerabilità** critiche — dovrai riconoscerle entrambe.`,
      hint: "Digita esattamente: nmap --script vuln 10.10.10.44 e poi «leggi».",
      explanation: "Hai visto come uno scanner traduce una scansione in scoperte concrete da verificare.",
      Simulation: Task03Scanner,
    },
    {
      id: "04-cvss",
      title: "CVSS: il termometro",
      goal: "Assegnare la fascia CVSS corretta a scoperte di vari tipi",
      brief:
        "CVSS è un punteggio da 0 a 10 che misura quanto è grave una vulnerabilità. Non è un'opinione: è una formula che considera facilità di attacco, autenticazione richiesta e impatto.",
      details: `Le fasce sono quattro: bassa (0.1–3.9), media (4.0–6.9), alta (7.0–8.9), critica (9.0–10.0). Sono universali: qualunque scanner, database o rapporto le usa allo stesso modo, così cliente e fornitore parlano la stessa lingua.

**CVSS** non decide da solo la priorità — l'esposizione a internet e i dati coinvolti pesano tantissimo — ma è il primo indicatore che qualunque analista guarda. Imparare a stimarlo a occhio velocizza ogni triage.`,
      hint: "Codice eseguibile da remoto senza autenticazione = critico. Solo divulgazione di informazioni = basso.",
      explanation: "Sai leggere e assegnare correttamente le fasce CVSS a scoperte comuni.",
      Simulation: Task04Cvss,
    },
    {
      id: "05-falsi",
      title: "Falsi positivi",
      goal: "Distinguere i veri positivi dai falsi positivi",
      brief:
        "Gli scanner sono utili ma non infallibili: segnalano vulnerabilità che non esistono davvero. Chiamiamo queste segnalazioni falsi positivi. Un report pieno di falsi positivi vale zero.",
      details: `Un **falso positivo** può nascere da mille motivi: uno scanner che si fida solo del banner del server, una **patch** di backport che non cambia il numero di versione, un servizio raggiungibile solo dalla rete interna. La verità si scopre solo con una verifica manuale — ripetere il test come farebbe un attaccante e vedere se il problema si manifesta davvero.

Il ragionamento è sempre lo stesso: «lo scanner dice X: se X è vero, dovrei poter fare Y. Ci provo». Se Y non succede, è un **falso positivo** da annotare e chiudere.`,
      hint: "Chiediti: ho una prova concreta che il problema si manifesta, oppure sto solo credendo al banner?",
      explanation: "Sai filtrare l'output di uno scanner e distinguere il rumore dai problemi reali.",
      Simulation: Task05FalsePositives,
    },
    {
      id: "06-cve",
      title: "Cerca la CVE",
      goal: "Abbinare vulnerabilità reali al codice CVE corrispondente",
      brief:
        "Ogni vulnerabilità nota ha un codice universale: CVE-anno-numero. È l'atlante che permette a tutto il mondo di parlare della stessa cosa. Qui impari a cercarla.",
      details: `Il sistema **CVE** è mantenuto da MITRE: assegna un identificatore univoco a ogni **vulnerabilità** pubblicamente divulgata. Su NVD (il database del NIST) trovi il dettaglio: descrizione, prodotti affetti, **CVSS**, riferimenti.

Chi fa **vulnerability assessment** consulta questi database ogni giorno. Ricevi una segnalazione dallo scanner, prendi il nome del prodotto e la versione, cerchi la **CVE**, leggi come si sfrutta e cosa la risolve. Qui hai un piccolo database consultabile e tre casi reali da abbinare.`,
      hint: "Cerca per parola chiave: «apache», «smb», «openssl» ti daranno un match immediato.",
      explanation: "Sai orientarti nel mondo delle CVE e collegare una scoperta al suo codice universale.",
      Simulation: Task06Cve,
    },
    {
      id: "07-priorita",
      title: "Metti in fila la remediation",
      goal: "Ordinare cinque scoperte per urgenza di intervento",
      brief:
        "Trovato il problema, la domanda successiva è: da dove comincio? La priorità di remediation nasce dall'incrocio tra gravità, esposizione, dati coinvolti e disponibilità di exploit pubblici.",
      details: `Non basta il **CVSS**: una **vulnerabilità** critica su un sistema isolato in laboratorio conta meno di una vulnerabilità alta esposta a internet con **exploit** pubblico e dati dei clienti dentro. Chi fa il mestiere applica una piccola formula mentale — «CVSS + esposizione + dati + exploit» — che riordina il mondo in fila indiana.

L'obiettivo è chiaro: ridurre in fretta il rischio maggiore, non chiudere prima ciò che è più facile.`,
      hint: "Quella esposta a internet con exploit pubblico e dati sensibili viene sempre prima di una critica solo in LAN.",
      explanation: "Sai ordinare le scoperte secondo criteri concreti di rischio.",
      Simulation: Task07Prioritize,
    },
    {
      id: "08-remediation",
      title: "Scegli la remediation giusta",
      goal: "Riconoscere le remediation efficaci e scartare quelle solo apparenti",
      brief:
        "Non tutte le contromisure risolvono davvero il problema. Alcune sono cerotti sui sintomi, altre lavorano sulla causa. Imparare a distinguerle evita un sacco di lavoro sprecato.",
      details: `Le **remediation** efficaci ricadono quasi sempre in tre famiglie: **patch** (aggiornare il software vulnerabile), riconfigurazione (cambiare impostazioni deboli o disattivare protocolli vecchi), riduzione dell'esposizione (limitare chi può raggiungere il servizio, per esempio via VPN o whitelist).

Le **remediation** apparenti — cambiare una password che non c'entra, nascondere un banner, fare formazione agli utenti su un problema tecnico — non toccano la causa e lasciano la porta aperta. Un report serio distingue le due cose.`,
      hint: "Agisci sulla causa (la falla), non sul sintomo (ciò che si vede).",
      explanation: "Sai scegliere remediation che chiudono il problema alla radice.",
      Simulation: Task08Remediation,
    },
    {
      id: "09-report",
      title: "Componi la scheda di vulnerabilità",
      goal: "Costruire una scheda di report completa e ordinata",
      brief:
        "Una scoperta senza scheda è un post-it perso. Il report è ciò che il cliente legge e usa: titolo, descrizione, CVSS, prova, impatto, remediation. Sei sezioni in un ordine preciso.",
      details: `Una buona scheda risponde in ordine a sei domande: cosa ho trovato, dove esattamente, quanto è grave in numeri, come si può dimostrare che esiste, cosa succede se non si sistema, come si sistema. Ognuna di queste sezioni è cortissima ma necessaria: se salti la prova, nessuno ti crede; se salti la **remediation**, nessuno saprà cosa fare.

Qui trovi sei frammenti veri di una scheda: trascinali (o cliccali) al posto giusto e ricostruisci un report reale su una **SQL injection**.`,
      hint: "Cosa, dove, quanto grave, come lo provo, cosa succede se lo ignoro, come lo sistemo.",
      explanation: "Sai comporre una scheda di vulnerabilità con tutte le informazioni utili al cliente.",
      Simulation: Task09Report,
    },
    {
      id: "10-quiz",
      title: "Verifica finale",
      goal: "Consolidare l'intero ciclo del vulnerability assessment",
      brief:
        "Dieci domande per fissare i concetti: cos'è una vulnerabilità, il ciclo, gli scanner, CVSS, falsi positivi, CVE, priorità, remediation, report. Bastano sette risposte corrette.",
      details: `Se una domanda ti mette in difficoltà, torna al micro-task corrispondente e rifallo con calma. L'obiettivo non è il punteggio ma la fluidità: quando questi passaggi diventano naturali, sai muoverti in un vero **vulnerability assessment** senza esitazioni.`,
      hint: "Se dubiti su una risposta, rileggi il brief del task corrispondente e sarà chiara.",
      explanation: "Hai completato lo scenario Vulnerability Assessment.",
      Simulation: Task10Quiz,
    },
  ],
};
