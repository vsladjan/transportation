var express = require("express");
var cookie = require("../helper/cookie.js");
var service = require("../helper/service.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
const typeorm = require('typeorm');
var Country = db.country;
var BookshelfCountry = dbBookshelf.Country;
var TypeORMCountry = require("../models/typeorm/entities/Country.js").Country; 


// Show all countries
var getShow = function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'TypeORM'){
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

    if (orm == 'TypeORM'){
        if (!reg.test(req.query.id)){
            const countryRepository = typeorm.getConnection().getRepository(TypeORMCountry);
            countryRepository.find().then(country => {
                let data = service.capitalizeKeys(country);
                res.send(data);
            });
        }else{
            const countryRepository = typeorm.getConnection().getRepository(TypeORMCountry);
            countryRepository.findOne(req.query.id).then(c => {
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
    }else if (orm = 'Sequelize'){
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
var createCountry = function(req, res){
    var reg = new RegExp("[A-Z]{3}");
    if (!reg.test(req.query.countryCode) || req.query.name == "" || req.query.continentSelect == ""){
        req.query.countryCode = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'TypeORM'){
        const countryRepository = typeorm.getConnection().getRepository(TypeORMCountry);
        let typeORMCountry = new TypeORMCountry();
        typeORMCountry.name = req.query.name;
        typeORMCountry.code = req.query.countryCode;
        typeORMCountry.size = req.query.size;
        typeORMCountry.population = req.query.population;
        typeORMCountry.continent = req.query.continentSelect;
        countryRepository.save(typeORMCountry).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
        BookshelfCountry.forge({
                Name: req.query.name,
                Code: req.query.countryCode,
                Size: req.query.size,
                Population: req.query.population,
                Continent: req.query.continentSelect 
        }).save().then(function(result){
                req.session.message = "Record is created in database.";
                res.redirect("show");
        }).catch(function(err){
                req.session.message = "Error when creating data.";
                res.redirect("show");
        });
    }else if (orm == 'Sequelize'){
        Country.create({
                Name: req.query.name,
                Code: req.query.countryCode,
                Size: req.query.size,
                Population: req.query.population,
                Continent: req.query.continentSelect
        }).then(function(result){
                req.session.message = "Record is created in database.";
                res.redirect("show");
        }).catch(function(err){
                req.session.message = "Error when creating data.";
                res.redirect("show");
        });
    }
}

// Edit Country
var editCountry = function(req, res){
    var reg = new RegExp("[A-Z]{3}")
    if (!reg.test(req.query.countryCode) || req.query.name == "" || req.query.continentSelect == ""){
        req.query.countryCode = null;
    }
    var orm = cookie.getOrm(req, res);

    if (orm == 'TypeORM'){
        let id = parseInt(req.query.id);
        typeORMCity.id = id;
        const countryRepository = typeorm.getConnection().getRepository(TypeORMCountry);
        let typeORMCountry = new TypeORMCountry();
        typeORMCountry.name = req.query.name;
        typeORMCountry.code = req.query.countryCode;
        typeORMCountry.size = req.query.size;
        typeORMCountry.population = req.query.population;
        typeORMCountry.continent = req.query.continentSelect;
        countryRepository.save(typeORMCountry).then(function(result){
            req.session.message = "Record is created in database.";
            res.redirect("show");
        }).catch(function(err){
            req.session.message = "Error when creating data.";
            res.redirect("show");
        });
    }else if (orm == 'Bookshelf'){
            BookshelfCountry.where({
                  Id: req.query.id
            }).save({
                  Name: req.query.name,
                  Code: req.query.countryCode,
                  Size: req.query.size,
                  Population: req.query.population,
                  Continent: req.query.continentSelect
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
            Country.update({
                  Name: req.query.name,
                  Code: req.query.countryCode,
                  Size: req.query.size,
                  Population: req.query.population,
                  Continent: req.query.continentSelect
            },{
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

// Delete Country
var deleteCountry = function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
    
    if (orm == 'TypeORM'){
        const countryRepository = typeorm.getConnection().getRepository(TypeORMCountry);
        countryRepository.delete(req.query.id).then(function(){
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
            BookshelfCountry.where({
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
            Country.destroy({
                  where: {
                        Id : req.query.id
                  }
            }).then(function(){
                  response.message = "Ok";
                  response.id = req.query.id;
                  res.send(response);
            }).catch(function(err){
                  if (err.name == "SequelizeForeignKeyConstraintError")
                        response.message = "There are Cities that are from this Country, please delete them first!";
                  else
                        response.message = "Error when deleting data."
                  res.send(response);
            });
      }
}


module.exports.createCountry = createCountry;
module.exports.getShow = getShow;
module.exports.getCountry = getCountry;
module.exports.editCountry = editCountry;
module.exports.deleteCountry = deleteCountry;