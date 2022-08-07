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

let date = document.querySelector("#last-update");
date.innerHTML = formatDate(new Date()); 

function showWeather(response) {
  document.querySelector("#description").innerHTML = response.data.weather[0].description;
  document.querySelector("#degrees").innerHTML = Math.round(response.data.main.temp);
  temperatureCelsius = Math.round(response.data.main.temp);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);
  document.querySelector("#last-update").innerHTML = formatDate(new Date());
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`);
  iconElement.setAttribute("alt", response.data.weather[0].description)
}

function convertToFahrenheit(celsius) {
  let temperatureFahrenheit = celsius * 9 / 5 + 32;
  return Math.round(temperatureFahrenheit);
}
let temperatureCelsius = 24

function displayTemperatureCelsius(event) {
  event.preventDefault();
  event.target.classList.add("active");
  fahrenheitLink.classList.remove("active");
  document.querySelector("#degrees").innerHTML = temperatureCelsius;
}
let celsiusLink= document.querySelector("#celsius");
celsiusLink.addEventListener("click", displayTemperatureCelsius);

function displayTemperatureFahrenheit(event) {
  event.preventDefault();
  event.target.classList.add("active");
  celsiusLink.classList.remove("active");
  let temperatureFahrenheit = convertToFahrenheit(temperatureCelsius);
  document.querySelector("#degrees").innerHTML = temperatureFahrenheit;
}
let fahrenheitLink= document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", displayTemperatureFahrenheit);

function updateWeatherReport(event) {
  event.preventDefault();

  //update city name
  let cityInput = document.querySelector("#city-input");
  let cityName = cityInput.value;
  document.querySelector("#city-name").innerHTML = cityName;

  //update weather
  let apiKey = "7088414aa37808a4d53d7a27451c98c2";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
  axios.get(url).then(showWeather);
}

let form = document.querySelector("#search");
form.addEventListener("submit", updateWeatherReport);
