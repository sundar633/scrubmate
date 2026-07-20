document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".service-img[data-src]").forEach(img => {

    const key = "img_" + img.dataset.src;

    if (localStorage.getItem(key)) {
      img.classList.add("loaded");
      img.parentElement.classList.add("loaded");
    }

    img.onload = () => {
      img.classList.add("loaded");
      img.parentElement.classList.add("loaded");
      localStorage.setItem(key, "1");
    };

    img.src = img.dataset.src;

  });

  const locationImg = document.querySelector(".location-image[data-src]");

  if (locationImg) {

    const key = "img_" + locationImg.dataset.src;

    if (localStorage.getItem(key)) {
      locationImg.classList.add("loaded");
      locationImg.parentElement.classList.add("loaded");
    }

    locationImg.onload = () => {
      locationImg.classList.add("loaded");
      locationImg.parentElement.classList.add("loaded");
      localStorage.setItem(key, "1");
    };

    locationImg.src = locationImg.dataset.src;
  }

});


document.querySelectorAll(".scurbBannerImg[data-src]").forEach(img => {

    const banner = img.closest(".scurbBannerItem");

    const finishLoading = () => {
        banner.classList.add("loaded");
    };

    img.onload = finishLoading;
    img.onerror = finishLoading;

    img.src = img.dataset.src;

    if (img.complete && img.naturalWidth > 0) {
        finishLoading();
    }

});

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".scurbServiceImg[data-src]").forEach(img => {

        const box = img.closest(".scurbServiceImageBox");

        const finishLoading = () => {

            img.classList.add("loaded");

            if (box) {
                box.classList.add("loaded");
            }
        };

        img.onload = finishLoading;

        img.onerror = finishLoading;

        img.src = img.dataset.src;

        if (img.complete && img.naturalWidth > 0) {
            finishLoading();
        }

    });

});

document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".scurbFeatureImg[data-src]").forEach(img => {

        const item = img.closest(".scurbFeatureItem");

        const finishLoading = () => {
            img.classList.add("loaded");

            if (item) {
                item.classList.add("loaded");
            }
        };

        img.onload = finishLoading;
        img.onerror = finishLoading;

        img.src = img.dataset.src;

        if (img.complete && img.naturalWidth > 0) {
            finishLoading();
        }

    });

});

document.addEventListener("DOMContentLoaded", () => {

    const img = document.querySelector(".verifiedBadgeImg");

    if (!img) return;

    const badge = img.closest(".verifiedBadge");

    const finishLoading = () => {
        img.classList.add("loaded");

        if (badge) {
            badge.classList.add("loaded");
        }
    };

    img.onload = finishLoading;
    img.onerror = finishLoading;

    img.src = img.dataset.src;

    if (img.complete && img.naturalWidth > 0) {
        finishLoading();
    }

});
