// Create variables for easy grabbing sections in HTML using JQuery
var inputSearch = $(".search");
var searchBtn = $("#searchBtn");
var searchHistory = $("#searchHistory");

var currentCity = $(".currentCity");
var currentDate = $(".currentDate");
var currentTemp = $(".currentTemp");
var currentHumidity = $(".currentHumidity");
var currentWind = $(".currentWind");
var currentIcon = $(".mainWeatherIcon");

var futureDate = $(".card");

// Create a variable for the API key
var apiKey = "e5d2070e2cf8c17bde06a4eba2c18e7f";

// Fetching the weather data from the API
function getWeather() {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + inputSearch.val() + "&appid=" + apiKey;
  
    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);

        // Display current date's weather conditions for selected city
        // Set display: none areas to show with display: block
        $(".cityTitle").attr("style", "display: block");
        $(".weatherDivider").attr("style", "display: block");
        currentCity.text(data.city.name + " (" + data.city.country + ")");
        currentDate.text(dayjs().format("M/D/YY"));
        currentTemp.text(data.list[0].main.temp + "°");
        currentHumidity.text("Humidity: " + data.list[0].main.humidity + "%");
        currentWind.text("Wind Speed: " + data.list[0].wind.speed + " MPH");
        // Empties the current icon upon new search instead of adding new ones to an existing icon
        currentIcon.empty();
        currentIcon.append("<img src='https://openweathermap.org/img/wn/" + data.list[0].weather[0].icon + "@2x.png'/>");
      })
}

searchBtn.on('click', getWeather);