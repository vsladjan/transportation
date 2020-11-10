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
var ObjVehicle = require("../models/objection/transportationvehicle").Transportationvehicle;
var mikroDI = require("../mikroormdb.js").DI;
var MVehicle = require('../models/mikroorm/entities/Transportationvehicle.js').Transportationvehicle;
var MType = require('../models/mikroorm/entities/Transportationtype.js').Transportationtype;

var getShow = async function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'MikroORM'){
        let vehicleRepository = mikroDI.em.fork().getRepository(MVehicle);
        vehicleRepository.findAll(['Transportationtype']).then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.vehicle = data;
            response.message = text;
            res.render("vehicle", {vehicles:response});
        });
    }else if (orm == 'Objection'){
        ObjVehicle.query().withGraphFetched('Transportationtype').then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.vehicle = data;
            response.message = text;
            res.render("vehicle", {vehicles:response});
        });
    }else if (orm == 'Knex'){
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

    if (orm == 'MikroORM'){
        if (!reg.test(req.query.id)){
            let vehicleRepository = mikroDI.em.fork().getRepository(MVehicle);
            vehicleRepository.findAll().then(function(data){
                res.send(data);
            });
        }else{
            let vehicleRepository = mikroDI.em.fork().getRepository(MVehicle);
            vehicleRepository.findOne(req.query.id, ['Transportationtype']).then(function(data){
                let jsonObj = data.toJSON();
                jsonObj.TransportationTypeId = data.Transportationtype.Id;
                res.send(jsonObj);
            });
        }
    }else if (orm == 'Objection'){
        if (!reg.test(req.query.id)){
            ObjVehicle.query().then(function(data){
                res.send(data);
            });
        }else{
            ObjVehicle.query().withGraphFetched('Transportationtype').findById(req.query.id).then(function(data){
                res.send(data);
            });
        }
    }else if (orm == 'Knex'){
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
var createVehicle = async function(req, res){
    if (req.body.name == ""){
          req.body.name = null;
    }
    var orm = cookie.getOrm(req, res);


    if (orm == 'MikroORM'){
        let em = mikroDI.em.fork();
        let mType =  await em.findOne(MType, req.body.typeSelect);
        let mVehicle = new MVehicle(
            req.body.name,
            req.body.description,
            req.body.color,
            req.body.productionYear
        );
        mVehicle.Transportationtype = mType;
        em.persistAndFlush(mVehicle).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Objection'){
        ObjVehicle.query().insert({
            Name: req.body.name,
            Description: req.body.description,
            Color: req.body.color,
            ProductionYear: req.body.productionYear,
            TransportationTypeId: req.body.typeSelect
        }).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Knex'){
        knex("transportationvehicle").insert({
            Name: req.body.name,
            Description: req.body.description,
            Color: req.body.color,
            ProductionYear: req.body.productionYear,
            TransportationTypeId: req.body.typeSelect
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
        typeORMVehicle.name = req.body.name;
        typeORMVehicle.description = req.body.description;
        typeORMVehicle.color = req.body.color;
        typeORMVehicle.productionYear = req.body.productionYear;
        typeORMVehicle.transportationTypeId = req.body.typeSelect;
        vehicleRepository.save(typeORMVehicle).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
        BookshelfVehicle.forge({
            Name: req.body.name,
            Description: req.body.description,
            Color: req.body.color,
            ProductionYear: req.body.productionYear,
            TransportationTypeId: req.body.typeSelect
        }).save().then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Sequelize'){
        Vehicle.create({
            Name: req.body.name,
            Description: req.body.description,
            Color: req.body.color,
            ProductionYear: req.body.productionYear,
            TransportationTypeId: req.body.typeSelect
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
var editVehicle = async function(req, res){
    if (req.body.name == ""){
        req.body.name = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'MikroORM'){
        let em = mikroDI.em.fork();
        let mVehicle = await em.findOne(MVehicle, req.body.id);
        let mType = await em.findOne(MType, req.body.typeSelect);
        mVehicle.Name = req.body.name;
        mVehicle.Description = req.body.description;
        mVehicle.Color = req.body.color
        mVehicle.ProductionYear = req.body.productionYear;
        mVehicle.Transportationtype = mType;
        em.flush(mVehicle).then(function(result){
            req.session.message = "Record is edited in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when editing data.";
            res.redirect("show");
        });
    }else if (orm == 'Objection'){
        ObjVehicle.query().update({
            Name: req.body.name,
            Description: req.body.description,
            Color: req.body.color,
            ProductionYear: req.body.productionYear,
            TransportationTypeId: req.body.typeSelect
        }).where({Id: req.body.id}).then(function(result){
            req.session.message = "Record is edited in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when editing data.";
            res.redirect("show");
        });;
    }else if (orm == 'Knex'){
        knex("transportationvehicle").where("Id", req.body.id).update({
            Name: req.body.name,
            Description: req.body.description,
            Color: req.body.color,
            ProductionYear: req.body.productionYear,
            TransportationTypeId: req.body.typeSelect
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
        let id = parseInt(req.body.id);
        typeORMVehicle.id = id;
        typeORMVehicle.name = req.body.name;
        typeORMVehicle.description = req.body.description;
        typeORMVehicle.color = req.body.color;
        typeORMVehicle.productionYear = req.body.productionYear;
        typeORMVehicle.transportationTypeId = req.body.typeSelect;
        vehicleRepository.save(typeORMVehicle).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
        BookshelfVehicle.where({
            Id: req.body.id
        }).save({
            Name: req.body.name,
            Description: req.body.description,
            Color: req.body.color,
            ProductionYear: req.body.productionYear,
            TransportationTypeId: req.body.typeSelect
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
            Name: req.body.name,
            Description: req.body.description,
            Color: req.body.color,
            ProductionYear: req.body.productionYear,
            TransportationTypeId: req.body.typeSelect
        },
        {
            where: {Id: req.body.id}
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
var deleteVehicle = async function(req, res){
  var response = {};
  var orm = cookie.getOrm(req, res);
    
    if (orm == 'MikroORM'){
        let vehicleRepository = mikroDI.em.fork().getRepository(MVehicle);
        let record = await vehicleRepository.findOne(req.query.id);
        vehicleRepository.removeAndFlush(record).then(function(){
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
    }else if (orm == 'Objection'){
        ObjVehicle.query().deleteById(req.query.id).then(function(){
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
    }else if (orm == 'Knex'){
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