var express = require("express");
const db = require("../sequelize.js");
var TransportationType = db.transportationtype;


// Show all types
var getShow = function(req, res){
    var text = "Message";
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


// Send type in JSON
var getType = function(req, res){
      var reg = new RegExp("[0-9]+");
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

// Create transportation type
var createType = function(req, res){
      if (req.query.name == ""){
            req.query.name = null;
      }
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

// Edit transportation type
var editType = function(req, res){
      if (req.query.name == ""){
            req.query.name = null;
      }
      TransportationType.update({
            Name: req.query.name,
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

// Delete type
var deleteType = function(req, res){
    var response = {};
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


module.exports.createType = createType;
module.exports.getShow = getShow;
module.exports.getType = getType;
module.exports.editType = editType;
module.exports.deleteType = deleteType;