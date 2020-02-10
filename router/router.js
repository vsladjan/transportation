var express = require("express");
var router = express.Router();
var cityController = require("../controllers/cityController.js");
var countryController = require("../controllers/countryController.js");


//City router handler
router.get("/city/show/", function(req, res){
    cityController.getShow(req, res);
});


//Country router handler
router.get("/country/show/", function(req, res){
   countryController.getShow(req, res);
});


//Country router handler
router.get("/country/create/", function(req, res){
    countryController.createCountry(req, res);
 });

module.exports = router;