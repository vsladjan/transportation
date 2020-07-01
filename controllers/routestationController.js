var express = require("express");
const db = require("../sequelize.js");
var Routestation = db.routestation;
var Station = db.station;
var Route = db.route;
var Vehicle = db.transportationvehicle;


var getShow = function(req, res){
    var text = "Message";
    Routestation.findAll({
        include: [
            { model: Station, required: true },
            { model: Route, required: true },
            { model: Vehicle, required: true }
        ]
    }).then(routestation => {
        // Send all rotuestations to Client
        if (req.session.message){
            text = req.session.message;
            req.session.message = null;
        }
        var response = {};
        response.routestation = routestation;
        response.message = text;
        res.render("routestation", {routestations:response});
    });
}

// Send routestation in JSON
var getRoutestation = function(req, res){
    var reg = new RegExp("[0-9]+");
    if (!reg.test(req.query.routeId)){
        Routestation.findAll().then(routestation => {
                // Send routestation to Client
                res.send(routestation);    
        });
    }else{
        Routestation.findAll({
            where: {
                RouteId : req.query.routeId,
                StationId : req.query.stationId,
                TransportationVehicleId : req.query.vehicleId,
                Time: req.query.time
            },
            include: [
                { model: Station, required: true },
                { model: Route, required: true },
                { model: Vehicle, required: true }
            ]
        }).then(routestation => {
            // Send requested Routestation to Client
            res.send(routestation[0].dataValues);
        });
    }
}

// Create routestation
var createRoutestation = function(req, res){
    if (req.query.type == "" || req.query.time == ""){
          req.query.type = null;
    }
    Routestation.create({
        StationId: req.query.stationSelect,
        RouteId: req.query.routeSelect,
        TransportationVehicleId: req.query.vehicleSelect,
        Time: req.query.time,
        Type: req.query.type
    }).then(function(result){
          req.session.message = "Record is created in database.";
          res.redirect("show");
    }).catch(function(err){
          req.session.message = "Error when creating data.";
          res.redirect("show");
    });
}

// Edit Rotuestation
var editRoutestation = function(req, res){
    var response = {};
    if (req.query.type == "" || req.query.time == ""){
        req.query.type = null;
    }
    Routestation.update({
        StationId: req.query.stationId,
        RouteId: req.query.routeId,
        TransportationVehicleId: req.query.vehicleId,
        Time: req.query.time,
        Type: req.query.type
    },
    {
        where: {
            RouteId : req.query.oldRouteId,
            StationId : req.query.oldStationId,
            TransportationVehicleId : req.query.oldVehicleId,
            Time: req.query.oldTime
        },
    }).then(function(result){
        response.message = "Record is edited in database.";
        res.send(response);
    }).catch(function(err){
        response.message = "Error when editing data.";
        res.send(response);
    });
}

// Delete Routestation
var deleteRoutestation = function(req, res){
  var response = {};
  Routestation.destroy({
        where: {
              RouteId : req.query.routeId,
              StationId : req.query.stationId,
              TransportationVehicleId : req.query.vehicleId,
              Time: req.query.time
        }
  }).then(function(){
        response.message = "Ok";
        response.id = req.query.id;
        res.send(response);
  }).catch(function(err){
        if (err.name == "SequelizeForeignKeyConstraintError")
              response.message = "Error"; // TODO change comment maybe?
        else
              response.message = "Error when deleting data."
        res.send(response);
  });
}

module.exports.getShow = getShow;
module.exports.getRoutestation = getRoutestation;
module.exports.createRoutestation = createRoutestation;
module.exports.editRoutestation = editRoutestation;
module.exports.deleteRoutestation = deleteRoutestation;