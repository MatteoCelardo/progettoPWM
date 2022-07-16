const tokenWeather = "ae89f0d2ce4533d920af03eda0fa850b";
const tokenImg = "563492ad6f91700001000001d9738e02bbc548bf973a634e989e643b"; //pexels

init();

// #region funzioni di init

function init() {
    //init eventListener della darkmode
    document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);

    //init preferenza dark o light mode
    checkPref();

    initCarousel();

    //init meteo città corrente
    getCurrentCityWeather();

}

function initCarousel(){

    getImg("sun","carouselImg1",0);
    getImg("rain","carouselImg2",1);
    getImg("snow","carouselImg3",0);

}

// #endregion

// #region condizioni meteo in tempo reale

async function getCurrentCityWeather() {
    navigator.geolocation.getCurrentPosition(async (position) => {

        let weather;

        weather = await getCityWeather(position.coords.latitude, position.coords.longitude);

        getImg(weather.weather[0].description, "currentCityImg",Math.floor(Math.random() * 15));

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

    return [resp[0].lat, resp[0].lon];
}

async function getCityWeather(lat, lon) {

    let weather = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + tokenWeather + "&units=metric&lang=it", { method: "GET"});
    return await weather.json();
}

// #endregion

// #region darkmode toggle

function toggleDarkMode() {
    if (document.body.classList.contains("bootstrap")) {
        document.body.className = "bootstrap-dark";
        document.getElementById("topNavBar").className = "navbar navbar-expand-lg navbar bg-dark fixed-top";
    }
    else {
        document.body.className = "bootstrap";
        document.getElementById("topNavBar").className = "navbar navbar-expand-lg navbar bg-light fixed-top";
    }

    savePref();
}

function checkPref() {
    let pref = JSON.parse(localStorage.getItem("darkPref"));
    let date = new Date();

    if (pref !== 'undefined' && pref.dark && (date.getTime() - pref.timestamp) < (1000 * 60 * 60 * 24 * 7)) {
        document.body.className = "bootstrap-dark";
        document.getElementById("topNavBar").className = "navbar navbar-expand-lg navbar bg-dark fixed-top";
    }

    savePref();

}

function savePref() {
    let timestamp = new Date();
    let pref = {};

    if (document.body.className == "bootstrap")
        pref = {
            "dark": false,
            "timestamp": timestamp.getTime()
        };
    else
        pref = {
            "dark": true,
            "timestamp": timestamp.getTime()
        };

    pref = JSON.stringify(pref);

    localStorage.setItem("darkPref", pref);
}

// #endregion


async function getImg(subject, id, index) {
    let resp = await fetch("https://api.pexels.com/v1/search?locale=it-IT&query="+subject, { method: "GET", headers: {Authorization: tokenImg}});
    let json = await resp.json();

    document.getElementById(id).src = await json.photos[index].src.landscape;
}
