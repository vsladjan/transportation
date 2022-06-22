var express = require("express");
var cookie = require("../helper/cookie.js");
var service = require("../helper/service.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
const typeorm = require('typeorm');
var knex = require("../knexdb.js").getConnection();
var Cityarea = db.cityarea;
var City = db.city;
var BookshelfCityarea = dbBookshelf.Cityarea;
var TypeORMCityarea = require("../models/typeorm/entities/Cityarea.js").Cityarea;
var ObjCityarea = require("../models/objection/cityarea.js").Cityarea;
var mikroDI = require("../mikroormdb.js").DI;
var MCityarea = require('../models/mikroorm/entities/Cityarea.js').Cityarea;
var MCity = require('../models/mikroorm/entities/City.js').City;


var getShow = async function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    let data = {};

    if (orm == 'MikroORM'){
        let cityareaRepository = mikroDI.em.fork().getRepository(MCityarea);
        data = await cityareaRepository.findAll({ populate: ['City'] });
    }else if (orm == 'Objection'){
        data = await ObjCityarea.query().withGraphFetched('City');
    }else if (orm == 'Knex'){
        data = await knex(
                    "cityarea"
                ).join("city", "city.Id", "cityarea.CityId").select(
                    "cityarea.Id", 
                    "cityarea.Name", 
                    "cityarea.Size", 
                    "cityarea.Description", 
                    "cityarea.CityId",
                    knex.ref("city.Name").as('CityName')
                );
        data.forEach(element => {
            let city = {};
            city.Name = element.CityName;
            element['City'] = city;
        });
    }else if (orm == 'TypeORM'){
        const cityareaRepository = typeorm.getConnection().getRepository(TypeORMCityarea);
        let cityarea = await cityareaRepository.find({relations: ["city"]});
        data = service.capitalizeKeys(cityarea);
    }else if (orm == 'Bookshelf'){
        let cityarea = await BookshelfCityarea.fetchAll({withRelated:['city']});
        data = service.capitalizeKeys(cityarea.toJSON());
    }else if (orm == 'Sequelize'){
        let cityarea = await Cityarea.findAll({
            include: [{
                model: City,
                required: true
            }],
            raw: true,
            nest: true 
        });
        data = service.capitalizeKeys(cityarea);
    }

    if (req.session.message){
        text = req.session.message;
        req.session.message = null;
    }
    var response = {};
    response.cityarea = data;
    response.message = text;
    res.render("cityarea", {cityareas:response});
}

// Send cityarea in JSON
var getCityarea = async function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);
    let data = {};

    if (orm == 'MikroORM'){
        if (!reg.test(req.query.id)){
            let cityareaRepository = mikroDI.em.fork().getRepository(MCityarea);
            data = await cityareaRepository.findAll();
        }else{
            let cityareaRepository = mikroDI.em.fork().getRepository(MCityarea);
            let cityarea = await cityareaRepository.findOne(req.query.id, { populate: ['City']});
            data = cityarea.toJSON();
            data.CityId = cityarea.City.Id;
        }
    }else if (orm == 'Objection'){
        if (!reg.test(req.query.id)){
            data = await ObjCityarea.query();
        }else{
            data = await ObjCityarea.query().withGraphFetched('City').findById(req.query.id);
        }
    }else if (orm == 'Knex'){
        if (!reg.test(req.query.id)){
            data = await knex("cityarea");
        }else{
            let cityarea = await knex("cityarea").where('cityarea.Id', req.query.id).join(
                "city", "city.Id", "cityarea.CityId").select(
                "cityarea.Id", 
                "cityarea.Name", 
                "cityarea.Size", 
                "cityarea.Description", 
                "cityarea.CityId",
                knex.ref("city.Name").as('CityName')
            );
            data = cityarea[0];
            let city = {};
            city.Name = data.CityName;
            data['City'] = city;
        }
    }else if (orm == 'TypeORM'){
        if (!reg.test(req.query.id)){
            const cityareaRepository = typeorm.getConnection().getRepository(TypeORMCityarea);
            data = await cityareaRepository.find();
            data = service.capitalizeKeys(data);
        }else{
            const cityareaRepository = typeorm.getConnection().getRepository(TypeORMCityarea);
            data = await cityareaRepository.findOne({
                where: { id: req.query.id }, 
                relations: ["city"] }
            );
            data = service.capitalizeKeys(data);
        }
    }else 
    if (orm == 'Bookshelf'){
        if (!reg.test(req.query.id)){
            data = await BookshelfCityarea.fetchAll();
            data = service.capitalizeKeys(data.toJSON());
        }else{
            data = await BookshelfCityarea.where('Id', req.query.id).fetchAll({
                withRelated:['city']
            });
            data = service.capitalizeKeys(data.toJSON()[0]);
        }
    }else if (orm == 'Sequelize'){
        if (!reg.test(req.query.id)){
            data = await Cityarea.findAll({raw: true, nest: true});
            data = service.capitalizeKeys(data);
        }else{
            data = await Cityarea.findByPk(req.query.id, {
                include: [{
                    model: City,
                    required: true
                }],
                raw: true,
                nest: true
            });
            data = service.capitalizeKeys(data);
        }
    }

    // Send requested City area to Client
    res.send(data);
}

