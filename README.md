## COVID-Tracker

## Objective 
This project is to build an app that provides the current covid data, of  any US State that an end user selects.


The following things are incorporated in this application:

* The covid tracker is provided with an input form where the user can input a state of his/her choice.
* Upon validation of the state name, the user is presented with an interactive map of the state.
* Pins are dropped on the counties of the state. 
* If the user hovers/clicks on it the covid data for the particular county pops up.
* He is also presented with the current covid statistics of the state as on current date.
* The above has been accomplished using the following: 
     * fetch() to https://apidocs.covidactnow.org
     * fetch() to https://www.openstreetmap.org/ and www.trackcorona.live
* The user is also presented with an URL(obtained from fetch()) which provides the detailed covid data of that state
* The state the user chooses is added to the search history, by saving the state name in the local storage in an array to provide persistent data.
* The array has been represented as a Set collection, making sure even if the state is chosen multiple times,its name is saved only once in the array,
  and no duplicate buttons are created.
* The search  history buttons have been added dynamically using Javascript.
* When the user clicks on a state in the search history,he/she is presented with the current COVID statistics for that state.
* The application is responsive and has a clean interface.
*  An open-source JavaScript library, https://leafletjs.com/  has been used to create the interactive map.


## Flow diagram 
![Webpage](https://github.com/Deeparkrish/COVID-Tracker/blob/main/assets/img/flowchart.jpg)
## Wireframe
![WireFrame](https://github.com/Deeparkrish/COVID-Tracker/blob/main/assets/img/wireframe.png)
## Pseudocode
![Webpage](https://github.com/Deeparkrish/COVID-Tracker/blob/main/assets/img/img2.jpg)
![Webpage](https://github.com/Deeparkrish/COVID-Tracker/blob/main/assets/img/img1.jpg)
![Webpage](https://github.com/Deeparkrish/COVID-Tracker/blob/main/assets/img/mapping.jpg)

## Mockup
![Webpage](https://github.com/Deeparkrish/COVID-Tracker/blob/main/assets/img/mockup2.png)
## Challenges:
* Initially,the project was intented to provide,the tourism information of a state of user's choice, along with the current COVID conditions 
  in that destination. A free travel API endpoint that would satify our requirment was something that was not feasible.
* Getting an interactive map to work and integrating it with the individual modules of the project required us to add additional mapping functions.


## Future Enhancements
*   The current data in  textual format could be converted into a graphical representation.
*   The site would include the main points of interests of the chosen state that are open for public.
*   The site would also provide latest news data of the state.
*   More data to be displayed on the map’s pop ups.

## Data Endpoints 
 *  https://apidocs.covidactnow.org
 
 *  https://www.openstreetmap.org/ 
 
 *  https://www.trackcorona.live

## Built with
* HTML
* Javascript
* Server-side APIs
* https://leafletjs.com/ -An open-source JavaScript library 
* Styling - Bulma
## Project presentation slides 
https://docs.google.com/presentation/d/1oOb_olRWNmSIkgogbAvOWQYOuiJgInANzLCWE0ImRjY/edit#slide=id.ge0bc768e7c_2_69

## Website 
https://sindhu-sp.github.io/COVID-Tracker/

## Contribution
Made with ❤️ by  Deepa Krishnan, Dyravuth Yorn, Sindhu Pillai, Timothy Sepulvada


## Portfolio
* This project has been linked to our portfolio. 
https://deeparkrish.github.io/MyPortfolio/
