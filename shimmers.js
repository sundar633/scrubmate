
document.addEventListener("DOMContentLoaded", () => {

    function loadCachedImage(img, loadedParent) {

        if (!img || !img.dataset.src) return;

        const imageUrl = img.dataset.src;
        const cacheKey = "img_" + imageUrl;

        const parent =
            typeof loadedParent === "string"
                ? img.closest(loadedParent)
                : img.parentElement;

        const markAsLoaded = () => {
            img.classList.add("loaded");

            if (parent) {
                parent.classList.add("loaded");
            }
        };

        /*
         If this image loaded successfully before,
         hide the shimmer immediately.
        */
        if (localStorage.getItem(cacheKey) === "1") {
            markAsLoaded();
        }

        img.onload = () => {
            markAsLoaded();
            localStorage.setItem(cacheKey, "1");
        };

        img.onerror = () => {
            /*
             Hide endless shimmer if the image path fails,
             but don't save the failed image as cached.
            */
            markAsLoaded();
        };

        img.src = imageUrl;

        /*
         Handles images already available in browser cache.
        */
        if (img.complete && img.naturalWidth > 0) {
            markAsLoaded();
            localStorage.setItem(cacheKey, "1");
        }
    }


    /* First service images */
    document
        .querySelectorAll(".service-img[data-src]")
        .forEach(img => {
            loadCachedImage(img);
        });


    /* Location image */
    document
        .querySelectorAll(".location-image[data-src]")
        .forEach(img => {
            loadCachedImage(img);
        });


    /* Banner images */
    document
        .querySelectorAll(".scurbBannerImg[data-src]")
        .forEach(img => {
            loadCachedImage(img, ".scurbBannerItem");
        });


    /* Service card images */
    document
        .querySelectorAll(".scurbServiceImg[data-src]")
        .forEach(img => {
            loadCachedImage(img, ".scurbServiceImageBox");
        });


    /* Feature images */
    document
        .querySelectorAll(".scurbFeatureImg[data-src]")
        .forEach(img => {
            loadCachedImage(img, ".scurbFeatureItem");
        });


    /* Verified badge image */
    document
        .querySelectorAll(".verifiedBadgeImg[data-src]")
        .forEach(img => {
            loadCachedImage(img, ".verifiedBadge");
        });

});

