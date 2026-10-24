const books = [
    {
        title: "L'importanza di chiamarsi Ernesto",
        author: 'Oscar Wilde',
        genre: 'narrativa',
        shelf: 'read',
        noteRe: "Una commedia teatrale brillante, ricca di ironia, equivoci ed eleganza stilistica. Wilde svela l'ipocrisia della società borghese dell'epoca con dialoghi incalzanti e aforismi memorabili.",
        rate: 78,
        data: new Date()
    },
    {
        title: 'Siddharta',
        author: 'Hermann Hesse',
        genre: 'narrativa',
        shelf: 'read',
        noteRe: "Un capolavoro spirituale ed filosofico che racconta il viaggio interiore di un giovane alla ricerca del senso della vita e della vera illuminazione, attraverso l'esperienza diretta e la riscoperta della pace interiore.",
        rate: 98,
        data: new Date(),
    },
    {
        title: 'Il delitto di Lord Arthur Savile',
        author: 'Oscar Wilde',
        genre: 'narrativa',
        shelf: 'reading',
        noteRe: "Sono a buon punto :D",
        rate: 50,
        data: new Date(),
    },
    {
        title: 'Silenzi',
        author: 'Emily Dickinson',
        genre: 'poesia',
        shelf: 'wishlist',
        noteRe: '',
        rate: '',
        data: new Date(),
    },
    {
        title: 'Persone normali',
        author: 'Sally Rooney',
        genre: 'romantico',
        shelf: 'wishlist',
        noteRe: '',
        rate: '',
        data: new Date(),
    },
    {
        title: "L'arte di amare",
        author: 'Erich Fromm',
        genre: 'saggistica',
        shelf: 'read',
        noteRe: "Un saggio fondamentale che analizza l'amore non come un semplice sentimento passivo, ma come un'arte che richiede impegno, consapevolezza, maturità e pratica quotidiana nei confronti di sé stessi e degli altri.",
        rate: 90,
        data: new Date(),
    },
];

const valoreTitle = document.querySelector("#title");
const valoreAuthor = document.querySelector("#author");
const valoreNoteRe = document.querySelector("#noteRecensione");
const valoreRating = document.querySelector("#rating");
const lista = document.querySelector("#ulLista");
const listaRe = document.querySelector("#ulListaRe");
const contatore = document.querySelector("#contatore");
const selettoreShelf = document.querySelector("#shelf");
const selettoreGenre = document.querySelector("#genre");
const bottoneStart = document.querySelector(".start");
const bottoneTutti = document.querySelector("#btnTutti");
const bottoneLetti = document.querySelector("#btnLetti");
const bottoneInCorso = document.querySelector("#btnInCorso");
const bottoneWishlist = document.querySelector("#btnWishlist");
const bottoneDarkMode = document.querySelector("#themeButton");
const sezioneRecensione = document.querySelector("#noteRe");
const labelNoteRe = document.querySelector('label[for="noteRecensione"]');
const labelRating = document.querySelector('label[for="rating"]');
const searchInput = document.querySelector("#searchInput");
const labelTitle = document.querySelector('label[for="title"]');

