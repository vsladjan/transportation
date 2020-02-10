var express = require("express");
var router = require("./router/router.js");
var db = require("./sequelize.js");
const bodyParser = require("body-parser");

var app = express();
var port = 3000;

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
app.use("/transportation", router);
