var express = require("express");
const db = require("../sequelize.js");
var Cityarea = db.cityarea;
var City = db.city;


var getShow = function(req, res){
    var text = "Message";
    Cityarea.findAll({
        include: [{
            model: City,
            required: true
        }]
    }).then(cityarea => {
        // Send all citie areas to Client
        if (req.session.message){
            text = req.session.message;
            req.session.message = null;
        }
        var response = {};
        response.cityarea = cityarea;
        response.message = text;
        res.render("cityarea", {cityareas:response});
    });
}

// Send cityarea in JSON
var getCityarea = function(req, res){
    var reg = new RegExp("[0-9]+");
    if (!reg.test(req.query.id)){
        Cityarea.findAll().then(cityarea => {
                // Send city areas to Client
                res.send(cityarea);    
        });
    }else{
        Cityarea.findByPk(req.query.id, {
            include: [{
                model: City,
                required: true
            }]
        }).then(cityarea => {
            // Send requested City area to Client
            res.send(cityarea.dataValues);
        });
    }
}

// Create city area
var createCityarea = function(req, res){
    if (req.query.name == ""){
          req.query.name = null;
    }
    Cityarea.create({
          Name: req.query.name,
          Size: req.query.size,
          Description: req.query.description,
          CityId: req.query.citySelect
    }).then(function(result){
          req.session.message = "Record is created in database.";
          res.redirect("show");
    }).catch(function(err){
          req.session.message = "Error when creating data.";
          res.redirect("show");
    });
}

// Edit City
var editCityarea = function(req, res){
    if (req.query.name == ""){
        req.query.name = null;
    }
    Cityarea.update({
        Name: req.query.name,
        Size: req.query.size,
        Description: req.query.description,
        CityId: req.query.citySelect
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
var deleteCityarea = function(req, res){
  var response = {};
  Cityarea.destroy({
        where: {
              Id : req.query.id
        }
  }).then(function(){
        response.message = "Ok";
        response.id = req.query.id;
        res.send(response);
  }).catch(function(err){
        if (err.name == "SequelizeForeignKeyConstraintError")
              response.message = "There are Stations that are from this City area, please delete them first!";
        else
              response.message = "Error when deleting data."
        res.send(response);
  });
}

module.exports.getShow = getShow;
module.exports.getCityarea = getCityarea;
module.exports.createCityarea = createCityarea;
module.exports.editCityarea = editCityarea;
module.exports.deleteCityarea = deleteCityarea;