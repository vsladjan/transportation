var express = require("express");
var cookie = require("../helper/cookie.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
var Routestation = db.routestation;
var Station = db.station;
var Route = db.route;
var Vehicle = db.transportationvehicle;
var BookshelfRoutestation = dbBookshelf.Routestation;


var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'Bookshelf'){
        BookshelfRoutestation.fetchAll({
            withRelated:['station', 'route', 'transportationvehicle']
        }).then(routestation => {
            // Send all routestation to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.routestation = routestation.toJSON();
            response.message = text;
            res.render("routestation", {routestations:response});
        });
    }else if (orm == 'Sequelize'){
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
}

// Send routestation in JSON
var getRoutestation = function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        if (!reg.test(req.query.routeId)){
            BookshelfRoutestation.fetchAll().then(routestation => {
                // Send requested Routestation to Client 
                res.send(routestation.toJSON());
            });
        }else{
            BookshelfRoutestation.where({
                RouteId : req.query.routeId,
                StationId : req.query.stationId,
                TransportationVehicleId : req.query.vehicleId,
                Time: req.query.time
            }).fetchAll({
                withRelated:['station', 'route', 'transportationvehicle']
            }).then(routestation => {
                // Send requested Routestation to Client
                res.send(routestation.toJSON()[0]);
            });
        }
    }else if (orm = 'Sequelize'){
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
}

// Create routestation
var createRoutestation = function(req, res){
    if (req.query.type == "" || req.query.time == ""){
          req.query.type = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        BookshelfRoutestation.forge({
            StationId: req.query.stationSelect,
            RouteId: req.query.routeSelect,
            TransportationVehicleId: req.query.vehicleSelect,
            Time: req.query.time,
            Type: req.query.type 
        }).save(null, {method: "insert"}).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Sequelize'){
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
}

// Edit Rotuestation
var editRoutestation = function(req, res){
    var response = {};
    if (req.query.type == "" || req.query.time == ""){
        req.query.type = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        BookshelfRoutestation.where({
            RouteId : req.query.routeId,
            StationId : req.query.stationId,
            TransportationVehicleId : req.query.vehicleId,
            Time: req.query.time
        }).save({
            StationId: req.query.stationId,
            RouteId: req.query.routeId,
            TransportationVehicleId: req.query.vehicleId,
            Time: req.query.time,
            Type: req.query.type
        },{
            method: 'update',
            patch:true
        }).then(function(result){
            req.session.message = "Record is edited in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when editing data.";
            res.redirect("show");
        });
    }else if (orm == 'Sequelize'){
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
}

// Delete Routestation
var deleteRoutestation = function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'Bookshelf'){
        BookshelfRoutestation.where({
            RouteId : req.query.routeId,
            StationId : req.query.stationId,
            TransportationVehicleId : req.query.vehicleId,
            Time: req.query.time
        }).destroy().then(function(){
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
    }else if (orm == 'Sequelize'){
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
}

module.exports.getShow = getShow;
module.exports.getRoutestation = getRoutestation;
module.exports.createRoutestation = createRoutestation;
module.exports.editRoutestation = editRoutestation;
module.exports.deleteRoutestation = deleteRoutestation;