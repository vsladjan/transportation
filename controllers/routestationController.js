var express = require("express");
var cookie = require("../helper/cookie.js");
var service = require("../helper/service.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
const typeorm = require('../typeormdb.js');
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
    let data = {};
    
    if (orm == 'MikroORM'){
        let rsRepository = mikroDI.em.fork().getRepository(MRoutestation);
        let rs = await rsRepository.findAll({
            populate: ['Route', 'Station', 'Transportationvehicle']
        });
        data = [];
        rs.forEach(element => {
            element.RouteId = element.Route.Id;
            element.StationId = element.Station.Id;
            element.TransportationVehicleId = element.Transportationvehicle.Id;
            data.push(element);
        });
    }else if (orm == 'Objection'){
        data = await ObjRS.query().withGraphFetched(
                'Station'
            ).withGraphFetched(
                'Route'
            ).withGraphFetched(
                'Transportationvehicle'
            );
    }else if (orm == 'Knex'){
        data = await knex("routestation").join("route", "route.Id", "routestation.RouteId").join(
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
        );
        data.forEach(element => {
            let route = {}, station = {}, vehicle = {};
            route.Name = element.RouteName;
            station.Name = element.StationName;
            vehicle.Name = element.VehicleName;
            element['Route'] = route;
            element['Station'] = station;
            element['Transportationvehicle'] = vehicle;
        });
    }else if (orm == 'TypeORM'){
        const rsRepository = typeorm.getConnection().getRepository(TypeORMRoutestation);
        data = await rsRepository.find({
            relations: [
                    "station", 
                    "route", 
                    "transportationvehicle"
            ]
        });
        data = service.capitalizeKeys(data);
    }else if (orm == 'Bookshelf'){
        data = await BookshelfRoutestation.fetchAll({
            withRelated:['station', 'route', 'transportationvehicle']
        });
        data = service.capitalizeKeys(data.toJSON());
    }else if (orm == 'Sequelize'){
        data = await Routestation.findAll({
            include: [
                { model: Station, required: true },
                { model: Route, required: true },
                { model: Vehicle, required: true }
            ],
            raw: true,
            nest: true
        });
        data = service.capitalizeKeys(data);
    }
    // Send all rotuestations to Client
    if (req.session.message){
        text = req.session.message;
        req.session.message = null;
    }
    var response = {};
    response.routestation = data;
    response.message = text;
    res.render("routestation", { routestations:response });
}

// Send routestation in JSON
var getRoutestation = async function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);
    let data = {};

    if (orm == 'MikroORM'){
        if (!reg.test(req.query.routeId)){
            let routestationRepository = mikroDI.em.fork().getRepository(MRoutestation);
            data = await routestationRepository.findAll();
        }else{
            let routestationRepository = mikroDI.em.fork().getRepository(MRoutestation);
            let rs = await routestationRepository.findOne({ $and:[
                {'RouteId': req.query.routeId},
                {'StationId': req.query.stationId},
                {'TransportationVehicleId': req.query.vehicleId},
                {'Time': req.query.time},]},
                { populate: ['Route', 'Station', 'Transportationvehicle']}
            );
            data = rs.toJSON();
            data.RouteId = rs.Route.Id;
            data.StationId = rs.Station.Id;
            data.TransportationVehicleId = rs.Transportationvehicle.Id;
        }
    }else if (orm == 'Objection'){
        if (!reg.test(req.query.routeId)){
            data = await ObjRS.query();
        }else{
            data = await ObjRS.query().withGraphFetched(
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
            ]);
        }
    }else if (orm == 'Knex'){
        if (!reg.test(req.query.routeId)){
            data = await knex("routestation");
        }else{
            let rs = await knex("routestation").where({
                RouteId : req.query.routeId,
                StationId : req.query.stationId,
                TransportationVehicleId : req.query.vehicleId,
                Time: req.query.time
            }).join("route", "route.Id", "routestation.RouteId").join(
                "station", "station.Id", "routestation.StationId"
            ).join(
                "transportationvehicle", 
                "transportationvehicle.Id", 
                "routestation.TransportationVehicleId"
            ).select(
                    "Time", 
                    "Type",
                    "RouteId",
                    "StationId",
                    "TransportationVehicleId",
                    knex.ref("route.Name").as('RouteName'),
                    knex.ref("station.Name").as('StationName'),
                    knex.ref("transportationvehicle.Name").as('VehicleName')
            );
            data = rs[0];
            let route = {}, station = {}, vehicle = {};
            route.Name = data.RouteName;
            station.Name = data.StationName;
            vehicle.Name = data.VehicleName;
            data['Route'] = route;
            data['Station'] = station;
            data['Transportationvehicle'] = vehicle;
        }
    }else if (orm == 'TypeORM'){
        if (!reg.test(req.query.routeId)){
            const rsRepository = typeorm.getConnection().getRepository(TypeORMRoutestation);
            data = await rsRepository.find();
            data = service.capitalizeKeys(data);
        }else{
            const rsRepository = typeorm.getConnection().getRepository(TypeORMRoutestation);
            data = await rsRepository.findOne({
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
            });
            data = service.capitalizeKeys(data);
        }
    }else if (orm == 'Bookshelf'){
        if (!reg.test(req.query.routeId)){
            data = await BookshelfRoutestation.fetchAll();
            data = service.capitalizeKeys(data.toJSON());
        }else{
            data = await BookshelfRoutestation.where({
                RouteId : req.query.routeId,
                StationId : req.query.stationId,
                TransportationVehicleId : req.query.vehicleId,
                Time: req.query.time
            }).fetchAll({
                withRelated:['station', 'route', 'transportationvehicle']
            });
            data = service.capitalizeKeys(data.toJSON()[0]);;
        }
    }else if (orm == 'Sequelize'){
        if (!reg.test(req.query.routeId)){
            data = await Routestation.findAll({raw: true, nest: true});
            data = service.capitalizeKeys(data);
        }else{
            data = await Routestation.findAll({
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
            });
            data = service.capitalizeKeys(data[0]);
        }
    }
    // Send requested Routestation to Client
    res.send(data);
}

