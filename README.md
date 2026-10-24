# progetto-settimana-3

# Lybra - Diario di lettura

**Lybra** è un'applicazione web pensata per gli amanti della lettura. Permette di creare una libreria personale virtuale, catalogare i libri letti, in corso o da leggere, monitorare i progressi e raccogliere recensioni e note personali in un'interfaccia elegante e curata.

## Funzionalità Principali

* **Catalogazione dei Libri:** Aggiungi nuovi titoli specificando autore, genere e scaffale di appartenenza (Letti, Sto leggendo, Voglio leggere).
* **Tracciamento dei Progressi:** Monitora l'avanzamento della lettura tramite percentuali e barre di progresso dinamiche.
* **Recensioni e Note:** Scrivi e consulta recensioni dettagliate e note personali per ogni libro.
* **Filtri e Ricerca:** Cerca rapidamente tra i titoli salvati o filtra i libri in base allo scaffale.
* **Sezioni Informative:** Pagine dedicate a *About Us*, *Termini e Condizioni*, *Informativa sulla Privacy* e una guida di *Aiuto*.

## Tecnologie Utilizzate

* **HTML5** per la struttura delle pagine.
* **CSS** (con stili personalizzati) per il design grafico e il layout responsive in stile vintage/pastello.
* **JavaScript** per la gestione della logica applicativa, la validazione dei campi, la manipolazione dinamica del DOM e la memorizzazione dei dati.

## Architettura e Dettagli Tecnologici

La logica dell'applicazione si basa su un array di oggetti iniziale per la gestione dei dati e sull'uso di selettori globali per la manipolazione del DOM.

### Funzionalità Tecniche Principali:
* **Rendering dinamico (`render`):** Gestisce l'inserimento dei libri nelle rispettive liste, valida i dati del modulo di input, suddivide gli elementi per categoria e applica dinamica di stili e classi CSS. Genera inoltre i controlli interattivi per la modifica di titolo e autore e per l'eliminazione dei libri.
* **Validazione e Gestione Eventi:** Gli event listener gestiscono la convalida dei moduli, fornendo feedback visivi ed errori in caso di dati non validi o conferme all'aggiunta e rimozione dei libri.
* **Filtri e Contatori:** Una funzione dedicata aggiorna dinamicamente i contatori di ogni sezione, consentendo di visualizzare i libri filtrati per categoria tramite appositi pulsanti.
* **Ricerca e Tema:** Include una barra di ricerca in tempo reale per la lista principale e un selettore di tema (chiaro/scuro) per personalizzare l'aspetto visivo della pagina.


