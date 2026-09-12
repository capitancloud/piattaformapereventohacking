# Correzione testo tagliato nelle finestre nere

## Obiettivo
Rendere sempre leggibili prompt, testo digitato e risultati nelle console simulate, senza tagli laterali su desktop o mobile.

## Interventi
- Correggere i componenti condivisi dei terminali affinché possano restringersi dentro colonne e griglie.
- Separare il prompt dall’area di digitazione con una struttura che assegni all’input lo spazio residuo e consenta al testo di scorrere orizzontalmente durante la scrittura.
- Applicare ritorno a capo sicuro agli output lunghi, compresi comandi, percorsi e messaggi senza spazi.
- Controllare anche le altre finestre nere non basate sul terminale condiviso e uniformarne il comportamento quando necessario.

## Verifica
- Aprire lo scenario Windows mostrato e provare i quattro comandi.
- Controllare le console degli scenari Linux, Bash, PowerShell e analisi traffico.
- Verificare desktop e mobile, assicurandosi che nessun testo venga nascosto o allarghi la pagina.
- Confermare che il progetto resti senza errori.
