<<<<<<< HEAD
/* COVID DATA FETCH FOR STATE NAME , LOCAL STORAGE AND MAPPING - DEEPA KRISHNAN */
var searchFormEl = document.getElementById("search-form"); // form element for handling events
var stateInputEl = document.getElementById("state-name"); // user input state name
var buttonContainerEl = document.querySelector("#state-buttons"); // container for the search history buttons
var stateSelectedEl = document.querySelector("#search-state"); //  displaying the state selected in main page
var covidDataContainerEl = document.querySelector("#covid-data");
var chosenStateName; //variable to store state name
//Array of objects to store  state name in local storage
var stateNameArr = JSON.parse(localStorage.getItem("state")) || [];

const clearButtonEl = document.querySelector("#clear-button");
/* END OF  VARIABLE DECLARATION */
// when clear button is clicked the local storage is cleared and the page reloaded if the user wants
var clearHistory = function () {
  // event.preventDefault();
  localStorage.clear();
};
clearButtonEl.addEventListener("click", clearHistory());
//modal
const modalEl = document.querySelector(".modal");
const modalBgEl = document.querySelector(".modal-background");
var popupError = function () {
  modalEl.classList.remove("hide");
  modalEl.classList.add("is-active");
};

modalEl.addEventListener("click", () => {
  modalEl.classList.remove("is-active");
});

// Display search history button
var displayButtons = function () {
  var stateArr = stateNameArr;

  while (buttonContainerEl.lastChild != null) {
    // remove previous  children
    buttonContainerEl.removeChild(buttonContainerEl.lastChild);
  }
  // refresh the button list
  if (stateArr != null) {
    for (let i = 0; i < stateArr.length; i++) {
      var buttonEl = document.createElement("button"); // create a button element
      buttonEl.className = "button";
      buttonEl.innerHTML = stateArr[i]; // Add the state name
      buttonContainerEl.appendChild(buttonEl); // append to search history button container
    }
    if (stateArr.length)
      document.querySelector("#state-list").classList.remove("hide"); //display the button element container
    document.querySelector(".clearbtn").classList.remove("hide");
  }
};

// Save state names in Local storage
var saveInLocalStorage = function (state) {
  if (stateNameArr.length >= 5) stateNameArr.shift(); // Pop the state name  in the first index out of the array
  stateNameArr.push(state);
  // Making sure the state name is not repeated , we convert it into a Set element
  stateNameArr = [...new Set(stateNameArr)]; // Use Set datatype to store non-repetitive data
  localStorage.setItem("state", JSON.stringify(stateNameArr));
  // Display recently searched states
  displayButtons();
};
//Display Data on HTML
var displayCovidData = function (chosenStateName, data) {
  if (
    data.length === 0 ||
    chosenStateName == "null" ||
    chosenStateName == "undefined"
  ) {
    stateSelectedEl.textContent = "";
    return;
  }
  while (covidDataContainerEl.lastChild != null) {
    covidDataContainerEl.removeChild(covidDataContainerEl.lastChild);
  } // remove previous  children

  var thisDate = data.lastUpdatedDate; //Current date
  stateSelectedEl.innerHTML = chosenStateName + " Last updated: " + thisDate;

  var populationEl = document.createElement("p");
  populationEl.innerHTML = "Population:" + data.population; //population of the State
  covidDataContainerEl.appendChild(populationEl);

  var positivecaseEl = document.createElement("p");
  positivecaseEl.innerHTML = "Tested Positive:" + data.actuals.positiveTests; //tested positive admitted plus non -admitted cases
  covidDataContainerEl.appendChild(positivecaseEl);

  var casesEl = document.createElement("p");
  casesEl.innerHTML = "Hospitalzed:" + data.actuals.cases; // admittend in the hospital
  covidDataContainerEl.appendChild(casesEl);

  var newcaseEl = document.createElement("p");
  newcaseEl.innerHTML = " New Cases:" + data.actuals.newCases; //Daily new cases is the number of new COVID cases per day per unit of population 100k
  covidDataContainerEl.appendChild(newcaseEl);

  var recentdeathsEl = document.createElement("p");
  recentdeathsEl.innerHTML = "Deaths:" + data.actuals.newDeaths;
  covidDataContainerEl.appendChild(recentdeathsEl);

  var vaccineEl = document.createElement("p");
  vaccineEl.innerHTML =
    "Vaccines Administered:" + data.actuals.vaccinesAdministered; // No of people who have been vaccinated or  had their first does of vaccine.
  covidDataContainerEl.appendChild(vaccineEl);

  var icuEL = document.createElement("p");
  icuEL.innerHTML = "ICU Cases:" + data.actuals.icuBeds.currentUsageCovid; // no of coivd patients admittedin ICU
  covidDataContainerEl.appendChild(icuEL);

  var linkEl = document.createElement("a");
  linkEl.innerHTML = "Click here for more info";
  linkEl.setAttribute("href", data.url); // Link to detailed report
  linkEl.setAttribute("class", "covidinfo");
  covidDataContainerEl.appendChild(linkEl);
};