// Create routestation
var createRoutestation = async function(req, res){
    if (req.body.type == "" || req.body.time == ""){
          req.body.type = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let em = mikroDI.em.fork();
            let mRoute =  await em.findOne(MRoute, req.body.routeSelect);
            let mStation =  await em.findOne(MStation, req.body.stationSelect);
            let mVehicle =  await em.findOne(MVehicle, req.body.vehicleSelect);
            let mRoutestation = new MRoutestation();
            mRoutestation.Route = mRoute;
            mRoutestation.Station = mStation;
            mRoutestation.Transportationvehicle = mVehicle;
            mRoutestation.Time = req.body.time;
            mRoutestation.Type = req.body.type;

            await em.persistAndFlush(mRoutestation);
            req.session.message = "Record is created in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjRS.query().insert({
                StationId: req.body.stationSelect,
                RouteId: req.body.routeSelect,
                TransportationVehicleId: req.body.vehicleSelect,
                Time: req.body.time,
                Type: req.body.type
            });
            req.session.message = "Record is created in database (Objection).";
        }else if (orm == 'Knex'){
            await knex("routestation").insert({
                StationId: req.body.stationSelect,
                RouteId: req.body.routeSelect,
                TransportationVehicleId: req.body.vehicleSelect,
                Time: req.body.time,
                Type: req.body.type 
            });
            req.session.message = "Record is created in database (Knex).";
        }else if (orm == 'TypeORM'){
            const rsRepository = typeorm.getConnection().getRepository(TypeORMRoutestation);
            let typeORMrs = new TypeORMRoutestation();
            typeORMrs.stationId = req.body.stationSelect;
            typeORMrs.routeId = req.body.routeSelect;
            typeORMrs.transportationVehicleId = req.body.vehicleSelect;
            typeORMrs.time = req.body.time;
            typeORMrs.type = req.body.type ;
            await rsRepository.insert(typeORMrs);
            req.session.message = "Record is created in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfRoutestation.forge({
                StationId: req.body.stationSelect,
                RouteId: req.body.routeSelect,
                TransportationVehicleId: req.body.vehicleSelect,
                Time: req.body.time,
                Type: req.body.type 
            }).save(null, {method: "insert"});
            req.session.message = "Record is created in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await Routestation.create({
                StationId: req.body.stationSelect,
                RouteId: req.body.routeSelect,
                TransportationVehicleId: req.body.vehicleSelect,
                Time: req.body.time,
                Type: req.body.type
            });
            req.session.message = "Record is created in database (Sequelize).";
        }
    }catch(err){
        req.session.message = "Error when creating data.";
    }
    res.redirect("show");
}

