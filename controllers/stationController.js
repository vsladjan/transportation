var express = require("express");
var cookie = require("../helper/cookie.js");
var service = require("../helper/service.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
const typeorm = require('typeorm');
var knex = require("../knexdb.js").getConnection();
var Station = db.station;
var Cityarea = db.cityarea;
var BookshelfStation = dbBookshelf.Station;
var TypeORMStation = require("../models/typeorm/entities/Station.js").Station;
var ObjStation = require("../models/objection/station.js").Station;
var mikroDI = require("../mikroormdb.js").DI;
var MStation = require('../models/mikroorm/entities/Station.js').Station;
var MCityarea = require('../models/mikroorm/entities/Cityarea.js').Cityarea;


var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'MikroORM'){
        let stationRepository = mikroDI.em.fork().getRepository(MStation);
        stationRepository.findAll(['Cityarea']).then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.station = data;
            response.message = text;
            res.render("station", {stations:response});
        });
    }else if (orm == 'Objection'){
        ObjStation.query().withGraphFetched('Cityarea').then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.station = data;
            response.message = text;
            res.render("station", {stations:response});
        });
    }else if (orm == 'Knex'){
        knex("station").join("cityarea", "cityarea.Id", "station.CityareaId").select(
                "station.Id", 
                "station.Name", 
                "station.Description", 
                "station.Location", 
                "station.CityareaId",
                knex.ref("cityarea.Name").as('CityareaName')
        ).then(function(data){
            data.forEach(element => {
                let cityarea = {};
                cityarea.Name = element.CityareaName;
                element['Cityarea'] = cityarea;
            });
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.station = data;
            response.message = text;
            res.render("station", {stations:response});
        });
    }else if (orm == 'TypeORM'){
        console.log("TypeORM");
        const stationRepository = typeorm.getConnection().getRepository(TypeORMStation);
        stationRepository.find({relations: ["cityarea"]}).then(station => {
              if (req.session.message){
                  text = req.session.message;
                  req.session.message = null;
              }
              var response = {};
              response.station = service.capitalizeKeys(station);
              response.message = text;
              res.render("station", {stations:response});
        });
    }else if (orm == 'Bookshelf'){
        BookshelfStation.fetchAll({withRelated:['cityarea']}).then(station => {
            // Send all stations to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.station = service.capitalizeKeys(station.toJSON());
            response.message = text;
            res.render("station", {stations:response});
        });
    }else if (orm == 'Sequelize'){
        Station.findAll({
            include: [{
                model: Cityarea,
                required: true
            }],
            raw: true,
            nest: true 
        }).then(station => {
            // Send all stations to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.station = service.capitalizeKeys(station);;
            response.message = text;
            res.render("station", {stations:response});
        });
    }
}

// Send station in JSON
var getStation = function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);

    if (orm == 'MikroORM'){
        if (!reg.test(req.query.id)){
            let stationRepository = mikroDI.em.fork().getRepository(MStation);
            stationRepository.findAll().then(function(data){
                res.send(data);
            });
        }else{
            let stationRepository = mikroDI.em.fork().getRepository(MStation);
            stationRepository.findOne(req.query.id, ['Cityarea']).then(function(data){
                let jsonObj = data.toJSON();
                jsonObj.CityAreaId = data.Cityarea.Id;
                res.send(jsonObj);
            });
        }
    }else if (orm == 'Objection'){
        if (!reg.test(req.query.id)){
            ObjStation.query().then(function(data){
                res.send(data);
            });
        }else{
            ObjStation.query().withGraphFetched('Cityarea').findById(req.query.id).then(function(data){
                res.send(data);
            });
        }
    }else if (orm == 'Knex'){
        if (!reg.test(req.query.id)){
            knex("station").then(function(data){
                res.send(data);
            });
        }else{
            knex("station").where('station.Id', req.query.id).join(
                "cityarea", "cityarea.Id", "station.CityareaId").select(
                "station.Id", 
                "station.Name", 
                "station.Description", 
                "station.Location", 
                knex.ref("station.CityareaId").as('CityAreaId'),
                knex.ref("cityarea.Name").as('CityareaName')
            ).then(function(data){
                element = data[0];
                let cityarea = {};
                cityarea.Name = element.CityareaName;
                element['Cityarea'] = cityarea;
                res.send(element);
            });
        }
    }else if (orm == 'TypeORM'){
        if (!reg.test(req.query.id)){
            const stationRepository = typeorm.getConnection().getRepository(TypeORMStation);
            stationRepository.find().then(station => {
                let data = service.capitalizeKeys(station);
                res.send(data);
            });
        }else{
            const stationRepository = typeorm.getConnection().getRepository(TypeORMStation);
            stationRepository.findOne(req.query.id, {relations: ["cityarea"]}).then(station => {
                let data = service.capitalizeKeys(station);
                res.send(data);
            });
        }
    }else  if (orm == 'Bookshelf'){
        if (!reg.test(req.query.id)){
            BookshelfStation.fetchAll().then(station => {
                // Send requested Stations to Client 
                let data = service.capitalizeKeys(station.toJSON());
                res.send(data);
            });
        }else{
            BookshelfStation.where('Id', req.query.id).fetchAll({
                withRelated:['cityarea']
            }).then(station => {
                // Send requested Station to Client
                var data = service.capitalizeKeys(station.toJSON()[0]);
                res.send(data);
            });
        }
    }else if (orm == 'Sequelize'){
        if (!reg.test(req.query.id)){
            Station.findAll({raw: true, nest: true}).then(station => {
                    // Send stations to Client
                    let data = service.capitalizeKeys(station);
                    res.send(data);       
            });
        }else{
            Station.findByPk(req.query.id, {
                include: [{
                    model: Cityarea,
                    required: true
                }],
                raw: true,
                nest: true
            }).then(station => {
                // Send requested Station to Client
                let data = service.capitalizeKeys(station);
                res.send(data);
            });
        }
    }
}

