var searchBtn = document.getElementById("searchBtn");
var historyCard = document.getElementById("historyCard");
var today = moment().format("l");

let storedWeather = JSON.parse(localStorage.getItem("weather")) || [];

console.log("local storage city info", storedWeather);

//function to layout the history buttons base on local storage

function searchWeather() {
  // if the history inclues search, alert and return
  var search = document.getElementById("search-input");
  for (var i = 0; i < storedWeather.length; i++) {
    if (storedWeather[i].cityName === search.value) {
      alert(
        "City has been searched already. Clearing history or search other cities."
      );
      return;
    }
  }
  var weatherUrl =
    `https://api.openweathermap.org/data/2.5/weather?q=` +
    search.value +
    `&appid=c3b1abc2a30e4e460e0d8b9597a2488b&units=imperial`;

  $("#fiveDays").text("");

  fetch(weatherUrl).then(function (response) {
    if (response.ok) {
      $("#historyCard").append(
        `<a
            class="btn btn-dark my-2 w-100 searchResult"
            style="position: relative; vertical-align: top"
          >
            ${search.value}
          </a>`
      );
      $(".searchResult").on("click", historyWeather);
      return response.json().then(function (data) {
        var cityName = search.value;
        $("#city").text(cityName + " (" + today + ")");
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
            readHistory(temperature, wind, humidity, uvIndex, icon, cityName);
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

function readHistory(temperature, wind, humidity, uvIndex, icon, cityName) {
  var cityWeatherObject = {
    temperature: {},
    wind: {},
    humidity: {},
    uvIndex: {},
    icon: {},
    cityName: "",
  };

  cityWeatherObject.temperature = temperature;
  cityWeatherObject.wind = wind;
  cityWeatherObject.humidity = humidity;
  cityWeatherObject.uvIndex = uvIndex;
  cityWeatherObject.icon = icon;
  cityWeatherObject.cityName = cityName;

  storedWeather.push(cityWeatherObject);

  localStorage.setItem("weather", JSON.stringify(storedWeather));
}

function historyWeather(event) {
  event.stopImmediatePropagation();
  $("#fiveDays").text("");
  var citySeleted = event.target.text.trim();
  for (var i = 0; i < storedWeather.length; i++) {
    if (storedWeather[i].cityName === citySeleted) {
      $("#temp").text("Temp: " + storedWeather[i].temperature);
      $("#wind").text("Wind: " + storedWeather[i].wind);
      $("#humidity").text("Humidity: " + storedWeather[i].humidity);
      $("#uvindex").text("UV Index: ");
      $("#uvi").text(storedWeather[i].uvIndex);
      var icon = storedWeather[i].icon;
      var iconLink = `https://openweathermap.org/img/wn/${icon}.png`;
      $("#icon").attr("src", `${iconLink}`);
      if (storedWeather[i].uvIndex < 4) {
        $("#uvi").attr("style", "background-color: lightgreen");
      } else if (storedWeather[i].uvIndex < 8) {
        $("#uvi").attr("style", "background-color: yellow");
      } else {
        $("#uvi").attr("style", "background-color: lightred");
      }
    }
  }
}

searchBtn.addEventListener("click", searchWeather);
