var express = require("express");
var cookie = require("../helper/cookie.js");
var service = require("../helper/service.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
const typeorm = require('typeorm');
var knex = require("../knexdb.js").getConnection();
var Route = db.route;
var BookshelfRoute = dbBookshelf.Route;
var TypeORMRoute = require("../models/typeorm/entities/Route.js").Route;
var ObjRoute = require("../models/objection/route.js").Route;
var mikroDI = require("../mikroormdb.js").DI;
var MRoute = require('../models/mikroorm/entities/Route.js').Route;


var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'MikroORM'){
        let routeRepository = mikroDI.em.fork().getRepository(MRoute);
        routeRepository.findAll().then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.route = data;
            response.message = text;
            res.render("route", {routes:response});
        });
    }else if (orm == 'Objection'){
        ObjRoute.query().then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.route = data;
            response.message = text;
            res.render("route", {routes:response});
        });
    }else if (orm == 'Knex'){
        knex("route").then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.route = data;
            response.message = text;
            res.render("route", {routes:response});
        });
    }else if (orm == 'TypeORM'){
        console.log("TypeORM");
        const routeRepository = typeorm.getConnection().getRepository(TypeORMRoute);
        routeRepository.find().then(route => {
              if (req.session.message){
                  text = req.session.message;
                  req.session.message = null;
              }
              var response = {};
              response.route = service.capitalizeKeys(route);
              response.message = text;
              res.render("route", {routes:response});
        });
    }else if (orm == 'Bookshelf'){
        BookshelfRoute.fetchAll().then(route => {
            // Send all routes to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.route = service.capitalizeKeys(route.toJSON());
            response.message = text;
            res.render("route", {routes:response});
        });
    }else if (orm == 'Sequelize'){
        Route.findAll({raw: true, nest: true}).then(route => {
            // Send all routes to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.route = service.capitalizeKeys(route);
            response.message = text;
            res.render("route", {routes:response});
        });
    }
}

// Send route in JSON
var getRoute = function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);

    if (orm == 'MikroORM'){
        if (!reg.test(req.query.id)){
            let routeRepository = mikroDI.em.fork().getRepository(MRoute);
            routeRepository.findAll().then(function(data){
                res.send(data);
            });
        }else{
            let routeRepository = mikroDI.em.fork().getRepository(MRoute);
            routeRepository.findOne(req.query.id).then(function(data){
                res.send(data);
            });
        }
    }else if (orm == 'Objection'){
        if (!reg.test(req.query.id)){
            ObjRoute.query().then(function(data){
                res.send(data);
            });
        }else{
            ObjRoute.query().findById(req.query.id).then(function(data){
                res.send(data);
            });
        }
    }else if (orm == 'Knex'){
        if (!reg.test(req.query.id)){
            knex("route").then(function(data){
                res.send(data);
            });
        }else{
            knex("route").where('route.Id', req.query.id).then(function(data){
                let element = data[0];
                res.send(element);
            });
        }
    }else if (orm == 'TypeORM'){
        if (!reg.test(req.query.id)){
            const routeRepository = typeorm.getConnection().getRepository(TypeORMRoute);
            routeRepository.find().then(route => {
                let data = service.capitalizeKeys(route);
                res.send(data);
            });
        }else{
            const routeRepository = typeorm.getConnection().getRepository(TypeORMRoute);
            routeRepository.findOne(req.query.id).then(route => {
                let data = service.capitalizeKeys(route);
                res.send(data);
            });
        }
    }else if (orm == 'Bookshelf'){
        if (!reg.test(req.query.id)){
            BookshelfRoute.fetchAll().then(route => {
                // Send requested Route to Client 
                let data = service.capitalizeKeys(route.toJSON());
                res.send(data);
            });
        }else{
            BookshelfRoute.where('Id', req.query.id).fetchAll().then(route => {
                // Send requested route to Client
                var data = service.capitalizeKeys(route.toJSON()[0]);
                res.send(data);
            });
        }
    }else if (orm == 'Sequelize'){
        if (!reg.test(req.query.id)){
            Route.findAll({raw: true, nest: true}).then(route => {
                    // Send routes to Client
                    let data = service.capitalizeKeys(route);
                    res.send(data);    
            });
        }else{
            Route.findByPk(req.query.id, {raw: true, nest: true}).then(route => {
                // Send requested route to Client
                let data = service.capitalizeKeys(route);
                res.send(data);
            });
        }
    }
}

