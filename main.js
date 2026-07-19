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