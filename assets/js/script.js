// Create variables for easy grabbing sections in HTML using JQuery
var inputSearch = $(".search");
var searchBtn = $("#searchBtn");
var searchHistory = $(".pastCities");

var currentCity = $(".currentCity");
var currentDate = $(".currentDate");
var currentTemp = $(".currentTemp");
var currentHumidity = $(".currentHumidity");
var currentWind = $(".currentWind");
var currentIcon = $(".mainWeatherIcon");

// Create a variable for the API key
var apiKey = "e5d2070e2cf8c17bde06a4eba2c18e7f";

// Empty array for storing searched cities
var searchedCities = [];

// Convert first letter from user input to uppercase
function capitalizeWords() {
    var str = inputSearch.val();
    // Split the string into an array of words
    var words = str.split(" ");

    for (var i = 0; i < words.length; i++) {
        var word = words[i];
        // Capitalize the first letter of each word
        var capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
        words[i] = capitalizedWord;
    }

    return words.join(" ");
}

// Loads saved searches from local storage if it has anything
function loadSavedSearches() {
    // Checks if anything exists within local storage
    // If there are contents, run this code
    if (localStorage.getItem("cities")) {
        var searchedCities = JSON.parse(localStorage.getItem("cities"));
        for (var i = 0; i < searchedCities.length; i++) {
            var button = $("<button>").addClass("searchHistory").text(searchedCities[i]);
            searchHistory.append(button);
    
            button.on("click", function() {
                var currentLocation = $(this).text();
                getCurrentWeather(currentLocation);
                getFiveDayForecast(currentLocation);
            });
        }
    }
}

// Fetching the weather data from the current weather API
function getCurrentWeather(currentLocation) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?units=imperial&q=" + currentLocation + "&appid=" + apiKey;

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
        currentCity.text(data.name + " (" + data.sys.country + ")");
        currentDate.text(dayjs().format("M/D/YY"));
        currentTemp.text(data.main.temp + "°");
        currentHumidity.text("Humidity: " + data.main.humidity + "%");
        currentWind.text("Wind Speed: " + data.wind.speed + " MPH");
        // Empties the current icon upon new search instead of adding new ones to an existing icon
        currentIcon.empty();
        currentIcon.append("<img src='https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png'/>");

        // Empties input field once city has been searched
        inputSearch.val("");
    })
}

// Fetches the 5-day forecast from the API
function getFiveDayForecast(currentLocation) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + currentLocation + "&appid=" + apiKey;
        
    fetch(requestUrl)
        .then(function (response) {
        return response.json();
        })
        .then(function (data) {
        console.log(data);    
    
        // Empty array to store the 5-day forecast dates
        var fiveDayForecast = [];

        // For loop to go through 5-days and store that data in an empty array
        for (var i = 0; i < 5; i++) {
            var futureDate = dayjs(data.list[7 + (i * 8)].dt_txt).format("M/D/YY");
            fiveDayForecast.push(futureDate);
        }
        // For loop for adding the 5-days forecast information
        for (var i = 0; i < fiveDayForecast.length; i++) {
            // Set 5-day forecast area to display once city is searched
            $(".fiveDayTitle").attr("style", "display: block");
            $(".card").attr("style", "display: block");

            // Add weather information to each card area for each future date
            $(".date").eq(i).text(dayjs(data.list[7 + (i * 8)].dt_txt).format("M/D/YY"));
            $(".temp").eq(i).text(data.list[7 + (i * 8)].main.temp + "°");
            $(".humidity").eq(i).text("Humidity: " + data.list[7 + (i * 8)].main.humidity + "%");
            $(".wind").eq(i).text("Wind Speed: " + data.list[7 + (i * 8)].wind.speed + " MPH");
            // Empties the current icon upon new search instead of adding new ones to an existing icon
            $(".weatherIcon").eq(i).empty();
            $(".weatherIcon").eq(i).append("<img src='https://openweathermap.org/img/wn/" + data.list[7 + (i * 8)].weather[0].icon + ".png'/>");
        }
        })
}

// Create function for storing past cities under the search area
function cityHistory() {
    // Checks if there is already anything in local storage or keeps the array blank
    // So it doesn't replace the local storage upon new page refresh
    var searchedCities = JSON.parse(localStorage.getItem("cities")) || [];
    var searchedCity = capitalizeWords(inputSearch.val());
    // Checks if searched city already exists in the search area and adds it if it doesn't
    if (!searchedCities.includes(searchedCity)) {
        searchedCities.push(searchedCity);
        // Add searched city to local storage in array
        localStorage.setItem("cities", JSON.stringify(searchedCities));
        // Adds city to search history area as a button
        var button = $("<button>").addClass("searchHistory").text(searchedCity);
        searchHistory.append(button);

        button.on("click", function() {
            var currentLocation = $(this).text();
            getCurrentWeather(currentLocation);
            getFiveDayForecast(currentLocation);
        })
    }
};

// Loads search history upon page arrival if there are any
loadSavedSearches();

// Once the search button is clicked, the following functions are activated
searchBtn.on('click', function() {
    var searchedCity = capitalizeWords(inputSearch.val());
    // Calls the getCurrentWeather function first
    getCurrentWeather(searchedCity);
    // Calls the 5-day forecast function
    getFiveDayForecast(searchedCity);
    // Calls the past cities searched function
    cityHistory();
});