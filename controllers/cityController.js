var express = require("express");
const db = require("../sequelize.js");
var City = db.city;
var Country = db.country;


var getShow = function(req, res){
    var text = "Message";
    City.findAll({
        include: [{
            model: Country,
            required: true
        }]
    }).then(city => {
        // Send all cities to Client
        if (req.session.message){
            text = req.session.message;
            req.session.message = null;
        }
        var response = {};
        response.city = city;
        response.message = text;
        res.render("city", {cities:response});
    });
}

// Send city in JSON
var getCity = function(req, res){
    var reg = new RegExp("[0-9]+");
    if (!reg.test(req.query.id)){
        City.findAll().then(country => {
                // Send cities to Client
                res.send(country);    
        });
    }else{
        City.findByPk(req.query.id, {
            include: [{
                model: Country,
                required: true
            }]
        }).then(city => {
            // Send requested City to Client
            res.send(city.dataValues);
        });
    }
}

// Create city
var createCity = function(req, res){
    if (req.query.name == ""){
          req.query.name = null;
    }
    City.create({
          Name: req.query.name,
          Population: req.query.population,
          Size: req.query.size,
          CountryId: req.query.countrySelect
    }).then(function(result){
          req.session.message = "Record is created in database.";
          res.redirect("show");
    }).catch(function(err){
          req.session.message = "Error when creating data.";
          res.redirect("show");
    });
}

// Edit City
var editCity = function(req, res){
    if (req.query.name == ""){
        req.query.name = null;
    }
    City.update({
        Name: req.query.name,
        Population: req.query.population,
        Size: req.query.size,
        CountryId: req.query.countrySelect
    },
    {
        where: {Id: req.query.id}
    }).then(function(result){
          req.session.message = "Record is edited in database.";
          res.redirect("show");
    }).catch(function(err){
          req.session.message = "Error when editing data.";
          res.redirect("show");
    });
}

// Delete City
var deleteCity = function(req, res){
  var response = {};
  City.destroy({
        where: {
              Id : req.query.id
        }
  }).then(function(){
        response.message = "Ok";
        response.id = req.query.id;
        res.send(response);
  }).catch(function(err){
        if (err.name == "SequelizeForeignKeyConstraintError")
              response.message = "There are City Areas that are from this City, please delete them first!";
        else
              response.message = "Error when deleting data."
        res.send(response);
  });
}

module.exports.getShow = getShow;
module.exports.getCity = getCity;
module.exports.createCity = createCity;
module.exports.editCity = editCity;
module.exports.deleteCity = deleteCity;