// Create city area
var createCityarea = async function(req, res){
    if (req.body.name == ""){
          req.body.name = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'MikroORM'){
        let em = mikroDI.em.fork();
        let mCity =  await em.findOne(MCity, req.body.citySelect);
        let mCityarea = new MCityarea(
            req.body.name,
            req.body.size,
            req.body.description
        );
        mCityarea.City = mCity;
        em.persistAndFlush(mCityarea).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Objection'){
        ObjCityarea.query().insert({
            Name: req.body.name,
            Size: req.body.size,
            Description: req.body.description,
            CityId: req.body.citySelect
        }).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Knex'){
        knex("cityarea").insert({
            Name: req.body.name,
            Size: req.body.size,
            Description: req.body.description,
            CityId: req.body.citySelect
        }).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'TypeORM'){
        const cityareaRepository = typeorm.getConnection().getRepository(TypeORMCityarea);
        let typeORMCityarea = new TypeORMCityarea();
        typeORMCityarea.name = req.body.name;
        typeORMCityarea.size = req.body.size;
        typeORMCityarea.description = req.body.description;
        typeORMCityarea.cityId = req.body.citySelect;
        cityareaRepository.save(typeORMCityarea).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
        BookshelfCityarea.forge({
            Name: req.body.name,
            Size: req.body.size,
            Description: req.body.description,
            CityId: req.body.citySelect
        }).save().then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Sequelize'){
        Cityarea.create({
            Name: req.body.name,
            Size: req.body.size,
            Description: req.body.description,
            CityId: req.body.citySelect
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
var editCityarea = async function(req, res){
    if (req.body.name == ""){
        req.body.name = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let em = mikroDI.em.fork();
            let mCityarea = await em.findOne(MCityarea, req.body.id);
            let mCity = await em.findOne(MCity, req.body.citySelect);
            mCityarea.Name = req.body.name;
            mCityarea.Size = req.body.size
            mCityarea.Description = req.body.description;
            mCityarea.CityId = req.body.citySelect;
            mCityarea.City = mCity;
            await em.flush(mCityarea);
            req.session.message = "Record is edited in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjCityarea.query().update({
                Name: req.body.name,
                Size: req.body.size,
                Description: req.body.description,
                CityId: req.body.citySelect
            }).where({Id: req.body.id});
            req.session.message = "Record is edited in database (Objection).";
        }else if (orm == 'Knex'){
            await knex("cityarea").where("Id", req.body.id).update({
                Name: req.body.name,
                Size: req.body.size,
                Description: req.body.description,
                CityId: req.body.citySelect
            });
            req.session.message = "Record is edited in database (Knex).";
        }else if (orm == 'TypeORM'){
            const cityareaRepository = typeorm.getConnection().getRepository(TypeORMCityarea);
            let typeORMCityarea = new TypeORMCityarea();
            let id = parseInt(req.body.id);
            typeORMCityarea.id = id;
            typeORMCityarea.name = req.body.name;
            typeORMCityarea.size = req.body.size;
            typeORMCityarea.description = req.body.description;
            typeORMCityarea.cityId = req.body.citySelect;
            await cityareaRepository.save(typeORMCityarea);
            req.session.message = "Record is edited in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfCityarea.where({
                Id: req.body.id
            }).save({
                Name: req.body.name,
                Size: req.body.size,
                Description: req.body.description,
                CityId: req.body.citySelect
            },{
                method: 'update',
                patch:true
            });
            req.session.message = "Record is edited in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await Cityarea.update({
                Name: req.body.name,
                Size: req.body.size,
                Description: req.body.description,
                CityId: req.body.citySelect
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

// Delete City
var deleteCityarea = async function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
  
    try{
        if (orm == 'MikroORM'){
            let cityareaRepository = mikroDI.em.fork().getRepository(MCityarea);
            let record = await cityareaRepository.findOne(req.query.id);
            await cityareaRepository.removeAndFlush(record);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Objection'){
            await ObjCityarea.query().deleteById(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Knex'){
            await knex('cityarea').where('Id', req.query.id).del();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'TypeORM'){
            const cityareaRepository = typeorm.getConnection().getRepository(TypeORMCityarea);
            await cityareaRepository.delete(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Bookshelf'){
            await BookshelfCityarea.where({
                Id: req.query.id
            }).destroy();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Sequelize'){
            await Cityarea.destroy({
                    where: {
                        Id : req.query.id
                    }
            });
            response.message = "Ok";
            response.id = req.query.id;
        }
    }catch(err){
        if (err.errno == 1451 || err.name.includes('Foreign'))
            response.message = "There are Stations that are from this City Area, please delete them first!";
        else
            response.message = "Error when deleting data."
    }
    res.send(response);
  
}

module.exports.getShow = getShow;
module.exports.getCityarea = getCityarea;
module.exports.createCityarea = createCityarea;
module.exports.editCityarea = editCityarea;
module.exports.deleteCityarea = deleteCityarea;