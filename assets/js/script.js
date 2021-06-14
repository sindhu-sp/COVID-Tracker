var longitude = -118.2436596;
var latitude = 34.0522265;
var token =
  "pk.eyJ1Ijoia2lsbGJlZXZvbDIiLCJhIjoiY2twdndpanZ0MHltZjJ2b2lhNmp3Y2k3cCJ9.ZxtIFLMKwODb0Cp2ZfIcDw";

// var mymap = L.map("mapid").setView([latitude, longitude], 10);

// L.tileLayer(
//   `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`,
//   {
//     attribution:
//       'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: "mapbox/streets-v11",
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: token,
//   }
// ).addTo(mymap);

// var circle = L.circle([latitude, longitude], {
//   color: "red",
//   fillColor: "#f03",
//   fillOpacity: 0.5,
//   radius: 5000,
// }).addTo(mymap);

const submit = document.getElementById("submit");

submit.addEventListener("click", searchApi);

function searchApi(e) {
  e.preventDefault();
  const search = document.getElementById("search").value;
  console.log(search);

  fetch(`https://www.trackcorona.live/api/provinces/${search}`)
    .then((response) => response.json())
    .then((response) => {
      console.log(response.data[0]);

      const latitude = response.data[0].latitude;
      const longitude = response.data[0].longitude;
      var mymap = L.map("mapid").setView([latitude, longitude], 10);

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
      ).addTo(mymap);

      var circle = L.circle([latitude, longitude], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 5000,
      }).addTo(mymap);
    });
}
