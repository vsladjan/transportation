var express = require("express");
var cookie = require("../helper/cookie.js");
var service = require("../helper/service.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
const typeorm = require('typeorm');
var knex = require("../knexdb.js").getConnection();
var Routestation = db.routestation;
var Station = db.station;
var Route = db.route;
var Vehicle = db.transportationvehicle;
var BookshelfRoutestation = dbBookshelf.Routestation;
var TypeORMRoutestation = require("../models/typeorm/entities/Routestation.js").Routestation;
var ObjRS = require("../models/objection/routestation.js").Routestation;
var mikroDI = require("../mikroormdb.js").DI;
var MRoutestation = require('../models/mikroorm/entities/Routestation.js').Routestation;
var MRoute = require('../models/mikroorm/entities/Route.js').Route;
var MStation = require('../models/mikroorm/entities/Station.js').Station;
var MVehicle = require('../models/mikroorm/entities/Transportationvehicle.js').Transportationvehicle;


var getShow = async function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);

    
    if (orm == 'MikroORM'){
        let rsRepository = mikroDI.em.fork().getRepository(MRoutestation);
        rsRepository.findAll(['Route', 'Station', 'Transportationvehicle']).then(function(data){
            let jsonObj = [];
            data.forEach(element => {
                element.RouteId = element.Route.Id;
                element.StationId = element.Station.Id;
                element.TransportationVehicleId = element.Transportationvehicle.Id;
                jsonObj.push(element);
            });
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.routestation = jsonObj;
            response.message = text;
            res.render("routestation", {routestations:response});
        });
    }else if (orm == 'Objection'){
        ObjRS.query().withGraphFetched(
                'Station'
            ).withGraphFetched(
                'Route'
            ).withGraphFetched(
                'Transportationvehicle'
            ).then(function(data){
                if (req.session.message){
                    text = req.session.message;
                    req.session.message = null;
                }
                var response = {};
                response.routestation = data;
                response.message = text;
                res.render("routestation", {routestations:response});
        });
    }else if (orm == 'Knex'){
        knex("routestation").join("route", "route.Id", "routestation.RouteId").join(
            "station", "station.Id", "routestation.StationId"
        ).join(
            "transportationvehicle", "transportationvehicle.Id", "routestation.TransportationVehicleId"
        ).select(
                "Time", 
                "Type",
                "RouteId",
                "StationId",
                "TransportationVehicleId",
                knex.ref("route.Name").as('RouteName'),
                knex.ref("station.Name").as('StationName'),
                knex.ref("transportationvehicle.Name").as('VehicleName')
        ).then(function(data){
            data.forEach(element => {
                let route = {}, station = {}, vehicle = {};
                route.Name = element.RouteName;
                station.Name = element.StationName;
                vehicle.Name = element.VehicleName;
                element['Route'] = route;
                element['Station'] = station;
                element['Transportationvehicle'] = vehicle;
            });
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.routestation = data;
            response.message = text;
            res.render("routestation", {routestations:response});
        });
    }else if (orm == 'TypeORM'){
        console.log("TypeORM");
        const rsRepository = typeorm.getConnection().getRepository(TypeORMRoutestation);
        rsRepository.find({
            relations: [
                    "station", 
                    "route", 
                    "transportationvehicle"
            ]
        }).then(routestation => {
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.routestation = service.capitalizeKeys(routestation);
            response.message = text;
            res.render("routestation", {routestations:response});
        });
    }else if (orm == 'Bookshelf'){
        BookshelfRoutestation.fetchAll({
            withRelated:['station', 'route', 'transportationvehicle']
        }).then(routestation => {
            // Send all routestation to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.routestation = service.capitalizeKeys(routestation.toJSON());
            response.message = text;
            res.render("routestation", {routestations:response});
        });
    }else if (orm == 'Sequelize'){
        Routestation.findAll({
            include: [
                { model: Station, required: true },
                { model: Route, required: true },
                { model: Vehicle, required: true }
            ],
            raw: true,
            nest: true
        }).then(routestation => {
            // Send all rotuestations to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.routestation = service.capitalizeKeys(routestation);
            response.message = text;
            res.render("routestation", {routestations:response});
        });
    }
}

