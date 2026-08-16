// ========================================
// RED RISING CODEX - STORY DATA
// ========================================

const books = [

    {
        id: "red-rising",
        number: 1,
        title: "Red Rising",

        parts: [

            {
                id: "part-1",
                title: "Part I: Slave",

                chapters: [
                    { number: 1, title: "Chapter 1" },
                    { number: 2, title: "Chapter 2" },
                    { number: 3, title: "Chapter 3" },
                    { number: 4, title: "Chapter 4" },
                    { number: 5, title: "Chapter 5" },
                    { number: 6, title: "Chapter 6" }
                ]
            },

            {
                id: "part-2",
                title: "Part II: Reborn",

                chapters: [
                    { number: 7, title: "Chapter 7" },
                    { number: 8, title: "Chapter 8" },
                    { number: 9, title: "Chapter 9" },
                    { number: 10, title: "Chapter 10" },
                    { number: 11, title: "Chapter 11" },
                    { number: 12, title: "Chapter 12" },
                    { number: 13, title: "Chapter 13" },
                    { number: 14, title: "Chapter 14" },
                    { number: 15, title: "Chapter 15" },
                    { number: 16, title: "Chapter 16" },
                    { number: 17, title: "Chapter 17" },
                    { number: 18, title: "Chapter 18" },
                    { number: 19, title: "Chapter 19" }
                ]
            },

            {
                id: "part-3",
                title: "Part III: Gold",

                chapters: [
                    { number: 20, title: "Chapter 20" },
                    { number: 21, title: "Chapter 21" },
                    { number: 22, title: "Chapter 22" },
                    { number: 23, title: "Chapter 23" },
                    { number: 24, title: "Chapter 24" },
                    { number: 25, title: "Chapter 25" },
                    { number: 26, title: "Chapter 26" },
                    { number: 27, title: "Chapter 27" },
                    { number: 28, title: "Chapter 28" },
                    { number: 29, title: "Chapter 29" },
                    { number: 30, title: "Chapter 30" },
                    { number: 31, title: "Chapter 31" },
                    { number: 32, title: "Chapter 32" },
                    { number: 33, title: "Chapter 33" }
                ]
            },

            {
                id: "part-4",
                title: "Part IV: Reaper",

                chapters: [
                    { number: 34, title: "Chapter 34" },
                    { number: 35, title: "Chapter 35" },
                    { number: 36, title: "Chapter 36" },
                    { number: 37, title: "Chapter 37" },
                    { number: 38, title: "Chapter 38" },
                    { number: 39, title: "Chapter 39" },
                    { number: 40, title: "Chapter 40" },
                    { number: 41, title: "Chapter 41" },
                    { number: 42, title: "Chapter 42" },
                    { number: 43, title: "Chapter 43" },
                    { number: 44, title: "Chapter 44" }
                ]
            }

        ]
    }

];


// ========================================
// RED RISING CODEX - ENTITY DATA
// ========================================

const entities = [

    // ========================================
    // CHARACTERS
    // ========================================

   {
    id: "darrow",
    name: "Darrow",
    category: "character",

    profiles: [

        {
            from: {
                book: 1,
                chapter: 1
            },

            sections: [

                {
                    title: "Overview",

                    content:
                        "Darrow is a young Red Helldiver who works beneath the surface of Mars."
                }

            ]

        },


        {
            from: {
                book: 1,
                chapter: 21
            },

            aliases: [
                "The Reaper"
            ],

            sections: [

                {
                    title: "Overview",

                    content:
                        "Darrow has entered the Institute and taken on a new identity within the Gold hierarchy."
                }

            ]

        }

    ]
},


    {
    id: "eo",
    name: "Eo",

    aliases: [],

    category: "character",

    profiles: [

        {
            from: {
                book: 1,
                chapter: 1
            },

            sections: [

                {
                    title: "Overview",

                    content:
                        "Eo is Darrow's wife."
                },

                {
                    title: "Identity",

                    content:
                        "Eo is a Red living in Lykos on Mars."
                }

            ]

        }

    ]
},


    {
    id: "sevro",
    name: "Sevro",

    aliases: [
        "Goblin"
    ],

    category: "character",

    profiles: [

        {
            from: {
                book: 1,
                chapter: 5
            },

            sections: [

                {
                    title: "Overview",

                    content:
                        "Sevro is a Gold who becomes an important figure in Darrow's story."
                },

                {
                    title: "Identity",

                    content:
                        "Sevro is a Gold associated with the Howlers."
                }

            ]

        }

    ]
},


    // ========================================
    // LOCATIONS
    // ========================================

    {
    id: "mars",
    name: "Mars",

    aliases: [],

    category: "location",

    profiles: [

        {
            from: {
                book: 1,
                chapter: 1
            },

            sections: [

                {
                    title: "Overview",

                    content:
                        "Mars is the setting for much of the beginning of Darrow's story."
                },

                {
                    title: "Description",

                    content:
                        "Mars is the planet where Darrow and the Reds live."
                }

            ]

        }

    ]
},


    {
    id: "lykos",
    name: "Lykos",

    aliases: [],

    category: "location",

    profiles: [

        {
            from: {
                book: 1,
                chapter: 1
            },

            sections: [

                {
                    title: "Overview",

                    content:
                        "Lykos is the home of Darrow and Eo."
                },

                {
                    title: "Description",

                    content:
                        "Lykos is a mining colony on Mars."
                }

            ]

        }

    ]
},


    // ========================================
    // FACTIONS
    // ========================================

    {
    id: "society",
    name: "The Society",

    aliases: [
        "Society"
    ],

    category: "faction",

    profiles: [

        {
            from: {
                book: 1,
                chapter: 2
            },

            sections: [

                {
                    title: "Overview",

                    content:
                        "The Society governs the civilization in which Darrow lives."
                },

                {
                    title: "Description",

                    content:
                        "The Society is the ruling social and political order."
                }

            ]

        }

    ]
}

];
