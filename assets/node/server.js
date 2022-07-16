// #region require
const express = require('express');
const path = require('path');
const session = require('express-session');
require("dotenv").config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
// #endregion

// #region costanti 
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
// #endregion

/*app.use(session({
	secret: process.env.SECRET_KEY,
    httpOnly: true,
	resave: false,
	saveUninitialized: false, 
	cookie: {secure: false, maxAge: 15*60*1000}
}));*/

// #region routing

app.get("/",(req,res) => {
    res.render("index").status(200).end();
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
});

app.post("/creaUtente", (req, res) => {
    res.send(req.body);
});
// #endregion

const server = app.listen(3000, ()=>{
	let port = process.env.PORT || 3000;

	console.log(`Applicazione in ascolto su porta ${port}`);
});