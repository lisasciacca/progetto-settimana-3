// ===== TEMA CHIARO / SCURO =====
// Vale per TUTTE le pagine (index.html e aboutUs.html): per questo sta in cima al file,
// fuori dal blocco della libreria.
// Usa il sistema di temi di Bootstrap 5.3: l'attributo data-bs-theme su <html>
// scurisce automaticamente form, bottoni e componenti. I colori di Lybra sono nel CSS.
// La scelta viene salvata in localStorage: resta passando da una pagina all'altra
// e anche dopo aver ricaricato.

// Nome della "casella" di localStorage per il tema (diversa da quella dei libri)
const CHIAVE_TEMA = "tema";

const bottoneTema = document.querySelector("#themeButton");
const iconaTema = bottoneTema.querySelector("i"); // l'icona Font Awesome nel bottone

// Applica un tema ("light" o "dark") alla pagina e aggiorna l'icona
const applicaTema = (tema) => {
    document.documentElement.dataset.bsTheme = tema; // l'elemento <html>
    const scuro = tema === "dark";
    // Nel tema scuro mostro il sole (per tornare al chiaro), nel chiaro la luna
    iconaTema.classList.toggle("fa-sun", scuro);
    iconaTema.classList.toggle("fa-moon", !scuro);
};

// All'apertura della pagina: tema salvato oppure, se non c'è (null), quello chiaro
applicaTema(localStorage.getItem(CHIAVE_TEMA) ?? "light");

// Click sul bottone: cambio tema e salvo la scelta
bottoneTema.addEventListener("click", () => {
    const nuovoTema = document.documentElement.dataset.bsTheme === "dark" ? "light" : "dark";
    applicaTema(nuovoTema);
    localStorage.setItem(CHIAVE_TEMA, nuovoTema);
});

// ===== CLASSI =====

// salvataggio: books (oggetti) → JSON.stringify → testo → setItem
// caricamento: getItem → testo → JSON.parse → oggetti semplici → fromJSON → oggetti delle classi

// SUPERCLASSE: modello base di ogni libro. Usata così com'è rappresenta un libro in wishlist.
class Libro {
    // CAMPO DI CLASSE: fuori dal constructor perché è uguale per ogni libro appena creato.
    // Valori possibili: 'read', 'reading', 'wishlist' (gli stessi usati come classi CSS).
    stato = 'wishlist';

    constructor(titolo, autore, anno, genere) {
        // Identificativo unico, usato da Modifica ed Elimina per trovare il libro giusto
        this.id = crypto.randomUUID();
        this.titolo = titolo;
        this.autore = autore;
        this.anno = anno;
        this.genere = genere;
    }

    // Cambia lo stato solo dell'oggetto su cui viene chiamato (this)
    segnaComeLetto() {
        this.stato = 'read';
    }

    // Restituisce lo stato in italiano. Non si chiama stato() perché
    // la proprietà this.stato "coprirebbe" un metodo con lo stesso nome.
    descriviStato() {
        if (this.stato === 'read') {
            return 'Letto';
        } else if (this.stato === 'reading') {
            return 'Sto leggendo';
        } else {
            return 'Voglio leggere';
        }
    }

    // Valore numerico del libro (voto o percentuale) e testo (recensione o note).
    // Un libro in wishlist non li ha: restituisce stringhe vuote.
    // Le sottoclassi SOVRASCRIVONO questi metodi (polimorfismo): così chi li usa
    // non deve più chiedersi di che classe è il libro con instanceof.
    // LibroLetto.getValore() restituisce this.valutazione;
    // LibroInLettura.getValore() restituisce this.percentuale;
    // Libro.getValore(), restituisce '', perché un libro in wishlist non ha né voto né percentuale.
    // Questi due metodi sono la versione “predefinita” per i libri che non hanno valore né testo. Grazie a loro tutti i libri rispondono alle stesse domande, e il codice non deve più controllarne la classe con instanceof.

    getValore() {
        return '';
    }

    getTesto() {
        return '';
    }

    // Metodo STATICO: si chiama sulla classe (Libro.fromJSON(...)), non su un libro.
    // Dentro un metodo statico "this" è la classe su cui lo chiami:
    // LibroLetto.fromJSON(d) crea un LibroLetto, Libro.fromJSON(d) un Libro.
    // Object.assign copia poi TUTTI i dati salvati (id, stato, recensione...) nel nuovo oggetto.
    // Le sottoclassi lo ereditano: non serve riscriverlo
    static fromJSON(dati) {
        return Object.assign(new this(dati.titolo, dati.autore, dati.anno, dati.genere), dati);
    }           //                                                                        ↑ sorgente (i dati salvati)
}

// EREDITARIETÀ: LibroLetto eredita proprietà e metodi da Libro e aggiunge recensione e valutazione
class LibroLetto extends Libro {
    // Sovrascrive il campo di Libro: viene applicato subito dopo super(), quindi nasce già "letto"
    stato = 'read';

