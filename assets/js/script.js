var token =
  "pk.eyJ1Ijoia2lsbGJlZXZvbDIiLCJhIjoiY2twdndpanZ0MHltZjJ2b2lhNmp3Y2k3cCJ9.ZxtIFLMKwODb0Cp2ZfIcDw";

var myMap = L.map("mapid");
const submit = document.getElementById("submit");

submit.addEventListener("click", searchApi);

var globalCities = [];

fetch(`https://www.trackcorona.live/api/cities`)
  .then((response) => response.json())
  .then((response) => {
    var data = response.data;

    for (let i = 0; i < data.length; i++) {
      globalCities.push(data[i]);
    }
  });

function searchApi(event) {
  event.preventDefault();
  const search = document.getElementById("search").value;
  console.log(search);

  fetch(`https://www.trackcorona.live/api/provinces/${search}`)
    .then((response) => response.json())
    .then((response) => {
      console.log(response.data[0]);

      const latitude = response.data[0].latitude;
      const longitude = response.data[0].longitude;
      myMap.setView([latitude, longitude], 8);

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

      var circle = L.circle([latitude, longitude], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 100000,
      }).addTo(myMap);

      circle.bindPopup(
        "<span class='stateName'>" +
          response.data[0].location +
          "</span><br>Confirmed cases " +
          response.data[0].confirmed
      );
    });
}
