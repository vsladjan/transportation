var express = require("express");
var cookie = require("../helper/cookie.js");
var service = require("../helper/service.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
const typeorm = require('typeorm');
var City = db.city;
var Country = db.country;
var BookshelfCity = dbBookshelf.City;
var TypeORMCity = require("../models/typeorm/entities/City.js").City;
  

var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    console.log("getshow" + orm);
    if (orm == 'TypeORM'){
      console.log("TypeORM");
      const cityRepository = typeorm.getConnection().getRepository(TypeORMCity);
      cityRepository.find({relations: ["country"]}).then(city => {
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.city = service.capitalizeKeys(city);
            response.message = text;
            res.render("city", {cities:response});
      });
    }else if (orm == 'Bookshelf'){
        BookshelfCity.fetchAll({withRelated:['country']}).then(city => {
            // Send all cities to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.city = service.capitalizeKeys(city.toJSON());
            response.message = text;
            res.render("city", {cities:response});
        });
    }else if (orm == 'Sequelize'){
        City.findAll({
            include: [{
                model: Country,
                required: true
            }],
            raw: true,
            nest: true 
        }).then(city => {
            // Send all cities to Client
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.city = service.capitalizeKeys(city);
            response.message = text;
            res.render("city", {cities:response});
        });
    }
}

// Send city in JSON
var getCity = function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);

    if (orm == 'TypeORM'){
        if (!reg.test(req.query.id)){
            const cityRepository = typeorm.getConnection().getRepository(TypeORMCity);
            cityRepository.find().then(city => {
                let data = service.capitalizeKeys(city);
                res.send(data);
            });
        }else{
            const cityRepository = typeorm.getConnection().getRepository(TypeORMCity);
            cityRepository.findOne(req.query.id, {relations: ["country"]}).then(city => {
                let data = service.capitalizeKeys(city);
                res.send(data);
            });
        }
    }else if (orm == 'Bookshelf'){
        if (!reg.test(req.query.id)){
            BookshelfCity.fetchAll().then(city => {
                // Send requested City to Client 
                let data = service.capitalizeKeys(city.toJSON());
                res.send(data);
            });
        }else{
            BookshelfCity.where('Id', req.query.id).fetchAll({
                withRelated:['country']
            }).then(city => {
                // Send requested City to Client
                var data = service.capitalizeKeys(city.toJSON()[0]);
                res.send(data);
                //res.send(city.toJSON()[0]);
            });
        }
    }else if (orm = 'Sequelize'){
        if (!reg.test(req.query.id)){
            City.findAll({raw: true, nest: true}).then(city => {
                    // Send cities to Client
                    let data = service.capitalizeKeys(city);
                    res.send(data);    
            });
        }else{      
            City.findByPk(req.query.id, {
                include: [{
                    model: Country,
                    required: true
                }],
                raw: true,
                nest: true
            }).then(city => {
                // Send requested City to Client
                let data = service.capitalizeKeys(city);
                res.send(data);
                //res.send(city.dataValues);
            });
        }
    }
}

// Create city
var createCity = function(req, res){
    if (req.query.name == ""){
          req.query.name = null;
    }
    var orm = cookie.getOrm(req, res);
   
    if (orm == 'TypeORM'){
        const cityRepository = typeorm.getConnection().getRepository(TypeORMCity);
        let typeORMCity = new TypeORMCity();
        typeORMCity.name = req.query.name;
        typeORMCity.population = req.query.population;
        typeORMCity.size = req.query.size;
        typeORMCity.countryId = req.query.countrySelect;
        cityRepository.save(typeORMCity).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
        BookshelfCity.forge({
            Name: req.query.name,
            Population: req.query.population,
            Size: req.query.size,
            CountryId: req.query.countrySelect 
        }).save().then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Sequelize'){
        City.create({
            Name: req.query.name,
            Population: req.query.population,
            Size: req.query.size,
            CountryId: req.query.countrySelect
        }).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }
}

// Edit City
var editCity = function(req, res){
    if (req.query.name == ""){
        req.query.name = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'TypeORM'){
        const cityRepository = typeorm.getConnection().getRepository(TypeORMCity);
        let typeORMCity = new TypeORMCity();
        let id = parseInt(req.query.id);
        typeORMCity.id = id;
        typeORMCity.name = req.query.name;
        typeORMCity.population = req.query.population;
        typeORMCity.size = req.query.size;
        typeORMCity.countryId = req.query.countrySelect;
        cityRepository.save(typeORMCity).then(function(result){
            req.session.message = "Record is edited in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when editing data.";
            res.redirect("show");
        });
    }if (orm == 'Bookshelf'){
        BookshelfCity.where({
            Id: req.query.id
        }).save({
            Name: req.query.name,
            Population: req.query.population,
            Size: req.query.size,
            CountryId: req.query.countrySelect
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
        City.update({
            Name: req.query.name,
            Population: req.query.population,
            Size: req.query.size,
            CountryId: req.query.countrySelect
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
var deleteCity = function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'TypeORM'){
        const cityRepository = typeorm.getConnection().getRepository(TypeORMCity);
        cityRepository.delete(req.query.id).then(function(){
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
        BookshelfCity.where({
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
        City.destroy({
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
module.exports.getCity = getCity;
module.exports.createCity = createCity;
module.exports.editCity = editCity;
module.exports.deleteCity = deleteCity;