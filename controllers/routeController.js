var express = require("express");
var cookie = require("../helper/cookie.js");
var service = require("../helper/service.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
const typeorm = require('typeorm');
var Route = db.route;
var BookshelfRoute = dbBookshelf.Route;
var TypeORMRoute = require("../models/typeorm/entities/Route.js").Route;


var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'TypeORM'){
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

    if (orm == 'TypeORM'){
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
    }else if (orm = 'Sequelize'){
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
var createRoute = function(req, res){
    if (req.query.name == ""){
          req.query.name = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'TypeORM'){
        const routeRepository = typeorm.getConnection().getRepository(TypeORMRoute);
        let typeORMRoute = new TypeORMRoute();
        typeORMRoute.name = req.query.name;
        typeORMRoute.description = req.query.description;
        routeRepository.save(typeORMRoute).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
        BookshelfRoute.forge({
            Name: req.query.name,
            Description: req.query.description 
        }).save().then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Sequelize'){
        Route.create({
            Name: req.query.name,
            Description: req.query.description
        }).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }
}

// Edit Route
var editRoute = function(req, res){
    if (req.query.name == ""){
        req.query.name = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'TypeORM'){
        const routeRepository = typeorm.getConnection().getRepository(TypeORMRoute);
        let id = parseInt(req.query.id);
        let typeORMRoute = new TypeORMRoute();
        typeORMRoute.id = id;
        typeORMRoute.name = req.query.name;
        typeORMRoute.description = req.query.description;
        routeRepository.save(typeORMRoute).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
        BookshelfRoute.where({
            Id: req.query.id
        }).save({
            Name: req.query.name,
            Description: req.query.description
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
        Route.update({
            Name: req.query.name,
            Description: req.query.description
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

// Delete Route
var deleteRoute = function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'TypeORM'){
        const routeRepository = typeorm.getConnection().getRepository(TypeORMRoute);
        routeRepository.delete(req.query.id).then(function(){
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
        BookshelfRoute.where({
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
        Route.destroy({
                where: {
                    Id : req.query.id
                }
        }).then(function(){
                response.message = "Ok";
                response.id = req.query.id;
                res.send(response);
        }).catch(function(err){
                if (err.name == "SequelizeForeignKeyConstraintError")
                    response.message = "Delete route stations before removing route!";
                else
                    response.message = "Error when deleting data."
                res.send(response);
        });
    }
}

module.exports.getShow = getShow;
module.exports.getRoute = getRoute;
module.exports.createRoute = createRoute;
module.exports.editRoute = editRoute;
module.exports.deleteRoute = deleteRoute;