//Get the state information
var getStateInfo = function (state) {
  if (state != "undefined") {
    const apiURL =
      "https://api.covidactnow.org/v2/state/" +
      state +
      ".json?apiKey=a70af13784c14287ae753ec51cf42a65";
    fetch(apiURL)
      .then(function (response) {
        // If promise is fullfilled
        if (response.ok) {
          response.json().then(function (data) {
            displayCovidData(state, data); // Call display function to display data in HTML
            saveInLocalStorage(state); // save state name in local storage
          });
        } else {
          popupError();
          document.location.replace("./index.html"); // load the homepage
          return;
        }
      })
      .catch(function (error) {
        popupError();
      });
  }
  return;
};
// Event handler when user submits the state name
var formSubmitHandler = function (event) {
  event.preventDefault();
  chosenStateName = stateInputEl.value.trim(); // remove spaces
  chosenStateName.toUpperCase(); //convert to uppercase
  if (chosenStateName) {
    var convertedName = convertNames(chosenStateName, TO_NAME); // call function to get Abbrevation
    // If return value is null
    if (convertedName == null) {
      convertedName = convertNames(chosenStateName, TO_ABBREVIATED); //call function to get statename
      //Check if the abbrevation returned null as well
      if (convertedName == null) {
        // alert("Please enter a valid state name");  // If so its an invalid user input
        popupError();
      } else {
        // If user input is state name
        searchApi(chosenStateName); // call the map function to display map with state name
        getStateInfo(convertedName.toUpperCase()); // call the state info with abbrevation
      }
    }
    // if user input is  state code
    else {
      searchApi(convertedName); // call the map function with name  converted from state code
      getStateInfo(chosenStateName.toUpperCase()); //call thr state info function
    }
    stateInputEl.value = "";
  } else {
    popupError();
  }

  return;
};
searchFormEl.addEventListener("submit", formSubmitHandler);
// History button clicks handlers
var buttonClickHandler = function (event) {
  event.preventDefault();
  event.target.getAttribute("innerHTML"); // get the text of the button that was clicked
  let i = 0;
  while (i < stateNameArr.length) {
    if (event.target.innerHTML == stateNameArr[i]) {
      //check if the event.target element name matches with state name in Local storage,
      var stateClicked = event.target.innerHTML;
      // do mapping to display map
      var convertedName = convertNames(stateClicked, TO_NAME);
      if (convertedName == null) {
        convertedName = convertNames(stateClicked, TO_ABBREVIATED);
        searchApi(stateClicked); // get the map info of the button clicked
        getStateInfo(convertedName); // get the state info
      } else {
        // If abbrevaation is saved
        searchApi(convertedName); //  convert to statename and call Searchapi to display map
        getStateInfo(stateClicked); //call stateinfo
      }
      //get the state  info and display
      break;
    }
    i++;
  }
};
buttonContainerEl.addEventListener("click", buttonClickHandler); //Eventlistener for Serach history buttons

