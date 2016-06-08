// =============================== GLOBAL VARS =========================================//

// API Key for API calls
var apiKey = "9747ce77c6665fbe2c6da02ade8e4c00";
// Current zipcode
var currentZip = null;

// =============================== DOM ELEMENTS =========================================//

// Zip Code Input
var zipInput = document.getElementById("zipInput");
// Current forecast button
var currentForecastButton = document.getElementById("currentForecast");
// Five day forecast button
var fiveDayForecastButton = document.getElementById("fiveDayForecast");
// Output div to display weather
var output = document.getElementById("output");

// =============================== FUNCTIONS =========================================//

// Ensure no more than 5 numbers are entered
function maxLengthCheck() {
  if (zipInput.value.length > zipInput.maxLength) {
    zipInput.value = zipInput.value.slice(0, zipInput.maxLength);
  }
}

function toFahrenheit(temp) {
  return ((temp - 273.15) * 1.8) + 32;
}


function weatherButtonPressed(event) {
  // Get target of weatherButtonPressed click event
  var clickTarget = event.target;

  // Logic to decide which forecast to retrieve
  if (clickTarget.id === "currentForecast") {
    getCityID("currentForecast");
  }
  if (clickTarget.id === "fiveDayForecast") {
    getCityID("fiveDayForecast");
  }

}

function formatWeather(weatherData, buttonPressed) {

  // Current Forecast

  if (buttonPressed === "currentForecast") {

    var currentTemp = Math.round(toFahrenheit(weatherData.main.temp));
    var highTemp = Math.round(toFahrenheit(weatherData.main.temp_max));
    var lowTemp = Math.round(toFahrenheit(weatherData.main.temp_min));
    var cloudPercentage = weatherData.clouds.all;
    var iconToUse = null;
    var visibiltyTag;

    // Icon to use
    if (cloudPercentage >= 0 && cloudPercentage < 33) {
      iconToUse = '<img src="/img/sunny.png">';
      visibiltyTag = "Sunny";
    } else if (cloudPercentage >= 33 && cloudPercentage < 66) {
      iconToUse = '<img src="/img/partlycloudy.png">';
      visibiltyTag = "Partly Cloudy";
    } else {
      iconToUse = '<img src="/img/cloudy.png">';
      visibiltyTag = "Cloudy";
    }
    
    output.innerHTML = `<h3 class="cityName">${weatherData.name}</h3>
                          <h6>${zipInput.value}</h6>
                          <h5 class="currentTemp">Current Temperature - ${currentTemp}&deg;</h5>
                          <h6>Low Today - ${lowTemp}&deg;</h6>
                          <h6>High Today - ${highTemp}&deg;</h6>
                          <div class="imgContainer">
                            ${iconToUse}
                          </div>
                          <h6>${visibiltyTag}</h6>`;

  }


  // 5 Day Forecast
  if (buttonPressed === "fiveDayForecast") {

    // Get cityName to print
    var cityName = weatherData.name;
    // Create array to store dates given back by API call
    var arrayOfDates = [];

    for (var i = 0; i < weatherData.list.length; i++) {
      // Set currentDateTime to manipulate
      var currentDateTime = weatherData.list[i];
      // Format date from UTC epoch
      var currentDate = new Date(currentDateTime.dt * 1000);
      // Array of months to include in date string
      var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      // Set current month equal to correct text month
      var currentMonth = months[currentDate.getMonth()];
      // Set current day equal to current day
      var currentDay = currentDate.getDate();
      // Create formatted string to add to array
      var formattedDate = currentMonth + " " + currentDay;
      // If date is not in array
      if ( arrayOfDates.includes(formattedDate) === false) {
        // Add date to array
        arrayOfDates.push( formattedDate );
      }



    }


    output.innerHTML = `<div class="container">
                          <div class="row">
                            <div class="col-md-15 col-sm-3">
                              ${arrayOfDates[0]}
                            </div>
                            <div class="col-md-15 col-sm-3">
                              ${arrayOfDates[1]}
                            </div>
                            <div class="col-md-15 col-sm-3">
                              ${arrayOfDates[2]}
                            </div>
                            <div class="col-md-15 col-sm-3">
                              ${arrayOfDates[3]}
                            </div>
                            <div class="col-md-15 col-sm-3">
                              ${arrayOfDates[4]}
                            </div>
                          </div>
                        </div>`;
  }

}

function getWeather(cityID, buttonPressed) {

  // Create new XMLHttpRequest
  var xmlhttp = new XMLHttpRequest();
  // Logic to run each time readyState changes
  xmlhttp.onreadystatechange = function() {
    // Ensure that readyState is good and status is good
    if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      // Parse responseText to JSON and store in weatherData
      var weatherData = JSON.parse(xmlhttp.responseText);
      formatWeather(weatherData, buttonPressed);
    }
  };
  // Construct queryString
  if (buttonPressed === "currentForecast") {
    // Query currentForecast
    var queryString = "http://api.openweathermap.org/data/2.5/weather?id=" + cityID + "&APPID=" + apiKey;
  }
  if (buttonPressed === "fiveDayForecast") {
    // Query fiveDayForecast
    var queryString = "http://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&APPID=" + apiKey;
  }

  // Open XMLHttpRequest
  xmlhttp.open('GET', queryString);
  // Send request
  xmlhttp.send();
}


// Get cityID to use for API calls
function getCityID(buttonPressed) {
  // Create new XMLHttpRequest
  var xmlhttp = new XMLHttpRequest();
  // Logic to run each time readyState changes
  xmlhttp.onreadystatechange = function() {
    // Ensure that readyState is good and status is good
    if(xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      // Parse responseText to JSON and store in weatherData
      var queryID = JSON.parse(xmlhttp.responseText);
      // Set cityID from parsed data
      var cityID = queryID.id;
      // Call getWeather
      getWeather(cityID, buttonPressed);
    }
  };

  // Create queryString
  var queryString = "http://api.openweathermap.org/data/2.5/weather?zip=" + zipInput.value + ",us&APPID=" + apiKey;
  // Open XMLHttpRequest
  xmlhttp.open('GET', queryString);
  // Send request
  xmlhttp.send();
}

// =============================== EVENT LISTENERS =========================================//

zipInput.addEventListener("input", maxLengthCheck);
currentForecastButton.addEventListener("click", weatherButtonPressed);
fiveDayForecastButton.addEventListener("click", weatherButtonPressed);