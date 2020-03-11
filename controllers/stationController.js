var express = require("express");
const db = require("../sequelize.js");
var Station = db.station;
var Cityarea = db.cityarea;


var getShow = function(req, res){
    var text = "Message";
    Station.findAll({
        include: [{
            model: Cityarea,
            required: true
        }]
    }).then(station => {
        // Send all cities to Client
        if (req.session.message){
            text = req.session.message;
            req.session.message = null;
        }
        var response = {};
        response.station = station;
        response.message = text;
        res.render("station", {stations:response});
    });
}

// Send station in JSON
var getStation = function(req, res){
    var reg = new RegExp("[0-9]+");
    if (!reg.test(req.query.id)){
        Station.findAll().then(station => {
                // Send stations to Client
                res.send(station);    
        });
    }else{
        Station.findByPk(req.query.id, {
            include: [{
                model: Cityarea,
                required: true
            }]
        }).then(station => {
            // Send requested City to Client
            res.send(station.dataValues);
        });
    }
}

// Create station
var createStation = function(req, res){
    if (req.query.name == ""){
          req.query.name = null;
    }
    Station.create({
          Name: req.query.name,
          Description: req.query.description,
          Location: req.query.location,
          CityAreaId: req.query.cityareaSelect
    }).then(function(result){
          req.session.message = "Record is created in database.";
          res.redirect("show");
    }).catch(function(err){
          req.session.message = "Error when creating data.";
          res.redirect("show");
    });
}

// Edit station
var editStation = function(req, res){
    if (req.query.name == ""){
        req.query.name = null;
    }
    Station.update({
        Name: req.query.name,
        Description: req.query.description,
        Location: req.query.location,
        CityAreaId: req.query.cityareaSelect
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

// Delete station
var deleteStation = function(req, res){
  var response = {};
  Station.destroy({
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
module.exports.getStation = getStation;
module.exports.createStation = createStation;
module.exports.editStation = editStation;
module.exports.deleteStation = deleteStation;