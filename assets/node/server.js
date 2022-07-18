// #region require
const express = require('express');
const path = require('path');
require("dotenv").config();
const MongoClient = require('mongodb').MongoClient;
const cookie = require('cookie-parser');
const { send } = require('process');
// #endregion

// #region costanti 
const listenPort = process.env.PORT || 3000;
const DBName = process.env.DB_NAME;
const mc = new MongoClient(process.env.DB_URL);
const app = express();
const expireTime = 30 * 60 * 1000;
const collectionName = process.env.COLLECTION_NAME;
// #endregion

// #region impostazioni middleware
app.use(express.static(path.join(__dirname, "../")));
app.use("/css", express.static(path.join(__dirname, "../css")));
app.use("/js", express.static(path.join(__dirname, "../js")));

app.set("views", path.join(__dirname, "../../views"));
app.set("view engine", "ejs"); //motore ejs

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookie());
// #endregion

// #region routing

app.get("/", (req, res) => {
    if (req.cookies.login !== undefined) {
        /*mc.connect(function (err, db) {
            if (err) throw err;
            let dbo = db.db(DBName);
            let query = { user: req.cookies.login };
            dbo.collection(collectionName).findOne(query, (err, result) => {
                if (err) throw err;
                res.render("index", { autenticaton: true, user: req.cookies.login, pref: result.pref }).status(200).end();
                db.close();
            });
    
        });*/
        res.render("index", { autenticaton: true, user: req.cookies.login }).status(200).end();
    }
    else
        res.render("index", { autenticaton: false }).status(200).end();
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

    res.render("login/registrazione").status(200).end();
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
                res.json({ result: "err" });
            else
                res.json({ result: "ok" });
            db.close();
        });

    });
});

app.get("/areaPersonale", (req, res) => {

    let userName = req.cookies.login;

    mc.connect(function (err, db) {
        if (err) throw err;
        let dbo = db.db(DBName);
        let query = { user: userName };
        dbo.collection(collectionName).findOne(query, (err, result) => {
            if (err) throw err;
            res.render("login/areaPersonale", { email: result.email, user: result.user, pref: result.pref });
            db.close();
        });

    });
});

app.post("/aggiornaDati", (req, res) => {

    let utente = req.cookies.login;

    if (req.body.mail !== undefined) {
        mc.connect(function (err, db) {
            if (err) throw err;
            let dbo = db.db(DBName);
            let query = { user: utente };
            let aggiorna = { $set: { email: req.body.mail } };
            dbo.collection(collectionName).updateOne(query, aggiorna, (err, result) => {
                if (err) throw err;
                res.redirect("/areaPersonale", { email: req.body.mail, user: utente, pref: result.pref });
                db.close();
            });

        });
    }
});

app.get("/logout", (req, res) => {
    res.clearCookie("login").redirect("/");
});
// #endregion

// #endregion

const server = app.listen(listenPort, () => {
    console.log(`Applicazione in ascolto su porta ${listenPort}`);
});