document.addEventListener("DOMContentLoaded",init());

function init() 
{
    //init eventListener della darkmode
    document.getElementById("darkModeToggle").addEventListener("click", function(){
        if(document.body.classList.contains("bootstrap"))
        {
            document.body.className = "bootstrap-dark";
            document.getElementById("topNavBar").className = "navbar navbar-expand-lg navbar bg-dark fixed-top";
        }
        else
        {
            document.body.className = "bootstrap";
            document.getElementById("topNavBar").className = "navbar navbar-expand-lg navbar bg-light fixed-top";
        }

        savePref();
    })
    
    //init preferenza dark o light mode
    checkPref();
    
    //init meteo città corrente
    getCurrentCityWeather();
}


async function getCurrentCityWeather()
{
    navigator.geolocation.getCurrentPosition(async (position) => {
        let weather, weatherJson;
        const token = "ae89f0d2ce4533d920af03eda0fa850b";

        weather = await fetch("https://api.openweathermap.org/data/2.5/weather?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&appid="+token+"&units=metric&lang=it",{method:"GET"});
        weatherJson = await weather.json();

        document.getElementById("currentCity").innerText = weatherJson.name;
        document.getElementById("currentCityTemp").innerText = "temperatura: "+weatherJson.main.temp+"°";
        document.getElementById("currentCityTempPerc").innerText = "temperatura percepita: "+weatherJson.main.feels_like+"°";
        document.getElementById("currentCityHumid").innerText = "umidità: "+weatherJson.main.humidity+"%";
    }); 
}

/* vedere se tenere o meno
async function getCity(city, lat, lon)
{
    let resp = await fetch("https://api.openweathermap.org/geo/1.0/direct?q="+city+"&limit=1&appid=ae89f0d2ce4533d920af03eda0fa850b",{method:"GET"});
    resp = await resp.json();

    return [resp[0].lat, resp[0].lon];
}
*/

function checkPref()
{
    let pref = JSON.parse(localStorage.getItem("darkPref"));
    let date = new Date();

    if(pref !== 'undefined' && pref.dark && (date.getTime() - pref.timestamp) < (1000*60*60*24*7))
    {
        document.body.className = "bootstrap-dark";
        document.getElementById("topNavBar").className = "navbar navbar-expand-lg navbar bg-dark fixed-top";
    }

    savePref();

}

function savePref()
{
    let timestamp = new Date();
    let pref = {};

    if(document.body.className == "bootstrap")
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

    localStorage.setItem("darkPref",pref);
}