// Edit Rotuestation
var editRoutestation = async function(req, res){
    var response = {};
    if (req.body.type == "" || req.body.time == ""){
        req.body.type = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let em = mikroDI.em.fork();
            let mRoute =  await em.findOne(MRoute, req.body.routeId);
            let mStation =  await em.findOne(MStation, req.body.stationId);
            let mVehicle =  await em.findOne(MVehicle, req.body.vehicleId);
            let mRoutestation = await em.findOne(
                MRoutestation,
                { $and:[
                    {'RouteId': req.body.oldRouteId},
                    {'StationId': req.body.oldStationId},
                    {'TransportationVehicleId': req.body.oldVehicleId},
                    {'Time': req.body.oldTime},
                ]},
                ['Route', 'Station', 'Transportationvehicle']
            );

            await em.remove(mRoutestation);
            mRoutestation = new MRoutestation();
            mRoutestation.Route = mRoute;
            mRoutestation.Station = mStation;
            mRoutestation.Transportationvehicle = mVehicle;
            mRoutestation.Time = req.body.time;
            mRoutestation.Type = req.body.type;
            await em.persist(mRoutestation);

            await em.flush();
            response.message = "Record is edited in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjRS.query().update({
                StationId: req.body.stationId,
                RouteId: req.body.routeId,
                TransportationVehicleId: req.body.vehicleId,
                Time: req.body.time,
                Type: req.body.type
            }).where({
                RouteId : req.body.oldRouteId,
                StationId : req.body.oldStationId,
                TransportationVehicleId : req.body.oldVehicleId,
                Time: req.body.oldTime
            });
            response.message = "Record is edited in database (Objection).";
        }else if (orm == 'Knex'){
            await knex("routestation").where({
                RouteId : req.body.oldRouteId,
                StationId : req.body.oldStationId,
                TransportationVehicleId : req.body.oldVehicleId,
                Time: req.body.oldTime
            }).update({
                StationId: req.body.stationId,
                RouteId: req.body.routeId,
                TransportationVehicleId: req.body.vehicleId,
                Time: req.body.time,
                Type: req.body.type
            });
            response.message = "Record is edited in database (Knex).";
        }else if (orm == 'TypeORM'){
            const rsRepository = typeorm.getConnection().getRepository(TypeORMRoutestation);
            let typeORMrs = new TypeORMRoutestation();
            typeORMrs.stationId = req.body.stationId;
            typeORMrs.routeId = req.body.routeId;
            typeORMrs.transportationVehicleId = req.body.vehicleId;
            typeORMrs.time = req.body.time;
            typeORMrs.type = req.body.type;
            await rsRepository.update({
                routeId : req.body.oldRouteId,
                stationId : req.body.oldStationId,
                transportationVehicleId : req.body.oldVehicleId,
                time: req.body.oldTime
            }, typeORMrs);
            response.message = "Record is edited in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfRoutestation.where({
                RouteId : req.body.oldRouteId,
                StationId : req.body.oldStationId,
                TransportationVehicleId : req.body.oldVehicleId,
                Time: req.body.oldTime
            }).save({
                StationId: req.body.stationId,
                RouteId: req.body.routeId,
                TransportationVehicleId: req.body.vehicleId,
                Time: req.body.time,
                Type: req.body.type
            },{
                method: 'update',
                patch:true
            });
            response.message = "Record is edited in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await Routestation.update({
                StationId: req.body.stationId,
                RouteId: req.body.routeId,
                TransportationVehicleId: req.body.vehicleId,
                Time: req.body.time,
                Type: req.body.type
            },
            {
                where: {
                    RouteId : req.body.oldRouteId,
                    StationId : req.body.oldStationId,
                    TransportationVehicleId : req.body.oldVehicleId,
                    Time: req.body.oldTime
                },
            });
            response.message = "Record is edited in database (Sequelize).";
        }
    }catch(err){
        response.message = "Error when editing data.";
    }
    res.send(response);
}

// Delete Routestation
var deleteRoutestation = async function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
    
    try{
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
            await em.flush();
            response.message = "Ok";
        }else if (orm == 'Objection'){
            await ObjRS.query().deleteById([
                req.query.stationId,
                req.query.routeId,
                req.query.vehicleId,
                req.query.time
            ]);
            response.message = "Ok";
        }else if (orm == 'Knex'){
            await knex('routestation').where({
                RouteId : req.query.routeId,
                StationId : req.query.stationId,
                TransportationVehicleId : req.query.vehicleId,
                Time: req.query.time
            }).del();
            response.message = "Ok";
        }else if (orm == 'TypeORM'){
            const rsRepository = typeorm.getConnection().getRepository(TypeORMRoutestation);
            await rsRepository.delete({
                    routeId : req.query.routeId,
                    stationId : req.query.stationId,
                    transportationVehicleId : req.query.vehicleId,
                    time: req.query.time 
            });
            response.message = "Ok";
        }else if (orm == 'Bookshelf'){
            await BookshelfRoutestation.where({
                RouteId : req.query.routeId,
                StationId : req.query.stationId,
                TransportationVehicleId : req.query.vehicleId,
                Time: req.query.time
            }).destroy();
            response.message = "Ok";
        }else if (orm == 'Sequelize'){
            await Routestation.destroy({
                where: {
                        RouteId : req.query.routeId,
                        StationId : req.query.stationId,
                        TransportationVehicleId : req.query.vehicleId,
                        Time: req.query.time
                }
            });
            response.message = "Ok";
        }
    }catch(err){
        response.message = "Error when deleting data."
    }
    res.send(response);
}

module.exports.getShow = getShow;
module.exports.getRoutestation = getRoutestation;
module.exports.createRoutestation = createRoutestation;
module.exports.editRoutestation = editRoutestation;
module.exports.deleteRoutestation = deleteRoutestation;