    constructor(titolo, autore, anno, genere, recensione, valutazione) {
        // Chiama il constructor di Libro: deve essere la prima istruzione, prima di usare this
        super(titolo, autore, anno, genere);
        this.recensione = recensione;
        this.valutazione = valutazione;
    }

    // POLIMORFISMO (override): stesso nome del metodo di Libro, risultato diverso.
    // super.descriviStato() riusa la versione di Libro e aggiunge la valutazione.
    descriviStato() {
        return `${super.descriviStato()} - ${this.valutazione} ★`;
    }

    // POLIMORFISMO: per un libro letto il valore è il voto e il testo la recensione
    getValore() {
        return this.valutazione;
    }

    getTesto() {
        return this.recensione;
    }
}

// EREDITARIETÀ: LibroInLettura eredita da Libro e aggiunge note e percentuale di completamento
class LibroInLettura extends Libro {
    stato = 'reading';

    constructor(titolo, autore, anno, genere, note, percentuale) {
        super(titolo, autore, anno, genere);
        this.note = note;
        this.percentuale = percentuale;
    }

    // POLIMORFISMO (override): aggiunge la percentuale solo se il libro è ancora in lettura.
    // Se è stato chiamato segnaComeLetto(), usa la versione base ("Letto").
    descriviStato() {
        if (this.stato === 'reading') {
            return `${super.descriviStato()} – ${this.percentuale}%`;
        }
        return super.descriviStato();
    }

    // POLIMORFISMO: per un libro in lettura il valore è la percentuale e il testo le note
    getValore() {
        return this.percentuale;
    }

    getTesto() {
        return this.note;
    }
}

// Crea un libro della classe giusta in base allo stato scelto.
// Usata sia dal form di inserimento sia dal salvataggio della modifica.
const creaLibro = (stato, titolo, autore, anno, genere, testo, valore) => {
    if (stato === 'read') {
        return new LibroLetto(titolo, autore, anno, genere, testo, valore);
    } else if (stato === 'reading') {
        return new LibroInLettura(titolo, autore, anno, genere, testo, valore);
    } else {
        // "Voglio leggere": libro semplice in wishlist
        return new Libro(titolo, autore, anno, genere);
    }
};

// ===== SALVATAGGIO NEL BROWSER (localStorage) =====
// Questa sezione deve stare PRIMA di "let books = caricaLibri()":
// quella riga esegue subito caricaLibri(), che usa la costante STORAGE_KEY

// Nome della "casella" in cui il browser conserva i libri
const STORAGE_KEY = "libri";

// localStorage salva solo testo: JSON.stringify trasforma l'array di libri in una stringa
function salvaLibri() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Legge i libri salvati e li ritrasforma in oggetti delle classi giuste
function caricaLibri() {
    // getItem restituisce null se la chiave non esiste: ?? sceglie allora "[]" (array vuoto)
    const dati = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");

    // JSON.parse restituisce oggetti "semplici", senza metodi (niente getValore, descriviStato...).
    // map li ricrea con la classe giusta, riconosciuta dalle proprietà che hanno
    return dati.map(d => {
        if (d.valutazione !== undefined) return LibroLetto.fromJSON(d);
        if (d.percentuale !== undefined) return LibroInLettura.fromJSON(d);
        return Libro.fromJSON(d);
    });
}

// ===== DATI =====

// let e non const: "Svuota tutto" assegnerà a books un array nuovo (books = [])
let books = caricaLibri();

// ===== LIBRI DI ESEMPIO =====
// Non più usati: ora i libri arrivano da localStorage (vedi caricaLibri).
// Li tengo commentati per poterli rimettere al volo durante le prove.
// Ordine degli argomenti: titolo, autore, anno, genere, (recensione/note), (valutazione/percentuale)
/*
const books = [
    new LibroLetto(
        "L'importanza di chiamarsi Ernesto", 'Oscar Wilde', 1895, 'narrativa',
        "Una commedia teatrale brillante, ricca di ironia, equivoci ed eleganza stilistica. Wilde svela l'ipocrisia della società borghese dell'epoca con dialoghi incalzanti e aforismi memorabili.",
        78
    ),
    new LibroLetto(
        'Siddharta', 'Hermann Hesse', 1922, 'narrativa',
        "Un capolavoro spirituale ed filosofico che racconta il viaggio interiore di un giovane alla ricerca del senso della vita e della vera illuminazione, attraverso l'esperienza diretta e la riscoperta della pace interiore.",
        98
    ),
    new LibroInLettura(
        'Il delitto di Lord Arthur Savile', 'Oscar Wilde', 1891, 'narrativa',
        'Sono a buon punto :D',
        50
    ),
    new Libro('Silenzi', 'Emily Dickinson', 1890, 'poesia'),
    new Libro('Persone normali', 'Sally Rooney', 2018, 'romantico'),
    new LibroLetto(
        "L'arte di amare", 'Erich Fromm', 1956, 'saggistica',
        "Un saggio fondamentale che analizza l'amore non come un semplice sentimento passivo, ma come un'arte che richiede impegno, consapevolezza, maturità e pratica quotidiana nei confronti di sé stessi e degli altri.",
        90
    ),
];
*/

