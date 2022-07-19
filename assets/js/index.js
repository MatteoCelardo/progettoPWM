init();

// #region funzioni di init

function init() {

    initCarousel();

    //init meteo città corrente
    getCurrentCityWeather();

    if (document.getElementsByClassName("fotoPref").length != 0) {
        let preferiti = document.getElementsByClassName("fotoPref");
        Array.prototype.forEach.call(preferiti, async element => {
            let { lat, lon } = await getCityCoord(element.childNodes[3].childNodes[1].innerText);
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
