// ===== CLASSI =====

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
        return `${super.descriviStato()} – ${this.valutazione} ★`;
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

// ===== DATI INIZIALI =====

// Ogni libro è un'istanza di una classe: la classe sostituisce la vecchia proprietà shelf.
// Ordine degli argomenti: titolo, autore, anno, genere, (recensione/note), (valutazione/percentuale)
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
const bottoneTutti = document.querySelector("#btnTutti");
const bottoneLetti = document.querySelector("#btnLetti");
const bottoneInCorso = document.querySelector("#btnInCorso");
const bottoneWishlist = document.querySelector("#btnWishlist");
const bottoneDarkMode = document.querySelector("#themeButton");
const sezioneRecensione = document.querySelector("#noteRe");
const labelNoteRe = document.querySelector('label[for="noteRecensione"]');
const labelRating = document.querySelector('label[for="rating"]');
const searchInput = document.querySelector("#searchInput");
const modaleLibro = document.querySelector("#modaleLibro");               // la modale con il form
const collapseRecensioni = document.querySelector("#collapseRecensioni"); // il blocco apribile delle recensioni
const testoBottoneRecensioni = document.querySelector("#btnRecensioni .testoBottone");

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

// ===== AGGIUNTA E VISUALIZZAZIONE =====

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
        valoreTitle.value = "";
        valoreAuthor.value = "";
        valoreYear.value = ""; // svuota anche il campo anno dopo l'invio
        valoreNoteRe.value = "";
        valoreRating.value = "";

        if (typeof aggiornaContatore === 'function') {
            aggiornaContatore();
        }
    }

    lista.textContent = "";
    listaRe.textContent = "";

    books.forEach((book) => {
        // I nomi delle proprietà dipendono dalla classe: instanceof controlla di che classe è
        // il libro e prende quelle giuste. Per un Libro in wishlist restano stringhe vuote.
        let valore = '';
        let testo = '';

        if (book instanceof LibroLetto) {
            valore = book.valutazione;
            testo = book.recensione;
        } else if (book instanceof LibroInLettura) {
            valore = book.percentuale;
            testo = book.note;
        }

        // Riga della libreria: d-flex affianca dati e bottoni, flex-wrap li manda a capo se non c'è spazio.
        // book.stato ha gli stessi valori del vecchio shelf, quindi le classi CSS funzionano ancora.
        const nuovoLi = document.createElement("li");
        nuovoLi.classList.add("d-flex", "flex-wrap", "justify-content-between", "align-items-center",
            "gap-2", "py-2", "border-bottom", book.stato);

        // Riga delle recensioni: riquadro arrotondato (rounded-4) con spazio interno (p-3)
        const nuovoLiRe = document.createElement("li");
        nuovoLiRe.classList.add("recensione", "rounded-4", "p-3", "my-2", book.stato);

        // classList.add("") darebbe errore: aggiungo il genere solo se c'è
        if (book.genere) {
            nuovoLi.classList.add(book.genere);
            nuovoLiRe.classList.add(book.genere);
        }

        if (book.stato === 'wishlist') {
            nuovoLiRe.classList.add("d-none");
        }

        const bookDiv = document.createElement("div");
        bookDiv.className = "divbook";

        const reBookTitle = document.createElement("div");
        reBookTitle.className = "divReBookTitle";

        const titleSpan = document.createElement('span');
        titleSpan.textContent = book.titolo;
        titleSpan.className = "title";

        const titleSpanRe = document.createElement('span');
        titleSpanRe.textContent = book.titolo;
        titleSpanRe.className = "title";

        const authorSpan = document.createElement('span');
        authorSpan.textContent = book.autore;
        authorSpan.className = "author";

        const authorSpanRe = document.createElement('span');
        authorSpanRe.textContent = book.autore;
        authorSpanRe.className = "author";

        // Anno: due span separati perché un elemento può stare in un solo punto della pagina
        const annoSpan = document.createElement('span');
        annoSpan.className = "anno";

        const annoSpanRe = document.createElement('span');
        annoSpanRe.className = "anno";

        // Se l'anno è vuoto lo span resta vuoto (niente parentesi vuote)
        if (book.anno) {
            annoSpan.textContent = `(${book.anno})`;
            annoSpanRe.textContent = `(${book.anno})`;
        }

        // Genere: componente "badge" di Bootstrap. text-reset usa il colore del testo intorno,
        // fw-normal toglie il grassetto, border aggiunge il bordo
        const classiBadge = "badge rounded-pill fw-normal text-uppercase text-reset border ms-2";

        const spanGenre = document.createElement("span");
        spanGenre.className = classiBadge;
        spanGenre.textContent = book.genere;

        const spanGenreRe = document.createElement("span");
        spanGenreRe.className = classiBadge;
        spanGenreRe.textContent = book.genere;

        // Nessun genere: niente badge vuoto
        if (!book.genere) {
            spanGenre.classList.add("d-none");
            spanGenreRe.classList.add("d-none");
        }

        const ratingSpan = document.createElement('span');
        ratingSpan.textContent = valore;
        ratingSpan.className = "rating";

        const ratingSpanRe = document.createElement('span');
        ratingSpanRe.textContent = valore;
        ratingSpanRe.className = "rating ms-2";

        const pRe = document.createElement('p');
        pRe.textContent = testo;
        pRe.className = "pRe mt-2 mb-0";

        // Barra di avanzamento: componente "progress" di Bootstrap.
        // Il contenitore è .progress, la parte piena è .progress-bar (larghezza = valore %)
        const barraContenitore = document.createElement('div');
        barraContenitore.className = "progress barra";
        barraContenitore.setAttribute("role", "progressbar");
        barraContenitore.setAttribute("aria-valuemin", "0");
        barraContenitore.setAttribute("aria-valuemax", "100");
        barraContenitore.setAttribute("aria-valuenow", valore);

        const barraRiempimento = document.createElement("div");
        barraRiempimento.className = "progress-bar";
        barraRiempimento.style.width = `${valore}%`;

        barraContenitore.appendChild(barraRiempimento);

        //percentuale
        if (book.stato === 'reading') {
            ratingSpan.classList.add("percentuale");
            ratingSpanRe.classList.add("percentuale");
        }

        //stellina
        if (book.stato === 'read') {
            ratingSpan.classList.add("stellina");
            ratingSpanRe.classList.add("stellina");
        }

        //nasconde barra
        if (book.stato === 'wishlist') {
            barraContenitore.classList.add("d-none");
        }

        const reDivCen = document.createElement("div");
        reDivCen.className = "reDivCen text-center";

        const btnDiv = document.createElement("div");
        btnDiv.className = "divBtn d-flex align-items-center gap-2";

        // Bottoni con lo stile di Bootstrap (btn, btn-sm) e i colori di Lybra (btn-lybra)
        const bottoneModifica = document.createElement("button");
        bottoneModifica.textContent = "Modifica";
        // data-id invece di data-index: l'id non cambia anche se l'array viene modificato
        bottoneModifica.setAttribute("data-id", book.id);
        bottoneModifica.className = "btnModifica btn btn-sm btn-lybra rounded-pill";
        bottoneModifica.type = "button";

        const bottoneElimina = document.createElement("button");
        bottoneElimina.textContent = "Elimina";
        bottoneElimina.setAttribute("data-id", book.id);
        bottoneElimina.className = "btnElimina btn btn-sm btn-lybra rounded-pill";
        bottoneElimina.type = "button";

        bookDiv.appendChild(titleSpan);
        bookDiv.appendChild(authorSpan);
        bookDiv.appendChild(annoSpan);
        bookDiv.appendChild(spanGenre);
        btnDiv.appendChild(ratingSpan);
        btnDiv.appendChild(barraContenitore);
        btnDiv.appendChild(bottoneModifica);
        btnDiv.appendChild(bottoneElimina);
        nuovoLi.appendChild(bookDiv);
        nuovoLi.appendChild(btnDiv);
        lista.appendChild(nuovoLi);

        reDivCen.appendChild(titleSpanRe);
        reDivCen.appendChild(authorSpanRe);
        reDivCen.appendChild(annoSpanRe);
        reDivCen.appendChild(spanGenreRe);
        reDivCen.appendChild(ratingSpanRe);
        reBookTitle.appendChild(reDivCen);
        reBookTitle.appendChild(pRe);

        nuovoLiRe.appendChild(reBookTitle);
        listaRe.appendChild(nuovoLiRe);
    });

    // La lista ridisegnata mostra tutti i libri: evidenzio il filtro "Tutti"
    // (attivaFiltro è definita più sotto, ma qui viene usata solo quando il file è già stato letto tutto)
    if (typeof attivaFiltro === 'function') {
        attivaFiltro(bottoneTutti);
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

window.addEventListener("load", aggiungiTitle);

// ===== MODIFICA =====

// Crea il form di modifica di un libro, già compilato con i suoi dati
const creaFormModifica = (libro) => {
    const form = document.createElement("form");
    // row g-2: griglia di Bootstrap, i campi si affiancano su più colonne; w-100: tutta la riga
    form.className = "formModifica row g-2 w-100";
    form.noValidate = true; // come novalidate nell'HTML: errori mostrati da Bootstrap

    // Struttura dei campi (i valori li inseriamo dopo con .value: così titoli
    // con le virgolette non "rompono" l'attributo value)
    // Nota: nel pattern del titolo scrivo \\S (due barre) perché dentro i backtick
    // una barra da sola verrebbe "mangiata" da JavaScript e nell'HTML arriverebbe solo S
    form.innerHTML = `
        <div class="col-md-5">
            <label class="form-label small mb-0">Titolo *</label>
            <input type="text" class="form-control form-control-sm modTitolo" maxlength="100" pattern=".*\\S.*" required>
            <div class="invalid-feedback">Inserisci il titolo.</div>
        </div>
        <div class="col-md-4">
            <label class="form-label small mb-0">Autore</label>
            <input type="text" class="form-control form-control-sm modAutore" maxlength="60">
        </div>
        <div class="col-md-3">
            <label class="form-label small mb-0">Anno</label>
            <input type="number" class="form-control form-control-sm modAnno">
            <div class="invalid-feedback">Anno non valido.</div>
        </div>
        <div class="col-md-6">
            <label class="form-label small mb-0">Genere</label>
            <select class="form-select form-select-sm modGenere">
                <option value="">&nbsp</option>
                <option value="narrativa">Narrativa</option>
                <option value="poesia">Poesia</option>
                <option value="saggistica">Saggistica</option>
                <option value="romantico">Romantico</option>
                <option value="altra">Altro</option>
            </select>
        </div>
        <div class="col-md-6">
            <label class="form-label small mb-0">Scaffale</label>
            <select class="form-select form-select-sm modStato">
                <option value="read">Letto</option>
                <option value="reading">Sto leggendo</option>
                <option value="wishlist">Voglio leggere</option>
            </select>
        </div>
        <div class="col-md-9 campoExtra">
            <label class="form-label small mb-0 labelTesto">Recensione</label>
            <textarea class="form-control form-control-sm modTesto" rows="3" maxlength="1000"></textarea>
        </div>
        <div class="col-md-3 campoExtra">
            <label class="form-label small mb-0 labelValore">Valutazione</label>
            <input type="number" class="form-control form-control-sm modValore" min="0" max="100">
            <div class="invalid-feedback">Da 0 a 100.</div>
        </div>
        <div class="col-12 d-flex justify-content-end gap-2">
            <button type="button" class="btnSalva btn btn-sm btn-lybra rounded-pill" data-id="${libro.id}">Salva</button>
            <button type="button" class="btnAnnulla btn btn-sm btn-outline-secondary rounded-pill">Annulla</button>
        </div>
    `;

    // Inserisco i valori attuali del libro nei campi
    form.querySelector(".modTitolo").value = libro.titolo;
    form.querySelector(".modAutore").value = libro.autore;
    form.querySelector(".modAnno").value = libro.anno;
    form.querySelector(".modGenere").value = libro.genere;
    form.querySelector(".modStato").value = libro.stato;

    // Recensione/note e valutazione/percentuale dipendono dalla classe del libro
    if (libro instanceof LibroLetto) {
        form.querySelector(".modTesto").value = libro.recensione;
        form.querySelector(".modValore").value = libro.valutazione;
    } else if (libro instanceof LibroInLettura) {
        form.querySelector(".modTesto").value = libro.note;
        form.querySelector(".modValore").value = libro.percentuale;
    }

    // Anno: stesso massimo e stessi limiti del form principale
    form.querySelector(".modAnno").max = new Date().getFullYear();
    limitaAnno(form.querySelector(".modAnno"));

    // Mostra/nasconde recensione e valutazione in base allo scaffale scelto
    const selectStato = form.querySelector(".modStato");
    const aggiornaCampiExtra = () => {
        const stato = selectStato.value;
        // toggle con 2 argomenti: aggiunge d-none se la condizione è vera, lo toglie se è falsa
        form.querySelectorAll(".campoExtra").forEach(div => {
            div.classList.toggle("d-none", stato === "wishlist");
        });
        form.querySelector(".labelTesto").textContent = stato === "reading" ? "Note" : "Recensione";
        form.querySelector(".labelValore").textContent = stato === "reading" ? "Percentuale" : "Valutazione";
    };
    selectStato.addEventListener("change", aggiornaCampiExtra);
    aggiornaCampiExtra(); // la prima volta, per lo stato attuale del libro

    return form;
};

// Gestione dei click unificata per Modifica, Annulla, Salva ed Elimina
lista.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        e.preventDefault();
        const id = e.target.getAttribute("data-id");
        // find restituisce il libro con quell'id. È un RIFERIMENTO all'oggetto nell'array,
        // non una copia: modificare libro modifica il libro dentro books.
        const libro = books.find(book => book.id === id);

        // Azione Elimina
        if (e.target.classList.contains('btnElimina')) {
            // findIndex restituisce la posizione del libro, che serve a splice per eliminarlo
            const posizione = books.findIndex(book => book.id === id);
            books.splice(posizione, 1);

            if (typeof aggiornaContatore === 'function') {
                aggiornaContatore();
            }
            aggiungiTitle();
        }

        // Azione Modifica: la riga diventa il form di modifica
        if (e.target.classList.contains('btnModifica')) {
            const liCorrente = e.target.closest('li');
            liCorrente.textContent = "";                          // svuota la riga
            liCorrente.appendChild(creaFormModifica(libro));      // e ci mette il form
        }

        // Azione Annulla: ridisegna la lista, la riga torna normale
        if (e.target.classList.contains('btnAnnulla')) {
            aggiungiTitle();
        }

        // Azione Salva: valida il form di modifica e sostituisce il libro
        if (e.target.classList.contains('btnSalva')) {
            const formModifica = e.target.closest('form');
            formModifica.classList.add('was-validated');
            if (!formModifica.checkValidity()) {
                return; // errori: li mostra Bootstrap sotto i campi
            }

            // Nuovo oggetto della classe giusta: lo scaffale potrebbe essere cambiato
            // e un oggetto non può cambiare classe dopo essere stato creato
            const libroModificato = creaLibro(
                formModifica.querySelector('.modStato').value,
                formModifica.querySelector('.modTitolo').value.trim(),
                formModifica.querySelector('.modAutore').value.trim(),
                formModifica.querySelector('.modAnno').value,
                formModifica.querySelector('.modGenere').value,
                formModifica.querySelector('.modTesto').value,
                formModifica.querySelector('.modValore').value
            );
            libroModificato.id = libro.id; // stesso id del libro originale

            // splice con 3 argomenti: toglie 1 elemento e mette al suo posto quello nuovo
            const posizione = books.findIndex(book => book.id === id);
            books.splice(posizione, 1, libroModificato);

            aggiornaContatore();
            aggiungiTitle();
            mostraNotifica(`Il libro "${libroModificato.titolo}" è stato modificato!`);
        }
    }
});

