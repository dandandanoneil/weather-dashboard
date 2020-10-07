let storedCities = localStorage.getItem('cities');
if(!storedCities) { storedCities = ["Philadelphia"]; }

//  Show weather data for the last city stored on page load
showWeather(storedCities[storedCities.length - 1]);

// Render buttons for all the previously searched cities on page load
renderButtons();

function showWeather(city) {
    let queryURL = "https://cors-anywhere.herokuapp.com/" + "api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&appid=8feefe66bd34849fd79212829a1c0538";

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

function renderButtons() {

}