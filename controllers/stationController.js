var express = require("express");
var cookie = require("../helper/cookie.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
var Station = db.station;
var Cityarea = db.cityarea;
var BookshelfStation = dbBookshelf.Station;


var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'Bookshelf'){
        BookshelfStation.fetchAll({withRelated:['cityarea']}).then(station => {
            // Send all stations to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.station = station.toJSON();
            response.message = text;
            res.render("station", {stations:response});
        });
    }else if (orm == 'Sequelize'){
        Station.findAll({
            include: [{
                model: Cityarea,
                required: true
            }]
        }).then(station => {
            // Send all stations to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.station = station;
            response.message = text;
            res.render("station", {stations:response});
        });
    }
}

// Send station in JSON
var getStation = function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        if (!reg.test(req.query.id)){
            BookshelfStation.fetchAll().then(station => {
                // Send requested Stations to Client 
                res.send(station.toJSON());
            });
        }else{
            BookshelfStation.where('Id', req.query.id).fetchAll({
                withRelated:['cityarea']
            }).then(station => {
                // Send requested Station to Client
                res.send(station.toJSON()[0]);
            });
        }
    }else if (orm = 'Sequelize'){
        if (!reg.test(req.query.id)){
            Station.findAll().then(station => {
                    // Send stations to Client
                    res.send(station);    
            });
        }else{
            Station.findByPk(req.query.id, {
                include: [{
                    model: Cityarea,
                    required: true
                }]
            }).then(station => {
                // Send requested Station to Client
                res.send(station.dataValues);
            });
        }
    }
}

// Create station
var createStation = function(req, res){
    if (req.query.name == ""){
          req.query.name = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
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
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
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
    
  if (orm == 'Bookshelf'){
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