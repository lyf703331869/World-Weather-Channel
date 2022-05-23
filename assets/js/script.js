//
var searchBtn = document.getElementById("searchBtn");
var today = moment().format("l");
function searchWeather() {
  var search = document.getElementById("search-input");

  var weatherUrl =
    `https://api.openweathermap.org/data/2.5/weather?q=` +
    search.value +
    `&appid=c3b1abc2a30e4e460e0d8b9597a2488b&units=imperial`;

  $("#fiveDays").text("");

  fetch(weatherUrl).then(function (response) {
    if (response.ok) {
      $("#historyBtn").append(
        `<a
            class="btn btn-dark my-2 w-100"
            id="searchResult"
            style="position: relative; vertical-align: top"
          >
            ${search.value}
          </a>`
      );
      return response.json().then(function (data) {
        $("#city").text(search.value + " (" + today + ")");
        var temperature = data.main.temp.toFixed(2) + " F";
        var wind = data.wind.speed.toFixed(2) + " MPH";
        var humidity = data.main.humidity + "%";
        var icon = data.weather[0].icon;
        var iconLink = `https://openweathermap.org/img/wn/${icon}.png`;
        $("#icon").attr("src", `${iconLink}`);
        var lat = data.coord.lat;
        var lon = data.coord.lon;
        var uviUrl =
          "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lat +
          "&lon=" +
          lon +
          "&exclude=minutely,hourly&units=imperial&appid=c3b1abc2a30e4e460e0d8b9597a2488b";

        fetch(uviUrl)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            var uvIndex = data.current.uvi;
            if (uvIndex < 4) {
              $("#uvi").attr("style", "background-color: lightgreen");
            } else if (uvIndex < 8) {
              $("#uvi").attr("style", "background-color: yellow");
            } else {
              $("#uvi").attr("style", "background-color: lightred");
            }
            $("#temp").text("Temp: " + temperature);
            $("#wind").text("Wind: " + wind);
            $("#humidity").text("Humidity: " + humidity);
            $("#uvindex").text("UV Index: ");
            $("#uvi").text(uvIndex);

            $("h3").text("5-Day Forecast");
            currentWeatherInfo = {
              temp: "Temp: " + temperature,
              wind: "Wind: " + wind,
              humidity: "Humidity: " + humidity,
              unindex: "UV Index: " + uvIndex,
            };
            localStorage.setItem(
              search.value,
              JSON.stringify(currentWeatherInfo)
            );
            search.value = "";

            for (var i = 0; i < 5; i++) {
              var forecasticon = data.daily[i].weather[0].icon;
              $("#fiveDays").append(
                "<div class='text-light p-2' id='forecast-card'>" +
                  "<p>" +
                  moment()
                    .add(i + 1, "days")
                    .format("l") +
                  "</p>" +
                  `<img src="https://openweathermap.org/img/wn/${forecasticon}.png">` +
                  "<p>" +
                  "Temperature: " +
                  data.daily[i].temp.day +
                  " F" +
                  "</p>" +
                  "<p>" +
                  "Wind: " +
                  data.daily[i].wind_speed +
                  " MPH" +
                  "</p>" +
                  "<p>" +
                  "Humidity: " +
                  data.daily[i].humidity +
                  "%" +
                  "</p>" +
                  "</div>"
              );
            }
          });
      });
    } else {
      alert("Error: " + search.value + " Is " + response.statusText);
    }
  });
}

searchBtn.addEventListener("click", searchWeather);
