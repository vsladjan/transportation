var express = require("express");
var router = express.Router();
var cityController = require("../controllers/cityController.js");
var countryController = require("../controllers/countryController.js");
var cityareaController = require("../controllers/cityareaController.js");
var stationController = require("../controllers/stationController.js");
var transportationtypeController = require("../controllers/transportationtypeController.js");
var transportationvehicleController = require("../controllers/transportationvehicleController.js");
var routeController = require("../controllers/routeController.js");
var routestationController = require("../controllers/routestationController.js");


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

// Transportation type router handler
router.get("/type/show/", function(req, res){
    transportationtypeController.getShow(req, res);
});

// Transportation type get json handler
router.get("/type/get/", function(req, res){
    transportationtypeController.getType(req, res);
});

// Transportation type create router handler
router.get("/type/create/", function(req, res){
    transportationtypeController.createType(req, res);
 });

// Transportation type edit router handler
router.get("/type/edit/", function(req, res){
    transportationtypeController.editType(req, res);
 });
 
// Transportation type delete router handler
router.get("/type/delete/", function(req, res){
    transportationtypeController.deleteType(req, res);
 });

// Transportation vehicle router handler
router.get("/vehicle/show/", function(req, res){
    transportationvehicleController.getShow(req, res);
});

// Transportation vehicle get json handler
router.get("/vehicle/get/", function(req, res){
    transportationvehicleController.getVehicle(req, res);
});

// Transportation vehicle create router handler
router.get("/vehicle/create/", function(req, res){
    transportationvehicleController.createVehicle(req, res);
 });

// Transportation vehicle edit router handler
router.get("/vehicle/edit/", function(req, res){
    transportationvehicleController.editVehicle(req, res);
 });
 
// Transportation vehicle delete router handler
router.get("/vehicle/delete/", function(req, res){
    transportationvehicleController.deleteVehicle(req, res);
 });

 // Route router handler
router.get("/route/show/", function(req, res){
    routeController.getShow(req, res);
});

// Route get json handler
router.get("/route/get/", function(req, res){
    routeController.getRoute(req, res);
});

// Route create router handler
router.get("/route/create/", function(req, res){
    routeController.createRoute(req, res);
 });
 
// Route edit router handler
router.get("/route/edit/", function(req, res){
    routeController.editRoute(req, res);
 });

 // Route delete router handler
router.get("/route/delete/", function(req, res){
    routeController.deleteRoute(req, res);
 });

 // Routestation router handler
router.get("/routestation/show/", function(req, res){
    routestationController.getShow(req, res);
});

// Routestation get json handler
router.get("/routestation/get/", function(req, res){
    routestationController.getRoutestation(req, res);
});

// Routestation create router handler
router.get("/routestation/create/", function(req, res){
    routestationController.createRoutestation(req, res);
 });
 
// Routestation edit router handler
router.get("/routestation/edit/", function(req, res){
    routestationController.editRoutestation(req, res);
 });

 // Routestation delete router handler
router.get("/routestation/delete/", function(req, res){
    routestationController.deleteRoutestation(req, res);
 });



module.exports = router;