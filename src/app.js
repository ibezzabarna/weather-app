let apiKey = "7088414aa37808a4d53d7a27451c98c2";
let temperatureCelsius = 24;

function formatDate(dateObj) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = dateObj.getDay();
  let hour = dateObj.getHours();
  let minute = dateObj.getMinutes();

  if (minute < 10) {
    minute = "0" + minute;
  }

  return `${days[day]} ${hour}:${minute}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay(); 
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  return days[day];
}

function showCurrentWeather(description, degrees, humidity, wind, iconId) {
  document.querySelector("#description").innerHTML = description;
  document.querySelector("#degrees").innerHTML = Math.round(degrees);
  temperatureCelsius = Math.round(degrees);
  document.querySelector("#humidity").innerHTML = humidity;
  document.querySelector("#wind").innerHTML = Math.round(wind);
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src",`http://openweathermap.org/img/wn/${iconId}@2x.png`);
  iconElement.setAttribute("alt", description)
}

function showForecast(daysForecast) {
  let element = document.querySelector("#forecast")

  let forecastMarkup = "";

  daysForecast.forEach(function(dayForecast) { 
    let day = formatDay(dayForecast.dt);
    let iconId = dayForecast.weather[0].icon;
    let description = dayForecast.weather[0].description;
    let tempMax = Math.round(dayForecast.temp.max);
    let tempMin = Math.round(dayForecast.temp.min);
    
    forecastMarkup = forecastMarkup + '<li class="col-2">' + day +
      `<img src="http://openweathermap.org/img/wn/${iconId}@2x.png" class="weather-icon" alt="${description}">` +
      `<span class="temp-max">${tempMax}°</span> <span class="temp-min">${tempMin}°</span>` +
      '</li>';
  })

  element.innerHTML = forecastMarkup;
}

function showTime() {
  document.querySelector("#last-update").innerHTML = formatDate(new Date());
}

function updateWeatherPage(response) {
  showTime() 

  let today = response.data.current;
  //show current weather
  showCurrentWeather( 
    today.weather[0].description, 
    today.temp,
    today.humidity, 
    today.wind_speed, 
    today.weather[0].icon
  )
 
  //show forecast 
  showForecast(response.data.daily.slice(1, 7))
}
    
function convertToFahrenheit(celsius) {
  let temperatureFahrenheit = celsius * 9 / 5 + 32;
  return Math.round(temperatureFahrenheit);
}

function displayTemperatureCelsius(event) {
  event.preventDefault();
  event.target.classList.add("active");
  fahrenheitLink.classList.remove("active");
  document.querySelector("#degrees").innerHTML = temperatureCelsius;
}

function displayTemperatureFahrenheit(event) {
  event.preventDefault();
  event.target.classList.add("active");
  celsiusLink.classList.remove("active");
  let temperatureFahrenheit = convertToFahrenheit(temperatureCelsius);
  document.querySelector("#degrees").innerHTML = temperatureFahrenheit;
}

function getWeatherForecast(response) {
  //update weather
  let latitude = response.data.coord.lat;
  let longitude = response.data.coord.lon;
  
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&exclude=hourly`;
  
  axios.get(url).then(updateWeatherPage);
}

function formSubmit(event) {
  event.preventDefault();

  updateWeatherReport()
}

function updateWeatherReport() {
  let cityInput = document.querySelector("#city-input");
  let cityName = cityInput.value;
  document.querySelector("#city-name").innerHTML = cityName;
  cityInput.value = ""
  
  let coordsUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

  axios.get(coordsUrl).then(getWeatherForecast)
}

updateWeatherReport();

let form = document.querySelector("#search");
form.addEventListener("submit", formSubmit);

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayTemperatureFahrenheit);

let celsiusLink= document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayTemperatureCelsius);
