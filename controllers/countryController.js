var express = require("express");
var cookie = require("../helper/cookie.js");
var service = require("../helper/service.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
const typeorm = require('typeorm');
var knex = require("../knexdb.js").getConnection();
var Country = db.country;
var BookshelfCountry = dbBookshelf.Country;
var TypeORMCountry = require("../models/typeorm/entities/Country.js").Country; 
var ObjCountry = require("../models/objection/country.js").Country;
var mikroDI = require("../mikroormdb.js").DI;
var MCountry = require("../models/mikroorm/entities/Country.js").Country;



// Show all countries
var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'MikroORM'){
        let countryRepository = mikroDI.em.fork().getRepository(MCountry);
        countryRepository.findAll().then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.country = data;
            response.message = text;
            res.render("country", {countries:response});
        });
    }else if (orm == 'Objection'){
        ObjCountry.query().then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.country = data;
            response.message = text;
            res.render("country", {countries:response});
        });
    }else if (orm == "Knex"){
        knex("country").then(function(data){
            if (req.session.message){
                text = req.session.message;
                req.session.message = null;
            }
            var response = {};
            response.country = data;
            response.message = text;
            res.render("country", {countries:response});
        });
    }else if (orm == 'TypeORM'){
        console.log("TypeORM");
        const countryRepository = typeorm.getConnection().getRepository(TypeORMCountry);
        countryRepository.find().then(country => {
              if (req.session.message){
                  text = req.session.message;
                  req.session.message = null;
              }
              var response = {};
              response.country = service.capitalizeKeys(country);
              response.message = text;
              res.render("country", {countries:response});
        });
    }else if (orm == 'Bookshelf'){
        BookshelfCountry.fetchAll().then(country => {
                // Send all countries to Client
                if (req.session.message){
                text = req.session.message;
                req.session.message = null;
                }
                var response = {};
                response.country = service.capitalizeKeys(country.toJSON());
                response.message = text;
                res.render("country", {countries:response});
        });
    }else{
    Country.findAll({raw: true, nest: true}).then(country => {
                // Send all countries to Client
                if (req.session.message){
                    text = req.session.message;
                    req.session.message = null;
                }
                var response = {};
                response.country = service.capitalizeKeys(country);
                response.message = text;
                res.render("country", {countries:response});
        });
    }
}


// Send country in JSON
var getCountry = function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);

    if (orm == 'MikroORM'){
        if (!reg.test(req.query.id)){
            let countryRepository = mikroDI.em.fork().getRepository(MCountry);
            countryRepository.findAll().then(function(data){
                res.send(data);
            });
        }else{
            let countryRepository = mikroDI.em.fork().getRepository(MCountry);
            countryRepository.findOne(req.query.id).then(function(data){
                res.send(data);
            });
        }
    }else if (orm == 'Objection'){
        if (!reg.test(req.query.id)){
            ObjCountry.query().then(function(data){
                res.send(data);
            });
        }else{
            ObjCountry.query().findById(req.query.id).then(function(data){
                res.send(data);
            });
        }
    }else if (orm == 'Knex'){
        if (!reg.test(req.query.id)){
            knex("country").then(function(data){
                res.send(data);
            });
        }else{
            knex("country").where('country.Id', req.query.id).select().then(function(data){
                res.send(data[0]);
            });
        }
    }else if (orm == 'TypeORM'){
        if (!reg.test(req.query.id)){
            const countryRepository = typeorm.getConnection().getRepository(TypeORMCountry);
            countryRepository.find().then(country => {
                let data = service.capitalizeKeys(country);
                res.send(data);
            });
        }else{
            const countryRepository = typeorm.getConnection().getRepository(TypeORMCountry);
            countryRepository.findOne(req.query.id).then(country => {
                let data = service.capitalizeKeys(country);
                res.send(data);
            });
        }
    }else if (orm == 'Bookshelf'){
        if (!reg.test(req.query.id)){
                BookshelfCountry.fetchAll().then(country => {
                    // Send requested country to Client 
                    let data = service.capitalizeKeys(country.toJSON());
                    res.send(data);
                });
        }else{
                BookshelfCountry.where('Id', req.query.id).fetchAll({
                }).then(country => {
                // Send requested country to Client
                    let data = service.capitalizeKeys(country.toJSON()[0]);
                    res.send(data);
                });
        }
    }else if (orm == 'Sequelize'){
        if (!reg.test(req.query.id)){
                Country.findAll({raw: true, nest: true}).then(country => {
                    // Send countries to Client
                    let data = service.capitalizeKeys(country);
                    res.send(data);       
                });
        }else{
                Country.findByPk(req.query.id, {
                    raw: true, nest: true
                }).then(country => {
                    // Send requested Country to Client
                    let data = service.capitalizeKeys(country);
                    res.send(data);       
                });
        }
    }
}

