var express = require("express");
var cookie = require("../helper/cookie.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
var TransportationType = db.transportationtype;
var BookshelfTransportationtype = dbBookshelf.Transportationtype;


// Show all types
var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'Bookshelf'){
        BookshelfTransportationtype.fetchAll().then(type => {
            // Send all types to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.type = type.toJSON();
            response.message = text;
            res.render("type", {types:response});
        });
    }else if (orm == 'Sequelize'){
        TransportationType.findAll().then(type => {
            // Send all types to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.type = type;
            response.message = text;
            res.render("type", {types:response});
        });
    }
}


// Send type in JSON
var getType = function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        if (!reg.test(req.query.id)){
            BookshelfTransportationtype.fetchAll().then(type => {
                // Send requested type to Client 
                res.send(type.toJSON());
            });
        }else{
            BookshelfTransportationtype.where('Id', req.query.id).fetchAll({
            }).then(type => {
                // Send requested type to Client
                res.send(type.toJSON()[0]);
            });
        }
    }else if (orm = 'Sequelize'){
        if (!reg.test(req.query.id)){
            TransportationType.findAll().then(type => {
                    // Send types to Client
                    res.send(type);    
            });
        }else{
            TransportationType.findByPk(req.query.id).then(type => {
                    // Send requested type to Client
                    res.send(type.dataValues);
            });
        }
    }
}

// Create transportation type
var createType = function(req, res){
    if (req.query.name == ""){
        req.query.name = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        BookshelfTransportationtype.forge({
            Name: req.query.name
        }).save().then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Sequelize'){
        TransportationType.create({
            Name: req.query.name
        }).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }
}

// Edit transportation type
var editType = function(req, res){
    if (req.query.name == ""){
        req.query.name = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        BookshelfTransportationtype.where({
            Id: req.query.id
        }).save({
            Name: req.query.name
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
        TransportationType.update({
            Name: req.query.name
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

// Delete type
var deleteType = function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'Bookshelf'){
        BookshelfTransportationtype.where({
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
            TransportationType.destroy({
                  where: {
                        Id : req.query.id
                  }
            }).then(function(){
                  response.message = "Ok";
                  response.id = req.query.id;
                  res.send(response);
            }).catch(function(err){
                  if (err.name == "SequelizeForeignKeyConstraintError")
                        response.message = "There are Vehicles that are this type, please delete them first!";
                  else
                        response.message = "Error when deleting data."
                  res.send(response);
            });
    }
}


module.exports.createType = createType;
module.exports.getShow = getShow;
module.exports.getType = getType;
module.exports.editType = editType;
module.exports.deleteType = deleteType;