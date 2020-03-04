var express = require("express");
var router = express.Router();
var cityController = require("../controllers/cityController.js");
var countryController = require("../controllers/countryController.js");


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


module.exports = router;