const TO_NAME = 1;
const TO_ABBREVIATED = 2;
function convertNames(input, to) {
  // array of array used to map state name and code
  var states = [
    ["Alabama", "AL"],
    ["Alaska", "AK"],
    ["American Samoa", "AS"],
    ["Arizona", "AZ"],
    ["Arkansas", "AR"],
    ["Armed Forces Americas", "AA"],
    ["Armed Forces Europe", "AE"],
    ["Armed Forces Pacific", "AP"],
    ["California", "CA"],
    ["Colorado", "CO"],
    ["Connecticut", "CT"],
    ["Delaware", "DE"],
    ["District Of Columbia", "DC"],
    ["Florida", "FL"],
    ["Georgia", "GA"],
    ["Guam", "GU"],
    ["Hawaii", "HI"],
    ["Idaho", "ID"],
    ["Illinois", "IL"],
    ["Indiana", "IN"],
    ["Iowa", "IA"],
    ["Kansas", "KS"],
    ["Kentucky", "KY"],
    ["Louisiana", "LA"],
    ["Maine", "ME"],
    ["Marshall Islands", "MH"],
    ["Maryland", "MD"],
    ["Massachusetts", "MA"],
    ["Michigan", "MI"],
    ["Minnesota", "MN"],
    ["Mississippi", "MS"],
    ["Missouri", "MO"],
    ["Montana", "MT"],
    ["Nebraska", "NE"],
    ["Nevada", "NV"],
    ["New Hampshire", "NH"],
    ["New Jersey", "NJ"],
    ["New Mexico", "NM"],
    ["New York", "NY"],
    ["North Carolina", "NC"],
    ["North Dakota", "ND"],
    ["Northern Mariana Islands", "NP"],
    ["Ohio", "OH"],
    ["Oklahoma", "OK"],
    ["Oregon", "OR"],
    ["Pennsylvania", "PA"],
    ["Puerto Rico", "PR"],
    ["Rhode Island", "RI"],
    ["South Carolina", "SC"],
    ["South Dakota", "SD"],
    ["Tennessee", "TN"],
    ["Texas", "TX"],
    ["Utah", "UT"],
    ["Vermont", "VT"],
    ["Virginia", "VA"],
    ["Washington", "WA"],
    ["West Virginia", "WV"],
    ["Wisconsin", "WI"],
    ["Wyoming", "WY"],
  ];

  var regions = states.concat(states); // concatenate to single array

  var i;
  // to find the state code given state name
  if (to == TO_ABBREVIATED) {
    input = input.toUpperCase(); // convert to upper case
    // for every word in the string , convert the first Character to uppercase and the rest of them to lowercase.
    input = input.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }); // Convert the first character into upper case
    for (i = 0; i < regions.length; i++) {
      // check if state name is in the arrat
      if (regions[i][0] == input) {
        // return the state code
        return regions[i][1];
      }
    }
  }
  // to find state name if user inputs state code
  else if (to == TO_NAME) {
    input = input.toUpperCase(); //convert to uppercase
    for (i = 0; i < regions.length; i++) {
      // Check if the state code is in the array
      if (regions[i][1] == input) {
        //  return state name
        return regions[i][0];
      }
    }
  }
  // return null if the statename or statecode is not found
  return null;
}
/* END OF DEEPA's CODE */

/* CODE OF MAP STARTS HERE CODED BY - DYRAVUTH YORN */
const token =
  "pk.eyJ1Ijoia2lsbGJlZXZvbDIiLCJhIjoiY2twdndpanZ0MHltZjJ2b2lhNmp3Y2k3cCJ9.ZxtIFLMKwODb0Cp2ZfIcDw"; // api key

const myMap = L.map("mapid"); //Map Object
=======
var searchFormEl = document.getElementById("search-form"); // form element for handling events
var stateInputEl = document.getElementById("state-name"); // user input state name 
var buttonContainerEl =document.querySelector("#state-buttons"); // container for the serch history buttons
var stateSelectedEl =document.querySelector("#search-state"); //  displaying the state selected in main  page 
var covidDataContainerEl = document.querySelector("#covid-data");

var chosenStateName; //variable to store state name 
//Array of objects to store  state name in local storage 
var stateNameArr = JSON.parse(localStorage.getItem("state")) ||[];

/* END OF  VARIABLE DECLARATION */
//Convert the first letter of the state name to uppercase
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// Display search history button 
var displayButtons = function()
{
    var stateArr= stateNameArr;

    while(buttonContainerEl.lastChild != null) {
    buttonContainerEl.removeChild(buttonContainerEl.lastChild);
    } // remove previous  children 

    // refresh the button list 
    if(stateArr != null) {
    for ( let i=0;i<stateArr.length; i++){
         var buttonEl = document.createElement("button");
            buttonEl.className ="btn";
        buttonEl.innerHTML =stateArr[i] ;
        buttonContainerEl.appendChild(buttonEl);
     }
     if(stateArr.length)
        document.querySelector("#state-list").classList.remove("hide"); //display the button element container  
    }

}
// Save state names in Local storage 
var saveInLocalStorage =function(state){
    if (stateNameArr.length >=5) stateNameArr.shift(); // Pop the state name  in the first index out of the array
    stateNameArr.push(state);
    // Making sure the state name is not repeated , we convert it into a Set element
    stateNameArr = [...new Set(stateNameArr)]; // Use Set datatype to store non-repetitive data 
    localStorage.setItem("state",JSON.stringify(stateNameArr));  
    // Display recently searched states 
    displayButtons();   
}

