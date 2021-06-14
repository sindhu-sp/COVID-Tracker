var searchFormEl = document.getElementById("search-form"); // form element for handling events
var stateInputEl = document.getElementById("state-name"); // user input state name 
var buttonContainerEl =document.querySelector("#state-buttons"); // container for the serch history buttons
var stateSelectedEl =document.querySelector("#search-state"); //  displaying the state selected in main  page 

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

// Display the city's current weather details 
var displayCovidData= function(chosenStateName, data) 
{
    if (data.length === 0) {
        staeSelectedEl.textContent = "Could not obtain data";
        return;
} 
var thisDate =data.lastUpdatedDate;
    // console.log(data.population);
    // console.log(data.actuals.cases)
    // console.log(data.actuals.positiveTests)//  tested positive not neccessarily admitted -
    // console.log(data.actuals.vaccinationsInitiated) 
    // console.log(data.actuals.vaccinesAdministered);
    // console.log(data.actuals.vaccinationsCompleted)
    // console.log (data.actuals.newCases) //Daily new cases is the number of new COVID cases per day per unit of population 100k
    // console.log(data.riskLevels.infectionRate) //Infection rate is the estimated number of new people each COVID-positive person will infect
    console.log(data.url);
//     console.log(data.actuals.icuBeds.capacity);
// console.log(data.actuals.icuBeds.currentUsageCovid);

stateSelectedEl.innerHTML =chosenStateName+"data as of  "+thisDate;

    var covidDataContainerEl = document.querySelector("#covid-data");

    var populationEl =document.createElement("li");
    populationEl.innerHTML="Population :"+data.population; //population of the State 
    covidDataContainerEl.appendChild(populationEl);

    var positivecaseEl =document.createElement("li");
    positivecaseEl.innerHTML="Total No of people tested positive:" + data.actuals.positiveTests; //tested positive admitted plus non -admitted cases 
    covidDataContainerEl.appendChild(positivecaseEl);

    var casesEl =document.createElement("li");
    casesEl.innerHTML= "Cases admitted since the start:"+ data.actuals.cases // admittend in the hospital 
    covidDataContainerEl.appendChild(casesEl);

    var newcaseEl =document.createElement("li");
    newcaseEl.innerHTML =" No of new cases today:"+ data.actuals.newCases; //Daily new cases is the number of new COVID cases per day per unit of population 100k
    covidDataContainerEl.appendChild(newcaseEl);

    var recentdeathsEl =document.createElement("li");
    recentdeathsEl.innerHTML="Death cases today" + data.actuals.newDeaths;
    covidDataContainerEl.appendChild(recentdeathsEl);

    var vaccineEl = document.createElement("li");
    vaccineEl.innerHTML="Vaccines administered :" + data.actuals.vaccinesAdministered; // No of people who have been vaccinated or  had their first does of vaccine.
    covidDataContainerEl.appendChild(vaccineEl);

    var icuEL = document.createElement("li");
    icuEL.innerHTML = "No cases in ICU :"+ data.actuals.icuBeds.currentUsageCovid;
    covidDataContainerEl.appendChild(icuEL);

    var linkEl = document.createElement("a");
    linkEl.innerHTML ="Detailed Information"
    linkEl.setAttribute("href",data.url);
    covidDataContainerEl.appendChild(linkEl);
 
};
var getStateInfo = function(state){
    const apiURL = "https://api.covidactnow.org/v2/state/"+state+".json?apiKey=a70af13784c14287ae753ec51cf42a65"
    fetch(apiURL)
    .then(function(response) {
    if(response.ok){
        response.json().then(function(data) {
            console.log(data);
            // var chosenStateTitle=toTitleCase(chosenStateName);
            displayCovidData(chosenStateName,data);
            saveInLocalStorage(chosenStateName);            
                   
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
// Event handler when user submits the state name     
var formSubmitHandler = function(event) {
    
    event.preventDefault(); 
    chosenStateName = stateInputEl.value.trim();
    chosenStateName.toUpperCase();
    console.log(chosenStateName);
    if (chosenStateName) {    
        getStateInfo(chosenStateName) ;
        stateInputEl.value = ""; 
      } else {
        alert("Please enter a state name");
      }
  };
searchFormEl.addEventListener("submit",formSubmitHandler); 
// History button clicks handlers
var buttonClickHandler =function (event){
    event.preventDefault();
    event.target.getAttribute("innerHTML");
    let i= 0;
    while (i<stateNameArr.length){
    if (event.target.innerHTML ===stateNameArr[i]) //check if the event.target element name matches with state name in Local storage, 
       { var stateClicked = stateNameArr[i] ;
        getStateInfo(stateClicked); //get the state  info and display
        break;   
      }
      i++;
    }
};
buttonContainerEl.addEventListener("click", buttonClickHandler);  //Eventlistener for Serach history buttons 

const TO_NAME = 1;
const TO_ABBREVIATED = 2;

function convertRegion(input, to) {
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
        ['US Virgin Islands', 'VI'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    var regions = states.concat(provinces);

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
}
