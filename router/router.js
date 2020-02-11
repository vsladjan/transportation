var express = require("express");
var router = express.Router();
var cityController = require("../controllers/cityController.js");
var countryController = require("../controllers/countryController.js");


//City router handler
router.get("/city/show/", function(req, res){
    cityController.getShow(req, res);
});


// Country router handler
router.get("/country/show/", function(req, res){
   countryController.getShow(req, res);
});

// Country get one handler
router.get("/country/showOne/", function(req, res){
    countryController.getShowOne(req, res);
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