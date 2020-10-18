const Station = require('./station.js').Station;
const Route = require('./route.js').Route;
const Transportationvehicle = require('./transportationvehicle').Transportationvehicle;

const { Model } = require('objection');

class Routestation extends Model{
    static get tableName(){
        return 'routestation';
    }

    static get idColumn(){
        return ['StationId', 'RouteId', 'TransportationVehicleId', 'Time']
    }

    static relationMappings = {
        Station: {
            relation: Model.BelongsToOneRelation,
            modelClass: Station,
            join:{
                from: 'routestation.StationId',
                to: 'station.Id'
            }
        },
        Route: {
            relation: Model.BelongsToOneRelation,
            modelClass: Route,
            join:{
                from: 'routestation.RouteId',
                to: 'route.Id'
            }
        },
        Transportationvehicle: {
            relation: Model.BelongsToOneRelation,
            modelClass: Transportationvehicle,
            join:{
                from: 'routestation.TransportationVehicleId',
                to: 'transportationvehicle.Id'
            }
        }
    }
}

module.exports.Routestation = Routestation;