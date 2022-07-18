document.getElementById("signForm").addEventListener('submit', async (e) => {
    e.preventDefault();

    let user = document.getElementById("userName").value;
    let pw = CryptoJS.SHA256(document.getElementById("pw").value).toString();
    let mail = document.getElementById("mail").value;
    let bodyReq = JSON.stringify({ userName: user, pw: pw, mail: mail });
    let div;
    let p;

    let resp = await fetch("/creaUtente", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: bodyReq,
    });

    resp = await resp.json();


    if(document.getElementById("response") !== null)
        document.body.removeChild(document.getElementById("response"));

    div = document.createElement("div");
    div.setAttribute("id", "response");
    div.classList.add("container", "text-center", "h3");

    p = document.createElement("p");
    if (await resp.result == "ok") {
        p.classList.add("text-success");
        p.innerText = "utente creato correttamente! vai alla pagina di login per effettuare l'accesso";
    } else {
        p.classList.add("text-danger");
        p.innerText = "username già esistente";
    }

    div.appendChild(p);
    document.body.appendChild(div);
});
