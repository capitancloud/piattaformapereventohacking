# Piano: nuovo scenario Linux

## Obiettivo
Aggiungere alla piattaforma HackingLab un secondo scenario, **Linux**, con 10 micro-task interattivi. Il modulo deve seguire la stessa architettura già usata per Networking: oggetto `Scenario` in `src/lib/scenarios/linux/index.ts`, componenti task in `src/lib/scenarios/linux/tasks/`, registrazione in `src/lib/scenarios/index.ts`, riutilizzo di `Terminal`, `Feedback` e degli altri componenti lab condivisi.

## Task proposti (10)

1. **Cosa è Linux?**
   - Obiettivo: capire la differenza tra kernel, sistema operativo e distribuzione.
   - Interazione: breve lettura + quiz a scelta multipla (3 domande) su kernel, open source, Torvalds vs Stallman.

2. **Le distribuzioni e Kali Linux**
   - Obiettivo: riconoscere le principali distro e collocare Kali.
   - Interazione: associa ogni distro (Ubuntu, Debian, Fedora, CentOS, Kali) al suo uso tipico; evidenzia Kali come distro dedicata alla sicurezza.

3. **Il terminale e la shell**
   - Obiettivo: familiarizzare con prompt, utente, host e directory corrente.
   - Interazione: terminale simulato in cui eseguire `pwd`, `whoami`, `clear`, `history`; completamento dopo 3 comandi corretti.

4. **Navigare nel filesystem**
   - Obiettivo: usare percorsi assoluti, relativi, `.`, `..`, `~`.
   - Interazione: mappa ad albero di una home fittizia; l'utente deve raggiungere 3 cartelle target scrivendo `cd <percorso>`.

5. **Creare, spostare e cancellare file**
   - Obiettivo: padroneggiare `ls`, `touch`, `mkdir`, `cp`, `mv`, `rm`, `rmdir`.
   - Interazione: terminale simulato con filesystem in memoria; esegui una sequenza guidata (crea cartella, crea file, copia, rinomina, rimuovi).

6. **Permessi e proprietà**
   - Obiettivo: leggere la notazione `ls -l` e modificare permessi con `chmod`.
   - Interazione: tabella di file con permessi; l'utente deve impostare i permessi corretti (lettura/scrittura/esecuzione per owner/group/others) su 3 file.

7. **Utenti, gruppi e sudo**
   - Obiettivo: capire root, utenti normali, `sudo`, `id`, `adduser`.
   - Interazione: scenario in cui alcuni comandi richiedono sudo; l'utente sceglie quando usarlo e risolve 3 situazioni (installazione pacchetto, modifica file di sistema, creazione utente).

8. **Processi e servizi**
   - Obiettivo: usare `ps`, `top`, `kill`, `systemctl`.
   - Interazione: lista processi simulati; l'utente individua un processo sospetto, lo termina con `kill` e ne avvia/arresta il servizio con `systemctl`.

9. **Gestione pacchetti con apt**
   - Obiettivo: installare, aggiornare e rimuovere software su Debian/Kali.
   - Interazione: terminale simulato con comandi `apt update`, `apt install`, `apt remove`, `apt upgrade`; completamento dopo aver eseguito la sequenza corretta.

10. **Quiz finale Linux**
    - Obiettivo: ripassare i concetti del modulo.
    - Interazione: 10 domande a scelta multipla; completamento con almeno 7/10 risposte corrette.

## Modifiche tecniche

- Creare `src/lib/scenarios/linux/index.ts` con lo scenario `linuxScenario`.
- Creare `src/lib/scenarios/linux/tasks/Task01Intro.tsx` … `Task10Quiz.tsx`.
- Aggiornare `src/lib/scenarios/index.ts` importando e aggiungendo `linuxScenario` all'array `scenarios`.
- Riutilizzare `Terminal` per i task 3, 5, 9; `Feedback` (`InfoNote`, `SuccessNote`) per tutti; eventuale componente interno `FileSystemMap` per il task 4.
- Mantenere la palette Deep Violet e lo stile esistente; nessuna modifica a colori o tipografia.
- Niente slide: la struttura attuale prevede solo intro + task.

## Criteri di completamento

- Task 1: 3 risposte corrette su 3.
- Task 2: tutte le associazioni distro-uso corrette.
- Task 3: 3 comandi eseguiti correttamente nel terminale simulato.
- Task 4: 3 percorsi raggiunti correttamente.
- Task 5: sequenza guidata completata senza errori.
- Task 6: 3 file con permessi corretti.
- Task 7: 3 situazioni risolte con uso corretto di sudo.
- Task 8: processo terminato e servizio arrestato/avviato.
- Task 9: sequenza apt completata.
- Task 10: almeno 7/10 risposte corrette.
