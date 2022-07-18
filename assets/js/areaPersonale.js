document.getElementById("pwForm").addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById("pw").value = CryptoJS.SHA256(document.getElementById("pw").value).toString();
    document.getElementById("pwForm").submit();
});

if (document.getElementsByClassName("rimuovi").length != 0)
    document.getElementsByClassName("rimuovi").array.forEach(element => {
        element.addEventListener("click", async (e) => {
            //await fetch("");
            //TODO vedere cosa contenga l'oggetto e o se usare l'elemento element per capire cosa mandare al server
        });
    });
