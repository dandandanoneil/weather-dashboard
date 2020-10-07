let storedCities = JSON.parse(localStorage.getItem('cities'));
if(!storedCities) { 
    storedCities = [];
    localStorage.setItem('cities', JSON.stringify(storedCities));
}

// Render buttons for all the previously searched cities on page load and add dates to the five day forecast cards
renderPage();

function showWeather(city) {
    let todayURL = "https://cors-anywhere.herokuapp.com/" + "api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=8feefe66bd34849fd79212829a1c0538";
    console.log("Today's Weather URL: ", todayURL);

    // Display a "Loading" message so they don't get impatient 
    $("#city-date-icon").text("Loading weather data...");
    // Clear previous city's weather data from html
    $("#temperature").text("Temperature: ");
    $("#humidity").text("Humidity: ");
    $("#wind-speed").text("Wind Speed: ");
    $("#humidity").text("Humidity: ");    
    for (let i = 1; i < 6; i++) {
        $("#icon-" + i).html("<img src='' alt=''>");
        $("#high-" + i).text("High: ");
        $("#low-" + i).text("Low: ");
        $("#humidity-" + i).text("Humidity: ");
    }


    // Send a request to the forecast weather API and display the results
    $.ajax({
        url: todayURL,
        method: "GET"
    }).then(function(weather) {
        // Log the returned object
        console.log("Weather:", weather);
        // Add the data to the "Today" card html
        $("#city-date-icon").html(
            weather.name + 
            " (" + moment(weather.dt * 1000).format("MM/DD/YYYY") + ") " + 
            "<img src='http://openweathermap.org/img/w/" + weather.weather[0].icon + ".png' alt='Weather icon'>");
        $("#temperature").text("Temperature: " + weather.main.temp + "°F");
        $("#humidity").text("Humidity: " + weather.main.humidity + "%");
        $("#wind-speed").text("Wind Speed: " + weather.wind.speed + " mph");
        $("#humidity").text("Humidity: " + weather.main.humidity + "%");
        
        // Using the latitude and longitude from the 'weather' object, create a request for the daily forecast (which includes today's UV Index) & display the result
        let lat = weather.coord.lat;
        let lon = weather.coord.lon;
        let forecastURL = "https://cors-anywhere.herokuapp.com/" + "api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly&units=imperial&appid=8feefe66bd34849fd79212829a1c0538";
        console.log("Five-Day Forecast URL: ", forecastURL);

        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function(forecast) {
            // Log the returned object
            console.log("Forecast:", forecast);

            // Add the data to the "Today" card html
            $("#uv-index").text("UV Index: " + forecast.daily[0].uvi);
            
            // Add the data to the "Five-Day Forecast" card html
            for (let i = 1; i < 6; i++) {
                $("#date-" + i).text(moment(forecast.daily[i].dt * 1000).format("MM/DD/YYYY"));
                $("#icon-" + i).html("<img src='http://openweathermap.org/img/w/" + forecast.daily[i].weather[0].icon + ".png' alt='Weather icon'>");
                $("#high-" + i).text("High: " + forecast.daily[i].temp.max + "°F");
                $("#low-" + i).text("Low: " + forecast.daily[i].temp.min + "°F");
                $("#humidity-" + i).text("Humidity: " + forecast.daily[i].humidity + "%");
            }
        });
        
    });
}

function renderPage() {
    // Render buttons
    storedCities = JSON.parse(localStorage.getItem('cities'));
    for (let j = 0; j < storedCities.length; j++) {
        let newButton = $("<button type='button' class='btn btn-warning btn-block m-2 cityButton'></button>");
        newButton.text(storedCities[j]);
        newButton.attr("data-city", storedCities[j])
        $("#city-buttons").prepend(newButton);
    }
    // Add dates to five-day forecast cards
    for (let i = 1; i < 6; i++) {
        $("#date-" + i).text(moment().add(i, 'day').format("MM/DD/YYYY"));
    }    
}

// Click one of the existing city buttons
$("#city-buttons").on("click", ".cityButton", function () {
    let newCity = $(this).attr("data-city");
    console.log("Loading weather for", newCity);
    showWeather(newCity);
});

// Search for a city using the search input
$("#search-submit").on("click", function () {
    let newCity = $("#city-search").val();
    console.log("Loading weather for", newCity);
    showWeather(newCity);
    if(storedCities.indexOf(newCity) === -1) {
        // Add the city to the array of cities in localStorage
        storedCities.push(newCity);
        localStorage.setItem('cities', JSON.stringify(storedCities));
        // Build and prepend a new button for the new city
        let newButton = $("<button type='button' class='btn btn-warning btn-block ml-2 cityButton'></button>");
        newButton.text(newCity);
        newButton.attr("data-city", newCity)
        $("#city-buttons").prepend(newButton);
    }
});