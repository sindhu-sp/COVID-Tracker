// variable for api
const token =
  "pk.eyJ1Ijoia2lsbGJlZXZvbDIiLCJhIjoiY2twdndpanZ0MHltZjJ2b2lhNmp3Y2k3cCJ9.ZxtIFLMKwODb0Cp2ZfIcDw";

const myMap = L.map("mapid");
const submit = document.getElementById("submit");

// access mapbox api to get map image and show it in the map div
L.tileLayer(
  `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`,
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: "mapbox/streets-v11",
    tileSize: 512,
    zoomOffset: -1,
    accessToken: token,
  }
).addTo(myMap);
// EventListener for form submit -> run searchApi function
submit.addEventListener("click", searchApi);

// creating variables for storing data
const globalCities = [];
let filteredCities = [];
let markers = [];

// Getting information for cities worldwide
fetch(`https://www.trackcorona.live/api/cities`)
  .then((response) => response.json())
  .then((response) => {
    // Create a pointer
    const data = response.data;
    // For loop to copy info to globalCities
    for (let i = 0; i < data.length; i++) {
      globalCities.push(data[i]);
    }
  });
// Function for searching for covid data
function searchApi(event) {
  // prevent default actions
  event.preventDefault();
  // Grabs text value, convert to lowercase and removes whitespace from both ends.
  const search = document.getElementById("search").value.toLowerCase().trim();
  // filtering globalCities for search results and storing into filteredCities
  filteredCities = globalCities.filter(
    (city) =>
      city.location.toLowerCase().search(search) > -1 &&
      city.country_code === "us"
  );
  console.log(filteredCities);
  // for loop to remove markers after new search
  if (markers.length > 0) {
    for (let i = 0; i < markers.length; i++) {
      myMap.removeLayer(markers[i]);
    }
    markers = [];
  }
  // for loop adding data when clicked
  for (let i = 0; i < filteredCities.length; i++) {
    var cases = filteredCities[i].confirmed;
    var dead = filteredCities[i].dead;
    var latitude = filteredCities[i].latitude;
    var longitude = filteredCities[i].longitude;
    var location = filteredCities[i].location;

    myMap.setView([latitude, longitude], 5);
    // creating circles markers to place on map of searched city
    var circle = L.circle([latitude, longitude], {
      color: "red",
      fillColor: "#f03",
      fillOpacity: 0.5,
      radius: 8000,
    }).addTo(myMap);
    // information pop for marker when clicked
    circle.bindPopup(
      "<span class='stateName'>" +
        location +
        "</span><hr>Confirmed cases " +
        cases +
        "<br>Death " +
        dead
    );
    markers.push(circle);
  }
}
