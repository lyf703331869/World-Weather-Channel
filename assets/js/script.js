var weatherUrl =
  "https://api.openweathermap.org/data/2.5/weather?q=London&appid=c3b1abc2a30e4e460e0d8b9597a2488b&units=imperial";

fetch(weatherUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
    var temperature = data.main.temp.toFixed(2) + "F";
    var wind = data.wind.speed.toFixed(2) + "mph";
    var humidity = data.main.humidity + "%";
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    await uvIndex(lat, lon);
    var icon = data.weather[0].icon;
    var iconPage = `https://openweathermap.org/img/wn/${icon}.png`;
    var iconPic = `<img src="${iconPage}"/>`;
  });
