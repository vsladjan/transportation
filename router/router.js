var express = require("express");
var router = express.Router();
var cityController = require("../controllers/cityController.js");
var countryController = require("../controllers/countryController.js");
var cityareaController = require("../controllers/cityareaController.js");
var stationController = require("../controllers/stationController.js");


//City router handler
router.get("/city/show/", function(req, res){
    cityController.getShow(req, res);
});

// City get json handler
router.get("/city/get/", function(req, res){
    cityController.getCity(req, res);
});

// City create router handler
router.get("/city/create/", function(req, res){
    cityController.createCity(req, res);
 });

// City edit router handler
router.get("/city/edit/", function(req, res){
    cityController.editCity(req, res);
 });
// City delete router handler
router.get("/city/delete/", function(req, res){
    cityController.deleteCity(req, res);
 });

// Country router handler
router.get("/country/show/", function(req, res){
   countryController.getShow(req, res);
});

// Country get json handler
router.get("/country/get/", function(req, res){
    countryController.getCountry(req, res);
});

// Country create router handler
router.get("/country/create/", function(req, res){
    countryController.createCountry(req, res);
 });

 // Country edit router handler
router.get("/country/edit/", function(req, res){
    countryController.editCountry(req, res);
 });

 // Country delete router handler
 router.get("/country/delete/", function(req, res){
    countryController.deleteCountry(req, res);
});

//Cityarea router handler
router.get("/cityarea/show/", function(req, res){
    cityareaController.getShow(req, res);
});

// Cityarea get json handler
router.get("/cityarea/get/", function(req, res){
    cityareaController.getCityarea(req, res);
});

// Cityarea create router handler
router.get("/cityarea/create/", function(req, res){
    cityareaController.createCityarea(req, res);
 });

// Cityarea edit router handler
router.get("/cityarea/edit/", function(req, res){
    cityareaController.editCityarea(req, res);
 });
 
// Cityarea delete router handler
router.get("/cityarea/delete/", function(req, res){
    cityareaController.deleteCityarea(req, res);
 });

 //Station router handler
router.get("/station/show/", function(req, res){
    stationController.getShow(req, res);
});

// Station get json handler
router.get("/station/get/", function(req, res){
    stationController.getStation(req, res);
});

// Station create router handler
router.get("/station/create/", function(req, res){
    stationController.createStation(req, res);
 });

// Station edit router handler
router.get("/station/edit/", function(req, res){
    stationController.editStation(req, res);
 });
 
// Station delete router handler
router.get("/station/delete/", function(req, res){
    stationController.deleteStation(req, res);
 });


module.exports = router;