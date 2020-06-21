var express = require("express");
const db = require("../sequelize.js");
var Route = db.route;


var getShow = function(req, res){
    var text = "Message";
    Route.findAll().then(route => {
        // Send all routes to Client
        if (req.session.message){
            text = req.session.message;
            req.session.message = null;
        }
        var response = {};
        response.route = route;
        response.message = text;
        res.render("route", {routes:response});
    });
}

// Send route in JSON
var getRoute = function(req, res){
    var reg = new RegExp("[0-9]+");
    if (!reg.test(req.query.id)){
        Route.findAll().then(route => {
                // Send routes to Client
                res.send(route);    
        });
    }else{
        Route.findByPk(req.query.id).then(route => {
            // Send requested City to Client
            res.send(route.dataValues);
        });
    }
}

// Create route
var createRoute = function(req, res){
    if (req.query.name == ""){
          req.query.name = null;
    }
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

// Edit Route
var editRoute = function(req, res){
    if (req.query.name == ""){
        req.query.name = null;
    }
    Route.update({
        Name: req.query.name,
        Description: req.query.description,
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

// Delete Route
var deleteRoute = function(req, res){
  var response = {};
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

module.exports.getShow = getShow;
module.exports.getRoute = getRoute;
module.exports.createRoute = createRoute;
module.exports.editRoute = editRoute;
module.exports.deleteRoute = deleteRoute;
