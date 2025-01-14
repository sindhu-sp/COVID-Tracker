/* COVID DATA FETCH FOR STATE NAME , LOCAL STORAGE AND MAPPING - DEEPA KRISHNAN */
var searchFormEl = document.getElementById("search-form"); // form element for handling events
var stateInputEl = document.getElementById("state-name"); // user input state name 
var buttonContainerEl =document.querySelector("#state-buttons"); // container for the serch history buttons
var stateSelectedEl =document.querySelector("#search-state"); //  displaying the state selected in main  page 
var covidDataContainerEl = document.querySelector("#covid-data");
var chosenStateName; //variable to store state name 
//Array of objects to store  state name in local storage 
var stateNameArr = JSON.parse(localStorage.getItem("state")) ||[];
/* END OF  VARIABLE DECLARATION */

//modal code by SINDHU PILLAI
const modalEl = document.querySelector(".modal")
const modalBgEl =document.querySelector(".modal-background")
// alert when there is an error 
var popupError=function() 
{
  modalEl.classList.remove("hide");
  modalEl.classList.add("is-active");
}

modalEl.addEventListener("click",()=>
{
  modalEl.classList.remove("is-active");
})
/* END OF SINDHU"S CODE */

// Display search history button 
var displayButtons = function()
{
    var stateArr= stateNameArr;

    while(buttonContainerEl.lastChild != null) {
    // remove previous  children 
    buttonContainerEl.removeChild(buttonContainerEl.lastChild);
    } 
    // refresh the button list 
    if(stateArr != null) {
    for ( let i=0;i<stateArr.length; i++){
         var buttonEl = document.createElement("button"); // create a button element 
            buttonEl.className ="button";
            buttonEl.classList.add("is-dark");

            buttonEl.classList.add("is-outlined");
        buttonEl.innerHTML =stateArr[i] ; // Add the state name 
        buttonContainerEl.appendChild(buttonEl); // append to search history button container 
     }
     if(stateArr.length){
        document.querySelector("#state-list").classList.remove("hide"); //display the button element container  
        var clearBtn = document.createElement("button");
      clearBtn.className = "clear-btn";
      clearBtn.id = "clear-button";
      buttonEl.classList.add("is-outlined");
    
      clearBtn.setAttribute("type", "click");
      clearBtn.innerHTML = "CLEAR";
      // attach eventlistener function that will remove things fromlocalstorage
      clearBtn.addEventListener("click", function () {
        // remove from localstrage
        localStorage.removeItem("state");
        // reset the state array in memory to empty array
        stateNameArr = [];
        // remove existing buttons from recent searches container
        while (buttonContainerEl.lastChild != null) {
          // remove previous  children
          buttonContainerEl.removeChild(buttonContainerEl.lastChild);
        }
        document.querySelector("#state-list").classList.add("hide");
      });
      buttonContainerEl.appendChild(clearBtn);
    
    
      }
  }
}

// Save state names in Local storage 
var saveInLocalStorage =function(state){
    stateNameArr.push(state);
    // Making sure the state name is not repeated , we convert it into a Set element
    stateNameArr = [...new Set(stateNameArr)]; // Use Set datatype to store non-repetitive data 
 
    // use > 5 to limit to 5 states in search history
    // Do this check after duplicates have been removed - duplicate scenario happens when a search button is clicked
    if (stateNameArr.length >5) stateNameArr.shift(); // Pop the state name  in the first index out of the array

    localStorage.setItem("state",JSON.stringify(stateNameArr));  

    // Display recently searched states 
    displayButtons();   
    //console.log(localStorage);

}

