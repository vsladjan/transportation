var express = require("express");
var cookie = require("../helper/cookie.js");
var service = require("../helper/service.js");
const db = require("../sequelize.js");
const dbBookshelf = require("../models/bookshelf/model.js");
const typeorm = require('../typeormdb.js');
var knex = require("../knexdb.js").getConnection();
var City = db.city;
var Country = db.country;
var BookshelfCity = dbBookshelf.City;
var TypeORMCity = require("../models/typeorm/entities/City.js").City;
var ObjCity = require("../models/objection/city.js").City;
var mikroDI = require("../mikroormdb.js").DI;
var MCity = require('../models/mikroorm/entities/City.js').City;
var MCountry = require('../models/mikroorm/entities/Country.js').Country;
  

var getShow = async function(req, res){
    var text = "Message";
    var orm = cookie.getOrm(req, res);
    let data = {};

    if (orm == 'MikroORM'){
        let cityRepository = mikroDI.em.fork().getRepository(MCity);
        data = await cityRepository.findAll({ populate: ['Country'] });
    }else if (orm == 'Objection'){
        data = await ObjCity.query().withGraphFetched('Country');
    }else if (orm == 'Knex'){
        data = await knex("city").join("country", "country.Id", "city.CountryId").select(
                "city.Id", 
                "city.Name", 
                "city.Population", 
                "city.Size", 
                "city.CountryId",
                knex.ref("country.Name").as('CountryName')
        );
        data.forEach(element => {
            let country = {};
            country.Name = element.CountryName;
            element['Country'] = country;
        });
    }else if (orm == 'TypeORM'){
      const cityRepository = typeorm.getConnection().getRepository(TypeORMCity);
      let city = await cityRepository.find({relations: ["country"]});
      data = service.capitalizeKeys(city);
    }else if (orm == 'Bookshelf'){
        let city = await BookshelfCity.fetchAll({withRelated:['country']});
        data = service.capitalizeKeys(city.toJSON());
    }else if (orm == 'Sequelize'){
        let city = await City.findAll({
            include: [{
                model: Country,
                required: true
            }],
            raw: true,
            nest: true 
        });
        data = service.capitalizeKeys(city);
    }

    // Send all cities to client
    if (req.session.message){
        text = req.session.message;
        req.session.message = null;
    }
    var response = {};
    response.city = data;
    response.message = text;
    res.render("city", {cities:response});
}

// Send city in JSON
var getCity = async function(req, res){
    var reg = new RegExp("[0-9]+");
    var orm = cookie.getOrm(req, res);
    let data = {};

    if (orm == 'MikroORM'){
        if (!reg.test(req.query.id)){
            let cityRepository = mikroDI.em.fork().getRepository(MCity);
            data = await cityRepository.findAll();
        }else{
            let cityRepository = mikroDI.em.fork().getRepository(MCity);
            let city = await cityRepository.findOne(req.query.id, { populate: ['Country'] });
            data = city.toJSON();
            data.CountryId = city.Country.Id;
        }
    }else if (orm == 'Objection'){
        if (!reg.test(req.query.id)){
            data = await ObjCity.query();
        }else{
            data = await ObjCity.query().withGraphFetched('Country').findById(req.query.id);
        }
    }else if (orm == 'Knex'){
        if (!reg.test(req.query.id)){
            data = await knex("city");
        }else{
            let city = await knex("city").where('city.Id', req.query.id).join("country", "country.Id", "city.CountryId").select(
                "city.Id", 
                "city.Name", 
                "city.Population", 
                "city.Size", 
                "city.CountryId",
                knex.ref("country.Name").as('CountryName')
            );
            data = city[0];
            let country = {};
            country.Name = data.CountryName;
            data['Country'] = country;
        }
    }else if (orm == 'TypeORM'){
        if (!reg.test(req.query.id)){
            const cityRepository = typeorm.getConnection().getRepository(TypeORMCity);
            let city = await cityRepository.find();
            data = service.capitalizeKeys(city);
        }else{
            const cityRepository = typeorm.getConnection().getRepository(TypeORMCity);
            let city = await cityRepository.findOne({
                where: { id: req.query.id }, 
                relations: ["country"] }
            );
            data = service.capitalizeKeys(city);
        }
    }else if (orm == 'Bookshelf'){
        if (!reg.test(req.query.id)){
            let city = await BookshelfCity.fetchAll();
            data = service.capitalizeKeys(city.toJSON());
        }else{
            let city = await BookshelfCity.where('Id', req.query.id).fetchAll({
                withRelated:['country']
            });
            data = service.capitalizeKeys(city.toJSON()[0]);
        }
    }else if (orm == 'Sequelize'){
        if (!reg.test(req.query.id)){
            let city = await City.findAll({raw: true, nest: true});
            data = service.capitalizeKeys(city);
        }else{      
            let city = await City.findByPk(req.query.id, {
                include: [{
                    model: Country,
                    required: true
                }],
                raw: true,
                nest: true
            });
            data = service.capitalizeKeys(city);
        }
    }
    res.send(data);
}

