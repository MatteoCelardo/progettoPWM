init();

function init() {
    //init eventListener della darkmode
    document.getElementById("darkModeToggle").addEventListener("click", toggleDarkMode);

    //init preferenza dark o light mode
    checkPref();
}

function toggleDarkMode() {
    if (document.body.classList.contains("bootstrap")) {
        document.body.className = "bootstrap-dark";
        document.getElementById("topNavBar").className = "navbar navbar-expand-lg navbar bg-dark";
    }
    else {
        document.body.className = "bootstrap";
        document.getElementById("topNavBar").className = "navbar navbar-expand-lg navbar bg-light";
    }

    savePref();
}

function checkPref() {
    let pref = JSON.parse(localStorage.getItem("darkPref"));
    let date = new Date();

    if (pref !== 'undefined' && pref.dark && (date.getTime() - pref.timestamp) < (1000 * 60 * 60 * 24 * 7)) {
        document.body.className = "bootstrap-dark";
        document.getElementById("topNavBar").className = "navbar navbar-expand-lg navbar bg-dark";
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