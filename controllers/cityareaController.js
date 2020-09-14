var express = require("express");
var cookie = require("../helper/cookie.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
var Cityarea = db.cityarea;
var City = db.city;
var BookshelfCityarea = dbBookshelf.Cityarea;


var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        console.log("Bookshelf");
        BookshelfCityarea.fetchAll({withRelated:['city']}).then(cityarea => {
            // Send all cities to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.cityarea = cityarea.toJSON();
            response.message = text;
            res.render("cityarea", {cityareas:response});
        });
    }else if (orm == 'Sequelize'){
        console.log("Sequelize");
        Cityarea.findAll({
            include: [{
                model: City,
                required: true
            }]
        }).then(cityarea => {
            // Send all citie areas to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.cityarea = cityarea;
            response.message = text;
            res.render("cityarea", {cityareas:response});
        });
    }
}

// Send cityarea in JSON
var getCityarea = function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        if (!reg.test(req.query.id)){
            BookshelfCityarea.fetchAll().then(cityarea => {
                res.send(cityarea.toJSON());
            });
        }else{
            BookshelfCityarea.where('Id', req.query.id).fetchAll({
                withRelated:['city']
            }).then(cityarea => {
                res.send(cityarea.toJSON()[0]);
            });
        }
    }else if (orm = 'Sequelize'){
        if (!reg.test(req.query.id)){
            Cityarea.findAll().then(cityarea => {
                    // Send city areas to Client
                    res.send(cityarea);    
            });
        }else{
            Cityarea.findByPk(req.query.id, {
                include: [{
                    model: City,
                    required: true
                }]
            }).then(cityarea => {
                // Send requested City area to Client
                res.send(cityarea.dataValues);
            });
        }
    }
}

// Create city area
var createCityarea = function(req, res){
    if (req.query.name == ""){
          req.query.name = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        BookshelfCityarea.forge({
            Name: req.query.name,
            Size: req.query.size,
            Description: req.query.description,
            CityId: req.query.citySelect
        }).save().then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Sequelize'){
        Cityarea.create({
            Name: req.query.name,
            Size: req.query.size,
            Description: req.query.description,
            CityId: req.query.citySelect
        }).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }
}

// Edit Cityarea
var editCityarea = function(req, res){
    if (req.query.name == ""){
        req.query.name = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'Bookshelf'){
        BookshelfCityarea.where({
            Id: req.query.id
        }).save({
            Name: req.query.name,
            Size: req.query.size,
            Description: req.query.description,
            CityId: req.query.citySelect
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
        Cityarea.update({
            Name: req.query.name,
            Size: req.query.size,
            Description: req.query.description,
            CityId: req.query.citySelect
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

// Delete City
var deleteCityarea = function(req, res){
  var response = {};
  var orm = cookie.getOrm(req, res);
    
  if (orm == 'Bookshelf'){
      BookshelfCityarea.where({
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
        Cityarea.destroy({
                where: {
                    Id : req.query.id
                }
        }).then(function(){
                response.message = "Ok";
                response.id = req.query.id;
                res.send(response);
        }).catch(function(err){
                if (err.name == "SequelizeForeignKeyConstraintError")
                    response.message = "There are Stations that are from this City area, please delete them first!";
                else
                    response.message = "Error when deleting data."
                res.send(response);
        });
    }
  
}

module.exports.getShow = getShow;
module.exports.getCityarea = getCityarea;
module.exports.createCityarea = createCityarea;
module.exports.editCityarea = editCityarea;
module.exports.deleteCityarea = deleteCityarea;