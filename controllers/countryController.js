var express = require("express");
const db = require("../sequelize.js");
var Country = db.country;


var getShow = function(req, res){
    Country.findAll().then(country => {
        res.render("country/index", {countries:country});
    });
}

var createCountry = function(req, res){
    Country.create({
          Name: req.query.name,
          Code: req.query.countryCode,
          Size: req.query.size,
          Population: req.query.population,
          Continent: req.query.continentSelect
    }).then(function(){
          res.redirect("show");
    });
}

module.exports.createCountry = createCountry;
module.exports.getShow = getShow;