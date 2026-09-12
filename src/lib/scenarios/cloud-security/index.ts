import type { Scenario } from "../types";
import Task01Shared from "./tasks/Task01Shared";
import Task02Map from "./tasks/Task02Map";
import Task03Iam from "./tasks/Task03Iam";
import Task04Mfa from "./tasks/Task04Mfa";
import Task05S3 from "./tasks/Task05S3";
import Task06Groups from "./tasks/Task06Groups";
import Task07Secrets from "./tasks/Task07Secrets";
import Task08Trail from "./tasks/Task08Trail";
import Task09Triage from "./tasks/Task09Triage";
import Task10Mission from "./tasks/Task10Mission";

export const cloudSecurityScenario: Scenario = {
 id:"cloud-security",slug:"cloud-security",title:"Sicurezza dei Sistemi Cloud",subtitle:"Proteggere identità, dati e servizi in AWS con decisioni semplici e controlli concreti",
 intro:"La sicurezza nel cloud non consiste nel mettere tutto online e affidarsi al fornitore. AWS protegge data center e infrastruttura fisica, mentre chi usa il servizio deve configurare identità, dati, rete e registrazione degli eventi. Questo percorso presenta i concetti fondamentali attraverso una piccola console simulata: vedrai cosa controlla AWS, limiterai i permessi, proteggerai un bucket S3 e ricostruirai una modifica sospetta senza affrontare configurazioni avanzate.",
 highlights:["Responsabilità condivisa, Regioni, Availability Zone e identità IAM.","Protezione di bucket S3, Security Group e credenziali applicative.","CloudTrail, Security Hub e una missione finale sull'intero account."],
 category:"Cloud & Difesa",difficulty:"Base",status:"available",
 tasks:[
  {id:"01-responsabilita",title:"Il confine della responsabilità",goal:"Distinguere ciò che protegge AWS da ciò che configura il cliente",brief:"Nel cloud la sicurezza è condivisa. AWS gestisce edifici, hardware e servizi di base; il cliente resta responsabile di account, permessi, sistemi, configurazioni e dati.",details: `Immagina una casa in affitto molto protetta: il proprietario mantiene struttura, impianti comuni e serrature esterne, ma chi abita decide a chi consegnare le chiavi e se lasciare documenti riservati sul tavolo. Nel cloud il confine cambia anche in base al servizio scelto.

Con una macchina virtuale EC2, per esempio, AWS protegge l'hardware ma il cliente aggiorna il sistema operativo. Con un servizio più gestito, AWS può occuparsi di altri livelli tecnici, senza però decidere chi deve leggere i dati.

Classificherai sei responsabilità per costruire il modello mentale corretto.`,hint:"Chiediti chi può intervenire direttamente: il personale AWS sull'hardware oppure il proprietario dell'account sulla configurazione?",explanation:"Hai riconosciuto il confine del modello di responsabilità condivisa.",Simulation:Task01Shared},
  {id:"02-mappa-account",title:"La mappa di un account AWS",goal:"Capire dove si trovano servizi e risorse",brief:"AWS divide il mondo in Regioni, ciascuna composta da più Availability Zone. Alcuni servizi sono globali, altri regionali e altre risorse vivono in una zona precisa.",details: `Scegliere una Regione influenza residenza dei dati, distanza dagli utenti e disponibilità dei servizi. Le Availability Zone della stessa Regione sono separate, ma collegate con reti veloci: distribuire risorse tra zone riduce la dipendenza da un singolo sito.

IAM è un esempio di servizio globale. Un'istanza EC2, invece, viene creata in una zona. Un bucket S3 è associato a una Regione, anche se il suo nome deve essere unico.

Esplorerai una mappa dell'account e aprirai ogni elemento per leggerne l'ambito.`,hint:"Apri tutte le risorse e osserva le parole Globale, Regione e AZ.",explanation:"Sai leggere la posizione logica delle risorse AWS.",Simulation:Task02Map},
  {id:"03-iam",title:"IAM e minimo privilegio",goal:"Concedere soltanto l'accesso necessario",brief:"IAM stabilisce chi può fare cosa sulle risorse AWS. Una policy troppo ampia rende semplice il lavoro, ma amplia anche le conseguenze di un errore o di un account compromesso.",details: `Una policy può essere letta con tre domande: quale azione è permessa, su quale risorsa e in quali condizioni. Un revisore che deve consultare report non ha bisogno di cancellare oggetti, modificare altri bucket o agire da qualunque rete.

Gli asterischi nelle policy significano “tutto” o “qualunque”. Non sono sempre sbagliati, ma richiedono una motivazione precisa. Per i compiti normali conviene iniziare stretti e ampliare solo quando un'esigenza reale lo dimostra.

Costruirai un permesso essenziale per un revisore esterno.`,hint:"Una sola lettura, un solo bucket e una provenienza conosciuta sono sufficienti.",explanation:"Hai costruito una policy coerente con il minimo privilegio.",Simulation:Task03Iam},
  {id:"04-mfa",title:"MFA sotto pressione",goal:"Riconoscere e bloccare richieste inattese",brief:"L'autenticazione a più fattori aggiunge una verifica oltre alla password. Non protegge però da un'approvazione distratta di una richiesta inviata da chi sta tentando l'accesso.",details: `Nella MFA fatigue, chi attacca conosce già la password e invia molte notifiche sperando che la persona prema Approva per errore o per fermare il disturbo. Luogo, dispositivo, orario e azione appena svolta aiutano a decidere.

Una richiesta inattesa va rifiutata, non ignorata passivamente. Dopo averla bloccata è prudente cambiare la password, controllare le sessioni e avvisare chi gestisce la sicurezza.

Gestirai quattro notifiche in un telefono simulato.`,hint:"Approva soltanto quando hai appena iniziato tu l'accesso e tutti gli indizi sono coerenti.",explanation:"Hai riconosciuto un possibile tentativo di MFA fatigue.",Simulation:Task04Mfa},
  {id:"05-s3",title:"S3 senza esposizioni",goal:"Proteggere un bucket di documenti",brief:"Amazon S3 conserva oggetti come documenti, immagini e backup. Un bucket può essere privato o pubblico; un'impostazione errata può rendere disponibili dati che dovevano restare interni.",details: `Block Public Access è una barriera importante contro aperture accidentali. Le policy e le vecchie **ACL** possono comunque descrivere accessi differenti, quindi vanno controllate insieme. La cifratura protegge i dati memorizzati, mentre il versioning aiuta a recuperare oggetti modificati o cancellati.

Rendere pubblico un sito statico è un caso specifico, non l'impostazione normale per documenti aziendali. Per condividere un singolo file per poco tempo si possono usare collegamenti temporanei controllati.

Metterai in sicurezza un bucket di report.`,hint:"Blocca il pubblico, elimina l'ACL aperta e conserva cifratura e versioni.",explanation:"Hai configurato le protezioni essenziali di un bucket S3.",Simulation:Task05S3},
  {id:"06-security-group",title:"Security Group a strati",goal:"Limitare le connessioni tra i livelli dell'applicazione",brief:"Un Security Group funziona come un controllo di rete associato alle risorse. Specifica quali comunicazioni in ingresso sono consentite e da quale origine.",details: `Una piccola applicazione può avere tre livelli: il load balancer riceve **HTTPS** dagli utenti, il server applicativo riceve traffico solo dal load balancer e il database accetta connessioni soltanto dall'applicazione. Esporre ogni porta a Internet annulla questa separazione.

AWS permette di indicare come origine anche un altro Security Group, invece di inseguire indirizzi che possono cambiare. In questo modo la regola descrive una relazione chiara tra ruoli.

Ordinerai le regole lungo il percorso di una richiesta.`,hint:"Il pubblico entra soltanto nel primo livello; ogni livello successivo si fida esclusivamente di quello precedente.",explanation:"Hai costruito una segmentazione di rete semplice e leggibile.",Simulation:Task06Groups},
  {id:"07-segreti",title:"Le chiavi non vivono nel codice",goal:"Rimuovere credenziali permanenti da un'applicazione",brief:"Le chiavi di accesso scritte nel codice possono finire in repository, copie, screenshot o log. Chi le trova può agire con gli stessi permessi dell'identità a cui appartengono.",details: `AWS Secrets Manager conserva valori sensibili e permette di recuperarli quando servono. Per applicazioni che girano su AWS è ancora meglio usare un ruolo: il servizio riceve credenziali temporanee senza inserire chiavi permanenti nel file.

Cancellare una chiave dal codice non basta se è già stata pubblicata nella cronologia. La chiave va disattivata, revocata e sostituita, poi occorre controllare CloudTrail per eventuali usi inattesi.

Esaminerai un piccolo file e trasferirai soltanto le righe sensibili.`,hint:"Il nome del bucket non è un segreto; access key e secret access key lo sono.",explanation:"Hai separato configurazione normale e credenziali sensibili.",Simulation:Task07Secrets},
  {id:"08-cloudtrail",title:"CloudTrail: ricostruisci l'evento",goal:"Ordinare gli indizi di una modifica sospetta",brief:"AWS CloudTrail registra attività come accessi alla console, modifiche alle policy e cambiamenti dei servizi. Questi eventi aiutano a rispondere alla domanda: chi ha fatto cosa e quando?",details: `Un singolo evento può sembrare normale. Una sequenza, invece, può mostrare una storia: accesso da una nuova origine, aumento dei privilegi, tentativo di ridurre la visibilità e modifica dei dati.

I log devono essere protetti da cancellazioni e conservati in modo adeguato. Fermare la registrazione è di per sé un segnale importante, soprattutto se avviene vicino ad altre operazioni rischiose.

Riordinerai quattro eventi per ricostruire una breve intrusione.`,hint:"L'accesso viene prima dei cambiamenti; chi attacca ottiene potere prima di nascondersi e agire sui dati.",explanation:"Hai trasformato eventi isolati in una timeline investigativa.",Simulation:Task08Trail},
  {id:"09-security-hub",title:"Security Hub: scegli le priorità",goal:"Dare una priorità ragionata alle segnalazioni",brief:"Security Hub raccoglie controlli e findings da più fonti AWS. Non tutte le segnalazioni richiedono la stessa urgenza: bisogna considerare privilegi, esposizione e valore della risorsa.",details: `Un finding critico non va chiuso senza verifica, ma nemmeno trattato soltanto in base al colore. Un bucket pubblico con dati clienti ha un impatto immediato; una risorsa di test spenta da settimane può essere pianificata.

Il primo intervento spesso contiene il rischio: bloccare l'accesso pubblico, disattivare una chiave o limitare un account. Poi si raccolgono prove, si corregge la causa e si documenta la decisione.

Gestirai una coda di quattro segnalazioni differenti.`,hint:"Identità con controllo completo e dati già esposti vengono prima dei problemi di ordine o costo.",explanation:"Hai svolto un triage basato sul rischio reale.",Simulation:Task09Triage},
  {id:"10-missione",title:"Missione finale: progetto Aurora",goal:"Mettere in sicurezza un piccolo ambiente AWS",brief:"La sicurezza efficace usa più livelli. Una password forte non compensa un bucket pubblico, e un firewall corretto non sostituisce registrazione degli eventi e gestione delle chiavi.",details: `In questa missione finale trovi un account appena preparato per un nuovo servizio. Prima dell'apertura devi proteggere l'amministratore, i documenti, il database, i log e una vecchia credenziale.

Ogni controllo affronta un rischio diverso: furto dell'identità, esposizione dei dati, accesso diretto alla rete, perdita delle tracce e abuso di una chiave dimenticata. Insieme formano una base solida, non una garanzia assoluta.

Attiva tutte le difese e avvia la verifica finale dell'ambiente.`,hint:"Controlla tutte e cinque le aree: identità, dati, rete, log e credenziali.",explanation:"Hai completato le basi della sicurezza AWS con una difesa a più livelli.",Simulation:Task10Mission},
 ]
};
