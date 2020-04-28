var express = require("express");
const db = require("../sequelize.js");
var Type = db.transportationtype;
var Vehicle = db.transportationvehicle;


var getShow = function(req, res){
    var text = "Message";
    Vehicle.findAll({
        include: [{
            model: Type,
            required: true
        }]
    }).then(vehicle => {
        // Send all vehicles to Client
        if (req.session.message){
            text = req.session.message;
            req.session.message = null;
        }
        var response = {};
        response.vehicle = vehicle;
        response.message = text;
        res.render("vehicle", {vehicles:response});
    });
}

// Send vehicle in JSON
var getVehicle = function(req, res){
    var reg = new RegExp("[0-9]+");
    if (!reg.test(req.query.id)){
        Vehicle.findAll().then(vehicle => {
                // Send vehicles to Client
                res.send(vehicle);    
        });
    }else{
        Vehicle.findByPk(req.query.id, {
            include: [{
                model: Type,
                required: true
            }]
        }).then(vehicle => {
            // Send requested Vehicle to Client
            res.send(vehicle.dataValues);
        });
    }
}

// Create vehicle
var createVehicle = function(req, res){
    if (req.query.name == ""){
          req.query.name = null;
    }
    Vehicle.create({
          Name: req.query.name,
          Description: req.query.description,
          Color: req.query.color,
          ProductionYear: req.query.productionYear,
          TransportationTypeId: req.query.typeSelect
    }).then(function(result){
          req.session.message = "Record is created in database.";
          res.redirect("show");
    }).catch(function(err){
          req.session.message = "Error when creating data.";
          res.redirect("show");
    });
}

// Edit Vehicle
var editVehicle = function(req, res){
    if (req.query.name == ""){
        req.query.name = null;
    }
    Vehicle.update({
        Name: req.query.name,
        Description: req.query.description,
        Color: req.query.color,
        ProductionYear: req.query.productionYear,
        TransportationTypeId: req.query.typeSelect
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

// Delete Vehicle
var deleteVehicle = function(req, res){
  var response = {};
  Vehicle.destroy({
        where: {
              Id : req.query.id
        }
  }).then(function(){
        response.message = "Ok";
        response.id = req.query.id;
        res.send(response);
  }).catch(function(err){
        if (err.name == "SequelizeForeignKeyConstraintError")
              response.message = "There are Routes that have this Vehicle, please delete them first!";
        else
              response.message = "Error when deleting data."
        res.send(response);
  });
}

module.exports.getShow = getShow;
module.exports.getVehicle = getVehicle;
module.exports.createVehicle = createVehicle;
module.exports.editVehicle = editVehicle;
module.exports.deleteVehicle = deleteVehicle;