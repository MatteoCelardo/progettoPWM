const tokenWeather = "ae89f0d2ce4533d920af03eda0fa850b";
const tokenImg = "563492ad6f91700001000001d9738e02bbc548bf973a634e989e643b"; //pexels

async function getCityCoord(city) {

    let resp = await fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + tokenWeather, { method: "GET" });
    resp = await resp.json();

    return { lat: resp[0].lat, lon: resp[0].lon };
}

async function getCityWeather(lat, lon) {

    let weather = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + tokenWeather + "&units=metric&lang=it", { method: "GET" });
    return await weather.json();
}

async function getImg(subject, id, index) {
    let resp = await fetch("https://api.pexels.com/v1/search?locale=it-IT&query=" + subject, { method: "GET", headers: { Authorization: tokenImg } });
    let json = await resp.json();

    document.getElementById(id).src = await json.photos[index].src.landscape;
}