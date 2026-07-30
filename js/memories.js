"use strict";

/* ==================================================
   HELPER: BUILD IMAGE LISTS
================================================== */

function createPhotoList(folder, start, end) {
    const photos = [];

    for (let number = start; number <= end; number += 1) {
        photos.push({
            type: "image",
            src: `${folder}/${number}.jpg`
        });
    }

    return photos;
}


/* ==================================================
   MEMORY AND EPISODE DATA
================================================== */

const memories = {
    trailer: [
        {
            title: "September 2025",
            folder: "images/Season-1-Trailer/September-2025",
            count: 5
        },
        {
            title: "October 2025",
            folder: "images/Season-1-Trailer/October-2025",
            count: 6
        }
    ],

    season1: [
        {
            title: "November 2025",
            episode: "Episode 1",
            name: "The Beginning",
            folder: "images/Season-1/November-2025",
            count: 9
        },
        {
            title: "December 2025",
            episode: "Episode 2",
            name: "Our First Holiday Season",
            folder: "images/Season-1/December-2025",
            count: 16
        },
        {
            title: "January 2026",
            episode: "Episode 3",
            name: "A New Year Together",
            folder: "images/Season-1/January-2026",
            count: 12
        },
        {
            title: "February 2026",
            episode: "Episode 4",
            name: "My Valentine",
            folder: "images/Season-1/February-2026",
            count: 8
        },
        {
            title: "March 2026",
            episode: "Episode 5",
            name: "More Favorite Moments",
            folder: "images/Season-1/March-2026",
            count: 9
        },
        {
            title: "April 2026",
            episode: "Episode 6",
            name: "The Season Finale",
            folder: "images/Season-1/April-2026",
            count: 13
        }
    ],

    season2: [
        {
            title: "May 2026",
            episode: "Episode 1",
            name: "Seven Months Together",
            folder: "images/Current-Season/May-2026",
            released: true,

            media: [
                {
                    type: "video",
                    src: "images/Current-Season/May-2026/video.mp4"
                },

                ...createPhotoList(
                    "images/Current-Season/May-2026",
                    1,
                    15
                )
            ]
        },

        {
            title: "June 2026",
            episode: "Episode 2",
            name: "Eight Months Together",
            folder: "images/Current-Season/June-2026",
            released: true,

            media: [
                ...createPhotoList(
                    "images/Current-Season/June-2026",
                    1,
                    8
                ),

                {
                    type: "video",
                    src: "images/Current-Season/June-2026/video.mp4"
                },

                ...createPhotoList(
                    "images/Current-Season/June-2026",
                    9,
                    15
                )
            ]
        },

        {
            title: "July 2026",
            episode: "Episode 3",
            name: "Nine Months Together",
            folder: "images/Current-Season/July-2026",
            released: true,

            media: [
                ...createPhotoList(
                    "images/Current-Season/July-2026",
                    1,
                    5
                ),

                {
                    type: "video",
                    src: "images/Current-Season/July-2026/video.mp4"
                },

                ...createPhotoList(
                    "images/Current-Season/July-2026",
                    6,
                    21
                )
            ]
        },

        {
            title: "August 2026",
            episode: "Episode 4",
            name: "Coming Soon",
            released: false,
            releaseDate: "September 2026"
        },

        {
            title: "September 2026",
            episode: "Episode 5",
            name: "Coming Soon",
            released: false,
            releaseDate: "October 2026"
        },

        {
            title: "October 2026",
            episode: "Episode 6",
            name: "Coming Soon",
            released: false,
            releaseDate: "November 2026"
        }
    ]
};


/* ==================================================
   SECRET KEYBOARD SHORTCUTS
================================================== */

let secretCode = "";

document.addEventListener("keydown", function (event) {
    const target = event.target;

    const isTyping =
        target instanceof HTMLElement &&
        (
            target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable
        );

    /*
      Ctrl + Shift + G opens the admin page.
    */

    if (
        event.ctrlKey &&
        event.shiftKey &&
        event.key.toLowerCase() === "g"
    ) {
        event.preventDefault();
        window.location.href = "admin.html";
        return;
    }

    /*
      Do not collect the secret code while the visitor
      is typing in an input, textarea, or editable field.
    */

    if (isTyping) {
        return;
    }

    /*
      Ignore modifier and navigation keys.
    */

    if (event.key.length !== 1) {
        return;
    }

    secretCode += event.key.toLowerCase();

    /*
      "omgomgomg" contains nine characters, so only
      the latest nine typed characters are needed.
    */

    secretCode = secretCode.slice(-9);

    if (secretCode === "omgomgomg") {
        secretCode = "";

        window.location.href = "secret.html";
    }
});