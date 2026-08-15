// ========================================
// RED RISING CODEX
// ========================================

// Test information for our spoiler system.
// Each fact has a book and chapter where it becomes safe to reveal.

const codexData = [

    {
        type: "character",
        name: "Darrow",
        book: 1,
        chapter: 1,
        title: "Darrow",
        text: "Darrow is a Red miner living beneath the surface of Mars."
    },

    {
        type: "character",
        name: "Eo",
        book: 1,
        chapter: 1,
        title: "Eo",
        text: "Eo is Darrow's wife."
    },

    {
        type: "character",
        name: "Sevro",
        book: 1,
        chapter: 5,
        title: "Sevro",
        text: "Sevro is a Gold associated with the Howlers."
    },

    {
        type: "location",
        name: "Mars",
        book: 1,
        chapter: 1,
        title: "Mars",
        text: "Mars is the setting for much of the beginning of Darrow's story."
    },

    {
        type: "faction",
        name: "The Society",
        book: 1,
        chapter: 2,
        title: "The Society",
        text: "The Society is the ruling social and political order of the world Darrow inhabits."
    },

    {
        type: "test",
        name: "Golden Son",
        book: 2,
        chapter: 1,
        title: "Golden Son",
        text: "This information should remain hidden until the reader reaches Golden Son."
    }

];


// Current reading position

let currentBook = 1;
let currentChapter = 1;


// Convert a book/chapter combination into a number
// so that we can easily determine which information
// the reader has unlocked.

function readingPosition(book, chapter) {
    return (book * 1000) + chapter;
}


// Determine whether a piece of information is safe to show.

function isUnlocked(item) {

    const readerPosition = readingPosition(
        currentBook,
        currentChapter
    );

    const itemPosition = readingPosition(
        item.book,
        item.chapter
    );

    return itemPosition <= readerPosition;
}


// Display all currently unlocked information.

function displayCodex() {

    const container = document.getElementById("codex-content");

    container.innerHTML = "";

    const unlockedItems = codexData.filter(isUnlocked);

    if (unlockedItems.length === 0) {

        container.innerHTML = `
            <p>No information has been unlocked yet.</p>
        `;

        return;
    }


    unlockedItems.forEach(item => {

        const card = document.createElement("div");

        card.className = "codex-card";

        card.innerHTML = `
            <h3>${item.title}</h3>
            <p>${item.text}</p>
        `;

        container.appendChild(card);

    });

}


// Update the progress display.

function updateProgressDisplay() {

    const bookSelect = document.getElementById("book-select");
    const chapterInput = document.getElementById("chapter-input");
    const progressText = document.getElementById("current-progress");

    currentBook = Number(bookSelect.value);
    currentChapter = Number(chapterInput.value);

    progressText.textContent =
        `Reading progress: ${bookSelect.options[bookSelect.selectedIndex].text}, Chapter ${currentChapter}`;

    displayCodex();

}


// Save progress when the button is clicked.

document.getElementById("update-progress").addEventListener(
    "click",
    function() {

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


// Load saved progress when the page opens.

function loadSavedProgress() {

    const savedBook = localStorage.getItem("redRisingBook");
    const savedChapter = localStorage.getItem("redRisingChapter");

    if (savedBook !== null) {
        currentBook = Number(savedBook);
    }

    if (savedChapter !== null) {
        currentChapter = Number(savedChapter);
    }


    document.getElementById("book-select").value = currentBook;

    document.getElementById("chapter-input").value = currentChapter;

    updateProgressDisplay();

}


// Start the website.

loadSavedProgress();