// Create city
var createCity = async function(req, res){
    if (req.body.name == ""){
          req.body.name = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let em = mikroDI.em.fork();
            let mCountry =  await em.findOne(MCountry, req.body.countrySelect);
            let mCity = new MCity(
                req.body.name,
                req.body.population,
                req.body.size
            );
            mCity.Country = mCountry;
            await em.persistAndFlush(mCity);
            req.session.message = "Record is created in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjCity.query().insert({
                Name: req.body.name,
                Population: req.body.population,
                Size: req.body.size,
                CountryId: req.body.countrySelect
            });
            req.session.message = "Record is created in database (Objection).";
        }else if (orm == 'Knex'){
            await knex("city").insert({
                Name: req.body.name,
                Population: req.body.population,
                Size: req.body.size,
                CountryId: req.body.countrySelect
            });
            req.session.message = "Record is created in database (Knex).";
        }else if (orm == 'TypeORM'){
            const cityRepository = typeorm.getConnection().getRepository(TypeORMCity);
            let typeORMCity = new TypeORMCity();
            typeORMCity.name = req.body.name;
            typeORMCity.population = req.body.population;
            typeORMCity.size = req.body.size;
            typeORMCity.countryId = req.body.countrySelect;
            await cityRepository.save(typeORMCity);
            req.session.message = "Record is created in database (TypeORM).";
        }else if (orm == 'Bookshelf'){
            await BookshelfCity.forge({
                Name: req.body.name,
                Population: req.body.population,
                Size: req.body.size,
                CountryId: req.body.countrySelect 
            }).save();
            req.session.message = "Record is created in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await City.create({
                Name: req.body.name,
                Population: req.body.population,
                Size: req.body.size,
                CountryId: req.body.countrySelect
            });
            req.session.message = "Record is created in database (Sequelize).";
        }
    }catch(err){
        req.session.message = "Error when creating data.";
    }
    res.redirect("show");
}

// Edit City
var editCity = async function(req, res){
    if (req.body.name == ""){
        req.body.name = null;
    }
    var orm = cookie.getOrm(req, res);

    try{
        if (orm == 'MikroORM'){
            let em = mikroDI.em.fork();
            let mCity = await em.findOne(MCity, req.body.id);
            let mCountry = await em.findOne(MCountry, req.body.countrySelect);
            mCity.Name = req.body.name;
            mCity.Population = req.body.population;
            mCity.Size = req.body.size
            mCity.CountryId = req.body.countrySelect;
            mCity.Country = mCountry;
            await em.flush(mCity);
            req.session.message = "Record is edited in database (MikroORM).";
        }else if (orm == 'Objection'){
            await ObjCity.query().update({
                Name: req.body.name,
                Population: req.body.population,
                Size: req.body.size,
                CountryId: req.body.countrySelect
            }).where({Id: req.body.id});
            req.session.message = "Record is edited in database (Objection).";
        }else if (orm == 'Knex'){
            await knex("city").where("Id", req.body.id).update({
                Name: req.body.name,
                Population: req.body.population,
                Size: req.body.size,
                CountryId: req.body.countrySelect
            });
            req.session.message = "Record is edited in database (Knex).";
        }else if (orm == 'TypeORM'){
            const cityRepository = typeorm.getConnection().getRepository(TypeORMCity);
            let typeORMCity = new TypeORMCity();
            let id = parseInt(req.body.id);
            typeORMCity.id = id;
            typeORMCity.name = req.body.name;
            typeORMCity.population = req.body.population;
            typeORMCity.size = req.body.size;
            typeORMCity.countryId = req.body.countrySelect;
            await cityRepository.save(typeORMCity);
            req.session.message = "Record is edited in database (TypeORM).";
        }if (orm == 'Bookshelf'){
            await BookshelfCity.where({
                Id: req.body.id
            }).save({
                Name: req.body.name,
                Population: req.body.population,
                Size: req.body.size,
                CountryId: req.body.countrySelect
            },{
                method: 'update',
                patch:true
            });
            req.session.message = "Record is edited in database (Bookshelf).";
        }else if (orm == 'Sequelize'){
            await City.update({
                Name: req.body.name,
                Population: req.body.population,
                Size: req.body.size,
                CountryId: req.body.countrySelect
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
var deleteCity = async function(req, res){
    var response = {};
    var orm = cookie.getOrm(req, res);
    
    try{
        if (orm == 'MikroORM'){
            let cityRepository = mikroDI.em.fork().getRepository(MCity);
            let record = await cityRepository.findOne(req.query.id);
            await cityRepository.removeAndFlush(record);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Objection'){
            await ObjCity.query().deleteById(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Knex'){
            await knex('city').where('Id', req.query.id).del();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'TypeORM'){
            const cityRepository = typeorm.getConnection().getRepository(TypeORMCity);
            await cityRepository.delete(req.query.id);
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Bookshelf'){
            await BookshelfCity.where({
                Id: req.query.id
            }).destroy();
            response.message = "Ok";
            response.id = req.query.id;
        }else if (orm == 'Sequelize'){
            await City.destroy({
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

module.exports.getShow = getShow;
module.exports.getCity = getCity;
module.exports.createCity = createCity;
module.exports.editCity = editCity;
module.exports.deleteCity = deleteCity;