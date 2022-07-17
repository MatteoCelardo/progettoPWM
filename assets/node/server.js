// #region require
const express = require('express');
const path = require('path');
const session = require('express-session');
require("dotenv").config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
const { send } = require('process');
// #endregion

// #region costanti 
const listenPort = process.env.PORT || 3000;
const DBName = process.env.DB_NAME;
const mc = new MongoClient(process.env.DB_URL);
const app = express();
const expireTime = 15 * 60 * 1000;
const collectionName = process.env.COLLECTION_NAME;
// #endregion

// #region impostazioni middleware
app.use(express.static(path.join(__dirname, "../")));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/js", express.static(path.join(__dirname, "../js")));

app.set("views", path.join(__dirname, "../../views"));
app.set("view engine", "ejs"); //motore ejs

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookie());
// #endregion

// #region routing

app.get("/", (req, res) => {
    if (req.cookies.login !== undefined)
        res.render("index", { autenticato: true, user: req.cookies.login }).status(200).end();
    else
        res.render("index", { autenticato: false }).status(200).end();
});

app.get("/previsioniRegionali", (req, res) => {
    res.render("previsioni/regionali").status(200).end();
});

app.get("/previsioniNazionali", (req, res) => {
    res.render("previsioni/nazionali").status(200).end();
});

// #region login e registrazione

app.get("/login", (req, res) => {
    let auth = req.query.auth ? true : false;

    res.render("login/login", { credenzialiErrate: auth }).status(200).end();
});

app.get("/registrazione", (req, res) => {
    let creato = req.query.creato;

    res.render("login/registrazione", { creato: creato }).status(200).end();
});

app.get("/verificaCredenziali", (req, res) => {
    let { mail, pw } = req.query;
    mc.connect(function (err, db) {
        if (err) throw err;
        let dbo = db.db(DBName);
        let query = { email: mail };
        dbo.collection(collectionName).findOne(query, (err, result) => {
            if (err) throw err;
            if (result !== null && result.pw == pw)
                res.cookie("login", result.user, {
                    maxAge: expireTime,
                    httpOnly: true
                }).redirect("/");
            else
                res.redirect("/login?auth=fail");
            db.close();
        });

    });
});

app.post("/creaUtente", (req, res) => {
    let { userName, mail, pw } = req.body;

    mc.connect(function (err, db) {
        if (err) throw err;
        let dbo = db.db(DBName);
        let utente = { email: mail, user: userName, pw: pw };
        dbo.collection(collectionName).insertOne(utente, (err, result) => {
            if (err)
                res.redirect("/registrazione?creato=err");
            else
                res.redirect("/registrazione?creato=ok");
            db.close();
        });

    });
});
// #endregion

// #endregion

const server = app.listen(listenPort, () => {


    console.log(`Applicazione in ascolto su porta ${listenPort}`);
});