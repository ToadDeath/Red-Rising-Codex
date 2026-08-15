// ========================================
// RED RISING CODEX
// ========================================


// ========================================
// READING PROGRESS
// ========================================

let currentBook = 1;
let currentChapter = 1;


// ========================================
// BASIC HELPERS
// ========================================


// Find a book by number.

function getBook(bookNumber) {

    return books.find(
        book => book.number === bookNumber
    );

}


// Find an entity by ID.

function getEntity(entityId) {

    return entities.find(
        entity => entity.id === entityId
    );

}


// Get the current reading position as a number.

function readingPosition(book, chapter) {

    return (book * 1000) + chapter;

}


// Get the reader's current position.

function getCurrentReadingPosition() {

    return readingPosition(
        currentBook,
        currentChapter
    );

}


// ========================================
// PROFILE SYSTEM
// ========================================


// Find the most recent profile that has
// been unlocked for an entity.

function getCurrentProfile(entity) {

    const readerPosition =
        getCurrentReadingPosition();

    let currentProfile = null;


    entity.profiles.forEach(profile => {

        const profilePosition =
            readingPosition(
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
// ENTITY VISIBILITY
// ========================================


// Determine whether the reader has encountered
// an entity yet.

function isEntityUnlocked(entity) {

    return getCurrentProfile(entity) !== null;

}


// ========================================
// ENTITY LINKS
// ========================================


// Turn an entity ID into a clickable link,
// but only if the reader has encountered it.

function createEntityLink(
    entityId,
    description = null
) {

    const entity =
        getEntity(entityId);


    if (!entity) {
        return "";
    }


    if (!isEntityUnlocked(entity)) {
        return "";
    }


    const text =
        description || entity.name;


    return `
        <a
            href="#/entity/${entity.id}"
            class="entity-link"
        >
            ${text}
        </a>
    `;

}


// ========================================
// INLINE ENTITY REFERENCES
// ========================================

// Turn entity names inside normal prose into
// clickable links when those entities are unlocked.

function renderLinkedText(item) {

    if (!item) {
        return "";
    }


    // Plain text still works normally.

    if (typeof item === "string") {
        return item;
    }


    if (!item.text) {
        return "";
    }


    let text =
        item.text;


    if (!item.links) {
        return escapeHTML(text);
    }


    // Escape the original text first.
    // This prevents the prose itself from
    // accidentally being interpreted as HTML.

    text =
        escapeHTML(text);


    const linkNames =
        Object.keys(item.links);


    // Replace longer names first so that
    // names containing other names don't
    // interfere with one another.

    linkNames.sort(
        (a, b) =>
            b.length - a.length
    );


    linkNames.forEach(linkText => {

        const entityId =
            item.links[linkText];


        const entity =
            getEntity(entityId);


        // If the entity hasn't been revealed yet,
        // leave the name as ordinary text.

        if (
            !entity ||
            !isEntityUnlocked(entity)
        ) {
            return;
        }


        const escapedLinkText =
            escapeHTML(linkText);


        const escapedRegex =
            linkText.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );


        const regex =
            new RegExp(
                escapedRegex,
                "g"
            );


        const link =
            `<a href="#/entity/${entity.id}" class="entity-link">${escapedLinkText}</a>`;


        text =
            text.replace(
                regex,
                link
            );

    });


    return text;

}


// ========================================
// HTML ESCAPING
// ========================================

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ========================================
// CATEGORY INFORMATION
// ========================================

const categoryInfo = {

    character: {
        title: "Characters",
        description:
            "The people you have encountered so far."
    },

    location: {
        title: "Locations",
        description:
            "Places you have encountered so far."
    },

    house: {
        title: "Houses",
        description:
            "The Houses and their members."
    },

    faction: {
        title: "Factions",
        description:
            "Organizations and political groups."
    },

    concept: {
        title: "Concepts",
        description:
            "Important ideas, terminology, technology, and customs."
    },

    event: {
        title: "Events",
        description:
            "Important events you have encountered."
    }

};


// ========================================
// CATEGORY ORDER
// ========================================

const categoryOrder = [

    "character",
    "location",
    "house",
    "faction",
    "concept",
    "event"

];


// ========================================
// HOMEPAGE
// ========================================

function renderHomePage() {

    const app =
        document.getElementById("app");


    app.innerHTML = `

        <section class="hero">

            <h1>Your Codex</h1>

            <p>
                Explore the world of Red Rising
                without spoiling what's ahead.
            </p>

            <button
                class="progress-button"
                onclick="openProgressSettings()"
            >
                Reading Progress
            </button>

        </section>


        <section class="categories">

            <h2>Explore</h2>

            <div
                id="category-grid"
                class="category-grid"
            ></div>

        </section>

    `;


    renderCategories();

}


// ========================================
// CATEGORY CARDS
// ========================================

function renderCategories() {

    const container =
        document.getElementById("category-grid");


    container.innerHTML = "";


    categoryOrder.forEach(category => {

        const info =
            categoryInfo[category];


        const unlockedEntities =
            entities.filter(entity => {

                return (
                    entity.category === category &&
                    isEntityUnlocked(entity)
                );

            });


        // Don't display empty categories.

        if (unlockedEntities.length === 0) {
            return;
        }


        const card =
            document.createElement("a");

        card.href =
            `#/category/${category}`;

        card.className =
            "category-card";


        card.innerHTML = `

            <div class="category-card-title">
                ${info.title}
            </div>

            <div class="category-card-count">
                ${unlockedEntities.length}
            </div>

            <div class="category-card-description">
                ${info.description}
            </div>

        `;


        container.appendChild(card);

    });

}


// ========================================
// CATEGORY PAGE
// ========================================

function renderCategoryPage(category) {

    const app =
        document.getElementById("app");


    const info =
        categoryInfo[category];


    if (!info) {

        renderNotFound();

        return;

    }


    const categoryEntities =
        entities.filter(entity => {

            return (
                entity.category === category &&
                isEntityUnlocked(entity)
            );

        });


    app.innerHTML = `

        <div class="breadcrumb">

            <a href="#/">Codex</a>

            <span>›</span>

            <span>${info.title}</span>

        </div>


        <section class="page-header">

            <h1>${info.title}</h1>

            <p>${info.description}</p>

        </section>


        <section>

            <div
                class="entity-list"
                id="entity-list"
            ></div>

        </section>

    `;


    const container =
        document.getElementById("entity-list");


    categoryEntities.forEach(entity => {

        const profile =
            getCurrentProfile(entity);


        const card =
            document.createElement("a");

        card.href =
            `#/entity/${entity.id}`;

        card.className =
            "entity-list-card";


        card.innerHTML = `

            <h3>${entity.name}</h3>

            <p>
                ${renderLinkedText(profile.summary)}
            </p>

        `;


        container.appendChild(card);

    });


    if (categoryEntities.length === 0) {

        container.innerHTML = `

            <p class="empty-message">
                Nothing has been revealed yet.
            </p>

        `;

    }

}


// ========================================
// ENTITY PAGE
// ========================================

function renderEntityPage(entityId) {

    const entity =
        getEntity(entityId);


    if (!entity || !isEntityUnlocked(entity)) {

        renderNotFound();

        return;

    }


    const profile =
        getCurrentProfile(entity);


    const app =
        document.getElementById("app");


    const category =
        categoryInfo[entity.category];


    app.innerHTML = `

        <div class="breadcrumb">

            <a href="#/">
                Codex
            </a>

            <span>›</span>

            <a
                href="#/category/${entity.category}"
            >
                ${category.title}
            </a>

            <span>›</span>

            <span>${entity.name}</span>

        </div>


        <section class="entity-page">

            <div class="entity-heading">

                <div>

                    <div class="entity-category">
                        ${category.title}
                    </div>

                    <h1>${entity.name}</h1>

                </div>

            </div>


            <div class="entity-section">

                <h2>Overview</h2>

                <p>
                    ${renderLinkedText(profile.summary)}
                </p>

            </div>


            <div class="entity-section">

                <h2>Identity</h2>

                <p>
                    ${renderLinkedText(profile.identity)}
                </p>

            </div>


            ${renderAffiliations(profile)}


        </section>

    `;

}


// ========================================
// AFFILIATIONS
// ========================================

function renderAffiliations(profile) {

    if (
        !profile.affiliations ||
        profile.affiliations.length === 0
    ) {

        return "";

    }


    const links =
        profile.affiliations
            .map(item => {

                return createEntityLink(
                    item.entity
                );

            })
            .filter(link => link !== "")
            .join(", ");


    if (!links) {
        return "";
    }


    return `

        <div class="entity-section">

            <h2>Affiliations</h2>

            <p>
                ${links}
            </p>

        </div>

    `;

}


// ========================================
// RELATIONSHIPS
// ========================================

function renderRelationships(profile) {

    if (
        !profile.relationships ||
        profile.relationships.length === 0
    ) {

        return "";

    }


    const visibleRelationships =
        profile.relationships
            .map(item => {

                const entity =
                    getEntity(item.entity);


                if (!entity || !isEntityUnlocked(entity)) {
                    return "";
                }


                return `

                    <div class="relationship">

                        <div class="relationship-name">
                            <a
                                href="#/entity/${entity.id}"
                                class="entity-link"
                            >
                                ${entity.name}
                            </a>
                        </div>

                        <div class="relationship-description">
                            ${item.description}
                        </div>

                    </div>

                `;

            })
            .filter(item => item !== "");


    if (visibleRelationships.length === 0) {
        return "";
    }


    return `

        <div class="entity-section">

            <h2>Relationships</h2>

            <div class="relationships-list">

                ${visibleRelationships.join("")}

            </div>

        </div>

    `;

}


// ========================================
// NOT FOUND
// ========================================

function renderNotFound() {

    const app =
        document.getElementById("app");


    app.innerHTML = `

        <section class="page-header">

            <h1>Nothing to see here</h1>

            <p>
                This information hasn't been revealed
                at your current reading position.
            </p>

            <a
                href="#/"
                class="back-link"
            >
                Return to Codex
            </a>

        </section>

    `;

}


// ========================================
// READING PROGRESS SETTINGS
// ========================================

function openProgressSettings() {

    const app =
        document.getElementById("app");


    app.innerHTML = `

        <div class="breadcrumb">

            <a href="#/">Codex</a>

            <span>›</span>

            <span>Reading Progress</span>

        </div>


        <section class="progress-page">

            <h1>Reading Progress</h1>

            <p>
                Your Codex will only show information
                you have reached in the story.
            </p>


            <div class="progress-form">

                <label for="progress-book">
                    Book
                </label>

                <select id="progress-book"></select>


                <label for="progress-chapter">
                    Chapter
                </label>

                <select id="progress-chapter"></select>


                <button
                    id="save-progress"
                    class="progress-button"
                >
                    Save Progress
                </button>

            </div>

        </section>

    `;


    populateProgressBooks();


    document
        .getElementById("progress-book")
        .addEventListener(
            "change",
            function() {

                populateProgressChapters(
                    Number(this.value)
                );

            }
        );


    document
        .getElementById("save-progress")
        .addEventListener(
            "click",
            function() {

                currentBook =
                    Number(
                        document
                            .getElementById(
                                "progress-book"
                            )
                            .value
                    );


                currentChapter =
                    Number(
                        document
                            .getElementById(
                                "progress-chapter"
                            )
                            .value
                    );


                localStorage.setItem(
                    "redRisingBook",
                    currentBook
                );


                localStorage.setItem(
                    "redRisingChapter",
                    currentChapter
                );


                updateProgressSummary();

                renderHomePage();

                window.location.hash = "#/";

            }
        );

}


// ========================================
// PROGRESS BOOK SELECTOR
// ========================================

function populateProgressBooks() {

    const select =
        document.getElementById(
            "progress-book"
        );


    select.innerHTML = "";


    books.forEach(book => {

        const option =
            document.createElement("option");


        option.value =
            book.number;


        option.textContent =
            book.title;


        select.appendChild(option);

    });


    select.value =
        currentBook;


    populateProgressChapters(
        currentBook
    );

}


// ========================================
// PROGRESS CHAPTER SELECTOR
// ========================================

function populateProgressChapters(
    bookNumber
) {

    const select =
        document.getElementById(
            "progress-chapter"
        );


    select.innerHTML = "";


    const book =
        getBook(bookNumber);


    if (!book) {
        return;
    }


    const allChapters =
        book.parts.flatMap(
            part => part.chapters
        );


    allChapters.forEach(chapter => {

        const option =
            document.createElement("option");


        option.value =
            chapter.number;


        option.textContent =
            chapter.title;


        select.appendChild(option);

    });


    select.value =
        currentChapter;


    if (
        select.value !==
        String(currentChapter)
    ) {

        select.selectedIndex = 0;

    }

}


// ========================================
// PROGRESS SUMMARY
// ========================================

function updateProgressSummary() {

    const element =
        document.getElementById(
            "progress-summary"
        );


    const book =
        getBook(currentBook);


    if (!book) {
        return;
    }


    const allChapters =
        book.parts.flatMap(
            part => part.chapters
        );


    const chapterIndex =
        allChapters.findIndex(
            chapter =>
                chapter.number ===
                currentChapter
        );


    if (chapterIndex === -1) {
        return;
    }


    const chapter =
        allChapters[chapterIndex];


    const totalChapters =
        allChapters.length;


    const progress =
        ((chapterIndex + 1) / totalChapters) * 100;


    const currentPart =
        book.parts.find(
            part =>
                part.chapters.some(
                    chapter =>
                        chapter.number ===
                        currentChapter
                )
        );


    element.innerHTML = `

        <a
            href="#/progress"
            class="progress-link"
        >

            <div class="progress-book-title">
                ${book.title}
            </div>

            <div class="progress-bar">

                <div
                    class="progress-bar-fill"
                    style="width: ${progress}%"
                ></div>

            </div>

            <div class="progress-details">

                <span>
                    ${currentPart.title}
                </span>

                <span>
                    ${chapter.title}
                </span>

            </div>

        </a>

    `;

}


// ========================================
// ROUTING
// ========================================


// Because this is a GitHub Pages site,
// we're using the URL hash for navigation.
//
// Examples:
//
// #/
// #/category/character
// #/entity/darrow
//

function route() {

    const hash =
        window.location.hash;


    if (!hash || hash === "#/" || hash === "#") {

        renderHomePage();

        return;

    }


    const path =
        hash.substring(2);


    const parts =
        path.split("/");


    if (parts[0] === "category") {

        renderCategoryPage(
            parts[1]
        );

        return;

    }


    if (parts[0] === "entity") {

        renderEntityPage(
            parts[1]
        );

        return;

    }


    if (parts[0] === "progress") {

        openProgressSettings();

        return;

    }


    renderNotFound();

}


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


    // Make sure saved progress still exists.

    const book =
        getBook(currentBook);


    if (!book) {

        currentBook = 1;
        currentChapter = 1;

    }


    const chapterExists =
        book.parts
            .flatMap(part => part.chapters)
            .some(
                chapter =>
                    chapter.number ===
                    currentChapter
            );


    if (!chapterExists) {

        currentChapter =
            book.parts[0].chapters[0].number;

    }


    updateProgressSummary();

}


// ========================================
// START
// ========================================

window.addEventListener(
    "hashchange",
    route
);


loadSavedProgress();

route();
