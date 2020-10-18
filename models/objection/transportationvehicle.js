  const Type = require('./transportationtype').Transportationtype;

const { Model } = require('objection');

class Transportationvehicle extends Model{
    static get tableName(){
        return 'transportationvehicle';
    }

    static relationMappings = {
        Transportationtype: {
            relation: Model.BelongsToOneRelation,
            modelClass: Type,
            join:{
                from: 'transportationvehicle.TransportationTypeId',
                to: 'transportationtype.Id'
            }
        }
    }
}

module.exports.Transportationvehicle = Transportationvehicle;