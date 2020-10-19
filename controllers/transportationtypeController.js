var express = require("express");
var cookie = require("../helper/cookie.js");
var service = require("../helper/service.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
const typeorm = require('typeorm');
var knex = require("../knexdb.js").getConnection();
var TransportationType = db.transportationtype;
var BookshelfTransportationtype = dbBookshelf.Transportationtype;
var TypeORMTransportationtype = require("../models/typeorm/entities/Transportationtype.js").Transportationtype;
var ObjType = require("../models/objection/transportationtype.js").Transportationtype;
var prisma = require("../prismadb.js").getConnection();


// Show all types
var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'Prisma'){
        prisma.transportationtype.findMany().then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.type = service.capitalizeKeys(data);
            response.message = text;
            res.render("type", {types:response});
        });
    }else if (orm == 'Objection'){
        ObjType.query().then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.type = data;
            response.message = text;
            res.render("type", {types:response});
        });
    }else if (orm == 'Knex'){
        knex("transportationtype").then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.type = data;
            response.message = text;
            res.render("type", {types:response});
        });
    }else if (orm == 'TypeORM'){
        console.log("TypeORM");
        const typeRepository = typeorm.getConnection().getRepository(TypeORMTransportationtype);
        typeRepository.find().then(type => {
              if (req.session.message){
                  text = req.session.message;
                  req.session.message = null;
              }
              var response = {};
              response.type = service.capitalizeKeys(type);
              response.message = text;
              res.render("type", {types:response});
        });
    }else if (orm == 'Bookshelf'){
        BookshelfTransportationtype.fetchAll().then(type => {
            // Send all types to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.type = service.capitalizeKeys(type.toJSON());
            response.message = text;
            res.render("type", {types:response});
        });
    }else if (orm == 'Sequelize'){
        TransportationType.findAll({
            raw: true, nest: true
        }).then(type => {
            // Send all types to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.type = service.capitalizeKeys(type);
            response.message = text;
            res.render("type", {types:response});
        });
    }
}


// Send type in JSON
var getType = function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);
    let id = parseInt(req.query.id);

    if (orm == 'Prisma'){
        if (!reg.test(req.query.id)){
            prisma.transportationtype.findMany().then(function(data){
                res.send(data);
            });
        }else{
            prisma.transportationtype.findOne({
                where: {
                    Id: id
                }
            }).then(function(data){
                res.send(service.capitalizeKeys(data));
            });
        }
    }else if (orm == 'Objection'){
        if (!reg.test(req.query.id)){
            ObjType.query().then(function(data){
                res.send(data);
            });
        }else{
            ObjType.query().findById(req.query.id).then(function(data){
                res.send(data);
            });
        }
    }else if (orm == 'Knex'){
        if (!reg.test(req.query.id)){
            knex("transportationtype").then(function(data){
                res.send(data);
            });
        }else{
            knex("transportationtype").where(
                'transportationtype.Id', req.query.id).then(function(data){
                let element = data[0];
                res.send(element);
            });
        }
    }else if (orm == 'TypeORM'){
        if (!reg.test(req.query.id)){
            const typeRepository = typeorm.getConnection().getRepository(TypeORMTransportationtype);
            typeRepository.find().then(type => {
                let data = service.capitalizeKeys(type);
                res.send(data);
            });
        }else{
            const typeRepository = typeorm.getConnection().getRepository(TypeORMTransportationtype);
            typeRepository.findOne(req.query.id).then(type => {
                let data = service.capitalizeKeys(type);
                res.send(data);
            });
        }
    }else if (orm == 'Bookshelf'){
        if (!reg.test(req.query.id)){
            BookshelfTransportationtype.fetchAll().then(type => {
                // Send requested type to Client 
                let data = service.capitalizeKeys(type.toJSON());
                res.send(data);
            });
        }else{
            BookshelfTransportationtype.where('Id', req.query.id).fetchAll({
            }).then(type => {
                // Send requested type to Client
                var data = service.capitalizeKeys(type.toJSON()[0]);
                res.send(data);
            });
        }
    }else if (orm == 'Sequelize'){
        if (!reg.test(req.query.id)){
            TransportationType.findAll({raw: true, nest: true}).then(type => {
                    // Send types to Client
                    let data = service.capitalizeKeys(type);
                    res.send(data);  
            });
        }else{
            TransportationType.findByPk(req.query.id, {
                raw: true,
                nest: true
            }).then(type => {
                    // Send requested type to Client
                    let data = service.capitalizeKeys(type);
                    res.send(data);   
            });
        }
    }
}

// Create transportation type
var createType = function(req, res){
    if (req.query.name == ""){
        req.query.name = null;
        req.session.message = "Error when creating data.";
        res.redirect("show");
        return;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'Prisma'){
        prisma.transportationtype.create({
            data:{
                Name: req.query.name,
            }
        }).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Objection'){
        ObjType.query().insert({
            Name: req.query.name,
        }).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Knex'){
        knex("transportationtype").insert({
            Name: req.query.name
        }).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'TypeORM'){
        const typeRepository = typeorm.getConnection().getRepository(TypeORMTransportationtype);
        let typeORMType = new TypeORMTransportationtype();
        typeORMType.name = req.query.name;
        typeRepository.save(typeORMType).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
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
        req.session.message = "Error when editing data.";
        res.redirect("show");
        return;
    }
    var orm = cookie.getOrm(req, res);

    let id = parseInt(req.query.id);

    if (orm == 'Prisma'){
        prisma.transportationtype.update({
            where:{
                Id: id
            },
            data:{
                Name: req.query.name,
            }
        }).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Objection'){
        ObjType.query().update({
            Name: req.query.name
        }).where({Id: req.query.id}).then(function(result){
            req.session.message = "Record is edited in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when editing data.";
            res.redirect("show");
        });;
    }else if (orm == 'Knex'){
        knex("transportationtype").where("Id", req.query.id).update({
            Name: req.query.name
        }).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'TypeORM'){
        const typeRepository = typeorm.getConnection().getRepository(TypeORMTransportationtype);
        let typeORMType = new TypeORMTransportationtype();
        let id = parseInt(req.query.id);
        typeORMType.id = id;
        typeORMType.name = req.query.name;
        typeRepository.save(typeORMType).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
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
    let id = parseInt(req.query.id);
    
    if (orm == 'Prisma'){
        prisma.transportationtype.delete({
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
        ObjType.query().deleteById(req.query.id).then(function(){
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
        knex('transportationtype').where('Id', req.query.id).del().then(function(){
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
        const typeRepository = typeorm.getConnection().getRepository(TypeORMTransportationtype);
        typeRepository.delete(req.query.id).then(function(){
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