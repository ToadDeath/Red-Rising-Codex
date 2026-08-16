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

// Automatically turns entity names and aliases
// into clickable links.
//
// The current entity will never link to itself.
// Entities that have not been revealed will
// remain normal text.

function renderLinkedText(
    item,
    currentEntityId = null
) {

    if (!item) {
        return "";
    }


    const text =
        typeof item === "string"
            ? item
            : item.text;


    if (!text) {
        return "";
    }


    // Start with normal text escaped for HTML.

    let result =
        escapeHTML(text);


    // Build the list of entities that are
    // currently available to link.

    const linkTargets = [];


    entities.forEach(entity => {

        // Never link the page we are currently on.

        if (entity.id === currentEntityId) {
            return;
        }


        // Don't link information that hasn't
        // been revealed yet.

        if (!isEntityUnlocked(entity)) {
            return;
        }


        // Add the entity's main name.

        linkTargets.push({
            text: entity.name,
            entityId: entity.id
        });


        // Add permanent aliases.

        if (entity.aliases) {

            entity.aliases.forEach(alias => {

                linkTargets.push({
                    text: alias,
                    entityId: entity.id
                });

            });

        }


        // Add aliases that belong specifically
        // to the currently visible profile.

        const currentProfile =
            getCurrentProfile(entity);


        if (
            currentProfile &&
            currentProfile.aliases
        ) {

            currentProfile.aliases.forEach(alias => {

                linkTargets.push({
                    text: alias,
                    entityId: entity.id
                });

            });

        }

    });


    // If there is nothing to link, return the
    // escaped text as-is.

    if (linkTargets.length === 0) {
        return result;
    }


    // Longer names must be processed first.
    //
    // Example:
    // "The Society" should be processed before
    // "Society".

    linkTargets.sort((a, b) => {

        return (
            b.text.length -
            a.text.length
        );

    });


    // Temporary placeholders prevent links from
    // being processed again when another entity
    // name is searched.

    const placeholders = [];


    linkTargets.forEach(target => {

        const escapedName =
            escapeHTML(target.text)
                .replace(
                    /[.*+?^${}()|[\]\\]/g,
                    "\\$&"
                );


        // Match complete words or phrases.
        //
        // This prevents "Mars" from matching
        // something like "Marsh".

        const regex =
            new RegExp(
                `(^|[^\\w])(${escapedName})(?=$|[^\\w])`,
                "gi"
            );


        result =
            result.replace(
                regex,
                (fullMatch, before, match) => {

                    const placeholder =
                        `___ENTITY_LINK_${placeholders.length}___`;


                    placeholders.push({

                        placeholder,

                        html:
                            `<a href="#/entity/${target.entityId}" class="entity-link">${match}</a>`

                    });


                    return (
                        before +
                        placeholder
                    );

                }
            );

    });


    // Replace placeholders with the actual
    // clickable links.

    placeholders.forEach(item => {

        result =
            result.replace(
                item.placeholder,
                item.html
            );

    });


    return result;

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
            "People you have encountered"
    },

    location: {
        title: "Locations",
        description:
            "Places you have encountered"
    },

    house: {
        title: "Houses",
        description:
            "Houses and their members."
    },

    faction: {
        title: "Factions",
        description:
            "Organizations and political groups"
    },

    concept: {
        title: "Concepts",
        description:
            "Important ideas, terminology, technology, and customs"
    },

    event: {
        title: "Events",
        description:
            "Important events you have encountered"
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
// ENTITY PREVIEW
// ========================================

// Get a short piece of text for category cards.

function getEntityPreview(
    profile,
    currentEntityId
) {

    if (
        !profile ||
        !profile.sections ||
        profile.sections.length === 0
    ) {

        return "";

    }


    const overview =
        profile.sections.find(
            section =>
                section.title === "Overview"
        );


    if (!overview) {

        return renderLinkedText(
            profile.sections[0].content,
            currentEntityId
        );

    }


    return renderLinkedText(
        overview.content,
        currentEntityId
    );

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
                ${getEntityPreview(profile, entity.id)}
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
// ENTITY SECTIONS
// ========================================

// Render the sections belonging to the
// entity's currently visible profile.

function renderEntitySections(
    profile,
    currentEntityId
) {

    if (
        !profile ||
        !profile.sections ||
        profile.sections.length === 0
    ) {

        return "";

    }


    return profile.sections
        .map(section => {

            return `

                <div class="entity-section">

                    <h2>
                        ${section.title}
                    </h2>

                    <p>
                        ${renderLinkedText(
                            section.content,
                            currentEntityId
                        )}
                    </p>

                </div>

            `;

        })
        .join("");

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

            
            ${renderEntitySections(profile, entity.id)}

        </section>

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
// READING PROGRESS PANEL
// ========================================

function openProgressSettings() {

    // Don't create the panel twice.

    if (
        document.getElementById(
            "progress-panel"
        )
    ) {

        return;

    }


    const panel =
        document.createElement("div");

    panel.id =
        "progress-panel";

    panel.className =
        "progress-panel";


    panel.innerHTML = `

        <div class="progress-panel-header">

            <h2>Reading Progress</h2>

            <button
                id="close-progress"
                class="progress-close"
                aria-label="Close"
            >
                ×
            </button>

        </div>


        <div class="progress-panel-content">

            <label for="progress-book">
                Book
            </label>

            <select id="progress-book"></select>


            <label for="progress-chapter">
                Chapter
            </label>

            <select id="progress-chapter"></select>


            <div
                id="progress-current-part"
                class="progress-current-part"
            ></div>


            <button
                id="save-progress"
                class="progress-button"
            >
                Save Progress
            </button>

        </div>

    `;


    document.body.appendChild(panel);


    // Populate the book selector.

    populateProgressBooks();


    // Update the chapter list when
    // the book changes.

    document
        .getElementById("progress-book")
        .addEventListener(
            "change",
            function() {

                populateProgressChapters(
                    Number(this.value)
                );

                updateProgressPanelPart();

            }
        );


    // Update the displayed Part when
    // the chapter changes.

    document
        .getElementById("progress-chapter")
        .addEventListener(
            "change",
            function() {

                updateProgressPanelPart();

            }
        );


    // Save the new reading progress.

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


                // Remove the panel.

                panel.remove();


                // Update the progress bar.

                updateProgressSummary();


                // Re-render the page we're
                // currently looking at.

                route();

            }
        );


    // Close the panel.

    document
        .getElementById("close-progress")
        .addEventListener(
            "click",
            function() {

                panel.remove();

            }
        );


    // Show the current Part.

    updateProgressPanelPart();

}


// ========================================
// PROGRESS PANEL PART
// ========================================

function updateProgressPanelPart() {

    const partElement =
        document.getElementById(
            "progress-current-part"
        );


    if (!partElement) {
        return;
    }


    const bookSelect =
        document.getElementById(
            "progress-book"
        );


    const chapterSelect =
        document.getElementById(
            "progress-chapter"
        );


    if (
        !bookSelect ||
        !chapterSelect
    ) {

        return;

    }


    const bookNumber =
        Number(bookSelect.value);


    const chapterNumber =
        Number(chapterSelect.value);


    const book =
        getBook(bookNumber);


    if (!book) {

        partElement.textContent = "";

        return;

    }


    const currentPart =
        book.parts.find(
            part =>
                part.chapters.some(
                    chapter =>
                        chapter.number ===
                        chapterNumber
                )
        );


    if (!currentPart) {

        partElement.textContent = "";

        return;

    }


    partElement.textContent =
        currentPart.title;

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
            href="#"
            class="progress-link"
            onclick="
                event.preventDefault();
                openProgressSettings();
            "
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
