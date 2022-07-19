document.getElementById("inputRicerca").addEventListener("keyup", async (e) => {
    e.preventDefault();

    let p;

    let resp = await fetch("/citCercata?search=" + document.getElementById("inputRicerca").value, {
        method: "GET",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    resp = await resp.json();

    if (document.getElementById("ricercaResult") !== null)
        document.getElementById("ricercaDropdown").removeChild(document.getElementById("ricercaResult"));

    p = document.createElement("p");
    p.setAttribute("id", "ricercaResult");
    p.classList.add("h5", "mr-3");
    if (await resp.result == "ok") {
        p.classList.add("text-success");
        p.innerText = "città trovata! premi su cerca";
    } else {
        p.classList.add("text-danger");
        p.innerText = "città non trovata";
    }
    document.getElementById("ricercaDropdown").appendChild(p);

});

document.getElementById("formRicerca").addEventListener("submit", async (e) => {
    e.preventDefault();

    let cercata = document.getElementById("inputRicerca").value;

    let resp = await fetch("/citCercata?search=" + cercata, {
        method: "GET",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    resp = await resp.json();

    if (await resp.result == "ok")
        window.location.replace("/meteoCitCercata?search="+cercata);
});