// ===== FILTRI =====
// Per nascondere uso d-none, la classe di Bootstrap che sostituisce la vecchia .hide

// Evidenzia il filtro scelto: "active" è la classe di Bootstrap per il bottone selezionato
const bottoniFiltro = [bottoneTutti, bottoneLetti, bottoneInCorso, bottoneWishlist];
const attivaFiltro = (bottone) => {
    bottoniFiltro.forEach(b => b.classList.remove("active"));
    bottone.classList.add("active");
};

if (bottoneTutti) {
    bottoneTutti.addEventListener("click", (e) => {
        e.preventDefault();
        attivaFiltro(bottoneTutti);
        const elementiLi = document.querySelectorAll("#lista li");
        elementiLi.forEach(li => {
            li.classList.remove("d-none");
        });
        aggiornaContatore();
    });
}

if (bottoneLetti) {
    bottoneLetti.addEventListener("click", (e) => {
        e.preventDefault();
        attivaFiltro(bottoneLetti);
        const elementiLi = document.querySelectorAll("#lista li");
        elementiLi.forEach(li => {
            // Corretto: prima add e remove erano invertiti e il filtro nascondeva i libri letti
            if (li.classList.contains("read")) {
                li.classList.remove("d-none");
            } else {
                li.classList.add("d-none");
            }
        });
        aggiornaContatore();
    });
}

