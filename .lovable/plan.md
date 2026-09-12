# Scenario: Sicurezza dei sistemi Linux

## Obiettivo
Aggiungere un nuovo scenario base, separato dal corso Linux generale, con 10 micro-task interattivi. I contenuti useranno un linguaggio semplice, spiegazioni originali e sufficientemente approfondite, senza slide.

## Percorso didattico
1. **Aggiornamenti e patch** — riconoscere perché un sistema aggiornato è più sicuro e scegliere le azioni corrette.
2. **Utenti e privilegi** — distinguere utente normale, root e uso controllato di `sudo`.
3. **Permessi sicuri** — correggere permessi troppo aperti su file comuni senza combinazioni complesse.
4. **Servizi in ascolto** — leggere un elenco semplificato di porte e decidere quali servizi servono davvero.
5. **Firewall con UFW** — costruire poche regole essenziali per consentire SSH e bloccare servizi inutili.
6. **Accesso SSH** — mettere in sicurezza una configurazione scegliendo chiavi, divieto di root e password disattivate.
7. **Log di autenticazione** — individuare accessi riusciti, errori normali e una sequenza sospetta di tentativi.
8. **Processi sospetti** — confrontare processo, utente, comando e consumo per identificare un’anomalia evidente.
9. **Controllo guidato del sistema** — eseguire semplici controlli in un terminale simulato e ottenere un riepilogo.
10. **Quiz finale** — 10 domande accessibili, con soglia 7/10 e possibilità di riprovare.

## Esperienza e grafica
- Ogni attività avrà un’interazione diversa o coerente col tema: classificazione, selezione, configuratore, sequenza e terminale simulato.
- Si useranno gli stessi colori, componenti e comportamenti della piattaforma, mantenendo leggibilità su desktop e mobile.
- Ogni task includerà introduzione, approfondimento pratico, suggerimento contestuale e spiegazione finale specifica.

## Dettagli tecnici
- Creare il nuovo scenario con slug `linux-security` e difficoltà `Base`.
- Aggiungere dieci simulazioni isolate nella cartella dello scenario.
- Registrare lo scenario nell’elenco esistente affinché appaia nella home e utilizzi automaticamente riepilogo, progresso, reset e navigazione già presenti.
- Verificare tipi, build, apertura della pagina scenario e almeno un flusso interattivo completo.