// Create station
var createStation = async function(req, res){
    if (req.body.name == ""){
          req.body.name = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let em = mikroDI.em.fork();
            let mCityarea =  await em.findOne(MCityarea, req.body.cityareaSelect);
            let mStation = new MStation(
                req.body.name,
                req.body.description,
                req.body.location
            );
            mStation.Cityarea = mCityarea;
            await em.persistAndFlush(mStation);
            req.session.message = "Record is created in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjStation.query().insert({
                Name: req.body.name,
                Description: req.body.description,
                Location: req.body.location,
                CityAreaId: req.body.cityareaSelect 
            });
            req.session.message = "Record is created in database (Objection).";
        }else if (orm == 'Knex'){
            await knex("station").insert({
                Name: req.body.name,
                Description: req.body.description,
                Location: req.body.location,
                CityAreaId: req.body.cityareaSelect 
            });
            req.session.message = "Record is created in database (Knex).";
        }else if (orm == 'TypeORM'){
            const stationRepository = typeorm.getConnection().getRepository(TypeORMStation);
            let typeORMStation = new TypeORMStation();
            typeORMStation.name = req.body.name;
            typeORMStation.description = req.body.description;
            typeORMStation.location = req.body.location;
            typeORMStation.cityAreaId = req.body.cityareaSelect;
            await stationRepository.save(typeORMStation);
            req.session.message = "Record is created in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfStation.forge({
                Name: req.body.name,
                Description: req.body.description,
                Location: req.body.location,
                CityAreaId: req.body.cityareaSelect 
            }).save();
            req.session.message = "Record is created in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await Station.create({
                Name: req.body.name,
                Description: req.body.description,
                Location: req.body.location,
                CityAreaId: req.body.cityareaSelect
            });
            req.session.message = "Record is created in database (Sequelize).";
        }
    }catch(err){
        req.session.message = "Error when creating data.";
    }
    res.redirect("show");
}

// Edit station
var editStation = async function(req, res){
    if (req.body.name == ""){
        req.body.name = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let em = mikroDI.em.fork();
            let mStation = await em.findOne(MStation, req.body.id);
            let mCityarea = await em.findOne(MCityarea, req.body.cityareaSelect);
            mStation.Name = req.body.name;
            mStation.Description = req.body.description;
            mStation.Location = req.body.location
            mStation.CityareId = req.body.cityareaSelect;
            mStation.Cityarea = mCityarea;
            await em.flush(mStation);
            req.session.message = "Record is edited in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjStation.query().update({
                Name: req.body.name,
                Description: req.body.description,
                Location: req.body.location,
                CityAreaId: req.body.cityareaSelect
            }).where({Id: req.body.id});
            req.session.message = "Record is edited in database (Objection).";
        }else if (orm == 'Knex'){
            await knex("station").where("Id", req.body.id).update({
                Name: req.body.name,
                Description: req.body.description,
                Location: req.body.location,
                CityAreaId: req.body.cityareaSelect
            });
            req.session.message = "Record is edited in database (Knex).";
        }else if (orm == 'TypeORM'){
            const stationRepository = typeorm.getConnection().getRepository(TypeORMStation);
            let typeORMStation = new TypeORMStation();
            let id = parseInt(req.body.id);
            typeORMStation.id = id;
            typeORMStation.name = req.body.name;
            typeORMStation.description = req.body.description;
            typeORMStation.location = req.body.location;
            typeORMStation.cityAreaId = req.body.cityareaSelect;
            await stationRepository.save(typeORMStation);
            req.session.message = "Record is edited in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfStation.where({
                Id: req.body.id
            }).save({
                Name: req.body.name,
                Description: req.body.description,
                Location: req.body.location,
                CityAreaId: req.body.cityareaSelect
            },{
                method: 'update',
                patch:true
            });
            req.session.message = "Record is edited in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await Station.update({
                Name: req.body.name,
                Description: req.body.description,
                Location: req.body.location,
                CityAreaId: req.body.cityareaSelect
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

// Delete station
var deleteStation = async function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
 
    try{
        if (orm == 'MikroORM'){
            let stationRepository = mikroDI.em.fork().getRepository(MStation);
            let record = await stationRepository.findOne(req.query.id);
            await stationRepository.removeAndFlush(record);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Objection'){
            await ObjStation.query().deleteById(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Knex'){
            await knex('station').where('Id', req.query.id).del();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'TypeORM'){
            const stationRepository = typeorm.getConnection().getRepository(TypeORMStation);
            await stationRepository.delete(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Bookshelf'){
            await BookshelfStation.where({
                Id: req.query.id
            }).destroy();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Sequelize'){
            await Station.destroy({
                    where: {
                        Id : req.query.id
                    }
            });
            response.message = "Ok";
            response.id = req.query.id;
        }
    }catch(err){
        if (err.errno == 1451 || err.name.includes('Foreign'))
            response.message = "There are Routestations that have this Station included, please delete them first!";
        else
            response.message = "Error when deleting data."
    }
    res.send(response);
}

module.exports.getShow = getShow;
module.exports.getStation = getStation;
module.exports.createStation = createStation;
module.exports.editStation = editStation;
module.exports.deleteStation = deleteStation;