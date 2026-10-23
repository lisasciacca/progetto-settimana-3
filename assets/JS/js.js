const books = [
    {
        title: "L'importanza di chiamarsi Ernesto",
        author: 'Oscar Wilde',
        genre: 'narrativa',
        shelf: 'read',
        noteRe: '-',
        rate: 78,
        data: new Date()
    },
    {
        title: 'Siddharta',
        author: 'Hermann Hessee',
        genre: 'narrativa',
        shelf: 'read',
        noteRe: '',
        rate: 98,
        data: new Date(),
    },
    {
        title: 'Il delitto di Lord Arthur Savile',
        author: 'Oscar Wilde',
        genre: 'narrativa',
        shelf: 'reading',
        noteRe: '',
        rate: '',
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
        noteRe: '',
        rate: 90,
        data: new Date(),
    },
];

const valoreTitle = document.querySelector("#title");
const valoreAuthor = document.querySelector("#author");
const valoreNoteRe = document.querySelector("#noteRecensione");
const valoreRating = document.querySelector("#rating");
const lista = document.querySelector("#ulLista");
const contatore = document.querySelector("#contatore");
const selettoreShelf = document.querySelector("#shelf");
const selettoreGenre = document.querySelector("#genre");
const bottoneStart = document.querySelector(".start");
const bottoneTutti = document.querySelector("#btnTutti");
const bottoneLetti = document.querySelector("#btnLetti");
const bottoneInCorso = document.querySelector("#btnInCorso");
const bottoneWishlist = document.querySelector("#btnWishlist");

const aggiungiTitle = () => {
    const titolo = valoreTitle.value.trim();
    const author = valoreAuthor.value.trim();

    if (titolo !== "") {
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
    }

    lista.textContent = "";

    books.forEach((book, index) => {
        const nuovoLi = document.createElement("li");

        nuovoLi.classList.add(book.shelf);
        nuovoLi.classList.add(book.genre);

        const bookDiv = document.createElement("div");
        bookDiv.className = "divbook";

        const titleSpan = document.createElement('span');
        titleSpan.textContent = book.title;
        titleSpan.className = "title";

        const authorSpan = document.createElement('span');
        authorSpan.textContent = book.author;
        authorSpan.className = "author";

        const spanGenre = document.createElement("span");
        spanGenre.className = "badge";
        spanGenre.textContent = book.genre;

        /*const spanShelf = document.createElement("span");
        spanShelf.className = "badge";
        spanShelf.textContent = book.shelf;*/

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
        // bookDiv.appendChild(spanShelf);
        btnDiv.appendChild(bottoneModifica);
        btnDiv.appendChild(bottoneElimina);
        nuovoLi.appendChild(bookDiv);
        nuovoLi.appendChild(btnDiv);
        lista.appendChild(nuovoLi);
    });
};

if (bottoneStart) {
    bottoneStart.addEventListener("click", aggiungiTitle);
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