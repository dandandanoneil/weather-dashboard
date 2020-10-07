let storedCities = JSON.parse(localStorage.getItem('cities'));
if(!storedCities) { 
    storedCities = [];
    localStorage.setItem('cities', JSON.stringify(storedCities));
}

// Render buttons for all the previously searched cities on page load and add dates to the five day forecast cards
renderPage();

function showWeather(city) {
    let queryURL = "https://cors-anywhere.herokuapp.com/" + "api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=8feefe66bd34849fd79212829a1c0538";

    // Display a "Loading" message so they don't get impatient 
    $("#city-date-icon").text("Loading weather data...");
    console.log(queryURL);
    // Clear previous city's weather data from html
    $("#temperature").text("Temperature: ");
    $("#humidity").text("Humidity: ");
    $("#wind-speed").text("Wind Speed: ");
    $("#humidity").text("Humidity: ");
    for (let i = 1; i < 6; i++) {
        $("#icon-" + i).html("<img src='' alt=''>");
        $("#temp-" + i).text("Temp: ");
        $("#humidity-" + i).text("Humidity: ");
    }


    // Send a request to the forecast weather API and display the results
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        // Log the returned object
        console.log(response);
        // Add right now's data to the "Today" card html
        $("#city-date-icon").html(
            response.city.name + 
            " (" + formatDate(response.list[0].dt_txt) + ") " + 
            "<img src='http://openweathermap.org/img/w/" + response.list[0].weather[0].icon + ".png' alt='Weather icon'>");
        $("#temperature").text("Temperature: " + response.list[0].main.temp + "°F");
        $("#humidity").text("Humidity: " + response.list[0].main.humidity + "%");
        $("#wind-speed").text("Wind Speed: " + response.list[0].wind.speed + "%");
        $("#humidity").text("Humidity: " + response.list[0].main.humidity + "%");
        // Add the data to the "Five-Day Forecast" card html by jumping ahead 8 3-hour forecast blocks (so each day is showing the forecast for 24 hours from now, or 48, or 72, etc.)
        for (let i = 1; i < 6; i++) {
            $("#date-" + i).text(formatDate(response.list[i*8-1].dt_txt));
            $("#icon-" + i).html("<img src='http://openweathermap.org/img/w/" + response.list[i*8-1].weather[0].icon + ".png' alt='Weather icon'>");
            $("#temp-" + i).text("Temp: " + response.list[i*8-1].main.temp + "°F");
            $("#humidity-" + i).text("Humidity: " + response.list[i*8-1].main.humidity + "%");
        }
    });

    // Takes a date from the weather API in the format "2020-10-07 18:00:00" and returns "(10/07/2020)"
    function formatDate(date) {
        return date.substr(5, 2) + "/" + date.substr(8, 2) + "/" + date.substr(0, 4);
    }

}

function renderPage() {
    // Render buttons
    storedCities = JSON.parse(localStorage.getItem('cities'));
    for (let j = 0; j < storedCities.length; j++) {
        let newButton = $("<button type='button' class='btn btn-info btn-block ml-2 cityButton'></button>");
        newButton.text(storedCities[j]);
        newButton.attr("data-city", storedCities[j])
        $("#city-buttons").prepend(newButton);
    }
    // Add dates to five-day forecast cards
    for (let i = 1; i < 6; i++) {
        $("#date-" + i).text(moment().add(1, 'day').format("MM/DD/YYYY"));
    }    
}

// Click one of the existing city buttons
$("#city-buttons").on("click", ".cityButton", function () {
    let newCity = $(this).attr("data-city");
    console.log(newCity);
    showWeather(newCity);
});

// Search for a city using the search input
$("#search-submit").on("click", function () {
    let newCity = $("#city-search").val();
    console.log(newCity);
    showWeather(newCity);
    if(storedCities.indexOf(newCity) === -1) {
        // Add the city to the array of cities in localStorage
        storedCities.push(newCity);
        localStorage.setItem('cities', JSON.stringify(storedCities));
        // Build and prepend a new button for the new city
        let newButton = $("<button type='button' class='btn btn-info btn-block ml-2 cityButton'></button>");
        newButton.text(newCity);
        newButton.attr("data-city", newCity)
        $("#city-buttons").prepend(newButton);
    }
});