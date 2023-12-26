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

        // Convert first letter from user input to uppercase
        var convertUpper = inputSearch.val().charAt(0).toUpperCase();
        var cities = convertUpper + inputSearch.val().slice(1);
        // Store searched cities to local storage
        localStorage.setItem(cities, JSON.stringify(data));

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

        // Empties input field once city has been searched
        inputSearch.val("");

        // Empty array to store the 5-day forecast dates
        var fiveDayForecast = [];

        // For loop to go through 5-days and store that data in an empty array
        for (var i = 0; i < 5; i++) {
            var futureDate = dayjs(data.list[1 + (i * 8)].dt_txt).format("M/D/YY");
            fiveDayForecast.push(futureDate);
        }
        // For loop for adding the 5-days forecast information
        for (var i = 0; i < fiveDayForecast.length; i++) {
            // Set 5-day forecast area to display once city is searched
            $(".fiveDayTitle").attr("style", "display: block");
            $(".card").attr("style", "display: block");

            // Add weather information to each card area for each future date
            $(".date").eq(i).text(dayjs(data.list[1 + (i * 8)].dt_txt).format("M/D/YY"));
            $(".temp").eq(i).text(data.list[1 + (i * 8)].main.temp + "°");
            $(".humidity").eq(i).text("Humidity: " + data.list[1 + (i * 8)].main.humidity + "%");
            $(".wind").eq(i).text("Wind Speed: " + data.list[1 + (i * 8)].wind.speed + " MPH");
            // Empties the current icon upon new search instead of adding new ones to an existing icon
            $(".weatherIcon").eq(i).empty();
            $(".weatherIcon").eq(i).append("<img src='https://openweathermap.org/img/wn/" + data.list[1 + (i * 8)].weather[0].icon + ".png'/>");
        }
      })
}

// Create function for storing past cities under the search area
function cityHistory() {
    // Convert first letter from user input to uppercase
    var convertUpper = inputSearch.val().charAt(0).toUpperCase();
    var cities = convertUpper + inputSearch.val().slice(1);

    searchHistory.attr("style", "display: block");
    searchHistory.text(cities);
}

searchBtn.on('click', function() {
    // Calls the getWeather function first
    getWeather();
    // Calls the past cities searched function
    cityHistory();
});