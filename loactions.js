/* =========================
   MAIN LOCATION PAGE
========================= */

const loginPage = document.getElementById("loginPage");
const locationPage = document.getElementById("locationPage");

const currentLocationButton =
  document.getElementById("currentLocationButton");

const manualLocationButton =
  document.getElementById("manualLocationButton");


skipButton.addEventListener("click", function(){

  stopMarquee();

  loginPage.style.display = "none";
  locationPage.classList.add("show");

});


currentLocationButton.addEventListener(
  "click",
  getAndSaveCurrentLocation
);


/* =========================
   SAVE CURRENT LOCATION
========================= */

async function getAndSaveCurrentLocation(){

  if(!navigator.geolocation){
    console.error("Geolocation is not supported.");
    return;
  }

  currentLocationButton.disabled = true;

  navigator.geolocation.getCurrentPosition(

    async function(position){

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      try{

        const locationData =
          await reverseGeocode(latitude, longitude);

        saveLocationToStorage({
          ...locationData,
          latitude,
          longitude,
          accuracy:position.coords.accuracy ?? null,
          locationType:"current"
        });

        console.log("Current location saved.");
        updateScurbHomeLocation();
openScurbHomePage();

      }catch(error){

        saveLocationToStorage({
          latitude,
          longitude,
          accuracy:position.coords.accuracy ?? null,
          fullAddress:"",
          locationType:"current",
          addressFound:false
        });

        console.error(
          "Coordinates saved, but address failed:",
          error
        );

      }finally{

        currentLocationButton.disabled = false;

      }

    },

    function(error){

      currentLocationButton.disabled = false;

      if(error.code === error.PERMISSION_DENIED){

        localStorage.setItem(
          "scurbMateLocationPermission",
          "denied"
        );

      }

      console.error("Location error:", error);

    },

    {
      enableHighAccuracy:true,
      timeout:20000,
      maximumAge:0
    }

  );

}


/* =========================
   MANUAL LOCATION ELEMENTS
========================= */

const manualSearchPage =
  document.getElementById("manualSearchPage");

const confirmLocationPage =
  document.getElementById("confirmLocationPage");

const manualSearchBackButton =
  document.getElementById("manualSearchBackButton");

const confirmLocationBackButton =
  document.getElementById("confirmLocationBackButton");

const manualLocationSearchInput =
  document.getElementById("manualLocationSearchInput");

const locationSearchResults =
  document.getElementById("locationSearchResults");

const manualCurrentLocationButton =
  document.getElementById("manualCurrentLocationButton");

const confirmSearchButton =
  document.getElementById("confirmSearchButton");

const goCurrentLocationButton =
  document.getElementById("goCurrentLocationButton");

const confirmManualLocationButton =
  document.getElementById("confirmManualLocationButton");

const selectedLocationName =
  document.getElementById("selectedLocationName");

const selectedLocationAddress =
  document.getElementById("selectedLocationAddress");

const mapPinPlaceName =
  document.getElementById("mapPinPlaceName");


let manualLocationMap = null;
let selectedManualLocation = null;
let searchTimer = null;
let reverseTimer = null;
let reverseRequestNumber = 0;


/* =========================
   OPEN MANUAL SEARCH
========================= */

manualLocationButton.addEventListener("click", function(){

  locationPage.classList.remove("show");
  manualSearchPage.classList.add("show");

  setTimeout(function(){
    manualLocationSearchInput.focus();
  }, 200);

});


manualSearchBackButton.addEventListener("click", function(){

  manualSearchPage.classList.remove("show");
  locationPage.classList.add("show");

});


confirmLocationBackButton.addEventListener("click", function(){

  confirmLocationPage.classList.remove("show");
  manualSearchPage.classList.add("show");

});


confirmSearchButton.addEventListener("click", function(){

  confirmLocationPage.classList.remove("show");
  manualSearchPage.classList.add("show");

  setTimeout(function(){
    manualLocationSearchInput.focus();
  }, 200);

});


/* =========================
   SEARCH LOCATION
========================= */

manualLocationSearchInput.addEventListener("input", function(){

  const query = this.value.trim();

  clearTimeout(searchTimer);

  if(query.length < 3){

    locationSearchResults.innerHTML = "";
    return;

  }

  locationSearchResults.innerHTML = `
    <p class="location-search-message">
      Searching...
    </p>
  `;

  searchTimer = setTimeout(function(){
    searchLocations(query);
  }, 600);

});


async function searchLocations(query){

  try{

    const url =
      "https://nominatim.openstreetmap.org/search" +
      "?format=jsonv2" +
      "&addressdetails=1" +
      "&limit=6" +
      "&countrycodes=in" +
      "&q=" + encodeURIComponent(query);

    const response = await fetch(url, {
      headers:{
        "Accept":"application/json",
        "Accept-Language":"en"
      }
    });

    if(!response.ok){
      throw new Error("Search request failed.");
    }

    const results = await response.json();

    renderSearchResults(results);

  }catch(error){

    console.error(error);

    locationSearchResults.innerHTML = `
      <p class="location-search-message">
        Unable to search this location.
      </p>
    `;

  }

}