var displayCovidData= function(chosenStateName, data) 
{
    console.log(chosenStateName);
    if (data.length === 0 || chosenStateName == "null"|| chosenStateName=="undefined") {
        stateSelectedEl.textContent = "";
        return;
} 
    // console.log(data.riskLevels.infectionRate) //Infection rate is the estimated number of new people each COVID-positive person will infect
   
    while(covidDataContainerEl.lastChild != null) {
        covidDataContainerEl.removeChild(covidDataContainerEl.lastChild);
        } // remove previous  children 

    var thisDate =data.lastUpdatedDate;

    stateSelectedEl.innerHTML =chosenStateName+ " Last updated: "+ thisDate;

    var populationEl =document.createElement("p");
    populationEl.innerHTML="Population :"+data.population; //population of the State 
    covidDataContainerEl.appendChild(populationEl);

    var positivecaseEl =document.createElement("p");
    positivecaseEl.innerHTML="Total No of people tested positive:" + data.actuals.positiveTests; //tested positive admitted plus non -admitted cases 
    covidDataContainerEl.appendChild(positivecaseEl);

    var casesEl =document.createElement("p");
    casesEl.innerHTML= "Cases admitted since the start:"+ data.actuals.cases // admittend in the hospital 
    covidDataContainerEl.appendChild(casesEl);

    var newcaseEl =document.createElement("p");
    newcaseEl.innerHTML =" No of new cases today:"+ data.actuals.newCases; //Daily new cases is the number of new COVID cases per day per unit of population 100k
    covidDataContainerEl.appendChild(newcaseEl);

    var recentdeathsEl =document.createElement("p");
    recentdeathsEl.innerHTML="Death cases today" + data.actuals.newDeaths;
    covidDataContainerEl.appendChild(recentdeathsEl);

    var vaccineEl = document.createElement("p");
    vaccineEl.innerHTML="Vaccines administered :" + data.actuals.vaccinesAdministered; // No of people who have been vaccinated or  had their first does of vaccine.
    covidDataContainerEl.appendChild(vaccineEl);

    var icuEL = document.createElement("p");
    icuEL.innerHTML = "No cases in ICU :"+ data.actuals.icuBeds.currentUsageCovid;
    covidDataContainerEl.appendChild(icuEL);

    var linkEl = document.createElement("a");
    linkEl.innerHTML ="Detailed Information"
    linkEl.setAttribute("href",data.url);
    covidDataContainerEl.appendChild(linkEl);
 
};
var getStateInfo = function(state){
    if ( state != "undefined" ){
    
    const apiURL = "https://api.covidactnow.org/v2/state/"+state+".json?apiKey=a70af13784c14287ae753ec51cf42a65"
    fetch(apiURL)
    .then(function(response) {
    if(response.ok){
        response.json().then(function(data) {
            console.log(data);
            // var chosenStateTitle=toTitleCase(chosenStateName);
            displayCovidData(state,data);
            saveInLocalStorage(state);            
                   
        });
    }
    else {
        alert(' invalid name ');   
        document.location.replace("./index.html");
        return; 
    } 
     })  
     .catch(function(error) {
        alert("Unable to connect");
      }) ;
    }
    return;
}
// Event handler when user submits the state name     
var formSubmitHandler = function(event) {
    
    event.preventDefault(); 
    chosenStateName = stateInputEl.value.trim();
    chosenStateName.toUpperCase();
    console.log(chosenStateName);
    if (chosenStateName) {    
        var convertedName = convertNames(chosenStateName,TO_NAME);
        if(convertedName == null) {
        convertedName = convertNames(chosenStateName, TO_ABBREVIATED);
         console.log(convertedName);
         searchApi(chosenStateName);
        getStateInfo(convertedName);
       }
       else {
         searchApi(convertedName);
         console.log(chosenStateName);
         getStateInfo(chosenStateName); 
       }
       console.log(convertedName);
        stateInputEl.value = ""; 
      } else {
        alert("Please enter a state name");
      }
      return;
  };
searchFormEl.addEventListener("submit",formSubmitHandler); 
// History button clicks handlers
var buttonClickHandler =function (event){
    event.preventDefault();
    console.log(event.target);
    event.target.getAttribute("innerHTML");
    let i= 0;
    while (i<stateNameArr.length){
    if (event.target.innerHTML == stateNameArr[i]) //check if the event.target element name matches with state name in Local storage, 
       { var stateClicked = event.target.innerHTML ;
        console.log(stateClicked);
        var convertedName = convertNames(stateClicked,TO_NAME);
       if(convertedName == null) {
          convertedName = convertNames(stateClicked, TO_ABBREVIATED);
           searchApi(stateClicked);
           getStateInfo(convertedName);
        }
        else {
          searchApi(convertedName);
          getStateInfo(stateClicked); 
        }
        console.log(convertedName);

        //get the state  info and display
        break;   
      }
      i++;
    }
};
buttonContainerEl.addEventListener("click", buttonClickHandler);  //Eventlistener for Serach history buttons 

