const express = require('express');
const path = require('path');
const session = require('express-session');

require("dotenv").config();

const app = express();

app.use(express.static(path.join(__dirname,"../")));
app.use("/css",express.static(path.join(__dirname,"../css")));
app.use("/js",express.static(path.join(__dirname,"../js")));

app.set("views", path.join(__dirname, "../../views"));
app.set("view engine","ejs"); //motore ejs

app.use(session({
	secret: process.env.SECRET_KEY,
    httpOnly: true,
	resave: false,
	saveUninitialized: false, 
	cookie: {secure: false, maxAge: 15*60*1000}
}));

// #region routing

app.get("/",(req,res) => {
    res.render("index");
});

// #endregion

const server = app.listen(3000, ()=>{
	let port = process.env.PORT || 3000;

	console.log(`Applicazione in ascolto su porta ${port}`);
});