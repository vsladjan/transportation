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

    try{
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
            await em.persistAndFlush(mVehicle);
            req.session.message = "Record is created in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjVehicle.query().insert({
                Name: req.body.name,
                Description: req.body.description,
                Color: req.body.color,
                ProductionYear: req.body.productionYear,
                TransportationTypeId: req.body.typeSelect
            });
            req.session.message = "Record is created in database (Objection).";
        }else if (orm == 'Knex'){
            await knex("transportationvehicle").insert({
                Name: req.body.name,
                Description: req.body.description,
                Color: req.body.color,
                ProductionYear: req.body.productionYear,
                TransportationTypeId: req.body.typeSelect
            });
            req.session.message = "Record is created in database (Knex).";
        }else if (orm == 'TypeORM'){
            const vehicleRepository = typeorm.getConnection().getRepository(TypeORMVehicle);
            let typeORMVehicle = new TypeORMVehicle();
            typeORMVehicle.name = req.body.name;
            typeORMVehicle.description = req.body.description;
            typeORMVehicle.color = req.body.color;
            typeORMVehicle.productionYear = req.body.productionYear;
            typeORMVehicle.transportationTypeId = req.body.typeSelect;
            await vehicleRepository.save(typeORMVehicle);
            req.session.message = "Record is created in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfVehicle.forge({
                Name: req.body.name,
                Description: req.body.description,
                Color: req.body.color,
                ProductionYear: req.body.productionYear,
                TransportationTypeId: req.body.typeSelect
            }).save();
            req.session.message = "Record is created in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await Vehicle.create({
                Name: req.body.name,
                Description: req.body.description,
                Color: req.body.color,
                ProductionYear: req.body.productionYear,
                TransportationTypeId: req.body.typeSelect
            });
            req.session.message = "Record is created in database (Sequelize).";
        }
    }catch(err){
        req.session.message = "Error when creating data.";
    }
    res.redirect("show");
}

// Edit Vehicle
var editVehicle = async function(req, res){
    if (req.body.name == ""){
        req.body.name = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let em = mikroDI.em.fork();
            let mVehicle = await em.findOne(MVehicle, req.body.id);
            let mType = await em.findOne(MType, req.body.typeSelect);
            mVehicle.Name = req.body.name;
            mVehicle.Description = req.body.description;
            mVehicle.Color = req.body.color
            mVehicle.ProductionYear = req.body.productionYear;
            mVehicle.Transportationtype = mType;
            await em.flush(mVehicle);
            req.session.message = "Record is edited in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjVehicle.query().update({
                Name: req.body.name,
                Description: req.body.description,
                Color: req.body.color,
                ProductionYear: req.body.productionYear,
                TransportationTypeId: req.body.typeSelect
            }).where({Id: req.body.id});
            req.session.message = "Record is edited in database (Objection).";
        }else if (orm == 'Knex'){
            await knex("transportationvehicle").where("Id", req.body.id).update({
                Name: req.body.name,
                Description: req.body.description,
                Color: req.body.color,
                ProductionYear: req.body.productionYear,
                TransportationTypeId: req.body.typeSelect
            });
            req.session.message = "Record is edited in database (Knex).";
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
            await vehicleRepository.save(typeORMVehicle);
            req.session.message = "Record is edited in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfVehicle.where({
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
            });
            req.session.message = "Record is edited in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await Vehicle.update({
                Name: req.body.name,
                Description: req.body.description,
                Color: req.body.color,
                ProductionYear: req.body.productionYear,
                TransportationTypeId: req.body.typeSelect
            },
            {
                where: {Id: req.body.id}
            });
            req.session.message = "Record is edited in database (Sequelize).";
        }
    }catch(err){
        req.session.message = "Error when editing data.";
    }
    res.redirect("show");
}

// Delete Vehicle
var deleteVehicle = async function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
    
    try{
        if (orm == 'MikroORM'){
            let vehicleRepository = mikroDI.em.fork().getRepository(MVehicle);
            let record = await vehicleRepository.findOne(req.query.id);
            await vehicleRepository.removeAndFlush(record);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Objection'){
            await ObjVehicle.query().deleteById(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Knex'){
            await knex('transportationvehicle').where('Id', req.query.id).del();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'TypeORM'){
            const vehicleRepository = typeorm.getConnection().getRepository(TypeORMVehicle);
            await vehicleRepository.delete(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Bookshelf'){
            await BookshelfVehicle.where({
                Id: req.query.id
            }).destroy();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Sequelize'){
            await Vehicle.destroy({
                    where: {
                        Id : req.query.id
                    }
            });
            response.message = "Ok";
            response.id = req.query.id;
        }
    }catch(err){
        if (err.errno == 1451 || err.name.includes('Foreign'))
            response.message = "There are Routestations that have this Vehicle included, please delete them first!";
        else
            response.message = "Error when deleting data."
    }
    res.send(response);
}

module.exports.getShow = getShow;
module.exports.getVehicle = getVehicle;
module.exports.createVehicle = createVehicle;
module.exports.editVehicle = editVehicle;
module.exports.deleteVehicle = deleteVehicle;