const TO_NAME = 1;
const TO_ABBREVIATED = 2;

function convertNames(input, to) {
    var states = [
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['American Samoa', 'AS'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['Armed Forces Americas', 'AA'],
        ['Armed Forces Europe', 'AE'],
        ['Armed Forces Pacific', 'AP'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['District Of Columbia', 'DC'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Guam', 'GU'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Marshall Islands', 'MH'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Northern Mariana Islands', 'NP'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Puerto Rico', 'PR'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    var regions = states.concat(states);

    var i; // Reusable loop variable
    if (to == TO_ABBREVIATED) {
        input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        for (i = 0; i < regions.length; i++) {
            if (regions[i][0] == input) {
                return (regions[i][1]);
            }
        }
    } else if (to == TO_NAME) {
        input = input.toUpperCase();
        for (i = 0; i < regions.length; i++) {
            if (regions[i][1] == input) {
                return (regions[i][0]);
            }
        }
    }
    return null;
}

const token =
  "pk.eyJ1Ijoia2lsbGJlZXZvbDIiLCJhIjoiY2twdndpanZ0MHltZjJ2b2lhNmp3Y2k3cCJ9.ZxtIFLMKwODb0Cp2ZfIcDw";

const myMap = L.map("mapid");
>>>>>>> e3347e0cdcfe08359877b829f8ca7b3a805093e5

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
<<<<<<< HEAD
=======
// EventListener for form submit -> run searchApi function
//submit.addEventListener("click", searchApi);
>>>>>>> e3347e0cdcfe08359877b829f8ca7b3a805093e5

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
<<<<<<< HEAD

    // For loop to copy info to globalCities
=======
    // For loop to copy info to globalCities

>>>>>>> e3347e0cdcfe08359877b829f8ca7b3a805093e5
    for (let i = 0; i < data.length; i++) {
      globalCities.push(data[i]);
    }
  });
<<<<<<< HEAD

// Function for searching for covid data
var searchApi = function (state) {
  // Grabs text value, convert to lowercase and removes whitespace from both ends.
  const search = state.toLowerCase().trim();

  // filtering globalCities for search results and storing into filteredCities
=======
// Function for searching for covid data
var searchApi = function (state) {
  //event.preventDefault();
  // Grabs text value, convert to lowercase and removes whitespace from both ends.
  const search = state.toLowerCase().trim();

    // filtering globalCities for search results and storing into filteredCities
>>>>>>> e3347e0cdcfe08359877b829f8ca7b3a805093e5
  filteredCities = globalCities.filter(
    (city) =>
      city.location.toLowerCase().search(search) > -1 &&
      city.country_code === "us"
  );
<<<<<<< HEAD
  // for loop to remove markers after new search
  if (markers.length > 0) {
    for (let i = 0; i < markers.length; i++) {
      myMap.removeLayer(markers[i]);
    }
    markers = [];
  }
  // for loop adding data when clicked
  for (let i = 0; i < filteredCities.length; i++) {
    var cases = filteredCities[i].confirmed || 0;
    var dead = filteredCities[i].dead || 0;
    var latitude = filteredCities[i].latitude;
    var longitude = filteredCities[i].longitude;
    // var location = filteredCities[i].location;
    var city = filteredCities[i].location.split(",")[0];
    var state = filteredCities[i].location.split(",")[1] || "";

    if (state.toLowerCase().trim() === search.toLowerCase().trim()) {
      myMap.setView([latitude, longitude], 5);

      // creating circles markers to place on map of searched city
      const circle = L.circle([latitude, longitude], {
        color: "red",
        fillColor: "#f03",
        fillOpacity: 0.5,
        radius: 8000,
      }).addTo(myMap);

      // information pop for marker when clicked
      circle.bindPopup(
        "<span class='stateName'>" +
          city +
          "</span><hr>Confirmed cases " +
          cases +
          "<br>Death " +
          dead
      );
      markers.push(circle);
    }
  }
  return;
};
=======
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
    // ).addTo(myMap);

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
  return;
  
}
>>>>>>> e3347e0cdcfe08359877b829f8ca7b3a805093e5