// Create route
var createRoute = async function(req, res){
    if (req.body.name == ""){
          req.body.name = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let em = mikroDI.em.fork();
            let mRoute = new MRoute(
                req.body.name,
                req.body.description
            );
            await em.persistAndFlush(mRoute);
            req.session.message = "Record is created in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjRoute.query().insert({
                Name: req.body.name,
                Description: req.body.description 
            });
            req.session.message = "Record is created in database (Objection).";
        }else if (orm == 'Knex'){
            await knex("route").insert({
                Name: req.body.name,
                Description: req.body.description 
            });
            req.session.message = "Record is created in database (Knex).";
        }else if (orm == 'TypeORM'){
            const routeRepository = typeorm.getConnection().getRepository(TypeORMRoute);
            let typeORMRoute = new TypeORMRoute();
            typeORMRoute.name = req.body.name;
            typeORMRoute.description = req.body.description;
            await routeRepository.save(typeORMRoute);
            req.session.message = "Record is created in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfRoute.forge({
                Name: req.body.name,
                Description: req.body.description 
            }).save();
            req.session.message = "Record is created in database (MikroORM).";
        }else if (orm == 'Sequelize'){
            await Route.create({
                Name: req.body.name,
                Description: req.body.description
            });
            req.session.message = "Record is created in database (Sequelize).";
        }
    }catch(err){
        req.session.message = "Error when creating data.";
    }
    res.redirect("show");
}

// Edit Route
var editRoute = async function(req, res){
    if (req.body.name == ""){
        req.body.name = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let em = mikroDI.em.fork();
            let mRoute = await em.findOne(MRoute, req.body.id);
            mRoute.Name = req.body.name;
            mRoute.Description = req.body.description;
            await em.flush(mRoute);
            req.session.message = "Record is edited in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjRoute.query().update({
                Name: req.body.name,
                Description: req.body.description
            }).where({Id: req.body.id});
            req.session.message = "Record is edited in database (Objection).";
        }else if (orm == 'Knex'){
            await knex("route").where("Id", req.body.id).update({
                Name: req.body.name,
                Description: req.body.description
            });
            req.session.message = "Record is edited in database (Knex).";
        }else if (orm == 'TypeORM'){
            const routeRepository = typeorm.getConnection().getRepository(TypeORMRoute);
            let id = parseInt(req.body.id);
            let typeORMRoute = new TypeORMRoute();
            typeORMRoute.id = id;
            typeORMRoute.name = req.body.name;
            typeORMRoute.description = req.body.description;
            await routeRepository.save(typeORMRoute);
            req.session.message = "Record is edited in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfRoute.where({
                Id: req.body.id
            }).save({
                Name: req.body.name,
                Description: req.body.description
            },{
                method: 'update',
                patch:true
            });
            req.session.message = "Record is edited in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await Route.update({
                Name: req.body.name,
                Description: req.body.description
            },
            {
                where: {Id: req.body.id}
            });
            req.session.message = "Record is edited in database (Bookshelf).";
        }
    }catch(err){
        req.session.message = "Error when editing data.";
    }
    res.redirect("show");
}

// Delete Route
var deleteRoute = async function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
    
    try{
        if (orm == 'MikroORM'){
            let routeRepository = mikroDI.em.fork().getRepository(MRoute);
            let record = await routeRepository.findOne(req.query.id);
            await routeRepository.removeAndFlush(record);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Objection'){
            await ObjRoute.query().deleteById(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Knex'){
            await knex('route').where('Id', req.query.id).del();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'TypeORM'){
            const routeRepository = typeorm.getConnection().getRepository(TypeORMRoute);
            await routeRepository.delete(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Bookshelf'){
            await BookshelfRoute.where({
                Id: req.query.id
            }).destroy();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Sequelize'){
            await Route.destroy({
                    where: {
                        Id : req.query.id
                    }
            });
            response.message = "Ok";
            response.id = req.query.id;
        }
    }catch(err){
        if (err.errno == 1451 || err.name.includes('Foreign'))
            response.message = "There are Routestations that have this Route included, please delete them first!";
        else
            response.message = "Error when deleting data."
    }
    res.send(response);
}

module.exports.getShow = getShow;
module.exports.getRoute = getRoute;
module.exports.createRoute = createRoute;
module.exports.editRoute = editRoute;
module.exports.deleteRoute = deleteRoute;
