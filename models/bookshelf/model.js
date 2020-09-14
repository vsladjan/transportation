  
const bshelf = require('../../bookshelf.js');

var bookshelfDb = bshelf.getConnection();
   
// Defining models
const Country = bookshelfDb.Model.extend({
    tableName: 'country',
    cities: function(){
        return this.hasMany(City, 'CountryId', 'Id');
    }
});

const City = bookshelfDb.Model.extend({
    tableName: 'city',
    country: function(){
        return this.belongsTo(Country, 'CountryId', 'Id');
    }
});

const Cityarea = bookshelfDb.Model.extend({
    tableName: 'cityarea',
    city: function(){
        return this.belongsTo(City, 'CityId', 'Id');
    }
});

const Route = bookshelfDb.Model.extend({
    tableName: 'route'
});

const Routestation = bookshelfDb.Model.extend({
    tableName: 'routestation',
    route: function(){
        return this.belongsTo(Route, 'RouteId', 'Id');
    },
    station: function(){
        return this.belongsTo(Station, 'StationId', 'Id');
    },
    transportationvehicle: function(){
        return this.belongsTo(Transportationvehicle, 'TransportationVehicleId', 'Id');
    },
    idAttribute: ['StationId', 'RouteId', 'TransportationVehicleId', 'Time'],
    get idAttribute() { return null }
});

const Station = bookshelfDb.Model.extend({
    tableName: 'station',
    cityarea: function(){
        return this.belongsTo(Cityarea, 'CityAreaId', 'Id');
    }
});

const Transportationtype = bookshelfDb.Model.extend({
    tableName: 'transportationtype'
});

const Transportationvehicle = bookshelfDb.Model.extend({
    tableName: 'transportationvehicle',
    transportationtype: function(){
        return this.belongsTo(Transportationtype, 'TransportationTypeId', 'Id');
    }
});

module.exports.City = City;
module.exports.Country = Country;
module.exports.Cityarea = Cityarea;
module.exports.Route = Route;
module.exports.Routestation = Routestation;
module.exports.Station = Station;
module.exports.Transportationtype = Transportationtype;
module.exports.Transportationvehicle = Transportationvehicle;