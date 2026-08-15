// ========================================
// RED RISING CODEX
// ========================================


// ========================================
// READING PROGRESS
// ========================================

let currentBook = 1;
let currentChapter = 0;


// ========================================
// BOOK / CHAPTER HELPERS
// ========================================


// Find a book using its number.

function getBook(bookNumber) {

    return books.find(
        book => book.number === bookNumber
    );

}


// Get every chapter from a book.

function getChapters(bookNumber) {

    const book = getBook(bookNumber);

    if (!book) {
        return [];
    }

    return book.parts.flatMap(
        part => part.chapters
    );

}


// Find the name of the current book.

function getBookTitle(bookNumber) {

    const book = getBook(bookNumber);

    return book ? book.title : "";

}


// ========================================
// SPOILER POSITION
// ========================================


// Convert book + chapter into a number
// that allows us to compare reading positions.

function readingPosition(book, chapter) {

    return (book * 1000) + chapter;

}


// ========================================
// PROFILE SYSTEM
// ========================================


// Find the most recent profile that the reader
// has unlocked for a particular entity.

function getCurrentProfile(entity) {

    const readerPosition = readingPosition(
        currentBook,
        currentChapter
    );

    let currentProfile = null;

    entity.profiles.forEach(profile => {

        const profilePosition = readingPosition(
            profile.from.book,
            profile.from.chapter
        );

        if (profilePosition <= readerPosition) {

            if (
                currentProfile === null ||
                profilePosition >
                readingPosition(
                    currentProfile.from.book,
                    currentProfile.from.chapter
                )
            ) {

                currentProfile = profile;

            }

        }

    });

    return currentProfile;

}


// ========================================
// DISPLAY CHARACTERS
// ========================================

function displayCharacters() {

    const container =
        document.getElementById("codex-content");

    container.innerHTML = "";


    characters.forEach(character => {

        const profile =
            getCurrentProfile(character);


        // If the reader hasn't encountered
        // this character yet, don't show them.

        if (!profile) {
            return;
        }


        const card =
            document.createElement("div");

        card.className = "codex-card";


        let affiliationsHTML = "";

        if (profile.affiliations.length > 0) {

            affiliationsHTML = `
                <p>
                    <strong>Affiliations:</strong>
                    ${profile.affiliations.join(", ")}
                </p>
            `;

        }


        let relationshipsHTML = "";

        if (profile.relationships.length > 0) {

            relationshipsHTML = `
                <p>
                    <strong>Relationships:</strong>
                    ${profile.relationships.join(", ")}
                </p>
            `;

        }


        card.innerHTML = `

            <h3>${character.name}</h3>

            <p>
                <strong>Identity:</strong>
                ${profile.identity}
            </p>

            <p>
                ${profile.summary}
            </p>

            ${affiliationsHTML}

            ${relationshipsHTML}

        `;


        container.appendChild(card);

    });

}


// ========================================
// BOOK SELECTOR
// ========================================

function populateBooks() {

    const bookSelect =
        document.getElementById("book-select");

    bookSelect.innerHTML = "";


    books.forEach(book => {

        const option =
            document.createElement("option");

        option.value = book.number;

        option.textContent = book.title;

        bookSelect.appendChild(option);

    });


    bookSelect.value = currentBook;

}


// ========================================
// CHAPTER SELECTOR
// ========================================

function populateChapters() {

    const chapterSelect =
        document.getElementById("chapter-select");

    chapterSelect.innerHTML = "";


    const book = getBook(currentBook);

    if (!book) {
        return;
    }


    book.parts.forEach(part => {

        const group =
            document.createElement("optgroup");

        group.label = part.title;


        part.chapters.forEach(chapter => {

            const option =
                document.createElement("option");

            option.value = chapter.number;

            option.textContent =
                chapter.title;

            group.appendChild(option);

        });


        chapterSelect.appendChild(group);

    });


    chapterSelect.value = currentChapter;

}


// ========================================
// PROGRESS DISPLAY
// ========================================

function updateProgressDisplay() {

    const progressText =
        document.getElementById("current-progress");

    const bookTitle =
        getBookTitle(currentBook);


    const chapterSelect =
        document.getElementById("chapter-select");

    const selectedOption =
        chapterSelect.options[
            chapterSelect.selectedIndex
        ];


    progressText.textContent =
        `Reading progress: ${bookTitle}, ${selectedOption.textContent}`;


    displayCharacters();

}


// ========================================
// BOOK CHANGE
// ========================================

document
    .getElementById("book-select")
    .addEventListener(
        "change",
        function() {

            currentBook =
                Number(this.value);

            currentChapter = 0;

            populateChapters();

        }
    );


// ========================================
// UPDATE PROGRESS
// ========================================

document
    .getElementById("update-progress")
    .addEventListener(
        "click",
        function() {

            const chapterSelect =
                document.getElementById("chapter-select");


            currentChapter =
                Number(chapterSelect.value);


            updateProgressDisplay();


            localStorage.setItem(
                "redRisingBook",
                currentBook
            );


            localStorage.setItem(
                "redRisingChapter",
                currentChapter
            );

        }
    );


// ========================================
// LOAD SAVED PROGRESS
// ========================================

function loadSavedProgress() {

    const savedBook =
        localStorage.getItem(
            "redRisingBook"
        );

    const savedChapter =
        localStorage.getItem(
            "redRisingChapter"
        );


    if (savedBook !== null) {

        currentBook =
            Number(savedBook);

    }


    if (savedChapter !== null) {

        currentChapter =
            Number(savedChapter);

    }


    populateBooks();

    populateChapters();

    updateProgressDisplay();

}


// ========================================
// START
// ========================================

loadSavedProgress();