if (bottoneInCorso) {
    bottoneInCorso.addEventListener('click', (e) => {
        e.preventDefault();
        attivaFiltro(bottoneInCorso);
        const elementiLi = document.querySelectorAll("#lista li");
        elementiLi.forEach(li => {
            if (li.classList.contains("reading")) {
                li.classList.remove("d-none");
            } else {
                li.classList.add("d-none");
            }
        });
        aggiornaContatore();
    });
}

if (bottoneWishlist) {
    bottoneWishlist.addEventListener('click', (e) => {
        e.preventDefault();
        attivaFiltro(bottoneWishlist);
        const elementiLi = document.querySelectorAll("#lista li");
        elementiLi.forEach(li => {
            if (li.classList.contains("wishlist")) {
                li.classList.remove("d-none");
            } else {
                li.classList.add("d-none");
            }
        });
        aggiornaContatore();
    });
}

// ===== RICERCA =====

searchInput.addEventListener("input", (e) => {
    const testoRicerca = e.target.value.toLowerCase();
    const elementiLi = document.querySelectorAll("#ulLista li");

    elementiLi.forEach(li => {
        const spanTitolo = li.querySelector(".title");
        if (!spanTitolo) return; // riga in modifica: non ha lo span, la salto (return = passa al prossimo li)

        const titolo = spanTitolo.textContent.toLowerCase();
        const autore = li.querySelector(".author").textContent.toLowerCase();

        if (titolo.includes(testoRicerca) || autore.includes(testoRicerca)) {
            li.style.display = "";
        } else {
            li.style.display = "none";
        }
    });
});