// Create country
var createCountry = async function(req, res){
    var reg = new RegExp("[A-Z]{3}");
    if (!reg.test(req.body.countryCode) || req.body.name == "" || req.body.continentSelect == ""){
        req.body.countryCode = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let record = new MCountry(
                req.body.name,
                req.body.countryCode,
                req.body.size,
                req.body.population,
                req.body.continentSelect
            );
            await mikroDI.em.fork().persistAndFlush(record);
            req.session.message = "Record is created in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjCountry.query().insert({
                Name: req.body.name,
                Code: req.body.countryCode,
                Size: req.body.size,
                Population: req.body.population,
                Continent: req.body.continentSelect
            });
            req.session.message = "Record is created in database (Objection).";
        }if (orm == 'Knex'){
            await knex("country").insert({
                Name: req.body.name,
                Code: req.body.countryCode,
                Size: req.body.size,
                Population: req.body.population,
                Continent: req.body.continentSelect
            });
            req.session.message = "Record is created in database (Knex).";
        }else if (orm == 'TypeORM'){
            const countryRepository = typeorm.getConnection().getRepository(TypeORMCountry);
            let typeORMCountry = new TypeORMCountry();
            typeORMCountry.name = req.body.name;
            typeORMCountry.code = req.body.countryCode;
            typeORMCountry.size = req.body.size;
            typeORMCountry.population = req.body.population;
            typeORMCountry.continent = req.body.continentSelect;
            await countryRepository.save(typeORMCountry);
            req.session.message = "Record is created in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfCountry.forge({
                    Name: req.body.name,
                    Code: req.body.countryCode,
                    Size: req.body.size,
                    Population: req.body.population,
                    Continent: req.body.continentSelect 
            }).save();
            req.session.message = "Record is created in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await Country.create({
                    Name: req.body.name,
                    Code: req.body.countryCode,
                    Size: req.body.size,
                    Population: req.body.population,
                    Continent: req.body.continentSelect
            });
            req.session.message = "Record is created in database (Sequelize).";
        }
    }catch(err){
        req.session.message = "Error when creating data.";
    }
    res.redirect("show");
}

// Edit Country
var editCountry = async function(req, res){
    var reg = new RegExp("[A-Z]{3}")
    if (!reg.test(req.body.countryCode) || req.body.name == "" || req.body.continentSelect == ""){
        req.body.countryCode = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let countryRepository = mikroDI.em.fork().getRepository(MCountry);
            let record = await countryRepository.findOne(req.body.id);
            record.Name = req.body.name;
            record.Code = req.body.countryCode;
            record.Size = req.body.size;
            record.Population = req.body.population;
            record.Continent = req.body.continentSelect;
            await countryRepository.flush(record);
            req.session.message = "Record is edited in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjCountry.query().update({
                Name: req.body.name,
                Code: req.body.countryCode,
                Size: req.body.size,
                Population: req.body.population,
                Continent: req.body.continentSelect
            }).where({Id: req.body.id});
            req.session.message = "Record is edited in database (Objection).";
        }if (orm == 'Knex'){
            await knex("country").where("Id", req.body.id).update({
                Name: req.body.name,
                Code: req.body.countryCode,
                Size: req.body.size,
                Population: req.body.population,
                Continent: req.body.continentSelect
            });
            req.session.message = "Record is edited in database (Knex).";
        }else if (orm == 'TypeORM'){
            let id = parseInt(req.body.id);
            const countryRepository = typeorm.getConnection().getRepository(TypeORMCountry);
            let typeORMCountry = new TypeORMCountry();
            typeORMCountry.id = id;
            typeORMCountry.name = req.body.name;
            typeORMCountry.code = req.body.countryCode;
            typeORMCountry.size = req.body.size;
            typeORMCountry.population = req.body.population;
            typeORMCountry.continent = req.body.continentSelect;
            await countryRepository.save(typeORMCountry);
            req.session.message = "Record is edited in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfCountry.where({
                    Id: req.body.id
            }).save({
                    Name: req.body.name,
                    Code: req.body.countryCode,
                    Size: req.body.size,
                    Population: req.body.population,
                    Continent: req.body.continentSelect
            },{
                    method: 'update',
                    patch:true
            });
            req.session.message = "Record is edited in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await Country.update({
                    Name: req.body.name,
                    Code: req.body.countryCode,
                    Size: req.body.size,
                    Population: req.body.population,
                    Continent: req.body.continentSelect
            },{
                    where: {Id: req.body.id}
            });
            req.session.message = "Record is edited in database (Sequelize).";
        }
    }catch(err){
        req.session.message = "Error when editing data.";
    }
    res.redirect("show");
}

// Delete Country
var deleteCountry = async function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
    
    try{
        if (orm == 'MikroORM'){
            let countryRepository = mikroDI.em.fork().getRepository(MCountry);
            let record = await countryRepository.findOne(req.query.id);
            await countryRepository.removeAndFlush(record);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Objection'){
            await ObjCountry.query().deleteById(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }if (orm == 'Knex'){
            await knex('country').where('Id', req.query.id).del();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'TypeORM'){
            const countryRepository = typeorm.getConnection().getRepository(TypeORMCountry);
            await countryRepository.delete(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Bookshelf'){
            await BookshelfCountry.where({
                    Id: req.query.id
            }).destroy();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Sequelize'){
            await Country.destroy({
                    where: {
                        Id : req.query.id
                    }
            });
            response.message = "Ok";
            response.id = req.query.id;
        }
    }catch(err){
        if (err.errno == 1451 || err.name.includes('Foreign'))
            response.message = "There are City Areas that are from this City, please delete them first!";
        else
            response.message = "Error when deleting data."
    }
    res.send(response);
}


module.exports.createCountry = createCountry;
module.exports.getShow = getShow;
module.exports.getCountry = getCountry;
module.exports.editCountry = editCountry;
module.exports.deleteCountry = deleteCountry;