function renderSearchResults(results){

  locationSearchResults.innerHTML = "";

  if(!results.length){

    locationSearchResults.innerHTML = `
      <p class="location-search-message">
        No locations found.
      </p>
    `;

    return;

  }

  results.forEach(function(result){

    const address = result.address || {};

    const title =
      address.village ||
      address.town ||
      address.city ||
      address.suburb ||
      address.locality ||
      result.name ||
      "Selected location";

    const item = document.createElement("button");

    item.type = "button";
    item.className = "location-result-item";

    item.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path
          d="M12 21s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12z"
        ></path>
        <circle cx="12" cy="9" r="2.3"></circle>
      </svg>

      <span class="location-result-text">
        <strong>${escapeLocationHTML(title)}</strong>
        <span>
          ${escapeLocationHTML(result.display_name || "")}
        </span>
      </span>
    `;

    item.addEventListener("click", function(){

      openConfirmLocation(
        Number(result.lat),
        Number(result.lon)
      );

    });

    locationSearchResults.appendChild(item);

  });

}


/* =========================
   OPEN CONFIRM MAP
========================= */

async function openConfirmLocation(latitude, longitude){

  manualSearchPage.classList.remove("show");
  confirmLocationPage.classList.add("show");
confirmManualLocationButton.disabled = true;
  selectedLocationName.textContent = "Finding location...";
  selectedLocationAddress.textContent = "";
  mapPinPlaceName.textContent = "Selected location";

  setTimeout(function(){

    createOrMoveMap(latitude, longitude);

  }, 100);

}


function createOrMoveMap(latitude, longitude){

  if(!manualLocationMap){

    manualLocationMap = L.map(
      "manualLocationMap",
      {
        zoomControl:false,
        attributionControl:true
      }
    ).setView([latitude, longitude], 18);


    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom:19,
        attribution:"© OpenStreetMap"
      }
    ).addTo(manualLocationMap);


    manualLocationMap.on("move", function(){
confirmManualLocationButton.disabled = true;
      selectedLocationName.textContent =
        "Move map to select location";

      mapPinPlaceName.textContent =
        "Selecting...";

    });


    manualLocationMap.on("moveend", function(){

      const center = manualLocationMap.getCenter();

      scheduleMapReverseGeocode(
        center.lat,
        center.lng
      );

    });

  }else{

    manualLocationMap.setView(
      [latitude, longitude],
      18,
      {
        animate:false
      }
    );

  }

  manualLocationMap.invalidateSize();

  scheduleMapReverseGeocode(
    latitude,
    longitude
  );

}


/* =========================
   MAP DRAG ADDRESS UPDATE
========================= */

function scheduleMapReverseGeocode(latitude, longitude){

  clearTimeout(reverseTimer);

  reverseTimer = setTimeout(function(){

    updateMapAddress(latitude, longitude);

  }, 450);

}


async function updateMapAddress(latitude, longitude){

  const requestNumber = ++reverseRequestNumber;

  try{

    const locationData =
      await reverseGeocode(latitude, longitude);

    if(requestNumber !== reverseRequestNumber){
      return;
    }

    selectedManualLocation = {
      ...locationData,
      latitude,
      longitude,
      locationType:"manual"
    };

    const placeName =
      locationData.village ||
      locationData.neighbourhood ||
      locationData.city ||
      locationData.road ||
      "Selected location";

    mapPinPlaceName.textContent = placeName;
    selectedLocationName.textContent = placeName;

    selectedLocationAddress.textContent =
      locationData.fullAddress ||
      "Selected map location";
confirmManualLocationButton.disabled = false;
  }catch(error){

    console.error("Reverse location failed:", error);

    selectedManualLocation = {
      latitude,
      longitude,
      locationType:"manual",
      fullAddress:"",
      addressFound:false
    };

    mapPinPlaceName.textContent =
      "Selected location";

    selectedLocationName.textContent =
      "Selected location";

    selectedLocationAddress.textContent =
      latitude.toFixed(6) +
      ", " +
      longitude.toFixed(6);
confirmManualLocationButton.disabled = true;
  }

}


/* =========================
   MANUAL CURRENT LOCATION
========================= */

manualCurrentLocationButton.addEventListener(
  "click",
  openDeviceLocationOnMap
);

goCurrentLocationButton.addEventListener(
  "click",
  openDeviceLocationOnMap
);


function openDeviceLocationOnMap(){

  if(!navigator.geolocation){

    console.error("Geolocation is not supported.");
    return;

  }

  navigator.geolocation.getCurrentPosition(

    function(position){

      openConfirmLocation(
        position.coords.latitude,
        position.coords.longitude
      );

    },

    function(error){

      console.error(
        "Unable to access current location:",
        error
      );

    },

    {
      enableHighAccuracy:true,
      timeout:20000,
      maximumAge:0
    }

  );

}


/* =========================
   CONFIRM AND SAVE SILENTLY
========================= */

confirmManualLocationButton.addEventListener(
  "click",
  function(){

    if(!manualLocationMap){
      return;
    }

    const center = manualLocationMap.getCenter();

    const finalLocation = {
      ...(selectedManualLocation || {}),
      latitude:center.lat,
      longitude:center.lng,
      locationType:"manual"
    };

    saveLocationToStorage(finalLocation);

    console.log(
      "Manual location saved:",
      finalLocation
    );

    openScurbHomePage();

  }
);


/* =========================
   REVERSE GEOCODING
========================= */

async function reverseGeocode(latitude, longitude){

  const url =
    "https://nominatim.openstreetmap.org/reverse" +
    "?format=jsonv2" +
    "&lat=" + encodeURIComponent(latitude) +
    "&lon=" + encodeURIComponent(longitude) +
    "&zoom=18" +
    "&addressdetails=1";

  const response = await fetch(url, {
    headers:{
      "Accept":"application/json",
      "Accept-Language":"en"
    }
  });

  if(!response.ok){
    throw new Error("Address request failed.");
  }

  const result = await response.json();
  const address = result.address || {};

  const houseNumber =
    address.house_number || "";

  const road =
    address.road ||
    address.residential ||
    address.pedestrian ||
    address.footway ||
    address.path ||
    "";

  const neighbourhood =
    address.neighbourhood ||
    address.suburb ||
    address.quarter ||
    address.hamlet ||
    "";

  const village =
    address.village ||
    address.hamlet ||
    address.locality ||
    "";

  const city =
    address.city ||
    address.town ||
    address.municipality ||
    address.village ||
    "";

  const district =
    address.state_district ||
    address.county ||
    address.district ||
    "";

  const state =
    address.state || "";

  const postcode =
    address.postcode || "";

  const country =
    address.country || "";

  const countryCode =
    address.country_code || "";

  const streetAddress = [
    houseNumber,
    road
  ]
  .filter(Boolean)
  .join(", ");

  const fullAddress =
    result.display_name || [
      streetAddress,
      neighbourhood,
      village,
      city,
      district,
      state,
      postcode,
      country
    ]
    .filter(Boolean)
    .join(", ");

  return {
    houseNumber,
    road,
    streetName:road,
    streetAddress,
    neighbourhood,
    village,
    city,
    district,
    state,
    postcode,
    country,
    countryCode,
    fullAddress
  };

}


/* =========================
   SAVE LOCAL STORAGE
========================= */

function saveLocationToStorage(location){

  const latitude =
    Number(location.latitude);

  const longitude =
    Number(location.longitude);

  const savedLocation = {
    ...location,
    latitude,
    longitude,
    locationSavedAt:new Date().toISOString()
  };


  localStorage.setItem(
    "scurbMateLatitude",
    String(latitude)
  );

  localStorage.setItem(
    "scurbMateLongitude",
    String(longitude)
  );

  localStorage.setItem(
    "scurbMateHouseNumber",
    location.houseNumber || ""
  );

  localStorage.setItem(
    "scurbMateStreetName",
    location.streetName ||
    location.road ||
    ""
  );

  localStorage.setItem(
    "scurbMateStreetAddress",
    location.streetAddress || ""
  );

  localStorage.setItem(
    "scurbMateNeighbourhood",
    location.neighbourhood || ""
  );

  localStorage.setItem(
    "scurbMateVillage",
    location.village || ""
  );

  localStorage.setItem(
    "scurbMateCity",
    location.city || ""
  );

  localStorage.setItem(
    "scurbMateDistrict",
    location.district || ""
  );

  localStorage.setItem(
    "scurbMateState",
    location.state || ""
  );

  localStorage.setItem(
    "scurbMatePostcode",
    location.postcode || ""
  );

  localStorage.setItem(
    "scurbMateCountry",
    location.country || ""
  );

  localStorage.setItem(
    "scurbMateCountryCode",
    location.countryCode || ""
  );

  localStorage.setItem(
    "scurbMateFullAddress",
    location.fullAddress || ""
  );

  localStorage.setItem(
    "scurbMateLocationType",
    location.locationType || ""
  );

  localStorage.setItem(
    "scurbMateCurrentLocation",
    JSON.stringify(savedLocation)
  );

  localStorage.setItem(
    "scurbMateLocationPermission",
    "granted"
  );

}


/* =========================
   HTML SAFETY
========================= */

function escapeLocationHTML(value){

  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}