const aggiungiTitle = () => {
    const titolo = valoreTitle.value.trim();
    const author = valoreAuthor.value.trim();
    const ratingValue = Number(valoreRating.value);


    if (titolo !== "") {

        if (valoreRating.value !== "" && (ratingValue < 0 || ratingValue > 100)) {
            alert("Inserire un valore numerico tra 0 e 100!");
            return;
        }

        const newBook = {
            title: titolo,
            author: author,
            genre: selettoreGenre.value,
            shelf: selettoreShelf.value,
            noteRe: valoreNoteRe.value,
            rate: valoreRating.value,
            data: new Date(),
        };

        books.push(newBook);
        valoreTitle.value = "";
        valoreAuthor.value = "";
        valoreNoteRe.value = "";
        valoreRating.value = "";

        if (typeof aggiornaContatore === 'function') {
            aggiornaContatore();
        }
        alert(`Il libro "${titolo}" è stato aggiunto con successo!`);
    }

    //Cambia la visualizzazione di recensione e valutazione
    selettoreShelf.addEventListener('change', () => {
        const valoreScelto = selettoreShelf.value;

        if (valoreScelto === 'read') {
            sezioneRecensione.classList.remove('hide');
            labelNoteRe.textContent = "Recensione";
            labelRating.textContent = "Valutazione";
        } else if (valoreScelto === 'reading') {
            sezioneRecensione.classList.remove('hide');
            labelNoteRe.textContent = "Note";
            labelRating.textContent = "Percentuale completamento";
        } else {
            sezioneRecensione.classList.add('hide');
        }
    });

    lista.textContent = "";
    listaRe.textContent = "";

    books.forEach((book, index) => {
        const nuovoLi = document.createElement("li");
        const nuovoLiRe = document.createElement("li");

        nuovoLi.classList.add(book.shelf);
        nuovoLi.classList.add(book.genre);

        if (book.shelf === 'wishlist') {
            nuovoLiRe.classList.add("hide");
        }

        nuovoLiRe.classList.add(book.shelf);
        nuovoLiRe.classList.add(book.genre);

        const bookDiv = document.createElement("div");
        bookDiv.className = "divbook";

        const reBookTitle = document.createElement("div");
        reBookTitle.className = "divReBookTitle";

        const titleSpan = document.createElement('span');
        titleSpan.textContent = book.title;
        titleSpan.className = "title";

        const titleSpanRe = document.createElement('span');
        titleSpanRe.textContent = book.title;
        titleSpanRe.className = "title";

        const authorSpan = document.createElement('span');
        authorSpan.textContent = book.author;
        authorSpan.className = "author";

        const authorSpanRe = document.createElement('span');
        authorSpanRe.textContent = book.author;
        authorSpanRe.className = "author";

        const spanGenre = document.createElement("span");
        spanGenre.className = "badge";
        spanGenre.textContent = book.genre;

        const spanGenreRe = document.createElement("span");
        spanGenreRe.className = "badge";
        spanGenreRe.textContent = book.genre;

        const ratingSpan = document.createElement('span');
        ratingSpan.textContent = book.rate;
        ratingSpan.className = "rating";

        const ratingSpanRe = document.createElement('span');
        ratingSpanRe.textContent = book.rate;
        ratingSpanRe.className = "rating";

        const pRe = document.createElement('p');
        pRe.textContent = book.noteRe;
        pRe.className = "pRe";

        const barraContenitore = document.createElement('div');
        barraContenitore.className = "barraContenitore";

        const valoreRate = book.rate;

        const barraRiempimento = document.createElement("div");
        barraRiempimento.className = "barraRiempimento";
        barraRiempimento.style.width = `${valoreRate}%`;

        barraContenitore.appendChild(barraRiempimento);

        //percentuale
        if (book.shelf === 'reading') {
            ratingSpan.classList.add("percentuale");
            ratingSpanRe.classList.add("percentuale");
        }

        //stellina
        if (book.shelf === 'read') {
            ratingSpan.classList.add("stellina");
            ratingSpanRe.classList.add("stellina");
        }

        //nasconde barra
        if (book.shelf === 'wishlist') {
            barraContenitore.classList.remove("barraContenitore");
        }

        const reDivCen = document.createElement("div");
        reDivCen.className = "reDivCen";

        const btnDiv = document.createElement("div");
        btnDiv.className = "divBtn";

        const bottoneModifica = document.createElement("button");
        bottoneModifica.textContent = "Modifica";
        bottoneModifica.setAttribute("data-index", index);
        bottoneModifica.className = "btnModifica";
        bottoneModifica.type = "button";

        const bottoneElimina = document.createElement("button");
        bottoneElimina.textContent = "Elimina";
        bottoneElimina.setAttribute("data-index", index);
        bottoneElimina.className = "btnElimina";
        bottoneElimina.type = "button";

        bookDiv.appendChild(titleSpan);
        bookDiv.appendChild(authorSpan);
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
        reDivCen.appendChild(spanGenreRe);
        reDivCen.appendChild(ratingSpanRe);
        reBookTitle.appendChild(reDivCen);
        reBookTitle.appendChild(pRe);

        nuovoLiRe.appendChild(reBookTitle);
        listaRe.appendChild(nuovoLiRe);
    });
};

//impedisce all'utente di inserire un valore non numerico nella textarea
valoreRating.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
    alert("Inserire un valore numerico tra 0 e 100!");
    return;
});

if (bottoneStart) {
    bottoneStart.addEventListener("click", () => {

        const titolo = valoreTitle.value.trim();

        if (titolo === "") {
            alert("Errore: inserisci un titolo!");
            return;
        }

        aggiungiTitle();
    });
}

