## Objective: 

This project is to build an app that provides the current covid data, of  any US name that an end user selects.
The following things are incorporated in this application:
* This website will help the user to search their location and know ahead of time the present covid situation. 
* This covid tracker is provided with a modal input form where the user can input a state of his choice 
* Upon validation, the user is presented with an interactive map, that of the state.
* Pins are dropped on the counties of the state. 
* If the user hovers on it the covid data for the particular county pops up.
* He is also presented with the current covid statistics of the state as on current date.
* The above has been accomplished using the following: 
      *fetch() to https://apidocs.covidactnow.org
      *fetch() to 
* The user is also presented with a URL(obtained from fetch()) which provides the detailed covid data of that state
* The state the user chooses is added to the search history by saving the state name in the local storage as an array to provide persistent data.
* The array has been represented as a Set collection, making sure even if the city is chosen multiple times,its name is saved only once in the array,
  and no duplicate buttons are created.
* The search buttons have been added dynamically using Javascript.
* When the user clicks on a state in the search history he is again presented with current and future conditions for that city.
* The application is responsive and has a clean interface.

## Flow diagram 
## Wireframe
## Pseudocode
## Mockup
## Challenges:
* Initially the project was designed for the user who wish to travel to a destination and wanting to know about the places of interested the covid restrictions 
  in that destinations, we werent able to find a feasible endpoint.
* Getting an interactive map to work and integrating with the individual modules of the project
* Time constraint 

## Future Enhancements
## Built with
## Website
https://deeparkrish.github.io/COVID-Tracker/

## Contribution
Made with ❤️ by