//Display Data on HTML 
var displayCovidData= function(chosenStateName, data) 
{
    if (data.length === 0 || chosenStateName == "null"|| chosenStateName=="undefined") {
        stateSelectedEl.textContent = "";
        return;
}    
    while(covidDataContainerEl.lastChild != null) {
        covidDataContainerEl.removeChild(covidDataContainerEl.lastChild);
        } // remove previous  children 

    var thisDate =data.lastUpdatedDate; //Current date
    stateSelectedEl.innerHTML =chosenStateName+ " Last updated: "+ thisDate;

    //population of the State 
    var populationEl =document.createElement("tr");
    var popTitleEl =document.createElement("td");
    popTitleEl.innerHTML ="Population"
    var popDataEl =document.createElement("td");
    popDataEl.innerHTML=data.population; 
    populationEl.appendChild(popTitleEl);
    populationEl.appendChild(popDataEl);
    covidDataContainerEl.appendChild(populationEl);

    //tested positive admitted plus non -admitted cases 
    var positivecaseEl =document.createElement("tr");
    var positivecaseTitleEl =document.createElement("td");
    positivecaseTitleEl.innerHTML="Tested Positive";
    positivecaseEl.appendChild(positivecaseTitleEl);
    var positivecaseDataEl=document.createElement("td");
    positivecaseDataEl.innerHTML= data.actuals.positiveTests; 
    positivecaseEl.appendChild(positivecaseDataEl);
    covidDataContainerEl.appendChild(positivecaseEl);

     // admittend in the hospital 
    var casesEl =document.createElement("tr");
    var casesTitleEl = document.createElement("td");
    casesTitleEl.innerHTML="Hospitalized";
    casesEl.appendChild(casesTitleEl);
    var casesDataEl =document.createElement("td");
    casesDataEl.innerHTML=  data.actuals.cases;
    casesEl.appendChild(casesDataEl);
    covidDataContainerEl.appendChild(casesEl);

    //Daily new cases is the number of new COVID cases per day per unit of population 100k
    var newcaseEl =document.createElement("tr");
    var newcaseTitleEl = document.createElement("td");
    newcaseTitleEl.innerHTML="New Cases";
    newcaseEl.appendChild(newcaseTitleEl);
    var newcaseDataEl = document.createElement("td");
    newcaseDataEl.innerHTML =data.actuals.newCases; 
    newcaseEl.appendChild(newcaseDataEl);
    covidDataContainerEl.appendChild(newcaseEl);

    // Current death cases 
    var recentdeathsEl =document.createElement("tr");
    var recentdeathsTitleEl =document.createElement("td");
    recentdeathsTitleEl.innerHTML ="Deaths";
    recentdeathsEl.appendChild(recentdeathsTitleEl);
    var recentdeathsDataEl =document.createElement("td");
    recentdeathsDataEl.innerHTML= data.actuals.newDeaths;
    recentdeathsEl.appendChild(recentdeathsDataEl);
    covidDataContainerEl.appendChild(recentdeathsEl);

       // No of people who have been vaccinated or  had their first does of vaccine.
    var vaccineEl = document.createElement("tr");
    var vaccineTitleEl =document.createElement("td");
    vaccineTitleEl.innerHTML="Vaccines Administered" ;
    vaccineEl.appendChild(vaccineTitleEl);
    var vaccineDataEl =document.createElement("td");
    vaccineDataEl.innerHTML=data.actuals.vaccinesAdministered;
    vaccineEl.appendChild(vaccineDataEl);
    covidDataContainerEl.appendChild(vaccineEl);

    // no of coivd patients admittedin ICU
    var icuEL = document.createElement("tr");
    var icuTitleEl =document.createElement("td");
    icuTitleEl.innerHTML = "ICU Cases";  
    icuEL.appendChild(icuTitleEl);
    var icuDataEl =document.createElement("td");
    icuDataEl.innerHTML =data.actuals.icuBeds.currentUsageCovid;
    icuEL.appendChild(icuDataEl);
    covidDataContainerEl.appendChild(icuEL);

    // url  for more data 
    var urlEl = document.createElement("tr")
    var urlTitleEl = document.createElement("td");
    urlTitleEl.innerHTML ="More info"
    urlEl.appendChild(urlTitleEl);
    var urlDataEl =document.createElement("td")
    var linkEl = document.createElement("a");
    linkEl.innerHTML ="Click here "
    linkEl.setAttribute("href",data.url); // Link to detailed report 
    linkEl.setAttribute("class","covidinfo");
    urlDataEl.appendChild(linkEl);
    urlEl.appendChild(urlDataEl);
    covidDataContainerEl.appendChild(urlEl);

};