// ===== CONTATORI =====

const aggiornaContatore = () => {
    const tutti = books.length;
    // Si conta per stato e non con instanceof: un LibroInLettura segnato come letto
    // resta della sua classe, ma il suo stato diventa 'read'
    const letti = books.filter(book => book.stato === 'read').length;
    const inCorso = books.filter(book => book.stato === 'reading').length;
    const wishlist = books.filter(book => book.stato === 'wishlist').length;

    // Aggiorna il testo degli span HTML con i nuovi id
    document.querySelector("#countTutti").textContent = tutti;
    document.querySelector("#countLetti").textContent = letti;
    document.querySelector("#countInCorso").textContent = inCorso;
    document.querySelector("#countWishlist").textContent = wishlist;
};

aggiornaContatore();

// ===== TEMA CHIARO / SCURO =====

// Usa il sistema di temi di Bootstrap 5.3: l'attributo data-bs-theme su <html>
// scurisce automaticamente form, bottoni e componenti. I colori di Lybra sono nel CSS.
if (bottoneDarkMode) {
    const iconaTema = bottoneDarkMode.querySelector("i"); // l'icona Font Awesome nel bottone

    bottoneDarkMode.addEventListener("click", () => {
        const html = document.documentElement; // l'elemento <html>
        const scuro = html.dataset.bsTheme !== "dark"; // true se stiamo passando al tema scuro
        html.dataset.bsTheme = scuro ? "dark" : "light";

        // Nel tema scuro mostro il sole (per tornare al chiaro), nel chiaro la luna
        iconaTema.classList.toggle("fa-sun", scuro);
        iconaTema.classList.toggle("fa-moon", !scuro);
    });
}