// Send routestation in JSON
var getRoutestation = function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);
    console.log(orm);
    if (orm == 'MikroORM'){
        if (!reg.test(req.query.routeId)){
            let routestationRepository = mikroDI.em.fork().getRepository(MRoutestation);
            routestationRepository.findAll().then(function(data){
                res.send(data);
            });
        }else{
            let routestationRepository = mikroDI.em.fork().getRepository(MRoutestation);
            routestationRepository.findOne({ $and:[
                {'RouteId': req.query.routeId},
                {'StationId': req.query.stationId},
                {'TransportationVehicleId': req.query.vehicleId},
                {'Time': req.query.time},
            ]},['Route', 'Station', 'Transportationvehicle']).then(function(data){
                let jsonObj = data.toJSON();
                jsonObj.RouteId = data.Route.Id;
                jsonObj.StationId = data.Station.Id;
                jsonObj.TransportationVehicleId = data.Transportationvehicle.Id;
                res.send(jsonObj);
            });
        }
    }else if (orm == 'Objection'){
        if (!reg.test(req.query.routeId)){
            ObjRS.query().then(function(data){
                res.send(data);
            });
        }else{
            ObjRS.query().withGraphFetched(
                'Station'
            ).withGraphFetched(
                'Route'
            ).withGraphFetched(
                'Transportationvehicle'
            ).findById([
                req.query.stationId,
                req.query.routeId,
                req.query.vehicleId,
                req.query.time
            ]).then(function(data){
                res.send(data);
        });
        }
    }else if (orm == 'Knex'){
        if (!reg.test(req.query.routeId)){
            knex("routestation").then(function(data){
                res.send(data);
            });
        }else{
            knex("routestation").where({
                RouteId : req.query.routeId,
                StationId : req.query.stationId,
                TransportationVehicleId : req.query.vehicleId,
                Time: req.query.time
            }).join("route", "route.Id", "routestation.RouteId").join(
                "station", "station.Id", "routestation.StationId"
            ).join(
                "transportationvehicle", "transportationvehicle.Id", "routestation.TransportationVehicleId"
            ).select(
                    "Time", 
                    "Type",
                    "RouteId",
                    "StationId",
                    "TransportationVehicleId",
                    knex.ref("route.Name").as('RouteName'),
                    knex.ref("station.Name").as('StationName'),
                    knex.ref("transportationvehicle.Name").as('VehicleName')
            ).then(function(data){
                    element = data[0];
                    let route = {}, station = {}, vehicle = {};
                    route.Name = element.RouteName;
                    station.Name = element.StationName;
                    vehicle.Name = element.VehicleName;
                    element['Route'] = route;
                    element['Station'] = station;
                    element['Transportationvehicle'] = vehicle;
                    res.send(element);
            });
        }
    }else if (orm == 'TypeORM'){
        if (!reg.test(req.query.routeId)){
            const rsRepository = typeorm.getConnection().getRepository(TypeORMRoutestation);
            rsRepository.find().then(routestation => {
                let data = service.capitalizeKeys(routestation);
                res.send(data);
            });
        }else{
            const rsRepository = typeorm.getConnection().getRepository(TypeORMRoutestation);
            rsRepository.findOne({
                where: { 
                    routeId : req.query.routeId,
                    stationId : req.query.stationId,
                    transportationVehicleId : req.query.vehicleId,
                    time: req.query.time
                },
                relations: [
                        "station", 
                        "route", 
                        "transportationvehicle"
                ]
            }).then(routestation => {
                let data = service.capitalizeKeys(routestation);
                res.send(data);
            });
        }
    }else if (orm == 'Bookshelf'){
        if (!reg.test(req.query.routeId)){
            BookshelfRoutestation.fetchAll().then(routestation => {
                // Send requested Routestation to Client 
                let data = service.capitalizeKeys(routestation.toJSON());
                res.send(data);
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
                var data = service.capitalizeKeys(routestation.toJSON()[0]);
                res.send(data);
            });
        }
    }else if (orm == 'Sequelize'){
        if (!reg.test(req.query.routeId)){
            Routestation.findAll({raw: true, nest: true}).then(routestation => {
                    // Send routestation to Client
                    let data = service.capitalizeKeys(routestation);
                    res.send(data);     
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
                ],
                raw: true,
                nest: true
            }).then(routestation => {
                // Send requested Routestation to Client
                let data = service.capitalizeKeys(routestation[0]);
                res.send(data);
            });
        }
    }
}

