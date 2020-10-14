var express = require("express");
var cookie = require("../helper/cookie.js");
var service = require("../helper/service.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
const typeorm = require('typeorm');
var knex = require("../knexdb.js").getConnection();
var Type = db.transportationtype;
var Vehicle = db.transportationvehicle;
var BookshelfVehicle = dbBookshelf.Transportationvehicle;
var TypeORMVehicle = require("../models/typeorm/entities/Transportationvehicle.js").Transportationvehicle;


var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'Knex'){
        knex("transportationvehicle").join(
            "transportationtype",
            "transportationtype.Id",
            "transportationvehicle.TransportationTypeId").select(
                "transportationvehicle.Id", 
                "transportationvehicle.Name", 
                "transportationvehicle.Description", 
                "transportationvehicle.Color", 
                "transportationvehicle.ProductionYear",
                "transportationvehicle.TransportationTypeId",
                knex.ref("transportationtype.Name").as('TypeName')
        ).then(function(data){
            data.forEach(element => {
                let type = {};
                type.Name = element.TypeName;
                element['Transportationtype'] = type;
            });
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.vehicle = data;
            response.message = text;
            res.render("vehicle", {vehicles:response});
        });
    }else if (orm == 'TypeORM'){
        console.log("TypeORM");
        const vehicleRepository = typeorm.getConnection().getRepository(TypeORMVehicle);
        vehicleRepository.find({relations: ["transportationtype"]}).then(vehicle => {
              if (req.session.message){
                  text = req.session.message;
                  req.session.message = null;
              }
              var response = {};
              response.vehicle = service.capitalizeKeys(vehicle);
              response.message = text;
              res.render("vehicle", {vehicles:response});
        });
    }else if (orm == 'Bookshelf'){
        BookshelfVehicle.fetchAll({withRelated:['transportationtype']}).then(vehicle => {
            // Send all vehicles to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.vehicle = service.capitalizeKeys(vehicle.toJSON());
            response.message = text;
            res.render("vehicle", {vehicles:response});
        });
    }else if (orm == 'Sequelize'){
        Vehicle.findAll({
            include: [{
                model: Type,
                required: true
            }],
            raw: true,
            nest: true
        }).then(vehicle => {
            // Send all vehicles to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.vehicle = service.capitalizeKeys(vehicle);
            response.message = text;
            res.render("vehicle", {vehicles:response});
        });
    }
}

// Send vehicle in JSON
var getVehicle = function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);

    if (orm == 'Knex'){
        if (!reg.test(req.query.id)){
            knex("transportationvehicle").then(function(data){
                res.send(data);
            });
        }else{
            knex("transportationvehicle").where('transportationvehicle.Id', req.query.id).join(
                "transportationtype",
                "transportationtype.Id",
                "transportationvehicle.TransportationTypeId").select(
                    "transportationvehicle.Id", 
                    "transportationvehicle.Name", 
                    "transportationvehicle.Description", 
                    "transportationvehicle.Color", 
                    "transportationvehicle.ProductionYear",
                    "transportationvehicle.TransportationTypeId",
                    knex.ref("transportationtype.Name").as('TypeName')
            ).then(function(data){
                element = data[0];
                let type = {};
                type.Name = element.TypeName;
                element['Type'] = type;
                res.send(element);
            });
        }
    }else if (orm == 'TypeORM'){
        if (!reg.test(req.query.id)){
            const vehicleRepository = typeorm.getConnection().getRepository(TypeORMVehicle);
            vehicleRepository.find().then(vehicle => {
                let data = service.capitalizeKeys(vehicle);
                res.send(data);
            });
        }else{
            const vehicleRepository = typeorm.getConnection().getRepository(TypeORMVehicle);
            vehicleRepository.findOne(req.query.id, {relations: ["transportationtype"]}).then(vehicle => {
                let data = service.capitalizeKeys(vehicle);
                res.send(data);
            });
        }
    }else if (orm == 'Bookshelf'){
        if (!reg.test(req.query.id)){
            BookshelfVehicle.fetchAll().then(vehicle => {
                // Send requested vehicle to Client 
                var data = service.capitalizeKeys(vehicle.toJSON());
                res.send(data);
            });
        }else{
            BookshelfVehicle.where('Id', req.query.id).fetchAll({
                withRelated:['transportationtype']
            }).then(vehicle => {
                // Send requested vehicle to Client
                var data = service.capitalizeKeys(vehicle.toJSON()[0]);
                res.send(data);
            });
        }
    }else if (orm == 'Sequelize'){
        if (!reg.test(req.query.id)){
            Vehicle.findAll({
                raw: true, nest: true
            }).then(vehicle => {
                    // Send vehicles to Client
                    var data = service.capitalizeKeys(vehicle);
                    res.send(data);   
            });
        }else{
            Vehicle.findByPk(req.query.id, {
                include: [{
                    model: Type,
                    required: true
                }],
                raw: true,
                nest: true 
            }).then(vehicle => {
                // Send requested Vehicle to Client
                var data = service.capitalizeKeys(vehicle);
                res.send(data);
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


    if (orm == 'Knex'){
        knex("transportationvehicle").insert({
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
    }else if (orm == 'TypeORM'){
        const vehicleRepository = typeorm.getConnection().getRepository(TypeORMVehicle);
        let typeORMVehicle = new TypeORMVehicle();
        typeORMVehicle.name = req.query.name;
        typeORMVehicle.description = req.query.description;
        typeORMVehicle.color = req.query.color;
        typeORMVehicle.productionYear = req.query.productionYear;
        typeORMVehicle.transportationTypeId = req.query.typeSelect;
        vehicleRepository.save(typeORMVehicle).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
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

    if (orm == 'Knex'){
        knex("transportationvehicle").where("Id", req.query.id).update({
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
    }else if (orm == 'TypeORM'){
        const vehicleRepository = typeorm.getConnection().getRepository(TypeORMVehicle);
        let typeORMVehicle = new TypeORMVehicle();
        let id = parseInt(req.query.id);
        typeORMVehicle.id = id;
        typeORMVehicle.name = req.query.name;
        typeORMVehicle.description = req.query.description;
        typeORMVehicle.color = req.query.color;
        typeORMVehicle.productionYear = req.query.productionYear;
        typeORMVehicle.transportationTypeId = req.query.typeSelect;
        vehicleRepository.save(typeORMVehicle).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
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
    
  if (orm == 'Knex'){
    knex('transportationvehicle').where('Id', req.query.id).del().then(function(){
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
}else if (orm == 'TypeORM'){
        const vehicleRepository = typeorm.getConnection().getRepository(TypeORMVehicle);
        vehicleRepository.delete(req.query.id).then(function(){
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
    }else if (orm == 'Bookshelf'){
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