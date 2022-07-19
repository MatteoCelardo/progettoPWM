async function getMeteoCitCor() {
    let { lat, lon } = await getCityCoord(document.getElementById("citCercata").innerText);
    
    let weather = await getCityWeather(lat, lon);
    getImg(weather.weather[0].description, "citCercataImg", Math.floor(Math.random() * 15));
    document.getElementById("citCercataTemp").innerText = "temperatura: " + weather.main.temp + "°";
    document.getElementById("citCercataTempPerc").innerText = "temperatura percepita: " + weather.main.feels_like + "°";
    document.getElementById("citCercataHumid").innerText = "umidità: " + weather.main.humidity + "%";
    document.getElementById("citCercataWeather").innerText = "tempo: " + weather.weather[0].description;
}

getMeteoCitCor();