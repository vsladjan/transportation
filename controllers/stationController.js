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
var prisma = require("../prismadb.js").getConnection();


var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'Prisma'){
        prisma.station.findMany({
            include:{
                cityarea: true
            }
        }).then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.station = service.capitalizeKeys(data);
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
    let id = parseInt(req.query.id);

    if (orm == 'Prisma'){
        if (!reg.test(req.query.id)){
            prisma.station.findMany().then(function(data){
                res.send(data);
            });
        }else{
            prisma.station.findOne({
                where: {
                    Id: id
                },
                include:{
                    cityarea: true
                }
            }).then(function(data){
                res.send(service.capitalizeKeys(data));
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
                knex.ref("station.CityareaId").as('CityareaId'),
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
var createStation = function(req, res){
    if (req.query.name == ""){
          req.query.name = null;
          req.session.message = "Error when creating data.";
          res.redirect("show");
          return;
    }
    var orm = cookie.getOrm(req, res);
    let cityareaSelect = parseInt(req.query.cityareaSelect);

    if (orm == 'Prisma'){
        prisma.station.create({
            data:{
                Name: req.query.name,
                Description: req.query.description,
                Location: req.query.location,
                cityarea: {
                    connect:{
                        Id: cityareaSelect
                    }
                }
            }
        }).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Objection'){
        ObjStation.query().insert({
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
    }else if (orm == 'Knex'){
        knex("station").insert({
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
    }else if (orm == 'TypeORM'){
        const stationRepository = typeorm.getConnection().getRepository(TypeORMStation);
        let typeORMStation = new TypeORMStation();
        typeORMStation.name = req.query.name;
        typeORMStation.description = req.query.description;
        typeORMStation.location = req.query.location;
        typeORMStation.cityAreaId = req.query.cityareaSelect;
        stationRepository.save(typeORMStation).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
        BookshelfStation.forge({
            Name: req.query.name,
            Description: req.query.description,
            Location: req.query.location,
            CityAreaId: req.query.cityareaSelect 
        }).save().then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Sequelize'){
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
}

// Edit station
var editStation = function(req, res){
    if (req.query.name == ""){
        req.query.name = null;
        req.session.message = "Error when editing data.";
        res.redirect("show");
        return;
    }
    var orm = cookie.getOrm(req, res);

    let id = parseInt(req.query.id);
    let cityareaSelect = parseInt(req.query.cityareaSelect);

    if (orm == 'Prisma'){
        prisma.station.update({
            where:{
                Id: id
            },
            data:{
                Name: req.query.name,
                Description: req.query.description,
                Location: req.query.location,
                cityarea: {
                    connect:{
                        Id: cityareaSelect
                    }
                }
            }
        }).then(function(result){
            req.session.message = "Record is edited in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when editing data.";
            res.redirect("show");
        });
    }else if (orm == 'Objection'){
        ObjStation.query().update({
            Name: req.query.name,
            Description: req.query.description,
            Location: req.query.location,
            CityAreaId: req.query.cityareaSelect
        }).where({Id: req.query.id}).then(function(result){
            req.session.message = "Record is edited in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when editing data.";
            res.redirect("show");
        });;
    }else if (orm == 'Knex'){
        knex("station").where("Id", req.query.id).update({
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
    }else if (orm == 'TypeORM'){
        const stationRepository = typeorm.getConnection().getRepository(TypeORMStation);
        let typeORMStation = new TypeORMStation();
        let id = parseInt(req.query.id);
        typeORMStation.id = id;
        typeORMStation.name = req.query.name;
        typeORMStation.description = req.query.description;
        typeORMStation.location = req.query.location;
        typeORMStation.cityAreaId = req.query.cityareaSelect;
        stationRepository.save(typeORMStation).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
        BookshelfStation.where({
            Id: req.query.id
        }).save({
            Name: req.query.name,
            Description: req.query.description,
            Location: req.query.location,
            CityAreaId: req.query.cityareaSelect
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
}

// Delete station
var deleteStation = function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
 
    let id = parseInt(req.query.id);
    
    if (orm == 'Prisma'){
        prisma.station.delete({
            where:{
                Id: id
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
    }else if (orm == 'Objection'){
        ObjStation.query().deleteById(req.query.id).then(function(){
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
        knex('station').where('Id', req.query.id).del().then(function(){
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
        const stationRepository = typeorm.getConnection().getRepository(TypeORMStation);
        stationRepository.delete(req.query.id).then(function(){
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
      BookshelfStation.where({
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
}

module.exports.getShow = getShow;
module.exports.getStation = getStation;
module.exports.createStation = createStation;
module.exports.editStation = editStation;
module.exports.deleteStation = deleteStation;