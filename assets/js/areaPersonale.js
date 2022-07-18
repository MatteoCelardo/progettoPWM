document.getElementById("userForm").addEventListener('submit', async (e) => {
    e.preventDefault();
    let user = document.getElementById("user").value;
    let bodyReq = JSON.stringify({ user: user });

    inviaNuoviDati(bodyReq, "responseUser", "containerUser", "username aggiornato correttamente!", "errore. Username non aggiornato. Prova con un altro username", "pUser", user);
});

document.getElementById("emailForm").addEventListener('submit', async (e) => {
    e.preventDefault();
    let mail = document.getElementById("mail").value;
    let bodyReq = JSON.stringify({ mail: mail });
    
    inviaNuoviDati(bodyReq, "responseEmail", "containerEmail", "email aggiornata correttamente!", "errore. Email non aggiornata","pEmail",mail);
});

document.getElementById("pwForm").addEventListener('submit', async (e) => {
    e.preventDefault();
    let pw = CryptoJS.SHA256(document.getElementById("pw").value).toString();
    let bodyReq = JSON.stringify({ pw: pw });
    
    inviaNuoviDati(bodyReq, "responsePw", "containerPw", "password aggiornata correttamente!", "errore. Password non aggiornata");
});

document.getElementById("prefForm").addEventListener('submit', async (e) => {
    e.preventDefault();
    let pref = document.getElementById("pref").value;
    let bodyReq = JSON.stringify({ pref: pref });
    let div;
    let p;
    let divRow;
    let divNome;
    let pNome;
    let bottone;

    let resp = await fetch("/aggiungiCit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: bodyReq,
    });

    resp = await resp.json();

    if (document.getElementById("responsePref") !== null)
        document.getElementById("containerPref").removeChild(document.getElementById("responsePref"));

    div = document.createElement("div");
    div.setAttribute("id", "responsePref");
    div.classList.add("container", "text-center", "h3");

    p = document.createElement("p");
    if (await resp.result == "ok") {
        p.classList.add("text-success");
        p.innerText = "città aggiornata correttamente ai preferiti!";

        div.appendChild(p);
        document.getElementById("containerPw").appendChild(div);

        divRow = document.createElement("div");
        divRow.classList.add("row", "mb-2");

        divNome = document.createElement("div");
        divNome.classList.add("col", "rounded", "bg-secondary", "mr-2");

        pNome = document.createElement("p");
        pNome.classList.add("h4");
        pNome.innerText = pref;

        bottone = document.createElement("button");
        bottone.classList.add("rimuovi", "btn", "btn-primary", "btn-block", "mb-4");
        bottone.innerText = "Rimuovi";
        bottone.setAttribute("type", "text");

        divNome.appendChild(pNome);
        divNome.appendChild(bottone);
        divRow.appendChild(divNome);

        document.getElementById("divPref").appendChild(divRow);
    } else {
        p.classList.add("text-danger");
        p.innerText = "errore, preferiti non aggiornati";
    }

    div.appendChild(p);
    document.getElementById("containerPref").appendChild(div);
});

if (document.getElementsByClassName("rimuovi").length != 0) {
    let bottoni = document.getElementsByClassName("rimuovi")
    Array.prototype.forEach.call(bottoni, element => {
        element.addEventListener("click", async (e) => {
            //await fetch("");
            //TODO vedere cosa contenga l'oggetto e o se usare l'elemento element per capire cosa mandare al server
        });
    });
}

async function inviaNuoviDati(bodyReq, nomeResponse, nomeContainer, textOnSucc, textOnFail, nomeP = null, textP) {
    let div;
    let p;

    let resp = await fetch("/aggiornaDati", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: bodyReq,
    });

    resp = await resp.json();

    if (document.getElementById(nomeResponse) !== null)
        document.getElementById(nomeContainer).removeChild(document.getElementById(nomeResponse));

    div = document.createElement("div");
    div.setAttribute("id", nomeResponse);
    div.classList.add("container", "text-center", "h3");

    p = document.createElement("p");
    if (await resp.result == "ok") {
        p.classList.add("text-success");
        p.innerText = textOnSucc;
        if (nomeP != null)
            document.getElementById(nomeP).innerText = textP;
    } else {
        p.classList.add("text-danger");
        p.innerText = textOnFail;
    }

    div.appendChild(p);
    document.getElementById(nomeContainer).appendChild(div);
}
