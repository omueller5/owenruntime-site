// script.js
const yearSpan = document.getElementById("year");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}
// Lightbox for project screenshots (Projects page)
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

// Only run if the lightbox exists on this page
if (lightbox && lightboxImage && lightboxClose) {
    // Any screenshot inside .shot on the page
    const screenshotImgs = document.querySelectorAll(".shot img");

    screenshotImgs.forEach(img => {
        img.addEventListener("click", () => {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt || "Enlarged screenshot";
            lightbox.classList.add("visible");
        });
    });

    // Close when clicking the X
    lightboxClose.addEventListener("click", () => {
        lightbox.classList.remove("visible");
    });

    // Close when clicking the dark background
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove("visible");
        }
    });

    // Close with Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            lightbox.classList.remove("visible");
        }
    });
}
