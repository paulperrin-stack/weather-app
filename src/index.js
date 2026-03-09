import "./style.css";

const API_KEY = "3QG4S4CSRPW4ZWHZLAMQU3BY8";

// DOM elements

const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const unitToggle = document.getElementById("unit-toggle");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");
const weatherResult = document.getElementById("weather-result");
const cityName = document.getElementById("city-name");
const condition = document.getElementById("condition");
const temperature = document.getElementById("temperature");
const feelsLike = document.getElementById("feels-like");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");
const date = document.getElementById("date");

// State

let isCelsius = true;

async function getWeather(city) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${API_KEY}&contentType=json`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("City not found");
    }

    const data = await response.json();
    return data;
}

function processWeather(data) {
    console.log(data.currentConditions);
    return {
        city: data.resolvedAddress,
        condition: data.currentConditions.conditions,
        icon: data.currentConditions.icon,
        tempC: data.currentConditions.temp,
        feelsLikeC: data.currentConditions.feelslike,
        humidity: data.currentConditions.humidity,
        windSpeed: data.currentConditions.windspeed,
    }
}

function updateBackground(icon) {
    const backgrounds = {
        "clear-day": "#f5c842",
        "clear-night": "#1a1a2e",
        "cloudy": "#9e9e9e",
        "partly-cloudy-day": "#90b8d4",
        "partly-cloudy-night": "#2c3e50",
        "rain": "#4a6fa5",
        "snow": "#dce8f0",
        "fog": "#b0bec5",
        "wind": "#81d4fa",
        "thunder-rain": "#37474f",
        "thunder-showers-day": "#546e7a",
        "thunder-showers-night": "#263238",
    };

    const color = backgrounds[icon] || "#f0f2f5";
    document.body.style.backgroundColor = color;
}

function getWeatherEmoji(icon) {
    const emojis = {
        "clear-day": "☀️",
        "clear-night": "🌙",
        "cloudy": "☁️",
        "partly-cloudy-day": "⛅",
        "partly-cloudy-night": "🌤️",
        "rain": "🌧️",
        "snow": "❄️",
        "fog": "🌫️",
        "wind": "💨",
        "thunder-rain": "⛈️",
        "thunder-showers-day": "⛈️",
        "thunder-showers-night": "⛈️"
    };

    return emojis[icon] || "🌡️";
}

function displayWeather(weather) {
    cityName.textContent = weather.city;
    condition.textContent = `${getWeatherEmoji(weather.icon)} ${weather.condition}`;

    const today = new Date();
    date.textContent = today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    if (isCelsius) {
        temperature.textContent = `${weather.tempC}°C`;
        feelsLike.textContent = `Feels like: ${weather.feelsLikeC}°C`;
    } else {
        const tempF = Math.round((weather.tempC) * 9 / 5 + 32);
        const feelsLikeF = Math.round((weather.feelsLikeC) * 9 / 5 + 32);
        temperature.textContent = `${tempF}°F`;
        feelsLike.textContent = `Feel like: ${weather.feelsLikeF}°F`;
    }

    humidity.textContent = `Humidity: ${weather.humidity}%`;
    windSpeed.textContent = `Wind: ${weather.windSpeed} km/h`;
}

function showLoading() {
    loading.classList.remove("hidden");
    errorMessage.classList.add("hidden");
    weatherResult.classList.add("hidden");
}

function showError() {
    errorMessage.classList.remove("hidden");
    loading.classList.add("hidden");
    weatherResult.classList.add("hidden");
}

function showWeather() {
    weatherResult.classList.remove("hidden");
    loading.classList.add("hidden");
    errorMessage.classList.add("hidden");
}

let currentWeather = null;

async function handleSearch(city) {
    showLoading();

    try {
        const data = await getWeather(city);
        currentWeather = processWeather(data);
        displayWeather(currentWeather);
        updateBackground(currentWeather.icon);
        showWeather();
    } catch (error) {
        showError();
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const city = cityInput.value.trim();

    if (city === "") return;

    handleSearch(city);
});

unitToggle.addEventListener("click", () => {
    isCelsius = !isCelsius;
    unitToggle.textContent = isCelsius ? "Switch to °F" : "Switch to °C";

    if (currentWeather !== null) {
        displayWeather(currentWeather);
    }
});