//Get the state information 
var getStateInfo = function(state){
    if ( state != "undefined" ){
    const apiURL = "https://api.covidactnow.org/v2/state/"+state+".json?apiKey=a70af13784c14287ae753ec51cf42a65"
    fetch(apiURL)
    .then(function(response) {
    // If promise is fullfilled 
    if(response.ok){
        response.json().then(function(data) {
            displayCovidData(state,data);  // Call display function to display data in HTML 
            saveInLocalStorage(state);     // save state name in local storage                   
        });
    }
    else {
      popupError();   
        document.location.replace("./index.html"); // load the homepage 
        return; 
    } 
     })  
     .catch(function(error) {
      popupError();

      }) ;
    }
    return;
}
// Event handler when user submits the state name     
var formSubmitHandler = function(event) {
    
    event.preventDefault(); 
    chosenStateName = stateInputEl.value.trim(); // remove spaces 
      chosenStateName.toUpperCase(); //convert to uppercase 
      if (chosenStateName) {    
          var convertedName = convertNames(chosenStateName,TO_NAME); // call function to get Abbrevation 
          // If return value is null
          if(convertedName == null) {
            convertedName = convertNames(chosenStateName, TO_ABBREVIATED); //call function to get statename 
            //Check if the abbrevation returned null as well 
            if(convertedName == null) {
              // alert("Please enter a valid state name");  // If so its an invalid user input 
              popupError();

            }
            else {
              // If user input is state name 
              searchApi(chosenStateName); // call the map function to display map with state name 
              getStateInfo(convertedName.toUpperCase()); // call the state info with abbrevation
            }
         }
         // if user input is  state code 
         else {
          searchApi(convertedName); // call the map function with name  converted from state code 
          getStateInfo(chosenStateName.toUpperCase());  //call thr state info function 
         }
         stateInputEl.value = ""; 
    } else {
         
          popupError();
         
    }
    
      return;
  };
searchFormEl.addEventListener("submit",formSubmitHandler); 
// History button clicks handlers
var buttonClickHandler =function (event){
    event.preventDefault();
    event.target.getAttribute("innerHTML"); // get the text of the button that was clicked 
    let i= 0;
    while (i<stateNameArr.length){
    if (event.target.innerHTML == stateNameArr[i]) //check if the event.target element name matches with state name in Local storage, 
       { var stateClicked = event.target.innerHTML ;
        // do mapping to display map 
        var convertedName = convertNames(stateClicked,TO_NAME);
       if(convertedName == null) {
          convertedName = convertNames(stateClicked, TO_ABBREVIATED);
           searchApi(stateClicked); // get the map info of the button clicked 
           getStateInfo(convertedName); // get the state info 
        }
        else {// If abbrevaation is saved 
          searchApi(convertedName); //  convert to statename and call Searchapi to display map
          getStateInfo(stateClicked);  //call stateinfo 
        }
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
  // array of array used to map state name and code 
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
    var regions = states.concat(states); // concatenate to single array 
    var i;  // initialize variable for  for loop
    // to find the state code given state name 
    if (to == TO_ABBREVIATED) {
        input = input.toUpperCase(); // convert to upper case 
        // for every word in the string , convert the first Character to uppercase and the rest of them to lowercase.
        input = input.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }); // Convert the first character into upper case 
        for (i = 0; i < regions.length; i++) {
          // check if state name is in the arrat 
            if (regions[i][0] == input) {
              // return the state code 
                return (regions[i][1]);
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
                return (regions[i][0]);
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
// creating variables for storing data
const globalCities = [];
let filteredCities = [];
let markers = [];

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
var searchApi = function (state) {

  // Grabs text value, convert to lowercase and removes whitespace from both ends.
  const search = state.toLowerCase().trim();
    // filtering globalCities for search results and storing into filteredCities
  filteredCities = globalCities.filter(
    (city) =>
      city.location.toLowerCase().search(search) > -1 &&
      city.country_code === "us"
  );
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
  
}
