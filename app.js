var express = require("express");
const session = require('express-session');
var router = require("./router/router.js");
var db = require("./sequelize.js");
const bodyParser = require("body-parser");

var app = express();
var port = 3000;

app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

db.sequelize.sync().then(() => {
    console.log('Sync db');
});

app.listen(port, function(){
    console.log("Server started on port " + port + "...");
});



app.use("/transportation/country", express.static(__dirname + "/public"));
app.use("/transportation/city", express.static(__dirname + "/public"));
app.use("/transportation/cityarea", express.static(__dirname + "/public"));
app.use("/transportation/station", express.static(__dirname + "/public"));
app.use("/transportation", router);
