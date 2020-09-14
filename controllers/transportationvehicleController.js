var express = require("express");
var cookie = require("../helper/cookie.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
var Type = db.transportationtype;
var Vehicle = db.transportationvehicle;
var BookshelfVehicle = dbBookshelf.Transportationvehicle;


var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'Bookshelf'){
        BookshelfVehicle.fetchAll({withRelated:['transportationtype']}).then(vehicle => {
            // Send all vehicles to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.vehicle = vehicle.toJSON();
            response.message = text;
            res.render("vehicle", {vehicles:response});
        });
    }else if (orm == 'Sequelize'){
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
}

// Send vehicle in JSON
var getVehicle = function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        if (!reg.test(req.query.id)){
            BookshelfVehicle.fetchAll().then(vehicle => {
                // Send requested vehicle to Client 
                res.send(vehicle.toJSON());
            });
        }else{
            BookshelfVehicle.where('Id', req.query.id).fetchAll({
                withRelated:['transportationtype']
            }).then(vehicle => {
                // Send requested vehicle to Client
                res.send(vehicle.toJSON()[0]);
            });
        }
    }else if (orm = 'Sequelize'){
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
}

// Create vehicle
var createVehicle = function(req, res){
    if (req.query.name == ""){
          req.query.name = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        BookshelfVehicle.forge({
            Name: req.query.name,
            Description: req.query.description,
            Color: req.query.color,
            ProductionYear: req.query.productionYear,
            TransportationTypeId: req.query.typeSelect
        }).save().then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Sequelize'){
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
}

// Edit Vehicle
var editVehicle = function(req, res){
    if (req.query.name == ""){
        req.query.name = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        BookshelfVehicle.where({
            Id: req.query.id
        }).save({
            Name: req.query.name,
            Description: req.query.description,
            Color: req.query.color,
            ProductionYear: req.query.productionYear,
            TransportationTypeId: req.query.typeSelect
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
}

// Delete Vehicle
var deleteVehicle = function(req, res){
  var response = {};
  var orm = cookie.getOrm(req, res);
    
    if (orm == 'Bookshelf'){
        BookshelfVehicle.where({
            Id: req.query.id
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
}

module.exports.getShow = getShow;
module.exports.getVehicle = getVehicle;
module.exports.createVehicle = createVehicle;
module.exports.editVehicle = editVehicle;
module.exports.deleteVehicle = deleteVehicle;