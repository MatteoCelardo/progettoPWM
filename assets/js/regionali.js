init();

function init() {
    let bottoni = document.getElementsByClassName("botReg");

    Array.prototype.forEach.call(bottoni, b => {
        b.addEventListener("click", async (e) => {
            let coord;
            let weather;
            let prov;
            let container = document.createElement("div");
            let nomeRegione = document.createElement("p");
            let riga;
            let colonna;
            let provincia;
            let imgProv;
            let meteoProv;
            let h4;
            let ul;
            let liTemp;
            let liTempPerc;
            let liHum;
            let liW;

            container.classList.add("container");
            container.id = "containerRegione";
            nomeRegione.classList.add("h3", "mb-3");
            nomeRegione.innerText = b.innerText;
            container.appendChild(nomeRegione);



            let resp = await fetch("/previsioniRegionali/regione?scelta=" + b.innerText, {
                method: "GET",
                headers: { "Content-Type": "application/json", Accept: "application/json" },
            });
            resp = await resp.json();
            resp = await resp.prov;

            resp = await resp.map(element => {
                if (element != "La Spezia" && element != "Vibo Valentia" && element != "Reggio nell'Emilia")
                    return element.split(" ")[0];
                else
                    return element;
            });

            resp = await resp.map(element => {
                return element.split("-")[0];
            });

            for (let i = 0; i <= (resp.length / 3); i++) {
                prov = 0 + (i * 3);
                riga = document.createElement("div");
                riga.classList.add("row", "row-cols-md-3", "row-cols-sm-2");

                while (prov < await resp.length && prov < 3 + (3 * i)) {
                    coord = await getCityCoord(resp[prov]);
                    weather = await getCityWeather(coord.lat, coord.lon);

                    colonna = document.createElement("div");
                    colonna.classList.add("col");

                    provincia = document.createElement("div");
                    provincia.classList.add("card", "shadow-sm", "fotoPref", "mb-4");

                    imgProv = document.createElement("img");
                    imgProv.classList.add("d-block", "w-100");
                    imgProv.id = resp[prov];

                    meteoProv = document.createElement("div");
                    meteoProv.classList.add("card-body", "bg-dark");

                    h4 = document.createElement("h4");
                    h4.classList.add("card-title", "text-light");
                    h4.innerText = resp[prov];

                    ul = document.createElement("ul");
                    ul.classList.add("card-text", "text-light", "list-unstyled");

                    liTemp = document.createElement("li");
                    liTemp.classList.add("lead");

                    liTempPerc = document.createElement("li");
                    liTempPerc.classList.add("lead");

                    liHum = document.createElement("li");
                    liHum.classList.add("lead");

                    liW = document.createElement("li");
                    liW.classList.add("lead");

                    liTemp.innerText = "temperatura: " + weather.main.temp + "°";
                    liTempPerc.innerText = "temperatura percepita: " + weather.main.feels_like + "°";
                    liHum.innerText = "umidità: " + weather.main.humidity + "%";
                    liW.innerText = "tempo: " + weather.weather[0].description;

                    ul.appendChild(liTemp);
                    ul.appendChild(liTempPerc);
                    ul.appendChild(liHum);
                    ul.appendChild(liW);

                    meteoProv.appendChild(h4);
                    meteoProv.appendChild(ul);

                    provincia.appendChild(imgProv);
                    provincia.appendChild(meteoProv);

                    colonna.appendChild(provincia);

                    riga.appendChild(colonna);

                    prov++;
                }
                container.appendChild(riga);
            }

            if (document.getElementById("indicazioni") !== null)
                document.getElementById("indicazioni").remove();

            if (document.getElementById("containerRegione") !== null)
                document.getElementById("containerRegione").remove();
            document.getElementById("albumPrevisioni").appendChild(container);

            for(let el in resp ){
                getImg(weather.weather[0].description, ""+resp[el], Math.floor(Math.random() * 15));
            }

        });
    });

}