// Create routestation
var createRoutestation = async function(req, res){
    if (req.query.type == "" || req.query.time == ""){
          req.query.type = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'MikroORM'){
        let em = mikroDI.em.fork();
        let mRoute =  await em.findOne(MRoute, req.query.routeSelect);
        let mStation =  await em.findOne(MStation, req.query.stationSelect);
        let mVehicle =  await em.findOne(MVehicle, req.query.vehicleSelect);
        let mRoutestation = new MRoutestation();
        mRoutestation.Route = mRoute;
        mRoutestation.Station = mStation;
        mRoutestation.Transportationvehicle = mVehicle;
        mRoutestation.Time = req.query.time;
        mRoutestation.Type = req.query.type;

        em.persistAndFlush(mRoutestation).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Objection'){
        ObjRS.query().insert({
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
    }else if (orm == 'Knex'){
        knex("routestation").insert({
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
    }else if (orm == 'TypeORM'){
        const rsRepository = typeorm.getConnection().getRepository(TypeORMRoutestation);
        let typeORMrs = new TypeORMRoutestation();
        typeORMrs.stationId = req.query.stationSelect;
        typeORMrs.routeId = req.query.routeSelect;
        typeORMrs.transportationVehicleId = req.query.vehicleSelect;
        typeORMrs.time = req.query.time;
        typeORMrs.type = req.query.type ;
        rsRepository.insert(typeORMrs).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
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
var editRoutestation = async function(req, res){
    var response = {};
    if (req.query.type == "" || req.query.time == ""){
        req.query.type = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'MikroORM'){
        let em = mikroDI.em.fork();
        let mRoute =  await em.findOne(MRoute, req.query.routeId);
        let mStation =  await em.findOne(MStation, req.query.stationId);
        let mVehicle =  await em.findOne(MVehicle, req.query.vehicleId);
        let mRoutestation = await em.findOne(
            MRoutestation,
            { $and:[
                {'RouteId': req.query.oldRouteId},
                {'StationId': req.query.oldStationId},
                {'TransportationVehicleId': req.query.oldVehicleId},
                {'Time': req.query.oldTime},
            ]},
            ['Route', 'Station', 'Transportationvehicle']
        );

        await em.remove(mRoutestation);
        mRoutestation = new MRoutestation();
        mRoutestation.Route = mRoute;
        mRoutestation.Station = mStation;
        mRoutestation.Transportationvehicle = mVehicle;
        mRoutestation.Time = req.query.time;
        mRoutestation.Type = req.query.type;
        await em.persist(mRoutestation);

        em.flush().then(function(result){
            response.message = "Record is edited in database.";
            res.send(response);
        }).catch(function(err){
            response.message = "Error when editing data.";
            res.send(response);
        });
    }else if (orm == 'Objection'){
        ObjRS.query().update({
            StationId: req.query.stationId,
            RouteId: req.query.routeId,
            TransportationVehicleId: req.query.vehicleId,
            Time: req.query.time,
            Type: req.query.type
        }).where({
            RouteId : req.query.oldRouteId,
            StationId : req.query.oldStationId,
            TransportationVehicleId : req.query.oldVehicleId,
            Time: req.query.oldTime
        }).then(function(result){
            response.message = "Record is edited in database.";
            res.send(response);
        }).catch(function(err){
            response.message = "Error when editing data.";
            res.send(response);
        });;
    }else if (orm == 'Knex'){
        knex("routestation").where({
            RouteId : req.query.oldRouteId,
            StationId : req.query.oldStationId,
            TransportationVehicleId : req.query.oldVehicleId,
            Time: req.query.oldTime
        }).update({
            StationId: req.query.stationId,
            RouteId: req.query.routeId,
            TransportationVehicleId: req.query.vehicleId,
            Time: req.query.time,
            Type: req.query.type
        }).then(function(result){
            response.message = "Record is edited in database.";
            res.send(response);
        }).catch(function(err){
            response.message = "Error when editing data.";
            res.send(response);
        });
    }else if (orm == 'TypeORM'){
        const rsRepository = typeorm.getConnection().getRepository(TypeORMRoutestation);
        let typeORMrs = new TypeORMRoutestation();
        typeORMrs.stationId = req.query.stationId;
        typeORMrs.routeId = req.query.routeId;
        typeORMrs.transportationVehicleId = req.query.vehicleId;
        typeORMrs.time = req.query.time;
        typeORMrs.type = req.query.type;
        rsRepository.update({
            routeId : req.query.oldRouteId,
            stationId : req.query.oldStationId,
            transportationVehicleId : req.query.oldVehicleId,
            time: req.query.oldTime
        }, typeORMrs).then(function(result){
            response.message = "Record is edited in database.";
            res.send(response);
        }).catch(function(err){
            response.message = "Error when editing data.";
            res.send(response);
        });
    }else if (orm == 'Bookshelf'){
        BookshelfRoutestation.where({
            RouteId : req.query.oldRouteId,
            StationId : req.query.oldStationId,
            TransportationVehicleId : req.query.oldVehicleId,
            Time: req.query.oldTime
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
            response.message = "Record is edited in database.";
            res.send(response);
        }).catch(function(err){
            response.message = "Error when editing data.";
            res.send(response);
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
var deleteRoutestation = async function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'MikroORM'){
        let em = mikroDI.em.fork();
        let mRoutestation = await em.findOne(
            MRoutestation,
            { $and:[
                {'RouteId': req.query.routeId},
                {'StationId': req.query.stationId},
                {'TransportationVehicleId': req.query.vehicleId},
                {'Time': req.query.time},
            ]},
            ['Route', 'Station', 'Transportationvehicle']
        );

        em.remove(mRoutestation);
        em.flush().then(function(){
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
        ObjRS.query().deleteById([
            req.query.stationId,
            req.query.routeId,
            req.query.vehicleId,
            req.query.time
        ]).then(function(){
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
        knex('routestation').where({
            RouteId : req.query.routeId,
            StationId : req.query.stationId,
            TransportationVehicleId : req.query.vehicleId,
            Time: req.query.time
        }).del().then(function(){
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
        const rsRepository = typeorm.getConnection().getRepository(TypeORMRoutestation);
        rsRepository.delete({
                routeId : req.query.routeId,
                stationId : req.query.stationId,
                transportationVehicleId : req.query.vehicleId,
                time: req.query.time 
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
    }else if (orm == 'Bookshelf'){
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