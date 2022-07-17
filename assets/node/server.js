// #region require
const express = require('express');
const path = require('path');
const session = require('express-session');
require("dotenv").config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cookie = require('cookie-parser');
// #endregion

// #region costanti 
const listenPort = process.env.PORT || 3000;
const DBName = process.env.DB_NAME;
const mc = new MongoClient(process.env.DB_URL);
const app = express();
// #endregion

// #region impostazioni middleware
app.use(express.static(path.join(__dirname,"../")));
app.use("/css",express.static(path.join(__dirname,"../css")));
app.use("/js",express.static(path.join(__dirname,"../js")));

app.set("views", path.join(__dirname, "../../views"));
app.set("view engine","ejs"); //motore ejs

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookie());
// #endregion

// #region routing

app.get("/",(req,res) => {
    if(req.cookies.nickName !== undefined)
        res.render("index",{autenticato:true}).status(200).end();
    else
        res.render("index",{autenticato:false,user:req.cookies.nickName}).status(200).end();
});

app.get("/login",(req,res)=>{
    res.render("login/login").status(200).end();
});

app.get("/registrazione",(req,res)=>{
    res.render("login/registrazione").status(200).end();
});

app.get("/previsioniRegionali", (req,res)=>{
    res.render("previsioni/regionali").status(200).end();
});

app.get("/previsioniNazionali", (req,res)=>{
    res.render("previsioni/nazionali").status(200).end();
});

app.get("/verificaCredenziali", (req, res) => {
    res.send(req.query);
    mc.connect(function(err, db) {
        if (err) throw err;
        let dbo = db.db(DBName);
        let query = { mail: req.query.email };
        let result = dbo.collection("users").find(query);
        //if(result !== undefined)
          //  res.
      });
});

app.post("/creaUtente", (req, res) => {
    res.send(req.body);
});
// #endregion

const server = app.listen(listenPort, ()=>{
	

	console.log(`Applicazione in ascolto su porta ${listenPort}`);
});

/*
per inserire cookie

res.cookie(`Cookie token name`,`encrypted cookie string Value`,{
        maxAge: 5000,
        // expires works the same as the maxAge
        expires: new Date('01 12 2021'),
        secure: true,
        httpOnly: true,
        sameSite: 'lax'
    });
*/