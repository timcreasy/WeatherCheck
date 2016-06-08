// =============================== GLOBAL VARS =========================================//

// Current zipcode
var currentZip = null;

// =============================== DOM ELEMENTS =========================================//

// Zip Code Input
var zipInput = document.getElementById("zipInput");
// Current forecast button
var currentForecastButton = document.getElementById("currentForecast");
// Three day forecast button
var threeDayForecastButton = document.getElementById("threeDayForecast");
// Output div to display weather
var output = document.getElementById("output");

// =============================== FUNCTIONS =========================================//

// Ensure no more than 5 numbers are entered
function maxLengthCheck() {
  if (zipInput.value.length > zipInput.maxLength) {
    zipInput.value = zipInput.value.slice(0, zipInput.maxLength);
  }
}

function weatherButtonPressed(event) {
  // Get target of weatherButtonPressed click event
  var clickTarget = event.target;

  // Logic to decide which forecast to retrieve
  if (clickTarget.id === "currentForecast") {
    getWeather("currentForecast");
  }
  if (clickTarget.id === "threeDayForecast") {
    getWeather("threeDayForecast");
  }

}

function formatWeather(weatherData, buttonPressed) {

  // Current Forecast

  if (buttonPressed === "currentForecast") {
    console.log(weatherData.current_observation);

    let cityName = weatherData.current_observation.display_location.full;
    let currentTemp = weatherData.current_observation.temp_f;
    let iconToUse = `<img src="${weatherData.current_observation.icon_url}">`;
    let weatherDesc = weatherData.current_observation.weather;
    
    output.innerHTML = `<h3 class="cityName">${cityName}</h3>
                          <h6>${zipInput.value}</h6>
                          <h5 class="currentTemp">Current Temperature - ${currentTemp}&deg;</h5>
                          <div class="imgContainer">
                            ${iconToUse}
                          </div>
                          <h6>${weatherDesc}</h6>`;

  }


  // 3 Day Forecast
  if (buttonPressed === "threeDayForecast") {

    //let cityName = weatherData.current_observation.display_location.full;
    // Clear old html
    output.innerHTML = "";

    // Loop through each day of three
    for (var i = 1; i <= 3; i++) {
      // Get current information for day of forecast
      // Forecast date (ex. June 3, 2016)
      var curWeekDay = weatherData.forecast.simpleforecast.forecastday[i - 1].date.weekday;
      var curMonth = weatherData.forecast.simpleforecast.forecastday[i - 1].date.monthname;
      var curDay = weatherData.forecast.simpleforecast.forecastday[i -1].date.day;
      var curYear = weatherData.forecast.simpleforecast.forecastday[i - 1].date.year;
      var currentForecastDateString = `${curMonth} ${curDay}, ${curYear}`;

      // Current forecast info
      var curForecastTempHigh = weatherData.forecast.simpleforecast.forecastday[i - 1].high.fahrenheit;
      var curForecastTempLow = weatherData.forecast.simpleforecast.forecastday[i - 1].low.fahrenheit;
      var curForecastConditions = weatherData.forecast.simpleforecast.forecastday[i - 1].conditions;
      var curForecastIcon = `<img src="${weatherData.forecast.simpleforecast.forecastday[i - 1].icon_url}">`;

      // Output forecast to DOM
      output.innerHTML += `<h3 class="weekday">${curWeekDay}</h3>
                            <h6>${currentForecastDateString}</h6>
                            <h5 class="tempHigh">Temperature High - ${curForecastTempHigh}&deg;</h5>
                            <h5 class="tempLow">Temperature Low - ${curForecastTempLow}&deg;</h5>
                            <div class="imgContainer">
                              ${curForecastIcon}
                            </div>
                            <h6>${curForecastConditions}</h6>`;

    }

  }

}

function getWeather(buttonPressed) {

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
    var queryString = "http://api.wunderground.com/api/1f1ad958b455d824/conditions/q/" + zipInput.value + ".json";
    console.log(queryString);
  }
  if (buttonPressed === "threeDayForecast") {
    // Query threeDayForecast
    var queryString = "http://api.wunderground.com/api/1f1ad958b455d824/forecast/q/" + zipInput.value + ".json";
  }

  // Open XMLHttpRequest
  xmlhttp.open('GET', queryString);
  // Send request
  xmlhttp.send();
}

// =============================== EVENT LISTENERS =========================================//

zipInput.addEventListener("input", maxLengthCheck);
currentForecastButton.addEventListener("click", weatherButtonPressed);
threeDayForecastButton.addEventListener("click", weatherButtonPressed);