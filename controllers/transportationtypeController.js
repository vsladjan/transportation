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
var mikroDI = require("../mikroormdb.js").DI;
var MType = require('../models/mikroorm/entities/Transportationtype.js').Transportationtype;


// Show all types
var getShow = async function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    let data = {};
    
    if (orm == 'MikroORM'){
        let typeRepository = mikroDI.em.fork().getRepository(MType);
        data = await typeRepository.findAll();
    }else if (orm == 'Objection'){
        data = await ObjType.query();
    }else if (orm == 'Knex'){
        data = await knex("transportationtype");
    }else if (orm == 'TypeORM'){
        const typeRepository = typeorm.getConnection().getRepository(TypeORMTransportationtype);
        data = await typeRepository.find();
        data = service.capitalizeKeys(data);
    }else if (orm == 'Bookshelf'){
        data = await BookshelfTransportationtype.fetchAll();
        data = service.capitalizeKeys(data.toJSON())
    }else if (orm == 'Sequelize'){
        data = await TransportationType.findAll({
            raw: true, nest: true
        });
        data = service.capitalizeKeys(data);
    }
    // Send all types to Client
    if (req.session.message){
        text = req.session.message;
        req.session.message = null;
    }
    var response = {};
    response.type = data;
    response.message = text;
    res.render("type", {types:response});
}


// Send type in JSON
var getType = async function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);
    let data = {};

    if (orm == 'MikroORM'){
        if (!reg.test(req.query.id)){
            let typeRepository = mikroDI.em.fork().getRepository(MType);
            data = await typeRepository.findAll();
        }else{
            let typeRepository = mikroDI.em.fork().getRepository(MType);
            data = await typeRepository.findOne(req.query.id);
        }
    }else if (orm == 'Objection'){
        if (!reg.test(req.query.id)){
            data = await ObjType.query();
        }else{
            data = await ObjType.query().findById(req.query.id);
        }
    }else if (orm == 'Knex'){
        if (!reg.test(req.query.id)){
            data = await knex("transportationtype");
        }else{
            data = await knex("transportationtype").where(
                'transportationtype.Id', req.query.id).select();
            data = data[0];
        }
    }else if (orm == 'TypeORM'){
        if (!reg.test(req.query.id)){
            const typeRepository = typeorm.getConnection().getRepository(TypeORMTransportationtype);
            data = await typeRepository.find();
            data = service.capitalizeKeys(data);
        }else{
            const typeRepository = typeorm.getConnection().getRepository(TypeORMTransportationtype);
            data = await typeRepository.findOneBy( { id: req.query.id });
            data = service.capitalizeKeys(data);
        }
    }else if (orm == 'Bookshelf'){
        if (!reg.test(req.query.id)){
            data = await BookshelfTransportationtype.fetchAll();
            data = service.capitalizeKeys(data.toJSON());
        }else{
            data = await BookshelfTransportationtype.where('Id', req.query.id).fetchAll({
            });
            data = service.capitalizeKeys(data.toJSON()[0]);
        }
    }else if (orm == 'Sequelize'){
        if (!reg.test(req.query.id)){
            data = await TransportationType.findAll({raw: true, nest: true});
            data = service.capitalizeKeys(data);
        }else{
            data = await TransportationType.findByPk(req.query.id, {
                raw: true,
                nest: true
            });
            data = service.capitalizeKeys(data);
        }
    }
    // Send requested type to Client
    res.send(data);
}

// Create transportation type
var createType = async function(req, res){
    if (req.body.name == ""){
        req.body.name = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let em = mikroDI.em.fork();
            let mType = new MType(
                req.body.name
            );
            await em.persistAndFlush(mType);
            req.session.message = "Record is created in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjType.query().insert({
                Name: req.body.name,
            });
            req.session.message = "Record is created in database (Objection).";
        }else if (orm == 'Knex'){
            await knex("transportationtype").insert({
                Name: req.body.name
            });
            req.session.message = "Record is created in database (Knex).";
        }else if (orm == 'TypeORM'){
            const typeRepository = typeorm.getConnection().getRepository(TypeORMTransportationtype);
            let typeORMType = new TypeORMTransportationtype();
            typeORMType.name = req.body.name;
            await typeRepository.save(typeORMType);
            req.session.message = "Record is created in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfTransportationtype.forge({
                Name: req.body.name
            }).save();
            req.session.message = "Record is created in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await TransportationType.create({
                Name: req.body.name
            });
            req.session.message = "Record is created in database (Sequelize).";
        }
    }catch(err){
        req.session.message = "Error when creating data.";
    }
    res.redirect("show");
}

// Edit transportation type
var editType = async function(req, res){
    if (req.body.name == ""){
        req.body.name = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let em = mikroDI.em.fork();
            let mType = await em.findOne(MType, req.body.id);
            mType.Name = req.body.name;
            await em.flush(mType);
            req.session.message = "Record is edited in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjType.query().update({
                Name: req.body.name
            }).where({Id: req.body.id});
            req.session.message = "Record is edited in database (Objection).";
        }else if (orm == 'Knex'){
            await knex("transportationtype").where("Id", req.body.id).update({
                Name: req.body.name
            });
            req.session.message = "Record is edited in database (Knex).";
        }else if (orm == 'TypeORM'){
            const typeRepository = typeorm.getConnection().getRepository(TypeORMTransportationtype);
            let typeORMType = new TypeORMTransportationtype();
            let id = parseInt(req.body.id);
            typeORMType.id = id;
            typeORMType.name = req.body.name;
            await typeRepository.save(typeORMType);
            req.session.message = "Record is edited in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfTransportationtype.where({
                Id: req.body.id
            }).save({
                Name: req.body.name
            },{
                method: 'update',
                patch:true
            });
            req.session.message = "Record is edited in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await TransportationType.update({
                Name: req.body.name
            },
            {
            where: {Id: req.body.id}
            });
            req.session.message = "Record is edited in database (Sequelize).";
        }
    }catch(err){
        req.session.message = "Error when editing data.";
    }
    res.redirect("show");
}

// Delete type
var deleteType = async function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
    
    try{
        if (orm == 'MikroORM'){
            let typeRepository = mikroDI.em.fork().getRepository(MType);
            let record = await typeRepository.findOne(req.query.id);
            await typeRepository.removeAndFlush(record);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Objection'){
            await ObjType.query().deleteById(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Knex'){
            await knex('transportationtype').where('Id', req.query.id).del();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'TypeORM'){
            const typeRepository = typeorm.getConnection().getRepository(TypeORMTransportationtype);
            await typeRepository.delete(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Bookshelf'){
            await BookshelfTransportationtype.where({
                Id: req.query.id
            }).destroy();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Sequelize'){
            await TransportationType.destroy({
                where: {
                        Id : req.query.id
                }
            });
            response.message = "Ok";
            response.id = req.query.id;
        }
    }catch(err){
        if (err.errno == 1451 || err.name.includes('Foreign'))
            response.message = "There are Vehicles that have this Type, please delete them first!";
        else
            response.message = "Error when deleting data."
    }
    res.send(response);
}


module.exports.createType = createType;
module.exports.getShow = getShow;
module.exports.getType = getType;
module.exports.editType = editType;
module.exports.deleteType = deleteType;