window.addEventListener("load", aggiungiTitle);

// Gestione dei click unificata per Modifica ed Elimina
lista.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        e.preventDefault();
        const index = e.target.getAttribute("data-index");

        // Azione Elimina
        if (e.target.classList.contains('btnElimina')) {
            books.splice(index, 1);

            if (typeof aggiornaContatore === 'function') {
                aggiornaContatore();
            }
            alert(`Il libro è stato eliminato con successo!`);
            aggiungiTitle();
        }

        // Azione Modifica
        if (e.target.classList.contains('btnModifica')) {
            const liCorrente = e.target.closest('li');

            const titleSpan = liCorrente.querySelector('.title');
            const authorSpan = liCorrente.querySelector('.author');

            if (e.target.textContent === "Salva") {
                const inputModifica = liCorrente.querySelector('.inputModifica');
                const inputAutore = liCorrente.querySelector('.inputModificaAutore');

                books[index].title = inputModifica.value;
                books[index].author = inputAutore.value;

                if (typeof aggiornaContatore === 'function') {
                    aggiornaContatore();
                }
                aggiungiTitle();
                alert(`Il libro è stato modificato con successo!`);
            } else {
                const titoloAttuale = books[index].title;
                const autoreAttuale = books[index].author;

                titleSpan.innerHTML = `<input type="text" class="inputModifica" value="${titoloAttuale}">`;
                authorSpan.innerHTML = `<input type="text" class="inputModificaAutore" value="${autoreAttuale}">`;

                e.target.textContent = "Salva";
            }
        }
    }
});


// Gestione dei bottoni di filtro
if (bottoneTutti) {
    bottoneTutti.addEventListener("click", (e) => {
        e.preventDefault();
        const elementiLi = document.querySelectorAll("#lista li");
        elementiLi.forEach(li => {
            li.classList.remove("hide");
        });
        aggiornaContatore();
    });
}

if (bottoneLetti) {
    bottoneLetti.addEventListener("click", (e) => {
        e.preventDefault();
        const elementiLi = document.querySelectorAll("#lista li");
        elementiLi.forEach(li => {
            if (li.classList.contains("read")) {
                li.classList.add("hide");
            } else {
                li.classList.remove("hide");
            }
        });
        aggiornaContatore();
    });
}

if (bottoneInCorso) {
    bottoneInCorso.addEventListener('click', (e) => {
        e.preventDefault();
        const elementiLi = document.querySelectorAll("#lista li");
        elementiLi.forEach(li => {
            if (li.classList.contains("reading")) {
                li.classList.remove("hide");
            } else {
                li.classList.add("hide");
            }
        });
        aggiornaContatore();
    });
}
if (bottoneWishlist) {
    bottoneWishlist.addEventListener('click', (e) => {
        e.preventDefault();
        const elementiLi = document.querySelectorAll("#lista li");
        elementiLi.forEach(li => {
            if (li.classList.contains("wishlist")) {
                li.classList.remove("hide");
            } else {
                li.classList.add("hide");
            }
        });
        aggiornaContatore();
    });
}

//searchbar

searchInput.addEventListener("input", (e) => {
    const testoRicerca = e.target.value.toLowerCase();
    const elementiLi = document.querySelectorAll("#ulLista li");

    elementiLi.forEach(li => {
        const titolo = li.querySelector(".title").textContent.toLowerCase();
        const autore = li.querySelector(".author").textContent.toLowerCase();

        if (titolo.includes(testoRicerca) || autore.includes(testoRicerca)) {
            li.style.display = "";
        } else {
            li.style.display = "none";
        }
    });
});

const aggiornaContatore = () => {
    const tutti = books.length;
    const letti = books.filter(book => book.shelf === 'read').length;
    const inCorso = books.filter(book => book.shelf === 'reading').length;
    const wishlist = books.filter(book => book.shelf === 'wishlist').length;

    // Aggiorna il testo degli span HTML con i nuovi id
    document.querySelector("#countTutti").textContent = tutti;
    document.querySelector("#countLetti").textContent = letti;
    document.querySelector("#countInCorso").textContent = inCorso;
    document.querySelector("#countWishlist").textContent = wishlist;
};

aggiornaContatore();

if (bottoneDarkMode) {
    bottoneDarkMode.addEventListener("click", () => {
        document.body.classList.toggle("darkMode");
    });
}