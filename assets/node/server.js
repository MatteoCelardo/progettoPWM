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
        mc.connect(function (err, db) {
            if (err) throw err;
            let dbo = db.db(DBName);
            let query = { user: req.cookies.login };
            dbo.collection(collectionName).findOne(query, (err, result) => {
                if (err) throw err;
                res.render("index", { autentication: true, user: result.user, pref: result.pref });
                db.close();
            });

        });
    }
    else
        res.render("index", { autentication: false, pref: undefined });
});

app.get("/previsioniRegionali", (req, res) => {
    res.render("previsioni/regionali");
});

app.get("/previsioniNazionali", (req, res) => {
    res.render("previsioni/nazionali");
});

// #region login e registrazione

app.get("/login", (req, res) => {
    let auth = req.query.auth ? true : false;

    res.render("login/login", { credenzialiErrate: auth });
});

app.get("/registrazione", (req, res) => {

    res.render("login/registrazione");
});

app.get("/verificaCredenziali", (req, res) => {
    let { mail, pw } = req.query;

    if (mail !== undefined && pw !== undefined)
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
    else
        res.redirect("/");
});

app.post("/creaUtente", (req, res) => {
    let { userName, mail, pw } = req.body;

    if (mail !== undefined && pw !== undefined && userName !== undefined)
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
    else
        res.redirect("/");
});

app.get("/areaPersonale", (req, res) => {

    let userName = req.cookies.login;

    if (userName === undefined)
        res.redirect("/");

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
    let nuoviDati;

    if (utente === undefined)
        res.redirect("/");

    if (req.body.pw !== undefined)
        nuoviDati = { pw: req.body.pw };
    else if (req.body.mail !== undefined)
        nuoviDati = { email: req.body.mail };
    else {
        nuoviDati = { user: req.body.user };
    }

    mc.connect(function (err, db) {
        if (err) throw err;
        let dbo = db.db(DBName);
        let query = { user: utente };
        let aggiorna = { $set: nuoviDati };
        dbo.collection(collectionName).updateOne(query, aggiorna, (err, result) => {

            if (err)
                res.json({ result: "err" });
            else {
                if (req.body.user !== undefined) {
                    res.clearCookie("login")
                    res.cookie("login", req.body.user, {
                        maxAge: expireTime,
                        httpOnly: true
                    });
                }
                res.json({ result: "ok" });
            }
            db.close();
        });

    });
});

app.post("/aggiungiCit", (req, res) => {
    let utente = req.cookies.login;

    if (utente === undefined)
        res.redirect("/");

    mc.connect(function (err, db) {
        if (err) throw err;
        let dbo = db.db(DBName);
        let query = { user: utente };
        let aggiorna = { $push: { pref: req.body.pref } };
        dbo.collection(collectionName).updateOne(query, aggiorna, (err, result) => {
            if (err)
                res.json({ result: "err" });
            else
                res.json({ result: "ok" });
            db.close();
        });

    });
});

app.put("/rimuoviCit", (req, res) => {
    let utente = req.cookies.login;

    if (utente === undefined)
        res.redirect("/");


    mc.connect(function (err, db) {
        if (err) throw err;
        let dbo = db.db(DBName);
        let query = { user: utente };
        let aggiorna = { $pull: { pref: req.body.pref } };
        dbo.collection(collectionName).updateOne(query, aggiorna, (err, result) => {
            if (err)
                res.json({ result: "err" });
            else
                res.json({ result: "ok" });
            db.close();
        });

    });
});

app.get("/logout", (req, res) => {
    res.clearCookie("login").redirect("/");
});
// #endregion

// #endregion

const server = app.listen(listenPort, () => {
    console.log(`Applicazione in ascolto su porta ${listenPort}`);
});