// ===== PAGINA DELLA LIBRERIA =====
// Tutto il codice qui sotto usa elementi che esistono solo in index.html (form, liste, modali).
// Su aboutUs.html querySelector restituirebbe null e il primo addEventListener darebbe errore,
// quindi lo eseguo solo se nella pagina c'è la lista dei libri.
// Classi, creaLibro e localStorage invece stanno sopra, fuori dal blocco: non toccano la pagina.
if (document.querySelector("#ulLista")) {

    // ===== ELEMENTI DELLA PAGINA =====

    const valoreTitle = document.querySelector("#title");
    const valoreAuthor = document.querySelector("#author");
    const valoreYear = document.querySelector("#year"); // campo "Anno" del form
    const formLibro = document.querySelector("#formLibro"); // il form, per la validazione con Bootstrap
    const notifica = document.querySelector("#notifica");   // riquadro di conferma (alert di Bootstrap)
    const valoreNoteRe = document.querySelector("#noteRecensione");
    const valoreRating = document.querySelector("#rating");
    const lista = document.querySelector("#ulLista");
    const listaRe = document.querySelector("#ulListaRe");
    const selettoreShelf = document.querySelector("#shelf");
    const selettoreGenre = document.querySelector("#genre");
    const filtroScaffale = document.querySelector("#filtroScaffale"); // select dei filtri
    const ordinamento = document.querySelector("#ordinamento");       // select dell'ordinamento
    const sezioneRecensione = document.querySelector("#noteRe");
    const labelNoteRe = document.querySelector('label[for="noteRecensione"]');
    const labelRating = document.querySelector('label[for="rating"]');
    const searchInput = document.querySelector("#searchInput");
    const modaleLibro = document.querySelector("#modaleLibro");               // la modale con il form
    const collapseRecensioni = document.querySelector("#collapseRecensioni"); // il blocco apribile delle recensioni
    const testoBottoneRecensioni = document.querySelector("#btnRecensioni .testoBottone");
    // Qui in alto (e non nella sezione "Svuota tutto") perché aggiornaContatore() li usa
    // e viene eseguita prima di arrivare a quella sezione
    const modaleSvuota = document.querySelector("#modaleSvuota");  // modale di conferma
    const bottoneSvuota = document.querySelector("#svuotaTutto");  // bottone che la apre

    // Mostra un messaggio nella notifica e lo nasconde dopo 3 secondi
    const mostraNotifica = (messaggio) => {
        notifica.textContent = messaggio;
        notifica.classList.remove("d-none");
        setTimeout(() => {
            notifica.classList.add("d-none");
        }, 3000);
    };

    // ===== FORM: SCAFFALE =====

    // Cambia la visualizzazione di recensione e valutazione in base allo scaffale.
    // Registrato UNA volta sola qui fuori (prima stava dentro aggiungiTitle e si
    // aggiungeva un listener nuovo a ogni aggiornamento della lista).
    selettoreShelf.addEventListener('change', () => {
        const valoreScelto = selettoreShelf.value;

        if (valoreScelto === 'read') {
            sezioneRecensione.classList.remove('d-none');
            labelNoteRe.textContent = "Recensione";
            labelRating.textContent = "Valutazione";
        } else if (valoreScelto === 'reading') {
            sezioneRecensione.classList.remove('d-none');
            labelNoteRe.textContent = "Note";
            labelRating.textContent = "Percentuale completamento";
        } else {
            sezioneRecensione.classList.add('d-none');
        }
    });

    // ===== FUNZIONI DI SUPPORTO PER CREARE ELEMENTI =====

    // Crea un elemento con le classi indicate e, se serve, un testo
    const creaElemento = (tag, classi = "", testo = "") => {
        const elemento = document.createElement(tag);
        if (classi) elemento.className = classi;
        // Controllo esplicito: con "if (testo)" un voto pari a 0 non verrebbe scritto (0 vale "falso")
        if (testo !== "" && testo !== undefined && testo !== null) elemento.textContent = testo;
        return elemento;
    };

    // Crea una colonna della griglia con etichetta, campo ed eventuale messaggio d'errore.
    // L'ordine conta: invalid-feedback deve stare SUBITO DOPO il campo (Bootstrap lo trova così)
    const creaColonna = (classiColonna, etichetta, campo, messaggioErrore = "") => {
        const colonna = creaElemento("div", classiColonna);
        colonna.appendChild(etichetta);
        colonna.appendChild(campo);
        if (messaggioErrore) {
            colonna.appendChild(creaElemento("div", "invalid-feedback", messaggioErrore));
        }
        return colonna;
    };

    // Crea un <select> a partire da un array di coppie [valore, testo]
    const creaSelect = (classi, opzioni) => {
        const select = creaElemento("select", classi);
        opzioni.forEach(([valore, testo]) => {
            const opzione = document.createElement("option");
            opzione.value = valore;
            opzione.textContent = testo;
            select.appendChild(opzione);
        });
        return select;
    };

    // ===== AGGIUNTA E VISUALIZZAZIONE =====

    // Aggiunge il libro scritto nel form (se c'è un titolo) e poi ridisegna le liste
    const aggiungiTitle = () => {
        const titolo = valoreTitle.value.trim();
        const author = valoreAuthor.value.trim();

        // Il controllo dei campi lo fa l'HTML (required, min, max, pattern) con Bootstrap
        if (titolo !== "") {

            // Crea il libro con la classe corrispondente allo scaffale scelto (vedi creaLibro)
            const newBook = creaLibro(
                selettoreShelf.value, titolo, author, valoreYear.value,
                selettoreGenre.value, valoreNoteRe.value, valoreRating.value
            );

            books.push(newBook);
            salvaLibri(); // salva nel browser prima di ridisegnare
            valoreTitle.value = "";
            valoreAuthor.value = "";
            valoreYear.value = ""; // svuota anche il campo anno dopo l'invio
            valoreNoteRe.value = "";
            valoreRating.value = "";

            if (typeof aggiornaContatore === 'function') {
                aggiornaContatore();
            }
        }

        mostraLibri();
    };

    // Crea i dati comuni alle due liste: titolo, autore, anno e badge del genere
    const creaInfoLibro = (book, contenitore) => {
        contenitore.appendChild(creaElemento("span", "title", book.titolo));
        contenitore.appendChild(creaElemento("span", "author", book.autore));
        // Se l'anno è vuoto lo span resta vuoto (niente parentesi vuote)
        contenitore.appendChild(creaElemento("span", "anno", book.anno ? `(${book.anno})` : ""));

        // Genere: componente "badge" di Bootstrap. text-reset usa il colore del testo intorno,
        // fw-normal toglie il grassetto, border aggiunge il bordo. Nessun genere: niente badge
        if (book.genere) {
            contenitore.appendChild(creaElemento("span",
                "badge rounded-pill fw-normal text-uppercase text-reset border ms-2", book.genere));
        }
    };

    // Crea lo span del valore con la stellina (letti) o il % (in lettura)
    const creaSpanValore = (book, classiExtra = "") => {
        const span = creaElemento("span", `rating ${classiExtra}`, book.getValore());
        if (book.stato === 'reading') span.classList.add("percentuale");
        if (book.stato === 'read') span.classList.add("stellina");
        return span;
    };

    // Crea un bottone con un'azione (data-azione): il listener legge l'azione, non la classe.
    // L'id del libro invece sta sul <li> della riga (li.dataset.id)
    const creaBottone = (testo, azione) => {
        const bottone = creaElemento("button", "btn btn-sm btn-lybra rounded-pill", testo);
        bottone.type = "button";
        bottone.dataset.azione = azione; // diventa data-azione="modifica" nell'HTML
        return bottone;
    };

    // Riga della LIBRERIA
    const creaRigaLibreria = (book) => {
        // d-flex affianca dati e bottoni, flex-wrap li manda a capo se non c'è spazio.
        // book.stato ('read', 'reading', 'wishlist') diventa una classe usata dal CSS per le icone
        const li = creaElemento("li", "d-flex flex-wrap justify-content-between align-items-center gap-2 py-2 border-bottom");
        li.classList.add(book.stato);
        li.dataset.id = book.id; // l'id sta sulla riga: tutti i bottoni dentro lo trovano con closest("li")

        const bookDiv = creaElemento("div", "divbook");
        creaInfoLibro(book, bookDiv);

        // Barra di avanzamento: componente "progress" di Bootstrap.
        // Il contenitore è .progress, la parte piena è .progress-bar (larghezza = valore %)
        const barraContenitore = creaElemento("div", "progress barra");
        barraContenitore.setAttribute("role", "progressbar");
        barraContenitore.setAttribute("aria-valuemin", "0");
        barraContenitore.setAttribute("aria-valuemax", "100");
        barraContenitore.setAttribute("aria-valuenow", book.getValore());
        const barraRiempimento = creaElemento("div", "progress-bar");
        barraRiempimento.style.width = `${book.getValore()}%`;
        barraContenitore.appendChild(barraRiempimento);

        // Libro in wishlist: niente barra
        if (book.stato === 'wishlist') {
            barraContenitore.classList.add("d-none");
        }

        // Parte destra della riga: due gruppi, valore (numero + barra) e bottoni.
        // Su smartphone il CSS li allarga a tutta riga e li "giustifica" (uno a sinistra, uno a destra)
        const gruppoValore = creaElemento("div", "gruppoValore d-flex align-items-center gap-2");
        gruppoValore.append(creaSpanValore(book), barraContenitore);

        const gruppoBottoni = creaElemento("div", "gruppoBottoni d-flex gap-2");
        gruppoBottoni.append(creaBottone("Modifica", "modifica"), creaBottone("Elimina", "elimina"));

        const btnDiv = creaElemento("div", "divBtn d-flex align-items-center gap-2");
        btnDiv.append(gruppoValore, gruppoBottoni);

        li.append(bookDiv, btnDiv);
        return li;
    };

    // Riga delle RECENSIONI: riquadro arrotondato (rounded-4) con spazio interno (p-3)
    const creaRigaRecensione = (book) => {
        const li = creaElemento("li", "recensione rounded-4 p-3 my-2");
        li.classList.add(book.stato);
        li.dataset.id = book.id; // come nella libreria: il bottone Modifica trova l'id risalendo al <li>

        const reDivCen = creaElemento("div", "reDivCen text-center");
        creaInfoLibro(book, reDivCen);
        reDivCen.appendChild(creaSpanValore(book, "ms-2"));

        const pRe = creaElemento("p", "pRe mt-2 mb-0", book.getTesto());

        // Bottone Modifica anche sulle recensioni, in basso a destra (text-end)
        const divBottone = creaElemento("div", "text-end mt-2");
        divBottone.appendChild(creaBottone("Modifica", "modifica"));

        li.append(reDivCen, pRe, divBottone);
        return li;
    };

    // Restituisce i libri da mostrare in libreria: filtrati (scaffale + ricerca) e ordinati
    const libriDaMostrare = () => {
        const scaffale = filtroScaffale.value;
        const testoRicerca = searchInput.value.toLowerCase();

        // filter crea un NUOVO array: books non viene toccato
        const filtrati = books.filter(book => {
            const scaffaleOk = scaffale === "tutti" || book.stato === scaffale;
            const ricercaOk = book.titolo.toLowerCase().includes(testoRicerca)
                || book.autore.toLowerCase().includes(testoRicerca);
            return scaffaleOk && ricercaOk;
        });

        // sort riceve una funzione di confronto (a, b):
        // risultato negativo = a prima di b, positivo = b prima di a.
        // Number(...) trasforma "88" in 88; un valore vuoto diventa 0
        // Il valore della select è tipo "titolo-asc": split("-") lo divide in due parti
        // e la destrutturazione [criterio, direzione] le mette in due variabili.
        // Con "nessuno" direzione resta undefined e non si ordina niente
        // La destrutturazione [criterio, direzione] mette il primo elemento in criterio e il secondo in direzione.
        const [criterio, direzione] = ordinamento.value.split("-");

        // Confronta due libri secondo il criterio scelto (dal più piccolo al più grande)
        const confronta = (a, b) => {
            if (criterio === "titolo") {
                // localeCompare confronta le stringhe in ordine alfabetico italiano
                // (gestisce accenti e maiuscole meglio di < e >)
                return a.titolo.localeCompare(b.titolo, "it");
            }
            if (criterio === "anno") {
                return Number(a.anno) - Number(b.anno);
            }
            // voto o percentuale: entrambi con getValore() (polimorfismo)
            return Number(a.getValore()) - Number(b.getValore());
        };

        if (criterio !== "nessuno") {
            filtrati.sort((a, b) => {
                // Libri senza anno sempre in fondo, in entrambe le direzioni
                if (criterio === "anno" && (!a.anno || !b.anno)) {
                    return !a.anno - !b.anno; // true/false diventano 1/0: chi non ha l'anno va dopo
                }
                // "desc": basta scambiare a e b per invertire l'ordine
                return direzione === "asc" ? confronta(a, b) : confronta(b, a);
            }); //ascending
        }
        // "nessuno": nessun sort, resta l'ordine in cui i libri sono stati aggiunti

        return filtrati;
    };

    // Ridisegna le due liste
    const mostraLibri = () => {
        lista.textContent = "";
        listaRe.textContent = "";

        // Libreria: solo i libri filtrati e ordinati
        const libri = libriDaMostrare();

        if (libri.length === 0) {
            // Lista vuota: un messaggio al posto dei libri.
            // Se books è vuoto non c'è proprio nessun libro, altrimenti sono i filtri a escluderli tutti
            const messaggio = books.length === 0
                ? "Nessun libro salvato"
                : "Nessun libro corrisponde ai filtri scelti";
            lista.appendChild(creaElemento("li", "listaVuota text-center py-4", messaggio));
        } else {
            libri.forEach(book => lista.appendChild(creaRigaLibreria(book)));
        }

        // Recensioni: tutti i libri tranne quelli in wishlist (che non hanno recensione)
        const libriConRecensione = books.filter(book => book.stato !== 'wishlist');

        if (libriConRecensione.length === 0) {
            // Stesso messaggio della libreria se non c'è nessun libro;
            // se ci sono solo libri in wishlist, spiego perché la lista è vuota
            const messaggio = books.length === 0
                ? "Nessun libro salvato"
                : "Nessuna recensione: aggiungi un libro letto o in lettura";
            listaRe.appendChild(creaElemento("li", "listaVuota text-center py-4", messaggio));
        } else {
            libriConRecensione.forEach(book => listaRe.appendChild(creaRigaRecensione(book)));
        }
    };

    // ===== INVIO DEL FORM =====

    // Il bottone "Invia" ora è dentro il form (type="submit"): ascolto l'evento submit,
    // che parte sia cliccando il bottone sia premendo Invio in un campo
    formLibro.addEventListener("submit", (e) => {
        e.preventDefault(); // impedisce il ricaricamento della pagina

        // Bootstrap colora i campi solo se il form ha la classe was-validated
        formLibro.classList.add("was-validated");

        // checkValidity() controlla required, min, max, pattern... e restituisce true o false
        if (!formLibro.checkValidity()) {
            return; // ci sono errori: i messaggi rossi li mostra Bootstrap
        }

        // Salvo il titolo PRIMA di aggiungiTitle(), che svuota i campi
        const titolo = valoreTitle.value.trim();
        aggiungiTitle();

        // Libro aggiunto: form pulito per la prossima volta
        formLibro.classList.remove("was-validated"); // via i colori rosso/verde
        formLibro.reset();                           // svuota tutti i campi, compresi i select
        sezioneRecensione.classList.add("d-none");   // e nasconde recensione/valutazione

        // Chiude la modale. getOrCreateInstance restituisce l'oggetto Modal di Bootstrap
        // collegato a quell'elemento (o lo crea se non esiste ancora)
        bootstrap.Modal.getOrCreateInstance(modaleLibro).hide();

        mostraNotifica(`Il libro "${titolo}" è stato aggiunto alla libreria!`);
    });

    // ===== MODALE =====
    // Bootstrap "lancia" degli eventi sulla modale: li ascoltiamo come un normale click

    // Quando la modale ha finito di aprirsi: cursore direttamente nel campo titolo
    modaleLibro.addEventListener("shown.bs.modal", () => {
        valoreTitle.focus();
    });

    // Quando la modale si chiude (anche con Annulla o la X): via i messaggi di errore
    modaleLibro.addEventListener("hidden.bs.modal", () => {
        formLibro.classList.remove("was-validated");
    });

    // ===== RECENSIONI (collapse) =====
    // show.bs.collapse parte quando il blocco inizia ad aprirsi, hide.bs.collapse quando inizia a chiudersi.
    // La freccia invece gira con il CSS, grazie ad aria-expanded.
    collapseRecensioni.addEventListener("show.bs.collapse", () => {
        testoBottoneRecensioni.textContent = "Nascondi recensioni";
    });

    collapseRecensioni.addEventListener("hide.bs.collapse", () => {
        testoBottoneRecensioni.textContent = "Mostra recensioni";
    });

    // ===== CAMPO ANNO =====

    // Anno: non può essere nel futuro. Impostato dal JS così si aggiorna da solo ogni anno.
    valoreYear.max = new Date().getFullYear();

    // Limita un campo anno: niente e, +, -, virgole e al massimo 4 cifre
    // (maxlength non funziona sugli input type="number").
    // È una funzione così si può usare sia nel form sia nella modifica.
    const limitaAnno = (campo) => {
        campo.addEventListener("keydown", (e) => {
            if (["e", "E", "+", "-", ".", ","].includes(e.key)) {
                e.preventDefault();
            }
        });
        campo.addEventListener("input", () => {
            if (campo.value.length > 4) {
                campo.value = campo.value.slice(0, 4);
            }
        });
    };

    limitaAnno(valoreYear); // campo anno del form principale

    window.addEventListener("load", mostraLibri);

    // ===== MODIFICA =====

    // Crea il form di modifica di un libro, già compilato con i suoi dati
    const creaFormModifica = (libro) => {
        const form = document.createElement("form");
        // row g-2: griglia di Bootstrap, i campi si affiancano su più colonne; w-100: tutta la riga
        form.className = "formModifica row g-2 w-100";
        form.noValidate = true; // come novalidate nell'HTML: errori mostrati da Bootstrap

        const classiEtichetta = "form-label small mb-0";

        // --- Titolo ---
        const inputTitolo = creaElemento("input", "form-control form-control-sm modTitolo");
        inputTitolo.type = "text";
        inputTitolo.maxLength = 100;
        // In una stringa normale "\\S" diventa \S: almeno un carattere che non sia uno spazio
        inputTitolo.pattern = ".*\\S.*";
        inputTitolo.required = true;
        inputTitolo.value = libro.titolo; // .value inserisce il testo così com'è, virgolette comprese

        // --- Autore ---
        const inputAutore = creaElemento("input", "form-control form-control-sm modAutore");
        inputAutore.type = "text";
        inputAutore.maxLength = 60;
        inputAutore.value = libro.autore;

        // --- Anno: stesso massimo e stessi limiti del form principale ---
        const inputAnno = creaElemento("input", "form-control form-control-sm modAnno");
        inputAnno.type = "number";
        inputAnno.max = new Date().getFullYear();
        inputAnno.value = libro.anno;
        limitaAnno(inputAnno);

        // --- Genere ---
        const selectGenere = creaSelect("form-select form-select-sm modGenere", [
            ["", "\u00a0"],              // opzione vuota (\u00a0 è lo spazio "invisibile", come &nbsp)
            ["narrativa", "Narrativa"],
            ["poesia", "Poesia"],
            ["saggistica", "Saggistica"],
            ["romantico", "Romantico"],
            ["altro", "Altro"],
        ]);
        selectGenere.value = libro.genere;

        // --- Scaffale ---
        const selectStato = creaSelect("form-select form-select-sm modStato", [
            ["read", "Letto"],
            ["reading", "Sto leggendo"],
            ["wishlist", "Voglio leggere"],
        ]);
        selectStato.value = libro.stato;

        // --- Recensione/note e valutazione/percentuale ---
        const textareaTesto = creaElemento("textarea", "form-control form-control-sm modTesto");
        textareaTesto.rows = 3;
        textareaTesto.maxLength = 1000;

        const inputValore = creaElemento("input", "form-control form-control-sm modValore");
        inputValore.type = "number";
        inputValore.min = 0;
        inputValore.max = 100;

        // getTesto() e getValore(): ogni classe sa da sola cosa restituire (polimorfismo)
        textareaTesto.value = libro.getTesto();
        inputValore.value = libro.getValore();

        // Etichette che cambiano testo in base allo scaffale: le tengo in una variabile
        const etichettaTesto = creaElemento("label", classiEtichetta);
        const etichettaValore = creaElemento("label", classiEtichetta);

        const colonnaTesto = creaColonna("col-md-9", etichettaTesto, textareaTesto);
        const colonnaValore = creaColonna("col-md-3", etichettaValore, inputValore, "Da 0 a 100.");

        // --- Bottoni ---
        // data-azione: le azioni che il listener gestisce (l'id lo prende dal <li> che contiene il form)
        const bottoneSalva = creaElemento("button", "btn btn-sm btn-lybra rounded-pill", "Salva");
        bottoneSalva.type = "button";
        bottoneSalva.dataset.azione = "salva";

        const bottoneAnnulla = creaElemento("button", "btn btn-sm btn-outline-secondary rounded-pill", "Annulla");
        bottoneAnnulla.type = "button";
        bottoneAnnulla.dataset.azione = "annulla";

        const colonnaBottoni = creaElemento("div", "col-12 d-flex justify-content-end gap-2");
        colonnaBottoni.append(bottoneSalva, bottoneAnnulla); // append accetta più elementi insieme

        // --- Montaggio del form, nell'ordine in cui compare ---
        form.append(
            creaColonna("col-md-5", creaElemento("label", classiEtichetta, "Titolo *"), inputTitolo, "Inserisci il titolo."),
            creaColonna("col-md-4", creaElemento("label", classiEtichetta, "Autore"), inputAutore),
            creaColonna("col-md-3", creaElemento("label", classiEtichetta, "Anno"), inputAnno, "Anno non valido."),
            creaColonna("col-md-6", creaElemento("label", classiEtichetta, "Genere"), selectGenere),
            creaColonna("col-md-6", creaElemento("label", classiEtichetta, "Scaffale"), selectStato),
            colonnaTesto,
            colonnaValore,
            colonnaBottoni
        );

        // Mostra/nasconde recensione e valutazione in base allo scaffale scelto.
        // Avendo già gli elementi in variabili, non serve cercarli con querySelector
        const aggiornaCampiExtra = () => {
            const stato = selectStato.value;
            // toggle con 2 argomenti: aggiunge d-none se la condizione è vera, lo toglie se è falsa
            colonnaTesto.classList.toggle("d-none", stato === "wishlist");
            colonnaValore.classList.toggle("d-none", stato === "wishlist");
            etichettaTesto.textContent = stato === "reading" ? "Note" : "Recensione";
            etichettaValore.textContent = stato === "reading" ? "Percentuale" : "Valutazione";
        };
        selectStato.addEventListener("change", aggiornaCampiExtra);
        aggiornaCampiExtra(); // la prima volta, per lo stato attuale del libro

        return form;
    };

    // Gestione dei click unificata per Modifica, Annulla, Salva ed Elimina.
    // È una funzione con un nome così la colleghiamo a DUE liste: libreria e recensioni
    const gestisciClick = (e) => {
        // closest risale dall'elemento cliccato fino al primo che ha data-azione.
        // Funziona anche cliccando su un'icona o un testo DENTRO il bottone
        const bottone = e.target.closest("[data-azione]");
        if (!bottone) return; // click fuori dai bottoni: non faccio niente

        const azione = bottone.dataset.azione;  // "modifica", "elimina", "salva", "annulla"
        const li = bottone.closest("li");
        const id = li.dataset.id;                // l'id sta sulla riga
        // find restituisce il libro con quell'id. È un RIFERIMENTO all'oggetto nell'array,
        // non una copia: modificare libro modifica il libro dentro books.
        const libro = books.find(book => book.id === id);

        // switch: confronta azione con ogni "case" ed esegue quello uguale
        switch (azione) {
            case "elimina":
                // filter crea un array NUOVO senza quel libro (per questo books è "let")
                books = books.filter(book => book.id !== id);
                salvaLibri();
                aggiornaContatore();
                mostraLibri();
                break; // senza break continuerebbe con il case successivo

            case "modifica":
                // La riga diventa il form di modifica (il <li> e il suo data-id restano)
                li.textContent = "";
                li.appendChild(creaFormModifica(libro));
                break;

            case "annulla":
                // Ridisegna la lista: la riga torna normale
                mostraLibri();
                break;

            case "salva": {
                // Le graffe creano un blocco: così le const qui dentro non si "scontrano"
                // con variabili con lo stesso nome in altri case
                const formModifica = bottone.closest("form");
                formModifica.classList.add("was-validated");
                if (!formModifica.checkValidity()) {
                    return; // errori: li mostra Bootstrap sotto i campi
                }

                // Nuovo oggetto della classe giusta: lo scaffale potrebbe essere cambiato
                // e un oggetto non può cambiare classe dopo essere stato creato
                const libroModificato = creaLibro(
                    formModifica.querySelector(".modStato").value,
                    formModifica.querySelector(".modTitolo").value.trim(),
                    formModifica.querySelector(".modAutore").value.trim(),
                    formModifica.querySelector(".modAnno").value,
                    formModifica.querySelector(".modGenere").value,
                    formModifica.querySelector(".modTesto").value,
                    formModifica.querySelector(".modValore").value
                );
                libroModificato.id = libro.id; // stesso id del libro originale

                // map crea un array nuovo: il libro con quell'id viene sostituito, gli altri restano uguali
                // (stessa posizione nella lista, come faceva prima splice con 3 argomenti)
                books = books.map(book => book.id === id ? libroModificato : book);
                salvaLibri();

                aggiornaContatore();
                mostraLibri();
                mostraNotifica(`Il libro "${libroModificato.titolo}" è stato modificato!`);
                break;
            }
        }
    };

    lista.addEventListener('click', gestisciClick);   // bottoni della libreria
    listaRe.addEventListener('click', gestisciClick); // bottone Modifica delle recensioni

    // ===== FILTRI E ORDINAMENTO =====

    // Scegliendo un ordinamento, lo scaffale si adatta da solo:
    // il voto ce l'hanno solo i libri letti, la percentuale solo quelli in lettura
    ordinamento.addEventListener("change", () => {
        if (ordinamento.value.startsWith("voto")) {
            filtroScaffale.value = "read";
        } else if (ordinamento.value.startsWith("perc")) {
            filtroScaffale.value = "reading";
        }
        mostraLibri();
    });

    // Cambiando scaffale, se l'ordinamento scelto non ha più senso torna su "nessuno"
    // (es. ordinamento per voto e poi scelgo "Sto leggendo").
    // Titolo e anno invece valgono per qualsiasi scaffale
    // Questo listener scatta quando cambi scaffale nella select dei filtri. Prima di ridisegnare la libreria, controlla se l’ordinamento scelto ha ancora senso e, se non ce l’ha, lo riporta su “nessuno”. Perché serve. Non tutti gli ordinamenti vanno bene con tutti gli scaffali

    filtroScaffale.addEventListener("change", () => {
        const scaffale = filtroScaffale.value;
        const sempreOk = ordinamento.value.startsWith("titolo") || ordinamento.value.startsWith("anno");
        const votoOk = scaffale === "read" && ordinamento.value.startsWith("voto");
        const percOk = scaffale === "reading" && ordinamento.value.startsWith("perc");

        if (!sempreOk && !votoOk && !percOk) {
            ordinamento.value = "nessuno";
        }
        mostraLibri();
    });

    // ===== RICERCA =====
    // La ricerca ora fa parte di libriDaMostrare(): basta ridisegnare a ogni lettera
    searchInput.addEventListener("input", mostraLibri);

    // ===== CONTATORI =====

    const aggiornaContatore = () => {
        const tutti = books.length;
        // Si conta per stato e non con instanceof: un LibroInLettura segnato come letto
        // resta della sua classe, ma il suo stato diventa 'read'
        const letti = books.filter(book => book.stato === 'read').length;
        const inCorso = books.filter(book => book.stato === 'reading').length;
        const wishlist = books.filter(book => book.stato === 'wishlist').length;

        // Il numero di libri compare dentro il testo di ogni opzione della select
        filtroScaffale.querySelector('option[value="tutti"]').textContent = `Tutti (${tutti})`;
        filtroScaffale.querySelector('option[value="read"]').textContent = `Letti (${letti})`;
        filtroScaffale.querySelector('option[value="reading"]').textContent = `Sto leggendo (${inCorso})`;
        filtroScaffale.querySelector('option[value="wishlist"]').textContent = `Voglio leggere (${wishlist})`;

        // Niente da svuotare: il bottone si disattiva
        bottoneSvuota.disabled = books.length === 0;
    };

    aggiornaContatore();

    // ===== SVUOTA TUTTO =====

    // Parte solo dal bottone rosso DENTRO la modale, cioè dopo la conferma
    document.querySelector("#confermaSvuota").addEventListener("click", () => {
        books = [];                              // possibile solo perché books è "let"
        localStorage.removeItem(STORAGE_KEY);    // cancella la chiave dal browser
        aggiornaContatore();
        mostraLibri();
        bootstrap.Modal.getOrCreateInstance(modaleSvuota).hide();
        mostraNotifica("La libreria è stata svuotata.");
    });
}