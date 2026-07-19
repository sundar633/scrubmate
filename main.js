/* =========================================
   MAIN HOME PAGE
========================================= */

const scurbHomePage =
  document.getElementById("scurbHomePage");

const scurbHomeLocationName =
  document.getElementById("scurbHomeLocationName");

const scurbHomeAddress =
  document.getElementById("scurbHomeAddress");

const scurbHeaderLocation =
  document.getElementById("scurbHeaderLocation");

const scurbHomeNavButton =
  document.getElementById("scurbHomeNavButton");

const scurbBookingsNavButton =
  document.getElementById("scurbBookingsNavButton");


function updateScurbHomeLocation(){

  const village =
    localStorage.getItem("scurbMateVillage") || "";

  const street =
    localStorage.getItem("scurbMateStreetName") || "";

  const city =
    localStorage.getItem("scurbMateCity") || "";

  const fullAddress =
    localStorage.getItem("scurbMateFullAddress") || "";


  scurbHomeLocationName.textContent =
    village ||
    street ||
    city ||
    "Selected location";


 const address =
  fullAddress ||
  [street, village, city]
    .filter(Boolean)
    .join(", ") ||
  "Your selected address";

const words = address.trim().split(/\s+/);

scurbHomeAddress.textContent =
  words.length > 2
    ? words.slice(0, 2).join(" ") + "..."
    : address;
}


function openScurbHomePage(){

  updateScurbHomeLocation();

  document.getElementById("loginPage")
    ?.style.setProperty("display", "none");

  document.getElementById("locationPage")
    ?.classList.remove("show");

  document.getElementById("manualSearchPage")
    ?.classList.remove("show");

  document.getElementById("confirmLocationPage")
    ?.classList.remove("show");

  scurbHomePage.classList.add("show");
}


/* CLICK HEADER TO CHANGE LOCATION */

scurbHeaderLocation.addEventListener("click", function(){

  scurbHomePage.classList.remove("show");

  document
    .getElementById("manualSearchPage")
    .classList.add("show");

});


/* BOTTOM NAVIGATION */

scurbHomeNavButton.addEventListener("click", function(){

  scurbHomeNavButton.classList.add("active");
  scurbBookingsNavButton.classList.remove("active");

});


scurbBookingsNavButton.addEventListener("click", function(){

  scurbBookingsNavButton.classList.add("active");
  scurbHomeNavButton.classList.remove("active");

});

/* =========================================
   HOME BANNER SLIDER
========================================= */

const scurbBannerSlider =
  document.querySelector(".scurbBannerSlider");

const scurbBannerTrack =
  document.querySelector(".scurbBannerTrack");

const scurbBannerItems =
  document.querySelectorAll(".scurbBannerItem");

const scurbBannerDots =
  document.querySelectorAll(".scurbBannerDot");

let scurbBannerIndex = 0;
let scurbBannerTimer = null;

let scurbBannerStartX = 0;
let scurbBannerCurrentX = 0;
let scurbBannerDragging = false;


/* SHOW BANNER */

function showScurbBanner(index){

  if(index < 0){
    index = scurbBannerItems.length - 1;
  }

  if(index >= scurbBannerItems.length){
    index = 0;
  }

  scurbBannerIndex = index;

  scurbBannerTrack.style.transform =
    `translateX(-${scurbBannerIndex * 100}%)`;

  scurbBannerDots.forEach(function(dot, dotIndex){

    dot.classList.toggle(
      "active",
      dotIndex === scurbBannerIndex
    );

  });

}


/* AUTO SLIDE */

function startScurbBannerAutoSlide(){

  stopScurbBannerAutoSlide();

  scurbBannerTimer = setInterval(function(){

    showScurbBanner(
      scurbBannerIndex + 1
    );

  }, 3500);

}


function stopScurbBannerAutoSlide(){

  if(scurbBannerTimer){

    clearInterval(scurbBannerTimer);
    scurbBannerTimer = null;

  }

}


/* DOT CLICK */

scurbBannerDots.forEach(function(dot){

  dot.addEventListener("click", function(){

    const index =
      Number(this.dataset.index);

    showScurbBanner(index);

    startScurbBannerAutoSlide();

  });

});


/* TOUCH SWIPE */

scurbBannerSlider.addEventListener(
  "touchstart",
  function(event){

    stopScurbBannerAutoSlide();

    scurbBannerDragging = true;

    scurbBannerStartX =
      event.touches[0].clientX;

    scurbBannerCurrentX =
      scurbBannerStartX;

  },
  {
    passive:true
  }
);


scurbBannerSlider.addEventListener(
  "touchmove",
  function(event){

    if(!scurbBannerDragging){
      return;
    }

    scurbBannerCurrentX =
      event.touches[0].clientX;

  },
  {
    passive:true
  }
);


scurbBannerSlider.addEventListener(
  "touchend",
  function(){

    if(!scurbBannerDragging){
      return;
    }

    scurbBannerDragging = false;

    const difference =
      scurbBannerStartX -
      scurbBannerCurrentX;

    if(Math.abs(difference) > 45){

      if(difference > 0){

        showScurbBanner(
          scurbBannerIndex + 1
        );

      }else{

        showScurbBanner(
          scurbBannerIndex - 1
        );

      }

    }

    startScurbBannerAutoSlide();

  }
);


/* START */

scurbBannerTrack.style.transition = "none";

showScurbBanner(0);

requestAnimationFrame(function(){

  requestAnimationFrame(function(){

    scurbBannerTrack.style.transition =
      "transform .45s ease";

    startScurbBannerAutoSlide();

  });

});
