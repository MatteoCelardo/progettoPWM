const tokenWeather = "ae89f0d2ce4533d920af03eda0fa850b";
const tokenImg = "563492ad6f91700001000001d9738e02bbc548bf973a634e989e643b"; //pexels

init();

// #region funzioni di init

function init() {

    initCarousel();

    //init meteo città corrente
    getCurrentCityWeather();

    if (document.getElementsByClassName("fotoPref").length != 0) {
        let preferiti = document.getElementsByClassName("fotoPref");
        Array.prototype.forEach.call(preferiti, async element => {
            let {lat,lon} = await getCityCoord(element.childNodes[3].childNodes[1].innerText);
            let weather = await getCityWeather(lat, lon);
            getImg(weather.weather[0].description, element.childNodes[1].id, Math.floor(Math.random() * 15));
            document.getElementById(element.childNodes[3].childNodes[3].childNodes[1].id).innerText = "temperatura: " + weather.main.temp + "°";
            document.getElementById(element.childNodes[3].childNodes[3].childNodes[3].id).innerText = "temperatura percepita: " + weather.main.feels_like + "°";
            document.getElementById(element.childNodes[3].childNodes[3].childNodes[5].id).innerText = "umidità: " + weather.main.humidity + "%";
            document.getElementById(element.childNodes[3].childNodes[3].childNodes[7].id).innerText = "tempo: " + weather.weather[0].description;
        });
    }

}

function initCarousel() {

    getImg("sun", "carouselImg1", 0);
    getImg("rain", "carouselImg2", 1);
    getImg("snow", "carouselImg3", 0);

}

// #endregion

// #region condizioni meteo in tempo reale

async function getCurrentCityWeather() {
    navigator.geolocation.getCurrentPosition(async (position) => {

        let weather;

        weather = await getCityWeather(position.coords.latitude, position.coords.longitude);

        getImg(weather.weather[0].description, "currentCityImg", Math.floor(Math.random() * 15));

        document.getElementById("currentCityName").innerText = weather.name;
        document.getElementById("currentCityTemp").innerText = "temperatura: " + weather.main.temp + "°";
        document.getElementById("currentCityTempPerc").innerText = "temperatura percepita: " + weather.main.feels_like + "°";
        document.getElementById("currentCityHumid").innerText = "umidità: " + weather.main.humidity + "%";
        document.getElementById("currentCityWeather").innerText = "tempo: " + weather.weather[0].description;
    });
}


async function getCityCoord(city) {
    let resp = await fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + tokenWeather, { method: "GET" });
    resp = await resp.json();

    return {lat: resp[0].lat, lon: resp[0].lon};
}

async function getCityWeather(lat, lon) {

    let weather = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + tokenWeather + "&units=metric&lang=it", { method: "GET" });
    return await weather.json();
}

// #endregion

async function getImg(subject, id, index) {
    let resp = await fetch("https://api.pexels.com/v1/search?locale=it-IT&query=" + subject, { method: "GET", headers: { Authorization: tokenImg } });
    let json = await resp.json();

    document.getElementById(id).src = await json.photos[index].src.landscape;
}
